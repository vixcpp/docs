# vix upgrade

`vix upgrade` updates the Vix CLI, installs SDK profiles, and upgrades globally installed Vix packages.

Use it when you want to move your local Vix installation to a newer release, install the SDK profile required by a command, or update a package installed globally.

```bash
vix upgrade
```

## What it upgrades

`vix upgrade` has three main modes:

| Mode                   | Purpose                                 |
| ---------------------- | --------------------------------------- |
| CLI upgrade            | Updates the `vix` command itself        |
| SDK upgrade            | Installs or upgrades a Vix SDK profile  |
| Global package upgrade | Upgrades one package installed globally |

## Upgrade the CLI

Run `vix upgrade` with no argument to install the latest Vix CLI release.

```bash
vix upgrade
```

Install a specific release:

```bash
vix upgrade v2.7.0
```

Or:

```bash
vix upgrade --version v2.7.0
```

Check for a new version without installing it:

```bash
vix upgrade --check
```

Preview the upgrade without changing files:

```bash
vix upgrade --dry-run
```

Print machine-readable output:

```bash
vix upgrade --json
```

## SDK profiles

Some Vix features need an SDK profile.

For example, desktop applications need the `desktop` SDK profile because the desktop shell uses WebView support.

List available SDK profiles:

```bash
vix upgrade --sdk list
```

Show information about one profile:

```bash
vix upgrade --sdk info desktop
```

Install the default SDK profile:

```bash
vix upgrade --sdk
```

Install a specific profile:

```bash
vix upgrade --sdk web
```

Install a specific version of a profile:

```bash
vix upgrade --sdk desktop --version v2.7.0
```

## Common SDK profiles

| Profile   | Use it for                                                                       |
| --------- | -------------------------------------------------------------------------------- |
| `default` | Normal Vix.cpp projects and local development                                    |
| `web`     | HTTP apps, APIs, WebSocket, middleware, validation, crypto, WebRPC, and requests |
| `data`    | Database, ORM, key-value storage, and cache workflows                            |
| `desktop` | Desktop apps using the Vix UI desktop shell                                      |
| `p2p`     | Peer-to-peer networking and local-first systems                                  |
| `game`    | Game and realtime rendering workflows                                            |
| `agent`   | AI agent tooling and controlled automation workflows                             |
| `all`     | Full SDK with all available profiles                                             |

The `all` profile is a complete SDK profile. It is not a shortcut that installs every profile separately.

## Install more than one SDK profile

You can install multiple profiles in one command.

```bash
vix upgrade --sdk web data desktop
```

Comma-separated profiles are also accepted.

```bash
vix upgrade --sdk web,data,desktop
```

This is useful when one machine is used for different kinds of Vix projects.

## Desktop SDK

Install the desktop SDK before using desktop shell commands.

```bash
vix upgrade --sdk desktop
```

Then run a Vix UI app in a desktop shell:

```bash
vix desktop run ui_dashboard.cpp --port 8080
```

On Linux, the desktop shell needs WebKitGTK support. Install the system dependencies shown by:

```bash
vix upgrade --sdk info desktop
```

## Data SDK

Install the data SDK when your project needs database or cache modules.

```bash
vix upgrade --sdk data
```

This profile is useful for projects that use database, ORM, key-value, or cache features.

## Web SDK

Install the web SDK when your project needs web application modules beyond the default setup.

```bash
vix upgrade --sdk web
```

Use it for APIs, HTTP services, realtime apps, middleware, validation, crypto, WebRPC, or requests.

## Global package upgrade

Upgrade a globally installed package:

```bash
vix upgrade -g gk/jwt
```

Install or upgrade a specific package version:

```bash
vix upgrade -g gk/jwt@1.0.0
```

Scoped package syntax is also supported:

```bash
vix upgrade -g @gk/jwt
```

Global package upgrades use the Vix registry and the local global package state.

## Useful checks

Check the CLI version:

```bash
vix --version
```

Check whether an upgrade is available:

```bash
vix upgrade --check
```

Check SDK profiles:

```bash
vix upgrade --sdk list
```

Inspect a profile before installing it:

```bash
vix upgrade --sdk info web
```

Run with more diagnostic output:

```bash
vix upgrade --verbose
```

## JSON output

Use `--json` when another tool needs to read the result.

```bash
vix upgrade --check --json
```

```bash
vix upgrade --sdk desktop --json
```

This is useful for scripts, CI checks, installers, and automated setup tools.

## Environment variables

| Variable       | Purpose                                                      |
| -------------- | ------------------------------------------------------------ |
| `VIX_REPO`     | Override the GitHub repository used for CLI and SDK upgrades |
| `VIX_CLI_PATH` | Override the current Vix binary path detection               |

Example:

```bash
VIX_REPO=vixcpp/vix vix upgrade --check
```

## Common workflows

### Update Vix

```bash
vix upgrade
```

### Install the SDK needed for web apps

```bash
vix upgrade --sdk web
```

### Install the SDK needed for desktop apps

```bash
vix upgrade --sdk desktop
```

### Install the SDK needed for database projects

```bash
vix upgrade --sdk data
```

### Inspect before installing

```bash
vix upgrade --sdk info desktop
```

### Install a fixed release

```bash
vix upgrade --sdk desktop --version v2.7.0
```

### Preview without changing files

```bash
vix upgrade --dry-run
```

## Common mistakes

### Using a desktop command before installing the desktop SDK

Wrong:

```bash
vix desktop run ui_dashboard.cpp --port 8080
```

Correct:

```bash
vix upgrade --sdk desktop
vix desktop run ui_dashboard.cpp --port 8080
```

### Installing the full SDK when a smaller profile is enough

Wrong for a simple web API:

```bash
vix upgrade --sdk all
```

Better:

```bash
vix upgrade --sdk web
```

Use `all` only when the machine really needs the full SDK.

### Guessing profile dependencies

Wrong:

```bash
vix upgrade --sdk desktop
```

Then manually guessing system packages.

Better:

```bash
vix upgrade --sdk info desktop
vix upgrade --sdk desktop
```

The info command shows the modules, system dependencies, and notes for the profile.

## Options

| Option                 | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `-g, --global`         | Upgrade a globally installed package            |
| `--sdk [profile]`      | Install or upgrade a Vix SDK profile            |
| `--sdk list`           | List available SDK profiles                     |
| `--sdk info [profile]` | Show details for one SDK profile                |
| `--sdk-info <profile>` | Shortcut for `vix upgrade --sdk info <profile>` |
| `--version <tag>`      | Use a specific release tag                      |
| `--check`              | Check without installing                        |
| `--dry-run`            | Simulate without changing files                 |
| `--json`               | Print machine-readable JSON output              |
| `--verbose`            | Print diagnostic details                        |
| `-h, --help`           | Show command help                               |

## Related commands

| Command       | Purpose                                  |
| ------------- | ---------------------------------------- |
| `vix run`     | Build and run a project, file, or target |
| `vix build`   | Build without running                    |
| `vix tests`   | Run tests                                |
| `vix desktop` | Run a Vix UI app inside a desktop shell  |
| `vix mobile`  | Generate and run a mobile WebView shell  |
| `vix note`    | Start the local Vix Note UI              |

## Next step

Install the SDK profile required by the app you are building.

For desktop UI apps:

```bash
vix upgrade --sdk desktop
```

Then continue with the desktop command.

[Open the desktop command guide](./desktop)
