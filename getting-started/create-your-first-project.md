# Create Your First Project

This page shows how to create your first real Vix project.

Until now, you used:

```bash
vix run main.cpp
```

That is great for a single file.

For a real application, use:

```bash
vix new api
```

A Vix project gives you a clean structure, a build workflow, tests, configuration files, and a better development loop.

## Create a project

Create a new project:

```bash
cd ~/tmp
vix new api
```

Vix will ask which template you want to use.

Choose:

```txt
Application
```

The output should look similar to this:

```txt
Template
❯ Application
  Library (header-only)

Core
  ○ ORM
  ○ Sanitizers
  ○ Static C++ runtime

Advanced
  ○ Full static

✔ Project created.
  • Location  : /home/your-user/tmp/api

✔  api  application
─────────────────────────────────────
next
1  cd api/     enter project
2  vix build   compile
3  vix run     start app
```

## Enter the project

```bash
cd api
```

## Build the project

Run:

```bash
vix build
```

Expected output shape:

```txt
Compiling api (dev)
  build [============================] done
  ✔ Configured
  ✔ Built
  ✔ Done in 1.6s
```

This compiles the project without starting the application.

## Run the project

Run:

```bash
vix run
```

Expected output shape:

```txt
Vix.cpp   READY   v2.5.3   run
  › HTTP:    http://localhost:8080/
  i Threads: 8/8
  i Mode:    run
  i Status:  ready
  i Hint:    Ctrl+C to stop the server
```

Open another terminal and test it:

```bash
curl -i http://127.0.0.1:8080/
```

Stop the server with:

```txt
Ctrl+C
```

## Development mode

For day-to-day development, use:

```bash
vix dev
```

`vix dev` starts the project in development mode.

Use it when you are editing code and want a faster development loop.

Then open:

```txt
http://localhost:8080/
```

## Generated project structure

A basic application project usually looks like this:

```txt
api/
├── CMakeLists.txt
├── CMakePresets.json
├── README.md
├── app.vix
├── vix.json
├── .env
├── .env.example
├── src/
│   └── main.cpp
└── tests/
    └── test_basic.cpp
```

## What each file does

| File or folder | Purpose |
| --- | --- |
| `src/` | Application source code. |
| `tests/` | Project tests. |
| `CMakeLists.txt` | C++ build configuration. |
| `CMakePresets.json` | Build presets used by CMake and Vix. |
| `app.vix` | Vix app manifest. |
| `vix.json` | Vix project metadata, dependencies, and tasks. |
| `.env` | Local runtime configuration. |
| `.env.example` | Example environment file. |
| `README.md` | Project documentation. |

## Open the entry file

Open:

```txt
src/main.cpp
```

A minimal generated app can look like this:

```cpp
#include <vix.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.send("Hello world");
  });

  app.run(8080);

  return 0;
}
```

This is the main entrypoint of your application.

## Edit the first route

Replace the route with a JSON response:

```cpp
app.get("/", [](Request &, Response &res) {
  res.json({
    "message", "Hello from your first Vix project",
    "framework", "Vix.cpp"
  });
});
```

Add a health route:

```cpp
app.get("/health", [](Request &, Response &res) {
  res.json({
    "ok", true,
    "service", "api"
  });
});
```

Your full `src/main.cpp` can look like this:

```cpp
#include <vix.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.json({
      "message", "Hello from your first Vix project",
      "framework", "Vix.cpp"
    });
  });

  app.get("/health", [](Request &, Response &res) {
    res.json({
      "ok", true,
      "service", "api"
    });
  });

  app.run(8080);

  return 0;
}
```

Run:

```bash
vix dev
```

Test:

```bash
curl -i http://127.0.0.1:8080/
curl -i http://127.0.0.1:8080/health
```

## Use `.env`

Vix projects can use `.env` files for local configuration.

Example:

```dotenv
SERVER_PORT=8080
VIX_LOG_LEVEL=info
VIX_LOG_FORMAT=kv
```

In code, you can load configuration:

```cpp
#include <vix.hpp>

using namespace vix;

int main()
{
  config::Config cfg{".env"};

  App app;

  app.get("/", [](Request &, Response &res) {
    res.json({
      "message", "Hello from Vix",
      "framework", "Vix.cpp"
    });
  });

  app.run(cfg.getServerPort());

  return 0;
}
```

Now the server port comes from `.env`.

## Useful project commands

Inside the project folder:

```bash
vix build
vix run
vix dev
vix check
vix tests
vix fmt
```

| Command | Purpose |
| --- | --- |
| `vix build` | Compile the project. |
| `vix run` | Build and start the app. |
| `vix dev` | Start development mode. |
| `vix check` | Validate the project. |
| `vix tests` | Run tests. |
| `vix fmt` | Format source files. |

## Project tasks

Some projects define tasks in `vix.json`.

You can run them with:

```bash
vix task dev
vix task test
vix task check
```

A `vix.json` file can contain tasks like:

```json
{
  "name": "api",
  "deps": [],
  "vars": {
    "preset": "dev-ninja",
    "release_preset": "release"
  },
  "tasks": {
    "dev": {
      "description": "Start dev mode",
      "command": "vix dev"
    },
    "test": {
      "description": "Run tests",
      "command": "vix tests --preset ${preset}"
    },
    "check": {
      "description": "Validate project",
      "command": "vix check --preset ${preset} --tests"
    }
  }
}
```

## Application vs library

When you run:

```bash
vix new api
```

Vix can create different kinds of projects.

For this guide, choose:

```txt
Application
```

Use Application when you want to build a runnable app, server, API, or service.

Use Library (header-only) when you want to build a reusable C++ library.

Example:

```bash
vix new tree
```

Then choose:

```txt
Library (header-only)
```

A library project is useful when you want to create reusable headers and tests, but it is not the main path for this Getting Started guide.

## Common mistakes

### Running commands outside the project

Wrong:

```bash
cd ~/tmp
vix dev
```

Correct:

```bash
cd ~/tmp/api
vix dev
```

Run project commands from the project folder.

### Forgetting to stop the previous server

If port 8080 is already in use, stop the previous server with:

```txt
Ctrl+C
```

Or find the process:

```bash
sudo lsof -i :8080
```

### Editing files but not rebuilding

When using:

```bash
vix run
```

you may need to restart manually after changes.

For active development, use:

```bash
vix dev
```

### Adding new `.cpp` files

If you add new source files, make sure they are part of the build.

For a CMake project, update `CMakeLists.txt`.

Example:

```cmake
add_executable(api
  src/main.cpp
  src/routes.cpp
)
```

## What you should remember

Create an application project:

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

Develop it:

```bash
vix dev
```

A Vix project is the point where a quick experiment becomes a real application.

## Next step

Build your first HTTP server with Vix.

Next: [Your First HTTP Server](/getting-started/first-http-server)
