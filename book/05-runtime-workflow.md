# Runtime Workflow

Runtime is the part of Vix that takes an input and runs it.

The input can be simple:

```bash id="ab4rmk"
vix run main.cpp
```

It can also be a project:

```bash id="wpzxcq"
vix run
```

Or a built executable:

```bash id="vsf4z1"
vix run ./build-ninja/api
```

The command stays simple.

The runtime workflow decides what must happen.

## The basic model

The runtime model is:

```txt id="bt3tzv"
input
  -> resolve
  -> prepare
  -> build if needed
  -> execute
  -> report
```

Vix does not run every target the same way.

A single C++ file is not the same as a backend project.

A `vix.app` project is not the same as a compiled binary.

A replay run is not the same as a fresh run.

So Vix first resolves the target, then chooses the correct execution path.

## What `vix run` means

When you type:

```bash id="zw0mol"
vix run
```

the meaning is:

```txt id="o9irad"
run the current project or application
```

When you type:

```bash id="fwvttz"
vix run main.cpp
```

the meaning is:

```txt id="dl45f1"
run this C++ file
```

When you type:

```bash id="hm8xs5"
vix run ./build-ninja/api
```

the meaning is:

```txt id="csgtz3"
run this existing executable
```

The command is the same family.

The target changes the strategy.

## Runtime targets

Vix runtime can work with several target types.

| Target          | Example                     | Meaning                                                   |
| --------------- | --------------------------- | --------------------------------------------------------- |
| Current project | `vix run`                   | Resolve and run the app in the current folder             |
| C++ file        | `vix run main.cpp`          | Compile and run one file                                  |
| `vix.app` app   | `vix run`                   | Generate internal project if needed, build, then run      |
| CMake project   | `vix run`                   | Configure/build with CMake workflow, then run             |
| Executable      | `vix run ./build-ninja/api` | Run an already built binary                               |
| Replay record   | `vix replay last`           | Re-run a recorded execution                               |
| Docker workflow | `vix run docker ...`        | Run through the Docker-aware runtime path when configured |

The runtime does not guess randomly.

It resolves the target from the input and project files.

## Project resolution

For a project, Vix looks at the current folder.

Resolution order:

```txt id="xcuvpj"
1. CMakeLists.txt
2. vix.app
```

If `CMakeLists.txt` exists, Vix uses the CMake project.

If `CMakeLists.txt` does not exist and `vix.app` exists, Vix uses the `vix.app` application model.

This rule is important.

It protects advanced projects that already use CMake.

It also lets simple applications use `vix.app`.

## Running a `vix.app` application

A `vix.app` file can describe the app:

```txt id="gpyttk"
name = "api"
type = "executable"
cpp_standard = "23"

sources = [
  "src/main.cpp",
  "src/app/AppFactory.cpp"
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

When Vix runs this app, the workflow is:

```txt id="l9uw2u"
read vix.app
  -> validate manifest
  -> generate internal CMake project
  -> configure if needed
  -> build target
  -> run target
```

The generated CMake project lives under:

```txt id="bqi91m"
.vix/generated/app/
```

The user keeps working with `vix.app`.

The build system stays internal.

## Running a CMake project

If the project has `CMakeLists.txt`, Vix keeps the CMake path.

Typical flow:

```txt id="h1mffm"
read CMakeLists.txt
  -> use preset or default build config
  -> configure
  -> build
  -> run target
```

This is the right path for advanced projects.

Examples:

```bash id="4qkldj"
vix run
vix run --preset dev
vix run --preset release
```

CMake remains useful when the project needs deep build control.

## Running one C++ file

For a single file:

```bash id="rl451h"
vix run main.cpp
```

Vix can use a direct compile path when the file is simple.

The simple path is:

```txt id="b368lr"
main.cpp
  -> compile
  -> link
  -> run
