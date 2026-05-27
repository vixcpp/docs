# Welcome to Vix.cpp

Vix.cpp is a modern C++ runtime and developer toolkit for building fast, reliable, production-ready applications with a smoother workflow.

Current version: **v2.6.0**

It gives C++ a direct development experience:

```bash
vix run main.cpp
```

And a complete project workflow:

```bash
vix new api
cd api
vix build
vix run
```

Vix is not just a web framework.

It is a runtime foundation for backend services, JSON APIs, WebSocket apps, CLI tools, AI agents, games, P2P systems, local-first systems, templates, fast builds, and production-ready C++ projects.

## Offline PDF

You can download the complete Vix.cpp documentation as a PDF:

- [Download the Vix.cpp Documentation PDF](/vixcpp-documentation.pdf)
- [Download the Vix.cpp Documentation PDF in French](/vixcpp-documentation-fr.pdf)

## What is Vix.cpp?

Vix.cpp helps you build C++ applications without starting every project by manually wiring the build system, runtime commands, logs, dependencies, modules, and development workflow.

C++ gives you power, performance, and control.

Vix gives you the missing application workflow around it.

> Keep the power of C++.
> Make the application workflow simpler.

Vix does not replace C++.

It gives C++ a runtime-oriented development experience.

## What you can build

With Vix.cpp, you can build:

- backend services
- HTTP servers
- JSON APIs
- WebSocket applications
- CLI tools
- C++ libraries
- template-based web applications
- AI agent applications
- game-oriented projects
- P2P systems
- local-first and offline-first systems
- production services behind Nginx and systemd

## Quick example

Create `server.cpp`:

```cpp
#include <vix.hpp>
using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.send("Hello from Vix.cpp");
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

## The core workflow

Run a single C++ file:

```bash
vix run main.cpp
```

Create a real project:

```bash
vix new api
cd api
vix build
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

## Install

Linux and macOS:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://vixcpp.com/install.ps1 | iex
```

More installation options:

[https://vixcpp.com/install](https://vixcpp.com/install)

## Runtime modules

Vix.cpp is designed as an application runtime layer, not only as an HTTP server.

```txt
agent        async        cache        cli          conversion
core         crypto       db           env          error
fs           game         io           json         kv
log          middleware   net          orm          os
p2p          p2p_http     path         process      reply
sync         template     tests        threadpool   time
utils        validation   webrpc       websocket
```

These modules give Vix a broader foundation for real applications: networking, async execution, storage, validation, middleware, templates, WebSocket, P2P, sync, AI agents, games, and production-oriented tooling.

## How Getting Started is organized

This section gives you the shortest path from zero to a running Vix application.

Read it in order:

1. [Installation](/getting-started/installation)
2. [Set Up Your Environment](/getting-started/setup-environment)
3. [Run Your First C++ File](/getting-started/run-your-first-file)
4. [Create Your First Project](/getting-started/create-your-first-project)
5. [Your First HTTP Server](/getting-started/first-http-server)

## Getting Started vs The Vix Book

Getting Started is short and practical.

It helps you move through the first workflow:

```txt
install -> verify -> run -> create project -> start server
```

The Vix Book goes deeper.

It explains the mental model behind Vix, then teaches routes, requests, responses, JSON APIs, middleware, validation, database, WebSocket, async runtime, cache, sync, P2P, and production deployment.

Start here first.

Then continue with the book when you want to understand Vix step by step.

## What you need

You only need basic C++ knowledge:

- functions
- headers
- `std::string`
- lambdas
- basic terminal usage

You do not need to be a CMake expert to start.

Vix can create a project, build it, run it, and give you a clean development loop.

## Built with Vix.cpp

### Kordex

A JavaScript and TypeScript runtime layer built on Vix and Softadastra.

[https://github.com/softadastra/kordex](https://github.com/softadastra/kordex)

### Softadastra

A local-first and offline-first runtime foundation for reliable applications.

[https://github.com/softadastra/softadastra](https://github.com/softadastra/softadastra)

### PulseGrid

Real-time service monitoring built with Vix.cpp.

[https://github.com/softadastra/PulseGrid](https://github.com/softadastra/PulseGrid)

### Vix Game

A game-oriented project built on the Vix.cpp runtime foundation.

[https://github.com/vixcpp/vix-game](https://github.com/vixcpp/vix-game)

## Links

- Website: [https://vixcpp.com](https://vixcpp.com)
- Registry: [https://registry.vixcpp.com](https://registry.vixcpp.com)
- Engineering notes: [https://blog.vixcpp.com](https://blog.vixcpp.com)
- GitHub: [https://github.com/vixcpp/vix](https://github.com/vixcpp/vix)

## First command to remember

```bash
vix run main.cpp
```

This command is the fastest way to run a C++ file with Vix.
When your app grows, move to a project:

```bash
vix new api
cd api
vix dev
```

## Next step

Install Vix on your machine.

Next: [Installation](/getting-started/installation)
