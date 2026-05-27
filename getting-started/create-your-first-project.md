# Create Your First Project

This page shows how to create your first Vix project.
You already know how to run a single C++ file:

```bash
vix run main.cpp
```

That is useful for quick experiments.

For a real project, use:

```bash
vix new
```

A Vix project gives you a clean folder, a manifest, configuration files, tests, and project commands.

## Create a simple application

Create a new application project:

```bash
cd ~/tmp
vix new hello --app
```

This creates a minimal runnable Vix application.
The CLI will print the next steps:

```txt
next
1  cd hello/    enter project
2  vix build    compile
3  vix run      start app
```

## Enter the project

```bash
cd hello
```

## Create local configuration

If the project contains `.env.example`, create your local `.env`:

```bash
cp .env.example .env
```

This is the recommended workflow.

`.env.example` documents the expected configuration.

`.env` contains your local values.

## Build the project

Compile the project:

```bash
vix build
```

Expected output shape:

```txt
Compiling hello (dev)
  ✔ Configured
  ✔ Built
  ✔ Done in 1.6s
```

`vix build` compiles the project without starting it.

## Run the project

Start the application:

```bash
vix run
```

Expected output shape:

```txt
● Vix.cpp   READY   v2.6.0   run
  › HTTP:    http://localhost:8080/
  i Threads: 8/8
  i Mode:    run
  i Status:  ready
  i Hint:    Ctrl+C to stop the server
```

Open another terminal and test it:

```bash
curl http://127.0.0.1:8080/
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

Use `vix dev` when you are editing code and want a development loop.

Use `vix run` when you simply want to start the application.

## Generated project structure

A simple application project looks like this:

```txt
hello/
├── src/
│   └── main.cpp
├── tests/
│   └── test_basic.cpp
├── .env.example
├── .env
├── vix.app
├── vix.json
└── README.md
```

Some projects may include extra files depending on the selected template.

## What each file does

| File or folder | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| `src/main.cpp` | Main application entry point.                          |
| `tests/`       | Project tests.                                         |
| `.env.example` | Example configuration shared with the project.         |
| `.env`         | Local configuration for your machine.                  |
| `vix.app`      | Application manifest used by Vix to build the project. |
| `vix.json`     | Project metadata, tasks, and dependencies.             |
| `README.md`    | Generated project documentation.                       |

## Open the entry file

Open:

```txt
src/main.cpp
```

A simple generated app keeps the entry point small.

The exact code can evolve between versions, but the idea stays the same:

```cpp
#include <vix.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.send("Hello from Vix.cpp");
  });

  app.run();

  return 0;
}
```

The port should come from configuration, not from hardcoded values in normal applications.

## Configuration

Open:

```txt
.env
```

You may see values such as:

```dotenv
SERVER_PORT=8080
VIX_LOG_LEVEL=info
VIX_LOG_FORMAT=kv
```

To change the port, edit:

```dotenv
SERVER_PORT=3000
```

Then run again:

```bash
vix run
```

The source code does not need to change.

## `vix.app`

The `vix.app` file describes the application target.

It tells Vix what to build.

For simple projects, you do not need to write a `CMakeLists.txt` manually.

The flow is:

```txt
vix.app
  -> Vix generates the internal CMake project
  -> vix build compiles the app
  -> vix run starts the app
```

This gives you a simple project file while keeping a real native C++ build underneath.

## `vix.json`

The `vix.json` file stores project metadata, tasks, and dependency information.

Some projects define tasks that you can run with:

```bash
vix task <name>
```

Common examples:

```bash
vix task dev
vix task test
vix task ci
```

The exact tasks depend on the generated template.

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

| Command     | Purpose                            |
| ----------- | ---------------------------------- |
| `vix build` | Compile the project.               |
| `vix run`   | Build if needed and start the app. |
| `vix dev`   | Start development mode.            |
| `vix check` | Validate the project.              |
| `vix tests` | Run tests.                         |
| `vix fmt`   | Format source files.               |

## Project templates

The `--app` template is the simplest way to start.

Vix also provides templates for more specific project types.

| Template    | Command                            | Use when                                               |
| ----------- | ---------------------------------- | ------------------------------------------------------ |
| Application | `vix new hello --app`              | You want a minimal runnable Vix application.           |
| Backend     | `vix new api --template backend`   | You want a production-oriented API or backend service. |
| Web         | `vix new site --template web`      | You want server-rendered HTML with Vix templates.      |
| Vue         | `vix new dashboard --template vue` | You want a Vue frontend with a Vix C++ backend.        |
| Game        | `vix new game --template game`     | You want a game-oriented Vix project.                  |
| Library     | `vix new mathlib --lib`            | You want a reusable C++ library.                       |

Getting Started uses `--app` because it is the smallest project shape.

The other templates have their own structure and evolution strategy.

You will learn them in the Project Templates section.

## When to use another template

Use the backend template when you want controllers, routes, middleware, public files, storage, migrations, tests, and production diagnostics from the beginning.

Use the web template when you want HTML rendered on the server with Vix templates.

Use the Vue template when you want a modern frontend and a Vix backend in the same project.

Use the game template when you want a game-oriented runtime structure.

Use the library template when you want reusable C++ code instead of a runnable app.

## Common mistakes

### Running commands outside the project

Wrong:

```bash
cd ~/tmp
vix run
```

Correct:

```bash
cd ~/tmp/hello
vix run
```

Run project commands from the project folder.

### Forgetting `.env`

If the project has `.env.example`, create your local `.env`:

```bash
cp .env.example .env
```

Do this once after generating the project.

### Forgetting to stop the previous server

If port `8080` is already in use, stop the previous server with:

```txt
Ctrl+C
```

Or change the port in `.env`:

```dotenv
SERVER_PORT=3000
```

Then run again:

```bash
vix run
```

### Editing files but not using development mode

For active development, prefer:

```bash
vix dev
```

Use `vix run` when you simply want to start the app.

## What you should remember

Create a simple application project:

```bash
vix new hello --app
cd hello
cp .env.example .env
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

A Vix project is where a quick experiment becomes a real application.

## Next step

Build your first HTTP server with Vix.

Next: [Your First HTTP Server](/getting-started/first-http-server)

For deeper project structures, continue later with:

- [Application template](/templates/application)
- [Backend template](/templates/backend)
- [Web template](/templates/web)
- [Vue template](/templates/vue)
- [Game template](/templates/game)
- [Library template](/templates/library)
