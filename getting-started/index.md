# Welcome to Vix.cpp

Vix.cpp is a modern C++ runtime and developer toolkit for building native applications with a clearer development workflow.

It keeps the C++ model intact: real C++ source files, real compilers, real native binaries, and compatibility with the existing build ecosystem. What Vix.cpp adds is the application layer around the project: commands, project structure, runtime foundations, SDK profiles, registry workflow, diagnostics, tests, formatting, packaging, and development workflows.

Current version: **v2.7.0**

A single C++ file can be run directly:

```bash
vix run main.cpp
```

A project can be created, built, and started through the same command surface:

```bash
vix new api
cd api
vix build
vix run
```

Vix.cpp is not only an HTTP framework. It is a runtime foundation and developer toolkit for native C++ applications. It can be used for backend services, JSON APIs, WebSocket applications, command-line tools, reusable libraries, template-based applications, P2P systems, local-first systems, data workflows, desktop shells, and production-oriented C++ projects.

## Offline PDF

You can download the complete Vix.cpp documentation as a PDF:

- [Download the Vix.cpp Documentation PDF](/vixcpp-documentation.pdf)
- [Download the Vix.cpp Documentation PDF in French](/vixcpp-documentation-fr.pdf)

## What Vix.cpp is for

C++ gives developers performance, control, portability, mature compilers, and access to a large ecosystem. The challenge is often not the language itself, but the workflow around the application.

A real C++ application usually needs more than source files:

- project creation
- build configuration
- dependency setup
- runtime commands
- tests
- formatting
- logs
- diagnostics
- packaging
- SDK installation
- release preparation
- production preparation

These pieces are often assembled manually with CMake files, shell scripts, CI configuration, package tools, formatting tools, and project-specific conventions.

Vix.cpp brings the common parts of that workflow into one application-oriented toolchain.

```txt
C++ source code
  -> Vix.cpp workflow
  -> native executable or library
```

The goal is not to replace C++. The goal is to make the path from C++ code to a working application more direct.

## How Vix.cpp fits into the C++ ecosystem

Vix.cpp works above the native C++ toolchain.

It can use CMake and Ninja when needed. It can work with existing `CMakeLists.txt` projects. For simpler projects, it can use a `vix.app` manifest and generate the internal CMake project automatically.

```txt
Existing CMake project:
  CMakeLists.txt -> Vix workflow -> build and run

Simple Vix project:
  vix.app -> generated CMake -> build and run
```

This keeps Vix.cpp compatible with the C++ ecosystem while giving developers a cleaner command surface for daily work.

## Installation model in v2.7.0

Starting with **Vix.cpp v2.7.0**, installation is split into two steps.

First, install the CLI:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

On Windows PowerShell:

```powershell
irm https://vixcpp.com/install.ps1 | iex
```

Then install the SDK profile required by the kind of application you are building:

```bash
vix upgrade --sdk list
vix upgrade --sdk info web
vix upgrade --sdk web
```

This keeps the first installation small and avoids forcing optional runtime dependencies on every user.

The CLI is the bootstrap. SDK profiles provide the native development layer used by Vix.cpp projects.

## SDK profiles

SDK profiles let Vix.cpp install by application domain.

Different C++ applications do not need the same runtime surface. A small CLI tool, a web backend, a data-backed application, a desktop shell, a peer-to-peer system, a game-oriented project, and an agent workflow can have different requirements.

Common profiles include:

| Profile   | Use it for                                                                       |
| --------- | -------------------------------------------------------------------------------- |
| `default` | Normal Vix.cpp projects and local development                                    |
| `web`     | HTTP apps, APIs, WebSocket, middleware, validation, crypto, WebRPC, and requests |
| `data`    | Database, ORM, key-value storage, and cache workflows                            |
| `desktop` | Desktop apps using the Vix UI desktop shell                                      |
| `p2p`     | Peer-to-peer networking and local-first systems                                  |
| `game`    | Game-oriented and realtime application workflows                                 |
| `agent`   | Local agent tooling and controlled automation workflows                          |
| `all`     | Full SDK profile for advanced development and release validation                 |

For a normal web backend or API:

```bash
vix upgrade --sdk web
```

For database or ORM workflows:

```bash
vix upgrade --sdk data
```

For desktop UI apps:

```bash
vix upgrade --sdk desktop
```

Use `all` only when the machine really needs the full SDK.

## What you can build

With Vix.cpp, you can build:

- backend services
- HTTP servers
- JSON APIs
- WebSocket applications
- command-line tools
- reusable C++ libraries
- template-based web applications
- P2P systems
- local-first and offline-first systems
- database-backed applications
- desktop shell applications
- production services behind Nginx and systemd

Different project types can use different SDK profiles and modules, but the development workflow remains familiar.

## Quick example

