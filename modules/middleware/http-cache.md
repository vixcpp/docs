# HTTP Cache

The HTTP cache middleware connects `vix::cache` to Vix HTTP requests.

It is designed for caching `GET` responses. It can serve a stored response on cache hit, call the handler on cache miss, and store successful responses for later reuse.

For most application code, include:

```cpp id="lzua5m"
#include <vix.hpp>
#include <vix/middleware.hpp>
#include <vix/cache.hpp>
```

The HTTP cache middleware lives under:

```cpp id="c27g6i"
namespace vix::middleware
```

The App integration helpers live under:

```cpp id="nd2b15"
namespace vix::middleware::app
```

## What HTTP cache provides

The HTTP cache middleware provides:

```txt id="qc0nyx"
http_cache()
  low-level HTTP middleware for caching GET responses

app::http_cache()
  App middleware wrapper for normal Vix applications

app::use_http_cache()
  helper that installs HTTP cache on an App prefix
```

The cache engine itself is provided by the `vix::cache` module.

```txt id="t674xa"
vix::cache
  stores entries, applies cache policy, handles stale reuse

vix::middleware::http_cache
  connects the cache engine to HTTP requests and responses
```

This separation is important. The middleware does not own cache storage. It only decides how HTTP requests and responses are mapped to cache operations.

## Basic idea

For a `GET` request, the middleware computes a cache key from:

```txt id="m1nbq9"
method
path
query string
selected request headers
```

Then it asks the cache for an entry.

```txt id="3l9nia"
GET request
  -> compute key
  -> cache lookup
  -> hit: send cached response
  -> miss: call handler, then store response
```

On a cache hit, the handler is not called.

On a cache miss, the handler runs normally.

## Use HTTP cache with App

```cpp id="xu92lj"
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

  auto cache =
    std::make_shared<vix::cache::Cache>(policy, store);

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

The first request to `/api/status` calls the handler.

A later request with the same cache key can be served from cache.

## Cache status header

The middleware writes a cache status header:

```txt id="z7xj7h"
x-vix-cache-status
```

Common values are:

```txt id="g4xajs"
hit
  response came from cache

miss
  handler ran and the response may be stored

bypass
  request asked to skip cache
```

This is useful when testing whether the cache is active.

## Example request flow

First request:

```bash id="z4grio"
curl -i http://127.0.0.1:8080/api/status
```

Response shape:

```txt id="fyd9fw"
HTTP/1.1 200 OK
x-vix-cache-status: miss
```

Second request:

```bash id="q14f71"
curl -i http://127.0.0.1:8080/api/status
```

Response shape:

```txt id="ynqygr"
HTTP/1.1 200 OK
x-vix-cache-status: hit
```

The exact body is the body stored from the previous successful response.

## Cache only applies to GET

The middleware only caches `GET` requests.

Requests such as `POST`, `PUT`, `PATCH`, and `DELETE` pass through without cache lookup.

This is intentional. HTTP cache middleware is meant for read responses.

State-changing requests should usually be handled by application logic, not by response replay.

## Cache key

The middleware uses `vix::cache::CacheKey::fromRequest(...)`.

The key is deterministic.

It includes:

```txt id="pmg1dy"
HTTP method
request path
normalized query string
optional vary headers
```

Query strings are normalized so parameter order does not change the logical key.

For example, these should map to the same normalized query form:

```txt id="yde5rb"
/api/users?b=2&a=1
/api/users?a=1&b=2
```

This avoids duplicate entries for the same logical request.

## Vary headers

Some responses depend on request headers.

For example:

```txt id="y0q16h"
Accept
Accept-Language
Authorization
X-Tenant
```

If a header changes the response, include it in `vary_headers`.

```cpp id="vhibwm"
vix::middleware::app::HttpCacheConfig cfg;

cfg.vary_headers = {
  "Accept"
};

