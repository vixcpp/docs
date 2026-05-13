# Run Your First C++ File

This page shows how to run a single C++ file with Vix.

The main command is:

```bash
vix run main.cpp
```

This is the fastest way to start using Vix.

## Create a workspace

Create a temporary folder:

```bash
mkdir -p ~/tmp/vix-first-file
cd ~/tmp/vix-first-file
```

Create `main.cpp`:

```bash
touch main.cpp
```

## Write your first C++ program

Open `main.cpp` and write:

```cpp
#include <iostream>

int main()
{
  std::cout << "Hello from Vix\n";
  return 0;
}
```

Run it:

```bash
vix run main.cpp
```

Expected output:

```txt
Hello from Vix
```

## What happened?

When you run:

```bash
vix run main.cpp
```

Vix detects that you passed a single `.cpp` file.

It then:

```txt
detects the file → compiles it → runs it → prints the output
```

You do not need to create a full project yet.

This mode is useful for:

- quick experiments
- learning Vix
- testing small ideas
- writing small C++ tools
- running examples

## Run a Vix HTTP file

Now replace `main.cpp` with a small Vix HTTP app:

```cpp
#include <vix.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request &, Response &res) {
    res.text("Hello Vix");
  });

  app.run(8080);

  return 0;
}
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

Open another terminal and test the server:

```bash
curl -i http://127.0.0.1:8080/
```

Expected response:

```txt
Hello Vix
```

Stop the server with:

```txt
Ctrl+C
```

## Return JSON

Most Vix backend apps return JSON.

Update the route:

```cpp
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

  app.get("/health", [](Request &, Response &res) {
    res.json({
      "ok", true,
      "service", "first-file"
    });
  });

  app.run(8080);

  return 0;
}
```

Run it again:

```bash
vix run main.cpp
```

Test it:

```bash
curl -i http://127.0.0.1:8080/
curl -i http://127.0.0.1:8080/health
```

## Add a route parameter

Vix routes can contain path parameters.

Add this route before `app.run(8080)`:

```cpp
app.get("/hello/{name}", [](Request &req, Response &res) {
  const std::string name = req.param("name");

  res.json({
    "greeting", "Hello " + name,
    "powered_by", "Vix.cpp"
  });
});
```

Run:

```bash
vix run main.cpp
```

Test:

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

Query parameters come after `?` in the URL.

Add this route before `app.run(8080)`:

```cpp
app.get("/users/{id}", [](Request &req, Response &res) {
  const std::string id = req.param("id");
  const std::string page = req.query_value("page", "1");

  res.json({
    "id", id,
    "page", page
  });
});
```

Run:

```bash
vix run main.cpp
```

Test:

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

## Complete example

Your full `main.cpp` can look like this:

```cpp
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

  app.run(8080);

  return 0;
}
```

Run:

```bash
vix run main.cpp
```

Test:

```bash
curl -i http://127.0.0.1:8080/
curl -i http://127.0.0.1:8080/health
curl -i http://127.0.0.1:8080/hello/Gaspard
curl -i "http://127.0.0.1:8080/users/42?page=2"
```

## Pass runtime arguments

Runtime arguments are arguments passed to your program.

Use `--run`:

```bash
vix run main.cpp --run --port 8080
```

Use this when your program reads `argv`.

Example:

```cpp
#include <iostream>

int main(int argc, char **argv)
{
  std::cout << "argc = " << argc << "\n";

  for (int i = 0; i < argc; ++i)
  {
    std::cout << "argv[" << i << "] = " << argv[i] << "\n";
  }

  return 0;
}
```

Run:

```bash
vix run main.cpp --run --port 8080
```

## Important: `--run` vs `--`

In script mode, `--run` is for runtime arguments.

```bash
vix run main.cpp --run --port 8080
```

The `--` separator is for compiler or linker flags.

```bash
vix run main.cpp -- -O2 -DNDEBUG
```

Do not use `--` for runtime arguments in script mode.

Wrong:

```bash
vix run main.cpp -- --port 8080
```

Correct:

```bash
vix run main.cpp --run --port 8080
```

## Pass compiler flags

Use `--` to pass compiler or linker flags:

```bash
vix run main.cpp -- -O2 -DNDEBUG
```

Link with libraries:

```bash
vix run main.cpp -- -lssl -lcrypto
```

Add include paths:

```bash
vix run main.cpp -- -I./include
```

## Use watch mode

During development, you can rebuild and restart when the file changes:

```bash
vix run main.cpp --watch
```

For project development, you will usually use:

```bash
vix dev
```

You will learn this in the next pages.

## Use sanitizers

For debugging memory issues:

```bash
vix run main.cpp --san
```

For undefined behavior checks:

```bash
vix run main.cpp --ubsan
```

## Common mistakes

### Using CLI-only installation

If your code uses:

```cpp
#include <vix.hpp>
```

you need the full SDK.

Check:

```bash
find ~/.local/include -name vix.hpp 2>/dev/null
```

If nothing appears, reinstall Vix:

```bash
curl -fsSL https://vixcpp.com/install.sh | bash
```

### Passing runtime args after `--`

Wrong:

```bash
vix run main.cpp -- --port 8080
```

Correct:

```bash
vix run main.cpp --run --port 8080
```

### Port 8080 is already in use

If the server cannot start, another process may already be using port 8080.

Check:

```bash
sudo lsof -i :8080
```

Stop the other process or change the port:

```cpp
app.run(3000);
```

### Running from the wrong directory

Relative paths depend on the directory where you run `vix`.

For example:

```cpp
res.file("public/index.html");
```

will look for:

```txt
public/index.html
```

relative to your current working directory.

## When to create a project

A single file is perfect for learning.

Move to a project when you need:

- multiple `.cpp` files
- headers
- tests
- dependencies
- `.env` configuration
- a stable folder structure
- release builds

The next page shows how to create a real Vix project.

## What you should remember

The main command is:

```bash
vix run main.cpp
```

Use:

- `--run` for runtime arguments
- `--` for compiler and linker flags

Single-file mode is the fastest way to start.

When your app grows, create a project.

## Next step

Create your first Vix project.

Next: [Create Your First Project](/getting-started/create-your-first-project)
