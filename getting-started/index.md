# Welcome to Vix.cpp

## Offline PDF

You can download the complete Vix.cpp documentation as a PDF:

[Download the Vix.cpp Documentation PDF](/vixcpp-documentation.pdf)

[Download the Vix.cpp Documentation PDF in French](/vixcpp-documentation-fr.pdf)

Vix.cpp is a modern C++ runtime and developer toolkit for building fast, reliable applications with a smoother workflow.

It gives C++ a direct development experience:

```bash
vix run main.cpp
```

And a project workflow:

```bash
vix new api
cd api
vix build
vix run
```

## What is Vix.cpp?

Vix.cpp helps you build C++ applications without starting every project by manually wiring the build system, runtime commands, logs, dependencies, and development workflow.

The goal is simple:

> Keep the power of C++, make the application workflow simpler.

Vix does not replace C++.

It gives C++ a runtime-oriented workflow around it.

## What you can build

With Vix, you can build:

- HTTP servers
- JSON APIs
- backend services
- WebSocket apps
- CLI tools
- C++ libraries
- template-based web apps
- local-first and offline-first systems
- production services behind Nginx and systemd

A minimal Vix HTTP app looks like this:

```cpp
#include <vix.hpp>
using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.json({
      "message", "Hello from Vix",
      "framework", "Vix.cpp"
    });
  });

  app.run(8080);

  return 0;
}
```

Run it:

```bash
vix run main.cpp
```

Then open:

```txt
http://localhost:8080/
```

## The core workflow

For a single C++ file:

```bash
vix run main.cpp
```

For a real project:

```bash
vix new api
cd api
vix build
vix run
```

For development mode:

```bash
vix dev
```

For checks and tests:

```bash
vix check
vix tests
```

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

It helps you:

```txt
install → verify → run → create project → start server
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

