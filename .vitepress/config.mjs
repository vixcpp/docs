import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "en-US",

  title: "Vix.cpp Documentation",
  description:
    "Learn how to build fast and reliable C++ applications with Vix.cpp.",

  base: "/",

  cleanUrls: true,

  markdown: {
    html: true,
    lineNumbers: true,
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
  ],

  vite: {
    optimizeDeps: {
      include: ["mark.js", "minisearch"],
    },

    ssr: {
      noExternal: ["mark.js"],
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return;
            }

            if (id.includes("minisearch")) {
              return "minisearch";
            }

            if (id.includes("mark.js")) {
              return "markjs";
            }

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

    nav: [
      {
        text: "Download PDF",
        link: "/vixcpp-documentation.pdf",
      },
      {
        text: "Registry",
        link: "https://registry.vixcpp.com/",
      },
    ],

    sidebar: [
      {
        text: "Getting Started",
        collapsed: false,
        items: [
          {
            text: "Welcome to Vix.cpp",
            link: "/getting-started/",
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
      },
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
            text: "Routes",
            link: "/book/04-routes",
          },
          {
            text: "Request and Response",
            link: "/book/05-request-response",
          },
          {
            text: "Build a JSON API",
            link: "/book/06-json-api",
          },
          {
            text: "Middleware",
            link: "/book/07-middleware",
          },
          {
            text: "Validation",
            link: "/book/08-validation",
          },
          {
            text: "Errors and Logging",
            link: "/book/09-errors-and-logging",
          },
          {
            text: "Database",
            link: "/book/10-database",
          },
          {
            text: "Realtime WebSocket",
            link: "/book/11-realtime-websocket",
          },
          {
            text: "Async Runtime",
            link: "/book/12-async-runtime",
          },
          {
            text: "Cache",
            link: "/book/13-cache",
          },
          {
            text: "Offline-first Sync",
            link: "/book/14-offline-first-sync",
          },
          {
            text: "P2P",
            link: "/book/15-p2p",
          },
          {
            text: "Production Deployment",
            link: "/book/16-production-deployment",
          },
          {
            text: "Next Steps",
            link: "/book/17-next-steps",
          },
        ],
      },

      {
        text: "Guides",
        items: [
          { text: "Build a REST API", link: "/guides/build-rest-api" },
          { text: "Validation", link: "/guides/validation" },
          { text: "Authentication", link: "/guides/authentication" },
          { text: "Sessions", link: "/guides/sessions" },
          { text: "CORS", link: "/guides/cors" },
          { text: "Rate limiting", link: "/guides/rate-limiting" },
          { text: "SQLite API", link: "/guides/sqlite-api" },
          { text: "MySQL API", link: "/guides/mysql-api" },
          { text: "WebSocket chat", link: "/guides/websocket-chat" },
          { text: "Static files", link: "/guides/static-files" },
          { text: "Templates", link: "/guides/templates" },
          {
            text: "Production: Nginx + systemd",
            link: "/guides/production-nginx-systemd",
          },
        ],
      },

      {
        text: "CLI",
        collapsed: true,
        items: [
          {
            text: "Overview",
            link: "/cli/",
          },
          {
            text: "REPL",
            link: "/cli/repl",
          },
          {
            text: "vix new",
            link: "/cli/new",
          },
          {
            text: "vix modules",
            link: "/cli/modules",
          },
          {
            text: "vix make",
            link: "/cli/make",
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
          {
            text: "Dependencies",
            items: [
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
            text: "Packaging",
            items: [
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
            ],
          },
          {
            text: "Advanced",
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
                text: "vix orm",
                link: "/cli/orm",
              },
              {
                text: "vix p2p",
                link: "/cli/p2p",
              },
            ],
          },
          {
            text: "System",
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
          {
            text: "All Commands",
            link: "/cli/commands",
          },
        ],
      },
      {
        text: "Experimental",
        collapsed: true,
        items: [
          {
            text: "vix.app",
            link: "/experimental/vix-app",
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
            text: "Hello HTTP",
            link: "/examples/hello-http",
          },
          {
            text: "JSON API",
            link: "/examples/json-api",
          },
          {
            text: "Middleware",
            link: "/examples/middleware",
          },
          {
            text: "Authentication",
            link: "/examples/auth",
          },
          {
            text: "Database",
            link: "/examples/database",
          },
          {
            text: "WebSocket",
            link: "/examples/websocket",
          },
          {
            text: "Cache",
            link: "/examples/cache",
          },
          {
            text: "Sync",
            link: "/examples/sync",
          },
          {
            text: "P2P",
            link: "/examples/p2p",
          },
          {
            text: "Production App",
            link: "/examples/production-app",
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

      {
        text: "Modules",
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
        ],
      },

      {
        text: "Releases",
        collapsed: true,
        items: [
          {
            text: "Overview",
            link: "/releases/",
          },
          {
            text: "Builds",
            link: "/releases/builds",
          },
          {
            text: "Changelog",
            link: "/releases/changelog",
          },
        ],
      },

      ,
      {
        text: "Internals",
        collapsed: true,
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
            text: "Error Diagnostics",
            link: "/internals/error-diagnostics",
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
