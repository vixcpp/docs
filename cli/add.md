# vix add

`vix add` adds a Vix Registry package to the current project.

Use it when the application itself needs a package, or when an application module needs a registry package that should stay declared with that module.

```bash
vix add gk/jwt
```

## Overview

`vix add` is the command for declaring a new dependency requirement.

For a normal project dependency, it resolves the package from the local registry index, chooses the correct version, updates `vix.json`, resolves the full dependency graph, and rewrites `vix.lock`. In a modular `vix.app` project, the same command can also attach a dependency to a specific module. In that case the dependency is written to the module's own `vix.module` file, while the root lockfile still records the resolved package graph used by the application build.

This distinction matters because application modules are meant to keep feature ownership visible. A JWT package used only by `auth` should not have to look like a dependency of the whole application shell. The module can declare that it needs the registry package and the CMake target that should be linked, while Vix still resolves everything from the project root.

```txt
vix add
  -> resolve package
  -> update vix.json or modules/<name>/vix.module
  -> resolve project dependencies
  -> fetch pinned package commits
  -> rewrite vix.lock
```

## Usage

```bash
vix add [@]namespace/name[@version]
vix add [@]namespace/name[@version] --module <name>
vix add [@]namespace/name[@version] -m <name>
vix add [@]namespace/name[@version] --module <name> --link <target>
```

## Basic examples

```bash
# Add the latest available version
vix add gk/jwt

# Add a compatible version range
vix add gk/jwt@^1.0.0

# Add an exact version
vix add gk/jwt@1.0.0

# Scoped-style syntax is supported
vix add @gk/jwt

# Scoped-style syntax with a range
vix add @gk/jwt@~1.2.0

# Add the package to a module instead of the root dependency list
vix add gk/jwt@^1.0.0 --module auth

# Override the CMake target linked by that module
vix add gk/jwt@^1.0.0 --module auth --link gk::jwt
```

## What it does

When you run:

```bash
vix add gk/jwt@^1.0.0
```

Vix does this:

1. Checks that the local registry index exists.
2. Parses the package spec.
3. Finds the package in the local registry index.
4. Resolves the requested version or range.
5. Updates `vix.json`, or updates `modules/<name>/vix.module` when `--module` is used.
6. Resolves all project dependencies.
7. Fetches required package repositories at pinned commits.
8. Computes package content hashes.
9. Rewrites `vix.lock`.
10. Prints the resolved package and dependency count.

## Registry requirement

`vix add` requires the local registry index.

If the registry has not been synced, Vix reports:

```txt
registry not synced
Run: vix registry sync
```

Fix:

```bash
vix registry sync
vix add gk/jwt
```

## Package format

A package name uses this format:

```txt
namespace/name
```

Examples:

```txt
gk/jwt
gk/json
gaspardkirira/tree
```

Scoped-style syntax is also accepted:

```txt
@namespace/name
```

Example:

```txt
@gk/jwt
```

Both forms point to the same package id:

```txt
gk/jwt
```

## Version format

A package spec can include a version or version range.

```bash
vix add gk/jwt
vix add gk/jwt@1.0.0
vix add gk/jwt@^1.0.0
vix add gk/jwt@~1.2.0
vix add @gk/jwt@^1.0.0
```

If no version is provided, Vix resolves the latest available version from the local registry index.

```bash
vix add gk/jwt
```

If a range is provided, Vix resolves the highest version that satisfies that range.

```bash
vix add gk/jwt@^1.0.0
```

## Supported version behavior

`vix add` uses semver resolution.

Supported forms include:

```txt
1.0.0
^1.0.0
~1.2.0
```

The selected version is stored exactly in `vix.lock`.

For root-level dependencies, the requested version or range is stored in `vix.json`. For module dependencies, it is stored in the module's `vix.module` file.

## What files are updated

Without `--module`, `vix add` updates:

```txt
vix.json
vix.lock
```

