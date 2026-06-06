# Parsers

The `parsers` group contains middleware for reading HTTP request bodies.

It provides small parsers for common body formats: JSON, URL-encoded forms, multipart metadata, and multipart file uploads.

For most application code, include:

```cpp id="o4dlml"
#include <vix.hpp>
#include <vix/middleware.hpp>
```

The parser middleware lives under:

```cpp id="ivpm3s"
namespace vix::middleware::parsers
```

When using `vix::App`, prefer the helpers under:

```cpp id="j74q6o"
namespace vix::middleware::app
```

## What parsers provides

The parsers group includes:

```txt id="ze65op"
json()
  parses application/json request bodies

form()
  parses application/x-www-form-urlencoded request bodies

multipart()
  validates multipart/form-data metadata and extracts boundary information

multipart_save()
  parses multipart/form-data, stores fields, and saves uploaded files
```

The parsers decode request bodies and store typed values in request state.

They do not validate your application fields. Validation remains part of the handler or validation layer.

## Basic idea

A parser middleware usually runs before the handler.

```txt id="vr1gyl"
request
  -> body_limit
  -> parser
  -> handler reads parsed state
```

The parser reads the raw request body, checks the content type when required, parses the body, then stores a typed value in request state.

A handler can then read that value:

```cpp id="yai276"
auto &body = req.state<vix::middleware::parsers::JsonBody>();
```

Use `state<T>()` when the parser is expected to have run.

Use `try_state<T>()` when the value may be missing.

## Use body limits before parsers

Parsers work on request bodies. It is usually better to reject oversized requests before parsing them.

```cpp id="pxqjpr"
app.use(vix::middleware::app::body_limit_dev());
app.use(vix::middleware::app::json_dev());
```

The body limit middleware can stop large requests early with `413 Payload Too Large`.

The parser then only receives bodies that passed the size policy.

## JSON parser

`json()` parses an `application/json` request body.

It stores the parsed value in request state as:

```cpp id="pae1w2"
vix::middleware::parsers::JsonBody
```

`JsonBody` contains:

```cpp id="dbu0m3"
nlohmann::json value;
```

Because Vix JSON uses `nlohmann::json` underneath, normal JSON operations work on the parsed value.

## Use JSON parser with App

```cpp id="mo6ngu"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::body_limit_dev());
  app.use(vix::middleware::app::json_dev());

  app.post("/api/echo", [](vix::Request &req, vix::Response &res)
  {
    auto &body = req.state<vix::middleware::parsers::JsonBody>();

    res.json({
      "received", body.value
    });
  });

  app.run(8080);

  return 0;
}
```

Request:

```bash id="t4bgvu"
curl -i \
  -X POST http://127.0.0.1:8080/api/echo \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada"}'
```

Response shape:

```json id="qj0c25"
{
  "received": {
    "name": "Ada"
  }
}
```

## Read JSON fields

The parser only parses the body. Your handler still decides which fields are needed.

```cpp id="ozi6kw"
app.post("/api/users", [](vix::Request &req, vix::Response &res)
{
  auto &body = req.state<vix::middleware::parsers::JsonBody>();

  const std::string name =
    body.value.value("name", "");

  if (name.empty())
  {
    res.status(422).json({
      "error", "Missing required field",
      "field", "name"
    });
    return;
  }

  res.status(201).json({
    "ok", true,
    "name", name
  });
});
```

For richer JSON work, use the `vix::json` module helpers in your handler.

The middleware parser decodes the HTTP body. The JSON module gives you general-purpose JSON helpers.

## JsonParserOptions

Use `JsonParserOptions` when you need explicit behavior.

```cpp id="hwxjxe"
vix::middleware::parsers::JsonParserOptions opt;

opt.require_content_type = true;
opt.allow_empty = true;
opt.max_bytes = 1024 * 1024;
opt.store_in_state = true;

auto mw = vix::middleware::parsers::json(opt);
```

Main options:

```txt id="qfb9ue"
require_content_type
  require Content-Type to start with application/json

allow_empty
  allow an empty body and store an empty object

max_bytes
  maximum body size for this parser, 0 means no parser-specific limit

store_in_state
  store JsonBody in request state
```

