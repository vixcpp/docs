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
 * 1. GET STARTED
 * ===================================================================== */

const getStartedSidebar = {
  text: "Get Started",
  collapsed: false,
  items: [
    {
      text: "Welcome to Vix.cpp",
      link: "/getting-started/",
    },
    {
      text: "What is Vix.cpp?",
      link: "/getting-started/what-is-vixcpp",
    },
    {
      text: "Installation",
      link: "/getting-started/installation",
    },
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
 * 2. GUIDES  —  practical learning pages
 * ===================================================================== */

const guidesSidebar = {
  text: "Guides",
  collapsed: false,
  items: [
    {
      text: "Application Workflows",
      collapsed: true,
      items: [
        {
          text: "Build a REST API",
          link: "/guides/build-rest-api",
        },
        {
          text: "WebSocket Chat",
          link: "/guides/websocket-chat",
        },
        {
          text: "Static Files",
          link: "/guides/static-files",
        },
        {
          text: "Templates",
          link: "/guides/templates",
        },
        {
          text: "Game",
          link: "/guides/game",
        },
      ],
    },
    {
      text: "Backend Essentials",
      collapsed: true,
      items: [
        {
          text: "Validation",
          link: "/guides/validation",
        },
        {
          text: "Authentication",
          link: "/guides/authentication",
        },
        {
          text: "Sessions",
          link: "/guides/sessions",
        },
        {
          text: "CORS",
          link: "/guides/cors",
        },
        {
          text: "Rate Limiting",
          link: "/guides/rate-limiting",
        },
      ],
    },
    {
      text: "Data",
      collapsed: true,
      items: [
        {
          text: "JSON",
          link: "/guides/json/",
        },
        {
          text: "Quick Start",
          link: "/guides/json/quick-start",
        },
        {
          text: "Build JSON",
          link: "/guides/json/build-json",
        },
        {
          text: "Parse JSON",
          link: "/guides/json/parse-json",
        },
        {
          text: "Write JSON",
          link: "/guides/json/write-json",
        },
        {
          text: "Safe Access",
          link: "/guides/json/safe-access",
        },
        {
          text: "JPath",
          link: "/guides/json/jpath",
        },
        {
          text: "Simple Token",
          link: "/guides/json/simple-token",
        },
        {
          text: "JSON with HTTP",
          link: "/guides/json/http",
        },
      ],
    },
    {
      text: "Database",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/guides/database/",
        },
        {
          text: "Quick Start",
          link: "/guides/database/quick-start",
        },
        {
          text: "Configuration",
          link: "/guides/database/configuration",
        },
        {
          text: "SQLite",
          link: "/guides/database/sqlite",
        },
        {
          text: "MySQL",
          link: "/guides/database/mysql",
        },
        {
          text: "Queries",
          link: "/guides/database/queries",
        },
        {
          text: "Connection Pool",
          link: "/guides/database/connection-pool",
        },
        {
          text: "Transactions",
          link: "/guides/database/transactions",
        },
        {
          text: "Migrations",
          link: "/guides/database/migrations",
        },
        {
          text: "Schema Snapshots",
          link: "/guides/database/schema-snapshots",
        },
        {
          text: "CLI",
          link: "/guides/database/cli",
        },
      ],
    },
    {
      text: "ORM",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/guides/orm/",
        },
        {
          text: "Quick Start",
          link: "/guides/orm/quick-start",
        },
        {
          text: "Entities",
          link: "/guides/orm/entities",
        },
        {
          text: "Mappers",
          link: "/guides/orm/mappers",
        },
        {
          text: "Repositories",
          link: "/guides/orm/repositories",
        },
        {
          text: "Query Builder",
          link: "/guides/orm/query-builder",
        },
        {
          text: "Unit of Work",
          link: "/guides/orm/unit-of-work",
        },
        {
          text: "With vix::db",
          link: "/guides/orm/with-vix-db",
        },
      ],
    },
    {
      text: "Production Files",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/guides/production-files/",
        },
        {
          text: "Service",
          link: "/guides/production-files/service",
        },
        {
          text: "Proxy",
          link: "/guides/production-files/proxy",
        },
        {
          text: "Deploy",
          link: "/guides/production-files/deploy",
        },
        {
          text: "Environment",
          link: "/guides/production-files/environment",
        },
        {
          text: "Database",
          link: "/guides/production-files/database",
        },
        {
          text: "WebSocket",
          link: "/guides/production-files/websocket",
        },
        {
          text: "Existing C++ Projects",
          link: "/guides/production-files/existing-cpp-projects",
        },
      ],
    },
    {
      text: "Production",
      collapsed: true,
      items: [
        {
          text: "Nginx + systemd",
          link: "/guides/production-nginx-systemd",
        },
      ],
    },
  ],
};

