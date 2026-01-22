# Base64 Encoder/Decoder VS Code Extension

## Overview

A lightweight, fully-offline VS Code extension that encodes selected text to Base64 and decodes selected Base64 strings back to text. This extension requires **zero external dependencies** and performs all operations **completely offline** without any API calls.

---

## Features

- **Encode to Base64**: Select any text and encode it to Base64 format
- **Decode from Base64**: Select Base64 text and decode it back to string
- **Keyboard Shortcuts**: 
  - `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac) to encode
  - `Ctrl+Shift+U` (Windows/Linux) or `Cmd+Shift+U` (Mac) to decode
- **In-place Replacement**: Selected text is directly replaced with encoded/decoded result
- **Error Handling**: Meaningful error messages for invalid inputs
- **No External Dependencies**: Pure Node.js + VS Code API implementation

---

## Development & Architecture Decisions

### 1. Project Structure

```
code-addon-b64/
├── src/
│   └── extension.ts          # Main extension code (TypeScript)
├── dist/                     # Compiled JavaScript (generated)
├── package.json              # Project metadata and dependencies
├── tsconfig.json             # TypeScript compiler configuration
├── .vscodeignore             # Files to exclude from packaging
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

**Decision Rationale**: 
- Organized structure separates source code (`src/`) from compiled output (`dist/`)
- Clean separation allows for build pipeline without polluting source files
- Standard VS Code extension structure for maintainability

### 2. Technology Stack

#### Language: TypeScript
**Why TypeScript instead of JavaScript?**
- Type safety catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through type annotations
- Industry standard for VS Code extension development

#### Base64 Implementation: Node.js Buffer API
**Why not use btoa/atob?**
- `btoa` and `atob` are browser APIs, not available in Node.js runtime
- VS Code extensions run in a Node.js environment, not a browser
- `Buffer.from()` and `.toString()` are the correct Node.js approach
- Handles both UTF-8 encoding and decoding properly
- No external libraries needed

```typescript
// Encoding: Convert UTF-8 string → Base64
Buffer.from(text, 'utf8').toString('base64')

// Decoding: Convert Base64 → UTF-8 string  
Buffer.from(text, 'base64').toString('utf8')
```

### 3. VS Code API Usage

#### Extension Activation (`activate` function)
- Called when extension is activated (lazy-loaded on command execution)
- Registers two commands using `vscode.commands.registerCommand()`
- Subscribes to disposables for proper cleanup on deactivation

```typescript
export function activate(context: vscode.ExtensionContext) {
  const encodeCommand = vscode.commands.registerCommand(...);
  context.subscriptions.push(encodeCommand);
}
```

**Decision**: Using subscriptions ensures proper memory cleanup when extension is deactivated.

#### Text Selection & Replacement
- Gets active editor: `vscode.window.activeTextEditor`
- Gets selected text: `editor.document.getText(editor.selection)`
- Replaces text: `editor.edit(editBuilder => editBuilder.replace(selection, newText))`

**Why use `editor.edit()` instead of direct manipulation?**
- VS Code requires using the `TextEditorEdit` API for safe, transactional edits
- Enables undo/redo support automatically
- Properly handles document state management
- Thread-safe within VS Code's event loop

### 4. Error Handling Strategy

#### Input Validation
- Check if editor is active
- Check if text is selected
- Validate Base64 format before decoding

#### User Feedback
- **Success**: Info message after successful conversion
- **Warning**: Warning if no text is selected
- **Error**: Error messages for invalid Base64 or processing failures

```typescript
try {
  const decoded = decodeFromBase64(selectedText);
  replaceSelectedText(editor, decoded);
  vscode.window.showInformationMessage('Base64 decoded to text');
} catch (error) {
  vscode.window.showErrorMessage(`Decoding failed: ${error}`);
}
```

### 5. Configuration & Keybindings

**package.json `contributes` section** defines:

1. **Commands** in Command Palette:
   - `base64Encoder.encode`: "Base64: Encode selection"
   - `base64Encoder.decode`: "Base64: Decode selection"