With `--module`, it updates:

```txt
modules/<name>/vix.module
vix.lock
```

It does not directly edit `vix.app`. The module must already be declared there for the generated `vix.app` build to treat it as part of the active application graph.

## Module dependencies

Use `--module` when the package is owned by one application module.

```bash
vix add gk/jwt@^1.0.0 --module auth
```

The command writes the registry dependency and the link target into the module manifest.

```ini
[deps]
registry = [
  "gk/jwt@^1.0.0",
]

links = [
  "gk::jwt",
]
```

If `--link` is not provided, Vix derives the link target from the package id by using the namespace and package name as a CMake namespace target. For `gk/jwt`, the default target is `gk::jwt`. Use `--link` when the package exports a different CMake target name.

```bash
vix add gk/jwt@^1.0.0 --module auth --link gk::jwt
```

When the module is enabled in `vix.app`, Vix includes the module registry dependencies in the project dependency resolution and injects the declared module links into the generated module target. The dependency still appears in the root `vix.lock`, because the lockfile belongs to the application build, not to an individual module.

After adding a module dependency, build from the project root.

```bash
vix modules check
vix build
```

The module check command also validates that a module does not declare registry dependencies without link targets, or link targets without registry dependencies. That rule keeps the module manifest understandable: the registry list says what package is installed, and the links list says what the module target uses at build time.

For root-level dependencies, you still need to link the package in `vix.app` or CMake when your code uses it. For module-level dependencies, keep the link target in the module's `[deps]` section.

## `vix.json`

`vix.json` stores declared dependency requirements.

The current dependency format is:

```json
{
  "deps": [
    {
      "id": "gk/jwt",
      "version": "^1.0.0"
    }
  ]
}
```

If the dependency already exists, `vix add` updates its requested version.

Example:

```bash
vix add gk/jwt@^1.0.0
vix add gk/jwt@~1.2.0
```

After the second command, the `gk/jwt` entry is updated instead of duplicated.

## `vix.lock`

`vix.lock` stores exact resolved versions.

It is rewritten after dependency resolution.

Example shape:

```json
{
  "lockVersion": 1,
  "dependencies": [
    {
      "id": "gk/jwt",
      "requested": "^1.0.0",
      "version": "1.2.0",
      "repo": "https://github.com/...",
      "tag": "v1.2.0",
      "commit": "...",
      "hash": "..."
    }
  ]
}
```

The lockfile is sorted by dependency id.

This keeps installs reproducible.

## Transitive dependencies

`vix add` resolves the full project dependency graph.

If the package you add depends on other Vix packages, those dependencies are also resolved and written to `vix.lock`.

Example:

```txt
app depends on gk/http
gk/http depends on gk/json
```

After:

```bash
vix add gk/http
```

`vix.lock` can include:

```txt
gk/http
gk/json
```

This is important because `vix.lock` represents the resolved project dependency state, not only the direct dependency you typed.

## Package fetching

During resolution, Vix fetches package repositories into the global Git store.

Typical location:

```txt
~/.vix/store/git/
```

A package is checked out at the pinned commit recorded by the registry.

This gives the lockfile stable fields such as:

```txt
repo
tag
commit
hash
```

## Content hash

After checkout, Vix computes a package content hash.

That hash is written into `vix.lock`.

The goal is to make package state verifiable and reproducible.

## Output

Example output shape:

```txt
resolved: gk/jwt@1.2.0

Add
id: gk/jwt
version: 1.2.0
tag: v1.2.0
commit: 8f3a...

resolving project dependencies...
✔ added: gk/jwt@1.2.0
✔ lock:  /home/user/api/vix.lock
✔ deps:  3
```

The `deps` count is the number of resolved locked dependencies after the full graph resolution.

## Package not found

If a package is not found, Vix searches the local registry index using the package name.

Example:

```bash
vix add gk/unknown
```

Output shape:

