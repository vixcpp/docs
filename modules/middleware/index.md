# Middleware

`vix::middleware` provides ready-to-use HTTP middleware for Vix applications.

The module is built for the common work that usually surrounds HTTP handlers: request identifiers, timing, recovery, body limits, CORS, security headers, rate limiting, authentication, body parsing, sessions, HTTP caching, compression, ETags, tracing, metrics, and debug traces.

It does not replace `vix::App`. The application model, routing, handlers, static files, request objects, and response objects are still owned by Core. The middleware module adds reusable pieces that can run around those handlers.

A middleware can do three things:

```txt
inspect the request
modify the response
decide whether the request should continue
```

For example, a CORS middleware can answer a preflight request before the route handler is reached. A JSON parser can read the request body and store the parsed value in request state. A security headers middleware can wait until the handler finishes, then add browser hardening headers to the response.

## Public header

For normal application code, include:

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>
```

`<vix.hpp>` gives access to `vix::App`, `vix::Request`, and `vix::Response`.

`<vix/middleware.hpp>` gives access to the middleware module.

The module also has internal and lower-level headers, but application code should normally use the public header.

## Basic usage

Most applications install middleware on a `vix::App`.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::security_headers_dev());

  app.get("/", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.text("Hello from Vix");
  });

  app.run(8080);

  return 0;
}
```

The middleware runs before or after the route handler depending on how it is written.

Some middleware runs before the handler and may stop the request early. Authentication, body limit, rate limit, CORS preflight, CSRF, and IP filtering work this way.

Some middleware calls the handler first, then modifies the response. Timing, logging, compression, ETag, and security headers usually work this way.

## A simple request flow

A request handled by Vix can pass through several middleware functions before reaching the route handler.

```txt
request
  -> middleware 1
  -> middleware 2
  -> middleware 3
  -> route handler
  -> response
```

Each middleware receives a `next` function. Calling `next()` continues the request.

```cpp
app.use([](vix::Request &req, vix::Response &res, vix::App::Next next)
{
  (void)res;

  vix::print("request", req.method(), req.path());

  next();
});
```

If a middleware sends a response and does not call `next()`, the rest of the chain is skipped.

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

This is called short-circuiting. It is how middleware blocks invalid or unauthorized requests.

## What the module provides

The middleware module is organized by responsibility.

`basics` contains middleware that most HTTP applications need early: request IDs, timing, recovery, logging, and body size limits.

`security` contains browser and request protection middleware: CORS, CSRF, security headers, IP filtering, and rate limiting.

`auth` contains authentication and authorization helpers: API key authentication, JWT authentication, RBAC, permissions, and sessions.

`parsers` contains request body parsers for JSON, URL-encoded forms, multipart metadata, and multipart file uploads.

`performance` contains response-oriented middleware such as compression, ETag generation, and static response compression hooks.

`observability` contains tracing, metrics, and debug traces.

`http` contains HTTP helpers such as cookies.

`app` contains adapters and presets for installing middleware directly on `vix::App`.

## Common middleware groups

A small API server may start with a setup like this:

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::security_headers_dev());
  app.use(vix::middleware::app::cors_dev());
  app.use(vix::middleware::app::rate_limit_dev());

  app.get("/api/status", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.json({
      "status", "ok"
    });
  });

  app.run(8080);

  return 0;
}
```

This example is intentionally small. Real applications choose middleware based on the routes they expose and the kind of clients they serve.

## Request state

Some middleware stores typed data on the request so later middleware or handlers can read it.

For example, the JSON parser stores a parsed `JsonBody`.

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

This pattern is used throughout the module.

Common request state values include:

```txt
RequestId
Timing
JsonBody
FormBody
MultipartInfo
MultipartForm
ApiKey
JwtClaims
Authz
Session
TraceContext
```

The important idea is simple: middleware can enrich the request before the handler receives it.

## Services

Some middleware needs an external service.

For example, the request logger middleware does not write directly to `stdout` or own the global Vix logging system. It expects an `ILogger` service. That service can forward log lines to `vix::log`, to a test collector, or to another logging backend.

This keeps the middleware small and testable.

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

The middleware module provides the hook points. The application decides which concrete service implementation to install.

## Middleware order matters

Middleware order is part of the behavior.

A middleware that checks something before `next()` should usually be placed before the handlers it protects.

```cpp
app.use("/api", vix::middleware::app::rate_limit_dev());
```

A middleware that reads state produced by another middleware must be placed after that state is created, or must wrap the middleware that creates it.

For authentication and authorization, the order is especially important:

```txt
jwt
  -> rbac_context
  -> require_role / require_perm
  -> handler
```

The JWT middleware authenticates the token and stores claims. The RBAC middleware builds an authorization context from those claims. The role and permission middleware then uses that authorization context to decide whether the request can continue.

## Basics

The basics group contains the middleware that is useful in many applications.

`request_id()` creates or accepts an `x-request-id`, stores it in request state, and writes it back to the response.

`timing()` measures how long downstream middleware and handlers take to run. It can write `x-response-time` and `server-timing`.

`recovery()` catches exceptions from downstream middleware or handlers and turns them into a normalized `500` response.

`body_limit()` rejects requests whose body is larger than the configured limit.

`logger()` writes one request summary line after the request has been handled. It is a request logging middleware, not a replacement for the `vix::log` module.

## Security

The security group contains middleware for common HTTP protection.

`cors()` handles CORS preflight requests and adds CORS headers to normal responses.

`csrf()` implements double-submit cookie protection for unsafe methods.

`headers()` adds browser security headers such as `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, optional CSP, and optional HSTS.