Use `body_limit()` for a global body size policy. Use `max_bytes` when the JSON parser itself needs its own limit.

## JSON parser errors

The JSON parser can stop the request and return a normalized error.

Common responses include:

```txt id="jgoxhc"
400 empty_body
  body is empty while allow_empty is false

400 invalid_json
  body could not be parsed as JSON

413 payload_too_large
  body exceeds max_bytes

415 unsupported_media_type
  Content-Type is not application/json
```

If parsing fails, the route handler is not called.

## Form parser

`form()` parses `application/x-www-form-urlencoded` request bodies.

It stores the parsed fields in request state as:

```cpp id="jmelwc"
vix::middleware::parsers::FormBody
```

`FormBody` contains:

```cpp id="mr447w"
std::unordered_map<std::string, std::string> fields;
```

The parser decodes common URL-encoded form behavior:

```txt id="qcsxty"
+ becomes space
%XX is decoded when valid
key=value pairs are split by &
```

## Use form parser with App

```cpp id="wt2dmd"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::body_limit_dev());
  app.use(vix::middleware::app::form_dev());

  app.post("/contact", [](vix::Request &req, vix::Response &res)
  {
    auto &form = req.state<vix::middleware::parsers::FormBody>();

    res.json({
      "name", form.fields["name"]
    });
  });

  app.run(8080);

  return 0;
}
```

Request:

```bash id="9wb3nt"
curl -i \
  -X POST http://127.0.0.1:8080/contact \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'name=Ada+Lovelace'
```

Response shape:

```json id="89q6oa"
{
  "name": "Ada Lovelace"
}
```

## Read form fields safely

A form field may be missing.

Use normal map lookup when you need to check presence.

```cpp id="6wm3yp"
app.post("/contact", [](vix::Request &req, vix::Response &res)
{
  auto &form = req.state<vix::middleware::parsers::FormBody>();

  auto it = form.fields.find("email");

  if (it == form.fields.end() || it->second.empty())
  {
    res.status(422).json({
      "error", "Missing required field",
      "field", "email"
    });
    return;
  }

  res.json({
    "email", it->second
  });
});
```

This keeps parsing separate from validation.

## FormParserOptions

Use `FormParserOptions` when you need explicit behavior.

```cpp id="we6v4s"
vix::middleware::parsers::FormParserOptions opt;

opt.require_content_type = true;
opt.max_bytes = 1024 * 64;
opt.store_in_state = true;

auto mw = vix::middleware::parsers::form(opt);
```

Main options:

```txt id="jsbr9s"
require_content_type
  require Content-Type to start with application/x-www-form-urlencoded

max_bytes
  maximum body size for this parser, 0 means no parser-specific limit

store_in_state
  store FormBody in request state
```

## Form parser errors

The form parser can return:

```txt id="5yqooc"
413 payload_too_large
  body exceeds max_bytes

415 unsupported_media_type
  Content-Type is not application/x-www-form-urlencoded
```

If parsing fails, the handler is not called.

## Multipart probe

`multipart()` validates multipart metadata.

It does not parse every part and it does not save uploaded files. It checks that the request is `multipart/form-data`, extracts the boundary, records the body size, and stores this information in request state.

It stores:

```cpp id="yxnwvg"
vix::middleware::parsers::MultipartInfo
```

`MultipartInfo` contains:

```txt id="m58ou3"
content_type
boundary
body_bytes
```

Use this middleware when you only need to verify that a request is multipart and inspect its boundary information.

## Use multipart metadata parser

```cpp id="zvms96"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::body_limit_dev());
  app.use(vix::middleware::app::multipart_dev());

  app.post("/upload-info", [](vix::Request &req, vix::Response &res)
  {
    auto &info = req.state<vix::middleware::parsers::MultipartInfo>();

    res.json({
      "boundary", info.boundary,
      "body_bytes", info.body_bytes
    });
  });

  app.run(8080);

  return 0;
}
```

This example shows the metadata flow. It does not save files.

## MultipartOptions

Use `MultipartOptions` when you need explicit behavior.

