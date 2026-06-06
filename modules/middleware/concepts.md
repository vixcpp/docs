# Core Concepts

This page explains the model behind `vix::middleware`.

The quick start shows how to install middleware on `vix::App`. This page explains what happens behind that API: how middleware runs, what `next()` means, how a request can be stopped early, how typed request state works, how services are injected, and when to use the lower-level `HttpPipeline`.

The goal is to make the behavior predictable. Middleware is simple when the flow is clear.

## What a middleware is

A middleware is a function that runs around an HTTP handler.

It receives the current request, the current response, and a continuation function called `next`.

```cpp
app.use([](vix::Request &req, vix::Response &res, vix::App::Next next)
{
  (void)res;

  vix::print("request", req.method(), req.path());

  next();
});
```

Calling `next()` means:

```txt
continue to the next middleware or route handler
```

Not calling `next()` means:

```txt
stop the request here
```

This is the central rule of the middleware model.

## The request flow

When several middleware functions are installed, they run in order.

```cpp
app.use(middleware_a);
app.use(middleware_b);
app.use(middleware_c);
```

The flow is:

```txt
request
  -> middleware_a
  -> middleware_b
  -> middleware_c
  -> route handler
  -> response
```

If each middleware calls `next()`, the request eventually reaches the route handler.

A middleware can also run code after `next()` returns.

```cpp
app.use([](vix::Request &req, vix::Response &res, vix::App::Next next)
{
  (void)req;

  next();

  res.header("X-Example", "done");
});
```

This middleware lets the handler run first, then modifies the response.

This pattern is used by middleware such as timing, logging, security headers, compression, and ETag.

## Before and after behavior

Middleware can do work before `next()`:

```cpp
app.use([](vix::Request &req, vix::Response &res, vix::App::Next next)
{
  if (req.header("x-api-key").empty())
  {
    res.status(401).json({
      "error", "missing api key"
    });
    return;
  }

  next();
});
```

It can also do work after `next()`:

```cpp
app.use([](vix::Request &req, vix::Response &res, vix::App::Next next)
{
  (void)req;

  next();

  res.header("X-Content-Type-Options", "nosniff");
});
```

And it can do both:

```cpp
app.use([](vix::Request &req, vix::Response &res, vix::App::Next next)
{
  vix::print("begin", req.path());

  next();

  vix::print("end", res.res.status());
});
```

This explains why order matters. A middleware that does work after `next()` is wrapping everything that runs after it.

## Short-circuiting

Short-circuiting means a middleware sends a response and does not call `next()`.

```cpp
app.use("/admin", [](vix::Request &req, vix::Response &res, vix::App::Next next)
{
  (void)req;

  const bool allowed = false;

  if (!allowed)
  {
    res.status(403).json({
      "error", "forbidden"
    });
    return;
  }

  next();
});
```

In this case, the route handler is never called.

Short-circuiting is normal for:

```txt
CORS preflight
body limit
rate limit
API key authentication
JWT authentication
RBAC authorization
CSRF protection
IP filtering
HTTP cache hits
```

A middleware should short-circuit only when it has enough information to produce the response itself.

## App middleware and module middleware

Core already supports middleware through `vix::App`.

```cpp
app.use([](vix::Request &req, vix::Response &res, vix::App::Next next)
{
  (void)req;
  (void)res;

  next();
});
```

The `vix::middleware` module provides reusable middleware implementations.

```cpp
app.use(vix::middleware::app::cors_dev());
app.use(vix::middleware::app::security_headers_dev());
app.use(vix::middleware::app::rate_limit_dev());
```

The difference is:

```txt
Core middleware
  custom function installed directly on vix::App

vix::middleware
  tested reusable middleware for common HTTP concerns
```

Use Core middleware when you only need one small custom behavior.

Use `vix::middleware` when you need a ready-made component such as CORS, rate limiting, request IDs, JSON parsing, sessions, JWT, or HTTP caching.

## Context-based middleware

