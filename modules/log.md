# Log

The **log module** provides a clean, stable, and high-level logging API
for Vix applications.

It is built as a **facade** over the internal `vix::utils::Logger`,
exposing a consistent and developer-friendly interface while reusing
a powerful logging backend.

## Philosophy

Logging in Vix follows strict principles:

- No duplication of logging engines
- Simple public API (`vix::log`)
- Structured logging by default
- Explicit configuration
- Thread-local context support
- High performance (delegated to utils)

The module is designed to be:

- easy to use
- easy to integrate
- stable across versions
- consistent across all Vix modules

## Architecture

```
vix::utils::Logger → core logging engine
vix::log           → public facade (this module)
```

The `log` module does not implement logging itself.
It delegates all operations to `vix::utils::Logger`.

## Quick Start

```cpp
#include <vix/log/Log.hpp>

int main()
{
  vix::log::info("Hello world");
  vix::log::warn("Low disk space");
  vix::log::error("Failed to open file");
}
```

## Log Levels

```cpp
vix::log::set_level(vix::log::LogLevel::Debug);
```

Available levels:

- Trace
- Debug
- Info
- Warn
- Error
- Critical
- Off

## Structured Logging

```cpp
vix::log::logf(
  vix::log::LogLevel::Info,
  "request completed",
  "status", 200,
  "method", "GET",
  "path", "/api/users"
);
```

## Output Formats

```cpp
vix::log::set_format(vix::log::LogFormat::KV);
vix::log::set_format(vix::log::LogFormat::JSON);
vix::log::set_format(vix::log::LogFormat::JSON_PRETTY);
```

## Context (Thread-Local)

Attach metadata to all logs in a scope:

```cpp
vix::log::LogContext ctx;
ctx.request_id = "req-123";
ctx.module = "auth";
ctx.fields["user_id"] = "42";

vix::log::set_context(ctx);

vix::log::info("user logged in");

vix::log::clear_context();
```

## Configuration

```cpp
vix::log::LogConfig config;
config.level = vix::log::LogLevel::Info;
config.format = vix::log::LogFormat::JSON;
config.async = true;

vix::log::configure(config);
```

## Environment Configuration

```cpp
vix::log::set_level_from_env();   // VIX_LOG_LEVEL
vix::log::set_format_from_env();  // VIX_LOG_FORMAT
```

## Examples

Located in `examples/`:

- basic.cpp → basic logging
- context.cpp → context usage
- format.cpp → format switching

## Tests

Located in `test/`:

- log_test.cpp

Run:

```bash
ctest
```

## Dependencies

This module depends on:

- `vix::utils` (logging backend)

No direct dependency on spdlog is exposed publicly.

## Design Goals Recap

- Simple API
- No duplication
- Structured logging first
- Context-aware
- High performance
- Stable interface
