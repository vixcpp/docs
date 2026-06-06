# API Reference

This page summarizes the public API surface of the Vix middleware module.

It is a reference page. It does not replace the guide pages. Use it when you need to find the right namespace, type, option struct, middleware function, or integration helper.

For most application code, include:

```cpp id="ccyijw"
#include <vix.hpp>
#include <vix/middleware.hpp>
```

The middleware module is exposed mainly through:

```cpp id="ak9g2s"
namespace vix::middleware
```

Feature groups live under sub-namespaces such as:

```cpp id="trua8d"
vix::middleware::basics
vix::middleware::security
vix::middleware::auth
vix::middleware::parsers
vix::middleware::performance
vix::middleware::observability
vix::middleware::cookies
vix::middleware::app
vix::middleware::utils
```

## Public headers

Normal application code should include:

```cpp id="r8j0de"
#include <vix/middleware.hpp>
```

or the full Vix header:

```cpp id="vf3wpx"
#include <vix.hpp>
```

The internal aggregation header exists, but it is not the preferred public include for applications:

```cpp id="pftg8q"
#include <vix/middleware/all.hpp>
```

Prefer the public module header.

## Core aliases

The middleware module exposes aliases for the HTTP request and response types used by Core.

```cpp id="o44kpf"
namespace vix::middleware
{
  using Request = vix::http::Request;
  using Response = vix::http::ResponseWrapper;
}
```

Common middleware types:

```cpp id="e09zcf"
using NextFn = vix::mw::NextFn;
using Next = vix::mw::Next;
using NextOnce = vix::mw::NextOnce;

using Error = vix::mw::Error;
using Services = vix::mw::Services;
using Context = vix::mw::Context;

using MiddlewareFn =
  std::function<void(Context &, Next)>;

using HttpMiddleware =
  std::function<void(Request &, Response &, Next)>;
```

`MiddlewareFn` is the context-based middleware type.

`HttpMiddleware` is the legacy HTTP middleware type.

## Core helpers

```cpp id="jp54wn"
MiddlewareFn from_http_middleware(HttpMiddleware legacy);
HttpMiddleware to_http_middleware(MiddlewareFn mw, Services &services);

MiddlewareFn noop();
MiddlewareFn use_if(bool enabled, MiddlewareFn mw);
```

`from_http_middleware()` adapts a legacy HTTP middleware into a context-based middleware.

`to_http_middleware()` adapts a context-based middleware into a legacy HTTP middleware.

`noop()` returns a middleware that only calls `next()`.

`use_if()` returns the provided middleware when enabled, otherwise returns `noop()`.

## Errors and results

The middleware module re-exports common result and error helpers from `vix::mw`.

```cpp id="bqkx8t"
ok(...)
fail(...)
bad_request(...)
unauthorized(...)
forbidden(...)
not_found(...)
conflict(...)
internal(...)
normalize(...)
to_json(...)
```

These helpers are used by middleware that returns normalized JSON errors.

A typical middleware error uses:

```cpp id="ejp8od"
vix::middleware::Error err;

err.status = 401;
err.code = "unauthorized";
err.message = "Missing token";
err.details["hint"] = "Use Authorization header";

ctx.send_error(vix::middleware::normalize(std::move(err)));
```

## HttpPipeline

`HttpPipeline` runs a list of middleware functions and an optional final handler.

```cpp id="bvv7e7"
class HttpPipeline
{
public:
  using Final = std::function<void(Request &, Response &)>;

  Services &services() noexcept;
  const Services &services() const noexcept;

  Hooks &hooks() noexcept;
  const Hooks &hooks() const noexcept;

  HttpPipeline &set_hooks(Hooks h);

  HttpPipeline &enable_dev_observability(bool only_if_dev_env = true);

  HttpPipeline &enable_dev_observability(
    DevObservabilitySinks sinks,
    bool only_if_dev_env = true);

  HttpPipeline &use(HttpMiddleware legacy);
  HttpPipeline &use(MiddlewareFn mw);

  std::size_t size() const noexcept;
  void clear();

  void run(Request &req, Response &res, Final final_handler) const;
  void run(Request &req, Response &res) const;
};
```

`HttpPipeline` is useful for custom middleware stacks, tests, and low-level integrations.

Most normal applications use `vix::App` with the helpers in `vix::middleware::app`.

## Pipeline wrapping

```cpp id="7xsgxo"
template <typename Handler>
auto wrap(Handler handler, HttpPipeline pipeline);
```