`ip_filter()` allows or denies requests based on the client IP extracted from headers such as `x-forwarded-for`.

`rate_limit()` uses a token bucket per client key and returns `429` when the request limit is exceeded.

## Authentication and sessions

The authentication group provides small building blocks.

`api_key()` checks a key from a header or query parameter and stores the accepted key in request state.

`jwt()` validates a Bearer JWT and stores the claims in request state.

`rbac_context()` builds an authorization context from JWT claims.

`require_role()`, `require_perm()`, and related helpers enforce authorization rules.

`session()` loads or creates a signed cookie session, exposes it in request state, and persists changes after the handler runs.

The session middleware signs the session id. The session data itself is stored in a session store. The default in-memory store is useful for development, tests, and simple local use. Applications that need durable or shared sessions should provide their own store.

## Parsers

The parser middleware reads request bodies and stores parsed data in request state.

`json()` parses an `application/json` body and stores `JsonBody`.

`form()` parses an `application/x-www-form-urlencoded` body and stores `FormBody`.

`multipart()` validates multipart metadata and stores `MultipartInfo`.

`multipart_save()` parses multipart form data, saves uploaded files, and stores `MultipartForm`.

The parsers are intentionally separate from validation. They decode the request body. The application still decides which fields are required and what values are valid.

## Performance

The performance group works mostly on responses.

`etag()` computes an ETag from the response body. If the request contains a matching `If-None-Match`, the middleware can turn the response into `304 Not Modified`.

`compression()` compresses eligible responses when the client accepts a supported encoding and the build has the required compression support enabled.

`static_compression()` provides a hook for compressing static file responses served by `vix::App`.

Static files are still configured through Core:

```cpp
app.static_dir("public", "/");
```

The middleware module only provides optional integration hooks around that behavior.

## HTTP cache

`http_cache()` caches HTTP `GET` responses by using the `vix::cache` module.

The middleware builds a deterministic cache key from the request method, path, query string, and optional vary headers. On a cache hit, it replays the stored response. On a miss, it calls the next handler and stores the response when it is cacheable.

A simple cache setup can use `MemoryStore`.

```cpp
auto store = std::make_shared<vix::cache::MemoryStore>();

vix::cache::CachePolicy policy;
policy.ttl_ms = 30'000;

auto cache = std::make_shared<vix::cache::Cache>(policy, store);

vix::middleware::HttpCacheOptions options;
options.vary_headers = {"Accept"};

app.use("/api", vix::middleware::app::http_cache({
  .cache = cache,
  .vary_headers = {"Accept"}
}));
```

The cache engine belongs to `vix::cache`. The middleware only connects that cache to HTTP requests and responses.

## Observability

The observability group helps inspect what the application is doing.

`tracing` creates trace and span identifiers, stores them in request state, and emits trace headers.

`metrics` records request counters, response counters, duration observations, and exception counters through a metrics sink.

`debug_trace` writes readable begin, end, and error lines for local inspection.

The pipeline can also enable development observability when `VIX_ENV` is set to `dev`, `development`, or `local`.

```cpp
vix::middleware::HttpPipeline pipeline;

pipeline.enable_dev_observability();
```

This is more useful for lower-level pipeline usage and tests. In normal applications, prefer the `vix::App` integration helpers unless you need direct control.

## App integration

The `vix::middleware::app` namespace contains helpers that adapt middleware to `vix::App`.

Use these helpers when installing middleware on an application:

```cpp
app.use(vix::middleware::app::cors_dev());
app.use(vix::middleware::app::security_headers_dev());
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

The purpose of these helpers is not to hide the middleware system. They make the common `vix::App` usage shorter and easier to read.

## Advanced pipeline usage

`HttpPipeline` is the lower-level pipeline API.

It is useful for tests, custom integrations, and situations where you want to run middleware outside the normal `vix::App` flow.

```cpp
vix::middleware::HttpPipeline pipeline;

pipeline.use(vix::middleware::basics::request_id());
pipeline.use(vix::middleware::basics::timing());

pipeline.run(req, res, [](vix::middleware::Request &req,
                          vix::middleware::Response &res)
{
  (void)req;

  res.ok().text("OK");
});
```

Most application code should start with `vix::App`. Use `HttpPipeline` when you need the lower-level control.

## Relationship with other modules

`vix::middleware` is designed to work with other Vix modules, not replace them.

Core owns the application, routing, request and response model.

JSON provides normal JSON helpers and is also used by JSON parsers and responses.

Cache provides the storage and policy engine used by HTTP cache middleware.

Log provides application logging. The middleware logger can forward request log lines to it.

Time provides reusable time primitives. Middleware exposes simple options for request timing, cache age, rate limiting, and metrics.

This separation keeps each module focused. Middleware connects these capabilities around HTTP requests without turning into a full application framework.

## When to use this module

Use `vix::middleware` when you want ready-made HTTP behavior that would otherwise be repeated in every application.

It is useful for APIs, dashboards, internal tools, services, local applications, and web backends that need a clean request pipeline.

Use Core middleware directly when you only need one small custom function.

Use the middleware module when you need reusable, tested components for common HTTP concerns.

## Next steps

Continue with:

- [Quick Start](./quick-start)
- [Core Concepts](./concepts)
- [Basics](./basics)
- [Security](./security)
- [Authentication](./authentication)
- [Parsers](./parsers)
- [Performance](./performance)
- [Observability](./observability)
- [HTTP Cache](./http-cache)
- [App Integration](./app-integration)
- [API Reference](./api-reference)
