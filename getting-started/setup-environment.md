# Set Up Your Environment

This page helps you confirm that your Vix.cpp development environment is ready.
At this point, Vix should already be installed.

You should have:

- the `vix` CLI
- the full Vix SDK
- a C++ compiler
- CMake
- Ninja
- the required system libraries for your platform

This page does not repeat the full installation steps.
It only verifies that your local environment can run a Vix application.

## Check Vix

Check that the `vix` command is available:

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

## Choose a working folder

Use a clean temporary folder for the first examples:

```bash
cd /tmp
```

Or use your own workspace:

```bash
mkdir -p ~/projects/vix-examples
cd ~/projects/vix-examples
```

## Create a Vix application

Create `main.cpp`:

```bash
cat > main.cpp <<'CPP'
#include <vix.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.json({
      "message", "Hello from Vix.cpp",
      "version", "2.6.0"
    });
  });

  app.run();

  return 0;
}
CPP
```

The application uses:

```cpp
app.run();
```

This is intentional.

Vix reads the server port from the environment.

## Configure the port with `.env`

Create a `.env` file:

```bash
cat > .env <<'EOF'
SERVER_PORT=8080
VIX_LOG_LEVEL=info
VIX_LOG_FORMAT=kv
EOF
```

This keeps configuration outside the source code.

Your project now has:

```txt
main.cpp
.env
```

## Run the application

Run it:

```bash
vix run main.cpp
```

Expected output shape:

```txt
12:09:05 PM  ● Vix.cpp   READY   v2.6.0 (1 ms)   run
  › HTTP:    http://localhost:8080/
  i Threads: 8/8
  i Mode:    run
  i Status:  ready
  i Hint:    Ctrl+C to stop the server
```

This means Vix successfully compiled and started your application.

## Test the server

Open another terminal and run:

```bash
curl http://127.0.0.1:8080/
```

Expected response shape:

```json
{
  "message": "Hello from Vix.cpp",
  "version": "2.6.0"
}
```

You can also open this URL in your browser:

```txt
http://localhost:8080/
```

## Stop the server

Go back to the terminal running the server and press:

```txt
Ctrl+C
```

Expected output shape:

```txt
Program interrupted by user (SIGINT).
```

## Change the port

To change the port, edit `.env`:

```dotenv
SERVER_PORT=3000
VIX_LOG_LEVEL=info
VIX_LOG_FORMAT=kv
```

Then run again:

```bash
vix run main.cpp
```

Open:

```txt
http://localhost:3000/
```

This is the recommended workflow.

Do not hardcode the port in your source code for normal applications.

## Useful environment commands

You can inspect your setup with:

```bash
vix doctor
```

And inspect Vix paths, cache, and installation details with:

```bash
vix info
```

These commands are useful when something does not behave as expected.

## Recommended editor setup

You can use any editor.

Recommended setup:

| Tool          | Recommendation                                           |
| ------------- | -------------------------------------------------------- |
| Editor        | VS Code, CLion, Vim, Neovim, or Zed                      |
| Compiler      | GCC or Clang on Linux/macOS, MSVC or clang-cl on Windows |
| Build system  | CMake                                                    |
| Build backend | Ninja                                                    |
| Terminal      | Bash, Zsh, PowerShell, or Windows Terminal               |

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

Vix applications should keep configuration in environment variables.

For local development, use `.env`:

```dotenv
SERVER_PORT=8080
VIX_LOG_LEVEL=info
VIX_LOG_FORMAT=kv
```

For production, these values can come from your service manager, deployment platform, or system environment.

The source code stays the same.

Only the environment changes.

## Common issues

### Port 8080 is already in use

If another program already uses port `8080`, change the port in `.env`:

```dotenv
SERVER_PORT=3000
```

Then run again:

```bash
vix run main.cpp
```

Or find the process using the port:

```bash
sudo lsof -i :8080
```

### The app starts but `curl` cannot connect

Make sure the server is still running.

You should see:

```txt
Vix.cpp   READY
```

Then test again:

```bash
curl http://127.0.0.1:8080/
```

If you changed the port in `.env`, use that port instead.

### The first run is slower

The first run may take a little longer because Vix may need to configure and build the application.

Later runs are usually faster.

## What you should remember

Keep configuration outside the code:

```dotenv
SERVER_PORT=8080
```

Run the app:

```bash
vix run main.cpp
```

If you see:

```txt
Vix.cpp   READY   v2.6.0
```

Your environment is ready.

## Next step

Run your first C++ file with Vix.

Next: [Run Your First C++ File](/getting-started/run-your-first-file)