2. **Keybindings**:
   - Windows/Linux: `Ctrl+Shift+B` for encode, `Ctrl+Shift+U` for decode
   - Mac: `Cmd+Shift+B` for encode, `Cmd+Shift+U` for decode
   - `when: editorTextFocus` ensures bindings only work when editor is focused

**Decision Rationale**:
- Chosen shortcuts are non-conflicting with VS Code defaults (as of v1.90.0)
- Shift+B for "B64" is intuitive and memorable
- Shift+U for "Unlock/Uncode" is logical for decode
- `editorTextFocus` prevents accidental triggering in other contexts

### 6. Offline & No Dependencies Design

#### Why No External Libraries?
- `Buffer` API is built-in to Node.js (no npm package needed)
- VS Code API is provided by the IDE (no npm package needed)
- Reduces security surface area (no third-party code)
- Faster installation and startup
- Smaller package size for distribution

#### No API Calls
- All processing happens locally in the VS Code process
- No network requests to encoding services
- Data never leaves the user's machine
- Works in offline environments

### 7. TypeScript Configuration

**Key tsconfig.json settings**:

| Setting | Value | Reason |
|---------|-------|--------|
| `target` | `ES2020` | Modern JavaScript features; VS Code uses modern Node.js |
| `module` | `commonjs` | VS Code extensions use CommonJS module system |
| `outDir` | `./dist` | Separate compiled output from source |
| `strict` | `true` | Maximum type safety and error detection |
| `esModuleInterop` | `true` | Better CommonJS compatibility |

### 8. Command Registration Details

#### Encode Command: `base64Encoder.encode`
```typescript
vscode.commands.registerCommand('base64Encoder.encode', () => {
  // 1. Get active editor
  // 2. Get selected text
  // 3. Encode using Buffer.from(text, 'utf8').toString('base64')
  // 4. Replace selected text
  // 5. Show success message
});
```

#### Decode Command: `base64Encoder.decode`
```typescript
vscode.commands.registerCommand('base64Encoder.decode', () => {
  // 1. Get active editor
  // 2. Get selected text
  // 3. Decode using Buffer.from(text, 'base64').toString('utf8')
  // 4. Replace selected text
  // 5. Show success message
});
```

Both follow identical error handling pattern for consistency.

---

## Installation & Setup

### Prerequisites
- Node.js 18+ (for development)
- VS Code 1.90.0 or later
- npm (comes with Node.js)

### Development Setup

