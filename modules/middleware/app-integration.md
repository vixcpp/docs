# App Integration

The `app` integration layer connects the middleware module to `vix::App`.

Most Vix applications start from `vix::App`, not from `HttpPipeline`. The middleware module therefore provides small adapters and helpers that make context-based middleware usable inside the normal Core application model.

For most application code, include:

```cpp id="jfwgqo"
#include <vix.hpp>
#include <vix/middleware.hpp>
```

The App integration helpers live under:

```cpp id="tl5lyf"
namespace vix::middleware::app
```

## What App integration provides

The App integration layer provides helpers for:

```txt id="yfjqls"
adapt()
  adapt legacy HTTP middleware to vix::App middleware

adapt_ctx()
  adapt context-based middleware to vix::App middleware

when()
  run an App middleware only when a predicate matches

protect()
  install middleware on one exact path

protect_prefix()
  install middleware on a path prefix

install()
  install middleware through app.use(prefix, middleware)

chain()
  combine several App middleware functions in order

http_cache()
  create App middleware for HTTP cache

use_http_cache()
  install HTTP cache on an App prefix
```

These helpers are glue code. They do not replace `vix::App`. They make reusable middleware fit naturally into `vix::App`.

## Why App integration exists

Core already has its own middleware model.

```cpp id="1o6mku"
app.use([](vix::Request &req, vix::Response &res, vix::App::Next next)
{
  (void)req;
  (void)res;

  next();
});
```

The middleware module has its own lower-level model.

```cpp id="9qz7r3"
vix::middleware::MiddlewareFn
```

A `MiddlewareFn` receives:

```cpp id="2ty8h8"
vix::middleware::Context &
vix::middleware::Next
```

The App integration layer converts between these models.

```txt id="lrpm84"
vix::middleware::MiddlewareFn
  -> vix::App::Middleware
```

That lets application code keep using the normal `app.use(...)` API.

## The normal path

In a normal Vix application, you use `vix::App`.

```cpp id="uv8ijq"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.get("/", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.text("home");
  });

  app.run(8080);

  return 0;
}
```

Then you add middleware through `app.use(...)`.

```cpp id="2bfv1d"
app.use(vix::middleware::app::adapt_ctx(
  vix::middleware::basics::request_id()
));
```

The route handler remains a normal Core handler.

## adapt_ctx

`adapt_ctx()` converts a context-based middleware into `vix::App::Middleware`.

This is the most common adapter for middleware functions that return `MiddlewareFn`.

```cpp id="wqrhbd"
auto app_mw = vix::middleware::app::adapt_ctx(
  vix::middleware::basics::request_id()
);

app.use(app_mw);
```

The context-based middleware receives a `Context`. The adapter creates that context from the current `Request`, `Response`, and service container used by the adapter.

## Use adapt_ctx with a parser

```cpp id="m7lzok"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::adapt_ctx(
    vix::middleware::parsers::json()
  ));

  app.post("/api/echo", [](vix::Request &req, vix::Response &res)
  {
    auto &body =
      req.state<vix::middleware::parsers::JsonBody>();

    res.json({
      "received", body.value
    });
  });

  app.run(8080);

  return 0;
}
```

The JSON parser is written as a context-based middleware. `adapt_ctx()` makes it usable with `app.use(...)`.

## adapt

`adapt()` converts a legacy HTTP middleware into `vix::App::Middleware`.

A legacy HTTP middleware has this shape:

```cpp id="id7m7f"
vix::middleware::HttpMiddleware
```

It receives:

```cpp id="mhfbs7"
Request &
Response &
Next
```

Example:

```cpp id="7ikp1k"
auto cache_mw =
  vix::middleware::http_cache(cache);

app.use(vix::middleware::app::adapt(cache_mw));
```

Use `adapt()` when the middleware already works directly with request and response objects.

Use `adapt_ctx()` when the middleware expects `Context`.

## when

`when()` applies an App middleware only when a predicate matches the request.

```cpp id="hlx472"
auto only_api = vix::middleware::app::when(
  [](const vix::Request &req)
  {
    return req.path().rfind("/api", 0) == 0;
  },
  vix::middleware::app::adapt_ctx(
    vix::middleware::basics::request_id()
  )
);

app.use(only_api);
```

If the predicate returns `false`, the middleware is skipped and the request continues.

This is useful when one middleware should apply only to part of the application.

