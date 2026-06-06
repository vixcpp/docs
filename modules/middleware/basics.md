# Basics

The `basics` group contains the middleware that is useful in many Vix HTTP applications.

These middleware functions handle request metadata, request timing, request logging, exception recovery, and body size limits. They are small, predictable, and designed to be combined with the rest of the middleware module.

For most applications, include:

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>
```

The basic middleware lives under:

```cpp
namespace vix::middleware::basics
```

When using `vix::App`, prefer the helpers under:

```cpp
namespace vix::middleware::app
```

## What basics provides

The basics group includes:

```txt
request_id()
  creates or accepts a request id

timing()
  measures request processing time

logger()
  writes one summary line per request

recovery()
  catches exceptions and returns a normalized 500 response

body_limit()
  rejects requests whose body is too large
```

These features are simple, but they define the normal shape of a healthy HTTP request pipeline.

## Basic setup

A small application can start with request ids, timing, recovery, and a body limit.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::recovery_dev());
  app.use(vix::middleware::app::request_id_dev());
  app.use(vix::middleware::app::timing_dev());
  app.use(vix::middleware::app::body_limit_dev());

  app.get("/", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.text("OK");
  });

  app.run(8080);

  return 0;
}
```

The exact order depends on the application, but the intention is clear:

```txt
recovery wraps failures
request_id gives the request an id
timing measures the request
body_limit rejects oversized bodies early
handler produces the response
```

## Request id

`request_id()` gives every request a stable identifier.

It can accept an incoming request id from a header, or generate a new one when the request does not provide one.

By default, the header is:

```txt
x-request-id
```

The middleware stores the id in request state as:

```cpp
vix::middleware::basics::RequestId
```

It also writes the id back to the response header.

## Use request id with App

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::request_id_dev());

  app.get("/", [](vix::Request &req, vix::Response &res)
  {
    auto *rid = req.try_state<vix::middleware::basics::RequestId>();

    res.json({
      "request_id", rid ? rid->value : ""
    });
  });

  app.run(8080);

  return 0;
}
```

Response shape:

```json
{
  "request_id": "..."
}
```

The response can also include:

```txt
x-request-id: ...
```

## Incoming request id

If the request already contains a reasonable `x-request-id`, the middleware can reuse it.

```bash
curl -i \
  http://127.0.0.1:8080/ \
  -H "x-request-id: abcDEF-1234"
```

The middleware accepts ids that are reasonably sized and contain safe characters.

Allowed characters include:

```txt
A-Z
a-z
0-9
-
_
.
:
```

Invalid incoming ids are ignored and a new id is generated when generation is enabled.

## RequestIdOptions

The low-level middleware can be configured with `RequestIdOptions`.

```cpp
vix::middleware::basics::RequestIdOptions opt;

opt.header_name = "x-request-id";
opt.accept_incoming = true;
opt.generate_if_missing = true;
opt.always_set_response_header = true;

auto mw = vix::middleware::basics::request_id(opt);
```

Main options:

```txt
header_name
  header used to read and write the request id

accept_incoming
  accept a valid incoming id from the request

generate_if_missing
  generate an id when none is present

always_set_response_header
  write the id back to the response
```

## Timing

`timing()` measures how long downstream middleware and handlers take to run.

It can write:

```txt
x-response-time: 12ms
server-timing: total;dur=12
```

It also stores the duration in request state as:

```cpp
vix::middleware::basics::Timing
```

The value is stored in milliseconds.

## Use timing with App

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

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

Response headers can include:

```txt
x-response-time: 1ms
server-timing: total;dur=1
```

## Read Timing from request state

```cpp
app.get("/debug", [](vix::Request &req, vix::Response &res)
{
  auto *timing = req.try_state<vix::middleware::basics::Timing>();

  res.json({
    "duration_ms", timing ? timing->total_ms : 0
  });
});
```

This is useful when another middleware or handler wants to inspect the measured duration.

## TimingOptions

The low-level middleware can be configured with `TimingOptions`.

```cpp
vix::middleware::basics::TimingOptions opt;

opt.set_x_response_time = true;
opt.set_server_timing = true;
opt.store_in_state = true;

auto mw = vix::middleware::basics::timing(opt);
```

Main options:

```txt
set_x_response_time
  write the x-response-time header