1. **Clone/Navigate to project directory**:
   ```bash
   cd code-addon-b64
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This installs:
   - TypeScript compiler
   - VS Code type definitions
   - ESLint for code quality
   - Development tools

3. **Compile TypeScript**:
   ```bash
   npm run compile
   ```
   Generates `dist/extension.js` from `src/extension.ts`

4. **Watch mode (for development)**:
   ```bash
   npm run watch
   ```
   Automatically recompiles on file changes

### Testing the Extension

1. **Launch extension in debug mode**:
   - Open the project in VS Code
   - Press `F5` (or `Cmd+Shift+D` then run)
   - New VS Code window opens with extension loaded

2. **Test encoding**:
   - Open any file
   - Select text (e.g., "Hello World")
   - Use Command Palette (`Ctrl+Shift+P`), type "Base64: Encode selection"
   - Text should be replaced with `SGVsbG8gV29ybGQ=`

3. **Test decoding**:
   - Select Base64 text (e.g., `SGVsbG8gV29ybGQ=`)
   - Use Command Palette, type "Base64: Decode selection"
   - Text should be replaced with `Hello World`

### Packaging for Distribution

1. **Install packaging tool**:
   ```bash
   npm install -g @vscode/vsce
   ```

2. **Create VSIX file**:
   ```bash
   vsce package
   ```
   Generates `base64-encoder-1.0.0.vsix` for installation

3. **Install locally**:
   - Open VS Code
   - Extensions > "..." menu > "Install from VSIX..."
   - Select generated `.vsix` file

---

## How It Works

### Encoding Process

1. **Input**: User selects text in editor (e.g., "Hello")
2. **Validation**: Check if text is selected
3. **Processing**: Convert to Buffer with UTF-8 encoding, then output as Base64
4. **Output**: Replace selection with Base64 (e.g., "SGVsbG8=")
5. **Feedback**: Show success message

### Decoding Process

1. **Input**: User selects Base64 text (e.g., "SGVsbG8=")
2. **Validation**: Check if text is selected
3. **Processing**: Convert from Base64 to Buffer, then output as UTF-8 string
4. **Output**: Replace selection with decoded text (e.g., "Hello")
5. **Feedback**: Show success message
6. **Error Handling**: If Base64 is invalid, show error message instead

### Character Encoding

- **Input/Output Encoding**: UTF-8 (standard for text files)
- **Base64 Alphabet**: Standard ASCII characters (A-Z, a-z, 0-9, +, /, =)
- **UTF-8 Handling**: Properly handles multi-byte characters (emojis, special characters)

Example with special characters:
- Input: "Hello 👋" (contains emoji)
- Encoded: "SGVsbG8g/Jil" (properly handles multi-byte UTF-8)
- Decoded: "Hello 👋" (recovers original exactly)

---

## File Descriptions

### `src/extension.ts`
**Purpose**: Main extension logic and VS Code integration
**Size**: ~120 lines
**Key Functions**:
- `activate()`: Extension entry point, registers commands
- `deactivate()`: Cleanup function
- `encodeToBase64()`: Encoding logic using Buffer API
- `decodeFromBase64()`: Decoding logic using Buffer API
- `replaceSelectedText()`: Handles text replacement in editor

### `package.json`
**Purpose**: Extension metadata and configuration
**Contains**:
- Extension name, version, description, publisher
- VS Code compatibility (`engines.vscode`)
- Command definitions (`commands`)
- Keyboard shortcuts (`keybindings`)
- Build scripts (`scripts`)
- Dev dependencies (TypeScript, ESLint, etc.)

### `tsconfig.json`
**Purpose**: TypeScript compiler configuration
**Contains**:
- Compilation target (ES2020)
- Module system (CommonJS)
- Output directory mapping
- Type safety settings
- Source maps for debugging

### `.vscodeignore`
**Purpose**: Specifies files to exclude from package distribution
**Excludes**: Source files, build artifacts, dependencies, test files

### `.gitignore`
**Purpose**: Specifies files to exclude from Git repository
**Excludes**: Node modules, compiled code, IDE artifacts, lock files

---

## Design Philosophy

### Principle 1: Simplicity
- Minimal code, maximum functionality
- Two clear, focused commands
- No complex configuration

### Principle 2: Offline-First
- Zero network dependencies
- Runs in completely disconnected environments
- All processing local to user's machine

### Principle 3: Standard Compliance
- Uses standard Node.js APIs
- Follows VS Code extension guidelines
- UTF-8 encoding standard

### Principle 4: User Safety
- Non-destructive approach (can always undo)
- Clear error messages
- Graceful error handling

### Principle 5: Zero External Dependencies
- Uses built-in APIs only
- No npm package dependencies for runtime
- Minimal dev dependencies (TypeScript, types, linter)

---

## Limitations & Future Enhancements

### Current Limitations
- Single selection only (one contiguous block)
- No encoding format options (always UTF-8)
- No file-based batch processing

### Possible Future Enhancements
- Multi-selection support (convert multiple selections)
- URL encoding/decoding
- Hex encoding/decoding
- Character encoding options (UTF-16, ASCII, etc.)
- Batch encoding from clipboard
- Settings panel for custom keybindings
- Visual indicator for encoding type (Base64, Hex, etc.)

---

## Troubleshooting

### Extension doesn't show commands
**Solution**: Reload VS Code window (`Ctrl+R` in extension host window)

### Keybindings not working
**Solution**: Check if another extension uses same shortcuts; customize in VS Code settings

### Decode fails with "Invalid Base64 string"
**Solution**: Ensure selected text is valid Base64 (only contains A-Z, a-z, 0-9, +, /, =)

### Extension fails to compile
**Solution**: 
```bash
npm install
npm run compile
```

---

## Publishing to VS Code Marketplace

### Prerequisites for Publishing

Before publishing your extension to the VS Code Marketplace, you need:

1. **Microsoft Account** - Create at https://login.microsoftonline.com
2. **Azure DevOps Organization** - Create at https://dev.azure.com
3. **Personal Access Token (PAT)** - Generate in Azure DevOps

### Step-by-Step Publishing Guide

#### 1. Create a Personal Access Token (PAT)

1. Go to https://dev.azure.com
2. Sign in with your Microsoft account
3. Click your profile icon (top right)
4. Select **Personal access tokens**
5. Click **New Token**
6. Fill in:
   - **Name**: `vsce-publisher`
   - **Organization**: Select your organization (or create new)
   - **Expiration**: 365 days (or longer)
   - **Scopes**: Check `Marketplace (Publish)` and `Marketplace (Manage)`
7. Click **Create**
8. **Copy the token** (you won't see it again!)

#### 2. Create a Publisher Profile

1. Go to https://marketplace.visualstudio.com/manage
2. Sign in
3. Click **Create Publisher**
4. Fill in:
   - **Publisher Name**: Your unique identifier (e.g., `your-username`)
   - **Display Name**: Human-readable name (e.g., "Your Company")
5. Click **Create**

#### 3. Update package.json for Publishing

Update your `package.json` with your publisher information:

```json
{
  "name": "base64-encoder",
  "displayName": "Base64 Encoder/Decoder",
  "publisher": "your-publisher-name",
  "version": "1.0.0",
  "description": "Encode and decode selected text to/from Base64...",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/base64-encoder.git"
  },
  "homepage": "https://github.com/your-username/base64-encoder/blob/main/README.md",
  "bugs": {
    "url": "https://github.com/your-username/base64-encoder/issues"
  },
  "license": "MIT"
}
```

**Important Fields**:
- `publisher` - Your publisher ID from step 2
- `repository` - Must be a valid GitHub/Git URL
- `version` - Semantic versioning (1.0.0, 1.0.1, etc.)

#### 4. Prepare Files for Publishing

Ensure these files are present and up-to-date:

```
✅ LICENSE              MIT or other open source license
✅ README.md            Complete documentation
✅ CHANGELOG.md         Version history
✅ package.json         Proper metadata
✅ dist/extension.js    Compiled JavaScript
✅ src/extension.ts     Source code (optional in package)
```

#### 5. Update .vscodeignore for Publishing

The `.vscodeignore` file controls what gets packaged:

```
# Development files (exclude from package)
src/
tsconfig.json
.eslintrc.json
node_modules/
.vscode-test
*.vsix
.DS_Store
test-results/
.git
.gitignore
node_modules/
package-lock.json