```cpp id="mtqpar"
vix::middleware::parsers::MultipartOptions opt;

opt.require_boundary = true;
opt.max_bytes = 1024 * 1024;
opt.store_in_state = true;

auto mw = vix::middleware::parsers::multipart(opt);
```

Main options:

```txt id="24p9kp"
require_boundary
  reject multipart/form-data without a boundary

max_bytes
  maximum body size for this parser, 0 means no parser-specific limit

store_in_state
  store MultipartInfo in request state
```

## Multipart metadata errors

The multipart metadata parser can return:

```txt id="hmaoj4"
400 missing_boundary
  multipart/form-data boundary is missing

413 payload_too_large
  body exceeds max_bytes

415 unsupported_media_type
  Content-Type is not multipart/form-data
```

If the request is invalid, the handler is not called.

## Multipart file upload

`multipart_save()` parses multipart form data, stores text fields, saves uploaded files, and exposes the result in request state.

It stores:

```cpp id="l3868o"
vix::middleware::parsers::MultipartForm
```

A multipart form can contain:

```txt id="td09z7"
fields
  text fields from the form

files
  uploaded files saved to disk
```

Use `multipart_save()` when the application needs to accept uploaded files.

## Use multipart_save

```cpp id="2tj9c2"
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::multipart_save_dev("uploads"));

  app.post("/upload", [](vix::Request &req, vix::Response &res)
  {
    auto &form = req.state<vix::middleware::parsers::MultipartForm>();

    res.json({
      "fields", form.fields.size(),
      "files", form.files.size()
    });
  });

  app.run(8080);

  return 0;
}
```

Request shape:

```bash id="0utb3x"
curl -i \
  -X POST http://127.0.0.1:8080/upload \
  -F 'title=hello' \
  -F 'file=@hello.txt'
```

Response shape:

```json id="5ce4m2"
{
  "fields": 1,
  "files": 1
}
```

## Read uploaded file metadata

A saved file entry contains information such as the field name, original filename, content type, size, and saved path.

```cpp id="qwqx2v"
app.post("/upload", [](vix::Request &req, vix::Response &res)
{
  auto &form = req.state<vix::middleware::parsers::MultipartForm>();

  if (form.files.empty())
  {
    res.status(400).json({
      "error", "No file uploaded"
    });
    return;
  }

  const auto &file = form.files.front();

  res.json({
    "field", file.field_name,
    "filename", file.filename,
    "content_type", file.content_type,
    "bytes", file.bytes,
    "saved_path", file.saved_path
  });
});
```

This is still only metadata. The application decides what to do with the saved file.

## Configure multipart_save

Use `MultipartSaveOptions` when you need explicit upload behavior.

```cpp id="hbr1bj"
vix::middleware::parsers::MultipartSaveOptions opt;

opt.max_bytes = 10 * 1024 * 1024;
opt.max_files = 4;
opt.max_file_bytes = 5 * 1024 * 1024;
opt.upload_dir = "uploads";
opt.create_upload_dir = true;
opt.keep_original_filename = false;
opt.keep_extension = true;
opt.store_in_state = true;

auto mw = vix::middleware::parsers::multipart_save(opt);
```

Common options:

```txt id="9lvrc1"
max_bytes
  maximum total request body size

max_files
  maximum number of files accepted

max_file_bytes
  maximum size for one uploaded file

upload_dir
  directory where uploaded files are saved

create_upload_dir
  create the upload directory when missing

keep_original_filename
  preserve the original filename when saving

keep_extension
  preserve the file extension when generating saved names

store_in_state
  store MultipartForm in request state
```

Keep original filenames only when that is safe for your application. Generated names are usually safer for public uploads.

## File upload responsibilities

`multipart_save()` parses and saves files. It does not decide your file policy.

Your application should still decide:

```txt id="erx079"
which file types are allowed
which file size is acceptable
where files should be stored long-term
whether files should be scanned
whether the filename should be trusted
who is allowed to upload
when temporary files should be deleted
```

The middleware handles the HTTP multipart mechanics. The application owns the upload policy.

## Parser order

A practical order for body parsing is:

```txt id="uo1jlc"
body_limit
  -> parser
  -> authentication or handler
```

