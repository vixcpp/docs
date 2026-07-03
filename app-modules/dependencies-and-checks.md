# Dependencies and Checks

Application modules are useful only when their boundaries remain visible. A module should be able to use another module, but that relationship should not be hidden in random include paths or private implementation details. When `projects` depends on `auth`, the project should say so clearly.

Vix keeps this relationship visible in two places. In a `vix.app` project, the application manifest describes the module graph. In the module build files, CMake describes the target relationship. The manifest makes the architecture readable from the project root, while CMake makes the dependency correct for the build.

## Module dependencies in vix.app

In a `vix.app` project, dependencies are declared with the `depends` field.

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

This says that `projects` depends on `auth`. The dependency is declared by module name, not by target name. A developer reading the manifest can understand the relationship without opening the module source files.

This becomes more useful as the application grows.

```ini
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

Here, `builds` and `packages` depend on `projects`, and `projects` depends on `auth`. The manifest becomes a small map of the application’s internal feature graph.

## Build dependencies

The manifest describes the architecture, but the module target still needs the correct build relationship. When one module uses another module, the module `CMakeLists.txt` should link the dependency explicitly.

```cmake
target_link_libraries(api_projects
  PUBLIC
    api::auth
)
```

The target name `api_projects` is the real module target. The alias `api::auth` is the public target name exported by the `auth` module.

This matters when a public header from one module includes a public header from another module.

```cpp
#include <auth/api.hpp>
```

The include shows what the code uses. The target link shows what the build depends on. Both should tell the same story.

## Public headers and private implementation

A module has a public side and a private side.

```txt
modules/auth/
  include/auth/      public headers
  src/               private implementation
```

Public headers are allowed to be used by other modules.

```cpp
#include <auth/api.hpp>
```

Private implementation files under `src/` should not be included by another module. They belong to the module target, but they are not part of the module’s public interface.

Avoid this from a public header:

```cpp
#include "../src/AuthStore.hpp"
```

If another module needs something from `auth`, expose that behavior through a public header under `include/auth/`, then declare the dependency.

```cmake
target_link_libraries(api_projects
  PUBLIC
    api::auth
)
```

This keeps implementation details inside the module that owns them.

## The check command

`vix modules check` validates the module layer from the project root.

```bash
vix modules check
```

The command is not a replacement for compilation. It catches structural problems before the build becomes the only signal. This is especially useful in larger backends, where a broken module graph can be harder to understand once the compiler starts reporting errors from generated files or indirect includes.

Run it after changing module declarations, dependencies, module folders, route prefixes, or public headers.

```bash
vix modules check
vix build
```

For a stronger local workflow, run the project check after the module check.

```bash
vix modules check
vix check --tests --run
```

## What the check validates

In a `vix.app` project, the check command reads the module declarations from the root manifest and compares them with the filesystem.

It verifies that declared modules have folders.

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []
```

The path must exist.

```txt
modules/auth/
```

For enabled modules, the command also expects the module build and metadata files to exist.

```txt
modules/auth/CMakeLists.txt
modules/auth/vix.module
```

A disabled module may remain declared and may remain on disk, but an enabled module must be complete enough to be loaded by the generated build.

## Undeclared dependencies

A module should not depend on a module that is not declared in `vix.app`.

```ini
[module.projects]
enabled = true
path = "modules/projects"
kind = "backend"
depends = [
  "auth",
]
```

If `auth` has no module declaration, the dependency is incomplete. The check command reports this because the application manifest no longer describes a valid module graph.

Fix it by declaring the dependency target as a module.

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = []
```

## Enabled modules depending on disabled modules

An enabled module cannot depend on a disabled module.

```ini
[module.auth]
enabled = false
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

This state is unsafe because `projects` is active, but the module it needs is not active. The fix is to enable the dependency or disable the dependent module.

```bash
vix modules enable auth
```

or:

```bash
vix modules disable projects
```

The right choice depends on the feature state. The important rule is that the active module graph must be complete.

## Dependency cycles

Module dependencies should form a readable direction. A cycle usually means two features know too much about each other.

```ini
[module.auth]
enabled = true
path = "modules/auth"
kind = "backend"
depends = [
  "projects",
]

[module.projects]
enabled = true
path = "modules/projects"
kind = "backend"
depends = [
  "auth",
]
```

This creates a cycle.

```txt
auth -> projects -> auth
```

The check command reports circular dependencies because they make the module graph harder to reason about and can also create build-level problems.

