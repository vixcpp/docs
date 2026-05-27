# Run Your First C++ File

This page shows how to run a single C++ file with Vix.

The main command is:

```bash
vix run main.cpp
```

Use this mode for quick experiments, small examples, and learning.

## Create a workspace

Create a clean folder:

```bash
mkdir -p ~/tmp/vix-first-file
cd ~/tmp/vix-first-file
```

## Create `main.cpp`

Create the file:

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

## What happened?

When you run:

```bash
vix run main.cpp
```

Vix detects a single C++ source file, builds it, then runs the generated program.

You do not need to create a full project for this mode.

Single-file mode is useful for:

- testing small ideas
- learning Vix APIs
- writing small tools
- running examples
- validating quick C++ code

## Run a small HTTP app

Replace `main.cpp`:

```bash
cat > main.cpp <<'CPP'
#include <vix.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.text("Hello from Vix.cpp");
  });

  app.run();

  return 0;
}
CPP
```

Create `.env`:

```bash
cat > .env <<'EOF'
SERVER_PORT=8080
VIX_LOG_LEVEL=info
VIX_LOG_FORMAT=kv
EOF
```

Run it:

```bash
vix run main.cpp
```

Expected output shape:

```txt
Vix.cpp   READY   v2.6.0
HTTP:    http://localhost:8080/
Status:  ready
```

Test it in another terminal:

```bash
curl -i http://127.0.0.1:8080/
```

Expected response:

```txt
Hello from Vix.cpp
```

Stop the server with:

```txt
Ctrl+C
```

## Return JSON

Replace `main.cpp` with a JSON response:

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
      "mode", "single-file"
    });
  });

  app.get("/health", [](Request &, Response &res) {
    res.json({
      "ok", true,
      "service", "first-file"
    });
  });

  app.run();

  return 0;
}
CPP
```

Run it:

```bash
vix run main.cpp
```

Test it:

```bash
curl -i http://127.0.0.1:8080/
curl -i http://127.0.0.1:8080/health
```

## Add a route parameter

Update `main.cpp`:

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
      "mode", "single-file"
    });
  });

  app.get("/health", [](Request &, Response &res) {
    res.json({
      "ok", true,
      "service", "first-file"
    });
  });

  app.get("/hello/{name}", [](Request &req, Response &res) {
    const std::string name = req.param("name");

    res.json({
      "greeting", "Hello " + name,
      "powered_by", "Vix.cpp"
    });
  });

  app.run();

  return 0;
}
CPP
```

Run it:

```bash
vix run main.cpp
```

Test it:

```bash
curl -i http://127.0.0.1:8080/hello/Gaspard
```

Expected response shape:

```json
{
  "greeting": "Hello Gaspard",
  "powered_by": "Vix.cpp"
}
```

## Add a query parameter

Update `main.cpp` again:

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
      "mode", "single-file"
    });
  });

  app.get("/health", [](Request &, Response &res) {
    res.json({
      "ok", true,
      "service", "first-file"
    });
  });

  app.get("/hello/{name}", [](Request &req, Response &res) {
    const std::string name = req.param("name");

    res.json({
      "greeting", "Hello " + name,
      "powered_by", "Vix.cpp"
    });
  });

  app.get("/users/{id}", [](Request &req, Response &res) {
    const std::string id = req.param("id");
    const std::string page = req.query_value("page", "1");

    res.json({
      "id", id,
      "page", page
    });
  });

  app.run();

  return 0;
}
CPP
```

Run it:

```bash
vix run main.cpp
```

Test it:

```bash
curl -i "http://127.0.0.1:8080/users/42?page=2"
```

Expected response shape:

```json
{
  "id": "42",
  "page": "2"
}
```

## Pass runtime arguments

Runtime arguments are passed to your program with `--run`.

Create a small argument example:

```bash
cat > main.cpp <<'CPP'
#include <vix.hpp>

int main(int argc, char **argv)
{
  vix::print("argc = {}", argc);

  for (int i = 0; i < argc; ++i)
  {
    vix::print("argv[{}] = {}", i, argv[i]);
  }

  return 0;
}
CPP
```

Run it:

```bash
vix run main.cpp --run --name Vix
```

## Pass compiler flags

Use `--` for compiler and linker flags:

```bash
vix run main.cpp -- -O2 -DNDEBUG
```

Add include paths:

```bash
vix run main.cpp -- -I./include
```

Link with libraries:

```bash
vix run main.cpp -- -lssl -lcrypto
```

## `--run` vs `--`

Use `--run` for arguments passed to your program:

```bash
vix run main.cpp --run --name Vix
```

Use `--` for compiler or linker flags:

```bash
vix run main.cpp -- -O2 -DNDEBUG
```

Do not use `--` for runtime arguments.

## Use watch mode

During development, you can rebuild and restart when the file changes:

```bash
vix run main.cpp --watch
```

For full projects, you will usually use:

```bash
vix dev
```

## Use sanitizers

For memory debugging:

```bash
vix run main.cpp --san
```

For undefined behavior checks:

```bash
vix run main.cpp --ubsan
```

## When to create a project

A single file is perfect for learning and small tests.

Move to a project when you need:

- multiple source files
- headers
- dependencies
- tests
- `.env.example`
- a stable folder structure
- production builds

## What you should remember

Run a single C++ file:

```bash
vix run main.cpp
```

Use `.env` for configuration:

```dotenv
SERVER_PORT=8080
```

Use `--run` for runtime arguments:

```bash
vix run main.cpp --run --name Vix
```

Use `--` for compiler and linker flags:

```bash
vix run main.cpp -- -O2 -DNDEBUG
```

When the app grows, create a real project.

## Next step

Create your first Vix project.

Next: [Create Your First Project](/getting-started/create-your-first-project)