`wrap()` wraps a final handler with a middleware pipeline and returns a callable that accepts `Request` and `Response`.

## Hooks

`Hooks` comes from `vix::mw`.

Common hook fields are:

```cpp id="zuyxgd"
on_begin
on_end
on_error
```

Hooks can be merged with:

```cpp id="1grct0"
merge_hooks(a, b)
```

Merged begin hooks run in merge order.

Merged end hooks run in wrapping order after the request work has completed.

## PeriodicTask

`PeriodicTask` runs a job at a fixed interval and dispatches the job through an executor.

```cpp id="s7mhg9"
class PeriodicTask final
{
public:
  using Clock = std::chrono::steady_clock;

  PeriodicTask(
    vix::executor::IExecutor &ex,
    std::chrono::milliseconds interval,
    std::function<void()> job,
    vix::executor::TaskOptions opt = {});

  ~PeriodicTask();

  void start();
  void stop();

  bool is_running() const noexcept;
};
```

It is useful for maintenance jobs such as periodic cleanup, cache pruning, or metrics flushing.

## Static directory bridge

```cpp id="penrox"
void register_static_dir();
```

`register_static_dir()` registers the middleware static response hook on `vix::App`.

Static files are still served by Core through:

```cpp id="odsegx"
app.static_dir("public", "/");
```

The middleware module only provides the optional compression hook.

## Basics namespace

Basics live under:

```cpp id="xnpss4"
namespace vix::middleware::basics
```

The basics group provides request body limits, request ids, timing, request logging, and exception recovery.

## body_limit

```cpp id="4u4owo"
struct BodyLimitOptions
{
  std::size_t max_bytes{1 * 1024 * 1024};
  bool apply_to_get{false};
  bool allow_chunked{true};

  std::function<bool(const vix::middleware::Context &)> should_apply{};
};

MiddlewareFn body_limit(BodyLimitOptions opt = {});
```

Behavior:

```txt id="kk3m18"
rejects oversized request bodies with 413
skips GET by default
can require Content-Length when allow_chunked is false
can use should_apply for custom matching
```

Common errors:

```txt id="ef3kw0"
413 payload_too_large
411 length_required
```

## request_id

```cpp id="3p2ug4"
struct RequestId
{
  std::string value;
};

struct RequestIdOptions
{
  std::string header_name{"x-request-id"};
  bool accept_incoming{true};
  bool generate_if_missing{true};
  bool always_set_response_header{true};
};

MiddlewareFn request_id(RequestIdOptions opt = {});
```

Behavior:

```txt id="w4h8jr"
accepts a reasonable incoming request id
generates one when missing
stores RequestId in request state
sets the response header when configured
```

Helper functions:

```cpp id="o6hkor"
bool is_reasonable_request_id(std::string_view s);
std::string generate_request_id();
```

## timing

```cpp id="u9xlqw"
struct Timing
{
  std::int64_t total_ms{0};
};

struct TimingOptions
{
  bool set_x_response_time{true};
  bool set_server_timing{true};

  std::string x_response_time_header{"x-response-time"};
  std::string server_timing_header{"server-timing"};
  std::string server_timing_metric{"total"};

  bool store_in_state{true};
};

MiddlewareFn timing(TimingOptions opt = {});
```

Behavior:

```txt id="lg2ifo"
measures downstream request processing time
stores Timing in request state
can set X-Response-Time
can set Server-Timing
```

## logger

```cpp id="how3ne"
struct ILogger
{
  virtual ~ILogger() = default;
  virtual void info(std::string_view msg) = 0;
  virtual void warn(std::string_view msg) = 0;
  virtual void error(std::string_view msg) = 0;
};

enum class LogFormat
{
  Text,
  Json
};

struct LoggerOptions final
{
  LogFormat format{LogFormat::Text};
  bool log_request_id{true};
  bool log_timing{true};
  bool level_from_status{true};
  bool include_user_agent{false};
  bool include_forwarded_for{false};
  bool require_timing{false};
};

MiddlewareFn logger(LoggerOptions opt = {});
```

Behavior:

```txt id="f2c7mo"
logs one summary line after downstream handling
uses ILogger from Services
can output text or JSON
can choose log level from response status
```

Status mapping when `level_from_status` is true:

```txt id="xlmf76"
status >= 500 -> error
status >= 400 -> warn
otherwise     -> info
```

## recovery

