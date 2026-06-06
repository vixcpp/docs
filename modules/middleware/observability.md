# Observability

The `observability` group contains middleware and hooks for understanding what happens during HTTP request handling.

It provides tracing, metrics, and debug traces. These features help connect a request to its response, measure request activity, and inspect request flow during development.

For most application code, include:

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>
```

The observability middleware lives under:

```cpp
namespace vix::middleware::observability
```

The lower-level pipeline support is available through:

```cpp
vix::middleware::HttpPipeline
```

## What observability provides

The observability group includes:

```txt
tracing_hooks()
  installs trace and span identifiers through pipeline hooks

tracing_mw()
  installs trace and span identifiers as normal middleware

metrics_hooks()
  records counters and durations through pipeline hooks

metrics_mw()
  records counters and durations as normal middleware

debug_trace_hooks()
  writes readable begin, end, and error trace lines through hooks

debug_trace_mw()
  writes readable begin and end trace lines as normal middleware
```

The module supports two integration styles:

```txt
hooks
  useful with HttpPipeline and pipeline-level observability

middleware
  useful when you want observability as a normal middleware function
```

Both styles are useful. The right one depends on how much control you need.

## Observability and the request flow

Observability usually wraps request handling.

```txt
request begins
  -> trace id is created
  -> metrics counter is incremented
  -> handler runs
  -> duration is recorded
  -> response headers are emitted
```

Some observability features are visible to clients through headers.

Other features go to sinks, such as in-memory collectors, metrics exporters, or debug log collectors.

## Tracing

Tracing gives each request identifiers that can be used to connect logs, metrics, and responses.

The tracing middleware stores:

```cpp
vix::middleware::observability::TraceContext
```

`TraceContext` contains:

```txt
trace_id
span_id
parent_span_id
```

By default, tracing can emit response headers such as:

```txt
x-trace-id
x-span-id
```

## Use tracing as middleware

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::adapt_ctx(
    vix::middleware::observability::tracing_mw()
  ));

  app.get("/", [](vix::Request &req, vix::Response &res)
  {
    auto *trace =
      req.try_state<vix::middleware::observability::TraceContext>();

    res.json({
      "trace_id", trace ? trace->trace_id : ""
    });
  });

  app.run(8080);

  return 0;
}
```

Response shape:

```json
{
  "trace_id": "..."
}
```

The response can also include:

```txt
x-trace-id: ...
x-span-id: ...
```

## Incoming trace ids

Tracing can accept an incoming trace id.

Request shape:

```bash
curl -i \
  http://127.0.0.1:8080/ \
  -H "x-trace-id: 0123456789abcdef0123456789abcdef"
```

If the incoming trace id is valid, the middleware keeps it.

If it is missing or invalid, the middleware generates a new one.

The middleware always creates a new span id for the current request.

## Configure tracing

Use `TracingOptions` when you need explicit behavior.

```cpp
vix::middleware::observability::TracingOptions opt;

opt.trace_header = "x-trace-id";
opt.span_header = "x-span-id";
opt.parent_span_header = "x-parent-span-id";

opt.accept_incoming_trace = true;
opt.accept_incoming_span = true;
opt.emit_response_headers = true;
opt.include_parent_in_response = false;

auto mw = vix::middleware::observability::tracing_mw(opt);
```

Main options:

```txt
trace_header
  request and response header used for the trace id

span_header
  request and response header used for the span id

parent_span_header
  response header used for the parent span id when enabled

accept_incoming_trace
  accept a valid incoming trace id

accept_incoming_span
  accept a valid incoming span id as parent_span_id

emit_response_headers
  write trace headers to the response

include_parent_in_response
  include the parent span id in the response when present

enrich
  optional callback used to enrich TraceContext
```

## Enrich tracing context

The `enrich` callback lets the application attach extra behavior while the trace context is being built.

```cpp
vix::middleware::observability::TracingOptions opt;

opt.enrich = [](vix::middleware::Context &ctx,
                vix::middleware::observability::TraceContext &trace)
{
  (void)ctx;

  if (trace.trace_id.empty())
    return;
};

auto mw = vix::middleware::observability::tracing_mw(opt);
```

The current `TraceContext` contains trace and span identifiers. Application-specific correlation can be added around it in your own middleware or logging layer.

## Tracing hooks

Hooks are useful when using `HttpPipeline`.

```cpp
#include <vix/middleware.hpp>

int main()
{
  vix::middleware::HttpPipeline pipeline;

  pipeline.set_hooks(
    vix::middleware::observability::tracing_hooks()
  );

  return 0;
}
```

Tracing hooks use the pipeline lifecycle:

```txt
on_begin
  create TraceContext, store it in request state, emit headers

on_end
  re-emit headers after downstream work

on_error
  re-emit headers on middleware error path
```

