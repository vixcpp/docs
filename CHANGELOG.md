# Changelog

All notable changes to this project will be documented in this file.
The format is based on Keep a Changelog
and this project adheres to Semantic Versioning
.

[Unreleased]

## Added

- Modular C++ framework structure with core, orm, cli, docs, middleware, websocket, devtools, examples.
- App class for simplified HTTP server setup.
- Router system supporting dynamic route parameters (/users/{id} style).
- JSON response wrapper using nlohmann::json.
- Middleware system for request handling.
- Example endpoints /hello, /ping, and /users/{id}.
- Thread-safe signal handling for graceful shutdown.
- Basic configuration system (Config class) to manage JSON config files.

## Changed

- Logger integrated using spdlog with configurable log levels.
- Improved request parameter extraction for performance.

## Fixed

- Path parameter extraction to correctly handle string_view types.
- Fixed default response for unmatched routes (404 JSON message).
