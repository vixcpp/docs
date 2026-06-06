# Authentication

The `auth` group contains middleware for authentication, authorization, and sessions.

It provides small HTTP building blocks: API key checks, JWT validation, RBAC context creation, role and permission guards, and signed cookie sessions.

For most application code, include:

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>
```

The authentication middleware lives under:

```cpp
namespace vix::middleware::auth
```

When using `vix::App`, prefer the helpers under:

```cpp
namespace vix::middleware::app
```

## What authentication provides

The auth group includes:

```txt
api_key()
  checks an API key from a header, query parameter, or custom extractor

jwt()
  validates a Bearer JWT and stores its claims

rbac_context()
  builds an authorization context from JWT claims

require_role()
  requires one role

require_any_role()
  requires at least one role from a list

require_perm()
  requires one permission

require_any_perm()
  requires at least one permission from a list

require_all_perms()
  requires all permissions from a list

session()
  loads or creates a signed cookie session
```

The module separates authentication from authorization.

Authentication answers:

```txt
Who is making the request?
```

Authorization answers:

```txt
Is this request allowed to do this action?
```

## Basic API key protection

API key authentication is the simplest auth middleware.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  vix::middleware::app::protect_prefix(
    app,
    "/admin",
    vix::middleware::app::api_key_auth("secret")
  );

  app.get("/admin/status", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.json({
      "admin", true
    });
  });

  app.run(8080);

  return 0;
}
```

Request:

```bash
curl -i \
  http://127.0.0.1:8080/admin/status \
  -H "x-api-key: secret"
```

If the key is missing, the middleware returns:

```txt
401 missing_api_key
```

If the key is present but invalid, it returns:

```txt
403 invalid_api_key
```

## API key request state

When the API key is accepted, the middleware stores this state:

```cpp
vix::middleware::auth::ApiKey
```

A handler can read it:

```cpp
app.get("/admin/status", [](vix::Request &req, vix::Response &res)
{
  auto &key = req.state<vix::middleware::auth::ApiKey>();

  res.json({
    "authenticated", true,
    "key_size", key.value.size()
  });
});
```

Do not return real API keys to clients in normal applications. This example only shows how the state is accessed.

## Configure API key middleware

Use `ApiKeyOptions` when you need explicit control.

```cpp
vix::middleware::auth::ApiKeyOptions opt;

opt.header = "x-api-key";
opt.required = true;
opt.allowed_keys.insert("secret");

auto mw = vix::middleware::auth::api_key(opt);
```

Main options:

```txt
header
  header used to read the API key

query_param
  optional query parameter used to read the API key

required
  reject the request when the key is missing

allowed_keys
  accepted static keys

extract
  custom function used to extract the key

validate
  custom function used to validate the key
```

For simple internal tools, `allowed_keys` can be enough. For real systems, prefer a validation function backed by your own storage or secret management.

## Custom API key validation

```cpp
vix::middleware::auth::ApiKeyOptions opt;

opt.header = "x-api-key";

opt.validate = [](const std::string &key)
{
  return key == "secret";
};

auto mw = vix::middleware::auth::api_key(opt);
```

The middleware only checks the key. The application decides where valid keys come from.

## JWT authentication

`jwt()` validates a Bearer token from the `Authorization` header.

The expected request shape is:

```txt
Authorization: Bearer <token>
```

When the token is valid, the middleware stores:

```cpp
vix::middleware::auth::JwtClaims
```

in request state.

## Use JWT with App

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use("/api", vix::middleware::app::jwt_auth("dev_secret"));

  app.get("/api/me", [](vix::Request &req, vix::Response &res)
  {
    auto &claims = req.state<vix::middleware::auth::JwtClaims>();

    res.json({
      "subject", claims.subject
    });
  });

  app.run(8080);

  return 0;
}
```

Request:

```bash
curl -i \
  http://127.0.0.1:8080/api/me \
  -H "Authorization: Bearer <token>"
```

If the token is missing or invalid, the handler is not called.

## JWT claims

`JwtClaims` contains the decoded information the middleware exposes to the request.

Common fields include:

```txt
subject
  the token subject, usually from sub

roles
  roles extracted from token payload when present

payload
  decoded JSON payload
```

A handler can read the subject:

```cpp
auto &claims = req.state<vix::middleware::auth::JwtClaims>();

res.json({
  "subject", claims.subject
});
```

It can also inspect the payload when needed:

```cpp
auto &claims = req.state<vix::middleware::auth::JwtClaims>();