```

This gives fast feedback.

It is useful for learning, testing ideas, small tools, examples, and quick experiments.

## CMake fallback for scripts

Some files need more than direct compilation.

Examples:

```txt id="l0zgso"
Vix runtime modules
registry dependencies
database support
sanitizers
special linker flags
project-level configuration
```

In those cases, Vix can use a CMake fallback.

The command stays the same:

```bash id="z5z9oq"
vix run server.cpp
```

The strategy changes:

```txt id="zarx17"
direct compile when enough
CMake fallback when safer
```

The user should not need to manually rewrite the command only because the script became more serious.

## Running a built executable

You can run an existing executable:

```bash id="a1ckxp"
vix run ./build-ninja/api
```

This is useful when the binary already exists and you only want Vix runtime behavior around execution.

Examples:

```bash id="tg50iw"
vix run ./build-ninja/api
vix run ./dist/server
```

In this case, Vix does not need to resolve a project target first.

The binary is already the target.

## Runtime arguments

Arguments for the application go after `--`.

```bash id="2ce1dh"
vix run -- --port 8080
```

The rule:

```txt id="befafw"
before -- = Vix arguments
after -- = application arguments
```

Example:

```bash id="oyyevj"
vix run main.cpp -- --name gaspard --debug
```

Here:

```txt id="5anznq"
main.cpp belongs to Vix
--name gaspard --debug belongs to the app
```

This avoids confusion between Vix options and app options.

## Environment variables

Runtime behavior often depends on environment variables.

Example:

```bash id="cmg4ya"
VIX_LOG_LEVEL=debug vix run
```

For application config, use `.env` when the app supports it.

Example `.env`:

```dotenv id="di37rz"
APP_ENV=development
SERVER_HOST=127.0.0.1
SERVER_PORT=8080
VIX_LOG_LEVEL=info
DATABASE_ENGINE=sqlite
DATABASE_DEFAULT_NAME=./data/app.db
```

Before running seriously, check env state:

```bash id="z0fuhr"
vix env check
```

For production:

```bash id="yq5qdb"
vix env check --production
```

## Development runtime

`vix run` is for manual runs.

`vix dev` is for active development.

```bash id="l84edl"
vix dev
```

The dev workflow is:

```txt id="t9r6bp"
start app
  -> watch files
  -> classify changes
  -> rebuild or reconfigure
  -> restart when needed
