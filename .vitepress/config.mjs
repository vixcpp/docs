import { defineConfig } from "vitepress";
import { vixDark, vixLight } from "./theme/vix-shiki-theme.mjs";

const nav = [
  {
    text: "Download PDF",
    link: "/vixcpp-documentation.pdf",
  },
  {
    text: "Registry",
    link: "https://registry.vixcpp.com/",
  },
];

/* ========================================================================
 * 1. START HERE
 * ===================================================================== */

const startHereSidebar = {
  text: "Start Here",
  collapsed: false,
  items: [
    { text: "Welcome to Vix.cpp", link: "/getting-started/" },
    { text: "What is Vix.cpp?", link: "/getting-started/what-is-vixcpp" },
    { text: "Installation", link: "/getting-started/installation" },
    {
      text: "Set Up Your Environment",
      link: "/getting-started/setup-environment",
    },
    {
      text: "Run Your First C++ File",
      link: "/getting-started/run-your-first-file",
    },
    {
      text: "Create Your First Project",
      link: "/getting-started/create-your-first-project",
    },
    {
      text: "Your First HTTP Server",
      link: "/getting-started/first-http-server",
    },
  ],
};

/* ========================================================================
 * 2. CONCEPTS
 * ===================================================================== */

const conceptsSidebar = {
  text: "Concepts",
  collapsed: false,
  items: [
    { text: "Why Vix Exists", link: "/book/02-why-vix" },
    { text: "Mental Model", link: "/book/03-mental-model" },
    { text: "Workflow", link: "/guides/cpp-developer-toolkit" },
    { text: "Project Model", link: "/book/04-application-model" },
    { text: "Runtime", link: "/guides/cpp-runtime" },
    { text: "Vix and CMake", link: "/guides/vix-vs-cmake" },
    {
      text: "Modules and Composition",
      link: "/book/07-modules-and-composition",
    },
    { text: "Local to Production", link: "/book/08-local-to-production" },
  ],
};

/* ========================================================================
 * 3. PROJECTS
 * ===================================================================== */

const projectsSidebar = {
  text: "Projects",
  collapsed: false,
  items: [
    {
      text: "vix.app",
      collapsed: true,
      items: [
        { text: "Overview", link: "/guides/vix-app/" },
        { text: "Getting Started", link: "/guides/vix-app/getting-started" },
        { text: "Project Types", link: "/guides/vix-app/project-types" },
        {
          text: "Manifest Reference",
          link: "/guides/vix-app/manifest-reference",
        },
        {
          text: "Sources and Includes",
          link: "/guides/vix-app/sources-and-includes",
        },
        {
          text: "Packages and Links",
          link: "/guides/vix-app/packages-and-links",
        },
        { text: "Resources", link: "/guides/vix-app/resources" },
        { text: "Output Directory", link: "/guides/vix-app/output-directory" },
        { text: "Compile Options", link: "/guides/vix-app/compile-options" },
        { text: "Libraries", link: "/guides/vix-app/libraries" },
        { text: "App Modules", link: "/guides/vix-app/app-modules" },
        { text: "Tests", link: "/guides/vix-app/tests" },
        { text: "Examples", link: "/guides/vix-app/examples" },
        {
          text: "Migrating from CMake",
          link: "/guides/vix-app/migration-from-cmake",
        },
        { text: "CMake Fallback", link: "/guides/vix-app/cmake-fallback" },
        { text: "Best Practices", link: "/guides/vix-app/best-practices" },
        { text: "Troubleshooting", link: "/guides/vix-app/troubleshooting" },
      ],
    },
    {
      text: "Application Modules",
      collapsed: true,
      items: [
        { text: "Overview", link: "/app-modules/" },
        { text: "Why Application Modules", link: "/app-modules/why-modules" },
        { text: "Getting Started", link: "/app-modules/getting-started" },
        { text: "Module Layout", link: "/app-modules/module-layout" },
        { text: "Module Manifest", link: "/app-modules/module-manifest" },
        { text: "CLI Workflow", link: "/app-modules/cli-workflow" },
        {
          text: "Dependencies and Checks",
          link: "/app-modules/dependencies-and-checks",
        },
        { text: "Tests", link: "/app-modules/tests" },
        {
          text: "Generated Registration",
          link: "/app-modules/generated-registration",
        },
        { text: "Backend Modules", link: "/app-modules/backend-modules" },
        { text: "Using with vix.app", link: "/app-modules/with-vix-app" },
        { text: "Using with CMake", link: "/app-modules/with-cmake" },
        { text: "Best Practices", link: "/app-modules/best-practices" },
        { text: "Troubleshooting", link: "/app-modules/troubleshooting" },
      ],
    },
    {
      text: "Templates",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/templates/",
        },
        {
          text: "Application",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/templates/application",
            },
            {
              text: "Generated Layout",
              link: "/templates/application/layout",
            },
            {
              text: "Module Registry",
              link: "/templates/application/module-registry",
            },
            {
              text: "Manifest",
              link: "/templates/application/manifest",
            },
          ],
        },
        {
          text: "Backend",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/templates/backend",
            },
            {
              text: "Generated Layout",
              link: "/templates/backend/layout",
            },
            {
              text: "App Bootstrap",
              link: "/templates/backend/app-bootstrap",
            },
            {
              text: "Routes and Middleware",
              link: "/templates/backend/routes-and-middleware",
            },
            {
              text: "Modules Integration",
              link: "/templates/backend/modules-integration",
            },
            {
              text: "Production Files",
              link: "/templates/backend/production-files",
            },
          ],
        },
        {
          text: "Web",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/templates/web",
            },
            {
              text: "Generated Layout",
              link: "/templates/web/layout",
            },
            {
              text: "Rendering Flow",
              link: "/templates/web/rendering-flow",
            },
            {
              text: "Routes and Views",
              link: "/templates/web/routes-and-views",
            },
            {
              text: "Production Files",
              link: "/templates/web/production-files",
            },
          ],
        },
        {
          text: "Vue.js",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/templates/vue",
            },
            {
              text: "Generated Layout",
              link: "/templates/vue/layout",
            },
            {
              text: "Frontend Workflow",
              link: "/templates/vue/frontend-workflow",
            },
            {
              text: "Backend Integration",
              link: "/templates/vue/backend-integration",
            },
          ],
        },
        {
          text: "Game",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/templates/game",
            },
            {
              text: "Generated Layout",
              link: "/templates/game/layout",
            },
            {
              text: "Assets and Package",
              link: "/templates/game/assets-and-package",
            },
            {
              text: "Manifest",
              link: "/templates/game/manifest",
            },
          ],
        },
        {
          text: "Library",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/templates/library",
            },
            {
              text: "Generated Layout",
              link: "/templates/library/layout",
            },
            {
              text: "Examples and Tests",
              link: "/templates/library/examples-and-tests",
            },
            {
              text: "CMake Package",
              link: "/templates/library/cmake-package",
            },
            {
              text: "Registry Metadata",
              link: "/templates/library/registry-metadata",
            },
          ],
        },
      ],
    },
    { text: "Dependencies", link: "/cli/install" },
    { text: "Testing", link: "/guides/vix-app/tests" },
    {
      text: "Existing CMake Projects",
      link: "/guides/production-files/existing-cpp-projects",
    },
    { text: "Production", link: "/guides/production-files/" },
  ],
};

