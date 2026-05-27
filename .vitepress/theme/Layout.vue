<script setup>
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;

const links = [
  { text: "Docs", href: "/" },
  { text: "Guides", href: "/guides/build-rest-api" },
  { text: "API", href: "/api/index" },
  { text: "Modules", href: "/modules/core/" },
  { text: "Registry", href: "https://registry.vixcpp.com" },
  { text: "GitHub", href: "https://github.com/vixcpp/vix" },
];
</script>

<template>
  <Layout>
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
              v-for="link in links"
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
          <span>Built by Softadastra</span>
        </div>
      </footer>
    </template>
  </Layout>
</template>

<style>
/* ============================================================
   Vix.cpp docs footer
   Flat expert style
   ============================================================ */

.vix-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.vix-footer-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 18px 32px 14px;
  display: grid;
  grid-template-columns: minmax(220px, auto) 1fr;
  align-items: center;
  gap: 24px;
}

.vix-footer-brand {
  min-width: 0;
}

.vix-footer-name {
  display: block;
  font-size: 13px;
  line-height: 1.3;
  font-weight: 760;
  letter-spacing: -0.015em;
  color: var(--vp-c-text-1);
}

.vix-footer-desc {
  display: block;
  margin-top: 3px;
  font-size: 12px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.vix-footer-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 18px;
  flex-wrap: wrap;
}

.vix-footer-link {
  font-size: 12px;
  line-height: 1.4;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.12s ease;
}

.vix-footer-link:hover {
  color: var(--vp-c-text-1);
  text-decoration: none;
}
.vix-footer {
  position: relative;
  flex-shrink: 0;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.vix-footer-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 18px 32px 14px;
}

.vix-footer-meta {
  position: relative;
  max-width: 1180px;
  margin: 0 auto;
  padding: 10px 32px 16px;
  border-top: 0 !important;
}

.vix-footer-meta::before {
  content: "";
  position: absolute;
  top: 0;
  left: calc(-1 * var(--vix-doc-sidebar-width, 300px));
  right: 0;
  height: 1px;
  background: var(--vp-c-divider);
}

@media (min-width: 1440px) {
  .vix-footer-meta::before {
    left: calc(-1 * var(--vix-doc-sidebar-width, 320px));
  }
}

@media (max-width: 959px) {
  .vix-footer-meta::before {
    left: 0;
  }
}
.vix-footer-meta {
  max-width: 1180px;
  margin: 0 auto;
  padding: 10px 32px 16px;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 18px;
  flex-wrap: wrap;
  font-size: 11.5px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.VPFooter {
  display: none !important;
}

@media (max-width: 760px) {
  .vix-footer-inner {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 16px 18px 12px;
  }

  .vix-footer-nav {
    justify-content: flex-start;
    gap: 14px;
  }

  .vix-footer-meta {
    padding: 10px 18px 14px;
    gap: 10px;
  }
}

@media (max-width: 460px) {
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
/* Footer aligned with the documentation content, not behind the sidebar */
@media (min-width: 960px) {
  .vix-footer {
    margin-left: 0 !important;
    padding-left: var(--vix-doc-sidebar-width, 300px);
    border-left: 0 !important;
  }

  .vix-footer-inner,
  .vix-footer-meta {
    max-width: none;
    margin-left: 0;
    margin-right: 0;
  }
}

@media (min-width: 1440px) {
  .vix-footer {
    padding-left: var(--vix-doc-sidebar-width, 320px);
  }
}

@media (max-width: 959px) {
  .vix-footer {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }
}

@media (min-width: 1440px) {
  .vix-footer {
    margin-left: var(--vix-doc-sidebar-width, 320px);
  }
}

@media (max-width: 959px) {
  .vix-footer {
    margin-left: 0;
    border-left: 0;
  }
}
</style>
