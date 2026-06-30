/* ============================================================
   Vix.cpp — Syntax highlighter
   Pure JS, no dependencies, matches CodeBlock.vue palette
   Languages: C++, Shell, HTML, CSS, JS/TS, JSON, plain text
   ============================================================ */

/* ── C++ keyword sets (unchanged) ── */
const KW = new Set([
  "alignas",
  "alignof",
  "auto",
  "bool",
  "break",
  "case",
  "catch",
  "char",
  "char8_t",
  "char16_t",
  "char32_t",
  "class",
  "concept",
  "const",
  "consteval",
  "constexpr",
  "constinit",
  "const_cast",
  "continue",
  "co_await",
  "co_return",
  "co_yield",
  "decltype",
  "default",
  "delete",
  "do",
  "double",
  "dynamic_cast",
  "else",
  "enum",
  "explicit",
  "export",
  "extern",
  "false",
  "float",
  "for",
  "friend",
  "goto",
  "if",
  "inline",
  "int",
  "long",
  "mutable",
  "namespace",
  "new",
  "noexcept",
  "nullptr",
  "operator",
  "private",
  "protected",
  "public",
  "register",
  "reinterpret_cast",
  "requires",
  "return",
  "short",
  "signed",
  "sizeof",
  "static",
  "static_assert",
  "static_cast",
  "struct",
  "switch",
  "template",
  "this",
  "thread_local",
  "throw",
  "true",
  "try",
  "typedef",
  "typeid",
  "typename",
  "union",
  "unsigned",
  "using",
  "virtual",
  "void",
  "volatile",
  "wchar_t",
  "while",
  "override",
  "final",
  "import",
  "module",
]);

const CTRL_FLOW = new Set([
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "return",
  "goto",
  "throw",
  "try",
  "catch",
  "co_await",
  "co_return",
  "co_yield",
]);

const TYPES = new Set([
  "size_t",
  "ssize_t",
  "ptrdiff_t",
  "intptr_t",
  "uintptr_t",
  "int8_t",
  "int16_t",
  "int32_t",
  "int64_t",
  "uint8_t",
  "uint16_t",
  "uint32_t",
  "uint64_t",
  "string",
  "string_view",
  "wstring",
  "u8string",
  "u16string",
  "u32string",
  "vector",
  "array",
  "deque",
  "list",
  "forward_list",
  "map",
  "multimap",
  "unordered_map",
  "unordered_multimap",
  "set",
  "multiset",
  "unordered_set",
  "unordered_multiset",
  "stack",
  "queue",
  "priority_queue",
  "pair",
  "tuple",
  "optional",
  "variant",
  "any",
  "expected",
  "unique_ptr",
  "shared_ptr",
  "weak_ptr",
  "function",
  "reference_wrapper",
  "initializer_list",
  "span",
  "mdspan",
  "ranges",
  "thread",
  "mutex",
  "lock_guard",
  "unique_lock",
  "shared_lock",
  "condition_variable",
  "future",
  "promise",
  "async",
  "atomic",
  "atomic_ref",
  "istream",
  "ostream",
  "iostream",
  "ifstream",
  "ofstream",
  "fstream",
  "istringstream",
  "ostringstream",
  "stringstream",
  "regex",
  "smatch",
  "cmatch",
  "chrono",
  "filesystem",
  "format",
  "App",
  "Request",
  "Response",
  "Context",
  "Router",
  "Middleware",
  "Server",
  "Client",
  "Socket",
  "Connection",
  "Session",
  "Handler",
  "Config",
  "Logger",
  "Timer",
  "Task",
  "Channel",
  "Buffer",
  "Stream",
  "ThreadPool",
  "Future",
  "Promise",
  "Awaitable",
]);

const NS = new Set([
  "std",
  "vix",
  "asio",
  "net",
  "http",
  "ws",
  "chrono",
  "filesystem",
  "ranges",
  "views",
  "this_thread",
  "literals",
  "placeholders",
  "execution",
  "threadpool",
]);