app.use("/api", vix::middleware::app::http_cache(cfg));
```

When `vary_headers` is set, selected request headers become part of the cache key.

Use this carefully. Adding too many headers can fragment the cache and reduce hit rate.

## Bypass cache

The middleware can allow a request to bypass the cache.

By default, the bypass header is:

```txt id="fuplkr"
x-vix-cache: bypass
```

Request:

```bash id="xqkmyh"
curl -i \
  http://127.0.0.1:8080/api/status \
  -H "x-vix-cache: bypass"
```

When bypass is accepted, the middleware calls the handler and sets:

```txt id="mi6u6q"
x-vix-cache-status: bypass
```

The bypass feature is useful for debugging, manual refreshes, and admin tooling.

## Configure App HTTP cache

Use `HttpCacheAppConfig` when installing cache on `vix::App`.

```cpp id="egbug7"
vix::middleware::app::HttpCacheConfig cfg;

cfg.prefix = "/api/";
cfg.ttl_ms = 30'000;
cfg.only_get = true;
cfg.allow_bypass = true;
cfg.bypass_header = "x-vix-cache";
cfg.bypass_value = "bypass";
cfg.vary_headers = {"Accept"};

app.use("/api", vix::middleware::app::http_cache(cfg));
```

Main options:

```txt id="h24qsk"
prefix
  prefix used by install_http_cache()

only_get
  wrap the middleware so only GET requests are cached

ttl_ms
  default TTL used when a default cache is created

allow_bypass
  allow requests to skip cache with a header

bypass_header
  header used for bypass

bypass_value
  value required for bypass

vary_headers
  request headers included in the cache key

cache
  custom shared vix::cache::Cache instance
```

If `cache` is not provided, the App helper can create a default in-memory cache.

For production applications, prefer creating the cache explicitly so the policy and store are clear.

## Install cache on a prefix

`use_http_cache()` installs HTTP cache using the prefix from the config.

```cpp id="3hk5t2"
vix::middleware::app::HttpCacheConfig cfg;

cfg.prefix = "/api/";
cfg.ttl_ms = 30'000;

vix::middleware::app::use_http_cache(app, cfg);
```

This is equivalent to installing the middleware on a route prefix.

Use prefixes to avoid caching routes that should not be cached.

## Low-level http_cache()

The low-level middleware takes a shared cache instance and `HttpCacheOptions`.

```cpp id="v0kr2b"
auto mw = vix::middleware::http_cache(cache);
```

This returns:

```cpp id="kf81si"
vix::middleware::HttpMiddleware
```

It uses the legacy HTTP middleware signature:

```cpp id="ra8k6c"
Request &
Response &
Next
```

Use the low-level middleware for tests, custom pipelines, or custom integration layers.

## Configure low-level HTTP cache

```cpp id="l5cjnd"
vix::middleware::HttpCacheOptions opt;

opt.vary_headers = {"Accept"};
opt.cache_200_only = true;
opt.require_body = false;
opt.allow_bypass = true;
opt.bypass_header = "x-vix-cache";
opt.bypass_value = "bypass";

auto mw = vix::middleware::http_cache(cache, opt);
```

Main options:

```txt id="s4l4d3"
vary_headers
  request headers included in the cache key

cache_200_only
  only store responses with status 200

require_body
  only store responses with a non-empty body

allow_bypass
  allow bypass header

bypass_header
  header used for bypass

bypass_value
  value required for bypass

context_provider
  custom function that returns a CacheContext for the request
```

## Cache policy

The middleware relies on `vix::cache::CachePolicy` to decide whether an entry is usable.

A policy contains:

```txt id="ai86jt"
ttl_ms
  time while an entry is fresh

stale_if_error_ms
  maximum age for reuse after a network error

stale_if_offline_ms
  maximum age for reuse while offline

allow_stale_if_error
  allow stale reuse on network error

allow_stale_if_offline
  allow stale reuse while offline
```

Example:

```cpp id="l0lyp8"
vix::cache::CachePolicy policy;