```txt
package not found: gk/unknown

Search
query: "unknown"

No matches found in the local registry index.

If you just updated the registry, run: vix registry sync
```

If matching packages exist, Vix prints local search results.

## Invalid package spec

Valid:

```bash
vix add gk/jwt
vix add @gk/jwt
vix add gk/jwt@1.0.0
vix add @gk/jwt@^1.0.0
```

Invalid:

```bash
vix add jwt
vix add gk
vix add @/jwt
vix add gk/jwt@
```

If the spec is invalid, Vix reports:

```txt
invalid package spec
Expected: <namespace>/<name>[@<version>]
Example:  vix add gaspardkirira/tree
Example:  vix add gaspardkirira/tree@0.1.0
Try search: vix search <input>
```

## Version not found

If the requested version or range cannot be resolved, Vix reports an error.

Example:

```bash
vix add gk/jwt@99.0.0
```

Output shape:

```txt
no version matches range: gk/jwt@99.0.0
```

If a resolved version is missing from the registry entry, Vix can show available versions and suggest the latest version.

## Add latest version

```bash
vix add gk/jwt
```

This resolves the latest version from the local registry index.

For a root-level dependency, the resolved exact version is stored in both `vix.json` and `vix.lock`. For a module dependency, the module manifest receives the dependency spec and the root lockfile receives the resolved exact version.

For no-version input, the requested version becomes the resolved exact version.

Example result:

```json
{
  "deps": [
    {
      "id": "gk/jwt",
      "version": "1.2.0"
    }
  ]
}
```

## Add a version range

```bash
vix add gk/jwt@^1.0.0
```

For a root-level dependency, this stores the declared range in `vix.json`:

```json
{
  "deps": [
    {
      "id": "gk/jwt",
      "version": "^1.0.0"
    }
  ]
}
```

And stores the exact resolved version in `vix.lock`:

```json
{
  "id": "gk/jwt",
  "requested": "^1.0.0",
  "version": "1.2.0"
}
```

## Add an exact version

```bash
vix add gk/jwt@1.0.0
```

For a root-level dependency, this stores:

```json
{
  "deps": [
    {
      "id": "gk/jwt",
      "version": "1.0.0"
    }
  ]
}
```

And locks:

```json
{
  "id": "gk/jwt",
  "requested": "1.0.0",
  "version": "1.0.0"
}
```

## Add a scoped package

```bash
vix add @gk/jwt
```

This is normalized to:

```txt
gk/jwt
```

The `@` form is supported for users who prefer scoped package syntax.

## After adding a dependency

After `vix add`, build the project.

```bash
vix build
```

For development:

```bash
vix dev
```

For validation:

```bash
vix check --tests
```

If the dependency exposes headers or targets, you must still use it from your project.

## Using the dependency in `vix.app`

For root-level dependencies, `vix add` updates `vix.json` and `vix.lock`.

For `vix.app` projects, also add the package target alias to `links` when the application target uses the package directly. If the package belongs to a module, use `vix add --module` instead and keep the link target in `modules/<name>/vix.module`.

Example dependency:

```bash
vix add gk/json@^1.0.0
```

Then in `vix.app`:

```ini
deps = [
  gk/json@^1.0.0,
]

links = [
  vix::vix,
  gk::json,
]
```

The registry package spec goes in:

```txt
deps
```

The CMake target alias goes in:

```txt
links
```

## `deps` in `vix.json` vs `deps` in `vix.app`

There are two places you may see dependency declarations.

`vix.json` is the package management manifest used by `vix add`, `vix update`, and `vix install`.

Example:

```json
{
  "deps": [
    {
      "id": "gk/json",
      "version": "^1.0.0"
    }
  ]
}
```

`vix.app` is the app build manifest.

Example:

```ini
deps = [
  gk/json@^1.0.0,
]
```

The project dependency manager uses `vix.json`.

The app build manifest uses `vix.app`.

Keep them aligned when using `vix.app`.

