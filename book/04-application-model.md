# Application Model

A Vix application is a C++ project with a clear entry point, a clear manifest, and a clear workflow.

The model is simple:

```txt
application
  -> source files
  -> modules
  -> configuration
  -> runtime
  -> build output
```

Vix does not treat an application as only a pile of `.cpp` files.

It treats it as something that can be created, run, built, tested, packaged, and deployed.

## The application starts with intent

When you create an app, the first question is not:

```txt
Where is the CMakeLists.txt?
```

The first question is:

```txt
What kind of application is this?
```

Examples:

```txt
backend API
web app
CLI tool
game
P2P node
library
```

That is why Vix templates matter.

A backend should not start like an empty folder.

It should start with backend structure.

```bash
vix new api --template backend
```

A game should not start like a backend.

```bash
vix new mario --game
```

A library should not start like an app.

```bash
vix new mathlib --lib
```

The template gives the first shape.

The application model gives the rules.

## The application root

The application root is the folder where Vix resolves the project.

Example:

```txt
api/
├── vix.app
├── vix.json
├── vix.lock
├── src/
├── tests/
├── migrations/
└── public/
```

From inside that folder, commands should feel natural:

```bash
vix dev
vix run
vix build
vix check --tests
vix deploy
```

The root is important because Vix reads project files from there and writes local state there.

Common local state:

```txt
.vix/
build/
build-ninja/
build-release/
dist/
```

## The two project inputs

Vix supports two main project inputs:

```txt
CMakeLists.txt
vix.app
```

Resolution order:

```txt
1. CMakeLists.txt
2. vix.app
```

This means:

```txt
If CMakeLists.txt exists, Vix uses the CMake project.
If CMakeLists.txt does not exist and vix.app exists, Vix uses vix.app.
```

This protects existing projects.

It also gives new applications a simpler path.

## `vix.app`

`vix.app` is the simple application manifest.

It describes the app without forcing the developer to write a full CMake file.

Example:

```txt
name = "api"
type = "executable"
cpp_standard = "23"

sources = [
  "src/main.cpp",
  "src/app/AppFactory.cpp",
  "src/routes/HealthRoutes.cpp"
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

This file answers basic questions:

```txt
What is the app called?
What type of target is it?
Which C++ standard does it use?
Which files are compiled?
Which include directories are used?
Which Vix modules are needed?
```

Vix can generate an internal CMake project from this.

The generated project lives under:

```txt
.vix/generated/app/CMakeLists.txt
```

The user keeps `vix.app`.

Vix handles the generated build layer.

## Why `vix.app` matters

A backend developer should be able to describe the app like this:

```txt
name = "api"
type = "executable"
sources = [...]
modules = [...]
```

That is enough for many apps.

They should not have to start by writing:

```txt
cmake_minimum_required(...)
project(...)
add_executable(...)
target_include_directories(...)
target_link_libraries(...)
```

CMake is still there when needed.

But it should not be the first wall.

## When to use CMake directly

Use `CMakeLists.txt` when the project needs advanced control.

Examples:

```txt
custom targets
complex native dependencies
manual install rules
platform-specific build logic
advanced linking
custom code generation
large multi-target projects
```

When `CMakeLists.txt` exists, Vix preserves it.

The model is:

```txt
vix.app = simple application manifest
CMakeLists.txt = advanced build definition
Vix = one workflow over both
```

## `vix.json`

`vix.app` describes how to build the application.

`vix.json` describes project metadata, dependencies, tasks, registry data, and production workflow.

Example:

```json
{
  "name": "api",
  "version": "0.1.0",
  "type": "application",
  "deps": [],
  "tasks": {
    "dev": "vix dev",
    "build": "vix build",
    "test": "vix check --tests",
    "fmt": "vix fmt"
  }
}
```

For production, `vix.json` can also contain:

```json
{
  "production": {
    "service": {
      "name": "api",
      "user": "vix",
      "working_dir": "/home/vix/apps/api",
      "command": "vix run",
      "env_file": "/home/vix/apps/api/.env"
    },
    "health": {
      "service": "api",
      "local": "http://127.0.0.1:8080/health",
      "public": "https://api.example.com/health"
    }
  }
}
```

Keep the distinction clear:

```txt
vix.app = app build model
vix.json = project workflow model
vix.lock = exact dependency model
```

## `vix.lock`

`vix.lock` records exact dependency versions.

If `vix.json` says:

```txt
I need this dependency range.
```

Then `vix.lock` says:

```txt
This exact version and commit were resolved.
```

After cloning a project, use:

```bash
vix install
```

That installs locked dependencies.

Do not use update when you only need reproducibility.

```txt
vix install = reproduce the locked state
vix update = change the locked state
```

## Source layout

A simple backend can use this layout:

```txt
src/
├── main.cpp
├── app/
│   ├── AppFactory.hpp
│   └── AppFactory.cpp
├── config/
│   ├── Config.hpp
│   └── Config.cpp
├── routes/
│   ├── HealthRoutes.hpp
│   └── HealthRoutes.cpp
├── middleware/
├── services/
├── database/
└── errors/
```

The important rule:

```txt
main.cpp should stay small.
```

`main.cpp` starts the app.

The rest of the application lives in focused files.

## Small `main.cpp`

Example:

```cpp
#include <vix.hpp>