## protect

`protect()` installs middleware for one exact path.

```cpp id="6po44q"
vix::middleware::app::protect(
  app,
  "/admin",
  vix::middleware::app::adapt_ctx(
    vix::middleware::auth::api_key({
      .allowed_keys = {"secret"}
    })
  )
);
```

This middleware applies to:

```txt id="6h32w9"
/admin
```

It does not apply to:

```txt id="wryeww"
/admin/users
/admin/settings
```

Use exact protection when only one route should be guarded.

## protect_prefix

`protect_prefix()` installs middleware for every path that starts with a prefix.

```cpp id="b4u99r"
vix::middleware::auth::ApiKeyOptions opt;

opt.allowed_keys.insert("secret");

vix::middleware::app::protect_prefix(
  app,
  "/admin",
  vix::middleware::app::adapt_ctx(
    vix::middleware::auth::api_key(opt)
  )
);
```

This applies to:

```txt id="ztszw2"
/admin
/admin/users
/admin/settings
```

Prefix protection is useful for route groups, admin areas, API namespaces, and private sections.

## install

`install()` is a small wrapper around `app.use(prefix, middleware)`.

```cpp id="g4d1ct"
vix::middleware::app::install(
  app,
  "/api",
  vix::middleware::app::adapt_ctx(
    vix::middleware::basics::request_id()
  )
);
```

It is mainly useful when you want a consistent middleware installation API inside helper functions.

## install_exact

`install_exact()` is an alias-style helper for exact path installation.

```cpp id="s6h2og"
vix::middleware::app::install_exact(
  app,
  "/internal/status",
  vix::middleware::app::adapt_ctx(
    vix::middleware::security::ip_filter({})
  )
);
```

Use it when the name reads better in the code you are writing.

## chain

`chain()` combines multiple App middleware functions into one middleware.

```cpp id="39qo2u"
auto api_stack = vix::middleware::app::chain({
  vix::middleware::app::adapt_ctx(
    vix::middleware::basics::request_id()
  ),
  vix::middleware::app::adapt_ctx(
    vix::middleware::basics::timing()
  )
});

app.use("/api", api_stack);
```

The middleware functions run in the order given.

```txt id="m7yb41"
request_id
  -> timing
  -> next middleware or handler
```

Use `chain()` when a group of middleware should always be installed together.

## Chain two or three middleware functions

There are convenience overloads for two or three middleware functions.

```cpp id="2omqe8"
auto stack = vix::middleware::app::chain(
  vix::middleware::app::adapt_ctx(
    vix::middleware::basics::request_id()
  ),
  vix::middleware::app::adapt_ctx(
    vix::middleware::basics::timing()
  )
);

app.use(stack);
```

For larger stacks, use the vector form.

## App middleware order

App middleware order follows the same rule as normal middleware order.

```cpp id="1tw2fb"
app.use(middleware_a);
app.use(middleware_b);
app.use(middleware_c);
```

The request runs through them in order.

```txt id="p6k3zp"
middleware_a
  -> middleware_b
  -> middleware_c
  -> handler
```

If a middleware does not call `next()`, the request stops there.

This is how authentication, rate limiting, body limits, CORS preflight, and cache hits can stop a request before the handler.

## Simple API stack

A practical API stack can be installed on `/api`.

```cpp id="4r528o"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  auto api_stack = vix::middleware::app::chain({
    vix::middleware::app::adapt_ctx(
      vix::middleware::basics::request_id()
    ),
    vix::middleware::app::adapt_ctx(
      vix::middleware::basics::timing()
    ),
    vix::middleware::app::adapt_ctx(
      vix::middleware::security::headers()
    )
  });

  app.use("/api", api_stack);

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

This example shows installation. It is not a universal production stack.

## HTTP cache App integration

The HTTP cache integration is available through:

```cpp id="1bdv9w"
vix::middleware::app::http_cache()
```

and:

```cpp id="5ccg5c"
vix::middleware::app::use_http_cache()
```

`http_cache()` returns an App middleware.

`use_http_cache()` installs it on an App prefix.

## Use HTTP cache as App middleware

```cpp id="jza23f"
#include <memory>

#include <vix.hpp>
#include <vix/middleware.hpp>
#include <vix/cache.hpp>

