# Module categories

## Foundation modules

These modules provide basic building blocks used by other parts of Vix.

- `core`
- `error`
- `log`
- `env`
- `time`
- `utils`
- `conversion`

Read these when you want to understand the lower-level foundation.

## Application modules

These modules are used when building web applications and APIs.

- `json`
- `middleware`
- `validation`
- `template`
- `db`
- `orm`
- `websocket`

They are the most common modules for backend applications.

## Runtime modules

These modules support advanced runtime behavior.

- `async`
- `cache`
- `sync`
- `p2p`
- `p2p-http`
- `net`
- `io`
- `process`
- `os`
- `fs`
- `path`

They are useful when building real systems that need concurrency, networking, offline-first behavior, or distributed communication.

## Developer workflow modules

These modules support how developers build and test projects.

- `cli`
- `tests`

The CLI module is central to the Vix development experience.

## Full module list

### Async

Low-level coroutine runtime.

Use it for: `io_context`, `task<T>`, scheduler, timers, signals, thread pool, async TCP, async UDP, DNS, cancellation.

### Cache

Caching layer for faster reads and resilience.
Use it for: memory cache, file cache, TTL, stale data, cache policies.

### CLI

Command-line workflow for creating, running, building, checking, testing, and managing Vix projects.

Use it for: `vix run`, `vix dev`, `vix build`, `vix check`, `vix tests`, `vix new`, `vix add`, `vix install`.

### Conversion

Helpers for converting values between formats.
Use it for: string conversion, numeric conversion, type conversion helpers.

### Core

Core primitives and runtime foundation.
Use it for: base types, runtime concepts, shared primitives, application foundation.

### Crypto

Cryptographic helpers.
Use it for: hashing, signing, keys, secure identifiers, protocol crypto helpers.

### DB

Database access layer.
Use it for: SQLite, MySQL, connections, prepared statements, queries, transactions.

### Env

Environment and configuration support.
Use it for: `.env` files, runtime settings, server port, database configuration, logging configuration, WebSocket configuration.

### Error

Error handling primitives.
Use it for: structured errors, error codes, safe error responses, diagnostics.

### FS

Filesystem helpers.
Use it for: files, directories, safe filesystem operations, local storage.

### IO

Input and output helpers.
Use it for: streams, buffers, read/write helpers, I/O utilities.

### JSON

JSON value and object helpers.
Use it for: JSON objects, JSON arrays, JSON responses, parsing, serialization.

### Log

Logging utilities.
Use it for: info logs, debug logs, error logs, async logging, structured runtime logs.

### Middleware

Middleware system for logic around routes.
Use it for: CORS, rate limiting, security headers, auth, sessions, JWT, API keys, request context.

### Net

Network helpers.
Use it for: network probe, connectivity checks, network-related utilities.

### ORM

Higher-level database mapping.
Use it for: models, repositories, query helpers, data mapping.

### OS

Operating system helpers.
Use it for: platform checks, system utilities, OS-level behavior.

### P2P

Peer-to-peer runtime.
Use it for: nodes, peers, handshakes, discovery, bootstrap, routing, distributed sync.

### P2P HTTP

HTTP control routes for P2P runtimes.
Use it for: `GET /p2p/ping`, `GET /p2p/status`, `GET /p2p/peers`, `POST /p2p/connect`, `GET /p2p/logs`.

### Path

Path utilities.
Use it for: joining paths, normalizing paths, safe path handling.

### Process

Process helpers.
Use it for: process utilities, command execution, runtime process helpers.

### Sync

Offline-first synchronization engine.
Use it for: WAL, outbox, retry, sync worker, sync engine, durable operations.

### Template

HTML template rendering.
Use it for: views, layouts, partials, variables, loops, conditionals.

### Tests

Testing helpers.
Use it for: unit tests, test utilities, project validation.

### Time

Time utilities.
Use it for: timestamps, durations, time helpers.

### Utils

General utilities shared across Vix.
Use it for: strings, helpers, small reusable utilities.

### Validation

Input validation helpers.
Use it for: required fields, string validation, email validation, payload validation, error reporting.

### WebRPC

RPC-style web communication.
Use it for: remote procedure calls, structured web methods, typed web communication.

### WebSocket

Realtime communication.
Use it for: chat, notifications, presence, live dashboards, typed realtime events.

## How modules fit together

**A normal API may use:**
`core` · `json` · `middleware` · `validation` · `db` · `log` · `env`

**A realtime app may add:**
`websocket` · `async`

**An offline-first app may add:**
`cache` · `sync` · `p2p` · `p2p-http`

**A production app may combine:**
`env` · `log` · `middleware` · `db` · `validation` · `websocket` · `sync`

## Example: API stack

```text
Request
  ↓
middleware
  ↓
validation
  ↓
service
  ↓
db
  ↓
json response
```

Modules involved: `middleware`, `validation`, `db`, `json`, `error`, `log`

## Example: realtime stack

```text
HTTP app
  ↓
WebSocket server
  ↓
typed events
  ↓
broadcast
```

Modules involved: `websocket`, `async`, `json`, `log`, `env`

## Example: offline-first stack

```text
local write
  ↓
WAL
  ↓
outbox
  ↓
sync worker
  ↓
transport
  ↓
done or retry
```

Modules involved: `sync`, `cache`, `p2p`, `net`, `log`

## Which module should I read first?

If you are building a **normal backend API**, start with:
`json` · `middleware` · `validation` · `db`

If you are building **realtime features**, read:
`websocket` · `async`

If you are building **offline-first or distributed systems**, read:
`cache` · `sync` · `p2p` · `p2p-http`

If you are learning the **Vix developer workflow**, read:
`cli`

## What you should remember

Vix modules are focused building blocks.

The main application header is:

```cpp
#include <vix.hpp>
```

Specific modules have their own headers:

```cpp
#include <vix/json.hpp>
#include <vix/db.hpp>
#include <vix/cache.hpp>
#include <vix/sync.hpp>
#include <vix/p2p.hpp>
```

The core idea:

- Use `vix.hpp` for the main app.
- Use module headers when you need a specific system.

## Next

[Core module](/modules/core)