Create `server.cpp`:

```cpp
#include <vix.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.text("Hello from Vix.cpp");
  });

  app.run(8080);

  return 0;
}
```

Run it:

```bash
vix run server.cpp
```

Open:

```txt
http://localhost:8080/
```

This is still native C++. Vix.cpp provides the workflow that builds and runs it.

## The core workflow

Run a single C++ file:

```bash
vix run main.cpp
```

Create a project:

```bash
vix new api
cd api
```

Build it:

```bash
vix build
```

Run it:

```bash
vix run
```

Start development mode:

```bash
vix dev
```

Run checks and tests:

```bash
vix check
vix tests
```

Format source files:

```bash
vix fmt
```

Install or inspect SDK profiles:

```bash
vix upgrade --sdk list
vix upgrade --sdk info web
vix upgrade --sdk web
```

## Install

Linux and macOS:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://vixcpp.com/install.ps1 | iex
```

Then inspect and install a SDK profile:

```bash
vix upgrade --sdk list
vix upgrade --sdk info web
vix upgrade --sdk web
```

More installation options:

https://vixcpp.com/install

## Runtime foundation

Vix.cpp is designed as an application runtime layer, not only as a web server.

It provides foundations for application workflow, HTTP applications, JSON APIs, WebSocket, validation, middleware, database access, caching, key-value storage, process management, threading, synchronization, UI tooling, diagnostics, local-first systems, and production-oriented workflows.

The detailed module reference belongs in the documentation. The important idea is that Vix.cpp is not a pile of unrelated modules. Its modules exist to support one direction: native C++ applications with a clearer workflow from development to production.

A backend service may use HTTP, JSON, validation, middleware, logging, database access, and tests.

A CLI tool may use filesystem utilities, formatted output, process handling, packaging, and diagnostics.

A local-first application may use storage, sync, caching, P2P, and reliability-oriented modules.

## Getting Started path

This section gives the shortest path from installation to a running Vix application.

Read it in order:

1. [What is Vix.cpp?](/getting-started/what-is-vixcpp)
2. [Installation](/getting-started/installation)
3. [Set Up Your Environment](/getting-started/setup-environment)
4. [Run Your First C++ File](/getting-started/run-your-first-file)
5. [Create Your First Project](/getting-started/create-your-first-project)
6. [Your First HTTP Server](/getting-started/first-http-server)

The goal is to understand the workflow first, then move into deeper concepts.

## Getting Started vs The Vix Book

Getting Started is practical. It focuses on the first path:

```txt
install -> verify -> run -> create project -> start server
```

The Vix Book goes deeper. It explains the mental model behind Vix.cpp, then covers application structure, routes, requests, responses, JSON APIs, middleware, validation, database access, WebSocket, async runtime, cache, sync, P2P, and production deployment.

Start with Getting Started if you want to run something quickly.

Continue with The Vix Book when you want to understand the design and build larger applications.

## What you need

You only need basic C++ knowledge to begin:

- functions
- headers
- `std::string`
- lambdas
- basic terminal usage

You do not need to be a CMake expert to start.

Vix.cpp can create a project, build it, run it, test it, format it, check it, and give you a clean development loop.

## Projects around Vix.cpp

### Rix

Rix is the unified userland library layer for Vix.cpp.

Vix provides the runtime, CLI, build workflow, registry integration, SDK profiles, and core foundations. Rix provides optional userland packages and a cleaner facade for application-level libraries.

https://rix.vixcpp.com

### Pico

Pico is a real application built with Vix.cpp.

It exists to keep the runtime honest by validating Vix.cpp inside a working application, where routing, middleware, persistence, diagnostics, runtime behavior, and developer workflow have to work together.

https://pico.vixcpp.com

### Cnerium

Cnerium is a reliability-first backend layer for Vix.

It belongs above the core runtime, where application reliability, backend structure, and production-oriented patterns can evolve without turning Vix itself into a large opinionated framework.

https://github.com/softadastra/cnerium

### Kordex

Kordex is a JavaScript runtime for reliable local-first applications, built with Vix.cpp.

It shows how Vix can be used as the native foundation for higher-level runtimes and local-first application platforms.

https://github.com/softadastra/kordex

## Links

- Website: https://vixcpp.com
- Documentation: https://docs.vixcpp.com
- Registry: https://registry.vixcpp.com
- Engineering notes: https://blog.vixcpp.com
- GitHub: https://github.com/vixcpp/vix

## First command to remember

```bash
vix run main.cpp
```

This is the fastest way to try Vix.cpp with a single C++ file.

When the code grows into an application, move to a project:

```bash
vix new api
cd api
vix dev
```

## Next step

Understand the role of Vix.cpp in the C++ ecosystem.

Next: [What is Vix.cpp?](/getting-started/what-is-vixcpp)