policy.ttl_ms = 30'000;
policy.allow_stale_if_error = true;
policy.stale_if_error_ms = 5 * 60'000;
policy.allow_stale_if_offline = true;
policy.stale_if_offline_ms = 10 * 60'000;
```

The middleware does not duplicate this logic. It passes the request context to the cache engine and lets the policy decide.

## Cache context

`CacheContext` describes runtime conditions for cache decisions.

Common contexts are:

```cpp id="pomjlv"
vix::cache::CacheContext::Online();
vix::cache::CacheContext::Offline();
vix::cache::CacheContext::NetworkError();
```

By default, the HTTP cache middleware uses:

```cpp id="sxg7tr"
vix::cache::CacheContext::Online()
```

You can provide a custom context provider.

```cpp id="yxdhmm"
vix::middleware::HttpCacheOptions opt;

opt.context_provider =
  [](vix::middleware::Request &req)
  {
    (void)req;

    return vix::cache::CacheContext::Online();
  };

auto mw = vix::middleware::http_cache(cache, opt);
```

This is useful when an application has network state, offline mode, or a gateway layer that can report network errors.

## Stores

The `vix::cache` module provides different cache stores.

Common stores include:

```txt id="w8q4h4"
MemoryStore
  simple in-memory cache

LruMemoryStore
  in-memory cache with max entry eviction

FileStore
  file-backed cache store
```

The middleware works with the `Cache` facade, so it does not need to know which store is used.

## MemoryStore

`MemoryStore` is useful for local development, tests, and simple process-local caches.

```cpp id="cq3d5d"
auto store =
  std::make_shared<vix::cache::MemoryStore>();
```

It stores entries in memory and does not persist them across process restarts.

## LruMemoryStore

`LruMemoryStore` is useful when you want a maximum number of cached entries.

```cpp id="uk3mby"
auto store =
  std::make_shared<vix::cache::LruMemoryStore>(
    vix::cache::LruMemoryStore::Config{
      .max_entries = 1024
    }
  );
```

It evicts least recently used entries when the cache grows beyond the configured limit.

## FileStore

`FileStore` persists cache entries to a JSON file.

```cpp id="lqthlb"
auto store =
  std::make_shared<vix::cache::FileStore>(
    vix::cache::FileStore::Config{
      .file_path = ".vix/cache_http.json",
      .pretty_json = false
    }
  );
```

This is useful for durable local cache behavior, offline-first scenarios, and local reuse after restart.

For high-write workloads, consider whether a file-backed JSON store is the right backend for your application.

## Cached response contents

A cache entry stores:

```txt id="it2skd"
status
body
headers
created_at_ms
```

When a cached response is served, the middleware restores the status, headers, and body.

The middleware skips `content-length` from cached headers because the final body and response writer should control the correct length.

## Header normalization

`Cache::put()` normalizes response header names through `HeaderUtil`.

This avoids cache inconsistencies caused by header casing differences.

For example:

```txt id="bgut5h"
Content-Type
content-type
CONTENT-TYPE
```

should not produce different logical cache metadata just because the casing changed.

## What gets stored

By default, the middleware stores successful `200` responses.

```cpp id="jjs2m0"
opt.cache_200_only = true;
```

If `require_body` is enabled, empty responses are not stored.

```cpp id="g5e75z"
opt.require_body = true;
```

This keeps accidental caching of empty or non-success responses under control.

## What should not be cached

Do not cache responses blindly.

Avoid caching routes that return:

```txt id="c6rfx7"
private user data
per-user dashboards
admin pages
state-changing results
highly dynamic data
responses based on Authorization unless the key varies correctly
responses with secrets or tokens
```

If a response depends on the user, tenant, language, or authorization state, the cache key must include that difference or the route should not be cached.

## Cache and authentication

Be careful when combining HTTP cache with authenticated routes.

This is risky:

```txt id="v9pkhs"
http_cache
  -> jwt
  -> handler returns user-specific data
