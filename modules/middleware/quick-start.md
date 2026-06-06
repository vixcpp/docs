# Middleware Quick Start

This page shows the fastest way to use `vix::middleware` in a Vix application.

The goal is not to configure every middleware at once. The goal is to understand the normal workflow: include the module, install middleware on an app, let middleware protect or enrich requests, and read the data it stores when needed.

For most application code, include:

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>
```

`vix::App` still owns the HTTP application. The middleware module provides reusable pieces that run around the routes.

## Start with a normal Vix app

A Vix application starts with `vix::App`.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.get("/", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.text("Hello from Vix");
  });

  app.run(8080);

  return 0;
}
```

Middleware is added with `app.use(...)`.

```cpp
app.use(vix::middleware::app::security_headers_dev());
```

The middleware will run for incoming requests before the response is sent.

## Add security headers

Security headers are a good first middleware because they do not change how routes are written.

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

    res.text("home");
  });

  app.run(8080);

  return 0;
}
```

The route still returns the same body, but the response can also include headers such as:

```txt
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Permissions-Policy
```

This kind of middleware usually calls the route handler first, then adds headers to the outgoing response.

## Add CORS

Use CORS middleware when a browser application needs to call your API from another origin.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::cors_dev());

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

CORS middleware can handle preflight `OPTIONS` requests before they reach your route handler. For normal requests, it can add the required CORS headers after the handler runs.

For production, configure allowed origins explicitly instead of using a permissive development setup.

## Limit request body size

`body_limit()` protects routes from bodies that are too large.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::body_limit_dev());

  app.post("/upload", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.json({
      "ok", true
    });
  });

  app.run(8080);

  return 0;
}
```

If the request body is larger than the configured limit, the middleware can stop the request and return an error before the handler runs.

This is useful before JSON, form, or multipart parsing.

## Parse JSON bodies

The JSON parser middleware reads the request body and stores a parsed value in request state.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::json_dev());

  app.post("/api/echo", [](vix::Request &req, vix::Response &res)
  {
    auto &body = req.state<vix::middleware::parsers::JsonBody>();

    res.json({
      "received", body.value
    });
  });

  app.run(8080);

  return 0;
}
```

Request:

```bash
curl -i \
  -X POST http://127.0.0.1:8080/api/echo \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada"}'
```

Response shape:

```json
{
  "received": {
    "name": "Ada"
  }
}
```

The parser only parses the body. It does not decide which fields your application requires. Validation remains part of your handler or validation layer.

## Parse form bodies

Use the form parser for `application/x-www-form-urlencoded` requests.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::form_dev());

  app.post("/contact", [](vix::Request &req, vix::Response &res)
  {
    auto &form = req.state<vix::middleware::parsers::FormBody>();

    res.json({
      "name", form.fields["name"]
    });
  });

  app.run(8080);

  return 0;
}
```

Request:

```bash
curl -i \
  -X POST http://127.0.0.1:8080/contact \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=Ada'
```

Response shape:

```json
{
  "name": "Ada"
}
```

## Add rate limiting

Rate limiting protects an endpoint from too many requests from the same client key.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use("/api", vix::middleware::app::rate_limit_dev());

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

If the limit is exceeded, the middleware returns `429 Too Many Requests`.

The response can include headers such as:

```txt
X-RateLimit-Limit
X-RateLimit-Remaining
Retry-After
```

The default key usually comes from headers such as `x-forwarded-for`. In real deployments behind a proxy, make sure those headers are set by infrastructure you trust.

## Protect a route with an API key

API key middleware checks a key from a header or query parameter.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  vix::middleware::app::protect_prefix(
    app,
    "/admin",
    vix::middleware::app::api_key_auth("secret")
  );

  app.get("/admin/status", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.json({
      "admin", true
    });
  });

  app.run(8080);

  return 0;
}
```

Request:

```bash
curl -i \
  http://127.0.0.1:8080/admin/status \
  -H "x-api-key: secret"
```

If the key is missing, the middleware returns `401`.

If the key is present but invalid, it returns `403`.

## Use JWT authentication

JWT middleware validates a Bearer token and stores the claims in request state.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use("/api", vix::middleware::app::jwt_auth("dev_secret"));

  app.get("/api/me", [](vix::Request &req, vix::Response &res)
  {
    auto &claims = req.state<vix::middleware::auth::JwtClaims>();

    res.json({
      "subject", claims.subject
    });
  });

  app.run(8080);

  return 0;
}
```

Request shape:

```bash
curl -i \
  http://127.0.0.1:8080/api/me \
  -H "Authorization: Bearer <token>"
```

