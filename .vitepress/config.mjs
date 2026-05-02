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
        text: "Home",
        link: "https://vixcpp.com/",
      },
      {
        text: "Docs",
        link: "/",
      },
      {
        text: "Registry",
        link: "https://registry.vixcpp.com/",
      },
      {
        text: "GitHub",
        link: "https://github.com/vixcpp/vix",
      },
    ],

    sidebar: [
      {
        text: "Start Here",
        collapsed: false,
        items: [
          {
            text: "Introduction",
            link: "/",
          },
          {
            text: "What is Vix.cpp?",
            link: "/introduction/what-is-vix",
          },
          {
            text: "Why Vix Exists",
            link: "/introduction/why-vix-exists",
          },
          {
            text: "Vix Mental Model",
            link: "/introduction/mental-model",
          },
          {
            text: "Vix vs Frameworks",
            link: "/introduction/vix-vs-frameworks",
          },
        ],
      },

      {
        text: "Getting Started",
        collapsed: false,
        items: [
          {
            text: "Install Vix",
            link: "/getting-started/install",
          },
          {
            text: "Create a Project",
            link: "/getting-started/create-project",
          },
          {
            text: "Run a C++ File",
            link: "/getting-started/run-cpp-file",
          },
          {
            text: "Your First HTTP Server",
            link: "/getting-started/first-http-server",
          },
          {
            text: "Project Structure",
            link: "/getting-started/project-structure",
          },
        ],
      },

      {
        text: "Learn Vix",
        collapsed: false,
        items: [
          {
            text: "The App Object",
            link: "/learn/app",
          },
          {
            text: "Routes",
            link: "/learn/routes",
          },
          {
            text: "Request and Response",
            link: "/learn/request-response",
          },
          {
            text: "Route Parameters",
            link: "/learn/route-parameters",
          },
          {
            text: "Query Parameters",
            link: "/learn/query-parameters",
          },
          {
            text: "JSON Responses",
            link: "/learn/json-responses",
          },
          {
            text: "Middleware",
            link: "/learn/middleware",
          },
          {
            text: "Configuration",
            link: "/learn/configuration",
          },
          {
            text: "Error Handling",
            link: "/learn/error-handling",
          },
          {
            text: "Logging",
            link: "/learn/logging",
          },
        ],
      },

      {
        text: "Build APIs",
        collapsed: false,
        items: [
          {
            text: "REST API from Scratch",
            link: "/api-guides/rest-api-from-scratch",
          },
          {
            text: "Validation",
            link: "/api-guides/validation",
          },
          {
            text: "Authentication",
            link: "/api-guides/authentication",
          },
          {
            text: "Sessions",
            link: "/api-guides/sessions",
          },
          {
            text: "JWT",
            link: "/api-guides/jwt",
          },
          {
            text: "CORS",
            link: "/api-guides/cors",
          },
          {
            text: "Rate Limiting",
            link: "/api-guides/rate-limiting",
          },
          {
            text: "OpenAPI",
            link: "/api-guides/openapi",
          },
        ],
      },

      {
        text: "Realtime",
        collapsed: true,
        items: [
          {
            text: "WebSocket Introduction",
            link: "/realtime/websocket-introduction",
          },
          {
            text: "Chat Server",
            link: "/realtime/chat-server",
          },
          {
            text: "Presence",
            link: "/realtime/presence",
          },
          {
            text: "Notifications",
            link: "/realtime/notifications",
          },
          {
            text: "Streaming",
            link: "/realtime/streaming",
          },
        ],
      },

      {
        text: "Data",
        collapsed: true,
        items: [
          {
            text: "Database Basics",
            link: "/data/database-basics",
          },
          {
            text: "SQLite",
            link: "/data/sqlite",
          },
          {
            text: "MySQL",
            link: "/data/mysql",
          },
          {
            text: "ORM",
            link: "/data/orm",
          },
          {
            text: "Repository Pattern",
            link: "/data/repository-pattern",
          },
          {
            text: "Transactions",
            link: "/data/transactions",
          },
        ],
      },

      {
        text: "Runtime",
        collapsed: true,
        items: [
          {
            text: "How Vix Runs an App",
            link: "/runtime/how-vix-runs-an-app",
          },
          {
            text: "Executor",
            link: "/runtime/executor",
          },
          {
            text: "Thread Pool",
            link: "/runtime/thread-pool",
          },
          {
            text: "Async Tasks",
            link: "/runtime/async-tasks",
          },
          {
            text: "Graceful Shutdown",
            link: "/runtime/graceful-shutdown",
          },
          {
            text: "Performance Model",
            link: "/runtime/performance-model",
          },
        ],
      },

      {
        text: "Offline-first",
        collapsed: true,
        items: [
          {
            text: "What Offline-first Means",
            link: "/offline-first/what-offline-first-means",
          },
          {
            text: "WAL",
            link: "/offline-first/wal",
          },
          {
            text: "Outbox",
            link: "/offline-first/outbox",
          },
          {
            text: "Retry Policy",
            link: "/offline-first/retry-policy",
          },
          {
            text: "Sync Engine",
            link: "/offline-first/sync-engine",
          },
          {
            text: "P2P Nodes",
            link: "/offline-first/p2p-nodes",
          },
          {
            text: "Failure Handling",
            link: "/offline-first/failure-handling",
          },
        ],
      },

      {
        text: "Deployment",
        collapsed: true,
        items: [
          {
            text: "Production Build",
            link: "/deployment/production-build",
          },
          {
            text: "Environment Variables",
            link: "/deployment/environment-variables",
          },
          {
            text: "Run Behind Nginx",
            link: "/deployment/nginx",
          },
          {
            text: "systemd Service",
            link: "/deployment/systemd",
          },
          {
            text: "TLS",
            link: "/deployment/tls",
          },
          {
            text: "Observability",
            link: "/deployment/observability",
          },
        ],
      },

      {
        text: "Examples",
        collapsed: true,
        items: [
          {
            text: "Hello HTTP",
            link: "/examples/hello-http",
          },
          {
            text: "JSON API",
            link: "/examples/json-api",
          },
          {
            text: "REST API",
            link: "/examples/rest-api",
          },
          {
            text: "Auth API",
            link: "/examples/auth-api",
          },
          {
            text: "WebSocket Chat",
            link: "/examples/websocket-chat",
          },
          {
            text: "SQLite API",
            link: "/examples/sqlite-api",
          },
          {
            text: "Offline Sync Demo",
            link: "/examples/offline-sync-demo",
          },
          {
            text: "Production App",
            link: "/examples/production-app",
          },
        ],
      },

      {
        text: "CLI Reference",
        collapsed: true,
        items: [
          {
            text: "Overview",
            link: "/cli/",
          },
          {
            text: "vix new",
            link: "/cli/new",
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
            text: "vix tests",
            link: "/cli/tests",
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
            text: "vix publish",
            link: "/cli/publish",
          },
        ],
      },

      {
        text: "API Reference",
        collapsed: true,
        items: [
          {
            text: "Overview",
            link: "/reference/",
          },
          {
            text: "App",
            link: "/reference/app",
          },
          {
            text: "Request",
            link: "/reference/request",
          },
          {
            text: "Response",
            link: "/reference/response",
          },
          {
            text: "Router",
            link: "/reference/router",
          },
          {
            text: "Middleware",
            link: "/reference/middleware",
          },
          {
            text: "JSON",
            link: "/reference/json",
          },
          {
            text: "WebSocket",
            link: "/reference/websocket",
          },
          {
            text: "Async",
            link: "/reference/async",
          },
          {
            text: "Config",
            link: "/reference/config",
          },
        ],
      },

      {
        text: "Modules",
        collapsed: true,
        items: [
          {
            text: "Core",
            link: "/modules/core/",
          },
          {
            text: "CLI",
            link: "/modules/cli/",
          },
          {
            text: "WebSocket",
            link: "/modules/websocket/",
          },
          {
            text: "Async",
            link: "/modules/async/",
          },
          {
            text: "JSON",
            link: "/modules/json/",
          },
          {
            text: "Database",
            link: "/modules/db/",
          },
          {
            text: "ORM",
            link: "/modules/orm/",
          },
          {
            text: "Cache",
            link: "/modules/cache/",
          },
          {
            text: "Sync",
            link: "/modules/sync/",
          },
          {
            text: "P2P",
            link: "/modules/p2p/",
          },
          {
            text: "Crypto",
            link: "/modules/crypto/",
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