```cpp id="5nq9u6"
struct RecoveryOptions final
{
  bool include_exception_message{false};
  bool include_code_location{false};
  std::string code{"internal_server_error"};
  std::string message{"Internal Server Error"};
};

struct IRecoveryLogger
{
  virtual ~IRecoveryLogger() = default;
  virtual void error(std::string_view msg) = 0;
};

MiddlewareFn recovery(RecoveryOptions opt = {});
```

Behavior:

```txt id="h5mxfq"
catches exceptions thrown by downstream middleware or handlers
logs through IRecoveryLogger when available
returns a normalized 500 error
can include exception details in development
```

Common error:

```txt id="7jrjbh"
500 internal_server_error
```

## Authentication namespace

Authentication lives under:

```cpp id="0ozacs"
namespace vix::middleware::auth
```

It provides API keys, JWT, RBAC, and sessions.

## api_key

```cpp id="nnb5zy"
struct ApiKey
{
  std::string value;
};

struct ApiKeyOptions
{
  std::string header{"x-api-key"};
  std::string query_param{};
  bool required{true};

  std::unordered_set<std::string> allowed_keys{};

  std::function<std::string(const vix::middleware::Request &)> extract{};
  std::function<bool(const std::string &)> validate{};
};

MiddlewareFn api_key(ApiKeyOptions opt = {});
```

Behavior:

```txt id="u4mby4"
extracts an API key from a header, query parameter, or custom extractor
validates using allowed_keys and/or validate
stores ApiKey in request state on success
```

Common errors:

```txt id="n57imc"
401 missing_api_key
403 invalid_api_key
```

## jwt

JWT support lives in:

```cpp id="bfc8ab"
#include <vix/middleware/auth/jwt.hpp>
```

Common public types:

```cpp id="qgokmj"
struct JwtClaims;
struct JwtOptions;

MiddlewareFn jwt(JwtOptions opt = {});
```

Typical behavior:

```txt id="t4xnt3"
reads Bearer token from Authorization
validates the token
stores JwtClaims in request state
rejects missing or invalid tokens when required
```

Common request shape:

```txt id="rxvqtj"
Authorization: Bearer <token>
```

Common error:

```txt id="j5pr76"
401 invalid_token
```

## RBAC

```cpp id="pbq47o"
struct Authz final
{
  std::string subject;
  std::unordered_set<std::string> roles;
  std::unordered_set<std::string> perms;

  bool has_role(std::string_view r) const;
  bool has_perm(std::string_view p) const;
};

struct PermissionResolver
{
  virtual ~PermissionResolver() = default;

  virtual void resolve(
    std::string_view subject,
    std::unordered_set<std::string> &roles_inout,
    std::unordered_set<std::string> &perms_inout) = 0;
};

struct RbacOptions
{
  std::string roles_key{"roles"};
  std::string perms_key{"perms"};
  bool require_auth{true};
  bool use_resolver{true};
};
```

RBAC middleware:

```cpp id="mp72e1"
MiddlewareFn rbac_context(RbacOptions opt = {});

MiddlewareFn require_role(std::string role);
MiddlewareFn require_any_role(std::vector<std::string> roles);

MiddlewareFn require_perm(std::string perm);
MiddlewareFn require_any_perm(std::vector<std::string> perms);
MiddlewareFn require_all_perms(std::vector<std::string> perms);
```

Expected order:

```txt id="yb4ruq"
jwt
  -> rbac_context
  -> require_role / require_perm
  -> handler
```

Common errors:

```txt id="46l2o3"
401 missing_auth
401 missing_authz
403 forbidden
```

## session

```cpp id="h6qfkh"
struct Session
{
  std::string id;
  std::unordered_map<std::string, std::string> data;

  bool is_new{false};
  bool dirty{false};
  bool destroyed{false};

  void set(std::string k, std::string v);
  std::optional<std::string> get(const std::string &k) const;
  void erase(const std::string &k);
  void destroy();
};
```

Session storage interface:

```cpp id="iz3boo"
class ISessionStore
{
public:
  virtual ~ISessionStore() = default;

  virtual std::optional<Session> load(const std::string &sid) = 0;
  virtual void save(const Session &s, std::chrono::seconds ttl) = 0;
  virtual void destroy(const std::string &sid) = 0;
};
```

Built-in store:

```cpp id="jieww9"
class InMemorySessionStore final : public ISessionStore;
```

Options:

```cpp id="c3z0cy"
struct SessionOptions
{
  std::shared_ptr<ISessionStore> store{};

  std::string secret;
  std::string cookie_name{"sid"};
  std::string cookie_path{"/"};

  bool secure{false};
  bool http_only{true};
  std::string same_site{"Lax"};

  std::chrono::seconds ttl{std::chrono::hours(24 * 7)};
  bool auto_create{true};
};

MiddlewareFn session(SessionOptions opt);
```