Inside the middleware module, the main low-level type is `MiddlewareFn`.

```cpp
using MiddlewareFn = std::function<void(Context &, Next)>;
```

A context-based middleware receives a `Context`.

```cpp
vix::middleware::MiddlewareFn mw =
  [](vix::middleware::Context &ctx, vix::middleware::Next next)
  {
    ctx.res().header("X-Example", "yes");

    next();
  };
```

`Context` gives access to:

```txt
request
response
services
typed state helpers
error helpers
```

The request and response are still the normal Vix HTTP objects. The context simply gives middleware a consistent place to access them.

## Request and response access

A context-based middleware reads the request with `ctx.req()`.

```cpp
auto method = ctx.req().method();
auto path = ctx.req().path();
auto content_type = ctx.req().header("Content-Type");
```

It writes to the response with `ctx.res()`.

```cpp
ctx.res().status(200);
ctx.res().header("X-Example", "ok");
ctx.res().text("OK");
```

Most middleware either reads the request before `next()`, writes the response after `next()`, or does both.

## Typed request state

Middleware often needs to attach data to the request.

For example:

```txt
request_id()
  stores RequestId

timing()
  stores Timing

json()
  stores JsonBody

jwt()
  stores JwtClaims

rbac_context()
  stores Authz

session()
  stores Session

tracing()
  stores TraceContext
```

The handler can read that data from the request.

```cpp
app.use(vix::middleware::app::json_dev());

app.post("/api/echo", [](vix::Request &req, vix::Response &res)
{
  auto &body = req.state<vix::middleware::parsers::JsonBody>();

  res.json({
    "received", body.value
  });
});
```

Typed state avoids stringly-typed maps and manual casts. The value has a real C++ type.

Use `state<T>()` when the value must exist.

```cpp
auto &body = req.state<vix::middleware::parsers::JsonBody>();
```

Use `try_state<T>()` when the value may be missing.

```cpp
if (auto *rid = req.try_state<vix::middleware::basics::RequestId>())
{
  vix::print("request id", rid->value);
}
```

The same pattern is available through `Context`.

```cpp
if (auto *session = ctx.try_state<vix::middleware::auth::Session>())
{
  session->set("seen", "true");
}
```

## State is request-scoped

Request state belongs to one request.

It is not global storage.

It is not shared between users.

It is not a database.

It is useful for data produced while handling one request:

```txt
parsed JSON body
authenticated user claims
authorization context
request id
timing data
trace identifiers
session object loaded for this request
```

For data that must survive across requests, use a real store: session store, cache store, database, file, KV, or another application storage layer.

## Services

Some middleware needs a service object.

A service is an application-provided dependency stored in the middleware services container.

For example, the request logger middleware expects an implementation of `ILogger`.

```cpp
struct RequestLogger : vix::middleware::basics::ILogger
{
  void info(std::string_view msg) override
  {
    vix::log::info("{}", msg);
  }

  void warn(std::string_view msg) override
  {
    vix::log::warn("{}", msg);
  }

  void error(std::string_view msg) override
  {
    vix::log::error("{}", msg);
  }
};
```

This design keeps the middleware generic. The logger middleware knows when to log a request. The application decides where the log line goes.

Services are also useful for:

```txt
recovery logging
rate limiter state
permission resolving
custom session stores
custom metrics sinks
```

## Why services are not global variables

A global variable is simple at first, but it becomes difficult to test and difficult to replace.

Services make the dependency explicit.

A middleware can ask for:

```cpp
ctx.services().get<MyService>();
```

If the service exists, the middleware uses it.

If it does not exist, the middleware can skip optional behavior, use a fallback, or return a configuration error depending on the middleware.

This is why middleware such as logger and recovery can be tested with small in-memory implementations.

## Errors and normalized responses

The middleware module uses a normalized error shape for middleware-generated errors.

A middleware can create an `Error` and send it through `ctx.send_error(...)`.