The middleware expects a Bearer token. If the token is missing or invalid, the request does not reach the handler.

## Use sessions

Session middleware loads or creates a signed cookie session and stores it in request state.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::session_dev("dev_secret"));

  app.get("/counter", [](vix::Request &req, vix::Response &res)
  {
    auto &session = req.state<vix::middleware::auth::Session>();

    int count = 0;

    if (auto value = session.get("count"))
      count = std::stoi(*value);

    ++count;
    session.set("count", std::to_string(count));

    res.json({
      "count", count
    });
  });

  app.run(8080);

  return 0;
}
```

The session id is stored in a signed cookie. The session data is stored in a session store.

The development helper is useful for local use and examples. Applications that need durable sessions or shared sessions should provide a store that matches their deployment.

## Add request IDs and timing

Request IDs and timing are useful when debugging and observing requests.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::request_id_dev());
  app.use(vix::middleware::app::timing_dev());

  app.get("/", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.text("OK");
  });

  app.run(8080);

  return 0;
}
```

The response can include:

```txt
x-request-id
x-response-time
server-timing
```

The same values can also be stored in request state for middleware or handlers that need them.

## Cache GET responses

The HTTP cache middleware uses `vix::cache` to cache `GET` responses.

```cpp
#include <memory>

#include <vix.hpp>
#include <vix/middleware.hpp>
#include <vix/cache.hpp>

int main()
{
  vix::App app;

  auto store = std::make_shared<vix::cache::MemoryStore>();

  vix::cache::CachePolicy policy;
  policy.ttl_ms = 30'000;

  auto cache = std::make_shared<vix::cache::Cache>(policy, store);

  app.use("/api", vix::middleware::app::http_cache({
    .cache = cache
  }));

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

On a cache hit, the middleware returns the stored response without calling the handler.

On a miss, it calls the handler and stores the response if it is cacheable.

The cache engine is provided by `vix::cache`. The middleware only connects it to HTTP requests and responses.

## Add ETag support

ETag middleware can mark a response with an `ETag` header.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::etag_dev());

  app.get("/api/version", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.json({
      "version", "1.0.0"
    });
  });

  app.run(8080);

  return 0;
}
```

If the client later sends a matching `If-None-Match` header, the middleware can return `304 Not Modified`.

## Use middleware only for a prefix

Use prefix middleware when only part of the application needs a behavior.

```cpp
app.use("/api", vix::middleware::app::rate_limit_dev());
app.use("/admin", vix::middleware::app::api_key_auth("secret"));
```

This keeps public pages, APIs, admin routes, and internal endpoints separate.

For exact route protection, use:

```cpp
vix::middleware::app::protect(
  app,
  "/admin/status",
  vix::middleware::app::api_key_auth("secret")
);
```

For path prefix protection, use:

```cpp
vix::middleware::app::protect_prefix(
  app,
  "/admin",
  vix::middleware::app::api_key_auth("secret")
);
```

## Middleware order

Order changes behavior.

A good starting order is:

```txt
recovery
request id
timing
security headers
cors
rate limit
body limit
parsers
authentication
authorization
handler
response middleware
```

Do not treat this as a universal rule. It is a starting point.

For example, CORS often needs to run early because preflight requests should be answered before authentication. Body limits should run before body parsers. JWT must run before RBAC. A logger that reads request timing must be placed so it can see the timing value after downstream middleware finishes.

The important rule is to think about dependencies:

```txt
If middleware B needs state from middleware A,
A must run before B stores or exposes that state.
```

## Advanced pipeline usage

Most applications should install middleware on `vix::App`.

`HttpPipeline` is available when you need lower-level control, tests, or a custom integration.

```cpp
#include <vix/middleware.hpp>

int main()
{
  vix::middleware::HttpPipeline pipeline;

  pipeline.use(vix::middleware::basics::request_id());
  pipeline.use(vix::middleware::basics::timing());

  return 0;
}
```

The pipeline API is also useful for unit tests because it can run middleware without starting an HTTP server.

## What to remember

`vix::middleware` is not a second application framework.

Core owns the app, routes, request, response, static files, and server lifecycle.

The middleware module provides reusable HTTP behavior around those routes.

Use `vix::App` for normal application code. Use the middleware module when you need tested building blocks for request protection, parsing, authentication, caching, performance, and observability.

## Next steps

Continue with:

- [Core Concepts](./concepts)
- [Basics](./basics)
- [Security](./security)
- [Authentication](./authentication)
- [Parsers](./parsers)
- [Performance](./performance)
- [Observability](./observability)
- [HTTP Cache](./http-cache)
- [App Integration](./app-integration)