/* ========================================================================
 * 3. CONCEPTS  —  conceptual material
 * ===================================================================== */

const conceptsSidebar = {
  text: "Concepts",
  collapsed: false,
  items: [
    {
      text: "The Vix Book",
      collapsed: false,
      items: [
        {
          text: "Introduction",
          link: "/book/01-introduction",
        },
        {
          text: "Why Vix Exists",
          link: "/book/02-why-vix",
        },
        {
          text: "Mental Model",
          link: "/book/03-mental-model",
        },
        {
          text: "Application Model",
          link: "/book/04-application-model",
        },
        {
          text: "Runtime Workflow",
          link: "/book/05-runtime-workflow",
        },
        {
          text: "Build Workflow",
          link: "/book/06-build-workflow",
        },
        {
          text: "Modules and Composition",
          link: "/book/07-modules-and-composition",
        },
        {
          text: "From Local to Production",
          link: "/book/08-local-to-production",
        },
        {
          text: "Next Steps",
          link: "/book/09-next-steps",
        },
      ],
    },
    {
      text: "Foundations",
      collapsed: false,
      items: [
        {
          text: "Vix.cpp vs CMake",
          link: "/guides/vix-vs-cmake",
        },
        {
          text: "C++ Runtime",
          link: "/guides/cpp-runtime",
        },
        {
          text: "C++ Developer Toolkit",
          link: "/guides/cpp-developer-toolkit",
        },
        {
          text: "Why Modules Exist",
          link: "/app-modules/why-modules",
        },
      ],
    },
    {
      text: "SDK Profiles",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/sdks/",
        },
        {
          text: "Default SDK",
          link: "/sdks/default",
        },
        {
          text: "Web SDK",
          link: "/sdks/web",
        },
        {
          text: "Data SDK",
          link: "/sdks/data",
        },
        {
          text: "Desktop SDK",
          link: "/sdks/desktop",
        },
        {
          text: "P2P SDK",
          link: "/sdks/p2p",
        },
        {
          text: "Game SDK",
          link: "/sdks/game",
        },
        {
          text: "Agent SDK",
          link: "/sdks/agent",
        },
        {
          text: "Full SDK",
          link: "/sdks/all",
        },
      ],
    },
  ],
};

/* ========================================================================
 * 4. DIAGNOSTICS  —  diagnostic / troubleshooting pages only
 * ===================================================================== */

const diagnosticsSidebar = {
  text: "Diagnostics",
  collapsed: false,
  items: [
    {
      text: "Inspect and Debug",
      collapsed: false,
      items: [
        {
          text: "Replay a Run",
          link: "/guides/replay",
        },
        {
          text: "Runtime Arguments",
          link: "/guides/runtime-arguments",
        },
        {
          text: "Diagnostics",
          link: "/guides/diagnostics",
        },
        {
          text: "Logs",
          link: "/guides/production-files/logs",
        },
        {
          text: "Health Checks",
          link: "/guides/production-files/health",
        },
      ],
    },
    {
      text: "Troubleshooting",
      collapsed: false,
      items: [
        {
          text: "vix.app Troubleshooting",
          link: "/guides/vix-app/troubleshooting",
        },
        {
          text: "Application Modules Troubleshooting",
          link: "/app-modules/troubleshooting",
        },
        {
          text: "Internals Error Diagnostics",
          link: "/internals/error-diagnostics",
        },
      ],
    },
  ],
};

/* ========================================================================
 * 5. ADVANCED  —  deeper technical material
 * ===================================================================== */

