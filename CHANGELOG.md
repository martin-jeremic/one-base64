# 1.0.0 (2026-02-04)


### Bug Fixes

* add lint ([08dd6fa](https://github.com/martin-jeremic/one-base64/commit/08dd6fa98c699d1cc8bcc5d1782e434b25c1a53c))
* fix pipelines ([62d97e6](https://github.com/martin-jeremic/one-base64/commit/62d97e6e744a4c5893645567e0d0a728a7bd87dc))
* update ([d37c973](https://github.com/martin-jeremic/one-base64/commit/d37c973360abe7f1eee54db16e95eb064690cda6))
* update ([e755bca](https://github.com/martin-jeremic/one-base64/commit/e755bca0daed3eac7b07ff228bf626b655153941))
* update ([c8c7dbf](https://github.com/martin-jeremic/one-base64/commit/c8c7dbf439c6b140f3901fce00d4aa9d1315e466))
* update ([e34434c](https://github.com/martin-jeremic/one-base64/commit/e34434cf2f3dae2dd9965a9b7b7ab63404b0d131))
* update package lock ([6183ef8](https://github.com/martin-jeremic/one-base64/commit/6183ef824c40d9e9093aff36ea8740c5a1bdaedd))
* update repo url ([50a90eb](https://github.com/martin-jeremic/one-base64/commit/50a90eb914aec8e577a36047a504d2e3e9eb14da))
* update repo url ([0625876](https://github.com/martin-jeremic/one-base64/commit/06258761822400ae99f9869494dc29928532ea3d))


### Features

* init ([527fd01](https://github.com/martin-jeremic/one-base64/commit/527fd014943d9814199c6e2fbff5a78b2b2f3cfe))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-16

### Added
- Initial release of one-base64 extension
- Encode selected text to Base64 (`Ctrl+Shift+B` / `Cmd+Shift+B`)
- Decode Base64 text to string (`Ctrl+Shift+U` / `Cmd+Shift+U`)
- Fully offline operation with zero external dependencies
- Built-in error handling with user-friendly messages
- Keyboard shortcuts for both Windows/Linux and Mac
- Complete documentation in README

### Features
- In-place text replacement (preserves undo/redo)
- UTF-8 character encoding support (handles emojis and special characters)
- Lazy activation for fast startup
- Uses Node.js Buffer API (built-in, no npm packages)
- TypeScript source with compiled JavaScript distribution
- ESLint configuration for code quality