const BUILTINS = new Set([
  "cout",
  "cerr",
  "clog",
  "cin",
  "endl",
  "flush",
  "move",
  "forward",
  "swap",
  "exchange",
  "make_unique",
  "make_shared",
  "make_pair",
  "make_tuple",
  "make_optional",
  "static_pointer_cast",
  "dynamic_pointer_cast",
  "reinterpret_pointer_cast",
  "begin",
  "end",
  "cbegin",
  "cend",
  "rbegin",
  "rend",
  "size",
  "empty",
  "data",
  "get",
  "holds_alternative",
  "visit",
  "min",
  "max",
  "clamp",
  "abs",
  "sort",
  "find",
  "find_if",
  "for_each",
  "transform",
  "accumulate",
  "reduce",
  "copy",
  "fill",
  "remove",
  "remove_if",
  "replace",
  "reverse",
  "unique",
  "all_of",
  "any_of",
  "none_of",
  "count",
  "count_if",
  "push_back",
  "push_front",
  "pop_back",
  "pop_front",
  "emplace",
  "emplace_back",
  "insert",
  "erase",
  "clear",
  "reserve",
  "resize",
  "shrink_to_fit",
  "front",
  "back",
  "at",
  "substr",
  "append",
  "assign",
  "open",
  "close",
  "read",
  "write",
  "seek",
  "tell",
  "good",
  "eof",
  "fail",
  "lock",
  "unlock",
  "try_lock",
  "notify_one",
  "notify_all",
  "wait",
  "load",
  "store",
  "fetch_add",
  "fetch_sub",
  "compare_exchange_strong",
  "join",
  "detach",
  "joinable",
  "get_id",
  "sleep_for",
  "sleep_until",
  "yield",
  "to_string",
  "stoi",
  "stol",
  "stoll",
  "stof",
  "stod",
  "stold",
  "printf",
  "sprintf",
  "snprintf",
  "fprintf",
  "malloc",
  "calloc",
  "realloc",
  "free",
  "memcpy",
  "memset",
  "memmove",
  "assert",
  "static_assert",
]);

/* ── JS/TS keyword sets ── */
const JS_KW = new Set([
  "abstract",
  "arguments",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "of",
  "package",
  "private",
  "protected",
  "public",
  "readonly",
  "return",
  "set",
  "static",
  "super",
  "switch",
  "this",
  "throw",
  "try",
  "type",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
  "as",
  "declare",
  "namespace",
  "satisfies",
  "keyof",
  "infer",
]);

const JS_LIT = new Set([
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity",
]);

const JS_BUILTIN = new Set([
  "console",
  "window",
  "document",
  "Object",
  "Array",
  "String",
  "Number",
  "Boolean",
  "Symbol",
  "BigInt",
  "Math",
  "JSON",
  "Date",
  "RegExp",
  "Map",
  "Set",
  "WeakMap",
  "WeakSet",
  "Promise",
  "Proxy",
  "Reflect",
  "Error",
  "TypeError",
  "RangeError",
  "Function",
  "Array",
  "parseInt",
  "parseFloat",
  "isNaN",
  "isFinite",
  "encodeURIComponent",
  "decodeURIComponent",
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
  "fetch",
  "require",
  "module",
  "exports",
  "process",
  "globalThis",
  "ref",
  "reactive",
  "computed",
  "watch",
  "watchEffect",
  "onMounted",
  "onUnmounted",
  "defineProps",
  "defineEmits",
  "defineComponent",
  "createApp",
  "nextTick",
]);

const JS_TYPES = new Set([
  "string",
  "number",
  "boolean",
  "object",
  "any",
  "unknown",
  "never",
  "void",
  "bigint",
  "symbol",
  "Record",
  "Partial",
  "Required",
  "Readonly",
  "Pick",
  "Omit",
  "Exclude",
  "Extract",
  "ReturnType",
  "Parameters",
  "Array",
  "Promise",
  "Map",
  "Set",
]);

/* ── CSS at-rules + common props are detected structurally ── */

/* ── Helpers ── */
function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
function wrap(cls, text) {
  return `<span class="${cls}">${esc(text)}</span>`;
}
function normalizeShellText(raw) {
  return String(raw ?? "")
    .split("\n")
    .map((line) =>
      line.replace(/^\s*>\s?/, "").replace(/\s*>\s*:(\d{2,5})/g, " :$1"),
    )
    .join("\n");
}