/* ========================================================================
 * 4. VIX MODULES
 * ===================================================================== */

const vixModulesSidebar = {
  text: "Vix Modules",
  collapsed: true,
  items: [
    {
      text: "Core",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/core/",
        },
        {
          text: "App",
          link: "/modules/core/app",
        },
        {
          text: "Architecture",
          link: "/modules/core/architecture",
        },
        {
          text: "Routing",
          link: "/modules/core/routing",
        },
        {
          text: "Handlers",
          link: "/modules/core/handlers",
        },
        {
          text: "Middleware",
          link: "/modules/core/middleware",
        },
        {
          text: "Request",
          link: "/modules/core/request",
        },
        {
          text: "Response",
          link: "/modules/core/response",
        },
        {
          text: "Static files",
          link: "/modules/core/static-files",
        },
        {
          text: "Templates",
          link: "/modules/core/templates",
        },
        {
          text: "HTTP server",
          link: "/modules/core/http-server",
        },
        {
          text: "Sessions",
          link: "/modules/core/sessions",
        },
        {
          text: "Transports",
          link: "/modules/core/transports",
        },
        {
          text: "TLS",
          link: "/modules/core/tls",
        },
        {
          text: "Runtime executor",
          link: "/modules/core/runtime-executor",
        },
        {
          text: "Async and runtime",
          link: "/modules/core/async-and-runtime",
        },
        {
          text: "Configuration",
          link: "/modules/core/configuration",
        },
        {
          text: "Print",
          link: "/modules/core/print",
        },
        {
          text: "Format",
          link: "/modules/core/format",
        },
        {
          text: "Console",
          link: "/modules/core/console",
        },
        {
          text: "Input",
          link: "/modules/core/input",
        },
        {
          text: "Inspect",
          link: "/modules/core/inspect",
        },
        {
          text: "OpenAPI",
          link: "/modules/core/openapi",
        },
        {
          text: "Attached runtime",
          link: "/modules/core/attached-runtime",
        },
        {
          text: "API Reference",
          link: "/modules/core/api-reference",
        },
      ],
    },
    {
      text: "Error",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/error/",
        },
        {
          text: "Result",
          link: "/modules/error/result",
        },
        {
          text: "Error Object",
          link: "/modules/error/error-object",
        },
        {
          text: "Error Codes",
          link: "/modules/error/error-codes",
        },
        {
          text: "Error Categories",
          link: "/modules/error/error-categories",
        },
        {
          text: "Exception Bridge",
          link: "/modules/error/exception",
        },
        {
          text: "API Reference",
          link: "/modules/error/api-reference",
        },
      ],
    },
    {
      text: "Conversion",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/conversion/",
        },
        {
          text: "Quick Start",
          link: "/modules/conversion/quick-start",
        },
        {
          text: "Expected Results",
          link: "/modules/conversion/expected-results",
        },
        {
          text: "Errors",
          link: "/modules/conversion/errors",
        },
        {
          text: "Integers",
          link: "/modules/conversion/integers",
        },
        {
          text: "Floats",
          link: "/modules/conversion/floats",
        },
        {
          text: "Booleans",
          link: "/modules/conversion/booleans",
        },
        {
          text: "Enums",
          link: "/modules/conversion/enums",
        },
        {
          text: "To String",
          link: "/modules/conversion/to-string",
        },
        {
          text: "Generic Parse",
          link: "/modules/conversion/generic-parse",
        },
        {
          text: "API Reference",
          link: "/modules/conversion/api-reference",
        },
      ],
    },
    {
      text: "Validation",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/validation/",
        },
        {
          text: "Quick Start",
          link: "/modules/validation/quick-start",
        },
        {
          text: "Results",
          link: "/modules/validation/results",
        },
        {
          text: "Errors",
          link: "/modules/validation/errors",
        },
        {
          text: "Rules",
          link: "/modules/validation/rules",
        },
        {
          text: "Single Field Validation",
          link: "/modules/validation/single-field-validation",
        },
        {
          text: "Parsed Validation",
          link: "/modules/validation/parsed-validation",
        },
        {
          text: "Schemas",
          link: "/modules/validation/schemas",
        },
        {
          text: "Base Models",
          link: "/modules/validation/base-models",
        },
        {
          text: "Forms",
          link: "/modules/validation/forms",
        },
        {
          text: "API Reference",
          link: "/modules/validation/api-reference",
        },
      ],
    },
    {
      text: "Tests",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/tests/",
        },
        {
          text: "Quick Start",
          link: "/modules/tests/quick-start",
        },
        {
          text: "Assertions",
          link: "/modules/tests/assertions",
        },
        {
          text: "Test Cases",
          link: "/modules/tests/test-cases",
        },
        {
          text: "Test Suites",
          link: "/modules/tests/test-suites",
        },
        {
          text: "Registry",
          link: "/modules/tests/registry",
        },
        {
          text: "Runner",
          link: "/modules/tests/runner",
        },
        {
          text: "Summaries",
          link: "/modules/tests/summaries",
        },
        {
          text: "Colors and Output",
          link: "/modules/tests/colors-and-output",
        },
        {
          text: "Timers",
          link: "/modules/tests/timers",
        },
        {
          text: "CLI",
          link: "/modules/tests/cli",
        },
        {
          text: "CMake",
          link: "/modules/tests/cmake",
        },
        {
          text: "API Reference",
          link: "/modules/tests/api-reference",
        },
      ],
    },
    {
      text: "Crypto",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/crypto/",
        },
        {
          text: "Quick Start",
          link: "/modules/crypto/quick-start",
        },
        {
          text: "Results and Errors",
          link: "/modules/crypto/results-and-errors",
        },
        {
          text: "Random",
          link: "/modules/crypto/random",
        },
        {
          text: "Hashing",
          link: "/modules/crypto/hashing",
        },
        {
          text: "HMAC",
          link: "/modules/crypto/hmac",
        },
        {
          text: "Bytes and Hex",
          link: "/modules/crypto/bytes-and-hex",
        },
        {
          text: "Constant-Time Compare",
          link: "/modules/crypto/constant-time-compare",
        },
        {
          text: "Passwords",
          link: "/modules/crypto/passwords",
        },
        {
          text: "KDF",
          link: "/modules/crypto/kdf",
        },
        {
          text: "Keys",
          link: "/modules/crypto/keys",
        },
        {
          text: "AEAD",
          link: "/modules/crypto/aead",
        },
        {
          text: "Signatures",
          link: "/modules/crypto/signatures",
        },
        {
          text: "Certificates",
          link: "/modules/crypto/certificates",
        },
        {
          text: "CMake",
          link: "/modules/crypto/cmake",
        },
        {
          text: "API Reference",
          link: "/modules/crypto/api-reference",
        },
      ],
    },
    {
      text: "FS",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/fs/",
        },
        {
          text: "Quick Start",
          link: "/modules/fs/quick-start",
        },
        {
          text: "Paths and Results",
          link: "/modules/fs/paths-and-results",
        },
        {
          text: "Read and Write",
          link: "/modules/fs/read-and-write",
        },
        {
          text: "Directories",
          link: "/modules/fs/directories",
        },
        {
          text: "Listing",
          link: "/modules/fs/listing",
        },
        {
          text: "Copy, Move, and Remove",
          link: "/modules/fs/copy-move-remove",
        },
        {
          text: "Metadata",
          link: "/modules/fs/metadata",
        },
        {
          text: "Options",
          link: "/modules/fs/options",
        },
        {
          text: "Errors",
          link: "/modules/fs/errors",
        },
        {
          text: "API Reference",
          link: "/modules/fs/api-reference",
        },
      ],
    },
    {
      text: "Path",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/path/",
        },
        {
          text: "Quick Start",
          link: "/modules/path/quick-start",
        },
        {
          text: "Lexical Paths",
          link: "/modules/path/lexical-paths",
        },
        {
          text: "Join and Normalize",
          link: "/modules/path/join-and-normalize",
        },
        {
          text: "Path Components",
          link: "/modules/path/components",
        },
        {
          text: "Absolute and Relative",
          link: "/modules/path/absolute-and-relative",
        },
        {
          text: "Separators and Styles",
          link: "/modules/path/separators-and-styles",
        },
        {
          text: "Options",
          link: "/modules/path/options",
        },
        {
          text: "Errors",
          link: "/modules/path/errors",
        },
        {
          text: "API Reference",
          link: "/modules/path/api-reference",
        },
      ],
    },
    {
      text: "OS",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/os/",
        },
        {
          text: "Quick Start",
          link: "/modules/os/quick-start",
        },
        {
          text: "Platform and Architecture",
          link: "/modules/os/platform-and-architecture",
        },
        {
          text: "User and Process",
          link: "/modules/os/user-and-process",
        },
        {
          text: "Directories",
          link: "/modules/os/directories",
        },
        {
          text: "System Resources",
          link: "/modules/os/system-resources",
        },
        {
          text: "Sleep",
          link: "/modules/os/sleep",
        },
        {
          text: "Errors",
          link: "/modules/os/errors",
        },
        {
          text: "API Reference",
          link: "/modules/os/api-reference",
        },
      ],
    },
    {
      text: "Process",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/process/",
        },
        {
          text: "Quick Start",
          link: "/modules/process/quick-start",
        },
        {
          text: "Commands",
          link: "/modules/process/commands",
        },
        {
          text: "Options and Pipes",
          link: "/modules/process/options-and-pipes",
        },
        {
          text: "Spawn and Child",
          link: "/modules/process/spawn-and-child",
        },
        {
          text: "Output",
          link: "/modules/process/output",
        },
        {
          text: "Status and Wait",
          link: "/modules/process/status-and-wait",
        },
        {
          text: "Terminate and Kill",
          link: "/modules/process/terminate-and-kill",
        },
        {
          text: "Pipelines",
          link: "/modules/process/pipelines",
        },
        {
          text: "Async",
          link: "/modules/process/async",
        },
        {
          text: "Errors",
          link: "/modules/process/errors",
        },
        {
          text: "CMake",
          link: "/modules/process/cmake",
        },
        {
          text: "API Reference",
          link: "/modules/process/api-reference",
        },
      ],
    },
    {
      text: "IO",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/io/",
        },
        {
          text: "Quick Start",
          link: "/modules/io/quick-start",
        },
        {
          text: "Input and Output",
          link: "/modules/io/input-and-output",
        },
        {
          text: "Read and Write",
          link: "/modules/io/read-and-write",
        },
        {
          text: "Lines",
          link: "/modules/io/lines",
        },
        {
          text: "Buffers",
          link: "/modules/io/buffers",
        },
        {
          text: "Copy",
          link: "/modules/io/copy",
        },
        {
          text: "Standard Streams",
          link: "/modules/io/standard-streams",
        },
        {
          text: "Options",
          link: "/modules/io/options",
        },
        {
          text: "Errors",
          link: "/modules/io/errors",
        },
        {
          text: "API Reference",
          link: "/modules/io/api-reference",
        },
      ],
    },
    {
      text: "Env",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/env/",
        },
        {
          text: "Quick Start",
          link: "/modules/env/quick-start",
        },
        {
          text: "Process Environment",
          link: "/modules/env/process-environment",
        },
        {
          text: "Typed Values",
          link: "/modules/env/typed-values",
        },
        {
          text: ".env Files",
          link: "/modules/env/env-files",
        },
        {
          text: "Parsing",
          link: "/modules/env/parsing",
        },
        {
          text: "Layered Loading",
          link: "/modules/env/layered-loading",
        },
        {
          text: "Load Into Process",
          link: "/modules/env/load-into-process",
        },
        {
          text: "Options",
          link: "/modules/env/options",
        },
        {
          text: "Errors",
          link: "/modules/env/errors",
        },
        {
          text: "API Reference",
          link: "/modules/env/api-reference",
        },
      ],
    },
    {
      text: "Time",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/time/",
        },
        {
          text: "Quick Start",
          link: "/modules/time/quick-start",
        },
        {
          text: "Durations",
          link: "/modules/time/durations",
        },
        {
          text: "Timestamps",
          link: "/modules/time/timestamps",
        },
        {
          text: "Clocks",
          link: "/modules/time/clocks",
        },
        {
          text: "Dates",
          link: "/modules/time/dates",
        },
        {
          text: "DateTime",
          link: "/modules/time/datetimes",
        },
        {
          text: "Parsing",
          link: "/modules/time/parsing",
        },
        {
          text: "Chrono Interop",
          link: "/modules/time/chrono-interop",
        },
        {
          text: "API Reference",
          link: "/modules/time/api-reference",
        },
      ],
    },
    {
      text: "Async",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/async/",
        },
        {
          text: "io_context",
          link: "/modules/async/io-context",
        },
        {
          text: "Tasks",
          link: "/modules/async/tasks",
        },
        {
          text: "Spawn",
          link: "/modules/async/spawn",
        },
        {
          text: "Timers",
          link: "/modules/async/timers",
        },
        {
          text: "Cancellation",
          link: "/modules/async/cancellation",
        },
        {
          text: "Thread pool",
          link: "/modules/async/thread-pool",
        },
        {
          text: "when_all / when_any",
          link: "/modules/async/when",
        },
        {
          text: "Signals",
          link: "/modules/async/signals",
        },
        {
          text: "TCP",
          link: "/modules/async/tcp",
        },
        {
          text: "UDP",
          link: "/modules/async/udp",
        },
        {
          text: "DNS",
          link: "/modules/async/dns",
        },
        {
          text: "API Reference",
          link: "/modules/async/api-reference",
        },
      ],
    },
    {
      text: "ThreadPool",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/threadpool/",
        },
        {
          text: "Quick Start",
          link: "/modules/threadpool/quick-start",
        },
        {
          text: "Installation",
          link: "/modules/threadpool/installation",
        },
        {
          text: "Concepts",
          link: "/modules/threadpool/concepts",
        },
        {
          text: "Tasks",
          link: "/modules/threadpool/tasks",
        },
        {
          text: "Futures",
          link: "/modules/threadpool/futures",
        },
        {
          text: "Cancellation",
          link: "/modules/threadpool/cancellation",
        },
        {
          text: "Timeouts",
          link: "/modules/threadpool/timeouts",
        },
        {
          text: "Priorities",
          link: "/modules/threadpool/priorities",
        },
        {
          text: "Task Groups",
          link: "/modules/threadpool/task-groups",
        },
        {
          text: "Shutdown",
          link: "/modules/threadpool/shutdown",
        },
        {
          text: "Metrics",
          link: "/modules/threadpool/metrics",
        },
        {
          text: "Periodic Tasks",
          link: "/modules/threadpool/periodic-tasks",
        },
        {
          text: "Parallel For",
          link: "/modules/threadpool/parallel-for",
        },
        {
          text: "Parallel Map",
          link: "/modules/threadpool/parallel-map",
        },
        {
          text: "Parallel Reduce",
          link: "/modules/threadpool/parallel-reduce",
        },
        {
          text: "Best Practices",
          link: "/modules/threadpool/best-practices",
        },
        {
          text: "API Reference",
          link: "/modules/threadpool/api-reference",
        },
      ],
    },
    {
      text: "Middleware",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/middleware/",
        },
        {
          text: "Quick Start",
          link: "/modules/middleware/quick-start",
        },
        {
          text: "App Integration",
          link: "/modules/middleware/app-integration",
        },
        {
          text: "Core Concepts",
          link: "/modules/middleware/concepts",
        },
        {
          text: "Basics",
          link: "/modules/middleware/basics",
        },
        {
          text: "Security",
          link: "/modules/middleware/security",
        },
        {
          text: "Authentication",
          link: "/modules/middleware/authentication",
        },
        {
          text: "Parsers",
          link: "/modules/middleware/parsers",
        },
        {
          text: "HTTP Cache",
          link: "/modules/middleware/http-cache",
        },
        {
          text: "Performance",
          link: "/modules/middleware/performance",
        },
        {
          text: "Observability",
          link: "/modules/middleware/observability",
        },
        {
          text: "API Reference",
          link: "/modules/middleware/api-reference",
        },
      ],
    },
    {
      text: "Requests",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/requests/",
        },
        {
          text: "Quick Start",
          link: "/modules/requests/quick-start",
        },
        {
          text: "Client",
          link: "/modules/requests/client",
        },
        {
          text: "Session",
          link: "/modules/requests/session",
        },
        {
          text: "Request Options",
          link: "/modules/requests/request-options",
        },
        {
          text: "Headers and Params",
          link: "/modules/requests/headers-and-params",
        },
        {
          text: "Bodies",
          link: "/modules/requests/bodies",
        },
        {
          text: "Responses",
          link: "/modules/requests/responses",
        },
        {
          text: "Timeouts",
          link: "/modules/requests/timeouts",
        },
        {
          text: "Redirects and Cookies",
          link: "/modules/requests/redirects-and-cookies",
        },
        {
          text: "HTTPS and TLS",
          link: "/modules/requests/https-and-tls",
        },
        {
          text: "Errors",
          link: "/modules/requests/errors",
        },
        {
          text: "API Reference",
          link: "/modules/requests/api-reference",
        },
      ],
    },
    {
      text: "WebSocket",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/websocket/",
        },
        {
          text: "Quick Start",
          link: "/modules/websocket/quick-start",
        },
        {
          text: "Concepts",
          link: "/modules/websocket/concepts",
        },
        {
          text: "Configuration",
          link: "/modules/websocket/configuration",
        },
        {
          text: "Server",
          link: "/modules/websocket/server",
        },
        {
          text: "Session",
          link: "/modules/websocket/session",
        },
        {
          text: "Router",
          link: "/modules/websocket/router",
        },
        {
          text: "Messages",
          link: "/modules/websocket/messages",
        },
        {
          text: "Client",
          link: "/modules/websocket/client",
        },
        {
          text: "Rooms and Broadcasting",
          link: "/modules/websocket/rooms-and-broadcasting",
        },
        {
          text: "Long polling",
          link: "/modules/websocket/long-polling",
        },
        {
          text: "HTTP API",
          link: "/modules/websocket/http-api",
        },
        {
          text: "Attached runtime",
          link: "/modules/websocket/attached-runtime",
        },
        {
          text: "Metrics",
          link: "/modules/websocket/metrics",
        },
        {
          text: "Message store",
          link: "/modules/websocket/message-store",
        },
        {
          text: "SQLite message store",
          link: "/modules/websocket/sqlite-message-store",
        },
        {
          text: "OpenAPI",
          link: "/modules/websocket/openapi",
        },
        {
          text: "Shutdown",
          link: "/modules/websocket/shutdown",
        },
        {
          text: "API Reference",
          link: "/modules/websocket/api-reference",
        },
      ],
    },
    {
      text: "WebRPC",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/webrpc/",
        },
        {
          text: "Quick Start",
          link: "/modules/webrpc/quick-start",
        },
        {
          text: "Requests",
          link: "/modules/webrpc/requests",
        },
        {
          text: "Responses",
          link: "/modules/webrpc/responses",
        },
        {
          text: "Errors",
          link: "/modules/webrpc/errors",
        },
        {
          text: "Context",
          link: "/modules/webrpc/context",
        },
        {
          text: "Router",
          link: "/modules/webrpc/router",
        },
        {
          text: "Dispatcher",
          link: "/modules/webrpc/dispatcher",
        },
        {
          text: "Batches and Notifications",
          link: "/modules/webrpc/batches-and-notifications",
        },
        {
          text: "Metadata",
          link: "/modules/webrpc/metadata",
        },
        {
          text: "API Reference",
          link: "/modules/webrpc/api-reference",
        },
      ],
    },
    {
      text: "UI",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/ui/",
        },
        {
          text: "Views",
          link: "/modules/ui/views",
        },
        {
          text: "HTML",
          link: "/modules/ui/html",
        },
        {
          text: "HTML Response",
          link: "/modules/ui/html-response",
        },
        {
          text: "Assets",
          link: "/modules/ui/assets",
        },
        {
          text: "Forms",
          link: "/modules/ui/forms",
        },
        {
          text: "Live UI",
          link: "/modules/ui/live",
        },
        {
          text: "PWA",
          link: "/modules/ui/pwa",
        },
        {
          text: "App Shell",
          link: "/modules/ui/app-shell",
        },
        {
          text: "Examples",
          link: "/modules/ui/examples",
        },
        {
          text: "Tests",
          link: "/modules/ui/tests",
        },
      ],
    },
    {
      text: "Note",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/note/",
        },
        {
          text: "Quick Start",
          link: "/modules/note/quick-start",
        },
        {
          text: "Document Format",
          link: "/modules/note/document-format",
        },
        {
          text: "Cells",
          link: "/modules/note/cells",
        },
        {
          text: "C++ Cells",
          link: "/modules/note/cpp-cells",
        },
        {
          text: "Reply Cells",
          link: "/modules/note/reply-cells",
        },
        {
          text: "HTML Cells",
          link: "/modules/note/html-cells",
        },
        {
          text: "Runtime",
          link: "/modules/note/runtime",
        },
        {
          text: "Creating Extensions",
          link: "/modules/note/extensions",
        },
        {
          text: "Extension Manifest",
          link: "/modules/note/extension-manifest",
        },
        {
          text: "Extension Requirements",
          link: "/modules/note/extension-requirements",
        },
        {
          text: "Extension Protocol",
          link: "/modules/note/extension-protocol",
        },
        {
          text: "Pyrelune Tutorial",
          link: "/modules/note/extension-tutorial-pyrelune",
        },
        {
          text: "Project Context",
          link: "/modules/note/project-context",
        },
        {
          text: "Local UI",
          link: "/modules/note/local-ui",
        },
        {
          text: "Export",
          link: "/modules/note/export",
        },
        {
          text: "API Reference",
          link: "/modules/note/api-reference",
        },
      ],
    },
    {
      text: "Cache",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/cache/",
        },
        {
          text: "Quick Start",
          link: "/modules/cache/quick-start",
        },
        {
          text: "Cache Entry",
          link: "/modules/cache/cache-entry",
        },
        {
          text: "Cache Policy",
          link: "/modules/cache/cache-policy",
        },
        {
          text: "Cache Context",
          link: "/modules/cache/cache-context",
        },
        {
          text: "Cache Keys",
          link: "/modules/cache/cache-keys",
        },
        {
          text: "Stores",
          link: "/modules/cache/stores",
        },
        {
          text: "Memory Store",
          link: "/modules/cache/memory-store",
        },
        {
          text: "LRU Memory Store",
          link: "/modules/cache/lru-memory-store",
        },
        {
          text: "File Store",
          link: "/modules/cache/file-store",
        },
        {
          text: "Offline and Network Errors",
          link: "/modules/cache/offline-and-network-errors",
        },
        {
          text: "Pruning",
          link: "/modules/cache/pruning",
        },
        {
          text: "Context Mapper",
          link: "/modules/cache/context-mapper",
        },
        {
          text: "CMake",
          link: "/modules/cache/cmake",
        },
        {
          text: "API Reference",
          link: "/modules/cache/api-reference",
        },
      ],
    },
    {
      text: "Agent",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/agent/",
        },
        {
          text: "Quick Start",
          link: "/modules/agent/quick-start",
        },
        {
          text: "Public API",
          link: "/modules/agent/public-api",
        },
        {
          text: "Configuration",
          link: "/modules/agent/configuration",
        },
        {
          text: "Requests and Responses",
          link: "/modules/agent/requests-and-responses",
        },
        {
          text: "Workspace",
          link: "/modules/agent/workspace",
        },
        {
          text: "Project Scanning",
          link: "/modules/agent/project-scanning",
        },
        {
          text: "Model Providers",
          link: "/modules/agent/model-providers",
        },
        {
          text: "Ollama",
          link: "/modules/agent/ollama",
        },
        {
          text: "Tools",
          link: "/modules/agent/tools",
        },
        {
          text: "File Read Tool",
          link: "/modules/agent/file-read-tool",
        },
        {
          text: "Command Tool",
          link: "/modules/agent/command-tool",
        },
        {
          text: "Cache and Run History",
          link: "/modules/agent/cache-and-run-history",
        },
        {
          text: "Custom Providers",
          link: "/modules/agent/custom-providers",
        },
        {
          text: "Errors",
          link: "/modules/agent/errors",
        },
        {
          text: "CMake",
          link: "/modules/agent/cmake",
        },
        {
          text: "API Reference",
          link: "/modules/agent/api-reference",
        },
      ],
    },
    {
      text: "KV",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/kv/",
        },
        {
          text: "Opening a database",
          link: "/modules/kv/opening",
        },
        {
          text: "Keys",
          link: "/modules/kv/keys",
        },
        {
          text: "Values",
          link: "/modules/kv/values",
        },
        {
          text: "Persistence",
          link: "/modules/kv/persistence",
        },
        {
          text: "Recovery",
          link: "/modules/kv/recovery",
        },
        {
          text: "Stats",
          link: "/modules/kv/stats",
        },
        {
          text: "API Reference",
          link: "/modules/kv/api-reference",
        },
      ],
    },
    {
      text: "Sync",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/sync/",
        },
        {
          text: "Quick Start",
          link: "/modules/sync/quick-start",
        },
        {
          text: "Offline-first Model",
          link: "/modules/sync/offline-first-model",
        },
        {
          text: "Operations",
          link: "/modules/sync/operations",
        },
        {
          text: "Outbox",
          link: "/modules/sync/outbox",
        },
        {
          text: "File Outbox Store",
          link: "/modules/sync/file-outbox-store",
        },
        {
          text: "Retry Policy",
          link: "/modules/sync/retry-policy",
        },
        {
          text: "Transports",
          link: "/modules/sync/transports",
        },
        {
          text: "Sync Engine",
          link: "/modules/sync/sync-engine",
        },
        {
          text: "In-flight Recovery",
          link: "/modules/sync/inflight-recovery",
        },
        {
          text: "WAL",
          link: "/modules/sync/wal",
        },
        {
          text: "CMake",
          link: "/modules/sync/cmake",
        },
        {
          text: "API Reference",
          link: "/modules/sync/api-reference",
        },
      ],
    },
    {
      text: "P2P",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/modules/p2p/",
        },
        {
          text: "Node",
          link: "/modules/p2p/node",
        },
        {
          text: "Discovery",
          link: "/modules/p2p/discovery",
        },
        {
          text: "Bootstrap",
          link: "/modules/p2p/bootstrap",
        },
        {
          text: "Router",
          link: "/modules/p2p/router",
        },
        {
          text: "Protocol",
          link: "/modules/p2p/protocol",
        },
        {
          text: "WAL Replication",
          link: "/modules/p2p/wal-replication",
        },
        {
          text: "HTTP Control",
          link: "/modules/p2p/http-control",
        },
        {
          text: "API Reference",
          link: "/modules/p2p/api-reference",
        },
      ],
    },
  ],
};