# Include in package
dist/
package.json
LICENSE
README.md
CHANGELOG.md
```

**Current .vscodeignore**:
```
out
node_modules
.vscode-test
*.vsix
.DS_Store
src
tsconfig.json
.eslintrc.json
```

#### 6. Build and Package

```bash
# 1. Compile TypeScript
npm run compile

# 2. Create VSIX package
vsce package
```

This generates: `base64-encoder-1.0.0.vsix`

#### 7. Login to vsce

```bash
vsce login your-publisher-name
```

When prompted, paste your Personal Access Token (PAT) from Step 1.

#### 8. Publish to Marketplace

```bash
vsce publish
```

Or publish with automatic version bump:

```bash
vsce publish patch    # 1.0.0 → 1.0.1
vsce publish minor    # 1.0.0 → 1.1.0
vsce publish major    # 1.0.0 → 2.0.0
```

#### 9. Verify Publication

1. Go to https://marketplace.visualstudio.com
2. Search for "Base64 Encoder" (or your display name)
3. Your extension should appear!

### Publishing Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Not authorized"** | Check PAT token is valid and has Marketplace permissions |
| **"Publisher does not exist"** | Verify publisher name matches in package.json |
| **"Invalid repository URL"** | Ensure repository URL is valid and publicly accessible |
| **"Version already exists"** | Increment version in package.json |
| **"Files missing"** | Check that dist/, package.json, LICENSE exist |

### What Gets Published

Files included in the marketplace package:

```
base64-encoder-1.0.0.vsix
├── extension/
│   ├── dist/                (compiled JavaScript)
│   ├── package.json
│   ├── LICENSE
│   ├── README.md
│   └── CHANGELOG.md
└── extension.vsixmanifest
```

Files excluded (via .vscodeignore):
- src/ (source code)
- node_modules/
- tsconfig.json
- .eslintrc.json
- .vscode-test
- .git

### Git Workflow for Publishing

Best practice for maintaining git and marketplace versions:

```bash
# 1. Update version in package.json
# Edit package.json, change version from 1.0.0 to 1.0.1