set_server_timing
  write the server-timing header

x_response_time_header
  header name for response time

server_timing_header
  header name for server timing

server_timing_metric
  metric name used in Server-Timing

store_in_state
  store Timing in request state
```

## Logger

`logger()` writes one summary line after a request has been handled.

It is request logging middleware. It is not the global Vix logging module.

`vix::log` is still the application logging system. The middleware logger can forward request log lines to `vix::log` through an `ILogger` implementation.

The logger can include:

```txt
method
path
status
duration
request id
user-agent
x-forwarded-for
```

It can write text lines or JSON lines.

## Logger requires a service

The logger middleware does not own a logging backend.

It expects an implementation of:

```cpp
vix::middleware::basics::ILogger
```

A simple implementation can forward to `vix::log`.

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

This separation keeps the middleware testable. The middleware knows when to log. The application decides where the log line goes.

## LoggerOptions

The low-level logger can be configured with `LoggerOptions`.

```cpp
vix::middleware::basics::LoggerOptions opt;

opt.format = vix::middleware::basics::LogFormat::Text;
opt.log_request_id = true;
opt.log_timing = true;
opt.level_from_status = true;

auto mw = vix::middleware::basics::logger(opt);
```

Main options:

```txt
format
  Text or Json

log_request_id
  include request id when available

log_timing
  include request duration when available

level_from_status
  status >= 500 logs as error, status >= 400 logs as warn

include_user_agent
  include user-agent when present

include_forwarded_for
  include x-forwarded-for when present

require_timing
  decide what happens when timing data is missing
```

## Logger and order

Logger usually reads data produced by other middleware.

If you want request ids and timing in the log line, install request id and timing in a way that makes those values available before the logger writes the line.

A typical low-level pipeline can look like this:

```cpp
vix::middleware::HttpPipeline pipeline;

pipeline.use(vix::middleware::basics::request_id());
pipeline.use(vix::middleware::basics::timing());
pipeline.use(vix::middleware::basics::logger());
```

The logger calls `next()` first, then logs after the downstream work finishes. This is why it can read the final status code.

When using `vix::App`, use the app integration helpers and keep the same idea: request metadata should be created before a logger tries to include it.

## Recovery

`recovery()` catches exceptions thrown by downstream middleware or handlers.

Instead of allowing the exception to escape the request pipeline, it returns a normalized `500` response.

```cpp
#include <stdexcept>

#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::recovery_dev());

  app.get("/boom", [](vix::Request &req, vix::Response &res)
  {
    (void)req;
    (void)res;

    throw std::runtime_error("boom");
  });

  app.run(8080);

  return 0;
}
```

Response shape:

```json
{
  "status": 500,
  "code": "internal_server_error",
  "message": "Internal Server Error"
}
```

In development, recovery can include the exception message. In production, avoid exposing internal exception details to clients.

## RecoveryOptions

The low-level middleware can be configured with `RecoveryOptions`.

```cpp
vix::middleware::basics::RecoveryOptions opt;

opt.include_exception_message = false;
opt.code = "internal_server_error";
opt.message = "Internal Server Error";

auto mw = vix::middleware::basics::recovery(opt);
```

Main options:

```txt
include_exception_message
  include exception details in the response

include_code_location
  reserved for future code location details

code
  error code returned to the client

message
  error message returned to the client
```

## Recovery logging

Recovery can log crashes if an `IRecoveryLogger` service is available.

```cpp
struct RecoveryLogger : vix::middleware::basics::IRecoveryLogger
{
  void error(std::string_view msg) override
  {
    vix::log::error("{}", msg);
  }
};
```

The middleware logs the exception, request method, path, and request id when available.

This is optional. If no recovery logger is installed, recovery still returns the error response.

## Body limit

`body_limit()` rejects requests whose body is larger than the configured limit.

This should usually run before body parsers.

```txt
body_limit
  -> json parser
  -> handler
```

That way, oversized requests are rejected before the server tries to parse them.

## Use body limit with App

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::body_limit_dev());

  app.post("/api/data", [](vix::Request &req, vix::Response &res)
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

If the request body is too large, the middleware returns:

```txt
413 Payload Too Large
```

The route handler is not called.

## BodyLimitOptions

The low-level middleware can be configured with `BodyLimitOptions`.

```cpp
vix::middleware::basics::BodyLimitOptions opt;

