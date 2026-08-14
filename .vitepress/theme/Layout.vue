<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import Breadcrumb from "./Breadcrumb.vue";

const { Layout } = DefaultTheme;
const route = useRoute();

const showBanner = ref(true);
const isDark = ref(true);

const navLinks = [
  {
    text: "Start Here",
    href: "/getting-started/",
    activePaths: ["/getting-started"],
  },
  {
    text: "Understand Vix",
    href: "/book/01-introduction",
    activePaths: [
      "/book",
      "/guides/vix-vs-cmake",
      "/guides/cpp-runtime",
      "/guides/cpp-developer-toolkit",
    ],
  },
  {
    text: "Build Applications",
    href: "/guides/vix-app/",
    activePaths: [
      "/guides/vix-app",
      "/app-modules",
      "/templates",
      "/examples",
      "/guides/build-rest-api",
      "/guides/websocket-chat",
      "/guides/static-files",
      "/guides/templates",
      "/guides/game",
      "/guides/validation",
      "/guides/authentication",
      "/guides/sessions",
      "/guides/cors",
      "/guides/rate-limiting",
      "/guides/json",
      "/guides/database",
      "/guides/orm",
      "/guides/production-files",
      "/guides/production-nginx-systemd",
    ],
  },
  {
    text: "Vix Modules",
    href: "/modules/core/",
    activePaths: ["/modules"],
  },
  {
    text: "Tooling",
    href: "/cli/",
    activePaths: [
      "/cli",
      "/sdks",
      "/registry",
      "/guides/replay",
      "/guides/runtime-arguments",
      "/guides/diagnostics",
      "/guides/fast-target-builds",
      "/guides/object-cache",
      "/guides/artifact-cache",
    ],
  },
  {
    text: "Reference",
    href: "/api/index",
    activePaths: ["/api"],
  },
];

const footerLinks = [
  {
    text: "Start Here",
    href: "/getting-started/",
  },
  {
    text: "Understand Vix",
    href: "/book/01-introduction",
  },
  {
    text: "Build Applications",
    href: "/guides/vix-app/",
  },
  {
    text: "Vix Modules",
    href: "/modules/core/",
  },
  {
    text: "Tooling",
    href: "/cli/",
  },
  {
    text: "Reference",
    href: "/api/index",
  },
  {
    text: "Internals",
    href: "/internals/architecture",
  },
  {
    text: "Contributing",
    href: "/contributing",
  },
  {
    text: "Registry",
    href: "https://registry.vixcpp.com",
  },
  {
    text: "GitHub",
    href: "https://github.com/vixcpp/vix",
  },
];

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/vixcpp/vix",
    icon: `<path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.48 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.2 9.2 0 0 1 12 7.07c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.79-4.57 5.05.36.32.68.95.68 1.92 0 1.38-.01 2.5-.01 2.84 0 .27.18.59.69.48A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/>`,
  },
  {
    label: "X",
    href: "https://x.com/vix_cpp",
    icon: `<path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-5.2-6.8L5.3 22H2l7.3-8.4L1.7 2h6.9l4.7 6.1L18.9 2Zm-1.2 18h1.7L7.7 3.9H5.9L17.7 20Z"/>`,
  },
];

const normalizePath = (path) => {
  if (!path) return "/";

  const clean = path.split("#")[0].split("?")[0];

  if (clean.length > 1 && clean.endsWith("/")) {
    return clean.slice(0, -1);
  }

  return clean;
};

const pathMatches = (currentPath, targetPath) => {
  const current = normalizePath(currentPath);
  const target = normalizePath(targetPath);

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
};

const isActiveLink = (link) => {
  if (!link || !link.href || link.href.startsWith("http")) {
    return false;
  }

  const currentPath = normalizePath(route.path);

  if (link.activePaths?.length) {
    return link.activePaths.some((path) => pathMatches(currentPath, path));
  }

  return pathMatches(currentPath, link.href);
};

const openSearch = () => {
  const button = document.querySelector(
    ".DocSearch-Button, .VPNavBarSearchButton, .VPLocalSearchBox button",
  );

  if (button instanceof HTMLElement) {
    button.click();
  }
};