#include "app/AppFactory.hpp"
#include "config/Config.hpp"

int main()
{
  api::Config config = api::Config::load(".env");

  vix::App app = api::create_app(config);

  app.run(config.server_port());

  return 0;
}
```

This is easy to understand.

The app is created somewhere else.

Configuration is loaded somewhere else.

Routes are registered somewhere else.

`main.cpp` does not become the whole backend.

## Application factory

The application factory creates and configures the app.

Example:

```cpp
#pragma once

#include <vix.hpp>

#include "config/Config.hpp"

namespace api
{
  vix::App create_app(const Config &config);
}
```

Implementation:

```cpp
#include "app/AppFactory.hpp"

#include "routes/HealthRoutes.hpp"

namespace api
{
  vix::App create_app(const Config &config)
  {
    vix::App app;

    register_health_routes(app, config);

    return app;
  }
}
```

This keeps app creation testable.

It also keeps route registration organized.

## Routes

Routes should be grouped by feature.

Example:

```txt
routes/
├── HealthRoutes.hpp
├── AuthRoutes.hpp
├── UserRoutes.hpp
└── AdminRoutes.hpp
```

A health route should exist early.

```txt
GET /health
```

Example response:

```json
{
  "ok": true,
  "service": "api",
  "status": "healthy"
}
```

This route is not just for development.

It is used by production checks:

```bash
vix health local
vix health public
vix deploy
```

## API response shape

Use one predictable shape.

Success:

```json
{
  "ok": true,
  "data": {}
}
```

List:

```json
{
  "ok": true,
  "count": 3,
  "data": []
}
```

Error:

```json
{
  "ok": false,
  "error": "validation_failed",
  "message": "email is required"
}
```

A stable response shape helps clients, tests, logs, and debugging.

## Configuration

Configuration should come from the environment.

A backend template should include:

```txt
.env.example
production.env.required
```

Example `.env.example`:

```dotenv
APP_ENV=development

SERVER_HOST=127.0.0.1
SERVER_PORT=8080
SERVER_TLS_ENABLED=false

VIX_LOG_LEVEL=info
VIX_LOG_FORMAT=kv
VIX_COLOR=auto

DATABASE_ENGINE=sqlite
DATABASE_DEFAULT_NAME=./data/app.db