/* ════════════════════════════════════════════════
   C++ (unchanged from original)
   ════════════════════════════════════════════════ */
function splitComment(line) {
  let inStr = false,
    inChar = false;
  for (let i = 0; i < line.length - 1; i++) {
    const c = line[i];
    if (!inChar && c === '"' && line[i - 1] !== "\\") inStr = !inStr;
    if (!inStr && c === "'" && line[i - 1] !== "\\") inChar = !inChar;
    if (!inStr && !inChar && line[i] === "/" && line[i + 1] === "/") {
      const before = line.slice(0, i);
      if (before.endsWith("http:") || before.endsWith("https:")) continue;
      return { code: before, comment: line.slice(i) };
    }
  }
  return { code: line, comment: "" };
}
function hlDirective(line) {
  const m = line.match(
    /^(\s*#\s*(?:include|define|pragma|if|ifdef|ifndef|endif|elif|else|undef|error|warning|line)\b)(.*)/,
  );
  if (!m) return null;
  let out = wrap("cb-dir", m[1]);
  const rest = m[2] || "";
  const angle = rest.match(/^(\s*)(<[^>\n]*>)(.*)/);
  if (angle) {
    out += esc(angle[1]) + wrap("cb-inc", angle[2]) + hlInline(angle[3] || "");
    return out;
  }
  const quote = rest.match(/^(\s*)("(?:[^"\\]|\\.)*")(.*)/);
  if (quote) {
    out += esc(quote[1]) + wrap("cb-inc", quote[2]) + hlInline(quote[3] || "");
    return out;
  }
  return out + hlInline(rest);
}
function hlInline(s) {
  let out = "",
    i = 0;
  const isStart = (c) => /[A-Za-z_]/.test(c);
  const isId = (c) => /[A-Za-z0-9_]/.test(c);
  while (i < s.length) {
    const ch = s[i];
    if (ch === '"') {
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === '"' && s[j - 1] !== "\\") break;
        j++;
      }
      const str = s.slice(i, Math.min(j + 1, s.length));
      out += wrap("cb-str", str);
      i += str.length;
      continue;
    }
    if (ch === "'") {
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === "'" && s[j - 1] !== "\\") break;
        j++;
      }
      const lit = s.slice(i, Math.min(j + 1, s.length));
      out += wrap("cb-char", lit);
      i += lit.length;
      continue;
    }
    if (/[0-9]/.test(ch)) {
      const m = s
        .slice(i)
        .match(
          /^(0[xX][0-9A-Fa-f']+|0[bB][01']+|0[0-7']+|[0-9][0-9']*(?:\.[0-9']+)?(?:[eE][+-]?[0-9']+)?)([uUlLfFzZ]{0,3}\b)?/,
        );
      if (m) {
        out += wrap("cb-num", m[0]);
        i += m[0].length;
        continue;
      }
    }
    if (isStart(ch)) {
      let j = i + 1;
      while (j < s.length && isId(s[j])) j++;
      const id = s.slice(i, j);
      const nextNonSp = (() => {
        for (let k = j; k < s.length; k++)
          if (s[k] !== " " && s[k] !== "\t") return s[k];
        return "";
      })();
      const prevNonSp = (() => {
        for (let k = i - 1; k >= 0; k--)
          if (s[k] !== " " && s[k] !== "\t") return s[k];
        return "";
      })();
      if (CTRL_FLOW.has(id)) out += wrap("cb-ctrl", id);
      else if (KW.has(id)) out += wrap("cb-kw", id);
      else if (TYPES.has(id)) out += wrap("cb-type", id);
      else if (NS.has(id)) out += wrap("cb-ns", id);
      else if (BUILTINS.has(id)) out += wrap("cb-blt", id);
      else if (nextNonSp === "(") out += wrap("cb-fn", id);
      else if (nextNonSp === "<" && /^[A-Z]/.test(id))
        out += wrap("cb-type", id);
      else if (prevNonSp === "." || prevNonSp === ">")
        out += wrap("cb-mem", id);
      else if (/^[A-Z][A-Z0-9_]+$/.test(id)) out += wrap("cb-const", id);
      else out += wrap("cb-id", id);
      i = j;
      continue;
    }
    if (s.startsWith("::", i)) {
      out += wrap("cb-op", "::");
      i += 2;
      continue;
    }
    if (s.startsWith("->", i)) {
      out += wrap("cb-arrow", "->");
      i += 2;
      continue;
    }
    if (s.startsWith("<<", i)) {
      out += wrap("cb-op", "<<");
      i += 2;
      continue;
    }
    if (s.startsWith(">>", i)) {
      out += wrap("cb-op", ">>");
      i += 2;
      continue;
    }
    if (s.startsWith("<=", i)) {
      out += wrap("cb-op", "<=");
      i += 2;
      continue;
    }
    if (s.startsWith(">=", i)) {
      out += wrap("cb-op", ">=");
      i += 2;
      continue;
    }
    if (s.startsWith("==", i)) {
      out += wrap("cb-op", "==");
      i += 2;
      continue;
    }
    if (s.startsWith("!=", i)) {
      out += wrap("cb-op", "!=");
      i += 2;
      continue;
    }
    if (s.startsWith("&&", i)) {
      out += wrap("cb-op", "&amp;&amp;");
      i += 2;
      continue;
    }
    if (s.startsWith("||", i)) {
      out += wrap("cb-op", "||");
      i += 2;
      continue;
    }
    if (s.startsWith("+=", i)) {
      out += wrap("cb-op", "+=");
      i += 2;
      continue;
    }
    if (s.startsWith("-=", i)) {
      out += wrap("cb-op", "-=");
      i += 2;
      continue;
    }
    if (/[\(\)\{\}\[\];\,\.\:\=\+\-\*\/\<\>\!\&\|\?\~\%\^]/.test(ch)) {
      if (ch === "{" || ch === "}") out += wrap("cb-brace", ch);
      else if (ch === "(" || ch === ")") out += wrap("cb-paren", ch);
      else if (ch === "[" || ch === "]") out += wrap("cb-bracket", ch);
      else if (ch === ";") out += wrap("cb-semi", ch);
      else out += wrap("cb-op", ch);
      i++;
      continue;
    }
    out += esc(ch);
    i++;
  }
  return out.replace(/(https?:\/\/[^\s<]+)/g, `<span class="cb-url">$1</span>`);
}
export function highlightCpp(raw) {
  return String(raw ?? "")
    .split("\n")
    .map((line) => {
      const { code, comment } = splitComment(line);
      const dir = hlDirective(code);
      return (dir ?? hlInline(code)) + (comment ? wrap("cb-cmt", comment) : "");
    })
    .join("\n");
}