const advancedSidebar = {
  text: "Advanced",
  collapsed: false,
  items: [
    {
      text: "Build Performance",
      collapsed: false,
      items: [
        {
          text: "Fast Target Builds",
          link: "/guides/fast-target-builds",
        },
        {
          text: "Object Cache",
          link: "/guides/object-cache",
        },
        {
          text: "Artifact Cache",
          link: "/guides/artifact-cache",
        },
      ],
    },
    {
      text: "Advanced vix.app",
      collapsed: false,
      items: [
        {
          text: "Migrating from CMake",
          link: "/guides/vix-app/migration-from-cmake",
        },
        {
          text: "CMake Fallback",
          link: "/guides/vix-app/cmake-fallback",
        },
        {
          text: "Best Practices",
          link: "/guides/vix-app/best-practices",
        },
      ],
    },
    {
      text: "Internals",
      collapsed: false,
      items: [
        {
          text: "Architecture",
          link: "/internals/architecture",
        },
        {
          text: "Runtime Model",
          link: "/internals/runtime-model",
        },
        {
          text: "Direct Compile",
          link: "/internals/direct-compile",
        },
        {
          text: "Cache System",
          link: "/internals/cache-system",
        },
        {
          text: "Performance",
          link: "/internals/performance",
        },
        {
          text: "Design Decisions",
          link: "/internals/design-decisions",
        },
      ],
    },
  ],
};

/* ========================================================================
 * 6. REFERENCE  —  exact lookup material
 * ===================================================================== */

