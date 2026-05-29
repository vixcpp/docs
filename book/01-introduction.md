# Introduction

Welcome to the Vix Book.
This book teaches the modern Vix workflow for building real C++ applications.
Not only how to run one file.
Not only how to write an HTTP route.
Not only how to compile a project.

The goal is bigger:

```txt
one C++ file
  -> application
  -> runtime workflow
  -> build workflow
  -> modules
  -> production
```

Vix exists to make this path clear.

## The idea

C++ is powerful, fast, and mature.

But the workflow around C++ applications can be difficult.

A developer often has to think about many things before the application itself becomes real:

```txt
compiler flags
build folders
CMake configuration
dependencies
development mode
tests
runtime arguments
logs
services
Nginx
health checks
deployment
```

Vix brings those workflows into one application-oriented CLI.

The first step can be simple:

```bash
vix run main.cpp
```

Then the project step can also be simple:

```bash
vix new api --template backend
cd api
vix dev
```

That is the spirit of Vix.

## What Vix is

Vix is a modern C++ runtime and application workflow.

It helps you:

```txt
run C++ files
create applications
use vix.app
build projects
run development mode
compose modules
manage dependencies
check and test code
generate files
package projects
inspect local state
replay runs
prepare production
manage services
configure proxies
check health
read logs
deploy
```

Vix does not replace C++.

Vix does not replace your understanding of C++.

Vix gives C++ a clearer workflow for real application development.

## The first command

The smallest Vix workflow is:

```bash
vix run main.cpp
```

Example:

```cpp
#include <vix.hpp>

int main()
{
  vix::print("Hello from Vix");
  return 0;
}
```

Run it:

```bash
vix run main.cpp
```

This is the beginning:

```txt
file
  -> run
  -> feedback
```

But this book is not only about running one file.

That is only the entry point.

## From file to application

A real application needs structure.

For that, Vix provides project templates:

```bash
vix new api --template backend
cd api
vix dev
```

This gives you a real starting point for an application.

A backend template can contain:

```txt
routes
configuration
validation
database
tests
health checks
production config
deployment workflow
```

This is the important shift:

```txt
Vix is not only a runner.
Vix is an application workflow.
```

## The new book structure

This book follows the current Vix direction.

It is organized into 9 chapters:

```txt
01. Introduction
02. Why Vix Exists
03. Mental Model
04. Application Model
05. Runtime Workflow
06. Build Workflow
07. Modules and Composition
08. From Local to Production
09. Next Steps
```

Each chapter answers one important question.

| Chapter                  | Question                                                          |
| ------------------------ | ----------------------------------------------------------------- |
| Introduction             | What is Vix and what path does this book follow?                  |
| Why Vix Exists           | What problem does Vix solve for C++ developers?                   |
| Mental Model             | How should you think about Vix as a system?                       |
| Application Model        | How does a Vix application work?                                  |
| Runtime Workflow         | How does Vix run files, apps, binaries, and commands?             |
| Build Workflow           | How does Vix build safely and efficiently?                        |
| Modules and Composition  | How do modules, dependencies, and registry packages fit together? |
| From Local to Production | How does a Vix app move from development to server deployment?    |
| Next Steps               | What should you build after learning the core model?              |

The book is now focused and strategic.

It is not a random list of features.

It is a path.

## The Vix path

The path is:

```txt
start with one file
understand why Vix exists
learn the mental model
create an application
understand runtime behavior
understand build behavior
compose modules
move to production
build a real backend template
```

In commands:

```bash
vix run main.cpp
vix new api --template backend
vix dev
vix build
vix check --tests
vix service init
vix proxy nginx init
vix health
vix deploy
```

Each command belongs to a stage of the application lifecycle.

## The application model

For applications, Vix now prioritizes `vix.app`.

A `vix.app` file describes the application in a simple way:

```txt
name = "api"
type = "executable"
cpp_standard = "23"

sources = [
  "src/main.cpp"
]

include_dirs = [
  "src"
]

modules = [
  "core",
  "json",
  "http"
]
```

This avoids forcing every application developer to start with a visible `CMakeLists.txt`.

Vix can generate the internal CMake project when needed.

The rule is:

```txt
vix.app for simple application workflow
CMakeLists.txt for advanced control and compatibility
```

If `CMakeLists.txt` exists, Vix uses it.

If there is no `CMakeLists.txt` and `vix.app` exists, Vix uses `vix.app`.

This gives beginners a simple application path while keeping advanced CMake projects supported.

## The runtime workflow

Vix can run different kinds of targets:

```txt
single C++ files
project applications
vix.app manifests
built binaries
Docker-based workflows
recorded replay runs
```

The simple command is still:

```bash
vix run
```

or:

```bash
vix run main.cpp
```

But under the hood, Vix chooses the right strategy.

Sometimes direct compilation is enough.

Sometimes a project build is needed.

Sometimes a CMake fallback is safer.

The goal is:

```txt
same command
correct strategy
clear output
```

## The build workflow

Vix also cares about build performance.

But performance must not break correctness.

The principle is:

```txt
fast when safe
correct by default
fallback when needed
```

Vix can use build state, object cache, artifact cache, target-aware builds, and CMake/Ninja integration.

But if Vix cannot prove that a shortcut is safe, it should rebuild or fallback.

A build system must be trusted before it is fast.

## Modules and composition

Real applications need features.

Vix applications can compose modules such as:

```txt
core
json
http
db
validation
middleware
log
websocket
p2p
sync
cache
crypto
```

A `vix.app` can declare modules directly:

```txt
modules = [
  "core",
  "json",
  "http",
  "db"
]
```

Project dependencies can also be managed through the registry workflow:

```bash
vix registry sync
vix search json
vix add softadastra/json
vix install
```

The important dependency command after cloning a project is:

```bash
vix install
```

It installs the exact versions pinned in `vix.lock`.

## From local to production

Vix should not stop at local development.

A real application eventually needs to run on a server.

A production Vix setup can look like this:

```txt
Internet
  -> Nginx
  -> Vix app on localhost
  -> systemd
```

Vix provides commands for this workflow:

```bash
vix env check --production
vix service init
vix proxy nginx init
vix health
vix logs
vix deploy
```

This makes production part of the application workflow.

Not an afterthought.

## What this book is not

This book is not a full C++ language course.

It will not teach every C++ feature.

It will not replace learning memory, lifetimes, references, templates, concurrency, or performance.

This book is about Vix.

It teaches how to use Vix to build and ship C++ applications.

The C++ language remains important.

Vix improves the workflow around it.

## What you should expect

By the end of this book, you should understand:

```txt
why Vix exists
how Vix thinks about applications
how vix.app fits into the project model
how vix run works conceptually
how vix build fits with CMake and generated projects
how modules are composed
how registry dependencies are installed
how development moves to production
what backend template should be built next
```

You should be able to move from:

```bash
vix run main.cpp
```

to:

```bash
vix new api --template backend
cd api
vix dev
```

and later to:

```bash
vix deploy
```

## The most important command at the beginning

At the beginning, remember this:

```bash
vix run main.cpp
```

It gives you fast feedback.

## The most important command for real projects

For a serious application, remember this:

```bash
vix new api --template backend
```

This is the natural next step after learning the basics.

## The most important production command

When the application is ready to move to a server, remember this:

```bash
vix deploy
```

But production should be prepared first:

```bash
vix env check --production
vix build --preset release
vix check --tests
vix service init
vix proxy nginx init
vix health
```

## The core mental model

The core mental model is:

```txt
Vix is a workflow around C++ applications.
```

That workflow includes:

```txt
create
run
develop
build
test
compose
package
deploy
debug
```

This is why Vix exists.

This is what the book explains.

## What you should remember

Vix starts simple:

```bash
vix run main.cpp
```

Vix becomes useful for applications:

```bash
vix new api --template backend
cd api
vix dev
```

Vix becomes serious in production:

```bash
vix deploy
vix health
vix logs errors --lines 100
```

The path of the book is:

```txt
one file
  -> application model
  -> runtime workflow
  -> build workflow
  -> module composition
  -> production
```

The final goal is clear:

```txt
Build real C++ applications with a modern workflow.
```

## Next chapter

[Next: Why Vix Exists](/book/02-why-vix)