const applyTheme = (dark) => {
  isDark.value = dark;

  document.documentElement.classList.toggle("dark", dark);

  localStorage.setItem("vitepress-theme-appearance", dark ? "dark" : "light");
};

const toggleTheme = () => {
  applyTheme(!isDark.value);
};

const syncBannerState = async () => {
  await nextTick();

  document.body.classList.toggle("vix-banner-visible", showBanner.value);

  document.body.classList.toggle("vix-banner-hidden", !showBanner.value);
};

const closeBanner = () => {
  showBanner.value = false;
};

watch(showBanner, syncBannerState);

onMounted(() => {
  const savedTheme = localStorage.getItem("vitepress-theme-appearance");

  if (savedTheme === "dark") {
    applyTheme(true);
  } else if (savedTheme === "light") {
    applyTheme(false);
  } else {
    isDark.value = document.documentElement.classList.contains("dark");
  }

  syncBannerState();
});

onBeforeUnmount(() => {
  document.body.classList.remove("vix-banner-visible", "vix-banner-hidden");
});
</script>

<template>
  <header class="vix-nav" :class="{ 'vix-nav--no-banner': !showBanner }">
    <!-- Announcement banner -->
    <div v-if="showBanner" class="vix-nav__banner">
      <span class="vix-nav__banner-mark" aria-hidden="true">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              id="vix-banner-left"
              x1="5"
              y1="6"
              x2="18"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stop-color="#f4e3b8" />
              <stop offset="55%" stop-color="#e6cd8c" />
              <stop offset="100%" stop-color="#d8b76a" />
            </linearGradient>
            <linearGradient
              id="vix-banner-right"
              x1="31"
              y1="6"
              x2="18"
              y2="30"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stop-color="#d8b76a" />
              <stop offset="100%" stop-color="#a8893f" />
            </linearGradient>
          </defs>
          <polygon points="5,6 12,6 18,28 14,28" fill="url(#vix-banner-left)" />
          <polygon
            points="31,6 24,6 18,28 22,28"
            fill="url(#vix-banner-right)"
          />
          <line
            x1="9"
            y1="16"
            x2="13.5"
            y2="29"
            stroke="#f4e3b8"
            stroke-width="1.1"
            stroke-linecap="round"
            opacity="0.7"
          />
        </svg>
      </span>
      <span class="vix-nav__banner-text">Vix.cpp v2.8.4 is here</span>
      <a
        href="https://blog.vixcpp.com/"
        target="_blank"
        rel="noreferrer"
        aria-label="Read the Vix.cpp blog"
      >
        Read the blog
      </a>
      <button
        class="vix-nav__banner-close"
        type="button"
        aria-label="Close announcement"
        @click="closeBanner"
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>

    <!-- Main bar -->
    <div class="vix-nav__bar">
      <div class="vix-nav__inner">
        <a class="vix-nav__brand" href="/" aria-label="Vix.cpp Documentation">
          <span class="vix-nav__brand-name">Vix.cpp</span>
          <span class="vix-nav__slash">/</span>
          <span class="vix-nav__docs">Docs</span>
        </a>

        <nav class="vix-nav__links" aria-label="Main navigation">
          <a
            v-for="link in navLinks"
            :key="link.text"
            :class="['vix-nav__link', { 'is-active': isActiveLink(link.href) }]"
            :href="link.href"
            :target="link.href.startsWith('http') ? '_blank' : undefined"
            :rel="link.href.startsWith('http') ? 'noreferrer' : undefined"
          >
            {{ link.text }}
          </a>
        </nav>

        <div class="vix-nav__right">
          <button
            class="vix-nav__icon-btn"
            type="button"
            :aria-label="
              isDark ? 'Switch to light theme' : 'Switch to dark theme'
            "
            @click="toggleTheme"
          >
            <svg
              v-if="isDark"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path d="M12 4V2" />
              <path d="M12 22v-2" />
              <path d="m4.93 4.93-1.41-1.41" />
              <path d="m20.48 20.48-1.41-1.41" />
              <path d="M4 12H2" />
              <path d="M22 12h-2" />
              <path d="m4.93 19.07-1.41 1.41" />
              <path d="m20.48 3.52-1.41 1.41" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.8 6.8 0 0 0 9.8 9.8Z" />
            </svg>
          </button>

          <a
            v-for="item in socials"
            :key="item.label"
            class="vix-nav__icon-btn vix-nav__icon-btn--social"
            :href="item.href"
            target="_blank"
            rel="noreferrer"
            :aria-label="item.label"
          >
            <svg
              class="vix-nav__social-svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
              v-html="item.icon"
            ></svg>
          </a>

          <button
            class="vix-nav__search"
            type="button"
            aria-label="Search"
            @click="openSearch"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
            <span>Search</span>
            <kbd>Ctrl K</kbd>
          </button>

          <button
            class="vix-nav__search-mobile"
            type="button"
            aria-label="Search"
            @click="openSearch"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <Layout>
    <template #doc-before>
      <Breadcrumb />
    </template>

    <template #layout-bottom>
      <footer class="vix-footer" role="contentinfo">
        <div class="vix-footer-inner">
          <div class="vix-footer-brand">
            <span class="vix-footer-name">Vix.cpp</span>
            <span class="vix-footer-desc"
              >Modern C++ runtime and developer toolkit.</span
            >
          </div>
          <nav class="vix-footer-nav" aria-label="Footer navigation">
            <a
              v-for="link in footerLinks"
              :key="link.text"
              class="vix-footer-link"
              :href="link.href"
              :target="link.href.startsWith('http') ? '_blank' : undefined"
              :rel="link.href.startsWith('http') ? 'noreferrer' : undefined"
            >
              {{ link.text }}
            </a>
          </nav>
        </div>
        <div class="vix-footer-meta">
          <span>MIT License</span>
          <span>Copyright © 2026 Vix.cpp</span>
          <span>Maintained by Softadastra</span>
        </div>
      </footer>
    </template>
  </Layout>
