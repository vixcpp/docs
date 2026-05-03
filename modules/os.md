# OS

The **os module** provides simple, cross-platform access to operating system information and utilities.

It is designed to be:

- simple
- predictable
- cross-platform
- dependency-free (except core Vix modules)
- consistent with the Vix API design

## Philosophy

The os module follows strict principles:

- no hidden behavior
- explicit error handling (`Result<T>`)
- minimal abstractions
- platform differences handled internally
- stable and portable API

The goal is to give modern OS capabilities in C++ without friction.

## Install

Using Vix:

```bash
vix add @vix/os
```

## Quick Start

```cpp
#include <vix/os/Os.hpp>
#include <iostream>

int main()
{
  auto platform = vix::os::platform();
  auto arch = vix::os::arch();

  if (platform && arch)
  {
    std::cout << platform.value() << " / " << arch.value() << "\n";
  }
}
```

## System Identification

```cpp
vix::os::platform();        // linux, windows, macos
vix::os::arch();            // x86_64, arm64, ...
vix::os::kernel_version();  // kernel version
vix::os::hostname();        // machine hostname
```

## User & Process

```cpp
vix::os::current_user(); // username, home, shell
vix::os::current_pid();  // process id
vix::os::is_admin();     // admin / root check
```

## Directories

```cpp
vix::os::home_dir(); // user home directory
vix::os::temp_dir(); // temp directory
```

## System Resources

```cpp
vix::os::cpu_count(); // number of logical CPUs
vix::os::page_size(); // memory page size
vix::os::uptime();    // system uptime (seconds)
```

## Utilities

```cpp
vix::os::sleep_for_ms(500);
vix::os::sleep_for_seconds(1);
```

## Error Handling

All functions returning data use:

```cpp
vix::error::Result<T>
```

Example:

```cpp
auto result = vix::os::hostname();

if (!result)
{
  std::cerr << result.error().message() << "\n";
}
else
{
  std::cout << result.value() << "\n";
}
```

## Data Structures

### UserInfo

```cpp
struct UserInfo
{
  std::string username;
  std::string home_dir;
  std::string shell;
};
```

### OsInfo

```cpp
struct OsInfo
{
  std::string platform;
  std::string architecture;
  std::string kernel_version;
  std::string hostname;
};
```

### CpuInfo

```cpp
struct CpuInfo
{
  std::string model;
  std::uint32_t cores;
  std::uint32_t threads;
};
```

### MemoryInfo

```cpp
struct MemoryInfo
{
  std::uint64_t total_bytes;
  std::uint64_t available_bytes;
};
```

## Examples

### Basic

```cpp
#include <vix/os/Os.hpp>
#include <iostream>

int main()
{
  auto host = vix::os::hostname();
  if (host)
  {
    std::cout << host.value() << "\n";
  }
}
```

### System Info

```cpp
auto cpu = vix::os::cpu_count();
auto uptime = vix::os::uptime();
```

## Design Notes

- Uses native system APIs internally
- Avoids heavy dependencies
- Designed for CLI tools, servers, and system-level applications
- Compatible with Linux, macOS, and Windows

## Future Improvements

- detailed CPU information
- memory statistics per process
- environment introspection integration
- advanced process and system metrics

## Summary

The os module gives you:

- system identity
- user and process info
- directories
- hardware basics
- simple OS utilities

All in a clean, modern C++ API.

## Vix

A modern runtime for real-world C++ systems.

