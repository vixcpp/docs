# Installation

This page shows how to install Vix.cpp and verify that it works on your machine.

For Getting Started, install the full SDK.

The full SDK includes the `vix` CLI, headers, and libraries needed to build Vix applications.

## Install on Linux or macOS

Run:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

After installation, restart your terminal or reload your shell configuration.

## Install on Windows

Open PowerShell and run:

```powershell
irm https://vixcpp.com/install.ps1 | iex
```

## Verify the installation

Check that the `vix` command is available:

```bash
vix --version
```

Expected output shape:

```txt
Vix.cpp CLI
version : 2.5.3
author  : Gaspard Kirira
source  : https://github.com/vixcpp/vix
```

The exact version may be different depending on the latest release.

## Verify the SDK headers

For C++ applications using Vix, the SDK headers must be installed.

Check that `vix.hpp` exists:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
```

Expected output:

```txt
/home/your-user/.local/include/vix.hpp
```

If nothing appears, reinstall the full SDK.

## SDK mode vs CLI-only mode

Vix has two installation modes.

| Mode | What it installs | Use when |
| --- | --- | --- |
| SDK mode | CLI, headers, and libraries | You want to build Vix applications |
| CLI-only mode | Only the `vix` binary | You only need the CLI |

For this Getting Started guide, use the default SDK mode.

Do not use CLI-only mode if you want to compile code that includes:

```cpp
#include <vix.hpp>
```

## CLI-only mode

CLI-only mode installs only the command-line tool.

```bash
VIX_INSTALL_KIND=cli curl -fsSL https://vixcpp.com/install.sh | bash
```

This is not recommended for this guide because the next pages build real Vix applications.

## Fix PATH issues

If your terminal says:

```txt
vix: command not found
```

Add `~/.local/bin` to your `PATH`.

### Bash

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Zsh

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Then check again:

```bash
vix --version
```

## Install build prerequisites

Vix uses the normal C++ toolchain underneath.

Make sure your system has a compiler, CMake, Ninja, and common development libraries.

### Ubuntu or Debian

```bash
sudo apt update
sudo apt install -y \
  build-essential cmake ninja-build pkg-config \
  libssl-dev libsqlite3-dev zlib1g-dev libbrotli-dev \
  nlohmann-json3-dev libspdlog-dev libfmt-dev
```

### macOS

With Homebrew:

```bash
brew install cmake ninja pkg-config openssl@3 spdlog fmt nlohmann-json brotli
```

### Windows

Install Visual Studio Build Tools with MSVC or clang-cl.

For extra dependencies, use vcpkg.

## Check your toolchain

Run:

```bash
c++ --version
cmake --version
ninja --version
```

If one of these commands is missing, install the missing tool before continuing.

## Quick test

Create a temporary folder:

```bash
mkdir -p ~/tmp/vix-install-test
cd ~/tmp/vix-install-test
```

Create `main.cpp`:

```bash
cat > main.cpp <<'CPP'
#include <iostream>

int main()
{
  std::cout << "Hello from Vix\n";
  return 0;
}
CPP
```

Run it:

```bash
vix run main.cpp
```

Expected output:

```txt
Hello from Vix
```

## Common installation problems

### `vix: command not found`

Your shell cannot find the Vix binary.

Fix:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Then run:

```bash
vix --version
```

### `#include <vix.hpp>` not found

The full SDK is not installed, or the headers are not visible.

Check:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
```

If nothing appears, reinstall Vix without CLI-only mode:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

### CMake or Ninja is missing

Check:

```bash
cmake --version
ninja --version
```

On Ubuntu or Debian:

```bash
sudo apt install -y cmake ninja-build
```

## Upgrade Vix later

To upgrade the CLI:

```bash
vix upgrade
```

To inspect your environment:

```bash
vix doctor
```

To inspect Vix paths and cache information:

```bash
vix info
```

## What you should remember

Install the full SDK:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

Verify the CLI:

```bash
vix --version
```

Verify the SDK headers:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
```

For this guide, SDK mode is the correct installation mode.

## Next step

Now set up your development environment.

Next: [Set Up Your Environment](/getting-started/setup-environment)

