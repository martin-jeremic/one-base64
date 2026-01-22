# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-16

### Added
- Initial release of Base64 Encoder/Decoder extension
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
