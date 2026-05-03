# vix dev

`vix dev` starts a Vix application in development mode.

It configures, builds, and runs your app with auto-reload enabled by default.

Use it while actively editing code.

## Usage

```bash
vix dev [name] [options] [-- app-args...]
```

## What it does

`vix dev` is the developer-friendly entrypoint for running a Vix.cpp app during development. Internally, it behaves like `vix run` with watch mode enabled.

It can:

- detect the project
- configure it when needed
- build it
- start the app
- watch files
- rebuild on changes
- restart the app automatically

## Basic usage

```bash
# Run the current app
vix dev

# Run a named app
vix dev api

# Run a single C++ file in dev mode
vix dev server.cpp

# Pass runtime arguments
vix dev server.cpp -- --port 8080
```

## When to use it

Use `vix dev` when you are actively working on an app and want a fast feedback loop.

Typical workflow:

```bash
vix new api
cd api
vix install
vix dev
```

Then edit your files. Vix rebuilds and restarts the app when changes are detected.

## Difference between `vix dev` and `vix run`

| Command | Best for | Auto-reload |
|---------|----------|-------------|
| `vix dev` | active development | yes |
| `vix run` | manual run | no by default |
| `vix run --watch` | manual run with reload | yes |

These two commands are related — `vix dev` is conceptually similar to `vix run --watch`.

## Project mode

In a Vix project directory:

```bash
vix dev
```

You can also provide a project or app name:

```bash
vix dev api
```

## Script mode

You can use `vix dev` with a single `.cpp` file:

```bash
vix dev server.cpp
```

This is useful when you want to prototype a small server or tool without creating a full project.

## Runtime arguments

Arguments after `--` are passed to the application:

```bash
vix dev server.cpp -- --port 8080
```

## Watch and reload

Watch mode is enabled by default in `vix dev`. You can still pass the explicit flags:

```bash
vix dev --watch
vix dev --reload
```

## Force server mode

Use `--force-server` when the target is a long-running application:

```bash
vix dev server.cpp --force-server
```

## Force script mode

Use `--force-script` when the target is a short-lived CLI tool or script:

```bash
vix dev tool.cpp --force-script
```

## Parallel build jobs

```bash
vix dev -j 8
```

## Logging

```bash
vix dev --log-level debug
vix dev --verbose
vix dev --quiet
```

Supported log levels: `trace`, `debug`, `info`, `warn`, `error`, `critical`

## Options

| Option | Description |
|--------|-------------|
| `--force-server` | Force classification as a development server. |
| `--force-script` | Force classification as a short-lived script. |
| `--watch, --reload` | Enable hot reload. Enabled by default in dev mode. |
| `-j, --jobs <n>` | Number of parallel compile jobs. |
| `--log-level <level>` | Override log verbosity. |
| `--verbose` | Shortcut for debug logs. |
| `-q, --quiet` | Only show warnings and errors. |
| `-h, --help` | Show command help. |

## Common workflows

```bash
# Start a new app
vix new api
cd api
vix install
vix dev

# Run an existing app
vix install
vix dev

# Run a server file directly
vix dev server.cpp --force-server

# Run a CLI tool file directly
vix dev tool.cpp --force-script

# Pass app arguments
vix dev server.cpp -- --port 8080
```

## Common mistakes

### Running outside the project directory

Wrong:

```bash
vix new api
vix dev
```

Correct:

```bash
vix new api
cd api
vix dev
```

### Forgetting `--` before app arguments

Wrong:

```bash
vix dev server.cpp --port 8080
```

Correct:

```bash
vix dev server.cpp -- --port 8080
```

The `--` separates Vix options from your application arguments.

## Related commands

| Command | Purpose |
|---------|---------|
| `vix run` | Build and run manually |
| `vix build` | Configure and compile |
| `vix check` | Validate build, tests, runtime, and sanitizers |
| `vix tests` | Run tests |
| `vix task dev` | Run the project dev task |

## Next step

Continue with project builds.

[Open the vix build guide](/cli/build)
