# Security

The `security` group contains middleware for common HTTP protection.

It helps with browser access control, unsafe request protection, response hardening, IP filtering, and request rate limiting.

For most application code, include:

```cpp id="tq2b8m"
#include <vix.hpp>
#include <vix/middleware.hpp>
```

The security middleware lives under:

```cpp id="fxnc75"
namespace vix::middleware::security
```

When using `vix::App`, prefer the helpers under:

```cpp id="k8bj8m"
namespace vix::middleware::app
```

## What security provides

The security group includes:

```txt id="r4rjlq"
cors()
  handles CORS preflight and CORS response headers

csrf()
  validates double-submit CSRF tokens

headers()
  adds common browser security headers

ip_filter()
  allows or denies requests based on client IP

rate_limit()
  limits requests per client key using a token bucket
```

These middleware functions do not replace application-specific security decisions. They provide reusable HTTP-level protection around handlers.

## Basic setup

A small API can start with security headers, CORS, and rate limiting.

```cpp id="7pc81c"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::security_headers_dev());
  app.use(vix::middleware::app::cors_dev());
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

This example is intentionally small. In production, configure the middleware explicitly for the origins, limits, headers, and deployment model you use.

## CORS

`cors()` handles Cross-Origin Resource Sharing.

It is mainly useful when a browser frontend calls your Vix backend from another origin.

The middleware handles two cases:

```txt id="t2as9l"
preflight requests
  OPTIONS request with Access-Control-Request-Method

normal requests
  regular request with an Origin header
```

For preflight requests, CORS can answer before the route handler runs.

For normal requests, CORS usually calls the handler first, then adds CORS headers to the response.

## Use CORS with App

```cpp id="h5e6ce"
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

This is useful for development.

For production, prefer explicit origins.

## Configure CORS

Use `CorsOptions` when you need control over origins, methods, headers, credentials, and preflight caching.

```cpp id="erhxln"
vix::middleware::security::CorsOptions opt;

opt.allowed_origins = {
  "https://example.com"
};

opt.allow_any_origin = false;
opt.allow_credentials = true;
opt.allow_methods = {"GET", "POST", "OPTIONS"};
opt.allow_headers = {"Content-Type", "Authorization"};

auto mw = vix::middleware::security::cors(opt);
```

Main options:

```txt id="q2gz94"
allowed_origins
  exact origins that may access the application

allow_any_origin
  allow any origin when no explicit origin list is provided

allow_credentials
  send Access-Control-Allow-Credentials: true

allow_methods
  methods allowed for preflight responses

allow_headers
  headers allowed for preflight responses

expose_headers
  response headers exposed to the browser

max_age_seconds
  preflight cache duration

vary_origin
  append Vary: Origin when needed
```

If credentials are enabled, the middleware does not return `*` as the allowed origin. It returns the request origin when that origin is allowed.

## CORS preflight

A preflight request looks like this:

```txt id="yyb04c"
OPTIONS /api/users
Origin: https://example.com
Access-Control-Request-Method: POST
```

If the origin is allowed, the middleware can return:

```txt id="l0ydc9"
204 No Content
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 600
```

The route handler is not called for a handled preflight request.

If the origin is not allowed, the middleware returns a normalized `403` error.

## CSRF

`csrf()` protects unsafe requests using the double-submit cookie pattern.

For unsafe methods, the client must send the same token in two places:

```txt id="vaxc2o"
cookie
  csrf_token=...

header
  x-csrf-token: ...
```

If either value is missing, or if the values do not match, the request is rejected.

By default, CSRF protects:

```txt id="ktias0"
POST
PUT
PATCH
DELETE
```

`GET` is not protected by default.

## Use CSRF

```cpp id="q55922"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::csrf_dev());

  app.post("/profile", [](vix::Request &req, vix::Response &res)
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

Request shape:

```bash id="sfrjx8"
curl -i \
  -X POST http://127.0.0.1:8080/profile \
  -H "Cookie: csrf_token=abc" \
  -H "x-csrf-token: abc" \
  -d 'name=Ada'
```

If the tokens do not match, the middleware returns:

```txt id="x4u42x"
403 csrf_failed
```

## Configure CSRF

Use `CsrfOptions` for custom cookie and header names.

```cpp id="jbcowa"
vix::middleware::security::CsrfOptions opt;