if (claims.payload.contains("email"))
{
  const std::string email = claims.payload["email"].get<std::string>();
}
```

Keep handlers simple. For larger applications, transform claims into your own user model in your application layer.

## Configure JWT

Use `JwtOptions` when you need explicit validation settings.

```cpp
vix::middleware::auth::JwtOptions opt;

opt.secret = "dev_secret";
opt.verify_exp = true;
opt.issuer = "https://auth.example.com";
opt.audience = "api";

auto mw = vix::middleware::auth::jwt(opt);
```

Common options include:

```txt
secret
  HMAC secret used to verify the token

verify_exp
  verify expiration when exp is present

issuer
  expected issuer when configured

audience
  expected audience when configured

required
  reject missing tokens when true

query_param
  optional query parameter token source
```

The current middleware is designed for HS256-style JWT validation. If your application uses another signing strategy, adapt validation at the application boundary or provide a dedicated middleware.

## Authorization with RBAC

RBAC means Role-Based Access Control.

In this module, RBAC is built in two steps.

First, authenticate the request and store JWT claims:

```txt
jwt()
```

Then build authorization state from those claims:

```txt
rbac_context()
```

After that, role and permission guards can check access:

```txt
require_role()
require_perm()
```

The order matters.

```txt
jwt
  -> rbac_context
  -> require_role / require_perm
  -> handler
```

## Require a role

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use("/admin", vix::middleware::app::jwt_auth("dev_secret"));
  app.use("/admin", vix::middleware::app::rbac());
  app.use("/admin", vix::middleware::app::require_role("admin"));

  app.get("/admin/status", [](vix::Request &req, vix::Response &res)
  {
    (void)req;

    res.json({
      "admin", true
    });
  });

  app.run(8080);

  return 0;
}
```

The JWT payload should contain a compatible role value, for example:

```json
{
  "sub": "user123",
  "roles": ["admin"]
}
```

If the role is missing, the middleware returns:

```txt
403 forbidden
```

## Require a permission

```cpp
app.use("/products", vix::middleware::app::jwt_auth("dev_secret"));
app.use("/products", vix::middleware::app::rbac());
app.use("/products", vix::middleware::app::require_perm("products:write"));
```

The JWT payload can contain permissions:

```json
{
  "sub": "user123",
  "perms": ["products:write", "orders:read"]
}
```

The middleware also understands permissions from a `scope` string when present.

Example:

```json
{
  "sub": "user123",
  "scope": "products:write orders:read"
}
```

## Authz request state

`rbac_context()` stores:

```cpp
vix::middleware::auth::Authz
```

`Authz` contains:

```txt
subject
roles
perms
```

A handler can inspect it:

```cpp
app.get("/api/me", [](vix::Request &req, vix::Response &res)
{
  auto &authz = req.state<vix::middleware::auth::Authz>();

  res.json({
    "subject", authz.subject,
    "is_admin", authz.has_role("admin")
  });
});
```

The role and permission helpers use the same `Authz` state internally.

## Permission resolver

`PermissionResolver` is an extension point.

It lets the application enrich roles or permissions after the JWT has been decoded.

This is useful when the token contains only the subject, and roles or permissions must come from your application storage.

```cpp
struct MyPermissionResolver : vix::middleware::auth::PermissionResolver
{
  void resolve(
      std::string_view subject,
      std::unordered_set<std::string> &roles,
      std::unordered_set<std::string> &perms) override
  {
    if (subject == "user123")
      roles.insert("admin");

    perms.insert("products:write");
  }
};
```

The middleware builds the initial `Authz` from JWT claims, then calls the resolver when one is available and enabled.

## Sessions

`session()` loads or creates a signed cookie session.

It exposes the session in request state as:

```cpp
vix::middleware::auth::Session
```

The session has:

```txt
id
data
is_new
dirty
destroyed
```

A handler can read and write session values.

```cpp
#include <vix.hpp>
#include <vix/middleware.hpp>

int main()
{
  vix::App app;

  app.use(vix::middleware::app::session_dev("dev_secret"));

  app.get("/counter", [](vix::Request &req, vix::Response &res)
  {
    auto &session = req.state<vix::middleware::auth::Session>();

    int count = 0;

    if (auto value = session.get("count"))
      count = std::stoi(*value);

    ++count;

    session.set("count", std::to_string(count));

    res.json({
      "count", count
    });
  });

  app.run(8080);

  return 0;
}
```

The middleware saves the session after the handler runs when the session is new or dirty.

## Session cookie

The session cookie stores a signed session id.

The cookie value has this shape:

```txt
sid.signature
```

