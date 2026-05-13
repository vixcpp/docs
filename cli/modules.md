
# vix modules

`vix modules` adds an app-first module organization layer to a CMake project.

Use it when you want to split a Vix application into clean, explicit, reusable C++ modules without turning the whole project into a complex monorepo.

## Usage

```bash
vix modules <subcommand> [options]
```

## Overview

`vix modules` helps you organize application code into independent CMake modules.

It creates a predictable structure:

```txt
modules/
└── User/
    ├── CMakeLists.txt
    ├── include/
    │   └── User/
    │       └── api.hpp
    └── src/
        └── User.cpp
```

Each module has:

- public headers in `include/<module>/`
- private implementation in `src/`
- its own `CMakeLists.txt`
- a CMake target
- a CMake alias target in the form `<project>::<module>`

For example, in a project named `blog`, a module named `User` creates:

```txt
target: blog::User
header: modules/User/include/User/api.hpp
impl:   modules/User/src/User.cpp
```

## Why modules exist

Large C++ apps often become hard to maintain when everything lives directly in `src/`.

`vix modules` gives you a simple convention:

- one feature/domain per module
- public API separated from private implementation
- explicit CMake targets
- explicit cross-module dependencies
- safer includes
- clearer project structure

The goal is not to replace CMake.

The goal is to make CMake organization easier and more predictable.

## Subcommands

| Command | Purpose |
| --- | --- |
| `vix modules init` | Initialize modules mode in the current project |
| `vix modules add <name>` | Create a new module |
| `vix modules check` | Validate module safety rules |
| `vix modules --help` | Show help |

## Basic workflow

Initialize modules mode:

```bash
vix modules init
```

Create a module:

```bash
vix modules add User
```

Use the module in code:

```cpp
#include <User/api.hpp>
```

Build the project:

```bash
vix build
```

Check module rules:

```bash
vix modules check
```

## Initialize modules mode

Run:

```bash
vix modules init
```

This creates:

```txt
modules/
cmake/vix_modules.cmake
```

It also patches the root `CMakeLists.txt` by adding an idempotent include block.

Example output:

```txt
  ✔  modules  initialized
  ─────────────────────────────────────
  files
  1  modules/  module directory
  2  cmake/vix_modules.cmake  module loader
  3  CMakeLists.txt  patched
  ─────────────────────────────────────
  next
  1  vix modules add <name>  create module
```

The generated CMake loader scans `modules/*` and adds every module that contains a `CMakeLists.txt`.

## Add a module

Run:

```bash
vix modules add User
```

Example output:

```txt
  ✔  User  module
  ─────────────────────────────────────
  files
  1  modules/User/include/User/api.hpp  public header
  2  modules/User/src/User.cpp  implementation
  3  modules/User/CMakeLists.txt  target
  ─────────────────────────────────────
  target
  1  blog::User  CMake alias
  ─────────────────────────────────────
  next
  1  #include <User/api.hpp>  include
  2  vix build  compile
```

For a project named `blog`, this creates a CMake alias target:

```txt
blog::User
```

and a real internal target similar to:

```txt
blog_User
```

The alias is the public name you should use when linking modules.

## Generated module structure

A module named `User` generates:

```txt
modules/User/
├── CMakeLists.txt
├── include/
│   └── User/
│       └── api.hpp
└── src/
    └── User.cpp
```

The public header is:

```txt
modules/User/include/User/api.hpp
```

The implementation file is:

```txt
modules/User/src/User.cpp
```

The module CMake file is:

```txt
modules/User/CMakeLists.txt
```

## Public include style

Use angle-bracket includes from the module public include root:

```cpp
#include <User/api.hpp>
```

Do not include module files with relative paths like:

```cpp
#include "../modules/User/include/User/api.hpp"
```

The generated module target exposes its public include directory through CMake.

## Generated public header

A generated module header looks like this:

```cpp
#ifndef blog_user_api_hpp
#define blog_user_api_hpp

#include <string>

namespace blog::User
{
  struct Api
  {
    static std::string name();
  };
}

#endif
```

The exact namespace depends on your project name and module name.

## Generated implementation

A generated implementation looks like this:

```cpp
#include <User/api.hpp>

namespace blog::User
{
  std::string Api::name()
  {
    return "blog::User";
  }
}
```

## Generated CMake target

A generated module `CMakeLists.txt` creates a normal library target and an alias target:

