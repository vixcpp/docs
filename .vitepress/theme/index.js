import DefaultTheme from "vitepress/theme";
import "./custom.css";

import Layout from "./Layout.vue";
import DocsHomeHero from "./DocsHomeHero.vue";
import CodeTabs from "./CodeTabs.vue";
import CodeBlock from "./CodeBlock.vue";

import { highlight, normalizeLang } from "./highlighter";

export default {
  ...DefaultTheme,
  Layout,

  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);

    const { app, router } = ctx;

    app.component("DocsHomeHero", DocsHomeHero);
    app.component("CodeTabs", CodeTabs);
    app.component("CodeBlock", CodeBlock);

    if (typeof window === "undefined") {
      return;
    }

    // ──────────────────────────────────────────────
    // Scroll handling
    // ──────────────────────────────────────────────
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.addEventListener(
      "load",
      () => {
        window.scrollTo(0, 0);
      },
      { once: true },
    );

    // ──────────────────────────────────────────────
    // Route prefetch on hover/focus
    // Helps VitePress navigation feel instant on internal pages.
    // Avoids heavy/static files like PDF, images, archives, etc.
    // ──────────────────────────────────────────────
    const prefetchedRoutes = new Set();

    const shouldPrefetchRoute = (href) => {
      if (!href) return false;
      if (!href.startsWith("/")) return false;
      if (href.startsWith("//")) return false;
      if (href.includes("#")) return false;
      if (prefetchedRoutes.has(href)) return false;

      // Avoid prefetching heavy/static files.
      if (
        /\.(pdf|zip|tar|gz|png|jpg|jpeg|webp|gif|svg|ico|mp4|webm|woff2?)$/i.test(
          href,
        )
      ) {
        return false;
      }

      return true;
    };

    const prefetchRoute = (href) => {
      if (!shouldPrefetchRoute(href)) return;

      prefetchedRoutes.add(href);

      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      link.as = "document";

      document.head.appendChild(link);
    };

    const handlePrefetchIntent = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const anchor = target.closest("a[href^='/']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      prefetchRoute(href);
    };

    document.addEventListener("mouseover", handlePrefetchIntent, {
      passive: true,
    });

    document.addEventListener("focusin", handlePrefetchIntent, {
      passive: true,
    });

    // ──────────────────────────────────────────────
    // Custom header layout sync
    // ──────────────────────────────────────────────
    const syncVixHeaderHeight = () => {
      const header = document.querySelector(".vix-nav");
      if (!header) return;

      const height = Math.ceil(header.getBoundingClientRect().height);

      document.documentElement.style.setProperty(
        "--vix-header-height",
        `${height}px`,
      );
    };

    window.addEventListener("load", syncVixHeaderHeight, { once: true });
    window.addEventListener("resize", syncVixHeaderHeight, { passive: true });

    window.requestAnimationFrame(() => {
      syncVixHeaderHeight();
      setTimeout(syncVixHeaderHeight, 80);
    });

    const headerObserver = new MutationObserver(() => {
      syncVixHeaderHeight();
    });

    headerObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // ──────────────────────────────────────────────
    // Custom syntax highlighter for VitePress fenced blocks
    // Runs on every page mount + route change
    // ──────────────────────────────────────────────
    const applyHighlight = () => {
      const blocks = document.querySelectorAll(
        '.vp-doc div[class*="language-"] code, .vp-doc [class*="language-"] code',
      );

      blocks.forEach((codeEl) => {
        if (codeEl.dataset.vixHighlighted === "1") return;

        const container = codeEl.closest('[class*="language-"]');
        if (!container) return;

        const cls = container.className.match(/language-([\w+-]+)/);
        const rawLang = cls ? cls[1] : "text";
        const lang = normalizeLang(rawLang);

        const raw = codeEl.textContent || "";

        codeEl.innerHTML = highlight(raw, lang);
        codeEl.dataset.vixHighlighted = "1";

        container.classList.add("vix-styled");
      });
    };

    let highlightQueued = false;

    const queueHighlight = () => {
      if (highlightQueued) return;

      highlightQueued = true;

      window.requestAnimationFrame(() => {
        highlightQueued = false;

        applyHighlight();

        // Second pass for blocks that mount slightly later.
        setTimeout(applyHighlight, 50);
      });
    };

    queueHighlight();

    // Re-run on every route change.
    if (router && typeof router.onAfterRouteChange === "function") {
      const previousAfterRouteChange = router.onAfterRouteChange;

      router.onAfterRouteChange = (to) => {
        previousAfterRouteChange?.(to);
        queueHighlight();
        syncVixHeaderHeight();
      };
    } else if (router) {
      router.onAfterRouteChanged = () => {
        queueHighlight();
        syncVixHeaderHeight();
      };
    }

    // Safety net: re-run only when unhighlighted code blocks appear.
    const docObserver = new MutationObserver(() => {
      const pending = document.querySelector(
        '.vp-doc [class*="language-"] code:not([data-vix-highlighted])',
      );

      if (pending) {
        queueHighlight();
      }
    });

    docObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
};
