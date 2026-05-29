# Mental Model

Vix is easier to understand when you stop seeing it as one command.

Vix is not only:

```bash
vix run main.cpp
```

That is only the entry point.

The real model is this:

```txt
Vix sits between your C++ code and the workflows needed to build, run, compose, debug, and deploy it.
```

A Vix project is not just a folder with source files.

It is a working application environment.

## The simple model

Think of Vix in five layers:

```txt
source code
  -> application manifest
  -> runtime workflow
  -> build workflow
  -> production workflow
```

Each layer has a clear role.

| Layer                | Role                                                 |
| -------------------- | ---------------------------------------------------- |
| Source code          | Your C++ files                                       |
| Application manifest | Describes the app with `vix.app` or `CMakeLists.txt` |
| Runtime workflow     | Decides how the app runs                             |
| Build workflow       | Builds the app correctly                             |
| Production workflow  | Runs the app safely on a server                      |

This is the base mental model.

## Vix starts from intent

When you type:

```bash
vix run
```

you are not saying:

```txt
please run this exact binary manually
```

You are saying:

```txt
run the current application in the correct way
```

When you type:

```bash
vix build
```

you are not saying:

```txt
only call the compiler
```

You are saying:

```txt
resolve the project, configure it if needed, build the right target, and reuse safe cache when possible
```

When you type:

```bash
vix dev
```

you are saying:

```txt
watch the project, rebuild what changed, and restart the app when it matters
```

That is why Vix is not just a wrapper.

It is a workflow engine around C++ applications.

## Project resolution

Before Vix can build or run, it asks one question:

```txt
What kind of project is this?
```

The answer can be:

```txt
CMake project
vix.app project
single C++ file
existing binary
special runtime target
```

For applications, the important rule is:

```txt
CMakeLists.txt wins when it exists.
vix.app is used when there is no CMakeLists.txt.
```

So the resolution order is:

```txt
1. CMakeLists.txt
2. vix.app
```

This keeps existing CMake projects safe.

It also gives new applications a simpler path.

## Why `vix.app` exists

A normal app should not need to start with a full `CMakeLists.txt`.

For many applications, this is enough:

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

This file says what the app is.

Vix can generate the internal CMake project from it.

The user keeps a simple app manifest.

Vix keeps the build power internally.

That is the point of `vix.app`.

## CMake is still supported

Vix does not fight CMake.

CMake remains the advanced path.

Use CMake when the project needs:

```txt
custom targets
complex linking
external native libraries
platform-specific rules
advanced install logic
manual control
```

Use `vix.app` when the project is an application and should stay simple.

The model is not:

```txt
vix.app replaces CMake
```

The model is:

```txt
vix.app describes simple apps.
CMake handles advanced projects.
Vix connects both to one workflow.
```

## Runtime model

The runtime model is simple:

```txt
resolve target
prepare execution
build if needed
run with the right arguments
show useful output
```

A target can be:

```txt
a C++ file
a project
a vix.app application
a built executable
a Docker workflow
a recorded replay
```

Examples:

```bash
vix run main.cpp
vix run
vix run api
vix run ./build-ninja/api
vix replay last
```

The command stays simple.

The strategy changes based on the target.

## Build model

The build model is:

```txt
resolve project
choose build strategy
configure when needed
build target
reuse cache only when safe
fallback when uncertain
```

Vix should be fast, but not careless.

The rule is:

```txt
correct first
fast second
```

If Vix can prove that a file, object, or artifact is still valid, it can reuse it.

If not, it rebuilds.

That is why the build workflow can include:

```txt
BuildState
BuildGraph
ObjectCache
ArtifactCache
CMake/Ninja fallback
target-aware builds
```

The developer does not need to think about every internal layer every day.

But the mental model matters:

```txt
Vix optimizes the workflow without breaking trust.
```

## Development model

Development mode is not just “run again”.

`vix dev` watches the project and classifies changes.

A source file change usually means:

```txt
rebuild only
```

A header file change usually means:

```txt
rebuild only
```

A config file change usually means:

```txt
reconfigure and rebuild
```

Examples of config files:

```txt
CMakeLists.txt
CMakePresets.json
vix.json
vix.toml
vix.lock
*.cmake
```

Some folders are ignored:

```txt
.git
.vix
build
build-dev
build-ninja
build-release
node_modules
.cache
.idea
.vscode
```

So the model is:

```txt
watch
  -> classify change
  -> rebuild or reconfigure
  -> restart when useful
```

This is why `vix dev` feels different from manually running build commands.

## Dependency model

Dependencies use two important files:

```txt
vix.json
vix.lock
```

`vix.json` describes what the project wants.

`vix.lock` records the exact resolved versions.

The main commands are:

```bash
vix add softadastra/json
vix install
vix update
vix outdated
vix remove softadastra/json
```

The most important rule:

```txt
After cloning a project, run vix install.
```

`vix install` reads `vix.lock` and installs the exact dependencies.

It is not the same as update.

```txt
vix install = install locked versions
vix update = resolve newer versions
```

That distinction matters for reproducible builds.

## Registry model

The registry has two parts:

```txt
local registry index
local package store
```

The local registry index is metadata.

