# vix.app

`vix.app` is a simple project manifest for Vix.cpp.

It lets you build and run C++ projects without writing a `CMakeLists.txt` manually.

Instead of starting with CMake configuration, you describe your project in a small `vix.app` file, and Vix generates the internal CMake project for you.

```txt
vix.app
  -> generated CMake project
  -> vix build
  -> executable or library
```

`vix.app` is designed for simple and medium C++ projects that need a clean build experience without the usual CMake setup cost.

For advanced projects, you can still use a normal `CMakeLists.txt`.

## Why vix.app exists

C++ is powerful, but starting a C++ project often requires writing build configuration before writing real code.

For many projects, the user only wants to say:

```txt
this is my app
these are my source files
these are my include directories
these are my libraries
build and run it
```

`vix.app` gives Vix a simple, readable description of the project.

Example:

```ini
name = hello
type = executable
standard = c++20

sources = [
  src/main.cpp,
]

include_dirs = [
  include,
]
```

Then you can run:

```bash
vix build
vix run
```

## What vix.app does

A `vix.app` file can describe:

- the target name
- the target type
- the C++ standard
- source files
- include directories
- preprocessor definitions
- libraries to link
- compile options
- link options
- CMake packages
- resources to copy
- output directory

For example:

```ini
name = myapp
type = executable
standard = c++23
output_dir = bin

sources = [
  src/main.cpp,
  src/app.cpp,
]

include_dirs = [
  include,
]

defines = [
  MYAPP_VERSION="1.0.0",
]

packages = [
  Threads:REQUIRED,
]

links = [
  Threads::Threads,
]

compile_options = [
  -Wall,
  -Wextra,
]
```

## Project detection

Vix uses this resolution order:

```txt
1. If CMakeLists.txt exists, Vix uses the normal CMake project.
2. If no CMakeLists.txt exists but vix.app exists, Vix uses vix.app.
```

This means `vix.app` does not break existing CMake projects.

If your project has a `CMakeLists.txt`, Vix will keep using it directly.

If your project only has a `vix.app`, Vix will generate an internal CMake project under:

```txt
.vix/generated/app/CMakeLists.txt
```

You should not edit this generated file manually.

Edit `vix.app` instead.

## Basic project layout

A minimal `vix.app` project looks like this:

```txt
hello/
  vix.app
  src/
    main.cpp
```

`vix.app`:

```ini
name = hello
type = executable
standard = c++20

sources = [
  src/main.cpp,
]
```

`src/main.cpp`:

```cpp
#include <vix.hpp>

int main()
{
  vix::print("Hello from vix.app");
  return 0;
}
```

Build it:

```bash
vix build
```

Run it:

```bash
vix run
```

## Supported target types

`vix.app` supports these target types:

```ini
type = executable
```

```ini
type = static
```

```ini
type = shared
```

```ini
type = library
```

Use `executable` for applications.

Use `static` for static libraries.

Use `shared` for shared libraries.

Use `library` when you want the default library behavior supported by Vix.

## vix.app and CMake

`vix.app` does not remove CMake.

It gives a simpler entry point for projects that do not need a custom `CMakeLists.txt`.

Internally, Vix can generate a CMake project from your manifest.

This gives you a simple user experience while keeping compatibility with the existing C++ ecosystem.

```txt
Simple project:
  vix.app -> generated CMake -> build

Advanced project:
  CMakeLists.txt -> normal CMake build
```

## When to use vix.app

Use `vix.app` when your project has a straightforward structure:

```txt
app/
  vix.app
  include/
  src/
```

Good use cases:

- small CLI applications
- examples
- learning projects
- simple libraries
- prototypes
- demos
- apps with a few dependencies
- projects that do not need custom CMake logic

## When to use CMakeLists.txt

Use a normal `CMakeLists.txt` when your project needs full CMake control.

Examples:

- multiple complex targets
- custom code generation
- advanced install rules
- complex toolchains
- platform-specific build logic
- advanced dependency discovery
- custom CMake functions
- generated sources
- large monorepos

The rule is simple:

```txt
Start with vix.app.
Move to CMakeLists.txt when you need full control.
```

## vix.app is the simple path

`vix.app` is the easiest way to start a C++ project with Vix.

It is not meant to become a second CMake language.

It is meant to keep common projects simple.

```txt
vix.app is for clarity.
CMake is for full control.
Vix connects both.
```

## Next steps

Start with:

- [Getting Started](./getting-started.md)
- [Manifest Reference](./manifest-reference.md)
- [Examples](./examples.md)
- [Packages and Links](./packages-and-links.md)