opt.max_bytes = 1024 * 1024;
opt.apply_to_get = false;
opt.allow_chunked = true;

auto mw = vix::middleware::basics::body_limit(opt);
```

Main options:

```txt
max_bytes
  maximum allowed body size

apply_to_get
  apply the limit to GET requests

allow_chunked
  allow requests without Content-Length

should_apply
  custom predicate used to decide whether the middleware applies
```

## Content-Length behavior

`body_limit()` first checks the in-memory request body when it is available.

If the body is empty, it can fall back to the `Content-Length` header.

If `Content-Length` is larger than the configured limit, the request is rejected.

If `Content-Length` is missing and `allow_chunked` is `false`, the middleware returns:

```txt
411 Length Required
```

If `allow_chunked` is `true`, the request is allowed to continue.

## Apply body limit only to some requests

Use `should_apply` when the limit should apply only to specific routes or methods.

```cpp
vix::middleware::basics::BodyLimitOptions opt;

opt.max_bytes = 10 * 1024 * 1024;

opt.should_apply = [](const vix::middleware::Context &ctx)
{
  return ctx.req().path().rfind("/upload", 0) == 0;
};

auto mw = vix::middleware::basics::body_limit(opt);
```

This keeps the rule explicit.

## Common order for basics

A practical order is:

```txt
recovery
request_id
timing
body_limit
handler
```

If you add logger, place it so it can see the values you want to log.

A request logger usually needs:

```txt
request id
timing
final response status
```

So it should run in a position where those values are available when it writes the log line.

## Short-circuit behavior

Some basic middleware always calls `next()`.

```txt
request_id
timing
logger
```

Some basic middleware may stop the request.

```txt
body_limit
recovery
```

`body_limit()` stops the request when the body is too large.

`recovery()` stops the request when it catches an exception and sends a `500` response.

This behavior is intentional. Middleware should stop a request only when it has a clear response to return.

## State produced by basics

The basics group can store these request state values:

```txt
RequestId
Timing
```

`RequestId` is produced by `request_id()`.

```cpp
auto *rid = req.try_state<vix::middleware::basics::RequestId>();
```

`Timing` is produced by `timing()`.

```cpp
auto *timing = req.try_state<vix::middleware::basics::Timing>();
```

Both are request-scoped. They exist only for the current request.

## Errors produced by basics

The basics group can produce normalized errors.

`body_limit()` can return:

```txt
413 payload_too_large
411 length_required
```

`recovery()` can return:

```txt
500 internal_server_error
```

The exact response body uses the middleware error format.

## Low-level HttpPipeline example

Most applications should use `vix::App`.

Use `HttpPipeline` when testing middleware or building a custom integration.

```cpp
#include <vix/middleware.hpp>

int main()
{
  vix::middleware::HttpPipeline pipeline;

  pipeline.use(vix::middleware::basics::request_id());
  pipeline.use(vix::middleware::basics::timing());
  pipeline.use(vix::middleware::basics::body_limit({
    .max_bytes = 1024 * 1024
  }));

  return 0;
}
```

The pipeline can run without starting a server. This is useful for unit tests.

## Development and production

Development helpers are useful for examples and local applications.

```cpp
app.use(vix::middleware::app::recovery_dev());
app.use(vix::middleware::app::request_id_dev());
app.use(vix::middleware::app::timing_dev());
app.use(vix::middleware::app::body_limit_dev());
```

Production applications should choose explicit options where behavior matters.

Examples:

```txt
body size limit
whether exception messages are returned
whether timing headers are exposed
which logger backend is used
how request ids are accepted from upstream proxies
```

The helpers are a starting point, not a deployment policy.

## Summary

The basics group gives the request pipeline a clean foundation.

`request_id()` gives each request an identifier.

`timing()` measures downstream processing time.

`logger()` writes a request summary through an injected logger service.

`recovery()` catches exceptions and returns a normalized `500` response.

`body_limit()` rejects oversized bodies before expensive parsing or handler work.

Together, these middleware functions make the rest of the HTTP stack easier to observe, debug, and protect.

## Next steps

Continue with:

- [Security](./security)
- [Authentication](./authentication)
- [Parsers](./parsers)
- [Observability](./observability)
- [App Integration](./app-integration)