This helps keep trace headers present even when response handling changes downstream.

## Metrics

Metrics records counters and duration observations for requests.

The metrics middleware can count:

```txt
requests
responses
errors
duration observations
```

Metrics are written to a metrics sink.

The module provides an in-memory sink for tests and local inspection.

```cpp
vix::middleware::observability::InMemoryMetrics
```

Production applications can provide their own sink that exports to their monitoring system.

## Use metrics as middleware

```cpp
#include <memory>

#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  auto metrics =
    std::make_shared<vix::middleware::observability::InMemoryMetrics>();

  app.use(vix::middleware::app::adapt_ctx(
    vix::middleware::observability::metrics_mw(metrics)
  ));

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

This example uses in-memory metrics. It is useful for tests and local inspection.

A real application can implement a custom metrics sink and forward observations to the monitoring backend it uses.

## Metrics sink

A metrics sink receives metric updates from the middleware.

The in-memory sink is useful when you want to inspect values directly in tests.

Example with `HttpPipeline`:

```cpp
auto sink =
  std::make_shared<vix::middleware::observability::InMemoryMetrics>();

vix::middleware::HttpPipeline pipeline;

pipeline.set_hooks(
  vix::middleware::observability::metrics_hooks(sink)
);
```

After running a request, tests can inspect counters and observations.

```cpp
auto total = sink->counter("vix_http_requests_total");
```

The exact metric names depend on the configured prefix.

## Configure metrics

Use `MetricsOptions` when you need explicit labels and naming.

```cpp
vix::middleware::observability::MetricsOptions opt;

opt.prefix = "vix_http";
opt.include_method = true;
opt.include_path = true;
opt.include_status = true;

auto hooks =
  vix::middleware::observability::metrics_hooks(sink, opt);
```

Common options include:

```txt
prefix
  metric name prefix

include_method
  include the HTTP method in labels

include_path
  include the request path in labels

include_status
  include the response status in labels
```

Be careful with path labels in production. Raw paths can create too many metric series if they contain ids or unbounded values.

For example:

```txt
/api/users/1
/api/users/2
/api/users/3
```

can become many separate label values.

A production metrics backend usually prefers route patterns or normalized paths.

## Debug trace

Debug trace writes readable request lifecycle lines.

It is meant for local development, tests, and low-level inspection.

A debug trace can emit lines such as:

```txt
[vix.debug] begin method=GET path=/api/status
[vix.debug] end method=GET path=/api/status status=200 ms=1.2
```

Debug tracing is not a replacement for structured logging or metrics. It is a simple way to see the middleware flow.

## Use debug trace as middleware

```cpp
#include <memory>