/* ========================================================================
 * 5. TOOLING
 * ===================================================================== */

const toolingSidebar = {
  text: "Tooling",
  collapsed: false,
  items: [
    {
      text: "CLI",
      collapsed: true,
      items: [
        { text: "Overview", link: "/cli/" },
        { text: "All Commands", link: "/cli/commands" },
        { text: "vix build", link: "/cli/build" },
        { text: "vix run", link: "/cli/run" },
        { text: "vix dev", link: "/cli/dev" },
        { text: "vix repl", link: "/cli/repl" },
        { text: "vix note", link: "/cli/note" },
        { text: "vix new", link: "/cli/new" },
        { text: "vix make", link: "/cli/make" },
        { text: "vix modules", link: "/cli/modules" },
        { text: "vix check", link: "/cli/check" },
        { text: "vix tests", link: "/cli/tests" },
        { text: "vix fmt", link: "/cli/fmt" },
        { text: "vix clean", link: "/cli/clean" },
        { text: "vix reset", link: "/cli/reset" },
        { text: "vix replay", link: "/cli/replay" },
        { text: "vix task", link: "/cli/task" },
        { text: "vix search", link: "/cli/search" },
        { text: "vix add", link: "/cli/add" },
        { text: "vix install", link: "/cli/install" },
        { text: "vix update", link: "/cli/update" },
        { text: "vix outdated", link: "/cli/outdated" },
        { text: "vix remove", link: "/cli/remove" },
        { text: "vix list", link: "/cli/list" },
        { text: "vix registry", link: "/cli/registry" },
        { text: "vix store", link: "/cli/store" },
        { text: "vix pack", link: "/cli/pack" },
        { text: "vix verify", link: "/cli/verify" },
        { text: "vix cache", link: "/cli/cache" },
        { text: "vix publish", link: "/cli/publish" },
        { text: "vix unpublish", link: "/cli/unpublish" },
        { text: "vix env", link: "/cli/env" },
        { text: "vix service", link: "/cli/service" },
        { text: "vix proxy", link: "/cli/proxy" },
        { text: "vix deploy", link: "/cli/deploy" },
        { text: "vix health", link: "/cli/health" },
        { text: "vix logs", link: "/cli/logs" },
        { text: "vix ws", link: "/cli/ws" },
        { text: "vix db", link: "/cli/db" },
        { text: "vix orm", link: "/cli/orm" },
        { text: "vix p2p", link: "/cli/p2p" },
        { text: "vix game", link: "/cli/game" },
        { text: "vix agent", link: "/cli/agent" },
        { text: "vix info", link: "/cli/info" },
        { text: "vix doctor", link: "/cli/doctor" },
        { text: "vix upgrade", link: "/cli/upgrade" },
        { text: "vix uninstall", link: "/cli/uninstall" },
        { text: "vix completion", link: "/cli/completion" },
      ],
    },
    {
      text: "SDK Profiles",
      collapsed: true,
      items: [
        { text: "Overview", link: "/sdks/" },
        { text: "Default SDK", link: "/sdks/default" },
        { text: "Web SDK", link: "/sdks/web" },
        { text: "Data SDK", link: "/sdks/data" },
        { text: "Desktop SDK", link: "/sdks/desktop" },
        { text: "P2P SDK", link: "/sdks/p2p" },
        { text: "Game SDK", link: "/sdks/game" },
        { text: "Agent SDK", link: "/sdks/agent" },
        { text: "Full SDK", link: "/sdks/all" },
      ],
    },
    {
      text: "Registry",
      collapsed: true,
      items: [
        { text: "Overview", link: "/registry/" },
        { text: "Package Metadata", link: "/registry/package-metadata" },
        { text: "vix.json Reference", link: "/registry/vix-json" },
        { text: "Publishing Packages", link: "/registry/publishing" },
        { text: "Extensions", link: "/registry/extensions" },
      ],
    },
    { text: "Build Cache", link: "/guides/object-cache" },
    { text: "Diagnostics", link: "/guides/diagnostics" },
    { text: "Replay", link: "/guides/replay" },
  ],
};

