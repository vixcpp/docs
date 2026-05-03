# vix run

`vix run` builds and runs a Vix application, a single C++ file, or a `.vix` manifest.

Use it when you want one command that prepares the program and starts it.

## Usage

```bash
vix run [name|file.cpp|manifest.vix] [options] [-- compiler/linker flags] [--run <args...>]
```

## What it supports

| Input | Mode | Example |
|-------|------|---------|
| Project name or empty input | Project mode | `vix run` |
| Single `.cpp` file | Script mode | `vix run main.cpp` |
| `.vix` manifest file | Manifest mode | `vix run app.vix` |

## Project mode

Project mode is used when Vix runs a CMake-based project:

```bash
vix run
```

You can also pass a project or app name:

```bash
vix run api
```

Vix detects the project directory, configures the project if needed, builds it, and runs the selected target.

## Script mode

Script mode is used when the input is a single `.cpp` file:

```bash
vix run main.cpp
```

This lets you run C++ files with a script-like workflow. Vix compiles the file, caches the output when possible, and runs the resulting binary.

## Manifest mode

Manifest mode is used when the input is a `.vix` file:

```bash
vix run app.vix
```

The manifest is loaded first, then command-line options are applied on top. If the manifest defines a project app, Vix behaves like project mode. If the manifest defines a script app, Vix behaves like script mode.

## Basic examples

```bash
# Run the current project
vix run

# Run a named app
vix run api

# Run a single C++ file
vix run main.cpp

# Run with a specific project directory
vix run --dir ./examples/blog

# Run a manifest
vix run app.vix
```

## Passing runtime arguments

Use `--run` when passing arguments to the program:

```bash
vix run main.cpp --run --port 8080
```

For project mode, you can also use repeatable `--args`:

```bash
vix run api --args --port --args 8080
```

## Important: `--` is not for runtime arguments

In script mode, everything after `--` is forwarded to the compiler or linker.

Wrong:

```bash
vix run main.cpp -- --port 8080
```

Here, `--port` is treated as a compiler flag, not as an argument to your program.

Correct:

```bash
vix run main.cpp --run --port 8080
```

Use `--run` for runtime arguments. Use `--` for compiler or linker flags.

## Passing compiler and linker flags

Use `--` when you want to forward flags to the compiler or linker in script mode:

```bash
vix run main.cpp -- -O2 -DNDEBUG
```

Link with libraries:

```bash
vix run main.cpp -- -lssl -lcrypto
```

You can combine compiler flags and runtime args:

```bash
vix run main.cpp -- -O2 -DNDEBUG --run hello 123
```

## Working directory

Use `--cwd` to run the program with a specific working directory:

```bash
vix run main.cpp --cwd ./data
```

This is useful when your program reads files using relative paths.

## Environment variables

Use `--env` to add or override environment variables for the running program:

```bash
vix run api --env VIX_LOG_LEVEL=debug
```

You can repeat it:

```bash
vix run api --env APP_ENV=dev --env PORT=8080
```

## Watch mode

Use `--watch` or `--reload` to rebuild and restart when files change:

```bash
vix run --watch api
```

For a long-running server:

```bash
vix run --force-server --watch api
```

For a single file:

```bash
vix run server.cpp --watch
```

## Server or script classification

Use `--force-server` for long-running processes:

```bash
vix run server.cpp --force-server
```

Use `--force-script` for short-lived tools:

```bash
vix run tool.cpp --force-script
```

## Script mode extras

### Auto dependencies

```bash
vix run main.cpp --auto-deps
```

### Sanitizers

Enable AddressSanitizer and UndefinedBehaviorSanitizer:

```bash
vix run main.cpp --san
```

Enable only UBSan:

```bash
vix run main.cpp --ubsan
```

### SQLite support

```bash
vix run main.cpp --with-sqlite
```

### MySQL support

```bash
vix run main.cpp --with-mysql
```

### Local script cache

```bash
vix run main.cpp --local-cache
```

## Logging options

