# One Base64 VS Code Extension

## Overview

A lightweight, fully-offline VS Code extension that encodes selected text to Base64 and decodes selected Base64 strings back to text. This extension requires **zero external dependencies** and performs all operations **completely offline** without any API calls.

---

## Features

- **Encode to Base64**: Select any text and encode it to Base64 format
- **Decode from Base64**: Select Base64 text and decode it back to string
- **Keyboard Shortcuts**: 
  - `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac) to encode
  - `Ctrl+Shift+U` (Windows/Linux) or `Cmd+Shift+U` (Mac) to decode
- **Right-Click Context Menu**: Right-click on selected text to access "Base64: Encode selection" and "Base64: Decode selection" options
- **In-place Replacement**: Selected text is directly replaced with encoded/decoded result
- **Error Handling**: Meaningful error messages for invalid inputs
- **No External Dependencies**: Pure Node.js + VS Code API implementation

---

## Usage

### Keyboard Shortcuts
1. Select text in the editor
2. Press `Ctrl+Shift+B` to encode or `Ctrl+Shift+U` to decode (Windows/Linux)
3. Or press `Cmd+Shift+B` to encode or `Cmd+Shift+U` to decode (Mac)

### Right-Click Context Menu
1. Select text in the editor
2. Right-click to open the context menu
3. Choose "Base64: Encode selection" to encode or "Base64: Decode selection" to decode
4. The selected text will be immediately replaced with the result

---