## Using the dependency in CMake

For a manual CMake project, include the generated dependency integration after install.

```cmake
include(.vix/vix_deps.cmake)

target_link_libraries(api PRIVATE
  gk::json
)
```

A normal flow is:

```bash
vix add gk/json@^1.0.0
vix install
vix build
```

## Difference between `vix add` and `vix install`

| Command         | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `vix add <pkg>` | Add or change a dependency requirement and rewrite `vix.lock`. |
| `vix install`   | Install dependencies already pinned in `vix.lock`.             |

Use `vix add` when changing dependencies.

Use `vix install` after clone or when the lockfile already exists.

## Difference between `vix add` and `vix update`

| Command         | Purpose                                                 |
| --------------- | ------------------------------------------------------- |
| `vix add <pkg>` | Add or change one dependency requirement.               |
| `vix update`    | Re-resolve project dependencies and rewrite `vix.lock`. |

Use `vix update` when you want to refresh existing locked versions.

## Difference between `vix add` and `vix search`

| Command              | Purpose                             |
| -------------------- | ----------------------------------- |
| `vix search <query>` | Search the local registry index.    |
| `vix add <pkg>`      | Add a package by exact registry id. |

If you do not know the exact package name, search first:

```bash
vix search jwt
vix add gk/jwt
```

## Full workflow

```bash
vix registry sync
vix search jwt
vix add gk/jwt@^1.0.0
vix install
vix build
vix tests
```

For development:

```bash
vix dev
```

## CI workflow

After dependencies are committed:

```bash
vix registry sync
vix install
vix build --build-target all
vix tests
```

`vix add` is usually not used in CI.

CI should use:

```bash
vix install
```

because CI should install the exact versions from `vix.lock`.

## Options

`vix add` takes one package spec. By default it writes a root dependency; with `--module`, it writes the dependency to a module manifest instead.

```bash
vix add [@]namespace/name[@version]
vix add [@]namespace/name[@version] --module <name>
vix add [@]namespace/name[@version] -m <name>
vix add [@]namespace/name[@version] --module <name> --link <target>
```

| Option              | Description |
| ------------------- | ----------- |
| `-m, --module <name>` | Add the dependency to `modules/<name>/vix.module` instead of the root dependency list. |
| `--module <name>`   | Long form of `-m`. |
| `--link <target>`   | Set the CMake target linked by the module dependency. |
| `-h, --help`        | Show help. |

## Commands reference

| Command                                      | Description |
| -------------------------------------------- | ----------- |
| `vix add gk/jwt`                             | Add latest available version to the root dependency list. |
| `vix add gk/jwt@1.0.0`                       | Add exact version. |
| `vix add gk/jwt@^1.0.0`                      | Add compatible range. |
| `vix add @gk/jwt`                            | Add using scoped-style syntax. |
| `vix add gk/jwt@^1.0.0 --module auth`        | Add the dependency to the `auth` module. |
| `vix add gk/jwt@^1.0.0 --module auth --link gk::jwt` | Add the dependency to `auth` with an explicit CMake link target. |

## Common workflows

### Add latest package

```bash
vix registry sync
vix add gk/jwt
vix install
vix build
```

### Add compatible range

```bash
vix add gk/jwt@^1.0.0
vix install
vix check --tests
```

### Add exact version

```bash
vix add gk/jwt@1.0.0
vix install
vix build
```

### Search before adding

```bash
vix search jwt
vix add gk/jwt
```

### Add and validate

```bash
vix add gk/jwt
vix install
vix check --tests
```

## Common mistakes

### Forgetting to sync the registry

Wrong:

```bash
vix add gk/jwt
```

when the registry has not been synced.

Correct:

```bash
vix registry sync
vix add gk/jwt
```

### Using a package name without namespace

Wrong:

```bash
vix add jwt
```

Correct:

```bash
vix add gk/jwt
```

### Expecting `vix add` to update every dependency