/* ════════════════════════════════════════════════
   SHELL (unchanged)
   ════════════════════════════════════════════════ */
export function highlightShell(raw) {
  let s = esc(normalizeShellText(raw));
  s = s.replace(
    /^(\s*(?:~|\/[^$]*)?\s*\$)/gm,
    `<span class="cb-sh-prompt">$1</span>`,
  );
  s = s.replace(
    /(^\s*(?:<span[^>]*>.*?<\/span>\s*)?)([a-zA-Z0-9_.\/-]+)(\s+)/gm,
    `$1<span class="cb-sh-cmd">$2</span>$3`,
  );
  s = s.replace(
    /(\s--?[a-zA-Z0-9_-]+(?:=[^\s]+)?)/g,
    `<span class="cb-sh-flag">$1</span>`,
  );
  s = s.replace(/(https?:\/\/[^\s]+)/g, `<span class="cb-sh-url">$1</span>`);
  s = s.replace(
    /(\s(?:\.{0,2}\/[^\s]+))/g,
    `<span class="cb-sh-path">$1</span>`,
  );
  s = s.replace(/(:\d{2,5}\b)/g, `<span class="cb-sh-port">$1</span>`);
  s = s.replace(
    /^(HTTP\/\d\.\d\s+\d+\s+.*)$/gm,
    `<span class="cb-sh-http">$1</span>`,
  );
  s = s.replace(/#([^\n]*)/g, `<span class="cb-sh-comment">#$1</span>`);
  return s;
}

/* ════════════════════════════════════════════════
   CSS / SCSS
   Tokenizer walking the string; handles comments, selectors,
   properties, values, units, colors, functions, at-rules, vars.
   ════════════════════════════════════════════════ */
export function highlightCss(raw) {
  const s = String(raw ?? "");
  let out = "",
    i = 0;
  const n = s.length;
  let inBlock = false; // inside { } → property:value context

  const isWs = (c) => c === " " || c === "\t" || c === "\n" || c === "\r";

  while (i < n) {
    const ch = s[i];

    // Comment /* ... */
    if (ch === "/" && s[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(s[j] === "*" && s[j + 1] === "/")) j++;
      j = Math.min(j + 2, n);
      out += wrap("cb-cmt", s.slice(i, j));
      i = j;
      continue;
    }
    // Strings
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && !(s[j] === ch && s[j - 1] !== "\\")) j++;
      out += wrap("cb-str", s.slice(i, Math.min(j + 1, n)));
      i = j + 1;
      continue;
    }
    // At-rules: @media, @import, @keyframes...
    if (ch === "@") {
      let j = i + 1;
      while (j < n && /[a-zA-Z-]/.test(s[j])) j++;
      out += wrap("cb-dir", s.slice(i, j));
      i = j;
      continue;
    }
    // CSS variable / custom property --foo
    if (ch === "-" && s[i + 1] === "-") {
      let j = i + 2;
      while (j < n && /[a-zA-Z0-9-]/.test(s[j])) j++;
      out += wrap("cb-const", s.slice(i, j));
      i = j;
      continue;
    }
    // Hex color #fff / #d8b76a
    if (ch === "#" && /[0-9a-fA-F]/.test(s[i + 1] || "")) {
      let j = i + 1;
      while (j < n && /[0-9a-fA-F]/.test(s[j])) j++;
      out += wrap("cb-num", s.slice(i, j));
      i = j;
      continue;
    }
    // Number + optional unit
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(s[i + 1] || ""))) {
      let j = i;
      while (j < n && /[0-9.]/.test(s[j])) j++;
      let unit = j;
      while (unit < n && /[a-zA-Z%]/.test(s[unit])) unit++;
      out += wrap("cb-num", s.slice(i, j));
      if (unit > j) out += wrap("cb-blt", s.slice(j, unit));
      i = unit;
      continue;
    }
    // Block braces
    if (ch === "{") {
      inBlock = true;
      out += wrap("cb-brace", ch);
      i++;
      continue;
    }
    if (ch === "}") {
      inBlock = false;
      out += wrap("cb-brace", ch);
      i++;
      continue;
    }
    // Important
    if (ch === "!" && /^!important\b/.test(s.slice(i))) {
      out += wrap("cb-ctrl", "!important");
      i += 10;
      continue;
    }
    // Identifiers — meaning depends on context
    if (/[a-zA-Z_.#&*>~\[\]=:-]/.test(ch) && !isWs(ch)) {
      // selector chunk vs property/value
      let j = i;
      while (j < n && /[a-zA-Z0-9_-]/.test(s[j])) j++;
      const word = s.slice(i, j);
      if (j === i) {
        out += esc(ch);
        i++;
        continue;
      }

      // peek next non-space
      let k = j;
      while (k < n && isWs(s[k])) k++;
      const next = s[k] || "";

      if (!inBlock) {
        // selector context
        if (s[i] === "." || s[i] === "#") {
          /* handled char-by-char below */
        }
        out += wrap("cb-fn", word); // selectors as function-ish color
      } else {
        if (next === ":")
          out += wrap("cb-kw", word); // property name
        else if (next === "(")
          out += wrap("cb-fn", word); // function value e.g. var(), calc()
        else out += wrap("cb-type", word); // value keyword e.g. flex, auto
      }
      i = j;
      continue;
    }
    // Selector punctuation . # & emphasised
    if (ch === "." || ch === "#" || ch === "&") {
      out += wrap("cb-sh-cmd", ch);
      i++;
      continue;
    }
    if (ch === ":") {
      out += wrap("cb-op", ch);
      i++;
      continue;
    }
    if (ch === ";") {
      out += wrap("cb-semi", ch);
      i++;
      continue;
    }
    if (ch === "(" || ch === ")") {
      out += wrap("cb-paren", ch);
      i++;
      continue;
    }
    if (ch === "[" || ch === "]") {
      out += wrap("cb-bracket", ch);
      i++;
      continue;
    }
    if (/[,>~+*=]/.test(ch)) {
      out += wrap("cb-op", ch);
      i++;
      continue;
    }

    out += esc(ch);
    i++;
  }
  return out;
}