#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  auto debug =
    std::make_shared<vix::middleware::observability::InMemoryDebugTrace>();

  app.use(vix::middleware::app::adapt_ctx(
    vix::middleware::observability::debug_trace_mw(debug)
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

This stores debug lines in memory. For a real application, provide a sink that writes where you want the lines to go.

## Debug trace sink

A debug trace sink implements:

```cpp
vix::middleware::observability::IDebugTraceSink
```

A simple sink can forward lines to Vix logging.

```cpp
struct DebugSink : vix::middleware::observability::IDebugTraceSink
{
  void log(std::string_view line) override
  {
    vix::log::debug("{}", line);
  }
};
```

The middleware produces the line. The sink decides where it goes.

## Configure debug trace

Use `DebugTraceOptions` to choose what appears in the line.

```cpp
vix::middleware::observability::DebugTraceOptions opt;

opt.include_method = true;
opt.include_path = true;
opt.include_status = true;
opt.include_duration_ms = true;
opt.prefix = "[vix.debug]";

auto mw =
  vix::middleware::observability::debug_trace_mw(debug_sink, opt);
```

Main options:

```txt
include_method
  include the HTTP method

include_path
  include the request path

include_status
  include response status in end logs

include_duration_ms
  include elapsed milliseconds in end logs

include_trace_ids
  reserved for trace integration

prefix
  prefix added to every debug line
```

## Debug trace hooks

Debug trace hooks use the pipeline lifecycle.

```cpp
auto debug =
  std::make_shared<vix::middleware::observability::InMemoryDebugTrace>();

vix::middleware::HttpPipeline pipeline;

pipeline.set_hooks(
  vix::middleware::observability::debug_trace_hooks(debug)
);
```

Hook behavior:

```txt
on_begin
  store start time and log begin

on_end
  compute elapsed time and log end

on_error
  log error code and status
```

The middleware variant logs begin and end around `next()`. The hook variant also integrates with the pipeline error hook.

## Development observability

`HttpPipeline` can enable a default development observability setup.

```cpp
vix::middleware::HttpPipeline pipeline;

pipeline.enable_dev_observability();
```

This installs tracing, metrics, and debug tracing hooks with default in-memory sinks.

By default, this only runs when the environment indicates development.

Accepted development values are:

```txt
VIX_ENV=dev
VIX_ENV=development
VIX_ENV=local
```

This is useful for tests, local tools, and custom pipeline usage.

## Force development observability

You can disable the environment check.

```cpp
vix::middleware::HttpPipeline pipeline;

pipeline.enable_dev_observability(false);
```

This enables the observability hooks even when `VIX_ENV` is not set to a development value.

Use this intentionally. Development observability is useful, but production applications usually need explicit sinks and controlled metric labels.

## Custom development sinks

You can pass custom sinks to `enable_dev_observability`.

```cpp
vix::middleware::HttpPipeline::DevObservabilitySinks sinks;

sinks.metrics =
  std::make_shared<vix::middleware::observability::InMemoryMetrics>();

sinks.debug =
  std::make_shared<vix::middleware::observability::InMemoryDebugTrace>();

vix::middleware::HttpPipeline pipeline;

pipeline.enable_dev_observability(sinks);
```

If a sink is missing, the pipeline creates a default in-memory one.

## Hooks and merge order

`HttpPipeline` supports merged hooks.

This allows tracing, metrics, and debug trace to run together.

```cpp
using namespace vix::middleware;
using namespace vix::middleware::observability;

auto hooks = merge_hooks(
  tracing_hooks(),
  metrics_hooks(metrics_sink),
  debug_trace_hooks(debug_sink)
);

pipeline.set_hooks(std::move(hooks));
```

When hooks are merged, begin hooks run in the order they are merged, and end hooks run in reverse wrapping order.

This preserves the normal middleware shape:

```txt
begin A
begin B
handler
end B
end A
```

## Observability middleware versus hooks

Use middleware when you want observability as one item in a normal middleware chain.

```txt
middleware_a
  -> tracing_mw
  -> middleware_b
  -> handler
```

Use hooks when observability should attach to the pipeline lifecycle itself.

```txt
on_begin
  -> middleware chain
  -> handler
on_end
```

For `vix::App`, middleware style is usually easier.

For `HttpPipeline`, hooks are often more direct.

## Reading observability state

Tracing stores `TraceContext` in request state.

```cpp
auto *trace =
  req.try_state<vix::middleware::observability::TraceContext>();

if (trace)
{
  vix::print("trace", trace->trace_id);
}
```

Debug trace stores a start marker internally when using hooks.

Metrics writes to a sink.

Different observability features expose data in different places because they serve different purposes:

```txt
tracing
  request state and response headers

metrics
  metrics sink

debug trace
  debug trace sink
```

## Relationship with basics

The basics group already provides request IDs and timing.

Observability adds trace identifiers, metrics, and debug traces.

They can be used together.

```txt
request_id
  useful for logs and client support

timing
  useful for response timing headers

tracing
  useful for correlation across systems

metrics
  useful for aggregated measurement

debug_trace
  useful for local flow inspection
```

Use the smallest set that gives the visibility you need.

## Relationship with log

`vix::log` is the application logging module.

Observability middleware does not replace it.

Debug trace and request logging can forward to `vix::log` through custom sinks or logger implementations.

This keeps the middleware independent from one logging backend while still making integration simple.

## Common order

For a simple application, request metadata can run early.

```txt
recovery
request_id
timing
tracing
security
parsers
auth
handler
metrics/debug end
```

This is not a fixed rule. The correct order depends on what each middleware needs.

Tracing can run early so trace ids are available to later middleware and handlers.

Metrics usually wraps the handler so it can count final status and duration.

Debug trace can wrap the flow when you want begin and end lines.

## Development and production

Development observability can use in-memory sinks and debug lines.

Production observability should usually use explicit integrations.

Important production decisions include:

```txt
where metrics are exported
which labels are safe
whether raw paths should be included
where trace ids are propagated
which headers are accepted from upstream
where debug traces are written
whether debug traces should be enabled at all
```

Avoid enabling noisy debug traces globally in production unless that is an intentional operational choice.

## What this module does not do

The observability group does not provide a full distributed tracing backend.

It does not provide a metrics server by itself.

It does not decide your logging storage.

It does not normalize application route patterns automatically.

It does not replace monitoring infrastructure.

It gives middleware-level hooks and sinks so Vix applications can expose request behavior clearly.

## Summary

`tracing` gives each request trace and span identifiers.

`metrics` records request counters, response counters, and duration observations.

`debug_trace` writes readable request lifecycle lines.

Hooks integrate observability at the `HttpPipeline` lifecycle level.

Middleware variants integrate observability as normal middleware.

Use development helpers for local inspection and explicit sinks for serious applications.

## Next steps

Continue with:

- [HTTP Cache](./http-cache)
- [Performance](./performance)
- [App Integration](./app-integration)
- [API Reference](./api-reference)
