<script setup>
import CodeBlock from "./CodeBlock.vue";

const heroCode = `#include <vix.hpp>

using namespace vix;

int main()
{
  App app;

  app.get("/", [](Request&, Response& res) {
    res.send("Hello from Vix.cpp");
  });

  app.run(8080);
}`;

const features = [
  {
    title: "HTTP APIs",
    desc: "Build fast C++ APIs with clear routing, predictable behavior, and low overhead.",
    icon: "swap",
    href: "/modules/core",
  },
  {
    title: "WebSockets",
    desc: "Create real-time services with connection handling designed for production workloads.",
    icon: "bolt",
    href: "/modules/websocket",
  },
  {
    title: "Async Tasks",
    desc: "Run timers, background jobs, and concurrent workloads with a unified async runtime.",
    icon: "chip",
    href: "/modules/async",
  },
  {
    title: "Local-first Systems",
    desc: "Build reliable applications that keep working under unstable networks and failure conditions.",
    icon: "p2p",
    href: "/book/18-offline-first-sync",
  },
];

function iconPath(name) {
  if (name === "swap") {
    return "M7 7h11l-2-2m2 2l-2 2M17 17H6l2 2m-2-2l2-2";
  }

  if (name === "bolt") {
    return "M13 2L4 14h7l-1 8 9-12h-7l1-8z";
  }

  if (name === "chip") {
    return "M9 9h6v6H9V9zm-5 3h2m12 0h2M12 4v2m0 12v2M6.5 6.5l1.4 1.4m8.2 8.2l1.4 1.4m0-12.4l-1.4 1.4M7.9 16.1l-1.4 1.4";
  }

  return "M6 12a2 2 0 114 0 2 2 0 01-4 0zm8-6a2 2 0 114 0 2 2 0 01-4 0zm0 12a2 2 0 114 0 2 2 0 01-4 0zM10 12l4-6M10 12l4 6";
}
</script>

<template>
  <div class="vix-docs-hero">
    <div class="vix-docs-hero__left">
      <h1 class="vix-docs-h1">Vix.cpp Documentation</h1>

      <p class="vix-docs-lead">
        A modern C++ runtime for building fast and reliable applications.
      </p>

      <p class="vix-docs-body">
        Vix.cpp helps you build real applications in C++ with a clean runtime for
        HTTP APIs, WebSockets, async tasks, and local-first systems. It is built
        for explicit code, predictable performance, and production environments
        where reliability matters.
      </p>

      <div class="actions">
        <a class="primary" href="//book/05-run-your-first-file">
          Get started
          <span class="cta-arrow">→</span>
        </a>
      </div>
    </div>

    <div class="vix-docs-hero__right">
      <div class="vix-hero-annot vix-hint">
        Define an endpoint, return a response,<br />
        and run your C++ application.
      </div>

      <CodeBlock
        title="main.cpp"
        lang="cpp"
        :chips="['http']"
        :code="heroCode"
        :maxHeight="360"
      />
    </div>
  </div>

  <div class="vix-hero-cards">
    <a
      v-for="f in features"
      :key="f.title"
      class="vix-hero-card"
      :href="f.href"
    >
      <div class="vix-hero-card__top">
        <div class="vix-hero-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              :d="iconPath(f.icon)"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div class="vix-hero-card__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <div class="vix-hero-card__title">{{ f.title }}</div>
      <div class="vix-hero-card__desc">{{ f.desc }}</div>
    </a>
  </div>
</template>