```bash
vix run api --log-level debug
vix run api --verbose
vix run api --quiet
vix run api --log-format json
vix run api --log-color never
vix run api --no-color
```

Supported log formats: `kv`, `json`, `json-pretty`

## Terminal clearing

```bash
vix run api --no-clear
vix run api --clear=always
vix run api --clear=never
vix run api --clear=auto
```

## Presets

```bash
vix run api --preset dev-ninja
vix run api --preset dev-ninja --run-preset run-dev-ninja
```

## Parallel jobs

```bash
vix run api -j 8
```

## Options

| Option | Description |
|--------|-------------|
| `-d, --dir <path>` | Project directory. Default is auto-detect. |
| `--preset <name>` | Configure preset. Default is `dev-ninja`. |
| `--run-preset <name>` | Build preset for target run. |
| `-j, --jobs <n>` | Number of parallel build jobs. |
| `--clear <auto\|always\|never>` | Terminal clear behavior. |
| `--no-clear` | Alias for `--clear=never`. |
| `--cwd <path>` | Run the program with this working directory. |
| `--env <K=V>` | Add or override one environment variable. Repeatable. |
| `--args <value>` | Add one runtime argument. Repeatable. |
| `--run <args...>` | Runtime arguments for script mode. |
| `--watch, --reload` | Rebuild and restart on file changes. |
| `--force-server` | Treat as a long-running server. |
| `--force-script` | Treat as a short-lived script. |
| `--auto-deps` | Add include paths from local Vix dependencies. |
| `--san` | Enable ASan and UBSan. |
| `--ubsan` | Enable UBSan only. |
| `--with-sqlite` | Enable SQLite support for script mode. |
| `--with-mysql` | Enable MySQL support for script mode. |
| `--local-cache` | Use local script cache. |
| `--docs` | Enable automatic docs mode. |
| `--no-docs` | Disable automatic docs mode. |
| `--log-level <level>` | Set log level. |
| `--verbose` | Alias for `--log-level=debug`. |
| `-q, --quiet` | Alias for `--log-level=warn`. |
| `--log-format <format>` | Set log format. |
| `--log-color <mode>` | Control colored logs. |
| `--no-color` | Disable colored logs. |

## Environment variables

| Variable | Description |
|----------|-------------|
| `VIX_DOCS` | Enable or disable automatic docs mode. |
| `VIX_LOG_LEVEL` | Runtime log level. |
| `VIX_LOG_FORMAT` | Runtime log format. |
| `VIX_COLOR` | Color mode. |
| `NO_COLOR` | Disable colors. |
| `VIX_STDOUT_MODE` | Used by the CLI for smoother live output. |
| `VIX_CLI_CLEAR` | Terminal clear behavior. |

## Common mistakes

### Passing runtime args after `--`

Wrong:

```bash
vix run main.cpp -- --port 8080
```

Correct:

```bash
vix run main.cpp --run --port 8080
```

### Forgetting to run from the project directory

Wrong:

```bash
vix new api
vix run
```

Correct:

```bash
vix new api
cd api
vix run
```

## Recommended workflows

```bash
# Development server
vix dev

# One-off C++ file
vix run main.cpp

# Debug a single file with sanitizers
vix run main.cpp --san

# Run a project with runtime args
vix run api --args --port --args 8080

# Run a script with runtime args
vix run main.cpp --run --port 8080
```

## When to use `vix run`

Use `vix run` when you want to build and start something immediately: running the current project, a named app, a single `.cpp` file, a `.vix` manifest, or testing script-like C++ files quickly.

For active development with reload, prefer `vix dev`. For compile-only builds, prefer `vix build`. For validation, tests, and sanitizers, prefer `vix check`.

## Related commands

| Command | Purpose |
|---------|---------|
| `vix dev` | Run with development reload |
| `vix build` | Configure and compile |
| `vix check` | Validate build, tests, runtime, and sanitizers |
| `vix tests` | Run tests |
| `vix task` | Run reusable project tasks |

## Next step

Continue with development mode.

[Open the vix dev guide](/cli/dev)