/* ========================================================================
 * 6. EXAMPLES
 * ===================================================================== */

const examplesSidebar = {
  text: "Examples",
  collapsed: false,
  items: [
    { text: "Hello App", link: "/examples/hello-app" },
    { text: "JSON API", link: "/examples/json-api" },
    { text: "Middleware API", link: "/examples/middleware-api" },
    { text: "HTTP Cache", link: "/examples/http-cache" },
    { text: "Multipart Upload", link: "/examples/multipart-upload" },
    { text: "Cookies", link: "/examples/cookies" },
    { text: "Session Counter", link: "/examples/session-counter" },
    { text: "API Key Auth", link: "/examples/auth-api-key" },
    { text: "JWT Auth", link: "/examples/auth-jwt" },
    { text: "RBAC", link: "/examples/auth-rbac" },
    { text: "Static Site", link: "/examples/static-site" },
    { text: "WebSocket Chat", link: "/examples/websocket-chat" },
    { text: "SQLite API", link: "/examples/sqlite-api" },
    { text: "Background Task", link: "/examples/background-task" },
    { text: "Async App", link: "/examples/async-app" },
    { text: "Production Bootstrap", link: "/examples/production-bootstrap" },
  ],
};

/* ========================================================================
 * 7. INTERNALS
 * ===================================================================== */

