# vix modules

`vix modules` manages application modules from the command line. It is used to initialize module support, create module skeletons, inspect modules declared in `vix.app`, enable or disable modules, and validate module boundaries before the project is built.

This command is about internal application modules, not Vix SDK modules such as `vix::orm`, `vix::requests`, or `vix::ui`. An application module belongs to your project. It can represent a feature such as `auth`, `projects`, `builds`, `packages`, `billing`, or `logs`.

```bash
vix modules <subcommand> [options]
```

## Basic workflow

A new module workflow usually starts from the project root.

```bash
vix modules init
vix modules add auth
vix modules list
vix modules check
vix build
```

In a `vix.app` project, modules are declared in the root manifest. In a classic CMake project, Vix can still create the module layout and CMake targets without requiring the project to move to `vix.app`.

## Subcommands

```txt
init                 Initialize module support
add <name>           Create a module skeleton
list                 List modules declared in vix.app
enable <name>        Enable a module in vix.app
disable <name>       Disable a module in vix.app
check                Validate module structure and dependencies
```

## Options

```txt
-d, --dir <path>         Project root. Defaults to the current directory.
--project <name>         Override the detected project name.
--no-patch               Do not patch the root CMakeLists.txt during init.
--patch                  Patch the root CMakeLists.txt during init.
--no-link                Do not auto-link a new module into the main target.
--link                   Auto-link a new module into the main target.
-h, --help               Show command help.
```

The project name is used to generate module targets. For a project named `api` and a module named `auth`, Vix creates a target and an alias shaped like this:

```txt
api_auth
api::auth
```

Use `--project` when the detected name is not the prefix you want.

```bash
vix modules add auth --project api
```

## Initialize module support

`vix modules init` prepares the project for application modules.

```bash
vix modules init
```

It creates:

```txt
modules/
cmake/vix_modules.cmake
```

In a CMake project, Vix can patch the root `CMakeLists.txt` so the module loader is included by the existing build. In a `vix.app` project, Vix skips root CMake patching because the active CMake input is generated internally.

Use `--no-patch` when the project has a custom CMake structure and you want to connect the module loader manually.

```bash
vix modules init --no-patch
```

Then add the loader where it belongs in your build.

```cmake
include(${CMAKE_CURRENT_LIST_DIR}/cmake/vix_modules.cmake)
```

## Add a module

`vix modules add <name>` creates a new module under `modules/<name>/`.

```bash
vix modules add auth
```

In a backend-style `vix.app` project, the generated module is a routed backend module.

```txt
modules/auth/
  include/auth/AuthModule.hpp
  include/auth/controllers/AuthController.hpp
  src/AuthModule.cpp
  src/controllers/AuthController.cpp
  migrations/
  tests/test_auth.cpp
  CMakeLists.txt
  vix.module
```

In a simple C++ or CMake-first project, the generated module is smaller.

```txt
modules/auth/
  include/auth/api.hpp
  src/auth.cpp
  tests/test_auth.cpp
  CMakeLists.txt
  vix.module
```

Module names may contain letters, numbers, underscores, and hyphens. Hyphens are normalized to underscores for generated identifiers.

```txt
user-profile -> user_profile
```

## Add without linking

By default, in a CMake project, Vix may try to link the generated module into the detected main target. This is useful for simple projects, but custom CMake projects often need manual control.

Use `--no-link` to create the module without modifying the root build file.

```bash
vix modules add auth --no-link
```

Then link the module manually.

```cmake
target_link_libraries(my_server PRIVATE api::auth)
```

The alias target is the recommended target name to use from the rest of the project.

## List modules

`vix modules list` reads the module declarations from `vix.app`.

```bash
vix modules list
```

It shows the module name, enabled state, kind, path, filesystem status, and dependencies.

A modern module declaration looks like this:

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []
```

The `[module.<name>]` format is preferred because it can describe the module state, path, kind, and dependency list. Older manifests that use `modules = [...]` can still be read, but new projects should use section-based declarations.

## Enable a module

`vix modules enable <name>` marks an existing module declaration as active in `vix.app`.

```bash
vix modules enable auth
```

The command updates the module section.

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []
```

An enabled module participates in the generated application build. For routed modules, it can also be included in the generated module registration bridge.