The store is downloaded package content.

Use:

```bash
vix registry sync
```

to refresh metadata.

Use:

```bash
vix store path
```

to inspect the local store.

Use:

```bash
vix store gc --project --dry-run
```

to preview cleanup.

The mental model:

```txt
registry = what exists
store = what is cached locally
project = what this app uses
```

## Module model

A module is a reusable capability.

Examples:

```txt
core
json
http
db
log
validation
middleware
websocket
p2p
sync
cache
crypto
```

In `vix.app`, modules can be declared like this:

```txt
modules = [
  "core",
  "json",
  "http",
  "db"
]
```

That means:

```txt
this app needs these Vix capabilities
```

The project should stay explicit.

No hidden module guessing.

No unclear magic.

The app says what it needs.

Vix wires it into the build.

## Configuration model

Vix uses different files for different jobs.

| File                      | Purpose                                                   |
| ------------------------- | --------------------------------------------------------- |
| `vix.app`                 | Application manifest                                      |
| `vix.json`                | Dependencies, tasks, registry metadata, production config |
| `vix.lock`                | Exact resolved package versions                           |
| `.env`                    | Local runtime environment                                 |
| `.env.example`            | Example environment file                                  |
| `production.env.required` | Required production variables                             |
| `CMakeLists.txt`          | Advanced CMake project definition                         |
| `CMakePresets.json`       | CMake build presets                                       |

Do not put everything into one file.

Each file has its job.

## Local state model

Vix also creates local state.

Common paths:

```txt
.vix/
build/
build-ninja/
build-release/
dist/
```

Global paths usually live under:

```txt
~/.vix/
```

Examples:

```txt
~/.vix/registry/index
~/.vix/store/git
~/.vix/global/installed.json
~/.vix/cache/build
```

Project-local state can be cleaned with:

```bash
vix clean
```

Project-local state can be reset with:

```bash
vix reset
```

Global state is different.

Do not confuse:

```txt
project cache
```

with:

```txt
global registry and package store
```

## Diagnostic model

When something fails, Vix should help you inspect the system.

Use:

```bash
vix doctor
```

to check environment health.

Use:

```bash
vix info
```

to inspect paths, caches, registry state, store state, and package state.

Use:

```bash
vix logs
```

to read production logs.

Use:

```bash
vix replay
```

to reproduce a recorded execution.

The model is:

```txt
doctor = environment health
info = local state
logs = runtime output
replay = reproduce execution
```

## Replay model

A replay is a recorded run.

It is not created automatically.

You record one with:

```bash
vix run api --replay
```

Then replay it:

```bash
vix replay last
```

Or replay the latest failed one:

```bash
vix replay failed
```

A replay record keeps context under:

```txt
.vix/runs/
```

This helps when a command failed and you do not want to guess how it was launched.

## Production model

Production is not separate from Vix.

A normal production setup looks like this:

```txt
Internet
  -> Nginx
  -> Vix app on localhost
  -> systemd
```

Vix commands match that model:

```bash
vix env check --production
vix service init
vix proxy nginx init
vix health
vix logs
vix deploy
```

The production model has four parts:

```txt
environment
service
proxy
health
```

Deployment ties them together.

## Deployment model

A deployment is not just copying files.

A serious deploy can include:

```txt
pull latest code
install dependencies
build release
run tests
restart service
check local health
check public health
check proxy
reload proxy
print logs on failure
rollback when configured
```

That is why `vix deploy` exists.

The command is simple:

```bash
vix deploy
```

But the workflow is described in `vix.json`.

Vix should not guess production behavior blindly.

The project should define it.

## One command, many levels

The same command can serve different levels of developer.

Beginner:

```bash
vix run main.cpp
```

Project developer:

```bash
vix dev
```

Backend developer:

```bash
vix new api --template backend
```

Maintainer:

```bash
vix check --tests
vix pack
vix publish
```

Production operator:

```bash
vix deploy
vix health
vix logs errors --lines 100
```

That is the point.

Vix should scale from learning to production.

## What Vix should not hide

Vix should not hide the important parts.

You should still know:

```txt
what app is being built
what files are compiled
what modules are linked
what dependencies are installed
what service runs in production
what proxy exposes the app
what health endpoint is checked
```

A good Vix workflow is not silent magic.

It is a clear workflow with less repeated manual work.

## The core mental model

Keep this model:

```txt
Vix resolves the project,
chooses the right workflow,
runs the required tools,
and keeps the result explainable.
```

In shorter form:

```txt
resolve
  -> build
  -> run
  -> observe
  -> deploy
```

That is the heart of Vix.

## What you should remember

Remember these rules:

```txt
vix.app is the simple application path.
CMakeLists.txt is the advanced project path.
vix run executes with the right strategy.
vix build builds with correctness first.
vix dev watches and rebuilds intelligently.
vix install installs locked dependencies.
vix registry sync refreshes metadata.
vix replay reproduces recorded runs.
vix deploy moves the app through production workflow.
```

The full mental model is:

```txt
source code
  -> application manifest
  -> runtime workflow
  -> build workflow
  -> module composition
  -> production workflow
```

## Next chapter

[Next: Application Model](/book/04-application-model)
