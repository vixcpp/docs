# What is Vix.cpp?

Vix.cpp is a modern C++ runtime and developer toolkit for building native applications with a clearer development workflow.

A Vix.cpp project is still a C++ project. The source files are written in C++, the compiler is a C++ compiler, the build output is a native executable or library, and existing tools such as CMake, Ninja, system packages, and native libraries remain part of the model. Vix.cpp does not ask developers to leave the C++ ecosystem behind; it gives the work around a C++ application a more consistent shape.

```txt
C++ source code
  -> Vix.cpp workflow
  -> native executable or library
```

The project exists because many C++ applications do not fail because of the language itself. They become difficult earlier, around the workflow: creating the project, configuring the build, running the binary, adding dependencies, checking errors, formatting code, running tests, preparing packages, and repeating the same setup across machines or CI.

Vix.cpp focuses on that part.

## The basic idea

With Vix.cpp, a single C++ file can be run directly:

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

During development, the same project can be started with:

```bash
vix dev
```

The important part is not only the commands themselves. The important part is that the project gets a repeatable workflow from the beginning. A developer should not have to rebuild the same development loop every time a C++ application starts to become real.

## Why Vix.cpp exists

C++ already gives developers performance, control, portability, mature compilers, native binaries, and a very large ecosystem. Those are not the problems Vix.cpp is trying to solve.

The difficult part is often the distance between a C++ source file and a complete application.

A real application usually needs a project structure, a build configuration, dependency handling, runtime commands, test commands, formatting, diagnostics, logs, packaging, installation paths, and production behavior. Experienced C++ developers know how to assemble those pieces, but the work is still repetitive. Newer developers often lose time before they reach the application logic.

Vix.cpp exists to make that path more direct.

It provides an application-oriented workflow around native C++ so that a project can move from experiment to application without losing the native model that makes C++ valuable.

## What Vix.cpp adds

Vix.cpp adds a layer around the application.

It gives common C++ tasks a predictable command surface:

```bash
vix run main.cpp
vix new app
vix build
vix run
vix dev
vix check
vix tests
vix fmt
vix pack
vix upgrade
```

It also provides runtime foundations for application development: HTTP applications, JSON APIs, WebSocket, middleware, validation, templates, database access, key-value storage, caching, process management, threading, synchronization, P2P systems, UI tooling, diagnostics, and production-oriented workflows.

The detailed module reference belongs in the module documentation. The main idea is simpler: Vix.cpp is not a collection of unrelated pieces. Its commands, runtime modules, SDK profiles, registry workflow, diagnostics, tests, and release process are meant to support one direction: building real native C++ applications with less workflow friction.

## Vix.cpp and CMake

Vix.cpp works with the existing C++ build ecosystem instead of pretending it does not exist.

For projects that already have a `CMakeLists.txt`, Vix.cpp can use the existing CMake project. This is useful for projects that need custom targets, advanced build options, installed packages, or direct build control.

For simpler projects, Vix.cpp can use a `vix.app` manifest and generate the internal CMake project needed to build the application.

```txt
Existing CMake project
  -> Vix uses the existing CMake project

Simple Vix project
  -> vix.app
  -> generated CMake
  -> native build output
```

This gives small projects a faster start while keeping a path open for larger projects that need full CMake control.

## Project models

Vix.cpp supports different ways a C++ project can begin.

A single file can be enough for an experiment:

```bash
vix run main.cpp
```

A new application can start as a Vix project:

```bash
vix new app
cd app
vix dev
```

An existing CMake project can still use Vix as a cleaner workflow layer:

```bash
vix build
vix run
vix tests
```

This matters because C++ projects do not all have the same shape. Some begin as one file, some become CLI tools, some become backend services, some become reusable libraries, and some already exist as larger CMake codebases. Vix.cpp gives these project styles a common workflow where it makes sense.

## SDK profiles

Starting with Vix.cpp v2.7.0, installation is split into two parts.

The installer bootstraps the CLI first. SDK profiles are then installed through the CLI depending on the kind of application being built.

```bash
vix upgrade --sdk list
vix upgrade --sdk info web
vix upgrade --sdk web
```

This keeps the first installation small and avoids forcing optional runtime dependencies on every user.

Different C++ applications do not need the same development layer. A small tool, a web backend, a data-backed service, a desktop shell, a P2P system, a game-oriented project, and an agent workflow can have different requirements.

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

For most projects, the right profile is better than installing everything.

## Vix.cpp compared to C++ web frameworks

Developers sometimes compare Vix.cpp with Drogon, Crow, and other C++ web frameworks because Vix.cpp can build HTTP services.

That comparison is understandable, but it is not the whole picture.

Drogon and Crow are mainly web frameworks. They answer the question: how do I build a C++ web service or HTTP application?

Vix.cpp answers a broader question: how do I create, run, build, test, package, upgrade, and maintain a native C++ application with a coherent workflow?

That is why Vix.cpp includes web runtime pieces but is not defined only by routing or HTTP handlers. The project is organized around the full application workflow: CLI, project models, build integration, SDK profiles, registry workflow, diagnostics, tests, documentation, releases, and runtime foundations.

## Example: run one file

Create `main.cpp`:

```cpp
#include <vix.hpp>

int main()
{
  vix::print("Hello from Vix.cpp");
  return 0;
}
```

Run it:

```bash
vix run main.cpp
```

This is the fastest way to try Vix.cpp.

## Example: create a project

Create a project:

```bash
vix new api
cd api
```

Start development mode:

```bash
vix dev
```

Build it:

```bash
vix build
```

Run it:

```bash
vix run
```

Run checks and tests:

```bash
vix check
vix tests
```

The project remains native C++, but the daily workflow is handled through Vix.

## What Vix.cpp is good for

Vix.cpp is useful when the goal is not only to compile C++ code, but to build and maintain a real application.

It can be used for backend services, HTTP APIs, WebSocket applications, command-line tools, reusable C++ libraries, database-backed applications, template-based applications, P2P systems, local-first systems, desktop shell workflows, and production-oriented services.

A project can also evolve over time. A single-file experiment can become a project. A simple project can later move to a full CMake structure. A backend can add database support. A project can install a different SDK profile when it needs a larger runtime surface.

## Design direction

Vix.cpp v2.7.0 is an important foundation point for the project.

After this release, the direction is not to keep adding modules just to make the project larger. The next phase is focused on improving what already exists: module quality, SDK profile workflow, registry workflow, diagnostics, tests, CI coverage, release quality, documentation, and real application validation.

New features can still happen, but they should earn their place. A feature belongs in Vix.cpp when it improves the existing workflow, strengthens an existing module, or solves a practical problem for real C++ applications.

The goal is a smaller surface with more depth, not a larger surface with less confidence.

## The mental model

A useful way to understand Vix.cpp is to separate the responsibilities.

```txt
C++:
  language, compiler model, native execution

CMake and Ninja:
  build system and ecosystem compatibility

Vix.cpp:
  application workflow, runtime foundations, CLI, SDK profiles,
  registry workflow, diagnostics, tests, packaging, and release path
```

Vix.cpp is strongest when the project needs to become more than a group of source files. It helps the application gain a workflow, a runtime foundation, and a path toward real use without losing the native C++ model.

## Next step

Now install Vix.cpp.

Next: [Installation](/getting-started/installation)