```

Use `vix dev` while editing.

Use `vix run` when you want one execution.

## Replay-enabled runs

A normal run does not record replay data.

To record a run:

```bash id="vep4ji"
vix run --replay
```

For one file:

```bash id="1jsd0m"
vix run main.cpp --replay
```

Then replay it:

```bash id="33aa9o"
vix replay last
```

Replay the latest failed run:

```bash id="2oc8ql"
vix replay failed
```

The record is stored under:

```txt id="z484si"
.vix/runs/
```

A recorded run can include:

```txt id="i22fiq"
command
working directory
arguments
environment additions
status
stdout
stderr
combined logs
duration
```

Replay exists for one reason:

```txt id="bzlf90"
do not debug from memory when the run can be reproduced
```

## Runtime output

A good runtime output should show what matters.

For a server app, output can include:

```txt id="2l6dbh"
app name
mode
HTTP URL
WebSocket URL
thread count
status
hint to stop
```

Example shape:

```txt id="q59bgo"
Vix.cpp READY
HTTP:    http://localhost:8080/
WS:      ws://localhost:9090/
Threads: 8/8
Mode:    run
Status:  ready
Hint:    Ctrl+C to stop the server
```

The output should not hide the runtime state.

When the app is ready, the developer should see it.

When the app fails, the developer should see why.

## Exit behavior

Runtime commands should return meaningful exit codes.

Basic model:

| Exit code | Meaning                               |
| --------- | ------------------------------------- |
| `0`       | Run completed successfully            |
| `1`       | Run failed                            |
| `130`     | Interrupted by user, usually `Ctrl+C` |

When a server is interrupted manually, that should be reported clearly.

Example:

```txt id="lgsr6q"
Program interrupted by user (SIGINT).
```

This is not the same as a crash.

## Runtime errors

Runtime errors should be readable.

Bad output:

```txt id="e0zsws"
error
```

Better output:

```txt id="7jz93w"
error: failed to run target
target: api
reason: executable not found
fix: run vix build
```

The model is:

```txt id="aehbnk"
what failed
where it failed
why it failed
what to try next
```

This matters more than decorative output.

## Runtime and dependencies

If a project depends on registry packages, install them first:

```bash id="p05f59"
vix install
```

After adding a dependency:

```bash id="36k4o8"
vix add softadastra/json
vix run
```

After cloning:

```bash id="95df62"
git clone https://github.com/example/api.git
cd api
vix install
vix run
```

Runtime should not silently assume missing dependencies are fine.

If dependencies are missing, the fix should be clear.

## Runtime and modules

A `vix.app` can declare modules:

```txt id="jbb7xo"
modules = [
  "core",
  "json",
  "http",
  "db"
]
```

The runtime does not directly “run modules”.

But modules affect build and linking.

If a runtime target needs `db`, the build must include database support.

If a runtime target needs `http`, the build must link the right HTTP module.

So the runtime depends on correct module composition.

## Runtime and health

For backend apps, runtime is connected to health checks.

A backend should expose:

```txt id="9zzw6z"
GET /health
```

Then local runtime can be checked:

```bash id="ee4x4d"
vix health local
```

Public runtime can be checked:

```bash id="4pnut7"
vix health public
```

All health checks depend on the app running correctly.

Runtime is not only “process started”.

Runtime means:

```txt id="7xbxhf"
the app is actually usable
```

## Runtime and logs

When running locally, logs appear in the terminal.

In production, logs usually come from systemd and Nginx.

Use:

```bash id="cubm76"
vix logs app
vix logs proxy
vix logs errors
```

The runtime workflow should leave enough trace to debug.

A process that fails silently is not production-ready.

## Runtime and services

Production runtime usually runs through systemd.

The model:

```txt id="1qmu00"
systemd starts the Vix app
Nginx exposes it publicly
health checks verify it
logs explain it
deploy updates it
```

Commands:

```bash id="l3g5x5"
vix service init
vix service status
vix service restart
```

The same app can run locally with:

```bash id="ee8slx"
vix run
```

and in production with systemd.

The app remains the same.

The runtime environment changes.

## Runtime and Docker

Some workflows can involve Docker.

The important mental model is:

```txt id="kpdbmy"
Vix still owns the runtime intent.
Docker becomes one execution backend when configured.
```

That means a Docker-aware runtime flow should still be visible and explainable.

The user should know:

```txt id="1hbb2s"
which image or container is used
which ports are exposed
which command is executed
which env values are passed
```

Do not hide Docker behind unclear behavior.

## Runtime and production

A production run should not rely on manual terminal sessions.

Local:

```bash id="2qhns9"
vix run
```

Development:

```bash id="1s8r9w"
vix dev
```

Production:

```bash id="jolzp9"
vix service init
vix deploy
vix health
```

The production model is not:

```txt id="gtd8j7"
ssh into server and run random commands forever
```

The production model is:

```txt id="m7b2ff"
configured service
repeatable deploy
checked health
available logs
```

## Common workflows

Run one file:

```bash id="e0srnu"
vix run main.cpp
```

Run current project:

```bash id="gb3j54"
vix run
```

Run with app arguments:

```bash id="p71yz5"
vix run -- --port 8080
```

Record and replay:

```bash id="7p4ww3"
vix run --replay
vix replay last
```

Run development mode:

```bash id="3jweic"
vix dev
```

Run after dependency install:

```bash id="mwymh5"
vix install
vix run
```

Run release build then execute:

```bash id="t0x1fk"
vix build --preset release
vix run
```

## Common mistakes

### Passing app arguments before `--`

Wrong:

```bash id="kas6md"
vix run --port 8080
```

Correct:

```bash id="yao6o6"
vix run -- --port 8080
```

### Expecting replay without recording

Wrong:

```bash id="e521p9"
vix run
vix replay last
```

Correct:

```bash id="e41lr6"
vix run --replay
vix replay last
```

### Running before installing dependencies

Wrong after clone:

```bash id="hs3xhj"
vix run
```

Correct:

```bash id="sdd0tm"
vix install
vix run
```

### Using `vix run` for active development

Possible:

```bash id="mr8s1p"
vix run
```

Better while editing:

```bash id="cp9m4l"
vix dev
```

### Treating “process started” as “app healthy”

A backend can start and still be broken.

Check it:

```bash id="oduu1n"
vix health local
```

## Runtime checklist

Before trusting a runtime workflow, check:

```txt id="ducrxv"
Can the app be resolved?
Can dependencies be installed?
Can the target be built?
Can the executable be found?
Can app arguments be passed?
Can env variables be loaded?
Can failures be diagnosed?
Can important runs be replayed?
Can health be checked?
Can logs be read?
```

If the answer is yes, the runtime workflow is usable.

## What you should remember

Runtime is not just execution.

Runtime is:

```txt id="bwlwyu"
resolve target
prepare environment
build when needed
run with clear arguments
record when requested
report useful status
```

Use:

```bash id="crwqlq"
vix run main.cpp
```

for one file.

Use:

```bash id="cmi00l"
vix run
```

for the current app.

Use:

```bash id="m8n3bm"
vix dev
```

while editing.

Use:

```bash id="jcfzlz"
vix run --replay
vix replay failed
```

when reproduction matters.

The core model:

```txt id="bk7fms"
same command
right target
safe strategy
clear output
```

## Next chapter

[Next: Build Workflow](/book/06-build-workflow)
