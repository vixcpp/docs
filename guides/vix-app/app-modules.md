# App Modules

App modules let one Vix application grow as a set of clear internal parts. They are useful when a backend starts to contain features such as authentication, projects, builds, packages, logs, registry, deployments, or billing, and those features need their own structure without turning the main `src/` directory into one large folder.

A module is declared in `vix.app`, enabled or disabled from the same file, and checked through the normal Vix CLI workflow.

```bash
vix modules list
vix modules check
vix build
```

The important idea is simple: the application remains one application, but its internal features can be organized as modules with explicit names and dependencies.

## Why app modules exist

A backend often starts small. At the beginning, `src/main.cpp`, a few controllers, and a route registry may be enough. Later, the project grows. Authentication needs its own routes, services, models, and validation. Projects need their own logic. Builds and packages may depend on projects. Logs may be shared by several features.

Without a module layer, all of that code tends to move into the same application tree. The project still builds, but it becomes harder to see which feature owns which files and which feature depends on another one.

App modules solve this at the application level. They let the developer keep one Vix backend while giving each feature a stable place, a public boundary, and an explicit dependency list.

## Basic module declaration

A module is declared with a `[module.<name>]` section.

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []
```

The section name is the module name. In this example, the module is `auth`.

The `path` points to the module directory, `kind` describes the role of the module, and `depends` lists other internal modules used by this module.

## Example with several modules

A backend with authentication, projects, builds, and packages can describe the internal shape directly in `vix.app`.

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

[module.builds]
enabled = true
path = "modules/builds"
kind = "backend"
depends = [
  "projects",
]

[module.packages]
enabled = true
path = "modules/packages"
kind = "backend"
depends = [
  "projects",
]
```

This makes the architecture visible from the project root. A developer can see that `projects` depends on `auth`, while `builds` and `packages` depend on `projects`. That information should not be hidden only inside include paths or implementation files.

## Creating modules

Use the Vix CLI to initialize the module workflow and create module skeletons.

```bash
vix modules init
vix modules add auth
vix modules add projects
vix modules add builds
vix modules add packages
```

After creating modules, list them from the project root.

```bash
vix modules list
```

Then run the module checks.

```bash
vix modules check
```

The module commands keep the file structure and manifest declarations aligned. The goal is not to make the developer manage generated build wiring by hand, but to keep the project organized through Vix.

## Module path

The `path` field points to the module directory relative to the project root.

```ini
[module.auth]
path = "modules/auth"
```

The default convention is:

```txt
modules/<name>
```

For a module named `auth`, the expected path is:

```txt
modules/auth
```

Keeping modules under `modules/` makes the project easy to scan.

```txt
api/
  src/
  include/
  modules/
    auth/
    projects/
    builds/
    packages/
  vix.app
```

The application source tree remains responsible for application bootstrap and high-level wiring. Feature-specific code lives in the module that owns it.

## Module kind

The `kind` field describes the role of the module.

```ini
kind = "backend"
```

For backend applications, use `backend`.

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []
```

Other values such as `library` can be used for internal reusable code, but a normal backend feature should stay as `backend`. The value should describe what the module is in the application, not only how it is built internally.

## Enabled and disabled modules

The `enabled` field controls whether a module participates in the application.

```ini
[module.auth]
enabled = true
```

A disabled module remains declared, but it is not wired into the application target.

```ini
[module.billing]
enabled = false
path = "modules/billing"
kind = "backend"
depends = [
  "auth",
]
```

This is useful when a feature is being prepared but should not be part of the current build yet. The declaration stays visible, but the module is not active.

You can enable or disable a module through the CLI.

```bash
vix modules enable billing
vix modules disable billing
```

## Dependencies between modules

The `depends` field lists internal module dependencies by module name.

```ini
[module.projects]
enabled = true
path = "modules/projects"
kind = "backend"
depends = [
  "auth",
]
```

This means that `projects` is allowed to use the public API of `auth`.

A module with no internal dependencies should use an empty list.

```ini
depends = []
```

Dependencies should be explicit. When one module uses another module, the relationship belongs in `vix.app`, because the manifest is the place where the application architecture is described.

## Public and private module code

A module should expose public headers through its `include/` directory and keep implementation details under `src/`.

```txt
modules/auth/
  include/
    auth/
      api.hpp
  src/
    AuthModule.cpp
    AuthService.cpp
```

Code from another module should include public headers.

```cpp
#include <auth/api.hpp>
```

It should not reach into private implementation files.

```cpp
// Avoid this.
#include "../auth/src/AuthService.hpp"
```

The public include path is the contract. The private source tree is free to change as long as the public module API remains stable.

## Backend module example

A simple backend module can expose one registration function.

```cpp
#pragma once

#include <vix/print.hpp>

