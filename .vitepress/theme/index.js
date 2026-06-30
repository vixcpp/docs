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

        setTimeout(applyHighlight, 80);
        setTimeout(applyHighlight, 200);
      });
    };

    const refreshPage = () => {
      syncVixHeaderHeight();
      queueHighlight();
    };

    window.requestAnimationFrame(() => {
      refreshPage();
      setTimeout(refreshPage, 80);
      setTimeout(refreshPage, 200);
    });

    if (router) {
      const previous = router.onAfterRouteChanged;

      router.onAfterRouteChanged = (to) => {
        previous?.(to);

        setTimeout(refreshPage, 30);
        setTimeout(refreshPage, 120);
      };
    }
  },
};