```

because the cache may serve the first user's response to another request if the cache key does not include user-specific data.

A safer approach is to avoid caching private routes, or include a trusted user or tenant key in the cache key through `vary_headers` or a custom cache strategy.

For most applications, keep HTTP cache on public `GET` routes first.

## Cache and CORS

CORS can add response headers that vary by origin.

If the response depends on the `Origin` header, include it in `vary_headers` or keep cache away from those routes.

```cpp id="mazppc"
cfg.vary_headers = {
  "Origin"
};
```

This prevents one origin's CORS response from being reused for another origin when the response differs.

## Cache and compression

HTTP cache, ETag, and compression can work together, but order matters.

Each one modifies or reuses responses differently:

```txt id="vxxeru"
http_cache
  may return a stored response without calling the handler

etag
  computes or validates a response tag

compression
  may change the body encoding
```

Start simple. Cache stable public `GET` responses first. Add ETag or compression when you know the desired response semantics.

## Cache and static files

Static files are served by Core through:

```cpp id="uy3q6h"
app.static_dir("public", "/");
```

The HTTP cache middleware is mainly for dynamic HTTP handlers and API responses.

For static files, prefer Core static file support and the performance static compression hook when needed.

Do not document static file serving as an HTTP cache feature.

## Pruning expired entries

The cache engine can prune expired entries.

```cpp id="dxigh4"
const std::int64_t now = vix::middleware::now_ms();

std::size_t removed = cache->prune(now);
```

Pruning removes entries older than the maximum age allowed by the policy.

`prune()` is implemented for supported stores such as `LruMemoryStore` and `FileStore`.

For `MemoryStore`, pruning may depend on store support.

## Periodic pruning

The middleware module also has `PeriodicTask`, which can run a job at intervals through an executor.

That can be used to schedule cache pruning in applications that need it.

```txt id="evyofm"
PeriodicTask
  -> every N seconds
  -> executor runs cache->prune(now)
```

Keep this as an application decision. The HTTP cache middleware does not automatically decide your pruning schedule.

## Low-level smoke test shape

The cache can be tested without starting a server.

```cpp id="jb5btr"
auto store = std::make_shared<vix::cache::MemoryStore>();

vix::cache::CachePolicy policy;
policy.ttl_ms = 60'000;

auto cache =
  std::make_shared<vix::cache::Cache>(policy, store);

auto mw = vix::middleware::http_cache(cache);
```

Then pass a request, response, and `next()` function to the middleware.

This is the same model used by the middleware tests.

## Common order

For public API caching, a simple order can be:

```txt id="ik6a75"
recovery
request_id
cors
rate_limit
http_cache
handler
etag
compression
```

This is not a universal rule.

Important considerations:

```txt id="degx4i"
CORS may need to handle preflight before cache.

Rate limiting may need to run before cache to limit all requests.

HTTP cache should run before the handler so hits can skip handler work.

ETag and compression need the final response body.
```

Choose the order based on what each route returns.

## Development and production

Development examples can use a simple in-memory cache.

```cpp id="l5296d"
auto store = std::make_shared<vix::cache::MemoryStore>();
```

Production applications should choose explicit cache policy and storage.

Important production decisions include:

```txt id="txh7lv"
which routes are cacheable
how long entries stay fresh
whether stale entries can be used
which headers affect the cache key
whether cache should survive restart
how pruning is scheduled
how cache interacts with auth and CORS
```

The middleware provides the HTTP integration. The application owns the cache policy.

## What this module does not do

The HTTP cache middleware does not replace a CDN.

It does not decide which business data is safe to cache.

It does not make private responses safe automatically.

It does not serve static files.

It does not validate ETags.

It does not compress responses.

It does not implement storage itself.

It connects HTTP `GET` responses to `vix::cache`.

## Summary

`vix::cache` owns cache entries, policy, context, and storage.

`vix::middleware::http_cache()` connects that cache engine to HTTP requests.

On hit, the middleware sends the cached response and skips the handler.

On miss, it calls the handler and stores eligible responses.

Use it first for stable public `GET` routes. Add vary headers, explicit policy, and durable stores only when the route needs them.

## Next steps

Continue with:

- [App Integration](./app-integration)
- [Performance](./performance)
- [Security](./security)
- [API Reference](./api-reference)