const internalsSidebar = {
  text: "Internals",
  collapsed: true,
  items: [
    { text: "Architecture", link: "/internals/architecture" },
    { text: "Runtime Model", link: "/internals/runtime-model" },
    { text: "Direct Compile", link: "/internals/direct-compile" },
    { text: "Cache System", link: "/internals/cache-system" },
    { text: "Error Diagnostics", link: "/internals/error-diagnostics" },
    { text: "Performance", link: "/internals/performance" },
    { text: "Design Decisions", link: "/internals/design-decisions" },
  ],
};

/* ========================================================================
 * 8. CONTRIBUTING
 * ===================================================================== */

const contributingSidebar = {
  text: "Contributing",
  collapsed: true,
  items: [
    { text: "Overview", link: "/contributing" },
    { text: "Pull Requests", link: "/pull-request" },
    { text: "Code of Conduct", link: "/code-of-conduct" },
    { text: "Security", link: "/security" },
  ],
};

const sidebar = [
  startHereSidebar,
  conceptsSidebar,
  projectsSidebar,
  vixModulesSidebar,
  toolingSidebar,
  examplesSidebar,
  internalsSidebar,
  contributingSidebar,
];

export default defineConfig({
  lang: "en-US",

  title: "Vix.cpp Documentation",
  description:
    "Vix.cpp is a C++ developer platform for building native applications with a coherent development workflow.",

  base: "/",

  cleanUrls: true,

  markdown: {
    html: true,
    lineNumbers: true,
    theme: {
      light: vixLight,
      dark: vixDark,
    },
  },
  head: [
    ["link", { rel: "icon", href: "/assets/pwa/favicon.ico" }],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/assets/pwa/favicon-16x16.png",
      },
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/assets/pwa/favicon-32x32.png",
      },
    ],
    [
      "link",
      {
        rel: "apple-touch-icon",
        href: "/assets/pwa/apple-touch-icon.png",
      },
    ],

    ["meta", { name: "theme-color", content: "#0b0e14" }],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      {
        name: "apple-mobile-web-app-title",
        content: "Vix.cpp Docs",
      },
    ],

    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Vix.cpp Documentation" }],
    [
      "meta",
      {
        property: "og:description",
        content: "Learn how to build native C++ applications with Vix.cpp.",
      },
    ],
    ["meta", { property: "og:site_name", content: "Vix.cpp Documentation" }],

    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Vix.cpp Documentation" }],
    [
      "meta",
      {
        name: "twitter:description",
        content: "Learn how to build native C++ applications with Vix.cpp.",
      },
    ],

    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-1B67VYZMXF",
      },
    ],
    [
      "script",
      {},
      `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("js", new Date());
gtag("config", "G-1B67VYZMXF");
gtag("config", "AW-17078961408");
gtag("event", "ads_conversion_Pr_sentation_1", {});
`,
    ],
  ],

  vite: {
    optimizeDeps: {
      include: ["mark.js", "minisearch"],
    },
    ssr: {
      noExternal: ["mark.js"],
    },
    build: {
      // smaller, cacheable chunks
      cssCodeSplit: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("minisearch")) return "search";
            if (id.includes("mark.js")) return "search";
            if (id.includes("shiki")) return; // shiki is build-only now
            return "vendor";
          },
        },
      },
    },
  },

  themeConfig: {
    siteTitle: "Vix.cpp",
    logo: "/assets/pwa/icon-192.png",

    appearance: true,

    nav,

    sidebar,

    search: {
      provider: "local",
      options: {
        miniSearch: {
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
          },
        },
      },
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/vixcpp/vix",
      },
      {
        icon: "x",
        link: "https://x.com/",
      },
    ],

    outline: {
      level: "deep",
      label: "On this page",
    },

    returnToTopLabel: "Back to top",

    lastUpdated: {
      text: "Last updated",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "short",
      },
    },

    editLink: {
      pattern: "https://github.com/vixcpp/docs/edit/main/:path",
      text: "Edit this page on GitHub",
    },

    docFooter: {
      prev: "Previous page",
      next: "Next page",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Vix.cpp",
    },
  },
});