/* ════════════════════════════════════════════════
   JavaScript / TypeScript
   ════════════════════════════════════════════════ */
export function highlightJs(raw) {
  const s = String(raw ?? "");
  let out = "",
    i = 0;
  const n = s.length;
  const isStart = (c) => /[A-Za-z_$]/.test(c);
  const isId = (c) => /[A-Za-z0-9_$]/.test(c);

  while (i < n) {
    const ch = s[i];

    // Line comment
    if (ch === "/" && s[i + 1] === "/") {
      let j = i;
      while (j < n && s[j] !== "\n") j++;
      out += wrap("cb-cmt", s.slice(i, j));
      i = j;
      continue;
    }
    // Block comment
    if (ch === "/" && s[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(s[j] === "*" && s[j + 1] === "/")) j++;
      j = Math.min(j + 2, n);
      out += wrap("cb-cmt", s.slice(i, j));
      i = j;
      continue;
    }
    // Template literal
    if (ch === "`") {
      let j = i + 1;
      while (j < n && !(s[j] === "`" && s[j - 1] !== "\\")) j++;
      out += wrap("cb-str", s.slice(i, Math.min(j + 1, n)));
      i = j + 1;
      continue;
    }
    // Strings
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && !(s[j] === ch && s[j - 1] !== "\\")) j++;
      out += wrap("cb-str", s.slice(i, Math.min(j + 1, n)));
      i = j + 1;
      continue;
    }
    // Numbers
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(s[i + 1] || ""))) {
      const m = s
        .slice(i)
        .match(
          /^(0[xX][0-9A-Fa-f_]+|0[bB][01_]+|[0-9][0-9_]*(?:\.[0-9_]+)?(?:[eE][+-]?[0-9]+)?n?)/,
        );
      if (m) {
        out += wrap("cb-num", m[0]);
        i += m[0].length;
        continue;
      }
    }
    // Identifiers / keywords
    if (isStart(ch)) {
      let j = i + 1;
      while (j < n && isId(s[j])) j++;
      const id = s.slice(i, j);
      let k = j;
      while (k < n && (s[k] === " " || s[k] === "\t")) k++;
      const next = s[k] || "";
      let p = i - 1;
      while (p >= 0 && (s[p] === " " || s[p] === "\t")) p--;
      const prev = s[p] || "";

      if (JS_LIT.has(id)) out += wrap("cb-const", id);
      else if (JS_KW.has(id)) out += wrap("cb-kw", id);
      else if (
        JS_TYPES.has(id) &&
        (prev === ":" || prev === "<" || prev === "|")
      )
        out += wrap("cb-type", id);
      else if (JS_BUILTIN.has(id)) out += wrap("cb-blt", id);
      else if (next === "(") out += wrap("cb-fn", id);
      else if (prev === ".") out += wrap("cb-mem", id);
      else if (/^[A-Z]/.test(id))
        out += wrap("cb-type", id); // ClassName / Component
      else out += wrap("cb-id", id);
      i = j;
      continue;
    }
    // Arrow
    if (s.startsWith("=>", i)) {
      out += wrap("cb-arrow", "=>");
      i += 2;
      continue;
    }
    // Multi-char operators
    const ops3 = ["===", "!==", "...", "??=", "&&=", "||=", ">>>"];
    const ops2 = [
      "==",
      "!=",
      "<=",
      ">=",
      "&&",
      "||",
      "??",
      "?.",
      "+=",
      "-=",
      "*=",
      "/=",
      "=>",
      "++",
      "--",
      "**",
      "<<",
      ">>",
    ];
    let matched = false;
    for (const op of ops3)
      if (s.startsWith(op, i)) {
        out += wrap("cb-op", op);
        i += 3;
        matched = true;
        break;
      }
    if (matched) continue;
    for (const op of ops2)
      if (s.startsWith(op, i)) {
        out += wrap("cb-op", op === "&&" ? "&amp;&amp;" : op);
        i += 2;
        matched = true;
        break;
      }
    if (matched) continue;
    // Punctuation
    if (ch === "{" || ch === "}") {
      out += wrap("cb-brace", ch);
      i++;
      continue;
    }
    if (ch === "(" || ch === ")") {
      out += wrap("cb-paren", ch);
      i++;
      continue;
    }
    if (ch === "[" || ch === "]") {
      out += wrap("cb-bracket", ch);
      i++;
      continue;
    }
    if (ch === ";") {
      out += wrap("cb-semi", ch);
      i++;
      continue;
    }
    if (/[=+\-*/<>!&|?~%^:.,]/.test(ch)) {
      out += wrap("cb-op", ch);
      i++;
      continue;
    }

    out += esc(ch);
    i++;
  }
  return out;
}