</template>

<style>
/* ============================================================
   Header geometry — single source of truth
   ============================================================ */
:root {
  --vix-banner-h: 40px;
  --vix-bar-h: 58px;
  --vix-header-h: calc(var(--vix-banner-h) + var(--vix-bar-h));
}
body.vix-banner-hidden {
  --vix-header-h: var(--vix-bar-h);
}

/* Hide VitePress default top nav + footer (we replace them) */
.VPNav {
  display: none !important;
}
.VPFooter {
  display: none !important;
}

/* ============================================================
   HEADER — fixed on desktop, scrolls on mobile
   ============================================================ */
.vix-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

/* Banner */
.vix-nav__banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: var(--vix-banner-h);
  padding: 0 56px;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
}
.vix-nav__banner-mark {
  display: inline-flex;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
.vix-nav__banner-mark svg {
  width: 20px;
  height: 20px;
}
.vix-nav__banner-text {
  color: var(--vp-c-text-1);
}
.vix-nav__banner a {
  color: var(--vix-accent, #d8b76a);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 3px;
  white-space: nowrap;
}
.vix-nav__banner a:hover {
  color: var(--vix-accent-d, #e6cd8c);
}
.vix-nav__banner-close {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}
.vix-nav__banner-close:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}
.vix-nav__banner-close span {
  font-size: 22px;
  line-height: 1;
}

/* Bar */
.vix-nav__bar {
  height: var(--vix-bar-h);
  background: var(--vp-c-bg);
}
.vix-nav__inner {
  display: flex;
  align-items: center;
  gap: 22px;
  height: 100%;
  padding: 0 20px;
}

/* Brand */
.vix-nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
}
.vix-nav__brand:hover {
  text-decoration: none;
}
.vix-nav__brand-name {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.vix-nav__slash {
  color: var(--vp-c-text-3);
  font-size: 17px;
  font-weight: 300;
}
.vix-nav__docs {
  color: var(--vp-c-text-2);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* Links */
.vix-nav__links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1 1 auto;
  min-width: 0;
}
.vix-nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 11px;
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  border-radius: 6px;
  transition:
    color 0.12s ease,
    background-color 0.12s ease;
}
.vix-nav__link:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
}
.vix-nav__link.is-active {
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.vix-nav__link.is-active::after {
  content: "";
  position: absolute;
  left: 11px;
  right: 11px;
  bottom: -1px;
  height: 2px;
  border-radius: 999px;
  background: var(--vix-accent, #d8b76a);
}

/* Right cluster */
.vix-nav__right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 7px;
  flex-shrink: 0;
}
.vix-nav__icon-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  flex-shrink: 0;
  transition:
    background 0.12s ease,
    border-color 0.12s ease;
}
.vix-nav__icon-btn:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-text-3);
}
.vix-nav__icon-btn svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.vix-nav__social-svg {
  width: 16px;
  height: 16px;
  fill: currentColor !important;
  stroke: none !important;
}
.vix-nav__social-svg path {
  fill: currentColor !important;
}

