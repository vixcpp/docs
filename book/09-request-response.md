# Request and Response

They are the core of the Vix HTTP model:

```txt
Request reads what the client sent.
Response sends what your app returns.
```

## What is Request?

| Method | Purpose |
|--------|---------|
| `req.param("id")` | Read path parameter |
| `req.param("id", "0")` | Read path parameter with fallback |
| `req.query_value("page", "1")` | Read query parameter with fallback |
| `req.query()` | Read all query parameters |
| `req.header("Authorization")` | Read request header |
| `req.body()` | Read raw body |
| `req.json()` | Read parsed JSON body |
| `req.path()` | Request path |

## What is Response?

| Method | Purpose |
|--------|---------|
| `res.text("Hello")` | Send plain text |
| `res.json({"ok", true})` | Send JSON |
| `res.status(201).json(...)` | Set status then send |
| `res.header("X-Foo", "bar")` | Set response header |
| `res.file("public/index.html")` | Send file |

## Reading path parameters

```cpp
app.get("/users/{id}", [](Request &req, Response &res){
  const std::string id = req.param("id");
  res.json({"id", id});
});
```

## Reading query parameters

```cpp
app.get("/search", [](Request &req, Response &res){
  const std::string q = req.query_value("q", "");
  const std::string page = req.query_value("page", "1");

  res.json({
    "q", q,
    "page", page
  });
});
```

```bash
curl -i "http://127.0.0.1:8080/search?q=vix&page=2"
```

## Reading all query parameters

```cpp
app.get("/debug/query", [](Request &req, Response &res){
  res.json({"query", req.query()});
});
```

## Reading headers

```cpp
app.get("/debug/headers", [](Request &req, Response &res){
  res.json({
    "user_agent", req.header("User-Agent"),
    "authorization", req.header("Authorization")
  });
});
```

## Reading the raw body

```cpp
app.post("/debug/body", [](Request &req, Response &res){
  res.json({"body", req.body()});
});
```

## Reading JSON body

```cpp
app.post("/users", [](Request &req, Response &res){
  const auto &body = req.json();

  if (!body.is_object()){
    res.status(400).json({
      "ok", false,
      "error", "expected JSON object"
    });

    return;
  }

  const std::string name = body.value("name", "");
  const std::string role = body.value("role", "user");

  if (name.empty()){
    res.status(400).json({
      "ok", false,
      "error", "name is required"
    });

    return;
  }

  res.status(201).json({
    "ok", true,
    "user", vix::json::o("name", name),
    "role", role
  });

});
```

## Setting headers

```cpp
app.get("/health", [](Request &, Response &res){
  res.header("X-Powered-By", "Vix.cpp");
  res.json({"ok", true});
});
```

## Cache-Control header

```cpp
res.header("Cache-Control", "public, max-age=3600");
res.json({"ok", true});
```

## Download response

```cpp
res.header("Content-Disposition", "attachment; filename=\"hello.txt\"");
res.file("public/hello.txt");
```

## Error helper

```cpp
static void respond_error(Response &res, int status, const std::string &message){
  res.status(status).json({
    "ok", false,
    "error", message
  });
}
```

## Good response shape

```json
// Success
{ "ok": true, "data": {} }

// Error
{ "ok": false, "error": "message" }

// List
{ "ok": true, "count": 2, "data": [] }
```

## Request and Response lifecycle

```txt
client sends request
  ↓
Vix creates Request
  ↓
route handler reads Request
  ↓
route handler writes Response
  ↓
Vix sends response to client
```

## Common mistakes

### Forgetting to name Request when you need it

```cpp
// Wrong — req is unnamed but used
app.get("/users/{id}", [](Request &, Response &res){
  const std::string id = req.param("id");
});   // error!

// Correct
app.get("/users/{id}", [](Request &req, Response &res){
  const std::string id = req.param("id");
  res.json({"id", id});
});
```

### Forgetting to return after errors

```cpp
// Wrong
if (name.empty()) {
  respond_error(res, 400, "name is required");
}

res.status(201).json({"ok", true});

// Correct
if (name.empty()) {
  respond_error(res, 400, "name is required");
  return;
}

res.status(201).json({"ok", true});
```

### Trusting JSON body without checking shape

```cpp
// Better
if (!body.is_object()) {
  respond_error(res, 400, "expected JSON object");
  return;
}
```

## What you should remember

**Request** is the input: params, query, headers, body, json.
**Response** is the output: status, headers, text, json, file.

The core route flow: read Request → validate input → write Response → return.

## Next chapter

[Next: JSON API](/book/10-json-api)