# 2. Update CHANGELOG
# Add entry for new version

# 3. Commit changes
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 1.0.1"

# 4. Tag release
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin main --tags

# 5. Publish to marketplace
npm run compile
vsce publish
```

### .gitignore Strategy

The `.gitignore` file excludes files not needed for git/deployment:

```
# Exclude from git (can be regenerated)
dist/                 ← Generated by npm run compile
*.vsix                ← Generated by vsce package
node_modules/         ← Generated by npm install
*.log                 ← Development logs
.DS_Store             ← OS files
.vscode-test/         ← Test artifacts

# Include in git (needed for deployment)
src/                  ← Source code
package.json          ← Dependency specification
package-lock.json     ← Locked versions
tsconfig.json         ← Build configuration
LICENSE               ← Required for publishing
README.md             ← Documentation
CHANGELOG.md          ← Version history
```

This approach means:
- ✅ Cleaner git history (no build artifacts)
- ✅ Faster cloning (no dist/ or node_modules/)
- ✅ Easy reproduction (npm install rebuilds everything)
- ✅ Ready for marketplace (LICENSE included)

### Updating After Publication

To publish a new version:

```bash
# 1. Make changes
# Edit src/extension.ts

# 2. Test locally
npm run compile
# F5 to test in VS Code

# 3. Update version
# Edit package.json, change version

# 4. Update changelog
# Edit CHANGELOG.md with new entry

# 5. Commit and tag
git add package.json CHANGELOG.md src/
git commit -m "feat: add new feature"
git tag -a v1.1.0 -m "Release 1.1.0"
git push origin main --tags

# 6. Publish
npm run compile
vsce publish
```

### Managing Multiple Versions

You can unpublish or deprecate old versions:

```bash
# Unpublish a version
vsce unpublish your-publisher-name.base64-encoder@1.0.0

# Deprecate (keeps it available but marked as old)
vsce unpublish your-publisher-name.base64-encoder --force
```

---

## License

MIT License - See [LICENSE](LICENSE) file for details

---

## Summary of Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Language | TypeScript | Type safety, VS Code standards |
| Base64 Library | Node.js Buffer API | Built-in, no dependencies |
| Module System | CommonJS | VS Code extension standard |
| Target Runtime | Node.js ES2020 | VS Code's Node version |
| Error Strategy | Try-catch + UI messages | User-friendly error handling |
| Text Replacement | VS Code API (editor.edit) | Proper undo/redo support |
| Activation | Lazy on command | Fast startup time |
| External APIs | None | Data privacy, offline support |

---

## Quick Reference

### Build Commands
- `npm run compile` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and auto-compile
- `npm run lint` - Check code quality
- `vsce package` - Create distributable VSIX file
- `vsce publish` - Publish to VS Code Marketplace

### Keyboard Shortcuts
- `Ctrl+Shift+B` / `Cmd+Shift+B` - Encode selection
- `Ctrl+Shift+U` / `Cmd+Shift+U` - Decode selection

### Command Palette
- `Base64: Encode selection`
- `Base64: Decode selection`