opt.cookie_name = "csrf_token";
opt.header_name = "x-csrf-token";
opt.protect_get = false;

auto mw = vix::middleware::security::csrf(opt);
```

Main options:

```txt id="kpjzpr"
cookie_name
  cookie that contains the CSRF token

header_name
  request header that must contain the same token

protect_get
  require CSRF tokens for GET requests too
```

The middleware assumes the application already sets the CSRF cookie. It verifies the token pair during unsafe requests.

## Security headers

`headers()` adds common browser security headers after the handler has run.

This middleware does not authenticate users and does not validate request input. It hardens browser behavior for the response.

## Use security headers with App

```cpp id="yjmhx1"
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

Response headers can include:

```txt id="qlbo3k"
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Configure security headers

Use `SecurityHeadersOptions` when you need to choose specific headers.

```cpp id="k4iqef"
vix::middleware::security::SecurityHeadersOptions opt;

opt.x_content_type_options = true;
opt.x_frame_options = true;
opt.referrer_policy = true;
opt.permissions_policy = true;
opt.hsts = false;
opt.content_security_policy = "default-src 'self'";

auto mw = vix::middleware::security::headers(opt);
```

Main options:

```txt id="mayvl2"
x_content_type_options
  add X-Content-Type-Options: nosniff

x_frame_options
  add X-Frame-Options: DENY

x_xss_protection
  add legacy X-XSS-Protection header

referrer_policy
  add Referrer-Policy

permissions_policy
  add Permissions-Policy

hsts
  add Strict-Transport-Security

content_security_policy
  add Content-Security-Policy when not empty
```

Enable HSTS only when the application is served exclusively over HTTPS.

## Content Security Policy

The middleware can add a CSP header when `content_security_policy` is not empty.

```cpp id="6cy3a6"
vix::middleware::security::SecurityHeadersOptions opt;

opt.content_security_policy = "default-src 'self'; object-src 'none'";

auto mw = vix::middleware::security::headers(opt);
```

CSP rules depend on the application. A backend API, a static website, and a dashboard may need different policies.

The middleware sets the header. The application author decides the correct policy.

## IP filter

`ip_filter()` allows or denies requests based on the client IP.

The middleware extracts the IP from a configured header. By default, it uses:

```txt id="ywh8mz"
x-forwarded-for
```

It can also use fallback headers such as:

```txt id="o56gje"
x-real-ip
```

Deny rules are evaluated before allow rules.

## Use IP filtering

```cpp id="48t7xh"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  vix::middleware::security::IpFilterOptions opt;
  opt.deny = {"1.2.3.4"};

  app.use(vix::middleware::app::adapt_ctx(
    vix::middleware::security::ip_filter(opt)
  ));

  app.get("/", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.text("OK");
  });

  app.run(8080);

  return 0;
}
```

A denied IP receives:

```txt id="m5bdrp"
403 ip_denied
```

If an allow list is configured and the extracted IP is not in it, the middleware returns:

```txt id="xan7qt"
403 ip_not_allowed
```

## Configure IP filtering

```cpp id="5ysctb"
vix::middleware::security::IpFilterOptions opt;

opt.allow = {"10.0.0.5"};
opt.deny = {"1.2.3.4"};
opt.header_name = "x-forwarded-for";
opt.use_remote_addr_fallback = true;

auto mw = vix::middleware::security::ip_filter(opt);
```

Main options:

```txt id="wkoh2w"
allow
  if non-empty, only these IPs are accepted

deny
  IPs that are always rejected

header_name
  header used to extract the client IP

use_remote_addr_fallback
  check fallback headers when the main header is missing
```

When your application runs behind a proxy, only trust IP headers that are written by your own infrastructure.

## Rate limit

`rate_limit()` limits how many requests a client key can make.

It uses a token bucket:

```txt id="n0qtk9"
capacity
  maximum burst size

refill_per_sec
  how many tokens are added per second
```

Each request consumes one token. If no token is available, the middleware returns `429 Too Many Requests`.

## Use rate limiting with App

```cpp id="oj7gww"
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

A rate-limited response can include:

```txt id="sm1zdj"
429 Too Many Requests
Retry-After: 3
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 3
```

## Configure rate limiting

Use `RateLimitOptions` for explicit limits.

```cpp id="v1psxy"
vix::middleware::security::RateLimitOptions opt;

opt.capacity = 60.0;
opt.refill_per_sec = 1.0;
opt.add_headers = true;
opt.key_header = "x-forwarded-for";

auto mw = vix::middleware::security::rate_limit(opt);
```

Main options:

```txt id="gvf66e"
capacity
  maximum number of tokens in the bucket

refill_per_sec
  number of tokens added per second

add_headers
  add rate limit headers to responses

key_header
  header used to derive the client key

key_fn
  custom function used to derive the client key
```

Use `key_fn` when the client key should come from authentication, tenant id, API key, or another application-specific source.

## Custom rate limit key

```cpp id="0rin71"
vix::middleware::security::RateLimitOptions opt;

opt.key_fn = [](const vix::middleware::Request &req)
{
  std::string key = req.header("x-api-key");

  if (!key.empty())
    return key;

  return std::string("anonymous");
};

auto mw = vix::middleware::security::rate_limit(opt);
```

This allows rate limiting by API key instead of IP header.

## Shared rate limiter state

`rate_limit()` can use a `RateLimiterState` from services.

This is useful when the same limiter state should be shared across several pipelines or middleware instances.

```cpp id="2574vb"
auto state =
  std::make_shared<vix::middleware::security::RateLimiterState>();

vix::middleware::HttpPipeline pipeline;

pipeline.services().provide<
  vix::middleware::security::RateLimiterState
>(state);

pipeline.use(vix::middleware::security::rate_limit());
```

If no service is provided, the middleware uses a fallback global state.

## Middleware order

Security middleware should be placed based on what it protects.

A reasonable starting point for an API is:

```txt id="lzlnwd"
recovery
request_id
security_headers
cors
rate_limit
body_limit
parsers
authentication
authorization
handler
```

CORS often needs to run before authentication because browser preflight requests should not require application authentication.

Rate limiting should run before expensive parsing or handler work.

Body limits should run before JSON, form, or multipart parsers.

CSRF usually runs before state-changing handlers.

Security headers usually wrap the response and can run before the handler because they add headers after `next()` returns.

## Common status codes

Security middleware can stop the request and return normalized errors.

Common responses include:

```txt id="awq4js"
204
  CORS preflight accepted

403 cors_forbidden
  CORS origin not allowed

403 csrf_failed
  CSRF token missing or invalid

403 ip_denied
  client IP is denied

403 ip_not_allowed
  client IP is not in allow list

429 rate_limited
  too many requests
```

Security headers usually do not stop the request.

## Development and production

Development helpers are useful for examples and local development.

```cpp id="g6e3t7"
app.use(vix::middleware::app::cors_dev());
app.use(vix::middleware::app::security_headers_dev());
app.use(vix::middleware::app::rate_limit_dev());
```

Production applications should configure security middleware explicitly.

Important production decisions include:

```txt id="n9j64e"
which origins are allowed
whether credentials are allowed
which headers are exposed
which methods are accepted
whether HSTS is enabled
which CSP policy is correct
how rate limit keys are derived
which proxy headers are trusted
which CSRF token strategy is used
```

The middleware gives the HTTP mechanism. The application still owns the security policy.

## What this module does not decide

The security group does not decide who your users are.

It does not decide which roles can access which resources.

It does not validate business rules.

It does not replace TLS.

It does not replace database authorization checks.

It provides HTTP-level protections that should be combined with authentication, authorization, validation, and deployment security.

## Summary

`cors()` controls browser cross-origin access.

`csrf()` checks double-submit CSRF tokens for unsafe methods.

`headers()` adds browser security headers.

`ip_filter()` allows or denies requests by client IP.

`rate_limit()` limits request volume per client key.

These middleware functions are useful early in the pipeline because they can reject invalid or risky requests before the handler does expensive work.

## Next steps

Continue with:

- [Authentication](./authentication)
- [Parsers](./parsers)
- [Performance](./performance)
- [HTTP Cache](./http-cache)
- [App Integration](./app-integration)
