# Why Vix Exists

Vix exists because C++ is powerful, but the application workflow around C++ is still too heavy for many developers.

The problem is not C++ itself.

The problem is everything around the moment when you want to build something real.

```txt
C++ gives you power.
But the workflow often gives you friction.
```

Vix was created to reduce that friction.

## The real problem

A developer should be able to start with a simple idea:

```txt
I want to build an application in C++.
```

But very quickly, the work becomes larger than the application itself.

You may need to think about:

```txt
compiler flags
build directories
CMake files
Ninja files
dependency installation
package versions
development reloads
tests
formatting
runtime arguments
database setup
logs
service files
reverse proxy config
health checks
deployment steps
```

These things matter.

But they should not block the first step.

The first step should be simple:

```bash
vix run main.cpp
```

Then the project step should also be simple:

```bash
vix new api --template backend
cd api
vix dev
```

That is why Vix exists.

## C++ is not the weakness

C++ is not weak.

C++ is used to build:

```txt
operating systems
browsers
databases
game engines
runtimes
network servers
trading systems
embedded systems
high-performance services
```

The language is capable.

The ecosystem is capable.

The issue is that the normal application workflow often feels fragmented.

A beginner can write valid C++ code and still get stuck on:

```txt
How do I build this?
How do I run this?
How do I add dependencies?
How do I create a project?
How do I run tests?
How do I deploy?
```

Vix exists to make those workflows direct.

## The Vix answer

Vix gives C++ an application-first workflow.

Instead of forcing the developer to begin with build-system complexity, Vix lets the developer begin with intent.

Run a file:

```bash
vix run main.cpp
```

Create a backend:

```bash
vix new api --template backend
```

Start development mode:

```bash
vix dev
```

Build:

```bash
vix build
```

Validate:

```bash
vix check --tests
```

Deploy:

```bash
vix deploy
```

The idea is simple:

```txt
common application work should have common commands
```

## Why not only CMake?

CMake is powerful.

Vix does not try to erase it.

CMake remains important for advanced C++ projects, cross-platform builds, library composition, and compatibility.

But many application developers do not want to begin with visible CMake complexity.

For applications, Vix now prioritizes `vix.app`.

Example:

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

This gives a simple application manifest.

Internally, Vix can still generate and use CMake when needed.

The rule is:

```txt
Use vix.app for the simple application path.
Use CMakeLists.txt when the project needs direct CMake control.
```

This keeps both worlds:

```txt
simple for apps
powerful for advanced projects
```

## Why not only a build tool?

Vix is not only a build command.

A build command solves only one part of the problem.

Real applications also need:

```txt
development workflow
runtime workflow
module composition
dependency management
test workflow
diagnostics
replay
production services
proxy configuration
health checks
logs
deployment
```

That is why Vix includes commands such as:

```bash
vix dev
vix run
vix build
vix check
vix tests
vix make
vix add
vix install
vix registry sync
vix replay
vix service
vix proxy nginx
vix health
vix logs
vix deploy
```

The goal is not to have many commands just to look complete.

The goal is to cover the real lifecycle of a C++ application.

## The old C++ workflow

A traditional workflow often looks like this:

```txt
create files manually
write CMake manually
configure build manually
run build manually
find binary manually
run binary manually
write scripts manually
write service file manually
write Nginx config manually
debug logs manually
deploy manually
```

This is powerful, but slow.

It also creates many small places where mistakes happen.

Vix tries to replace repeated manual steps with clear commands.

## The Vix workflow

A Vix workflow looks like this:

```txt
create
  -> run
  -> develop
  -> build
  -> check
  -> package
  -> deploy
```

With commands:

```bash
vix new api --template backend
vix dev
vix build
vix check --tests
vix pack
vix deploy
```

And when something breaks:

```bash
vix doctor
vix info
vix logs errors --lines 100
vix replay failed
```

Vix does not remove debugging.

It makes debugging more structured.

## Why application-first matters

Many C++ tools are library-first or build-system-first.

Vix is application-first.

That means the tool starts from questions like:

```txt
How does the developer create an app?
How does the app run?
How does the app reload during development?
How does the app use modules?
How does the app install dependencies?
How does the app expose HTTP?
How does the app check health?
How does the app deploy?
```

This is why the book now follows a tighter structure:

```txt
Introduction
Why Vix Exists
Mental Model
Application Model
Runtime Workflow
Build Workflow
Modules and Composition
From Local to Production
Next Steps
```

The book is no longer just about a few HTTP examples.

It is about the complete Vix application model.

