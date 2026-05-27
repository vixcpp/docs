# Installation

This page shows how to install Vix.cpp and verify that it works on your machine.
For Getting Started, install the full SDK.
Starting with **Vix.cpp v2.6.0**, the recommended installation is the full SDK installation.

The full SDK includes:

- the `vix` CLI
- the main `vix.hpp` header
- Vix module headers
- Vix libraries
- CMake package files
- the `vix::vix` target for CMake projects

This means you can install Vix once, then build real Vix applications without manually copying headers, linking modules, or rebuilding the SDK yourself.

## Recommended install

Linux and macOS:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

Windows PowerShell:

```powershell
irm https://vixcpp.com/install.ps1 | iex
```

After installation, restart your terminal.

Then verify the installation:

```bash
vix --version
```

Expected output shape:

```txt
Vix.cpp CLI
version : 2.6.0
author  : Gaspard Kirira
source  : https://github.com/vixcpp/vix
```

The exact version may be newer depending on the latest release.

## What changed in v2.6.0

Vix.cpp v2.6.0 makes installation simpler.

Before, users could install the CLI but still miss the SDK headers, libraries, CMake package files, or module dependencies.

Now, the default installation is the full SDK.

That means this should work after installation:

```cpp
#include <vix.hpp>
```

And this should work in a CMake project:

```cmake
find_package(Vix CONFIG REQUIRED)

add_executable(app main.cpp)
target_link_libraries(app PRIVATE vix::vix)
```

The SDK is designed to include Vix as a complete development foundation, not only as a command-line binary.

## Verify the CLI

Check that the `vix` command is available:

```bash
vix --version
```

If the command works, the CLI is installed.

If your terminal says:

```txt
vix: command not found
```

Your shell cannot find the Vix binary.

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

## Verify the SDK

The SDK should install the Vix headers.

Check that `vix.hpp` exists:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
```

Expected output shape:

```txt
/home/your-user/.local/include/vix.hpp
```

Also check that the Vix CMake package exists:

```bash
find ~/.local/lib/cmake -name VixConfig.cmake 2>/dev/null
```

Expected output shape:

```txt
/home/your-user/.local/lib/cmake/Vix/VixConfig.cmake
```

If these files exist, the SDK is installed.

## Verify with a simple C++ file

Create a temporary folder:

```bash
mkdir -p ~/tmp/vix-install-test
cd ~/tmp/vix-install-test
```

Create `main.cpp`:

```bash
cat > main.cpp <<'CPP'
#include <vix.hpp>

