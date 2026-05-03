# Tests

Native testing module for Vix.cpp.

## Overview

`vix::tests` provides a simple, explicit, and dependency-light testing system for C++.

It is designed to:

- Be the **single source of truth** for testing in Vix
- Avoid heavy frameworks and macros
- Provide a clean and readable API
- Work standalone or inside the Vix umbrella
- Integrate optionally with CTest

## Philosophy

- No hidden magic
- No macro-heavy API
- Explicit test registration
- Exceptions for failure handling
- Minimal dependencies

## Basic Example

```cpp
#include <vix/tests/TestRegistry.hpp>
#include <vix/tests/TestRunner.hpp>
#include <vix/tests/TestCase.hpp>
#include <vix/tests/Assert.hpp>

int main()
{
  using namespace vix::tests;

  auto &registry = TestRegistry::instance();

  registry.add(TestCase("basic test", [] {
    Assert::equal(2 + 2, 4);
  }));

  return TestRunner::run_all_and_exit();
}
```

## Assertions

```cpp
Assert::is_true(condition);
Assert::is_false(condition);

Assert::equal(expected, actual);
Assert::not_equal(a, b);

Assert::fail("message");
```

All assertions throw `AssertionError` on failure.

## Test Suites

```cpp
TestSuite math("math");

math.add(TestCase("add", [] {
  Assert::equal(1 + 1, 2);
}));

math.add(TestCase("mul", [] {
  Assert::equal(2 * 2, 4);
}));

TestRegistry::instance().add(std::move(math));
```

## Running Tests

```cpp
return TestRunner::run_all_and_exit();
```

Output example:

```
[PASS] basic test
[FAIL] another test -> Expected [4] but got [5]

Summary: total=2 passed=1 failed=1 duration_ms=0.12
```

## CMake Usage

```cmake
find_package(vix_tests REQUIRED)

target_link_libraries(my_tests PRIVATE vix::tests)
```

## Optional CTest Integration

Enable with:

```
-DVIX_TESTS_ENABLE_CTEST=ON
```

This allows integration with CTest without making it the source of truth.

## Build Options

| Option | Description |
|--------|------------|
| VIX_TESTS_BUILD_TESTS | Build internal module tests |
| VIX_TESTS_ENABLE_CTEST | Enable CTest integration |

## Structure

- include/vix/tests/ → Public API
- src/ → Implementation
- examples/ → Usage examples
- test/ → Internal tests

## Design Goals

- Fast compilation
- Simple API
- Predictable behavior
- Easy integration in any C++ project
- Consistent with Vix architecture

