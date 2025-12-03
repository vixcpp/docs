<template>
  <div class="markdown-container">
    <article class="markdown-body" v-html="content"></article>
  </div>
</template>

<script>
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export default {
  data() {
    return {
      content: "Loading…",
    };
  },

  created() {
    const slug = this.$route.params.slug;

    fetch(`/posts/${slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error("Markdown not found");
        return res.text();
      })
      .then((md) => {
        marked.setOptions({
          highlight(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
              return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
          },
        });

        // Convert Markdown → HTML
        let html = marked(md);

        // Wrap code blocks with copy button
        html = html
          .replace(
            /<pre><code class="language-([^"]*)">/g,
            `<div class="code-wrapper">
               <button class="copy-btn">Copy</button>
               <pre><code class="language-$1">`
          )
          .replace(/<\/code><\/pre>/g, "</code></pre></div>");

        this.content = html;
      })
      .catch((err) => {
        this.content = `<p style="color:red;">${err.message}</p>`;
      });
  },

  updated() {
    // Copy button logic
    document.querySelectorAll(".copy-btn").forEach((btn) => {
      btn.onclick = () => {
        const code = btn.parentNode.querySelector("code").textContent;
        navigator.clipboard.writeText(code);

        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      };
    });
  },
};
</script>

<style>
/* ------------------------------------------------------------------------------------------------- */
/* GLOBAL CONTAINER */
/* ------------------------------------------------------------------------------------------------- */
.markdown-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Reduce padding on mobile */
@media (max-width: 600px) {
  .markdown-container {
    padding: 12px;
  }
}

/* ------------------------------------------------------------------------------------------------- */
/* BASE TEXT */
/* ------------------------------------------------------------------------------------------------- */
.markdown-body {
  font-size: 16px;
  line-height: 1.7;
}

/* Smaller text on mobile for better fit */
@media (max-width: 600px) {
  .markdown-body {
    font-size: 15px;
  }
}

/* .markdown-body p,
.markdown-body li,
.markdown-body td,
.markdown-body th {
  color: #c9d1d9 !important;
} */

/* ------------------------------------------------------------------------------------------------- */
/* TITLES */
/* ------------------------------------------------------------------------------------------------- */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  color: #ffffff !important;
  border-bottom: 1px solid #30363d;
  padding-bottom: 0.3rem;
  margin-top: 2rem;
  font-weight: 600;
}

/* Adjust title size on mobile */
.markdown-body h1 {
  font-size: 2rem;
}
.markdown-body h2 {
  font-size: 1.6rem;
}
.markdown-body h3 {
  font-size: 1.25rem;
}

@media (max-width: 600px) {
  .markdown-body h1 {
    font-size: 1.7rem;
  }
  .markdown-body h2 {
    font-size: 1.4rem;
  }
  .markdown-body h3 {
    font-size: 1.15rem;
  }
}

/* ------------------------------------------------------------------------------------------------- */
/* LINKS */
/* ------------------------------------------------------------------------------------------------- */
.markdown-body a {
  color: #39d98a;
  text-decoration: none;
  font-weight: 500;
}

.markdown-body a:hover {
  text-decoration: underline;
}

/* ------------------------------------------------------------------------------------------------- */
/* IMAGES */
/* ------------------------------------------------------------------------------------------------- */
.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

/* ------------------------------------------------------------------------------------------------- */
/* TABLES (responsive scroll) */
/* ------------------------------------------------------------------------------------------------- */
.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  display: block;
  overflow-x: auto;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #30363d;
  padding: 8px;
  white-space: nowrap;
}

/* ------------------------------------------------------------------------------------------------- */
/* LISTS */
/* ------------------------------------------------------------------------------------------------- */
.markdown-body ul {
  padding-left: 25px;
  margin: 1rem 0;
}

/* ------------------------------------------------------------------------------------------------- */
/* BLOCKQUOTE */
/* ------------------------------------------------------------------------------------------------- */
.markdown-body blockquote {
  background: #0d1117 !important;
  color: #c9d1d9 !important;
  border-left: 4px solid #2ea043 !important;
  padding: 10px 14px;
  border-radius: 6px;
  margin: 1rem 0;
}

/* Make blockquote breathing room on mobile */
@media (max-width: 600px) {
  .markdown-body blockquote {
    padding: 10px 12px;
  }
}

/* ------------------------------------------------------------------------------------------------- */
/* INLINE CODE */
/* ------------------------------------------------------------------------------------------------- */
.markdown-body code {
  background: #161b22 !important;
  color: #e6edf3 !important;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: "Fira Code", monospace;
}

/* Slightly smaller inline code on small screens */
@media (max-width: 600px) {
  .markdown-body code {
    font-size: 0.8rem;
  }
}

/* ------------------------------------------------------------------------------------------------- */
/* CODE BLOCKS */
/* ------------------------------------------------------------------------------------------------- */
.code-wrapper {
  position: relative;
  margin: 1.2rem 0;
  background: #0d1117 !important;
  border: 1px solid #30363d !important;
  border-radius: 8px;
  overflow: hidden;
}

/* Pre block responsive */
.code-wrapper pre {
  margin: 0 !important;
  padding: 16px;
  overflow-x: auto;
  white-space: pre; /* keeps code formatting */
  word-wrap: normal;
  font-family: "Fira Code", monospace;
  color: #e6edf3 !important;
}

/* Better code readability on mobile */
@media (max-width: 600px) {
  .code-wrapper pre {
    padding: 12px;
    font-size: 0.85rem;
  }
}

/* ------------------------------------------------------------------------------------------------- */
/* COPY BUTTON */
/* ------------------------------------------------------------------------------------------------- */
.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  background: #2ea043;
  color: white;
  padding: 4px 10px;
  font-size: 0.75rem;
  border-radius: 5px;
  cursor: pointer;
  z-index: 10;
}

.copy-btn:hover {
  background: #27963b;
}

/* Larger touch target on mobile */
@media (max-width: 600px) {
  .copy-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
