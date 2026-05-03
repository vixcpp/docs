# Templates

The Vix template engine removes complexity found in traditional template systems.
No magic. No hidden state. Just a clean pipeline:

```
Loader → Lexer → Parser → AST → Template → Renderer
```

## Example

### Template

```
Hello {{ name }}
{% if user %}Welcome{% endif %}
```

### C++

```cpp
#include <vix/template/Engine.hpp>

using namespace vix::template_;

int main() {
  Engine engine;

  Context ctx;
  ctx.set("name", "Alice");
  ctx.set("user", true);

  auto result = engine.render_string(
    "Hello {{ name }} {% if user %}Welcome{% endif %}",
    ctx
  );

  std::cout << result.output;
}
```

### Output

```
Hello Alice Welcome
```

## Features (V1)

- Variable interpolation
- If conditions
- For loops
- HTML escaping (automatic)
- AST-based rendering
- Deterministic execution
- Optional caching

## Syntax

### Variables

```
{{ name }}
```

### Condition

```
{% if user %}
Hello
{% endif %}
```

### Loop

```
{% for item in items %}
{{ item }}
{% endfor %}
```

## Why Vix Template Engine

### Deterministic

Same input → same output
No hidden behavior

### Minimal

Only essential features
No over-engineering

### Performance-first

- AST reused across renders
- no dynamic parsing at runtime
- low allocations

### C++ Native

No runtime dependency
Full control over memory and performance

## Build

```bash
vix build
```

## Run Examples

```bash
./build-ninja/template_basic_render
./build-ninja/template_loops_and_conditions
```

## Benchmarks

```bash
./build-ninja/template_render_bench
./build-ninja/template_parse_bench
./build-ninja/template_cache_bench
```

## Architecture

The engine is built on a clean separation of concerns:

- Loader → source retrieval
- Lexer → tokenization
- Parser → AST creation
- Template → compiled structure
- Renderer → execution

This makes the system:

- easy to understand
- easy to extend
- easy to optimize

## Roadmap

Upcoming features:

- Filters (`{{ name | upper }}`)
- Includes
- Layout inheritance
- Expression system
- Compiler optimizations

## Philosophy

The goal is not to be complex first.

The goal is to be:

- correct
- fast
- extensible