namespace auth
{
  inline void register_auth_module()
  {
    vix::print("auth module registered");
  }
}
```

Another module can use it only when the dependency is declared.

```ini
[module.projects]
enabled = true
path = "modules/projects"
kind = "backend"
depends = [
  "auth",
]
```

The manifest keeps the dependency visible. The source code uses the public API. Both parts matter.

## Main application and modules

The main application target should stay focused on the application entry point, bootstrap, shared support code, and route wiring.

```ini
sources = [
  "src/main.cpp",
  "src/api/app/AppBootstrap.cpp",
  "src/api/support/HttpResponses.cpp",
  "src/api/presentation/routes/RouteRegistry.cpp",
  "src/api/presentation/middleware/MiddlewareRegistry.cpp",
  "src/api/presentation/controllers/HomeController.cpp",
  "src/api/presentation/controllers/HealthController.cpp",
]
```

Module implementation files should not be copied into the main `sources` list by hand. The module declaration gives Vix the information it needs to wire enabled modules into the application workflow.

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []
```

This keeps the application manifest readable. The top-level source list describes the app shell, and the module sections describe the internal feature structure.

## Complete backend example

```ini
name = "api"
type = "executable"
standard = "c++20"
output_dir = "bin"

sources = [
  "src/main.cpp",
  "src/api/app/AppBootstrap.cpp",
  "src/api/support/HttpResponses.cpp",
  "src/api/presentation/routes/RouteRegistry.cpp",
  "src/api/presentation/middleware/MiddlewareRegistry.cpp",
  "src/api/presentation/controllers/HomeController.cpp",
  "src/api/presentation/controllers/HealthController.cpp",
]

include_dirs = [
  "include",
  "src",
]

defines = [
  "VIX_BACKEND_APP=1",
  "VIX_APP_NAME=api",
]

packages = [
  "vix",
]

links = [
  "vix::vix",
]

resources = [
  ".env=.env",
  "public=public",
  "views=views",
  "storage=storage",
]

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

[module.builds]
enabled = true
path = "modules/builds"
kind = "backend"
depends = [
  "projects",
]

[module.packages]
enabled = true
path = "modules/packages"
kind = "backend"
depends = [
  "projects",
]
```

This manifest describes one backend executable and four internal modules. The backend remains one deployable application, but the feature areas are separated and checked through the Vix module workflow.

## Module commands

The module workflow is managed with `vix modules`.

```bash
vix modules init
```

Initializes the module structure for the project.

```bash
vix modules add auth
```

Creates a new module skeleton.

```bash
vix modules list
```

Lists modules declared in `vix.app`.

```bash
vix modules enable auth
vix modules disable auth
```

Enables or disables a module from the manifest.

```bash
vix modules check
```

Checks the module structure and dependency rules.

Run `check` before important builds or commits.

```bash
vix modules check
vix build
```

## When to create a module

Create a module when a feature has its own responsibility and will likely grow with its own routes, services, models, storage logic, or public API.

Good module candidates:

```txt
auth
projects
builds
packages
logs
registry
deployments
billing
```

Do not create a module for every small helper file. A small utility can stay in the main application or in a shared internal library. Modules are most useful when they represent real application features.

## Modules and registry dependencies

An app module is part of the same application. It gives a feature a clear place in the source tree and a declared position in the application graph.

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []
```

Registry dependencies come from outside the project and are resolved by Vix. If a package is used by the application shell, keep it in the root dependency list. If a package belongs to one module, declare it in that module with `vix add --module`.

```bash
vix add gk/jwt@^1.0.0 --module auth
```

The command writes the dependency to `modules/auth/vix.module`.

```ini
[deps]
registry = [
  "gk/jwt@^1.0.0",
]

links = [
  "gk::jwt",
]
```

When `auth` is enabled in `vix.app`, Vix includes those registry dependencies in the application dependency resolution and links the declared targets into the generated module target. This keeps package ownership close to the feature that uses it while preserving one root `vix.lock` for the application build.

## Modules versus libraries

A module is a feature inside one application.

```ini
name = "api"
type = "executable"

[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []
```

A library target is the main output of a project.

```ini
name = "mathkit"
type = "static-library"
```

For a backend with internal features, use app modules. For reusable code that should be consumed by other projects, use a library target.

## Common mistakes

The first common mistake is using source includes to create hidden dependencies between modules. If `projects` uses `auth`, declare the dependency.

```ini
[module.projects]
depends = [
  "auth",
]
```

The second mistake is reaching into another module’s private `src/` directory. Cross-module usage should go through public headers under the module’s `include/` tree.

The third mistake is keeping a disabled module as a dependency of an enabled module. If an enabled module depends on another module, that dependency should also be enabled, otherwise the application structure no longer matches the build intent.

## Checking modules

After editing module declarations, run:

```bash
vix modules check
```

Then build the application.

```bash
vix build
```

When `vix.app` changes, Vix treats it as a configuration change. The application wiring can be refreshed before the next build or dev restart, which is what keeps the module workflow reliable during development.

## Recommended order in `vix.app`

Keep module sections after the main application fields.

```ini
name = "api"
type = "executable"
standard = "c++20"
output_dir = "bin"

sources = [
]

include_dirs = [
]

packages = [
]

links = [
]

resources = [
]

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

This order makes the file easy to read. The top of the manifest describes the application target. The bottom describes the internal modules that belong to that application.

## Next step

Continue with best practices to see how to keep `vix.app` readable as an application grows.

[Best Practices](/guides/vix-app/best-practices)