The fix is usually to move shared behavior into a lower-level module or to change the public API so only one direction is needed.

```txt
auth
projects -> auth
```

or:

```txt
identity
auth -> identity
projects -> identity
```

The best shape depends on the application, but the dependency direction should remain clear.

## Cross-module includes

When a public header includes another module, that module relationship should be declared.

```cpp
#include <auth/api.hpp>
```

If this include appears in a public header from `projects`, then `projects` should link to `auth`.

```cmake
target_link_libraries(api_projects
  PUBLIC
    api::auth
)
```

This is one of the main checks that protects the module boundary. Including another module’s public header is allowed, but the dependency must be visible to the build.

Without the explicit dependency, the project may compile by accident because of include path leakage. That kind of dependency becomes fragile as the codebase grows.

## Private includes

Public headers should not include private implementation paths.

```cpp
#include "../../auth/src/AuthStore.hpp"
```

That include reaches into another module’s private implementation. It means the public API of the current module now depends on a file that the other module did not expose as public.

Move the shared type or function into a public header.

```txt
modules/auth/include/auth/AuthStore.hpp
```

Then include it through the module public path.

```cpp
#include <auth/AuthStore.hpp>
```

And declare the module dependency.

```cmake
target_link_libraries(api_projects
  PUBLIC
    api::auth
)
```

This keeps the dependency explicit and keeps private implementation files private.

## Route prefix conflicts

Backend modules can declare a route prefix in `vix.module`.

```ini
name = "auth"
kind = "backend"

[routes]
prefix = "/api/auth"

[tests]
enabled = true
```

The route prefix tells the project which HTTP namespace the module owns. Two routed modules should not use the same prefix.

```ini
[routes]
prefix = "/api/auth"
```

If both `auth` and `users` declare `/api/auth`, the check command reports the conflict. This prevents route ownership from becoming ambiguous.

Use clear prefixes that match the module responsibility.

```txt
auth      -> /api/auth
projects  -> /api/projects
builds    -> /api/builds
packages  -> /api/packages
```

The prefix does not need to expose every route in the module. It only gives the module a stable HTTP namespace.

## Missing module files

An enabled module should have the files needed by the module system.

```txt
modules/auth/
  CMakeLists.txt
  vix.module
```

If a module is declared and enabled but the folder is incomplete, `vix modules check` reports it before the build reaches a more confusing error.

This usually happens after moving folders manually, resolving a bad merge, or editing `vix.app` before creating the actual module skeleton.

The fix is to create the module through the CLI or restore the missing files.

```bash
vix modules add auth
```

If the module already exists but is incomplete, restore the missing `CMakeLists.txt` or `vix.module` from the module skeleton and then run the check again.

```bash
vix modules check
```

## Folder exists but is not declared

In a `vix.app` project, a module folder can exist without being declared in the manifest.

```txt
modules/billing/
```

If `billing` is not declared in `vix.app`, it is not part of the active module graph. The check command warns about this state because it may be intentional during migration, but it may also mean the module was created or copied without being registered.

Add the declaration when the module should belong to the application.

```ini
[module.billing]
enabled = true
path = "modules/billing"
kind = "backend"
depends = [
  "auth",
]
```

If the folder is not meant to be active yet, keep it disabled but declared.

```ini
[module.billing]
enabled = false
path = "modules/billing"
kind = "backend"
depends = [
  "auth",
]
```

This makes the project state explicit.

## Checks in CMake projects

In a CMake-first project, the check command still protects the module layout. It scans module public headers and validates public/private boundaries and cross-module include relationships.

The active state is usually controlled by CMake in this mode. A module is active when the project loads and links the module target. `vix modules enable`, `disable`, and `list` are mainly useful for `vix.app` projects because they operate on module sections in the manifest.

For CMake projects, the most important habit is to keep module dependencies visible in target links.

```cmake
target_link_libraries(api_projects
  PUBLIC
    api::auth
)
```

This gives the check command and the build system the same dependency information.

## Recommended workflow

Run module checks before builds when the module graph changes.

```bash
vix modules check
vix build
```

Run the full project check before a commit.

```bash
vix modules check
vix check --tests --run
```

For CMake projects with a custom target name, pass the project prefix when needed.

```bash
vix modules check --project api
```

The check command is most useful when it becomes part of the normal development rhythm. It keeps the module layer honest while the application grows.

## Next step

Continue with generated registration to understand how enabled modules are connected to the application startup flow in `vix.app` projects.

[Generated Registration](/app-modules/generated-registration)
