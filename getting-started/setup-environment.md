# Set Up Your Environment

This page helps you prepare a clean development environment for Vix.cpp.

Before writing real Vix applications, make sure your terminal, compiler, build tools, and project folder are ready.

## Check Vix

First, verify that the `vix` command is available:

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

The exact version may be different.

## Check your C++ compiler

Vix uses your system C++ compiler underneath.

Run:

```bash
c++ --version
```

You should see a compiler such as GCC, Clang, MSVC, or clang-cl.

On Linux, GCC or Clang is recommended.

## Check CMake

Vix uses CMake for project builds.

Run:

```bash
cmake --version
```

If CMake is missing on Ubuntu or Debian:

```bash
sudo apt update
sudo apt install -y cmake
```

## Check Ninja

Ninja is the recommended build backend for Vix projects.

Run:

```bash
ninja --version
```

If Ninja is missing on Ubuntu or Debian:

```bash
sudo apt install -y ninja-build
```

## Check common development libraries

For most Vix applications, install the common C++ development dependencies.

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

For optional libraries, use vcpkg.

## Recommended project folder

Create a clean folder for experiments:

```bash
mkdir -p ~/tmp
cd ~/tmp
```

You can use this folder for the first examples in this guide.

## Create a quick test file

Create `main.cpp`:

```bash
cat > main.cpp <<'CPP'
#include <iostream>

int main()
{
  std::cout << "Hello from my C++ environment\n";
  return 0;
}
CPP
```

Run it with Vix:

```bash
vix run main.cpp
```

Expected output:

```txt
Hello from my C++ environment
```

If this works, your basic C++ environment is ready.

## Test a Vix HTTP program

Now test that the Vix SDK headers and libraries are available.

Replace `main.cpp`:

```bash
cat > main.cpp <<'CPP'
#include <vix.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.json({
      "message", "Hello from Vix",
      "framework", "Vix.cpp"
    });
  });

  app.run(8080);

  return 0;
}
CPP
```

Run it:

```bash
vix run main.cpp
```

Expected output shape:

```txt
Vix.cpp   READY
HTTP:    http://localhost:8080/
Status:  ready
```

In another terminal, test the server:

```bash
curl -i http://127.0.0.1:8080/
```

Expected response shape:

```json
{
  "message": "Hello from Vix",
  "framework": "Vix.cpp"
}
```

Stop the server with:

```txt
Ctrl+C
```

## Check useful Vix commands

These commands help you inspect your environment:

```bash
vix doctor
vix info
```

Use `vix doctor` when you want to check whether your toolchain is healthy.

Use `vix info` when you want to inspect paths, cache directories, and installation details.

## Recommended editor setup

You can use any editor.

Recommended setup:

| Tool | Recommendation |
| --- | --- |
| Editor | VS Code, CLion, Vim, Neovim, or Zed |
| Compiler | GCC or Clang on Linux/macOS, MSVC or clang-cl on Windows |
| Build system | CMake |
| Build backend | Ninja |
| Terminal | Bash, Zsh, PowerShell, or Windows Terminal |

For VS Code, install:

- C/C++ extension
- CMake Tools
- clangd, optional

## Recommended Git setup

If you plan to create real projects, configure Git:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Check:

```bash
git config --global --list
```

## Environment variables

Vix applications often read configuration from `.env`.

A simple `.env` file can look like this:

```dotenv
SERVER_PORT=8080
VIX_LOG_LEVEL=info
VIX_LOG_FORMAT=kv
```

Later, project templates can generate `.env` and `.env.example` files for you.

## Common issues

### `vix: command not found`

Your terminal cannot find the Vix binary.

Fix your PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

For Zsh:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Then check:

```bash
vix --version
```

### `c++: command not found`

Install a compiler.

On Ubuntu or Debian:

```bash
sudo apt update
sudo apt install -y build-essential
```

### `cmake: command not found`

Install CMake:

```bash
sudo apt install -y cmake
```

### `ninja: command not found`

Install Ninja:

```bash
sudo apt install -y ninja-build
```

### `#include <vix.hpp> not found`

The full SDK is missing or not installed correctly.

Check:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
```

If nothing appears, reinstall the full SDK:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

Do not use CLI-only mode for this guide.

### Port 8080 is already in use

Find the process using the port:

```bash
sudo lsof -i :8080
```

Stop the process or change the port in your code.

## What you should remember

A good Vix environment has:

- `vix`
- `c++`
- `cmake`
- `ninja`
- `git`
- `curl`

Check them with:

```bash
vix --version
c++ --version
cmake --version
ninja --version
git --version
curl --version
```

The most important test is:

```bash
vix run main.cpp
```

If that works, you are ready to write your first C++ file with Vix.

## Next step

Run your first C++ file with Vix.

Next: [Run Your First C++ File](/getting-started/run-your-first-file)