/* ════════════════════════════════════════════════
   HTML / Vue templates
   ════════════════════════════════════════════════ */
export function highlightHtml(raw) {
  const s = String(raw ?? "");
  let out = "",
    i = 0;
  const n = s.length;

  while (i < n) {
    const ch = s[i];

    // Comment <!-- ... -->
    if (s.startsWith("<!--", i)) {
      let j = i + 4;
      while (j < n && !s.startsWith("-->", j)) j++;
      j = Math.min(j + 3, n);
      out += wrap("cb-cmt", s.slice(i, j));
      i = j;
      continue;
    }
    // Mustache interpolation {{ ... }}
    if (s.startsWith("{{", i)) {
      let j = i + 2;
      while (j < n && !s.startsWith("}}", j)) j++;
      j = Math.min(j + 2, n);
      out +=
        wrap("cb-brace", "{{") +
        wrap("cb-id", s.slice(i + 2, j - 2)) +
        wrap("cb-brace", "}}");
      i = j;
      continue;
    }
    // Tag
    if (ch === "<") {
      // HTML declarations: <!DOCTYPE html>, <!---->, <![CDATA[...]]
      // Without this, <!DOCTYPE html> can freeze the parser.
      if (s.startsWith("<!", i)) {
        let j = i + 2;

        while (j < n && s[j] !== ">") {
          j++;
        }

        const end = j < n ? j + 1 : n;
        out += wrap("cb-dir", s.slice(i, end));
        i = end;
        continue;
      }

      // XML / processing instructions: <?xml ... ?>
      if (s.startsWith("<?", i)) {
        let j = i + 2;

        while (j < n && !s.startsWith("?>", j)) {
          j++;
        }

        const end = j < n ? j + 2 : n;
        out += wrap("cb-dir", s.slice(i, end));
        i = end;
        continue;
      }

      let j = i + 1;
      const isClose = s[j] === "/";
      if (isClose) j++;
      const tagStart = j;
      while (j < n && /[a-zA-Z0-9-]/.test(s[j])) j++;
      const tag = s.slice(tagStart, j);
      out += wrap("cb-op", isClose ? "</" : "<");
      if (tag) out += wrap("cb-kw", tag);

      // attributes until >
      while (j < n && s[j] !== ">") {
        const c = s[j];
        if (c === " " || c === "\t" || c === "\n" || c === "\r") {
          out += esc(c);
          j++;
          continue;
        }
        if (c === "/") {
          out += wrap("cb-op", "/");
          j++;
          continue;
        }
        // attribute name (incl. Vue : @ v- # bindings)
        let a = j;
        while (a < n && /[a-zA-Z0-9_:@.\-#\[\]]/.test(s[a])) a++;
        const attr = s.slice(j, a);

        if (!attr) {
          out += esc(c);
          j++;
          continue;
        }

        // Vue directive style vs normal
        if (/^(v-|:|@|#)/.test(attr)) out += wrap("cb-fn", attr);
        else out += wrap("cb-type", attr);

        j = a;
        // = "value"
        if (s[j] === "=") {
          out += wrap("cb-op", "=");
          j++;
          if (s[j] === '"' || s[j] === "'") {
            const q = s[j];
            let v = j + 1;
            while (v < n && s[v] !== q) v++;
            out += wrap("cb-str", s.slice(j, Math.min(v + 1, n)));
            j = v + 1;
          }
        }
      }
      if (s[j] === ">") {
        out += wrap("cb-op", ">");
        j++;
      }
      i = j;
      continue;
    }

    // text node
    let t = i;
    while (t < n && s[t] !== "<" && !s.startsWith("{{", t)) t++;
    out += esc(s.slice(i, t));
    i = t;
  }
  return out;
}

/* ════════════════════════════════════════════════
   JSON
   ════════════════════════════════════════════════ */
export function highlightJson(raw) {
  const s = String(raw ?? "");
  let out = "",
    i = 0;
  const n = s.length;
  while (i < n) {
    const ch = s[i];
    if (ch === '"') {
      let j = i + 1;
      while (j < n && !(s[j] === '"' && s[j - 1] !== "\\")) j++;
      const str = s.slice(i, Math.min(j + 1, n));
      // key if followed by colon
      let k = j + 1;
      while (k < n && /\s/.test(s[k])) k++;
      out += wrap(s[k] === ":" ? "cb-fn" : "cb-str", str);
      i = j + 1;
      continue;
    }
    if (/[0-9-]/.test(ch)) {
      const m = s.slice(i).match(/^-?[0-9][0-9.eE+-]*/);
      if (m) {
        out += wrap("cb-num", m[0]);
        i += m[0].length;
        continue;
      }
    }
    if (/^(true|false|null)/.test(s.slice(i))) {
      const m = s.slice(i).match(/^(true|false|null)/)[0];
      out += wrap("cb-const", m);
      i += m.length;
      continue;
    }
    if (ch === "{" || ch === "}") {
      out += wrap("cb-brace", ch);
      i++;
      continue;
    }
    if (ch === "[" || ch === "]") {
      out += wrap("cb-bracket", ch);
      i++;
      continue;
    }
    if (ch === ":" || ch === ",") {
      out += wrap("cb-op", ch);
      i++;
      continue;
    }
    out += esc(ch);
    i++;
  }
  return out;
}

/* ── Plain text passthrough ── */
export function highlightText(raw) {
  return esc(raw ?? "");
}

/* ════════════════════════════════════════════════
   Dispatcher + language alias normalizer
   ════════════════════════════════════════════════ */
export function normalizeLang(lang) {
  const l = String(lang || "")
    .toLowerCase()
    .trim();
  if (["sh", "bash", "zsh", "shell", "console", "terminal"].includes(l))
    return "shell";
  if (["cpp", "c++", "cc", "cxx", "hpp", "hxx", "h", "c"].includes(l))
    return "cpp";
  if (["html", "vue", "htm", "xml", "svg"].includes(l)) return "html";
  if (["css", "scss", "sass", "less", "postcss"].includes(l)) return "css";
  if (
    [
      "js",
      "javascript",
      "ts",
      "typescript",
      "jsx",
      "tsx",
      "mjs",
      "cjs",
    ].includes(l)
  )
    return "js";
  if (["json", "jsonc", "json5"].includes(l)) return "json";
  if (["txt", "text", "plain", "plaintext"].includes(l)) return "text";
  return l || "text";
}

export function highlight(raw, lang) {
  switch (normalizeLang(lang)) {
    case "cpp":
      return highlightCpp(raw);
    case "shell":
      return highlightShell(raw);
    case "html":
      return highlightHtml(raw);
    case "css":
      return highlightCss(raw);
    case "js":
      return highlightJs(raw);
    case "json":
      return highlightJson(raw);
    default:
      return highlightText(raw);
  }
}