int main()
{
  vix::print("Hello from Vix.cpp");
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
Hello from Vix.cpp
```

If this works, your CLI and SDK are ready.

## Verify with a Vix project

Create a project:

```bash
vix new api
cd api
```

Build it:

```bash
vix build
```

Run it:

```bash
vix run
```

If the application starts, your installation is correct.

## Useful commands after installation

Vix includes commands that help you inspect your setup.

Check the installed version:

```bash
vix --version
```

Inspect your environment:

```bash
vix doctor
```

Show Vix paths and cache information:

```bash
vix info
```

Upgrade Vix later:

```bash
vix upgrade
```

These commands are useful when you want to understand what Vix installed, which paths are used, and whether your environment is ready.

## SDK mode vs CLI-only mode

Vix has two installation modes.

| Mode          | What it installs                                 | Use when                            |
| ------------- | ------------------------------------------------ | ----------------------------------- |
| SDK mode      | CLI, headers, libraries, and CMake package files | You want to build Vix applications  |
| CLI-only mode | Only the `vix` binary                            | You only need the command-line tool |

For this guide, use **SDK mode**.

Do not use CLI-only mode if you want to compile code that includes:

```cpp
#include <vix.hpp>
```

Do not use CLI-only mode if you want to build projects that use:

```cmake
find_package(Vix CONFIG REQUIRED)
```

## CLI-only mode

CLI-only mode installs only the command-line tool.

Linux and macOS:

```bash
VIX_INSTALL_KIND=cli curl -fsSL https://vixcpp.com/install.sh | bash
```

This is not recommended for Getting Started.

The next pages build real Vix applications, so you need the full SDK.

## Install a specific version

By default, the installer uses the latest release.

To install a specific version:

```bash
VIX_VERSION=v2.6.0 curl -fsSL https://vixcpp.com/install.sh | bash
```

On Windows PowerShell:

```powershell
$env:VIX_VERSION="v2.6.0"
irm https://vixcpp.com/install.ps1 | iex
```

## Install build prerequisites

Vix installs the SDK, but it still uses the normal C++ toolchain underneath.

You need a compiler, CMake, Ninja, and the system libraries used by the modules you want to build.

### Ubuntu or Debian

Recommended base setup:

```bash
sudo apt update
sudo apt install -y \
  build-essential cmake ninja-build pkg-config \
  ca-certificates git curl unzip zip tar \
  libssl-dev libsqlite3-dev zlib1g-dev libbrotli-dev \
  nlohmann-json3-dev libspdlog-dev libfmt-dev
```

If you want to use database modules with MySQL:

```bash
sudo apt install -y libmysqlcppconn-dev
```

If you want to use the Vix game module with SDL/OpenGL:

```bash
sudo apt install -y \
  libsdl2-dev libsdl2-image-dev libgl1-mesa-dev
```

If you want to use the Vix AI agent with a local model, install Ollama:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Then pull a small model for low-power machines:

```bash
ollama pull llama3.2:1b
```

Or pull a small coding-oriented model:

```bash
ollama pull qwen2.5-coder:1.5b
```

For most laptops, start with:

```bash
ollama pull llama3.2:1b
```

It is smaller and easier to run than larger models.

### macOS

With Homebrew:

```bash
brew install cmake ninja pkg-config openssl@3 spdlog fmt nlohmann-json brotli
```

For the game module:

```bash
brew install sdl2 sdl2_image
```

For the AI agent with a local model:

```bash
brew install ollama
```

Start Ollama:

```bash
ollama serve
```

Then pull a small model:

```bash
ollama pull llama3.2:1b
```

Or a small coding-oriented model:

```bash
ollama pull qwen2.5-coder:1.5b
```

### Windows

Install one C++ toolchain:

- Visual Studio Build Tools with MSVC
- Visual Studio with the Desktop development with C++ workload
- clang-cl

Install CMake and Ninja.

For extra dependencies, use `vcpkg`.

If you want to use the AI agent with a local model, install Ollama for Windows from the official Ollama website, then run:

```powershell
ollama pull llama3.2:1b
```

Or:

```powershell
ollama pull qwen2.5-coder:1.5b
```

## Module-specific dependencies

The full Vix SDK includes the Vix modules, but some modules rely on system libraries.

| Module area      | System dependency        | When you need it                               |
| ---------------- | ------------------------ | ---------------------------------------------- |
| Core build       | compiler, CMake, Ninja   | Always                                         |
| Crypto / TLS     | OpenSSL                  | When using crypto, TLS, HTTPS-related features |
| SQLite           | SQLite3                  | When using SQLite database support             |
| MySQL            | MySQL C++ Connector      | When using MySQL database support              |
| HTTP compression | zlib, Brotli             | When using gzip or Brotli compression          |
| Game             | SDL2, SDL2_image, OpenGL | When using the SDL/OpenGL game backend         |
| Agent            | Ollama                   | Only when running local AI models              |

Ollama is not required to install Vix.

Ollama is only needed if you want to run local AI agent features such as:

```bash
vix agent ask
vix agent analyze
vix agent scan
```

## Recommended local AI model

For low-power machines, use:

```bash
ollama pull llama3.2:1b
```

This is the best first model to recommend because it is small and easier to run.

For coding-focused tests, use:

```bash
ollama pull qwen2.5-coder:1.5b
```

Then you can test the agent:

```bash
vix agent ask "Explain this project"
```

If the model is slow on first run, that is normal. Local models often need more time on the first request.

## Check your toolchain

Run:

```bash
c++ --version
cmake --version
ninja --version
```

If one of these commands is missing, install the missing tool before continuing.

## Common installation problems

### `vix: command not found`

Your shell cannot find the Vix binary.

Fix for Bash:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Then run:

```bash
vix --version
```

Fix for Zsh:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Then run:

```bash
vix --version
```

### `#include <vix.hpp>` not found

The full SDK is not installed, or your project is not using the SDK path.

Check:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
```

If nothing appears, reinstall the full SDK:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

Then restart your terminal and check again:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
```

### `find_package(Vix CONFIG REQUIRED)` fails

Check that the CMake package exists:

```bash
find ~/.local/lib/cmake -name VixConfig.cmake 2>/dev/null
```

If it exists but CMake cannot find it, pass the SDK prefix manually:

```bash
cmake -S . -B build -DCMAKE_PREFIX_PATH="$HOME/.local"
```

Then build:

```bash
cmake --build build
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

### The project builds but cannot find system libraries

Install the common development packages.

Ubuntu or Debian:

```bash
sudo apt install -y \
  build-essential cmake ninja-build pkg-config \
  libssl-dev libsqlite3-dev zlib1g-dev libbrotli-dev \
  nlohmann-json3-dev libspdlog-dev libfmt-dev
```

Then rebuild your project:

```bash
vix build
```

### The game module cannot find SDL2 or OpenGL

Install the game dependencies.

Ubuntu or Debian:

```bash
sudo apt install -y \
  libsdl2-dev libsdl2-image-dev libgl1-mesa-dev
```

macOS:

```bash
brew install sdl2 sdl2_image
```

Then rebuild:

```bash
vix build
```

### `vix agent` cannot use a local model

Make sure Ollama is installed:

```bash
ollama --version
```

Make sure a model is installed:

```bash
ollama list
```

If no model is available, pull a small one:

```bash
ollama pull llama3.2:1b
```

Then try again:

```bash
vix agent ask "Explain this project"
```

### The first AI agent request is slow

This is normal for local AI models.

The first request can be slower because the model may need to start, load into memory, or initialize its runtime.

For low-power machines, start with:

```bash
ollama pull llama3.2:1b
```

If you want a small coding-oriented model:

```bash
ollama pull qwen2.5-coder:1.5b
```

## Clean reinstall

If your system has an older broken installation, reinstall the SDK:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

Then verify:

```bash
vix --version
vix doctor
vix info
```

You should also confirm the SDK files:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
find ~/.local/lib/cmake -name VixConfig.cmake 2>/dev/null
```

## What you should remember

Use the full SDK:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

Verify the CLI:

```bash
vix --version
```

Verify the SDK header:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
```

Verify the CMake package:

```bash
find ~/.local/lib/cmake -name VixConfig.cmake 2>/dev/null
```

Inspect the environment:

```bash
vix doctor
```

For Getting Started, SDK mode is the correct installation mode.

## Next step

Now set up your development environment.

Next: [Set Up Your Environment](/getting-started/setup-environment)