/* Search (desktop) */
.vix-nav__search {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 11px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.12s ease,
    border-color 0.12s ease;
}
.vix-nav__search:hover {
  background: var(--vp-c-bg-alt);
  border-color: var(--vp-c-text-3);
}
.vix-nav__search svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.vix-nav__search span {
  font-size: 12.5px;
  font-weight: 500;
}
.vix-nav__search kbd {
  padding: 1px 5px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 10.5px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
}

/* Compact mobile search — hidden on desktop */
.vix-nav__search-mobile {
  display: none;
  place-items: center;
  width: 32px;
  height: 32px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}
.vix-nav__search-mobile svg {
  width: 15px;
  height: 15px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ============================================================
   FOOTER
   ============================================================ */
.vix-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}
.vix-footer-inner {
  display: grid;
  grid-template-columns: minmax(220px, auto) 1fr;
  align-items: center;
  gap: 24px;
  padding: 20px 32px 16px;
}
.vix-footer-brand {
  min-width: 0;
}
.vix-footer-name {
  display: block;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: var(--vp-c-text-1);
}
.vix-footer-desc {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
.vix-footer-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 20px;
  flex-wrap: wrap;
}
.vix-footer-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.12s ease;
}
.vix-footer-link:hover {
  color: var(--vp-c-text-1);
}
.vix-footer-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 12px 32px 18px;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 12px;
  color: var(--vp-c-text-3);
}

@media (min-width: 960px) {
  .vix-footer {
    padding-left: var(--vix-doc-sidebar-width, 272px);
  }
}
@media (min-width: 1440px) {
  .vix-footer {
    padding-left: var(--vix-doc-sidebar-width, 286px);
  }
}

/* ============================================================
   RESPONSIVE — switch to burger at <=959px
   ============================================================ */
@media (max-width: 1180px) {
  .vix-nav__search kbd {
    display: none;
  }
}

@media (max-width: 959px) {
  /* On mobile the header scrolls away. The VitePress local nav
     (.VPLocalNav) stays fixed and carries the working menu burger
     + the "On this page" dropdown. We don't reinvent either. */
  .vix-nav {
    position: relative;
  }
  .vix-nav__links {
    display: none;
  }
  .vix-nav__search {
    display: none;
  }
  .vix-nav__search-mobile {
    display: grid;
  }
  .vix-nav__inner {
    gap: 12px;
    padding: 0 14px;
  }
  .vix-nav__brand {
    flex: 1 1 auto;
  }
  .vix-footer {
    padding-left: 0 !important;
  }
}

@media (max-width: 640px) {
  .vix-nav__banner {
    justify-content: flex-start;
    padding: 0 42px 0 12px;
    font-size: 12px;
  }
  .vix-nav__banner-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .vix-nav__brand-name {
    font-size: 15px;
  }
  .vix-nav__slash,
  .vix-nav__docs {
    display: none;
  }
  .vix-footer-inner {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 18px 18px 12px;
  }
  .vix-footer-nav {
    justify-content: flex-start;
    gap: 16px;
  }
  .vix-footer-meta {
    padding: 12px 18px 16px;
    gap: 12px;
  }
}

@media (max-width: 460px) {
  .vix-nav__banner a {
    max-width: 92px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .vix-nav__right {
    gap: 5px;
  }
  .vix-footer-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: 100%;
  }
  .vix-footer-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