The signature is used to detect tampering.

The session data itself is stored in the configured session store, not directly in the cookie.

## Configure sessions

Use `SessionOptions` for explicit session behavior.

```cpp
vix::middleware::auth::SessionOptions opt;

opt.secret = "dev_secret";
opt.cookie_name = "sid";
opt.cookie_path = "/";
opt.http_only = true;
opt.secure = false;
opt.same_site = "Lax";
opt.auto_create = true;

auto mw = vix::middleware::auth::session(opt);
```

Main options:

```txt
store
  session storage backend

secret
  secret used to sign the session id

cookie_name
  session cookie name

cookie_path
  cookie path

secure
  add Secure to the cookie

http_only
  add HttpOnly to the cookie

same_site
  SameSite cookie value

ttl
  session lifetime

auto_create
  create a session when none exists
```

`secret` is required. If it is missing, the middleware returns a configuration error.

## Session store

The session middleware uses an `ISessionStore`.

The default in-memory store is process-local.

It is useful for:

```txt
local development
tests
small examples
single-process applications
```

For durable or shared sessions, provide your own store.

```cpp
struct MySessionStore : vix::middleware::auth::ISessionStore
{
  std::optional<vix::middleware::auth::Session>
  load(const std::string &sid) override
  {
    return std::nullopt;
  }

  void save(
      const vix::middleware::auth::Session &session,
      std::chrono::seconds ttl) override
  {
    (void)session;
    (void)ttl;
  }

  void destroy(const std::string &sid) override
  {
    (void)sid;
  }
};
```

Then pass it through `SessionOptions`.

```cpp
vix::middleware::auth::SessionOptions opt;

opt.secret = "dev_secret";
opt.store = std::make_shared<MySessionStore>();

auto mw = vix::middleware::auth::session(opt);
```

## Destroy a session

A handler can destroy the current session.

```cpp
app.post("/logout", [](vix::Request &req, vix::Response &res)
{
  auto &session = req.state<vix::middleware::auth::Session>();

  session.destroy();

  res.json({
    "ok", true
  });
});
```

After the handler returns, the middleware removes the session from the store and expires the cookie.

## Authentication order

Order is important.

For API key authentication:

```txt
api_key
  -> handler
```

For JWT authentication:

```txt
jwt
  -> handler
```

For JWT plus RBAC:

```txt
jwt
  -> rbac_context
  -> require_role / require_perm
  -> handler
```

For sessions:

```txt
session
  -> handler reads or modifies Session
```

A middleware that needs state from another middleware must run after that state is created.

## Common errors

Authentication middleware can stop the request and return normalized errors.

Common responses include:

```txt
401 missing_api_key
  API key is required

403 invalid_api_key
  API key is present but invalid

401 invalid_token
  JWT is missing, malformed, expired, or has an invalid signature

401 missing_auth
  RBAC requires authentication but no JWT claims exist

401 missing_authz
  a role or permission guard ran before rbac_context

403 forbidden
  authenticated request does not have the required role or permission

500 session_misconfigured
  session store or secret is missing
```

The exact body follows the normalized middleware error format.

## Development and production

Development helpers are useful for local examples.

```cpp
app.use("/api", vix::middleware::app::jwt_auth("dev_secret"));
app.use(vix::middleware::app::session_dev("dev_secret"));
```

Production applications should configure authentication explicitly.

Important production decisions include:

```txt
where secrets come from
which JWT issuer is trusted
which JWT audience is expected
how expiration is handled
where sessions are stored
whether cookies use Secure
which SameSite policy is correct
how API keys are rotated
where permissions are resolved
```

The middleware provides HTTP authentication and authorization primitives. The application still owns identity, user management, secret storage, and business permissions.

## What this module does not decide

The auth group does not create users.

It does not store passwords.

It does not issue JWTs.

It does not manage OAuth flows.

It does not decide your business roles.

It does not replace database authorization checks.

It verifies request credentials, builds request auth state, and helps protect handlers.

## Summary

`api_key()` authenticates requests with a simple key.

`jwt()` validates Bearer JWTs and stores claims.

`rbac_context()` builds authorization state from claims.

`require_role()` and `require_perm()` enforce access rules.

`session()` provides signed cookie sessions with pluggable storage.

Use these pieces together only when the request flow needs them. Keep each route protected by the smallest middleware chain that makes sense.

## Next steps

Continue with:

- [Parsers](./parsers)
- [Security](./security)
- [HTTP Cache](./http-cache)
- [App Integration](./app-integration)
- [API Reference](./api-reference)