`vix add` adds or changes one dependency requirement.

To refresh existing locked versions, use:

```bash
vix update
```

### Expecting `vix add` to only update `vix.json`

`vix add` also rewrites `vix.lock`. With `--module`, it updates `modules/<name>/vix.module` instead of adding the dependency directly to `vix.json`.

It resolves the whole project dependency graph after updating the root manifest or the module manifest.

### Expecting `vix add` to automatically edit `vix.app`

`vix add` updates package metadata. It does not add root `vix.app` link entries automatically.

For root-level `vix.app` dependencies, add the target alias to `links` when you need to link it. For module-level dependencies, use `vix add --module` so the link target is written to the module manifest.

Example:

```ini
links = [
  vix::vix,
  gk::json,
]
```

### Confusing package specs and CMake aliases

Package spec:

```txt
gk/json@^1.0.0
```

CMake alias:

```txt
gk::json
```

Use package specs in dependency declarations.

Use aliases in `links` or `target_link_libraries`.

### Editing `vix.lock` manually

Do not manually edit `vix.lock`.

Use:

```bash
vix add
vix update
vix remove
```

to change dependency state.

## Troubleshooting

### Registry not synced

Run:

```bash
vix registry sync
```

Then:

```bash
vix add gk/jwt
```

### Package not found

Search locally:

```bash
vix search jwt
```

Then add the exact package id:

```bash
vix add gk/jwt
```

If the package should exist, refresh the registry:

```bash
vix registry sync
```

### Invalid package spec

Use:

```txt
namespace/name
namespace/name@version
@namespace/name
@namespace/name@version
```

Examples:

```bash
vix add gk/jwt
vix add @gk/jwt@^1.0.0
```

### No version matches range

If Vix reports:

```txt
no version matches range: gk/jwt@^2.0.0
```

choose a range that exists in the registry.

Check available versions through the registry or package listing tools.

### Version not found

If Vix reports that the resolved version is not found in the registry entry, sync the registry again:

```bash
vix registry sync
```

Then retry.

### Git clone failed

Vix fetches package source from the repository URL stored in the registry entry.

Check:

- network connection
- repository URL
- Git authentication if private
- registry metadata

Then retry:

```bash
vix add gk/jwt
```

### Git checkout failed

The registry entry points to a commit that could not be checked out.

This usually means registry metadata is stale or invalid.

Run:

```bash
vix registry sync
```

If the issue remains, the registry entry needs correction.

### Add failed while resolving transitive dependencies

A transitive dependency may be missing, invalid, or impossible to resolve.

Run:

```bash
vix registry sync
vix add <package>
```

If it still fails, inspect the dependency package’s `vix.json`.

## Best practices

Run `vix registry sync` before adding packages.

Use `vix search` when you do not know the exact package id.

Use version ranges for libraries that can accept compatible updates.
Use exact versions when you need strict reproducibility.

Commit `vix.json`.

Commit `vix.lock`.

Do not commit `.vix/deps`.

Do not edit `vix.lock` manually.

Run `vix install` after adding dependencies.

Run `vix build` and `vix tests` after adding dependencies.

For `vix.app`, keep `deps` and `links` aligned.

Use registry package specs in `deps`.

Use CMake aliases in `links`.

## Related commands

| Command             | Purpose                               |
| ------------------- | ------------------------------------- |
| `vix search`        | Search the local registry index.      |
| `vix install`       | Install dependencies from `vix.lock`. |
| `vix update`        | Re-resolve dependency versions.       |
| `vix outdated`      | Check outdated dependencies.          |
| `vix remove`        | Remove dependencies.                  |
| `vix list`          | List dependencies.                    |
| `vix registry sync` | Refresh the local registry index.     |
| `vix build`         | Build after dependency changes.       |
| `vix tests`         | Run tests after dependency changes.   |

## Next step

Install locked dependencies.

[Open the vix install guide](/cli/install)
