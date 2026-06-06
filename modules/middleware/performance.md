# Performance

The `performance` group contains middleware for response optimization.

It provides response compression, ETag generation, and optional compression hooks for static file responses served by `vix::App`.

For most application code, include:

```cpp id="t9xgqm"
#include <vix.hpp>
#include <vix/middleware.hpp>
```

The performance middleware lives under:

```cpp id="3q5nrt"
namespace vix::middleware::performance
```

When using `vix::App`, prefer the helpers under:

```cpp id="v58q0s"
namespace vix::middleware::app
```

## What performance provides

The performance group includes:

```txt id="w8o42v"
compression()
  compresses eligible HTTP responses

etag()
  adds ETag support for cache validation

static_compression()
  provides a compression hook for static file responses
```

These middleware functions do not change your routing model. They run around normal Vix handlers and responses.

Core still owns routes, handlers, response objects, and static file serving. The performance middleware adds optional response optimization.

## Basic setup

A small application can use ETag and compression around API responses.

```cpp id="ybc3mt"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::etag_dev());
  app.use(vix::middleware::app::compression_dev());

  app.get("/api/status", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.json({
      "status", "ok",
      "server", "Vix.cpp"
    });
  });

  app.run(8080);

  return 0;
}
```

The route handler remains normal. The middleware decides what can be optimized after the handler produces the response.

## Response middleware

Most performance middleware calls `next()` first.

```txt id="p2zjs9"
request
  -> performance middleware
  -> handler
  -> response body exists
  -> middleware modifies response
```

This is necessary because middleware such as `etag()` and `compression()` need the final response body before they can work.

For example:

```txt id="v6cbyz"
etag()
  needs the response body to compute the tag

compression()
  needs the response body to compress it
```

This is different from middleware such as `rate_limit()` or `api_key()`, which can decide before the handler runs.

## Compression

`compression()` compresses eligible responses when the client accepts a supported encoding.

The client advertises supported encodings with:

```txt id="2fgo8n"
Accept-Encoding: gzip
```

The middleware can then add:

```txt id="tcq81k"
Content-Encoding: gzip
Vary: Accept-Encoding
```

when compression is applied.

Compression is useful for text-based responses such as JSON, HTML, CSS, JavaScript, and plain text.

It is usually not useful for already-compressed formats such as many images, archives, or media files.

## Use compression with App

```cpp id="edrbfl"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::compression_dev());

  app.get("/api/data", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.json({
      "message", "Hello from Vix",
      "type", "compressed when eligible"
    });
  });

  app.run(8080);

  return 0;
}
```

Request shape:

```bash id="kod475"
curl -i \
  http://127.0.0.1:8080/api/data \
  -H "Accept-Encoding: gzip"
```

If the response is eligible and gzip support is available in the build, the middleware can compress the response.

## Compression eligibility

Compression should only run when the response is worth compressing.

The middleware checks conditions such as:

```txt id="liif92"
compression is enabled
the response status can be compressed
the response is not already encoded
the body is large enough
the client accepts a supported encoding
the build has the required compression backend
```

This avoids wasting CPU on tiny responses or responses that should not be compressed.

## Configure compression

Use `CompressionOptions` when you need explicit behavior.

```cpp id="1j7bzt"
vix::middleware::performance::CompressionOptions opt;

opt.enabled = true;
opt.min_size = 1024;
opt.add_vary = true;
opt.gzip_level = 6;

auto mw = vix::middleware::performance::compression(opt);
```

Common options:

```txt id="hgtubf"
enabled
  enable or disable response compression

min_size
  minimum body size before compression is attempted

add_vary
  add Vary: Accept-Encoding

gzip_level
  gzip compression level when gzip support is available
```

Choose `min_size` carefully. Compressing very small responses can cost more than it saves.

## Compression and build support

The middleware can only apply gzip compression when the build has gzip support enabled.

When gzip support is not available, the middleware can still keep the response valid. In debug builds, it may expose diagnostic headers to show that compression was planned but not applied.

This makes the behavior clear during development without breaking production responses.

## ETag

`etag()` adds an `ETag` header to eligible responses.

An ETag is a response validator. The client can later send the ETag back with:

```txt id="dj5rte"
If-None-Match: <etag>
```

If the response has not changed, the middleware can return:

```txt id="bhu5oc"
304 Not Modified
```

with an empty body.

This reduces bandwidth for clients that already have a valid copy of the response.

## Use ETag with App

```cpp id="2sx7tn"
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

First request:

```bash id="2ypglv"
curl -i http://127.0.0.1:8080/api/version
```

Response shape:

```txt id="deigul"
HTTP/1.1 200 OK
ETag: W/"..."
```

Second request:

```bash id="ruft6z"
curl -i \
  http://127.0.0.1:8080/api/version \
  -H 'If-None-Match: W/"..."'
```

Response shape when the tag matches:

```txt id="om32tw"
HTTP/1.1 304 Not Modified
ETag: W/"..."
```

## ETag behavior

The middleware runs after the handler.

It computes a tag from the response body and writes the `ETag` header.

If the request contains `If-None-Match` and the value matches the computed tag, the middleware changes the response to `304` and clears the body.

This is useful for stable responses such as:

```txt id="go1kdu"
configuration data
version endpoints
static JSON responses
small metadata endpoints
generated content that changes rarely
```

## Configure ETag

Use `EtagOptions` when you need explicit behavior.

```cpp id="4v5n3g"
vix::middleware::performance::EtagOptions opt;

opt.weak = true;
opt.min_body_size = 1;
opt.add_cache_control_if_missing = true;
opt.cache_control = "public, max-age=0";