int main()
{
  vix::App app;

  vix::middleware::app::HttpCacheConfig cfg;

  cfg.ttl_ms = 30'000;
  cfg.prefix = "/api/";

  app.use("/api", vix::middleware::app::http_cache(cfg));

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

This installs HTTP caching for matching `GET` requests.

## Install HTTP cache with use_http_cache

```cpp id="4jmlob"
vix::middleware::app::HttpCacheConfig cfg;

cfg.prefix = "/api/";
cfg.ttl_ms = 30'000;

vix::middleware::app::use_http_cache(app, cfg);
```

This helper reads `cfg.prefix` and calls the App installation path internally.

Use this when you want the config object to carry the route prefix.

## HttpCacheConfig

`HttpCacheConfig` controls the App-level cache integration.

```cpp id="e44ki7"
vix::middleware::app::HttpCacheConfig cfg;

cfg.prefix = "/api/";
cfg.only_get = true;
cfg.ttl_ms = 30'000;
cfg.allow_bypass = true;
cfg.bypass_header = "x-vix-cache";
cfg.bypass_value = "bypass";
cfg.vary_headers = {"Accept"};
```

Main fields:

```txt id="x63uxw"
prefix
  prefix used when installing with use_http_cache()

only_get
  restrict cache middleware to GET requests

ttl_ms
  TTL used when the helper creates a default cache

allow_bypass
  allow bypass through a request header

bypass_header
  header used to bypass cache

bypass_value
  value required to bypass cache

vary_headers
  request headers included in the cache key

cache
  custom shared cache instance
```

If `cache` is not provided, the helper creates an in-memory cache from `ttl_ms`.

For serious applications, create the `vix::cache::Cache` explicitly so the store and policy are visible in your code.

## Custom cache with App integration

```cpp id="x1g2kl"
auto store =
  std::make_shared<vix::cache::MemoryStore>();

vix::cache::CachePolicy policy;
policy.ttl_ms = 30'000;

auto cache =
  std::make_shared<vix::cache::Cache>(policy, store);

vix::middleware::app::HttpCacheConfig cfg;
cfg.cache = cache;
cfg.vary_headers = {"Accept"};

app.use("/api", vix::middleware::app::http_cache(cfg));
```

The middleware integration stays the same whether the store is memory, LRU memory, file-backed, or custom.

## Static files and App integration

Static files belong to Core.

Use:

```cpp id="elt16h"
app.static_dir("public", "/");
```

The middleware module does not replace this API.

The performance module can register an optional static response hook for compression, but the file serving itself remains a Core feature.

## Static compression hook

To enable the middleware static compression hook:

```cpp id="wzcjoe"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::middleware::register_static_dir();

  vix::App app;

  app.static_dir("public", "/");

  app.run(8080);

  return 0;
}
```

This keeps the architecture clean.

```txt id="qfgya8"
vix::App
  owns static file serving

vix::middleware::performance
  can optimize static responses
```

Do not use the middleware module as the primary API for serving files.

## Context state with App

When a context-based middleware is adapted into App middleware, it can still store typed state on the request.

For example, `request_id()` stores:

```cpp id="lbk0uz"
vix::middleware::basics::RequestId
```

A normal App handler can read it:

```cpp id="cw5zae"
app.get("/", [](vix::Request &req, vix::Response &res)
{
  auto *rid =
    req.try_state<vix::middleware::basics::RequestId>();

  res.json({
    "request_id", rid ? rid->value : ""
  });
});
```

This is why the middleware module can stay modular without forcing handlers to use a different request type.

## App handlers remain normal

Middleware integration does not change handler style.

Handlers still use:

```cpp id="q5fmyn"
vix::Request &
vix::Response &
```

Example:

```cpp id="df8dr1"
app.get("/api/status", [](vix::Request &req, vix::Response &res)
{
  (void)req;

  res.json({
    "status", "ok"
  });
});
```

The middleware runs around the handler. The handler remains a Core handler.

## Prefix middleware and route groups

Prefix middleware is useful with route groups.

```cpp id="w2sfie"
app.use("/api", vix::middleware::app::adapt_ctx(
  vix::middleware::basics::request_id()
));

app.group("/api", [](auto &api)
{
  api.get("/status", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.json({
      "status", "ok"
    });
  });
});
```

The route becomes:

```txt id="z8hyco"
GET /api/status
```

The middleware applies because the request path starts with `/api`.

## Protecting an admin prefix

```cpp id="vnsu9j"
vix::middleware::auth::ApiKeyOptions opt;

opt.allowed_keys.insert("secret");

vix::middleware::app::protect_prefix(
  app,
  "/admin",
  vix::middleware::app::adapt_ctx(
    vix::middleware::auth::api_key(opt)
  )
);

app.get("/admin/status", [](vix::Request &req, vix::Response &res)
{
  (void)req;

  res.json({
    "admin", true
  });
});
```

Request:

```bash id="rxnmis"
curl -i \
  http://127.0.0.1:8080/admin/status \
  -H "x-api-key: secret"
```

The middleware is installed once and applies to all `/admin` routes.

## Route-specific parsing

Do not install incompatible parsers globally.

For example, if only `/api` accepts JSON:

```cpp id="bt589o"
app.use("/api", vix::middleware::app::adapt_ctx(
  vix::middleware::parsers::json()
));
```

If only `/upload` accepts multipart uploads:

```cpp id="oo9z7v"
app.use("/upload", vix::middleware::app::adapt_ctx(
  vix::middleware::parsers::multipart_save({
    .upload_dir = "uploads"
  })
));
```

This avoids forcing every request through every parser.

## App integration and services

`HttpPipeline` exposes a shared `Services` container directly.

`adapt_ctx()` creates a context for App middleware. For simple middleware, that is enough.

For middleware that needs application-provided services, such as a custom logger, permission resolver, or shared rate limiter state, prefer one of these approaches:

```txt id="eyhbjb"
use HttpPipeline when you need explicit service injection

write a small App middleware that owns the dependency

wrap the middleware in an application helper that captures the dependency
```

This keeps dependency ownership clear.

For example, a request logger should know where its `ILogger` implementation comes from. Do not hide production dependencies inside global variables.

## When to use HttpPipeline instead

Use `HttpPipeline` when you need:

```txt id="dabt6u"
direct access to Services
direct access to Hooks
middleware testing without starting a server
custom integrations outside vix::App
pipeline-level observability
fine-grained control over middleware execution
```

Use `vix::App` when you are building a normal HTTP application.

The App integration layer exists so most applications do not need to start from `HttpPipeline`.

## Development helpers

Some applications may expose convenience helpers or presets around the lower-level middleware.

These helpers are useful for examples and local development.

Still, the underlying model remains the same:

```txt id="shk98n"
middleware function
  -> adapted to vix::App middleware
  -> installed with app.use(...)
```

For production, prefer explicit options where security, authentication, cache, or upload behavior matters.

## Common order in App

A simple public API stack can follow this shape:

```txt id="opmzz1"
recovery
request_id
timing
security headers
cors
rate limit
body limit
parser
handler
```

For authenticated APIs:

```txt id="29op7k"
recovery
request_id
timing
cors
rate limit
body limit
json
jwt
rbac_context
permission guard
handler
```

For cacheable public GET APIs:

```txt id="y6xrxm"
recovery
request_id
cors
rate limit
http_cache
handler
etag
compression
```

These are not universal templates. They are examples of how to reason about middleware order.

## App integration rules

A few rules keep the application predictable.

Install middleware only where it applies.

Use prefixes for API areas, admin areas, upload routes, and public routes.

Keep static files on `app.static_dir(...)`.

Use `adapt_ctx()` for context-based middleware.

Use `adapt()` for legacy HTTP middleware.

Use `chain()` when a stack should stay together.

Use explicit options for production behavior.

## What App integration does not do

The App integration layer does not define routes.

It does not replace `vix::App`.

It does not serve static files.

It does not decide your security policy.

It does not create a full application architecture.

It only bridges middleware components into the Core app model.

## Summary

`vix::middleware::app` is the bridge between reusable middleware and `vix::App`.

Use `adapt_ctx()` for middleware that receives `Context`.

Use `adapt()` for middleware that receives `Request`, `Response`, and `Next`.

Use `protect()` and `protect_prefix()` to install middleware only where it belongs.

Use `chain()` to keep related App middleware together.

Use HTTP cache helpers when connecting `vix::cache` to App routes.

Keep Core as the owner of routes, handlers, static files, and server lifecycle. Middleware adds behavior around that Core model.

## Next steps

Continue with:

- [API Reference](./api-reference)
- [HTTP Cache](./http-cache)
- [Performance](./performance)
- [Core Concepts](./concepts)