```cmake
add_library(blog_User)
add_library(blog::User ALIAS blog_User)
```

It then adds the implementation file:

```cmake
target_sources(blog_User
  PRIVATE
    src/User.cpp
)
```

It exposes the public include directory:

```cmake
target_include_directories(blog_User
  PUBLIC
    ${CMAKE_CURRENT_LIST_DIR}/include
  PRIVATE
    ${CMAKE_CURRENT_LIST_DIR}/src
)
```

It also requires C++20:

```cmake
target_compile_features(blog_User PUBLIC cxx_std_20)
```

## Module loader

`vix modules init` creates:

```txt
cmake/vix_modules.cmake
```

This loader scans the `modules/` directory and adds each module with a `CMakeLists.txt`.

Conceptually, it behaves like this:

```cmake
file(GLOB VIX_MODULE_DIRS RELATIVE "${VIX_MODULES_DIR}" "${VIX_MODULES_DIR}/*")

foreach(_m ${VIX_MODULE_DIRS})
  if(IS_DIRECTORY "${VIX_MODULES_DIR}/${_m}")
    if(EXISTS "${VIX_MODULES_DIR}/${_m}/CMakeLists.txt")
      add_subdirectory("${VIX_MODULES_DIR}/${_m}" "${CMAKE_BINARY_DIR}/vix_modules/${_m}")
    endif()
  endif()
endforeach()
```

The generated file is guarded so it is only included once.

## Root CMakeLists.txt patch

When you run:

```bash
vix modules init
```

Vix patches the root `CMakeLists.txt` with an idempotent block:

```cmake
# VIX_MODULES_BEGIN
include(${CMAKE_CURRENT_LIST_DIR}/cmake/vix_modules.cmake)
# VIX_MODULES_END
```

Idempotent means running the command multiple times does not duplicate the block.

## Auto-linking modules

By default, `vix modules add <name>` tries to patch the root `CMakeLists.txt` so the module is linked into the main project target.

For a project named `blog` and a module named `User`, it adds a guarded block similar to:

```cmake
# VIX_MODULE_LINK_BEGIN User
if (TARGET blog::User)
  if (TARGET blog)
    target_link_libraries(blog PRIVATE blog::User)
  endif()
endif()
# VIX_MODULE_LINK_END User
```

This works when the main application target has the same name as the CMake project.

For example:

```cmake
project(blog LANGUAGES CXX)

add_executable(blog src/main.cpp)
```

If your main target has another name, either use `--no-link` and link manually, or edit the generated link block.

## Manual linking

Use `--no-link` if you do not want Vix to patch the root `CMakeLists.txt`:

```bash
vix modules add User --no-link
```

Then link manually:

```cmake
target_link_libraries(blog PRIVATE blog::User)
```

## Cross-module dependencies

If one module uses another module, the dependency must be explicit.

Example:

```cpp
#include <Auth/api.hpp>
```

If module `User` includes `Auth`, then `User` must link to `Auth` in `modules/User/CMakeLists.txt`:

```cmake
target_link_libraries(blog_User PUBLIC blog::Auth)
```

Public module usage must be explicit because public headers affect downstream users.

## PUBLIC vs PRIVATE

Use `PUBLIC` when the dependency appears in public headers.

Example:

```cpp
// modules/User/include/User/api.hpp
#include <Auth/api.hpp>
```

Then:

```cmake
target_link_libraries(blog_User PUBLIC blog::Auth)
```

Use `PRIVATE` when the dependency is only used inside `.cpp` files.

Example:

```cpp
// modules/User/src/User.cpp
#include <Auth/api.hpp>
```

Then:

```cmake
target_link_libraries(blog_User PRIVATE blog::Auth)
```

## Module safety rules

`vix modules check` validates module rules.

Run:

```bash
vix modules check
```

It checks:

- public headers must not include private implementation files
- cross-module includes must be declared in CMake
- modules must expose dependencies explicitly

## Public headers must not include private implementation

Wrong:

```cpp
#include "../src/User.cpp"
```

Wrong:

```cpp
#include "src/internal.hpp"
```

Correct:

```cpp
#include <User/api.hpp>
```

Public headers should expose stable API only.

Private details should stay inside `src/`.

## Cross-module include without link

Wrong:

```cpp
// modules/User/include/User/api.hpp
#include <Auth/api.hpp>
```