Behavior:

```txt id="70jep8"
loads a session from a signed cookie
creates a session when auto_create is true
stores Session in request state
saves dirty or new sessions after handler execution
destroys session and expires cookie when Session::destroy() is called
```

Common error:

```txt id="zbz2xi"
500 session_misconfigured
```

## Cookies namespace

Cookie helpers live under:

```cpp id="v5jsls"
namespace vix::middleware::cookies
```

Types and functions:

```cpp id="b535qs"
struct Cookie
{
  std::string name;
  std::string value;

  std::string path{"/"};
  std::string domain{};
  int max_age{-1};
  bool http_only{true};
  bool secure{false};
  std::string same_site{"Lax"};
};

std::unordered_map<std::string, std::string>
parse(const vix::middleware::Request &req);

std::optional<std::string>
get(const vix::middleware::Request &req, std::string_view name);

std::string build_set_cookie_value(const Cookie &c);

void set(vix::middleware::Response &res, const Cookie &c);
```

Current response headers use a single header value per key, so repeated `Set-Cookie` values are not preserved by this helper.

## Security namespace

Security middleware lives under:

```cpp id="ql7rp3"
namespace vix::middleware::security
```

It provides CORS, CSRF, security headers, IP filtering, and rate limiting.

## cors

```cpp id="6unfc5"
struct CorsOptions
{
  std::vector<std::string> allowed_origins{};
  bool allow_any_origin{true};
  bool allow_credentials{false};

  std::vector<std::string> allow_methods{
    "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
  };

  std::vector<std::string> allow_headers{
    "Content-Type", "Authorization"
  };

  std::vector<std::string> expose_headers{};
  int max_age_seconds{600};
  bool vary_origin{true};
};

MiddlewareFn cors(CorsOptions opt = CorsOptions());
```

Behavior:

```txt id="3rbjs8"
handles CORS preflight requests
sets CORS response headers for allowed origins
returns 204 for accepted preflight
returns 403 for rejected preflight origin
```

Common error:

```txt id="tkphhp"
403 cors_forbidden
```

## csrf

```cpp id="60j219"
struct CsrfOptions
{
  std::string cookie_name{"csrf_token"};
  std::string header_name{"x-csrf-token"};
  bool protect_get{false};
};

MiddlewareFn csrf(CsrfOptions opt = {});
```

Behavior:

```txt id="bxgsa8"
protects POST, PUT, PATCH, DELETE by default
checks token in cookie and header
requires both tokens to match
```

Common error:

```txt id="qxivuj"
403 csrf_failed
```

## headers

```cpp id="dk7up1"
struct SecurityHeadersOptions
{
  bool x_content_type_options{true};
  bool x_frame_options{true};
  bool x_xss_protection{false};

  bool referrer_policy{true};
  bool permissions_policy{true};

  bool hsts{false};
  int hsts_max_age{31536000};
  bool hsts_include_subdomains{true};
  bool hsts_preload{false};

  std::string content_security_policy{};
};

MiddlewareFn headers(SecurityHeadersOptions opt = {});
```

Behavior:

```txt id="3cl26u"
adds browser security headers after downstream handling
can add CSP
can add HSTS when explicitly enabled
```

Common headers:

```txt id="liqkqp"
X-Content-Type-Options
X-Frame-Options
Referrer-Policy
Permissions-Policy
Content-Security-Policy
Strict-Transport-Security
```

## ip_filter

```cpp id="6r7g6c"
struct IpFilterOptions
{
  std::vector<std::string> allow{};
  std::vector<std::string> deny{};

  std::string header_name{"x-forwarded-for"};
  bool use_remote_addr_fallback{true};
};

MiddlewareFn ip_filter(IpFilterOptions opt = {});
```

Behavior:

```txt id="tyf37b"
extracts client IP from configured header
checks deny list first
checks allow list when non-empty
```

Common errors:

```txt id="3d7a7h"
403 ip_denied
403 ip_not_allowed
```

## rate_limit

```cpp id="ctwryn"
struct RateLimitOptions
{
  double capacity{60.0};
  double refill_per_sec{1.0};

  bool add_headers{true};

  std::string key_header{"x-forwarded-for"};

  std::function<std::string(const vix::middleware::Request &)> key_fn{};
};

struct RateLimiterState
{
  std::mutex mu;

  std::unordered_map<
    std::string,
    std::unique_ptr<vix::middleware::utils::TokenBucket>
  > buckets;
};

MiddlewareFn rate_limit(RateLimitOptions opt = {});
```

