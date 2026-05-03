# vix build

`vix build` configures and builds a CMake project using Vix presets.

Use it when you want to compile a project without running the application.

## Usage

```bash
vix build [options] -- [cmake args...]
```

## What it does

`vix build` provides a fast build workflow for Vix and CMake projects. It can detect the current project, configure CMake, use embedded Vix presets, build with Ninja, use parallel build jobs, enable SQLite or MySQL support, use build signature caching, detect no-op builds quickly, optionally use sccache, ccache, mold, or lld, and write configure and build logs.

## Basic usage

```bash
# Build the current project
vix build

# Build with verbose output
vix build --verbose

# Build with a specific number of jobs
vix build -j 8

# Build a project from another directory
vix build --dir ./examples/blog
```

## Presets

| Preset | Generator | Build type | Build directory |
|--------|-----------|------------|-----------------|
| `dev` | Ninja | Debug | `build-dev` |
| `dev-ninja` | Ninja | Debug | `build-ninja` |
| `release` | Ninja | Release | `build-release` |

The default preset is `dev-ninja`.

```bash
# Use a preset
vix build --preset dev-ninja

# Build a release version
vix build --preset release
```

## Build with SQLite

```bash
vix build --with-sqlite
vix build --preset release --with-sqlite
```

This maps to the CMake option `VIX_DB_USE_SQLITE=ON`.

## Build with MySQL

```bash
vix build --with-mysql
vix build --preset dev-ninja --with-mysql
```

This maps to the CMake option `VIX_DB_USE_MYSQL=ON`.

## Build a specific target

```bash
vix build --build-target blog
```

This is useful in large repositories or examples folders where many targets exist.

## Clean build

```bash
vix build --clean
```

Use this when a previous build directory is broken or when you want to remove cached CMake state.

## Fast no-op builds

```bash
vix build --fast
```

This is useful for tight development loops and CI steps where rebuilding is unnecessary.

## Static linking

```bash
vix build --preset release --static
```

This maps to `VIX_LINK_STATIC=ON`.

## Linker selection

```bash
vix build --linker auto
vix build --linker mold
vix build --linker lld
```

Available modes: `auto`, `default`, `mold`, `lld`. In `auto` mode, Vix prefers mold when available, then lld.

## Compiler launcher

```bash
vix build --launcher auto
vix build --launcher sccache
vix build --launcher ccache
```

Available modes: `auto`, `none`, `sccache`, `ccache`. In `auto` mode, Vix prefers sccache when available.

## Cross-compilation

```bash
vix build --target aarch64-linux-gnu
vix build --preset release --target aarch64-linux-gnu
vix build --target aarch64-linux-gnu --sysroot /opt/sysroots/aarch64

# List detected cross toolchains
vix build --targets
```

## Forward CMake arguments

Use `--` to pass raw arguments to CMake:

```bash
vix build -- -DVIX_SYNC_BUILD_TESTS=ON
vix build --preset release -- -DCMAKE_EXPORT_COMPILE_COMMANDS=ON
```

## Progress and output

```bash
vix build --no-status
vix build --no-up-to-date
vix build --cmake-verbose
vix build --quiet
vix build --verbose
```

## Build heartbeat

```bash
VIX_BUILD_HEARTBEAT=1 vix build
```

This is useful in CI environments where long silent builds may look stuck.

## Logs

`vix build` writes logs in the build directory. Common log files: `build-dev*/configure.log`, `build-dev*/build.log`.

## Options

| Option | Description |
|--------|-------------|
| `--preset <name>` | Preset to use: `dev`, `dev-ninja`, or `release`. |
| `--target <triple>` | Cross-compilation target triple. |
| `--sysroot <path>` | Sysroot for cross toolchain. |
| `--static` | Request static linking. |
| `--with-sqlite` | Enable SQLite support. |
| `--with-mysql` | Enable MySQL support. |
| `-j, --jobs <n>` | Number of parallel build jobs. |
| `--clean` | Remove local build directories and reconfigure from scratch. |
| `--no-cache` | Disable signature cache shortcut. |
| `--fast` | Exit quickly if Ninja says the build is up to date. |
| `--linker <mode>` | Linker mode: `auto`, `default`, `mold`, or `lld`. |
| `--launcher <mode>` | Compiler launcher: `auto`, `none`, `sccache`, or `ccache`. |
| `--no-status` | Disable Ninja status progress format. |
| `--no-up-to-date` | Disable Ninja dry-run up-to-date detection. |
| `-d, --dir <path>` | Project directory. |
| `-q, --quiet` | Minimal output. |
| `-v, --verbose` | Show detailed configure and build summary. |
| `--targets` | List detected cross toolchains on PATH. |
| `--cmake-verbose` | Show raw CMake configure output. |
| `--build-target <name>` | Build only a specific CMake target. |
| `-h, --help` | Show command help. |

## Environment variables

| Variable | Description |
|----------|-------------|
| `VIX_BUILD_HEARTBEAT=1` | Enable heartbeat when the build is silent for several seconds. |

## Common workflows

```bash
# Normal development build
vix build

# Release build
vix build --preset release

# Release build with SQLite
vix build --preset release --with-sqlite

# Fast build loop
vix build --fast

# Build one target
vix build --build-target blog

# Clean rebuild
vix build --clean

# Use mold linker
vix build --linker mold

# Use sccache
vix build --launcher sccache
```

## Common mistakes

### Using `vix build` when you expect the app to run

`vix build` only builds the project. It does not start the app. Use `vix run` or `vix dev` instead.

### Forgetting to enter the project directory

Wrong:

```bash
vix new api
vix build
```

Correct:

```bash
vix new api
cd api
vix build
```

### Passing runtime arguments to `vix build`

`vix build` does not run the program. Use `vix run --run --port 8080` instead.

### Expecting `--clean` to remove global caches

`--clean` removes local build directories only. For project cache cleanup, use `vix clean`.

## When to use `vix build`

Use `vix build` when you only want to compile, verify that the project builds, prepare a release build, build a specific target, enable optional build features, or want CMake logs without running the app.

For running the app, use `vix run`. For active development, use `vix dev`. For validation, tests, runtime checks, or sanitizers, use `vix check`.

## Related commands

| Command | Purpose |
|---------|---------|
| `vix run` | Build and run the app |
| `vix dev` | Run the app with reload |
| `vix check` | Validate build, tests, runtime, and sanitizers |
| `vix tests` | Run tests |
| `vix clean` | Remove local project cache directories |
| `vix reset` | Clean and reinstall project dependencies |

## Next step

Continue with validation.

[Open the vix check guide](/cli/check)