JWT_SECRET=change-me
SESSION_SECRET=change-me
```

Check local env:

```bash
vix env check
```

Check production env:

```bash
vix env check --production
```

The app should not hardcode secrets.

The app should not hardcode production paths.

## Modules

A Vix app is composed from modules.

Example:

```txt
modules = [
  "core",
  "json",
  "http",
  "validation",
  "middleware",
  "db",
  "log"
]
```

Modules make the app explicit.

If the app uses JSON, say it.

If the app uses HTTP, say it.

If the app uses database support, say it.

No hidden guessing.

## Dependencies

Registry packages are different from built-in modules.

Use registry packages when you need reusable external packages.

Workflow:

```bash
vix registry sync
vix search json
vix add softadastra/json
vix install
```

After adding a dependency, the project state changes:

```txt
vix.json
vix.lock
.vix/deps/
.vix/vix_deps.cmake
```

After cloning the project, only this should be needed:

```bash
vix install
```

## Tasks

Tasks belong in `vix.json`.

Example:

```json
{
  "tasks": {
    "dev": "vix dev",
    "build": "vix build",
    "test": "vix check --tests",
    "fmt": "vix fmt",
    "release": "vix build --preset release && vix check --tests"
  }
}
```

Tasks are useful when the project has repeated workflows.

They should not hide important behavior.

Use clear names.

## Tests

A real application should include tests.

Basic structure:

```txt
tests/
├── test_health.cpp
├── test_validation.cpp
└── test_auth.cpp
```

Generate a test skeleton:

```bash
vix make test HealthRoutes
```

Run tests:

```bash
vix tests
```

Or run validation:

```bash
vix check --tests
```

The application model is incomplete without tests.

## Static files

Some apps need public files.

Example:

```txt
public/
├── favicon.ico
├── robots.txt
└── assets/
```

Static files belong outside `src/`.

`src/` is code.

`public/` is served content.

This keeps the application layout understandable.

## Database files

For SQLite apps, keep database files out of source directories.

Example:

```txt
data/
└── app.db
```

Migrations:

```txt
migrations/
├── 2026_01_01_000001_create_users.up.sql
└── 2026_01_01_000001_create_users.down.sql
```

Commands:

```bash
vix db status
vix db migrate
vix db backup
```

For ORM tooling:

```bash
vix orm status --db api --dir ./migrations
vix orm migrate --db api --dir ./migrations
```

## Generated files

Use `vix make` to generate files inside an existing project.

Examples:

```bash
vix make class User --in src/domain --namespace api::domain
vix make struct Claims --in src/auth --namespace api::auth
vix make enum Status --in src/domain
vix make function parse_token --in src/auth
vix make test AuthService
vix make config app --websocket --database
```

The model:

```txt
vix new = create a project
vix make = add files to a project
```

Do not confuse them.

## Runtime arguments

Application arguments should be passed after `--`.

Example:

```bash
vix run -- --port 8080
```

The first part belongs to Vix.

The second part belongs to the app.

```txt
vix run [vix options] -- [app arguments]
```

This distinction matters in scripts and replay workflows.

## Replay

If a run is important to reproduce, record it.

```bash
vix run --replay
```

Replay the latest run:

```bash
vix replay last
```

Replay the latest failed run:

```bash
vix replay failed
```

The app model includes replay because real applications fail.

When they fail, the exact run context matters.

## Development mode

Development mode watches files and rebuilds intelligently.

```bash
vix dev
```

Typical behavior:

```txt
source change -> rebuild
header change -> rebuild
config change -> reconfigure and rebuild
ignored path -> do nothing
```

Ignored paths include:

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

`vix dev` is for active development.

It is not the production process.

## Build output

Build output should not pollute the source model.

Common build folders:

```txt
build/
build-ninja/
build-release/
```

Generated Vix state:

```txt
.vix/
```

Package output:

```txt
dist/
```

Clean local project state:

```bash
vix clean
```

Reset local project state and reinstall dependencies:

```bash
vix reset
```

## Packaging

A reusable project can be packed.

```bash
vix pack
```

Verify it:

```bash
vix verify
```

Cache it:

```bash
vix cache --path ./dist/api@1.0.0
```

For application developers, packaging is not always the first concern.

For library and distribution workflows, it matters.

## Production config

A production-ready app should have production config in `vix.json`.

Important sections:

```txt
production.service
production.proxy
production.health
production.logs
production.deploy
```

This lets Vix run:

```bash
vix service init
vix proxy nginx init
vix health
vix logs
vix deploy
```

Production should not be a separate manual world.

It should be part of the application model.

## Local vs production

Local development:

```bash
vix dev
```

Production service:

```bash
vix service init
vix service status
```

Local check:

```bash
vix health local
```

Public check:

```bash
vix health public
```

Deployment:

```bash
vix deploy
```

The same app moves through different workflows.

But the app model stays the same.

## A complete backend template

A serious backend template should contain:

```txt
api/
├── vix.app
├── vix.json
├── vix.lock
├── .env.example
├── production.env.required
├── README.md
├── src/
│   ├── main.cpp
│   ├── app/
│   ├── config/
│   ├── routes/
│   ├── middleware/
│   ├── validation/
│   ├── database/
│   ├── services/
│   └── errors/
├── migrations/
├── tests/
├── public/
└── data/
```

That is the kind of app Vix should make easy to create.

```bash
vix new api --template backend
```

## Application checklist

A Vix application should answer these questions:

```txt
What is the app name?
What type of target is it?
What source files are compiled?
What modules are used?
What dependencies are installed?
What env variables are required?
How is the app run locally?
How is the app built?
How is it tested?
How is it checked?
How is it deployed?
How are logs read?
How is health checked?
```

If the project cannot answer these questions, the application model is not complete.

## What you should remember

A Vix application is not only source code.

It is:

```txt
source files
  -> manifest
  -> modules
  -> dependencies
  -> runtime workflow
  -> build workflow
  -> tests
  -> production workflow
```

Use:

```bash
vix new api --template backend
```

for a real backend starting point.

Use:

```txt
vix.app
```

for the simple application manifest.

Use:

```txt
vix.json
```

for project workflow, dependencies, tasks, registry metadata, and production config.

Use:

```bash
vix install
```

to reproduce dependencies.

Use:

```bash
vix dev
```

to develop.

Use:

```bash
vix deploy
```

when the app is ready for production.

## Next chapter

[Next: Runtime Workflow](/book/05-runtime-workflow)