Behavior:

```txt id="qisggm"
uses one token bucket per client key
consumes one token per request
returns 429 when no token is available
uses RateLimiterState from Services when provided
otherwise uses fallback global state
```

Common headers:

```txt id="lu3qv1"
X-RateLimit-Limit
X-RateLimit-Remaining
Retry-After
X-RateLimit-Reset
```

Common error:

```txt id="h938ox"
429 rate_limited
```

## Parsers namespace

Parsers live under:

```cpp id="7fp57e"
namespace vix::middleware::parsers
```

They parse request bodies and store typed values in request state.

## json parser

```cpp id="ijfbq0"
struct JsonBody
{
  nlohmann::json value{};
};

struct JsonParserOptions
{
  bool require_content_type{true};
  bool allow_empty{true};
  std::size_t max_bytes{0};
  bool store_in_state{true};
};

MiddlewareFn json(JsonParserOptions opt = {});
```

Behavior:

```txt id="w970th"
parses application/json
stores JsonBody in request state
can allow empty body as an empty object
```

Common errors:

```txt id="kuzjcz"
400 empty_body
400 invalid_json
413 payload_too_large
415 unsupported_media_type
```

## form parser

```cpp id="4c8rwk"
struct FormBody
{
  std::unordered_map<std::string, std::string> fields{};
};

struct FormParserOptions
{
  bool require_content_type{true};
  std::size_t max_bytes{0};
  bool store_in_state{true};
};

MiddlewareFn form(FormParserOptions opt = {});
```

Behavior:

```txt id="7ln85z"
parses application/x-www-form-urlencoded
decodes + as space
decodes valid %XX sequences
stores FormBody in request state
```

Common errors:

```txt id="5ngl0y"
413 payload_too_large
415 unsupported_media_type
```

## multipart probe

```cpp id="e7s0io"
struct MultipartInfo
{
  std::string content_type{};
  std::string boundary{};
  std::size_t body_bytes{0};
};

struct MultipartOptions
{
  bool require_boundary{true};
  std::size_t max_bytes{0};
  bool store_in_state{true};
};

MiddlewareFn multipart(MultipartOptions opt = {});
```

Behavior:

```txt id="hblksc"
validates multipart/form-data
extracts boundary
stores MultipartInfo in request state
does not parse or save parts
```

Common errors:

```txt id="uoa6hj"
400 missing_boundary
413 payload_too_large
415 unsupported_media_type
```

## multipart_save

Multipart save support lives in:

```cpp id="jkkuhn"
#include <vix/middleware/parsers/multipart_save.hpp>
```

Common public types:

```cpp id="mc1cyc"
struct MultipartFile;
struct MultipartForm;
struct MultipartSaveOptions;

MiddlewareFn multipart_save(MultipartSaveOptions opt = {});
```

Typical behavior:

```txt id="1czjez"
parses multipart/form-data
stores text fields
saves uploaded files to disk
stores MultipartForm in request state
```

Common option categories:

```txt id="zq8iyx"
max_bytes
max_files
max_file_bytes
upload_dir
create_upload_dir
keep_original_filename
keep_extension
store_in_state
```

## Performance namespace

Performance middleware lives under:

```cpp id="0iq8e1"
namespace vix::middleware::performance
```

It provides response compression, ETag support, and static response compression hooks.

## compression

Compression support lives in:

```cpp id="58uay8"
#include <vix/middleware/performance/compression.hpp>
```

Common public types and functions:

```cpp id="6nqih1"
struct CompressionOptions;

MiddlewareFn compression(CompressionOptions opt = {});
```

Typical behavior:

```txt id="wvvavi"
checks Accept-Encoding
skips non-compressible responses
skips already encoded responses
adds Vary: Accept-Encoding when configured
applies gzip when build support is available
```

Common headers:

```txt id="03mp8d"
Content-Encoding
Vary
X-Vix-Compression
```

Debug diagnostic headers are not a stable public protocol.

## etag

```cpp id="myh7m7"
struct EtagOptions
{
  bool weak{true};
  bool add_cache_control_if_missing{false};
  std::string cache_control{"public, max-age=0"};
  std::size_t min_body_size{1};
};

MiddlewareFn etag(EtagOptions opt = {});
```

Behavior:

```txt id="sc0bp4"
applies to GET and HEAD
generates an ETag from the response body
can return 304 when If-None-Match matches
can add Cache-Control when missing
```

Common headers:

```txt id="midl3m"
ETag
If-None-Match
Cache-Control
```

## static compression

```cpp id="pbioyh"
std::string static_accept_encoding(const vix::http::Request &req);

bool static_response_can_compress(
  const vix::http::Request &req,
  const vix::http::ResponseWrapper &res,
  std::size_t minSize);

void compress_static_response(
  const vix::http::Request &req,
  vix::http::ResponseWrapper &res,
  const CompressionOptions &opt);

vix::App::StaticResponseHook compressed_static_response_hook(
  CompressionOptions opt = {});
```

Use the registration helper for normal applications:

```cpp id="cq2cfv"
vix::middleware::register_static_dir();
```

Static serving itself remains a Core feature through:

```cpp id="yq7ha6"
app.static_dir("public", "/");
```

## Observability namespace

Observability lives under:

```cpp id="ycmahk"
namespace vix::middleware::observability
```

It provides tracing, metrics, and debug tracing.

## tracing

```cpp id="07hesc"
struct TraceContext
{
  std::string trace_id{};
  std::string span_id{};
  std::string parent_span_id{};
};

struct TracingOptions
{
  std::string trace_header{"x-trace-id"};
  std::string span_header{"x-span-id"};
  std::string parent_span_header{"x-parent-span-id"};

  bool accept_incoming_trace{true};
  bool accept_incoming_span{true};

  bool emit_response_headers{true};
  bool include_parent_in_response{false};

  std::function<void(vix::middleware::Context &, TraceContext &)> enrich{};
};

Hooks tracing_hooks(TracingOptions opt = {});
MiddlewareFn tracing_mw(TracingOptions opt = {});
```

Behavior:

```txt id="x2jjal"
accepts valid incoming trace ids
generates trace id when missing
generates a new span id
stores TraceContext in request state
emits trace headers when configured
```

Common headers:

```txt id="cfo05e"
x-trace-id
x-span-id
x-parent-span-id
```

## metrics

Metrics support lives in:

```cpp id="8uepyd"
#include <vix/middleware/observability/metrics.hpp>
```

Common public types and functions:

```cpp id="a70dkw"
class IMetricsSink;
class InMemoryMetrics;
struct MetricsOptions;

Hooks metrics_hooks(
  std::shared_ptr<IMetricsSink> sink,
  MetricsOptions opt = {});

MiddlewareFn metrics_mw(
  std::shared_ptr<IMetricsSink> sink,
  MetricsOptions opt = {});
```

Typical behavior:

```txt id="ojn16y"
increments request counters
increments response counters
records request duration observations
can record error events through hooks
```

Common metric names use a configurable prefix, such as:

```txt id="jz5yxy"
vix_http_requests_total
vix_http_responses_total
vix_http_request_duration_ms
```

## debug_trace

```cpp id="1g0fpu"
class IDebugTraceSink
{
public:
  virtual ~IDebugTraceSink() = default;
  virtual void log(std::string_view line) = 0;
};

class InMemoryDebugTrace final : public IDebugTraceSink
{
public:
  void log(std::string_view line) override;

  std::vector<std::string> lines;
};

struct DebugTraceOptions
{
  bool include_method{true};
  bool include_path{true};
  bool include_status{true};
  bool include_duration_ms{true};
  bool include_trace_ids{true};

  std::string prefix{"[vix.debug]"};
};

Hooks debug_trace_hooks(
  std::shared_ptr<IDebugTraceSink> sink,
  DebugTraceOptions opt = {});

MiddlewareFn debug_trace_mw(
  std::shared_ptr<IDebugTraceSink> sink,
  DebugTraceOptions opt = {});
```

Behavior:

```txt id="pgkavz"
logs begin and end lines
hook version also logs error lines
uses a pluggable sink
useful for tests and local debugging
```

## Observability utilities

```cpp id="3oh46x"
std::string safe_method(const vix::middleware::Request &req);
std::string safe_path(const vix::middleware::Request &req);
```

`safe_method()` returns `"GET"` when the method is empty.

`safe_path()` returns `"/"` when the path is empty.

## HTTP cache middleware

The low-level HTTP cache middleware lives under:

```cpp id="bkqc0r"
namespace vix::middleware
```

Options:

```cpp id="0thxdj"
struct HttpCacheOptions
{
  std::vector<std::string> vary_headers{};
  bool cache_200_only{true};
  bool require_body{false};

  bool allow_bypass{true};
  std::string bypass_header{"x-vix-cache"};
  std::string bypass_value{"bypass"};

  std::function<vix::cache::CacheContext(Request &)> context_provider{};
};
```

Function:

```cpp id="qyh7gl"
HttpMiddleware http_cache(
  std::shared_ptr<vix::cache::Cache> cache,
  HttpCacheOptions opt = {});
```

Behavior:

```txt id="do5ew6"
only handles GET requests
computes a deterministic cache key
serves cached response on hit
calls next on miss
stores eligible responses after next
supports bypass header
uses vix::cache::CacheContext
```

Common cache status header:

```txt id="gs0aor"
x-vix-cache-status
```

Common values:

```txt id="dr5u7e"
hit
miss
bypass
```

Helpers:

```cpp id="qkk98a"
std::int64_t now_ms();

std::string extract_query_raw_from_target(std::string_view target);

std::unordered_map<std::string, std::string>
request_headers_map(Request &req);

std::unordered_map<std::string, std::string>
response_headers_map(const vix::http::Response &res);
```

## App integration namespace

App helpers live under:

```cpp id="wb3sqs"
namespace vix::middleware::app
```

They adapt middleware to `vix::App`.

## App adapters

```cpp id="7zfevc"
vix::App::Middleware adapt(vix::middleware::HttpMiddleware inner);

vix::App::Middleware adapt_ctx(vix::middleware::MiddlewareFn inner);
```

Use `adapt()` for `HttpMiddleware`.

Use `adapt_ctx()` for `MiddlewareFn`.

## Conditional App middleware

```cpp id="oc9v8q"
template <class Pred>
vix::App::Middleware when(Pred pred, vix::App::Middleware mw);
```

`when()` runs the middleware only when the predicate returns `true`.

The predicate receives:

```cpp id="1rxkkd"
const vix::http::Request &
```

## App route protection helpers

```cpp id="9sgce5"
vix::App::Middleware protect_path(
  std::string path,
  vix::App::Middleware mw);

vix::App::Middleware protect_prefix_mw(
  std::string prefix,
  vix::App::Middleware mw);

void protect(
  vix::App &app,
  std::string exact_path,
  vix::App::Middleware mw);

void protect_prefix(
  vix::App &app,
  std::string prefix,
  vix::App::Middleware mw);

void install(
  vix::App &app,
  std::string prefix,
  vix::App::Middleware mw);

void install_exact(
  vix::App &app,
  std::string exact_path,
  vix::App::Middleware mw);
```

Use exact path protection for one route.

Use prefix protection for route groups or sections such as `/api` or `/admin`.

## App middleware chain

```cpp id="rbwt3f"
vix::App::Middleware chain(std::vector<vix::App::Middleware> mws);

vix::App::Middleware chain(
  vix::App::Middleware a,
  vix::App::Middleware b);

vix::App::Middleware chain(
  vix::App::Middleware a,
  vix::App::Middleware b,
  vix::App::Middleware c);
```

`chain()` runs the middleware functions in order and then calls the final `next()`.

## App HTTP cache

```cpp id="wq0hkl"
using HttpCacheConfig = HttpCacheAppConfig;
```

Config:

```cpp id="brs9im"
struct HttpCacheAppConfig
{
  std::string prefix{"/api/"};
  bool only_get{true};
  int ttl_ms{30'000};

  bool allow_bypass{true};
  std::string bypass_header{"x-vix-cache"};
  std::string bypass_value{"bypass"};

  std::vector<std::string> vary_headers{};
  std::shared_ptr<vix::cache::Cache> cache{};

  bool add_debug_header{false};
  std::string debug_header{"x-vix-cache-status"};
};
```

Functions:

```cpp id="uyd6xr"
std::shared_ptr<vix::cache::Cache>
make_default_cache(const HttpCacheAppConfig &cfg);

vix::App::Middleware http_cache_mw(HttpCacheAppConfig cfg = {});

void install_http_cache(vix::App &app, HttpCacheAppConfig cfg = {});

vix::App::Middleware http_cache(HttpCacheConfig cfg = {});

void use_http_cache(vix::App &app, HttpCacheConfig cfg = {});
```

`http_cache()` returns an App middleware.

`use_http_cache()` installs the middleware using `cfg.prefix`.

## Utils namespace

Utilities live under:

```cpp id="uxc9jf"
namespace vix::middleware::utils
```

These are small helpers used by middleware internals and custom middleware.

## Clock utility