const referenceSidebar = {
  text: "Reference",
  collapsed: false,
  items: [
    {
      text: "CLI",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/cli/",
        },
        {
          text: "All Commands",
          link: "/cli/commands",
        },
        {
          text: "Core Workflow",
          collapsed: true,
          items: [
            {
              text: "vix repl",
              link: "/cli/repl",
            },
            {
              text: "vix note",
              link: "/cli/note",
            },
            {
              text: "vix new",
              link: "/cli/new",
            },
            {
              text: "vix make",
              link: "/cli/make",
            },
            {
              text: "vix modules",
              link: "/cli/modules",
            },
            {
              text: "vix run",
              link: "/cli/run",
            },
            {
              text: "vix dev",
              link: "/cli/dev",
            },
            {
              text: "vix build",
              link: "/cli/build",
            },
            {
              text: "vix check",
              link: "/cli/check",
            },
            {
              text: "vix tests",
              link: "/cli/tests",
            },
            {
              text: "vix fmt",
              link: "/cli/fmt",
            },
          ],
        },
        {
          text: "Project State",
          collapsed: true,
          items: [
            {
              text: "vix clean",
              link: "/cli/clean",
            },
            {
              text: "vix reset",
              link: "/cli/reset",
            },
            {
              text: "vix replay",
              link: "/cli/replay",
            },
            {
              text: "vix task",
              link: "/cli/task",
            },
          ],
        },
        {
          text: "Dependencies",
          collapsed: true,
          items: [
            {
              text: "vix search",
              link: "/cli/search",
            },
            {
              text: "vix add",
              link: "/cli/add",
            },
            {
              text: "vix install",
              link: "/cli/install",
            },
            {
              text: "vix update",
              link: "/cli/update",
            },
            {
              text: "vix outdated",
              link: "/cli/outdated",
            },
            {
              text: "vix remove",
              link: "/cli/remove",
            },
            {
              text: "vix list",
              link: "/cli/list",
            },
          ],
        },
        {
          text: "Registry and Packages",
          collapsed: true,
          items: [
            {
              text: "vix registry",
              link: "/cli/registry",
            },
            {
              text: "vix store",
              link: "/cli/store",
            },
            {
              text: "vix pack",
              link: "/cli/pack",
            },
            {
              text: "vix verify",
              link: "/cli/verify",
            },
            {
              text: "vix cache",
              link: "/cli/cache",
            },
            {
              text: "vix publish",
              link: "/cli/publish",
            },
            {
              text: "vix unpublish",
              link: "/cli/unpublish",
            },
          ],
        },
        {
          text: "Runtime and Production",
          collapsed: true,
          items: [
            {
              text: "vix env",
              link: "/cli/env",
            },
            {
              text: "vix service",
              link: "/cli/service",
            },
            {
              text: "vix proxy",
              link: "/cli/proxy",
            },
            {
              text: "vix deploy",
              link: "/cli/deploy",
            },
            {
              text: "vix health",
              link: "/cli/health",
            },
            {
              text: "vix logs",
              link: "/cli/logs",
            },
            {
              text: "vix ws",
              link: "/cli/ws",
            },
          ],
        },
        {
          text: "Data",
          collapsed: true,
          items: [
            {
              text: "vix db",
              link: "/cli/db",
            },
            {
              text: "vix orm",
              link: "/cli/orm",
            },
          ],
        },
        {
          text: "Advanced Runtime",
          collapsed: true,
          items: [
            {
              text: "vix p2p",
              link: "/cli/p2p",
            },
            {
              text: "vix game",
              link: "/cli/game",
            },
            {
              text: "vix agent",
              link: "/cli/agent",
            },
          ],
        },
        {
          text: "System",
          collapsed: true,
          items: [
            {
              text: "vix info",
              link: "/cli/info",
            },
            {
              text: "vix doctor",
              link: "/cli/doctor",
            },
            {
              text: "vix upgrade",
              link: "/cli/upgrade",
            },
            {
              text: "vix uninstall",
              link: "/cli/uninstall",
            },
            {
              text: "vix completion",
              link: "/cli/completion",
            },
          ],
        },
      ],
    },
    {
      text: "vix.app",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/guides/vix-app/",
        },
        {
          text: "Getting Started",
          link: "/guides/vix-app/getting-started",
        },
        {
          text: "Project Types",
          link: "/guides/vix-app/project-types",
        },
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
        {
          text: "Resources",
          link: "/guides/vix-app/resources",
        },
        {
          text: "Output Directory",
          link: "/guides/vix-app/output-directory",
        },
        {
          text: "Compile Options",
          link: "/guides/vix-app/compile-options",
        },
        {
          text: "Libraries",
          link: "/guides/vix-app/libraries",
        },
        {
          text: "App Modules",
          link: "/guides/vix-app/app-modules",
        },
        {
          text: "Tests",
          link: "/guides/vix-app/tests",
        },
        {
          text: "Examples",
          link: "/guides/vix-app/examples",
        },
      ],
    },
    {
      text: "Project Templates",
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
    {
      text: "Application Modules",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/app-modules/",
        },
        {
          text: "CLI Workflow",
          link: "/app-modules/cli-workflow",
        },
        {
          text: "Module Layout",
          link: "/app-modules/module-layout",
        },
        {
          text: "Backend Modules",
          link: "/app-modules/backend-modules",
        },
        {
          text: "Using with vix.app",
          link: "/app-modules/with-vix-app",
        },
        {
          text: "Using with CMake",
          link: "/app-modules/with-cmake",
        },
        {
          text: "Dependencies and Checks",
          link: "/app-modules/dependencies-and-checks",
        },
        {
          text: "Generated Registration",
          link: "/app-modules/generated-registration",
        },
      ],
    },
    {
      text: "Modules",
      collapsed: false,
      items: [
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
              text: "WAL",
              link: "/modules/sync/wal",
            },
            {
              text: "Outbox",
              link: "/modules/sync/outbox",
            },
            {
              text: "Retry Policy",
              link: "/modules/sync/retry-policy",
            },
            {
              text: "Offline-first Model",
              link: "/modules/sync/offline-first-model",
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
    },
    {
      text: "Examples",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/examples/",
        },
        {
          text: "Getting Started",
          collapsed: true,
          items: [
            {
              text: "Hello App",
              link: "/examples/hello-app",
            },
            {
              text: "JSON API",
              link: "/examples/json-api",
            },
            {
              text: "Production Bootstrap",
              link: "/examples/production-bootstrap",
            },
          ],
        },
        {
          text: "Middleware",
          collapsed: true,
          items: [
            {
              text: "Middleware API",
              link: "/examples/middleware-api",
            },
            {
              text: "HTTP Cache",
              link: "/examples/http-cache",
            },
          ],
        },
        {
          text: "Request Parsing",
          collapsed: true,
          items: [
            {
              text: "Multipart Upload",
              link: "/examples/multipart-upload",
            },
            {
              text: "Form Parser",
              link: "/examples/form-parser",
            },
          ],
        },
        {
          text: "Sessions and Cookies",
          collapsed: true,
          items: [
            {
              text: "Cookies",
              link: "/examples/cookies",
            },
            {
              text: "Session Counter",
              link: "/examples/session-counter",
            },
          ],
        },
        {
          text: "Authentication",
          collapsed: true,
          items: [
            {
              text: "API Key Auth",
              link: "/examples/auth-api-key",
            },
            {
              text: "JWT Auth",
              link: "/examples/auth-jwt",
            },
            {
              text: "RBAC",
              link: "/examples/auth-rbac",
            },
          ],
        },
        {
          text: "Static Files",
          collapsed: true,
          items: [
            {
              text: "Static Site",
              link: "/examples/static-site",
            },
          ],
        },
        {
          text: "Realtime",
          collapsed: true,
          items: [
            {
              text: "WebSocket Chat",
              link: "/examples/websocket-chat",
            },
          ],
        },
        {
          text: "Database",
          collapsed: true,
          items: [
            {
              text: "SQLite API",
              link: "/examples/sqlite-api",
            },
          ],
        },
        {
          text: "Async",
          collapsed: true,
          items: [
            {
              text: "Background Task",
              link: "/examples/background-task",
            },
            {
              text: "Async App",
              link: "/examples/async-app",
            },
          ],
        },
      ],
    },
    {
      text: "API Reference",
      collapsed: true,
      items: [
        {
          text: "Overview",
          link: "/api/index",
        },
        {
          text: "Core",
          collapsed: true,
          items: [
            {
              text: "Print",
              link: "/api/core/print",
            },
            {
              text: "Format",
              link: "/api/core/format",
            },
            {
              text: "Console",
              link: "/api/core/console",
            },
            {
              text: "Inspect",
              link: "/api/core/inspect",
            },
            {
              text: "Input",
              link: "/api/core/input",
            },
          ],
        },
        {
          text: "Runtime",
          collapsed: true,
          items: [
            {
              text: "HTTP",
              link: "/api/http",
            },
            {
              text: "WebSocket",
              link: "/api/websocket",
            },
            {
              text: "Async",
              link: "/api/async",
            },
            {
              text: "P2P",
              link: "/api/p2p",
            },
          ],
        },
        {
          text: "Data",
          collapsed: true,
          items: [
            {
              text: "JSON",
              link: "/api/json",
            },
            {
              text: "KV",
              link: "/api/kv",
            },
          ],
        },
        {
          text: "System",
          collapsed: true,
          items: [
            {
              text: "ThreadPool",
              link: "/api/threadpool",
            },
            {
              text: "Middleware",
              link: "/api/middleware",
            },
            {
              text: "Config",
              link: "/api/config",
            },
          ],
        },
        {
          text: "Log",
          collapsed: true,
          items: [
            {
              text: "Overview",
              link: "/api/log",
            },
            {
              text: "Server Pretty Logs",
              link: "/api/log/server-pretty-logs",
            },
          ],
        },
      ],
    },
  ],
};

/* ========================================================================
 * 7. CONTRIBUTING
 * ===================================================================== */

const contributingSidebar = {
  text: "Contributing",
  collapsed: false,
  items: [
    {
      text: "Contribution",
      link: "/contributing",
    },
    {
      text: "Pull Requests",
      link: "/pull-request",
    },
    {
      text: "Code of Conduct",
      link: "/code-of-conduct",
    },
    {
      text: "Security",
      link: "/security",
    },
  ],
};

const sidebar = [
  getStartedSidebar,
  guidesSidebar,
  conceptsSidebar,
  diagnosticsSidebar,
  referenceSidebar,
  advancedSidebar,
  contributingSidebar,
];

export default defineConfig({
  lang: "en-US",

  title: "Vix.cpp Documentation",
  description:
    "Vix.cpp is a modern C++ runtime and developer toolkit for building, running, testing, formatting, and packaging C++ applications.",

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
        content:
          "Learn how to build fast and reliable C++ applications with Vix.cpp.",
      },
    ],
    ["meta", { property: "og:site_name", content: "Vix.cpp Documentation" }],

    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Vix.cpp Documentation" }],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "Learn how to build fast and reliable C++ applications with Vix.cpp.",
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
