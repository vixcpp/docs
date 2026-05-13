# Your First HTTP Server

This page shows how to build your first HTTP server with Vix.cpp.

You will create:

```txt
GET /
GET /health
GET /hello/{name}
GET /users/{id}
```

The goal is to understand the core Vix HTTP model:

```txt
App → route → Request → Response → app.run()
```

## Start from your project

Use the project created in the previous page:

```bash
cd ~/tmp/api
```

Open:

```txt
src/main.cpp
```

Replace its content with this minimal server:

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

Run it:

```bash
vix dev
```

Open another terminal and test it:

```bash
curl -i http://127.0.0.1:8080/
```

Expected response body:

```txt
Hello world
```

## What this code does

```cpp
App app;
```

Creates the Vix application.

```cpp
app.get("/", [](Request &, Response &res) {
  res.send("Hello world");
});
```

Registers a `GET /` route.

```cpp
app.run(8080);
```

Starts the HTTP server on port `8080`.

## Core concepts

| Part | Purpose |
| --- | --- |
| `#include <vix.hpp>` | Imports the main Vix API. |
| `using namespace vix;` | Lets you use `App`, `Request`, and `Response` directly. |
| `App app;` | Creates the HTTP application. |
| `app.get(...)` | Registers a GET route. |
| `Request &req` | Reads what the client sent. |
| `Response &res` | Sends what your app returns. |
| `app.run(8080)` | Starts the server. |

## Return JSON

Most backend services return JSON.

Replace the `/` route with:

```cpp
app.get("/", [](Request &, Response &res) {
  res.json({
    "message", "Hello from Vix",
    "framework", "Vix.cpp"
  });
});
```

Run:

```bash
vix dev
```

Test:

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

## Add a health route

A health route is useful for checking whether your server is alive.

Add this before `app.run(8080)`:

```cpp
app.get("/health", [](Request &, Response &res) {
  res.json({
    "ok", true,
    "service", "api"
  });
});
```

Test:

```bash
curl -i http://127.0.0.1:8080/health
```

Expected response shape:

```json
{
  "ok": true,
  "service": "api"
}
```

## Add a path parameter

Path parameters let you read values from the URL.

Add this route:

```cpp
app.get("/hello/{name}", [](Request &req, Response &res) {
  const std::string name = req.param("name");

  res.json({
    "greeting", "Hello " + name,
    "powered_by", "Vix.cpp"
  });
});
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

Here:

```cpp
req.param("name")
```

reads the `{name}` part from the route:

```txt
/hello/{name}
```

## Add a route with an ID

Add another route:

```cpp
app.get("/users/{id}", [](Request &req, Response &res) {
  const std::string id = req.param("id");

  res.json({
    "ok", true,
    "id", id
  });
});
```

Test:

```bash
curl -i http://127.0.0.1:8080/users/42
```

Expected response shape:

```json
{
  "ok": true,
  "id": "42"
}
```

## Add query parameters

Query parameters come after `?` in the URL.

Update the `/users/{id}` route:

```cpp
app.get("/users/{id}", [](Request &req, Response &res) {
  const std::string id = req.param("id");
  const std::string page = req.query_value("page", "1");
  const std::string limit = req.query_value("limit", "10");

  res.json({
    "ok", true,
    "id", id,
    "page", page,
    "limit", limit
  });
});
```

Test:

```bash
curl -i "http://127.0.0.1:8080/users/42?page=2&limit=20"
```

Expected response shape:

```json
{
  "ok": true,
  "id": "42",
  "page": "2",
  "limit": "20"
}
```

## Response methods

Vix gives you several response helpers:

```cpp
res.send("Hello world");
res.text("Hello Vix");
res.json({"ok", true});
res.status(201).json({"ok", true});
res.header("Cache-Control", "no-cache");
res.file("public/index.html");
```

Use:

| Method | Use when |
| --- | --- |
| `res.send(...)` | You want a generic response. |
| `res.text(...)` | You want plain text. |
| `res.json(...)` | You want JSON. |
| `res.status(...).json(...)` | You want to set the HTTP status. |
| `res.header(...)` | You want to set a response header. |
| `res.file(...)` | You want to send a file. |

## Complete example

Your full `src/main.cpp` can now look like this:

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
      "service", "api"
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
    const std::string limit = req.query_value("limit", "10");

    res.json({
      "ok", true,
      "id", id,
      "page", page,
      "limit", limit
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

Test all routes:

```bash
curl -i http://127.0.0.1:8080/
curl -i http://127.0.0.1:8080/health
curl -i http://127.0.0.1:8080/hello/Gaspard
curl -i "http://127.0.0.1:8080/users/42?page=2&limit=20"
```

## Organize routes with functions

When your app grows, avoid putting everything directly in `main()`.

You can organize routes like this:

```cpp
#include <vix.hpp>

using namespace vix;

static void register_public_routes(App &app)
{
  app.get("/", [](Request &, Response &res) {
    res.json({
      "message", "Hello from Vix",
      "framework", "Vix.cpp"
    });
  });

  app.get("/health", [](Request &, Response &res) {
    res.json({
      "ok", true,
      "service", "api"
    });
  });
}

static void register_user_routes(App &app)
{
  app.get("/users/{id}", [](Request &req, Response &res) {
    const std::string id = req.param("id");
    const std::string page = req.query_value("page", "1");

    res.json({
      "ok", true,
      "id", id,
      "page", page
    });
  });
}

int main()
{
  App app;

  register_public_routes(app);
  register_user_routes(app);

  app.run(8080);

  return 0;
}
```

This keeps `main()` small and makes the app easier to maintain.

## Common mistakes

### Forgetting to run the server

Routes do nothing until you call:

```cpp
app.run(8080);
```

### Forgetting to return after an error

When you send an error response, return immediately.

```cpp
app.get("/users/{id}", [](Request &req, Response &res) {
  const std::string id = req.param("id");

  if (id == "0")
  {
    res.status(404).json({
      "ok", false,
      "error", "user not found"
    });

    return;
  }

  res.json({
    "ok", true,
    "id", id
  });
});
```

### Port 8080 is already in use

If the server cannot start, another process may already be using port `8080`.

Check:

```bash
sudo lsof -i :8080
```

Stop the process or change the port:

```cpp
app.run(3000);
```

### Running from the wrong folder

Run project commands from inside your project:

```bash
cd ~/tmp/api
vix dev
```

## What you should remember

The basic Vix HTTP model is:

```txt
App → route → Request → Response → app.run()
```

The minimal server is:

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

Use:

```bash
vix dev
```

during development.

Use:

```bash
vix run
```

when you want to start the app directly.

## What to read next

Now that you have a running HTTP server, continue with:

- [The Vix Book](/book/01-introduction)
- [Routes](/book/04-routes)
- [Request and Response](/book/05-request-response)
- [Build a REST API](/guides/build-rest-api)
- [Templates](/guides/templates)
