// ============================================================
// vix-shiki-theme.mjs
// Your EXACT cb-* palette expressed as a Shiki TextMate theme.
// Shiki colors code AT BUILD TIME → zero JS, zero flash.
//
// Color map (1:1 from your custom.css cb-* tokens):
//   cb-kw    #569cd6   keywords (if, return, class, const, ...)
//   cb-ctrl  #c586c0   control flow + preprocessor (#include, if/for)
//   cb-type  #4ec9b0   types (int, std::string, App, ThreadPool)
//   cb-ns    #4fc1ff   namespaces / SCREAMING constants (std, vix)
//   cb-fn    #dcdcaa   functions / builtins
//   cb-mem   #9cdcfe   member access (.field, ->field)
//   cb-str   #ce9178   strings + include paths
//   cb-char  #d7ba7d   char literals
//   cb-num   #b5cea8   numbers
//   cb-cmt   #6a9955   comments
//   cb-op    rgba(230,237,243,.55) operators/punctuation
//   text     #e6edf3   default foreground
//   Shell:
//   cb-sh-prompt #22c55e  cb-sh-cmd #38bdf8  cb-sh-flag #fb923c
//   cb-sh-path   #a5b4fc  cb-sh-comment #6a9955
// ============================================================

const FG = "#e6edf3";
const OP = "#9bb0c0"; // solid equiv. of rgba(230,237,243,.55) for theme JSON

export const vixDark = {
  name: "vix-dark",
  type: "dark",
  colors: {
    "editor.background": "#0d1117",
    "editor.foreground": FG,
  },
  settings: [
    { settings: { foreground: FG, background: "#0d1117" } },

    // comments → cb-cmt
    {
      scope: [
        "comment",
        "punctuation.definition.comment",
        "comment.line",
        "comment.block",
      ],
      settings: { foreground: "#6a9955" },
    },

    // keywords → cb-kw
    {
      scope: [
        "keyword",
        "storage.type",
        "storage.modifier",
        "keyword.other",
        "keyword.operator.new",
        "keyword.operator.delete",
        "keyword.operator.sizeof",
        "variable.language.this",
        "constant.language.cpp",
      ],
      settings: { foreground: "#569cd6" },
    },

    // control flow + preprocessor → cb-ctrl
    {
      scope: [
        "keyword.control",
        "keyword.control.flow",
        "keyword.control.return",
        "keyword.control.directive",
        "meta.preprocessor",
        "punctuation.definition.directive",
        "entity.name.function.preprocessor",
      ],
      settings: { foreground: "#c586c0" },
    },

    // types → cb-type
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "entity.name.namespace",
        "support.type",
        "support.class",
        "support.type.posix-reserved",
        "support.type.built-in",
        "storage.type.built-in",
        "storage.type.class",
        "storage.type.struct",
        "storage.type.user-defined",
        "entity.other.inherited-class",
        "meta.template.argument",
        "meta.body.struct entity.name.type",
      ],
      settings: { foreground: "#4ec9b0" },
    },

    // namespaces (std, vix) + SCREAMING constants → cb-ns
    {
      scope: [
        "entity.name.scope-resolution",
        "variable.other.constant",
        "constant.other",
        "support.constant",
        "constant.language",
      ],
      settings: { foreground: "#4fc1ff" },
    },

    // functions / builtins → cb-fn
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call entity.name.function",
        "variable.function",
      ],
      settings: { foreground: "#dcdcaa" },
    },

    // member access → cb-mem
    {
      scope: [
        "variable.other.property",
        "variable.other.member",
        "meta.member",
        "support.variable.property",
      ],
      settings: { foreground: "#9cdcfe" },
    },

    // strings → cb-str (+ include paths)
    {
      scope: [
        "string",
        "string.quoted",
        "string.quoted.double",
        "string.quoted.other.lt-gt.include",
        "meta.preprocessor.string",
      ],
      settings: { foreground: "#ce9178" },
    },

    // char literals → cb-char
    {
      scope: ["string.quoted.single", "constant.character"],
      settings: { foreground: "#d7ba7d" },
    },

    // numbers → cb-num
    {
      scope: ["constant.numeric", "constant.language.boolean"],
      settings: { foreground: "#b5cea8" },
    },

    // operators / punctuation → cb-op
    {
      scope: [
        "keyword.operator",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.accessor",
        "meta.brace",
        "punctuation.section",
      ],
      settings: { foreground: OP },
    },

    // ---- Shell ----
    {
      scope: [
        "source.shell entity.name.command",
        "support.function.builtin.shell",
      ],
      settings: { foreground: "#38bdf8" },
    },
    {
      scope: ["source.shell variable.parameter", "constant.other.option"],
      settings: { foreground: "#fb923c" },
    },
    {
      scope: ["source.shell string", "source.shell string.quoted"],
      settings: { foreground: "#a5b4fc" },
    },

    // ---- JS/TS/HTML/CSS extras (so web snippets look right too) ----
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: "#569cd6" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#9cdcfe" },
    },
    {
      scope: ["support.type.property-name.css", "support.type.property-name"],
      settings: { foreground: "#9cdcfe" },
    },
    {
      scope: ["entity.other.attribute-name.class.css", "entity.name.tag.css"],
      settings: { foreground: "#dcdcaa" },
    },
    {
      scope: ["constant.other.color", "support.constant.color"],
      settings: { foreground: "#b5cea8" },
    },
  ],
};

// Light variant — same hues tuned for white background
export const vixLight = {
  name: "vix-light",
  type: "light",
  colors: {
    "editor.background": "#f6f7f8",
    "editor.foreground": "#1a1f24",
  },
  settings: [
    { settings: { foreground: "#1a1f24", background: "#f6f7f8" } },
    { scope: ["comment"], settings: { foreground: "#5c8a3c" } },
    {
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: "#0550ae" },
    },
    {
      scope: [
        "keyword.control",
        "meta.preprocessor",
        "keyword.control.directive",
      ],
      settings: { foreground: "#8250df" },
    },
    {
      scope: [
        "entity.name.type",
        "support.type",
        "entity.name.class",
        "entity.name.namespace",
      ],
      settings: { foreground: "#0f766e" },
    },
    {
      scope: [
        "variable.other.constant",
        "constant.language",
        "entity.name.scope-resolution",
      ],
      settings: { foreground: "#0369a1" },
    },
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: "#8a6d00" },
    },
    {
      scope: ["variable.other.property", "variable.other.member"],
      settings: { foreground: "#0a5cc7" },
    },
    { scope: ["string", "string.quoted"], settings: { foreground: "#a8410f" } },
    { scope: ["constant.numeric"], settings: { foreground: "#3f6212" } },
    {
      scope: ["keyword.operator", "punctuation.separator"],
      settings: { foreground: "#57606a" },
    },
  ],
};
