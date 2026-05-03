# Path

The **path module** provides fast, explicit, and cross-platform utilities
to manipulate filesystem paths **lexically** in C++.

It is designed as a low-level building block for:
- filesystem operations (`vix::fs`)
- CLI tools
- configuration systems
- build tools
- backend services

The module favors **predictability**, **portability**, and **explicit behavior**.

## Philosophy

Path handling in Vix follows strict rules:

- No filesystem access
- Purely lexical operations
- Cross-platform behavior (POSIX + Windows)
- No implicit normalization
- Explicit error handling (`Result<T>`)

This ensures that every operation is:
- deterministic
- safe
- easy to reason about

## Core Concepts

| Concept | Purpose |
|--------|--------|
| `join` | Combine path fragments |
| `normalize` | Normalize path lexically |
| `filename` | Extract last component |
| `parent` / `dirname` | Extract parent directory |
| `stem` | Filename without extension |
| `extension` | File extension |
| `relative` | Compute relative path |
| `absolute` | Resolve against base |
| `split` | Decompose path |
| `PathOptions` | Control behavior |
| `Result<T>` | Explicit success / failure |

## Path Model

Paths are treated as **strings with structure**, not as filesystem objects.

Supported forms:

### POSIX
```
/usr/bin
/home/user/file.txt
```

### Windows
```
C:\Windows\System32
C:relative\path
\\server\share
```

Mixed separators are accepted:
```
foo\bar/baz
```

## Joining Paths

```cpp
#include <vix/path/Join.hpp>

auto r = vix::path::join("/home/user", "projects/vix");
```

Result:
```
/home/user/projects/vix
```

## Normalizing Paths

```cpp
#include <vix/path/Normalize.hpp>

auto r = vix::path::normalize("/a//b/./c/../d");
```

Result:
```
/a/b/d
```

## Inspecting Paths

```cpp
#include <vix/path/Filename.hpp>
#include <vix/path/Stem.hpp>
#include <vix/path/Extension.hpp>

auto f = filename("/home/user/main.cpp");
auto s = stem("/home/user/main.cpp");
auto e = extension("/home/user/main.cpp");
```

## Relative Paths

```cpp
#include <vix/path/Relative.hpp>

auto r = relative("/home/user/projects/vix", "/home/user");
```

Result:
```
projects/vix
```

## Absolute Paths

```cpp
#include <vix/path/Absolute.hpp>

auto r = absolute("docs/readme.md", "/home/user");
```

## Split Path

```cpp
#include <vix/path/Split.hpp>

auto r = split("/home/user/main.cpp");
```

## Error Model

All operations return:

```cpp
Result<std::string>
```

## Tests

Run:

```bash
vix build
vix tests
```