## Disable a module

`vix modules disable <name>` keeps the module declared but removes it from the active application wiring.

```bash
vix modules disable auth
```

The command updates `vix.app`.

```ini
[module.auth]
enabled = false
path = "modules/auth"
kind = "backend"
depends = []
```

Disabling a module does not delete its files. The module can remain in the repository while being excluded from the current application build. This is useful for unfinished features, migrations, or temporary removals.

## Check modules

`vix modules check` validates the module layer.

```bash
vix modules check
```

The check command is meant to catch structural problems before the build reaches more confusing compiler or generated-file errors. In a `vix.app` project, it checks that declared modules exist, enabled modules have the required files, dependencies are declared, enabled modules do not depend on disabled modules, and dependency cycles are not present.

It also checks module boundaries. Public headers should not include private implementation files from `src/`, and cross-module includes should be backed by explicit target dependencies.

For backend modules, it also checks route prefix conflicts declared in `vix.module`.

```bash
vix modules check
vix build
```

For a stronger local validation, run:

```bash
vix modules check
vix check --tests --run
```

## Working with vix.app

In a `vix.app` project, the root manifest is the source of truth for the active module graph.

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []

[module.projects]
enabled = true
path = "modules/projects"
kind = "backend"
depends = [
  "auth",
]
```

When `projects` depends on `auth`, the dependency should be visible in the manifest. If the module also uses headers or symbols from `auth`, the module target should express that build dependency as well.

```cmake
target_link_libraries(api_projects
  PUBLIC
    api::auth
)
```

The manifest describes the application architecture. CMake describes the build relationship. Both should agree.

## Working with CMake

A project does not need to be fully generated by Vix to use `vix modules`. Existing CMake projects can use the module system to add a clear feature layout while keeping their current build design.

```bash
vix modules init
vix modules add auth
```

For simple projects, automatic patching and linking may be enough. For custom CMake projects, prefer manual integration.

```bash
vix modules init --no-patch
vix modules add auth --no-link
```

Then connect the loader and target yourself.

```cmake
include(${CMAKE_CURRENT_LIST_DIR}/cmake/vix_modules.cmake)

target_link_libraries(my_server PRIVATE api::auth)
```

This keeps Vix responsible for the module skeleton and conventions, while the existing CMake project remains responsible for the final build shape.

## Public and private convention

Modules follow a simple public/private convention.

```txt
modules/<name>/include/<name>/...  public headers
modules/<name>/src/...             private implementation
```

Code outside the module should include public headers.

```cpp
#include <auth/api.hpp>
```

It should not include private files from another module’s `src/` directory.

```cpp
#include "../../auth/src/AuthStore.hpp"
```

When another module needs functionality from `auth`, expose the needed type or function through a public header, then declare the dependency.

```cmake
target_link_libraries(api_projects
  PUBLIC
    api::auth
)
```

This is the main architectural contract behind `vix modules`.

## Common examples

Initialize modules in the current project:

```bash
vix modules init
```

Create a module:

```bash
vix modules add auth
```

Create a module in another project directory:

```bash
vix modules add auth --dir ./api
```

Create a module with an explicit project prefix:

```bash
vix modules add auth --project api
```

Create a module without changing root CMake files:

```bash
vix modules add auth --no-link
```

List modules declared in `vix.app`:

```bash
vix modules list
```

Disable and enable a module:

```bash
vix modules disable auth
vix modules enable auth
```

Validate the module layer:

```bash
vix modules check
```

## When to use this command

Use `vix modules` when a project needs feature boundaries inside one C++ application. It is useful for backends that grow into features such as authentication, projects, builds, packages, logs, billing, and deployment logic. It is also useful in existing CMake projects that want a consistent `modules/<name>/` layout without changing the whole build system.

A small project does not need to become modular immediately. Add modules when a feature has enough responsibility to deserve its own directory, public interface, implementation, tests, and dependency boundary.

## Related pages

- [Application Modules](/app-modules/)
- [CLI Workflow](/app-modules/cli-workflow)
- [Using with vix.app](/app-modules/with-vix-app)
- [Using with CMake](/app-modules/with-cmake)
- [Dependencies and Checks](/app-modules/dependencies-and-checks)