For authenticated uploads, the order can depend on your policy.

If you want to reject unauthenticated requests before reading the body:

```txt id="fpm8we"
authentication
  -> body_limit
  -> multipart_save
  -> handler
```

If you want to reject oversized requests before any auth work:

```txt id="jkmeuv"
body_limit
  -> authentication
  -> multipart_save
  -> handler
```

Both are valid depending on the application. The important rule is to make the order intentional.

## Do not install incompatible parsers globally

A route that receives JSON should not be forced through the form parser.

A route that receives multipart uploads should not be forced through the JSON parser.

Use prefixes or route-specific installation when different areas of the application accept different body types.

```cpp id="2u8ky2"
app.use("/api/json", vix::middleware::app::json_dev());
app.use("/upload", vix::middleware::app::multipart_save_dev("uploads"));
```

This keeps parser behavior predictable.

## Content-Type matters

By default, the parsers check `Content-Type`.

```txt id="47j1y7"
json()
  expects application/json

form()
  expects application/x-www-form-urlencoded

multipart()
  expects multipart/form-data

multipart_save()
  expects multipart/form-data
```

This is usually what you want.

If a parser returns `415 unsupported_media_type`, check the request `Content-Type` header.

## Empty bodies

The JSON parser can allow an empty body.

When `allow_empty` is true, it can store an empty JSON object.

```cpp id="cppbya"
vix::middleware::parsers::JsonParserOptions opt;

opt.allow_empty = true;
```

If `allow_empty` is false, an empty body returns:

```txt id="p1g1wl"
400 empty_body
```

Form and multipart requests usually need a meaningful body.

## App helpers and low-level middleware

The app helpers are convenient for normal applications:

```cpp id="nhs97m"
app.use(vix::middleware::app::json_dev());
app.use(vix::middleware::app::form_dev());
app.use(vix::middleware::app::multipart_dev());
app.use(vix::middleware::app::multipart_save_dev("uploads"));
```

The low-level functions are useful when you need custom options:

```cpp id="kkhm99"
auto mw = vix::middleware::parsers::json({
  .max_bytes = 1024 * 1024
});
```

When a low-level parser returns a `MiddlewareFn`, adapt it for `vix::App` if needed:

```cpp id="e7dxfg"
app.use(vix::middleware::app::adapt_ctx(
  vix::middleware::parsers::json({
    .max_bytes = 1024 * 1024
  })
));
```

## Common parser errors

Parsers can stop the request and return normalized errors.

Common responses include:

```txt id="gtvxe2"
400 empty_body
  JSON body is required

400 invalid_json
  JSON parsing failed

400 missing_boundary
  multipart boundary is missing

413 payload_too_large
  request body exceeds parser limit

415 unsupported_media_type
  Content-Type does not match the parser
```

The route handler is not called when a parser returns an error.

## Development and production

Development helpers are useful for local examples.

```cpp id="omlc7c"
app.use(vix::middleware::app::json_dev());
app.use(vix::middleware::app::form_dev());
app.use(vix::middleware::app::multipart_save_dev("uploads"));
```

Production applications should configure parser limits explicitly.

Important production decisions include:

```txt id="tcz7m0"
maximum body size
maximum upload size
maximum number of files
upload directory
filename policy
whether content type is required
whether empty JSON bodies are allowed
```

The parser decodes the request. The application still owns validation and data policy.

## What this module does not do

The parsers group does not validate business fields.

It does not sanitize uploaded content.

It does not scan files.

It does not store uploads in a database.

It does not decide which users can upload.

It does not replace the JSON module.

It gives handlers a clean parsed representation of the request body.

## Summary

`json()` parses JSON bodies and stores `JsonBody`.

`form()` parses URL-encoded forms and stores `FormBody`.

`multipart()` validates multipart metadata and stores `MultipartInfo`.

`multipart_save()` parses multipart form data, saves files, and stores `MultipartForm`.

Use body limits before parsers, install parsers only where they apply, and keep validation in your application layer.

## Next steps

Continue with:

- [Performance](./performance)
- [Authentication](./authentication)
- [Security](./security)
- [App Integration](./app-integration)
- [API Reference](./api-reference)
