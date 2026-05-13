# vix new

`vix new` creates a new Vix project.

Use it when you want to start a new application, create a reusable header-only library, or initialize a Vix project in an existing folder.

## Usage

```bash
vix new <name|path> [options]
```

## Examples

Create a new application named `api`:

```bash
vix new api
```

Create a project in the current directory:

```bash
vix new .
```

Create a header-only library:

```bash
vix new tree --lib
```

Create a project inside another directory:

```bash
vix new blog -d ./projects
```

Overwrite an existing directory:

```bash
vix new api --force
```

## What it creates

For an application, `vix new` generates a ready-to-run Vix project with:

- a CMake project
- source structure
- config files
- a `vix.json` manifest
- default project tasks
- an empty dependency list
- an executable target matching the project name

For a header-only library, `vix new` generates:

- a CMake project
- an `include/` directory
- a generated header
- a `tests/` directory
- an `examples/` directory
- a `vix.json` package manifest
- an interface CMake target
- an alias target in the form `name::name`

## Application workflow

Create the project:

```bash
vix new api
```

Enter the project:

```bash
cd api/
```

Build the application:

```bash
vix build
```

Run the application:

```bash
vix run
```

Or start development mode:

```bash
vix dev
```

## Library workflow

Create a header-only library:

```bash
vix new tree --lib
```

Enter the project:

```bash
cd tree/
```

Build the generated library project:

```bash
vix build --build-target all
```

Enable tests:

```bash
vix build --build-target all -- -Dtree_BUILD_TESTS=ON
```

Run tests:

```bash
vix tests
```

For header-only libraries, `vix build` alone may not be the right command because `vix build` builds the main project target by default.

For example, inside a project named `tree`, `vix build` tries to build the target named `tree`.

A header-only library usually exposes an interface target, not a normal executable named `tree`.

Use this instead:

```bash
vix build --build-target all
```

## Application project

By default, `vix new` creates an application:

```bash
vix new api
```

This is equivalent to:

```bash
vix new api --app
```

Use this when you want to build an executable application, API server, backend service, tool, or demo.

The generated application can normally be built with:

```bash
vix build
```

Then run with:

```bash
vix run
```

Or launched in development mode with:

```bash
vix dev
```

## Library project

Use `--lib` when you want to create a header-only library package:

```bash
vix new tree --lib
```

This is useful when you want to create reusable C++ code that can later be packaged and shared.

The generated library is header-only, so its main CMake target is an interface target.

Build it with:

```bash
vix build --build-target all
```

Tests are disabled by default for generated header-only libraries.

Enable tests with:

```bash
vix build --build-target all -- -Dtree_BUILD_TESTS=ON
```

Then run:

```bash
vix tests
```

Replace `tree` with your project name:

```bash
vix build --build-target all -- -Dmy_lib_BUILD_TESTS=ON
```

## Why libraries use `--build-target all`

`vix build` builds the main project target by default.

The default target name is the project directory name.

For an application named `api`, this works because the generated CMake project creates an executable target named `api`.

For a header-only library named `tree`, the project creates an interface library target, tests, and examples.

Because header-only libraries do not produce a normal binary target named like an app, use:

```bash
vix build --build-target all
```

This asks CMake and Ninja to build all generated targets that are enabled in the current configuration.

## Initialize the current directory

Use `.` to create the project in the current folder:

```bash
vix new .
```

This is useful when you already created the repository manually.

Example:

```bash
mkdir api
cd api
git init
vix new .
```

## Create inside another directory

Use `-d` or `--dir` to choose the base directory where the project should be created:

```bash
vix new blog -d ./projects
```

This creates:

```txt
./projects/blog
```

## Overwrite an existing directory

By default, Vix avoids overwriting existing project files.

Use `--force` only when you intentionally want to overwrite an existing directory:

```bash
vix new api --force
```

Use this carefully because existing files may be replaced.

## Options

| Option | Description |
| --- | --- |
| `--app` | Generate an application project. This is the default. |
| `--lib` | Generate a header-only library project. |
| `-d, --dir <path>` | Base directory for project creation. |
| `--force` | Overwrite an existing directory. |
| `-h, --help` | Show command help. |

## Environment variables

| Variable | Description |
| --- | --- |
| `VIX_NONINTERACTIVE=1` | Disable interactive prompts. |
| `CI=1` | Disable interactive prompts in CI environments. |

Use non-interactive mode in scripts and CI pipelines:

```bash
VIX_NONINTERACTIVE=1 vix new api
```

Create a library in non-interactive mode:

```bash
VIX_NONINTERACTIVE=1 vix new tree --lib
```

## Generated manifest