```cpp
vix::middleware::Error e;
e.status = 401;
e.code = "unauthorized";
e.message = "Missing token";

ctx.send_error(vix::middleware::normalize(std::move(e)));
```

The response is JSON and contains a predictable error structure.

This is used by middleware such as:

```txt
body_limit
api_key
jwt
rbac
csrf
cors
rate_limit
recovery
parsers
session
```

The exact error code depends on the middleware. For example, a missing API key returns a different code from an invalid JSON body.

## Recovery and exceptions

A route handler can throw.

Without recovery middleware, an exception can escape the pipeline.

`recovery()` catches downstream exceptions and turns them into a normalized `500` response.

```cpp
app.use(vix::middleware::app::recovery_dev());

app.get("/boom", [](vix::Request &req, vix::Response &res)
{
  (void)req;
  (void)res;

  throw std::runtime_error("boom");
});
```

In development, recovery can include the exception message.

In production, avoid leaking internal exception details to the client.

## Hooks

The lower-level pipeline supports hooks.

Hooks run at important moments:

```txt
on_begin
on_end
on_error
```

They are used by observability features such as tracing, metrics, and debug traces.

For example, tracing hooks can create a trace id when the request begins, then make sure the trace headers are still present when the response ends.

Most application code does not need to call hooks directly. They are useful when building custom integrations or when using `HttpPipeline` directly.

## Middleware and observability

Observability in this module is split into three concerns.

Tracing gives each request a trace id and span id.

Metrics records counters and durations.

Debug trace writes readable begin, end, and error lines for local inspection.

These features can be installed as middleware or as hooks depending on the use case.

```cpp
vix::middleware::HttpPipeline pipeline;

pipeline.enable_dev_observability();
```

This is useful for low-level pipeline work. For normal applications, prefer the app integration helpers where possible.

## HttpPipeline

`HttpPipeline` is the lower-level pipeline type.

It stores middleware functions, services, and hooks.

```cpp
vix::middleware::HttpPipeline pipeline;

pipeline.use(vix::middleware::basics::request_id());
pipeline.use(vix::middleware::basics::timing());
```

It can run against a request and response without starting a server.

```cpp
pipeline.run(req, res, [](vix::middleware::Request &req,
                          vix::middleware::Response &res)
{
  (void)req;

  res.ok().text("OK");
});
```

This is useful for tests, custom integrations, and advanced applications.

Most users should start with `vix::App`.

## Legacy HTTP middleware

The module keeps a legacy HTTP middleware signature:

```cpp
using HttpMiddleware =
  std::function<void(Request &, Response &, Next)>;
```

This is useful for middleware that works directly with request and response objects.

The module can adapt between the legacy style and the context-based style.

```cpp
auto ctx_mw = vix::middleware::from_http_middleware(http_mw);
```

And the reverse:

```cpp
auto http_mw = vix::middleware::to_http_middleware(ctx_mw, services);
```

This keeps older middleware usable while allowing newer middleware to use `Context`.

## App integration

The `vix::middleware::app` namespace contains helpers for `vix::App`.

It adapts context-based middleware to the app middleware model.

```cpp
app.use(vix::middleware::app::security_headers_dev());
app.use(vix::middleware::app::cors_dev());
app.use(vix::middleware::app::rate_limit_dev());
```

It also provides helpers for protecting exact paths or prefixes.

```cpp
vix::middleware::app::protect_prefix(
  app,
  "/admin",
  vix::middleware::app::api_key_auth("secret")
);
```

Use this namespace when writing normal Vix applications.

## Middleware order

Order is not decoration. It changes what happens.

A middleware that short-circuits should usually run before expensive work.

```txt
rate_limit
  -> body parser
  -> handler
```

A middleware that depends on parsed data must run after the parser.

```txt
json parser
  -> handler reads JsonBody
```

A middleware that depends on authentication must run after authentication.

```txt
jwt
  -> rbac_context
  -> require_role
```

A middleware that modifies the final response often wraps the handler.

```txt
security headers
  -> handler
  -> headers added
```

A good way to reason about order is to ask:

```txt
Does this middleware need to run before the handler?
Does it need to wrap the handler?
Does it need state created by another middleware?
Can it stop the request early?
```

The answers determine where it belongs.

## Common ordering examples

For a JSON API, this is a reasonable starting point:

```txt
recovery
request_id
timing
security_headers
cors
rate_limit
body_limit
json
jwt
rbac_context
require_role / require_perm
handler
```

This is not a universal application template. It is a model for thinking.

CORS may need to run before authentication so browser preflight requests are answered correctly.

Body limits should run before body parsers so large requests are rejected early.

JWT must run before RBAC because RBAC needs JWT claims.

Recovery should wrap middleware and handlers that may throw.

## Relationship with Core

Core owns the application model.

```txt
vix::App
routes
handlers
Request
Response
static files
server lifecycle
```

The middleware module adds reusable behavior around that model.

```txt
security
parsing
authentication
authorization
caching
observability
performance
request metadata
```

This separation is important. Static files are mounted through Core with `app.static_dir(...)`. The middleware module can add an optional static compression hook, but it does not replace the static file API.

## Relationship with JSON

The JSON module is the general-purpose JSON API.

It provides helpers for building, parsing, reading, and writing JSON values.

The middleware JSON parser has a narrower job: it parses the HTTP request body and stores the result as `JsonBody`.

After that, your handler can use normal JSON operations.

```cpp
auto &body = req.state<vix::middleware::parsers::JsonBody>();

res.json({
  "received", body.value
});
```

The parser does not validate your business fields. It only decodes the HTTP body.

## Relationship with Cache

The cache module owns cache storage, cache entries, cache policy, and cache context.

The middleware module provides `http_cache()`, which connects that cache engine to HTTP `GET` requests.

```txt
vix::cache
  cache engine

vix::middleware::http_cache
  HTTP integration
```

This matters because the cache can use memory, LRU memory, file storage, or a custom store. The middleware does not need to know which store is used.

## Relationship with Log

`vix::log` is the application logging module.

The middleware logger is request logging middleware.

It produces a summary of a handled HTTP request: method, path, status, duration, request id, and optional client metadata.

It does not replace `vix::log`. It can forward to `vix::log` through an `ILogger` implementation.

## Relationship with Time

The time module provides reusable time types such as duration, timestamp, system clock, and steady clock.

The middleware module exposes simple time-related behavior:

```txt
request timing
rate limit refill
cache age
metrics duration
periodic tasks
```

Most middleware users do not need to use `vix::time` directly to install these features.

## Development helpers and production configuration

The app integration namespace includes development helpers such as:

```cpp
vix::middleware::app::cors_dev();
vix::middleware::app::rate_limit_dev();
vix::middleware::app::json_dev();
```

They are useful for examples, tests, prototypes, and local development.

Production applications should configure middleware explicitly where the defaults matter.

Examples:

```txt
allowed CORS origins
JWT secret and expected issuer
body size limits
rate limit capacity and refill rate
session store and cookie security
cache policy and storage backend
```

The development helpers are a starting point, not a security policy.

## What this module is not

`vix::middleware` is not an application framework on top of Vix.

It does not own routing.

It does not own static files.

It does not own databases.

It does not own the global logging system.

It does not decide the structure of your application.

It gives you reusable HTTP components that can be installed where they make sense.

## Summary

Middleware runs around HTTP handlers.

`next()` continues the request.

Not calling `next()` stops the request.

Typed request state lets middleware pass parsed or computed data to later middleware and handlers.

Services let middleware use application-provided dependencies without hardcoding global behavior.

`vix::App` is the normal entry point for applications.

`HttpPipeline` is the lower-level entry point for tests and custom integrations.

The rest of the module is built on these ideas.

## Next steps

Continue with:

- [Basics](./basics)
- [Security](./security)
- [Authentication](./authentication)
- [Parsers](./parsers)
- [Performance](./performance)
- [Observability](./observability)
- [App Integration](./app-integration)