auto mw = vix::middleware::performance::etag(opt);
```

Main options:

```txt id="o6op9x"
weak
  generate weak ETags when true

min_body_size
  minimum response body size before an ETag is generated

add_cache_control_if_missing
  add Cache-Control when the response does not already have one

cache_control
  Cache-Control value to add when enabled
```

Weak ETags are a good default for many dynamic responses because they identify semantic equivalence without promising byte-for-byte identity in every situation.

## Methods supported by ETag

The ETag middleware applies to:

```txt id="s8qd70"
GET
HEAD
```

It skips other methods.

This is intentional. ETag validation is normally useful for cacheable read responses, not state-changing requests.

## Compression and ETag order

Compression and ETag both work on the response body.

The order can matter because an ETag may describe either the original body or the encoded body depending on where it runs in the chain.

A simple development setup can install ETag and compression together, but production applications should decide the desired behavior explicitly.

A common approach is:

```txt id="5kjv3w"
handler produces body
etag computes validator
compression encodes final response
```

The exact setup depends on how you want clients and caches to validate responses.

## Static file compression

Core serves static files through `vix::App`.

```cpp id="d7ryrm"
app.static_dir("public", "/");
```

The middleware module does not replace `static_dir`.

It provides an optional static response hook that can compress eligible static file responses after Core has produced them.

This keeps the separation clean:

```txt id="ji7qzq"
Core
  owns static file mounting and serving

Middleware performance
  provides optional compression for static responses
```

## Enable static compression hook

```cpp id="wxi81c"
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

The static directory is still configured with `app.static_dir(...)`.

The middleware hook only adds compression behavior when the response is eligible.

## Static compression behavior

Static compression checks similar conditions to normal response compression.

It skips responses such as:

```txt id="3d5k4y"
HEAD requests
non-2xx responses
responses that already have Content-Encoding
responses smaller than the configured minimum size
responses where the client does not accept gzip
```

When gzip is available and the client accepts it, the hook can set:

```txt id="2hujc5"
Content-Encoding: gzip
Vary: Accept-Encoding
```

The hook is intentionally optional. Applications that do not need static compression can keep using `app.static_dir(...)` normally.

## Configure static compression

The static compression hook uses `CompressionOptions`.

```cpp id="s63oe7"
vix::App::set_static_response_hook(
  vix::middleware::performance::compressed_static_response_hook({
    .enabled = true,
    .min_size = 1024,
    .add_vary = true,
    .gzip_level = 6
  })
);
```

This is lower-level than the default registration helper. Use it when you need explicit compression options.

## Static files still belong to Core

Do not document static file serving as a middleware feature.

The correct user-facing model is:

```cpp id="6cybqa"
app.static_dir("public", "/");
```

The performance module can optimize the response after Core serves it.

This matters because users should not think they need the middleware module just to serve files. They need Core for static files. They need middleware only for optional static response compression.

## HTTP cache and performance

HTTP caching is documented separately because it depends on the `vix::cache` module.

Still, it is related to performance.

A common response optimization stack can include:

```txt id="qvlfoh"
http_cache
etag
compression
```

Each one solves a different problem.

```txt id="krr4cl"
http_cache
  avoids recomputing or refetching a response

etag
  lets clients validate whether their copy is still current

compression
  reduces response size over the network
```

Use them intentionally. Do not enable every optimization everywhere without knowing what the route returns.

## Middleware order

Performance middleware usually needs the final response body, so it often wraps the handler.

A simple order can be:

```txt id="2vdgjw"
request middleware
  -> handler
  -> etag
  -> compression
  -> response
```

In code, wrapper order depends on how middleware calls `next()` and performs work after it returns.

The important rule is:

```txt id="5gcmt5"
Middleware that needs the final body must run after the handler has written it.
```

For most application code, use the app helpers first. Move to explicit low-level configuration when response semantics matter.

## Common response headers

Performance middleware may add or modify headers such as:

```txt id="del6hq"
ETag
If-None-Match
Cache-Control
Vary
Content-Encoding
Content-Length
X-Vix-Compression
X-Vix-Static-Compression
```

Debug-only diagnostic headers should not be treated as a public API.

## Development and production

Development helpers are useful for examples and local testing.

```cpp id="gce0rz"
app.use(vix::middleware::app::etag_dev());
app.use(vix::middleware::app::compression_dev());
```

Production applications should configure performance behavior based on their traffic and response types.

Important production decisions include:

```txt id="ln5sgp"
minimum compression size
compression level
which content types should be compressed
whether ETags should be weak or strong
whether Cache-Control should be added
whether static responses should be compressed
whether the build includes gzip support
how ETag and compression order should behave
```

Performance middleware should improve the response path without making response semantics unclear.

## What this module does not do

The performance group does not replace a CDN.

It does not replace HTTP cache policy design.

It does not serve static files by itself.

It does not decide which responses are safe to cache.

It does not optimize database queries.

It does not remove the need to measure performance.

It provides HTTP response optimizations that can be applied where they make sense.

## Summary

`compression()` compresses eligible responses when the client accepts a supported encoding.

`etag()` generates response validators and can return `304 Not Modified` for matching requests.

`static_compression()` adds optional compression behavior to static file responses served by Core.

Use these middleware functions after you understand the response produced by the route. Performance middleware is most useful when it is applied intentionally, not globally by habit.

## Next steps

Continue with:

- [Observability](./observability)
- [HTTP Cache](./http-cache)
- [App Integration](./app-integration)
- [API Reference](./api-reference)