without:

```cmake
target_link_libraries(blog_User PUBLIC blog::Auth)
```

Correct:

```cmake
target_link_libraries(blog_User PUBLIC blog::Auth)
```

## Check output

When modules are valid:

```txt
  ✔ Modules check passed
    • modules   : 2
    • headers   : 2
```

When a module has an undeclared dependency, Vix prints a focused diagnostic and shows the CMake fix.

Example:

```txt
  ✖ Missing explicit module dependency (include without link)
    • module    : User
    • header    : modules/User/include/User/api.hpp
    • uses      : <Auth/...>
  ! Fix (module CMakeLists.txt):

    target_link_libraries(blog_User PUBLIC blog::Auth)
```

## Options

| Option | Description |
| --- | --- |
| `-d, --dir <path>` | Project root. Defaults to the current directory. |
| `--project <name>` | Override the project name. By default, Vix reads it from root `CMakeLists.txt`. |
| `--no-patch` | Do not patch the root `CMakeLists.txt` during init. |
| `--patch` | Patch the root `CMakeLists.txt`. This is the default for init. |
| `--no-link` | Do not auto-link the generated module into the main project target. |
| `--link` | Auto-link the generated module into the main project target. This is the default for add. |
| `-h, --help` | Show help. |

## Use another project directory

Run modules commands from outside the project with `--dir`:

```bash
vix modules init --dir ./blog
vix modules add User --dir ./blog
vix modules check --dir ./blog
```

## Override project name

By default, Vix tries to detect the project name from the root `CMakeLists.txt`.

For example:

```cmake
project(blog LANGUAGES CXX)
```

This gives:

```txt
blog
```

You can override it:

```bash
vix modules add User --project blog
```

This is useful when:

- the project name cannot be detected
- the main CMake namespace differs from the root project name
- you are generating modules for a custom target layout

## Initialize without patching CMakeLists.txt

Use:

```bash
vix modules init --no-patch
```

This creates:

```txt
modules/
cmake/vix_modules.cmake
```

but does not modify the root `CMakeLists.txt`.

Then include the loader manually:

```cmake
include(${CMAKE_CURRENT_LIST_DIR}/cmake/vix_modules.cmake)
```

## Add without auto-linking

Use:

```bash
vix modules add User --no-link
```

This creates the module files but does not add a link block to the root `CMakeLists.txt`.

Then link the module manually:

```cmake
target_link_libraries(blog PRIVATE blog::User)
```

## Module naming rules

Module names may contain:

- letters
- numbers
- `_`
- `-`

Examples:

```bash
vix modules add User
vix modules add orders
vix modules add billing_api
vix modules add payment-gateway
```

Hyphens are normalized to underscores for CMake and C++ identifiers.

Example:

```bash
vix modules add payment-gateway
```

creates normalized identifiers based on:

```txt
payment_gateway
```

## Reserved module names

Some names are reserved because they conflict with project structure, tools, dependencies, or common build directories.

Avoid names such as:

- `modules`
- `module`
- `src`
- `source`
- `include`
- `cmake`
- `build`
- `dist`
- `test`
- `tests`
- `example`
- `examples`
- `vendor`
- `third_party`
- `external`
- `internal`
- `detail`
- `private`
- `public`
- `main`
- `app`
- `api`
- `core`
- `std`
- `vix`
- `vixcpp`
- `registry`
- `deps`
- `pack`
- `lock`
- `install`
- `add`
- `remove`
- `store`
- `gc`
- `fmt`
- `spdlog`
- `boost`
- `openssl`
- `zlib`
- `sqlite`
- `mysql`
- `postgres`
- `curl`
- `asio`
- `beast`

If you try to use a reserved name, Vix will reject it.

## Recommended module names

Prefer domain names:

```bash
vix modules add Auth
vix modules add User
vix modules add Products
vix modules add Orders
vix modules add Billing
vix modules add Notifications
```

Avoid technical names:

```bash
vix modules add Utils
vix modules add Helpers
vix modules add Common
```

A module should represent a feature or domain of your app.

## App-first organization

`vix modules` is app-first.

That means modules are designed primarily for organizing an application, not for publishing every feature as a separate package.

Use modules when code belongs to the current app.

Use packages when code should be reused across projects.

## Modules vs packages

Use a module when:

- the code belongs to one application
- the code depends on the app’s domain
- you want clean internal boundaries
- you want faster local organization

Use a package when:

- the code should be shared across projects
- the code has its own version
- the code should be published
- the code should be consumed through `vix add`

## Modules vs src folders

A traditional structure may look like:

```txt
src/
├── auth/
├── users/
├── products/
└── orders/
```

This is simple, but boundaries are informal.

With `vix modules`, each domain gets its own CMake target:

```txt
modules/
├── Auth/
├── User/
├── Products/
└── Orders/
```

This makes dependencies explicit and easier to validate.

## Recommended project layout

A Vix app with modules may look like:

```txt
blog/
├── CMakeLists.txt
├── CMakePresets.json
├── README.md
├── vix.json
├── src/
│   └── main.cpp
├── cmake/
│   └── vix_modules.cmake
└── modules/
    ├── User/
    │   ├── CMakeLists.txt
    │   ├── include/
    │   │   └── User/
    │   │       └── api.hpp
    │   └── src/
    │       └── User.cpp
    └── Auth/
        ├── CMakeLists.txt
        ├── include/
        │   └── Auth/
        │       └── api.hpp
        └── src/
            └── Auth.cpp
```

## Recommended CMake root order

In the root `CMakeLists.txt`, include modules after `project(...)` and before linking module targets.

Example:

```cmake
cmake_minimum_required(VERSION 3.20)
project(blog LANGUAGES CXX)

# VIX_MODULES_BEGIN
include(${CMAKE_CURRENT_LIST_DIR}/cmake/vix_modules.cmake)
# VIX_MODULES_END

add_executable(blog src/main.cpp)

# VIX_MODULE_LINKS_BEGIN
# module link blocks generated by vix modules add
# VIX_MODULE_LINKS_END
```

If your main target is created before module linking, make sure the generated link blocks appear after the target exists.

## Using a module in main.cpp

After creating a module:

```bash
vix modules add User
```

Use it in `src/main.cpp`:

```cpp
#include <vix.hpp>
#include <User/api.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.send(User::Api::name());
  });

  app.run(8080);
}
```

Depending on your generated namespace, you may need the full namespace:

```cpp
res.send(blog::User::Api::name());
```

## Build after adding modules

After adding a module, build normally:

```bash
vix build
```

If your main app target is not named like the project, use manual linking or `--project`.

You can also build all targets:

```bash
vix build --build-target all
```

## Validate modules

Run:

```bash
vix modules check
```

Use this after:

- adding a new module
- adding cross-module includes
- editing module CMake files
- refactoring public headers
- before committing module changes

## Common workflows

### Create app and initialize modules

```bash
vix new blog
cd blog/
vix modules init
vix modules add User
vix build
```

### Create several modules

```bash
vix modules add Auth
vix modules add User
vix modules add Products
vix modules add Orders
vix modules check
vix build
```

### Add a module without linking

```bash
vix modules add Billing --no-link
```

Then in CMake:

```cmake
target_link_libraries(blog PRIVATE blog::Billing)
```

### Add a module from outside the project

```bash
vix modules add User --dir ./blog
```

### Check modules from outside the project

```bash
vix modules check --dir ./blog
```

## Common mistakes

### Running modules before init

Wrong:

```bash
vix modules add User
```

without:

```bash
vix modules init
```

Correct:

```bash
vix modules init
vix modules add User
```

### Using a reserved name

Wrong:

```bash
vix modules add api
```

Correct:

```bash
vix modules add User
```

### Forgetting to include the public header

Wrong:

```cpp
#include "modules/User/include/User/api.hpp"
```

Correct:

```cpp
#include <User/api.hpp>
```

### Depending on another module without CMake link

Wrong:

```cpp
#include <Auth/api.hpp>
```

without:

```cmake
target_link_libraries(blog_User PUBLIC blog::Auth)
```

Correct:

```cmake
target_link_libraries(blog_User PUBLIC blog::Auth)
```

### Linking to the internal target name everywhere

Avoid using the internal target when a public alias exists:

```cmake
target_link_libraries(blog PRIVATE blog_User)
```

Prefer:

```cmake
target_link_libraries(blog PRIVATE blog::User)
```

### Assuming auto-link works for every project

Auto-linking expects the main target to be named like the project.

If your project is:

```cmake
project(blog LANGUAGES CXX)
```

but your executable is:

```cmake
add_executable(server src/main.cpp)
```

then auto-linking to `blog` will not link your real executable.

Use:

```bash
vix modules add User --no-link
```

Then manually link:

```cmake
target_link_libraries(server PRIVATE blog::User)
```

## Troubleshooting

### `modules/` folder not found

If you see:

```txt
modules/ folder not found.
Run: vix modules init
```

Run:

```bash
vix modules init
```

### Module already exists

If you see:

```txt
Module already exists: modules/User
```

Pick another name or remove the existing module manually.

### Failed to patch root CMakeLists.txt

Make sure the project has a root `CMakeLists.txt`.

Then run again:

```bash
vix modules init
```

or initialize without patching:

```bash
vix modules init --no-patch
```

and include the generated file manually:

```cmake
include(${CMAKE_CURRENT_LIST_DIR}/cmake/vix_modules.cmake)
```

### Auto-link did not affect your app

Your main target may not be named like the project.

Check your root `CMakeLists.txt`.

If you have:

```cmake
project(blog LANGUAGES CXX)
add_executable(server src/main.cpp)
```

then link manually:

```cmake
target_link_libraries(server PRIVATE blog::User)
```

### Include not found

If this fails:

```cpp
#include <User/api.hpp>
```

check that:

- the module exists
- the module is loaded by `cmake/vix_modules.cmake`
- the target using the header links to `blog::User`
- you rebuilt after adding the module

Try:

```bash
vix build --clean
```

### Missing explicit module dependency

If `vix modules check` reports a missing dependency, open the module `CMakeLists.txt` and add:

```cmake
target_link_libraries(blog_User PUBLIC blog::OtherModule)
```

Use `PUBLIC` when the dependency is included from a public header.

Use `PRIVATE` when it is only used in `.cpp` files.

## Best practices

### Keep module APIs small

Expose only what other parts of the app need.

Keep implementation details in `src/`.

### Prefer domain modules

Good:

- `Auth`
- `User`
- `Products`
- `Orders`
- `Billing`
- `Notifications`

Less useful:

- `Utils`
- `Helpers`
- `Common`
- `Stuff`

### Avoid circular dependencies

Avoid:

```txt
User -> Auth
Auth -> User
```

Prefer extracting shared concepts into a third module:

```txt
User -> Identity
Auth -> Identity
```

### Keep public headers clean

Public headers should avoid unnecessary includes.

Prefer forward declarations when possible.

### Keep dependencies explicit

When a module uses another module, declare it in CMake.

Do not rely on accidental include paths.

### Run checks before commits

Before committing module changes:

```bash
vix modules check
vix build
```

## Command reference

### `init`

```bash
vix modules init [options]
```

Initializes modules mode.

Common options:

```bash
vix modules init --no-patch
vix modules init --dir ./blog
```

Creates:

```txt
modules/
cmake/vix_modules.cmake
```

Patches root `CMakeLists.txt` unless `--no-patch` is used.

### `add`

```bash
vix modules add <name> [options]
```

Creates a module.

Examples:

```bash
vix modules add User
vix modules add Auth
vix modules add Products --no-link
vix modules add Billing --project blog
```

Creates:

```txt
modules/<name>/CMakeLists.txt
modules/<name>/include/<name>/api.hpp
modules/<name>/src/<name>.cpp
```

### `check`

```bash
vix modules check [options]
```

Validates module boundaries.

Examples:

```bash
vix modules check
vix modules check --dir ./blog
vix modules check --project blog
```

## When to use `vix modules`

Use `vix modules` when you want to:

- organize a growing Vix app
- split features into clear domains
- keep public and private code separate
- make CMake dependencies explicit
- avoid a messy `src/` folder
- validate module boundaries
- keep app architecture readable over time

Do not use `vix modules` when:

- the project is a tiny one-file example
- the code is meant to become a standalone package immediately
- you only need a quick script
- you do not want CMake target boundaries

## Related commands

| Command | Purpose |
| --- | --- |
| `vix new` | Create a new Vix project |
| `vix make` | Generate files and project artifacts |
| `vix build` | Build the project |
| `vix run` | Build and run the app |
| `vix dev` | Run the app with reload |
| `vix check` | Validate project health |
| `vix tests` | Run tests |
| `vix add` | Add external dependencies |

## Next step

Continue with building projects.

Open the `vix build` guide.