A new project includes a `vix.json` manifest.

The manifest describes the project, its dependencies, and reusable tasks.

For an application, the manifest is used for tasks such as development, testing, checking, formatting, and release workflows.

For a library, the manifest is used for package metadata and dependencies.

The exact generated content may evolve with Vix versions, but the role stays the same: `vix.json` is the project manifest.

## Generated application structure

A generated application has a structure similar to:

```txt
api/
├── CMakeLists.txt
├── CMakePresets.json
├── README.md
├── api.vix
├── vix.json
├── .env
├── .env.example
├── src/
│   └── main.cpp
└── tests/
    └── test_basic.cpp
```

The application target matches the project name.

For example:

```bash
vix new api
cd api/
vix build
```

This builds the `api` target.

## Generated library structure

A generated header-only library has a structure similar to:

```txt
tree/
├── CMakeLists.txt
├── CMakePresets.json
├── README.md
├── tree.vix
├── vix.json
├── include/
│   └── tree/
│       └── tree.hpp
├── examples/
│   ├── CMakeLists.txt
│   └── basic.cpp
└── tests/
    └── test_basic.cpp
```

Build it with:

```bash
vix build --build-target all
```

Enable tests with:

```bash
vix build --build-target all -- -Dtree_BUILD_TESTS=ON
```

Run tests with:

```bash
vix tests
```

## Build behavior

`vix build` does not always mean “build everything”.

By default, it builds the main project target.

For applications, this is usually what you want:

```bash
vix build
```

For header-only libraries, prefer:

```bash
vix build --build-target all
```

This matches the build behavior documented in the `vix build` guide.

## After project creation

For an application, the usual next commands are:

```bash
cd api/
vix build
vix run
```

For a library, the usual next commands are:

```bash
cd tree/
vix build --build-target all
vix build --build-target all -- -Dtree_BUILD_TESTS=ON
vix tests
```

Use:

```bash
vix install
```

when your project has dependencies that must be installed from `vix.lock`.

Use:

```bash
vix check
```

when you want to validate the project.

## Common mistakes

### Running commands outside the project

Wrong:

```bash
vix new api
vix dev
```

Correct:

```bash
vix new api
cd api/
vix dev
```

After creating a project, enter the generated directory before running project commands.

### Using `vix build` directly in a header-only library

Wrong:

```bash
vix new tree --lib
cd tree/
vix build
```

This may fail because `vix build` tries to build the main target named after the project directory.

Correct:

```bash
vix new tree --lib
cd tree/
vix build --build-target all
```

### Running library tests before enabling them

Wrong:

```bash
vix new tree --lib
cd tree/
vix build --build-target all
vix tests
```

Correct:

```bash
vix new tree --lib
cd tree/
vix build --build-target all -- -Dtree_BUILD_TESTS=ON
vix tests
```

Tests for generated header-only libraries are disabled by default.

### Creating a library when you need an app

This creates a library:

```bash
vix new api --lib
```

For a backend service or executable app, use the default:

```bash
vix new api
```

### Using `--force` too early

Avoid this unless you really want to overwrite files:

```bash
vix new api --force
```

Prefer creating a clean folder first.

## Troubleshooting

### Build target not found

If you see an error like:

```txt
✖ Build target not found
target: tree
hint: This project does not define a CMake target named 'tree'.
```

You are probably inside a generated header-only library.

Use:

```bash
vix build --build-target all
```

### No tests available

If you see:

```txt
✖ No tests available.
➜ Tests were not generated in the existing build directory.
```

Enable tests first:

```bash
vix build --build-target all -- -Dtree_BUILD_TESTS=ON
```

Then run:

```bash
vix tests
```

### You created a project but commands do not work

Make sure you entered the generated directory:

```bash
cd api/
```

or:

```bash
cd tree/
```

### You need raw build details

Use:

```bash
vix build --cmake-verbose
```

or inspect:

```bash
cat build-ninja/build.log
```

## When to use `vix new`

Use `vix new` when:

- starting a new Vix application
- creating a reusable Vix header-only library package
- initializing an existing empty repository
- preparing a project for dependency management
- creating a project that should work with `vix dev`, `vix run`, `vix build`, and `vix check`

## Related commands

| Command | Purpose |
| --- | --- |
| `vix build` | Build the project |
| `vix run` | Build and run the app |
| `vix dev` | Run the app with reload |
| `vix tests` | Run tests |
| `vix check` | Validate the project |
| `vix install` | Install project dependencies |
| `vix task` | Run generated or custom project tasks |
| `vix add` | Add dependencies |

## Next step

Continue with building projects.

Open the `vix build` guide.