## Vix reduces accidental complexity

There are two kinds of complexity.

Essential complexity:

```txt
the real problem your application solves
```

Accidental complexity:

```txt
the extra work required only because the workflow is hard
```

C++ applications have essential complexity.

That is normal.

But developers should not lose too much time on accidental complexity.

Vix tries to reduce accidental complexity around:

```txt
project creation
build setup
run configuration
dependency installation
module composition
development loops
production setup
diagnostics
deployment
```

The application itself can still be complex.

But the path to run and ship it should be clearer.

## Vix keeps explicitness

Vix should not become magic.

A good Vix command should be understandable.

For example:

```bash
vix build
```

means:

```txt
resolve the project
configure if needed
build the target
use cache when safe
fallback when needed
print useful diagnostics
```

And:

```bash
vix deploy
```

means:

```txt
run the configured deployment workflow
build
test
restart service
check health
check proxy
show logs on failure
```

The command is simple, but the behavior should still be explainable.

That is an important principle:

```txt
simple command
explicit behavior
clear diagnostics
```

## Vix supports fallback

Vix should be fast when it can be fast.

But correctness comes first.

For example, a script can sometimes be compiled directly.

But some scripts need more:

```txt
Vix runtime features
special dependencies
database support
sanitizer modes
project-level configuration
```

In those cases, Vix can use a CMake fallback automatically.

The developer still runs:

```bash
vix run server.cpp
```

Vix decides the safest execution path.

The goal is:

```txt
same command
correct strategy
less manual work
```

## Vix and dependencies

Real projects need packages.

That is why Vix has registry workflows:

```bash
vix registry sync
vix search json
vix add softadastra/json
vix install
vix update
vix outdated
vix remove
```

The dependency model uses:

```txt
vix.json
vix.lock
.vix/deps/
.vix/vix_deps.cmake
local store
registry index
```

The important command after cloning a project is:

```bash
vix install
```

This installs the exact versions already pinned in `vix.lock`.

For adding a package:

```bash
vix add namespace/name
```

For publishing a package:

```bash
vix publish 0.2.0
```

Vix exists because real applications need a dependency workflow, not just a compiler command.

## Vix and production

A tool that helps you run code locally is useful.

But a tool that helps you move from local to production is much more valuable.

That is why Vix includes production commands:

```bash
vix env check --production
vix service init
vix proxy nginx init
vix health
vix logs
vix deploy
```

A production Vix app can follow this model:

```txt
Internet
  -> Nginx
  -> Vix app on localhost
  -> systemd
```

The developer should not need to rewrite the same systemd and Nginx workflow for every app.

Vix makes that workflow repeatable.

## Vix and diagnostics

A modern runtime workflow needs diagnostics.

When something fails, the developer needs to know:

```txt
what command ran
what failed
where it failed
what to try next
what logs matter
whether the run can be reproduced
```

That is why Vix includes commands such as:

```bash
vix doctor
vix info
vix logs
vix replay
```

`vix doctor` checks the environment.

`vix info` shows local state, registry paths, store paths, caches, and packages.

`vix logs` reads app and proxy logs.

`vix replay` replays recorded runs.

The goal is not only to fail.

The goal is to fail with enough information to continue.

## Vix and learning

Vix also exists to make C++ more approachable.

A beginner should be able to start with:

```bash
vix run main.cpp
```

Then grow into:

```bash
vix new api --template backend
vix dev
vix build
vix check --tests
```

Then later:

```bash
vix service init
vix proxy nginx init
vix deploy
```

The same tool supports the learning path and the production path.

That is important.

## What Vix should feel like

Vix should feel like this:

```txt
C++ remains powerful.
The workflow becomes clear.
The commands are predictable.
The project structure is understandable.
The build is fast when safe.
The diagnostics help.
Production is not an afterthought.
```

That is the experience Vix is trying to create.

## The core reason

Vix exists because C++ deserves a workflow where this is normal:

```bash
vix new api --template backend
cd api
vix dev
```

and this is also normal:

```bash
vix deploy
vix health
vix logs errors --lines 100
```

The same ecosystem should support both local development and production operations.

## What you should remember

Vix exists to make real C++ application development smoother.

Not by changing C++.

Not by hiding everything.

Not by removing advanced control.

But by giving clear workflows for the things developers repeat every day.

```txt
run
create
develop
build
test
compose
package
deploy
debug
```

The shortest summary is:

```txt
Vix modernizes the workflow around C++.
```

## Next chapter

[Next: Mental Model](/book/03-mental-model)