```cpp id="9mwyvn"
struct Clock final
{
  using Steady = std::chrono::steady_clock;
  using System = std::chrono::system_clock;

  static std::int64_t now_ms_steady();
  static std::int64_t now_ms_epoch();

  static std::int64_t to_ms(Steady::duration d);
  static std::int64_t to_us(Steady::duration d);
};
```

Use steady time for elapsed durations.

Use epoch time for persisted timestamps and logs.

## Header utilities

```cpp id="lipis6"
std::string to_lower(std::string s);

bool iequals(std::string_view a, std::string_view b);

std::string trim_copy(std::string_view s);

std::vector<std::string> split_csv(std::string_view s);

std::string join_csv(const std::vector<std::string> &a);

void normalize_keys_in_place(
  std::unordered_map<std::string, std::string> &h);

std::string first_token(std::string_view v);
```

These helpers are ASCII-oriented and mainly intended for HTTP headers.

## JsonWriter

```cpp id="j64yxe"
std::string json_escape(std::string_view s);

class JsonWriter final
{
public:
  JsonWriter();

  std::string str() const;

  void begin_obj();
  void end_obj();

  void begin_arr();
  void end_arr();

  void key(std::string_view k);

  void string(std::string_view v);
  void number(std::int64_t v);
  void boolean(bool v);
  void null();

  void object_of(
    const std::unordered_map<std::string, std::string> &m);
};
```

`JsonWriter` is a small JSON string builder for middleware-produced payloads.

For general JSON work, use the `vix::json` module.

## KeyBuilder

```cpp id="e2rwsm"
class KeyBuilder final
{
public:
  KeyBuilder();

  KeyBuilder &add(std::string_view part);
  KeyBuilder &add_kv(std::string_view k, std::string_view v);

  KeyBuilder &add_headers_sorted(
    std::unordered_map<std::string, std::string> headers,
    const std::vector<std::string> &vary);

  std::string str() const;
};
```

`KeyBuilder` builds deterministic string keys from ordered parts and selected headers.

## TokenBucket

```cpp id="o63pgf"
class TokenBucket final
{
public:
  TokenBucket();
  TokenBucket(double capacity, double refill_per_sec);

  bool try_consume(double n);
  double tokens() const;
  std::int64_t retry_after_ms(double need = 1.0);
};
```

`TokenBucket` is thread-safe and used by `rate_limit()`.

## Common middleware order

There is no single correct global order, but these patterns are useful.

Public API:

```txt id="kxfxux"
recovery
request_id
timing
headers
cors
rate_limit
body_limit
parser
handler
```

Authenticated API:

```txt id="ipywc3"
recovery
request_id
timing
cors
rate_limit
body_limit
json
jwt
rbac_context
require_perm
handler
```

Cacheable public GET API:

```txt id="o9rk77"
recovery
request_id
cors
rate_limit
http_cache
handler
etag
compression
```

Upload route:

```txt id="1e83fk"
recovery
request_id
rate_limit
authentication
body_limit
multipart_save
handler
```

The important rule is that middleware requiring state must run after the middleware that creates that state.

## Common normalized errors

Many middleware functions stop the request by calling `ctx.send_error(...)`.

Common errors include:

```txt id="eb654z"
400 empty_body
400 invalid_json
400 missing_boundary

401 missing_api_key
401 invalid_token
401 missing_auth
401 missing_authz

403 invalid_api_key
403 forbidden
403 cors_forbidden
403 csrf_failed
403 ip_denied
403 ip_not_allowed

411 length_required

413 payload_too_large

415 unsupported_media_type

429 rate_limited

500 internal_server_error
500 session_misconfigured
```

The response body follows the normalized middleware error format.

## Public model summary

The middleware module has three main layers.

```txt id="p489ng"
Core middleware types
  Request, Response, Context, Next, MiddlewareFn, HttpMiddleware

Feature middleware
  basics, security, auth, parsers, performance, observability, http_cache

App integration
  adapters and helpers that install middleware into vix::App
```

Use `vix::App` for normal applications.

Use `HttpPipeline` for custom stacks, tests, and low-level control.

Use `vix::middleware::app` helpers when connecting middleware to Core.

## Next steps

Continue with the focused pages when you need more detail:

- [Core Concepts](./concepts)
- [Basics](./basics)
- [Security](./security)
- [Authentication](./authentication)
- [Parsers](./parsers)
- [Performance](./performance)
- [Observability](./observability)
- [HTTP Cache](./http-cache)
- [App Integration](./app-integration)
