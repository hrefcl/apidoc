# CLI v5 - Modern Command Line Interface

> **New in APIDoc v5.0**: Completely redesigned CLI with subcommands, interactive menu, and modern user experience.

## 📋 Table of Contents

- [Main Features](#main-features)
- [Installation](#installation)
- [Available Commands](#available-commands)
- [Interactive Menu](#interactive-menu)
- [Silent vs Verbose Mode](#silent-vs-verbose-mode)
- [Usage Examples](#usage-examples)
- [Migration from v4](#migration-from-v4)

---

## 🎯 Main Features

### ✨ New in v5

- **🎨 ASCII Banner with Logo**: Displays APIDOC logo and version number
- **📱 Interactive Menu**: Intuitive navigation with @clack/prompts
- **🔇 Silent Mode**: Only shows warnings by default
- **📊 Verbose Mode**: Detailed statistics with `-v` flag
- **⚡ Modern Subcommands**: `init`, `generate`, `export`
- **🎨 Colors and Formatting**: Colorized output with picocolors
- **⏱️ Elegant Spinner**: Progress indicator during generation
- **🔄 Watch Mode**: Automatic regeneration when changes are detected

---

## 📦 Installation

### Global (Recommended)

```bash
npm install -g @hrefcl/apidoc
```

### Local (Per Project)

```bash
npm install --save-dev @hrefcl/apidoc
```

### Verify Installation

```bash
apidoc --version
# Output: 5.0.0-alpha.1
```

---

## 🚀 Available Commands

### 1. `apidoc` - Interactive Menu

Runs the main interactive menu:

```bash
apidoc
```

**Output:**
```
     █████╗ ██████╗ ██╗██████╗  ██████╗  ██████╗
    ██╔══██╗██╔══██╗██║██╔══██╗██╔═══██╗██╔════╝
    ███████║██████╔╝██║██║  ██║██║   ██║██║
    ██╔══██║██╔═══╝ ██║██║  ██║██║   ██║██║
    ██║  ██║██║     ██║██████╔╝╚██████╔╝╚██████╗
    ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝  ╚═════╝

            v5.0.0-alpha.1 • https://apidoc.app

┌  What do you want to do?
│
│  ◯ Initialize new project
│  ◯ Generate documentation
│  ◯ Export documentation
│  ◯ Learn about APIDoc
│
└
```

### 2. `apidoc init` - Initialize Project

Interactive project setup with step-by-step wizard:

```bash
apidoc init
```

**Features:**
- ✅ Automatically detects `package.json`
- ✅ Configures `apidoc.json` interactively
- ✅ Suggests input directories
- ✅ Configures template (v4 legacy or v5 modern)

**Options:**
```bash
apidoc init --no-interactive  # Setup without prompts (coming soon)
```

### 3. `apidoc generate` - Generate Documentation

Generates HTML documentation from your code:

```bash
apidoc generate [options]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-c, --config <file>` | Configuration file | `apidoc.json` |
| `-i, --input <dirs...>` | Input directories | `[process.cwd()]` |
| `-o, --output <dir>` | Output directory | `doc` |
| `-w, --watch` | Watch mode (automatic regeneration) | `false` |
| `-v, --verbose` | Detailed output with statistics | `false` |
| `-d, --debug` | Debug mode | `false` |
| `--filter-version <version>` | Filter only a specific version (e.g., 2.0.0) | - |

**Examples:**

```bash
# Basic
apidoc generate

# With configuration
apidoc generate --config ./config/apidoc.json

# Specify directories
apidoc generate -i src/ -o docs/

# Watch mode for development
apidoc generate --watch

# Verbose mode (detailed statistics)
apidoc generate -v

# Combined
apidoc generate -i src/ -o docs/ --watch -v

# Generate only version 2.0.0
apidoc generate --filter-version 2.0.0 -o docs/v2

# Generate specific version with verbose
apidoc generate --filter-version 1.5.0 -o docs/v1.5 -v
```

### 4. `apidoc export` - Export Documentation

Exports documentation to different formats:

```bash
apidoc export <format> [options]
```

**Available formats:**

#### JSON
```bash
apidoc export json -o api-docs.json
```

#### OpenAPI/Swagger
```bash
# YAML (recommended)
apidoc export openapi -o swagger.yaml

# JSON
apidoc export openapi -o swagger.json
```

#### Markdown
```bash
apidoc export markdown -o API.md
```

**Options:**
```bash
-c, --config <file>             # Configuration (default: apidoc.json)
-o, --output <file>             # Output file
--filter-version <version>      # Export only a specific version
```

**Examples with version filtering:**

```bash
# Export only version 2.0.0 to OpenAPI
apidoc export openapi --filter-version 2.0.0 -o swagger-v2.yaml

# Export version 1.5.0 to JSON
apidoc export json --filter-version 1.5.0 -o api-v1.5.json

# Export specific version to Markdown
apidoc export markdown --filter-version 2.0.0 -o API-v2.md
```

---

## 🎨 Interactive Menu

The interactive menu (`apidoc` without arguments) offers:

### Menu Options

1. **Initialize new project**
   - Step-by-step setup of `apidoc.json`
   - Detects project information
   - Configures inputs/outputs

2. **Generate documentation**
   - Generates docs from the menu
   - Optional watch mode
   - Shows statistics

3. **Export documentation**
   - Export to JSON/OpenAPI/Markdown
   - From the interactive menu

4. **Learn about APIDoc**
   - Links to documentation
   - Examples
   - GitHub

### Navigation

- **↑/↓**: Navigate options
- **Enter**: Select
- **Ctrl+C**: Exit

---

## 🔇 Silent vs Verbose Mode

### Silent Mode (Default)

By default, APIDoc v5 only shows:

- ✅ Banner with logo and version
- ✅ Progress spinner
- ⚠️ Important warnings
- ❌ Critical errors
- ✅ Success/failure message

**Example:**
```bash
apidoc generate
```

**Output:**
```
     █████╗ ██████╗ ██╗██████╗  ██████╗  ██████╗
    ██╔══██╗██╔══██╗██║██╔══██╗██╔═══██╗██╔════╝
    ███████║██████╔╝██║██║  ██║██║   ██║██║
    ██╔══██║██╔═══╝ ██║██║  ██║██║   ██║██║
    ██║  ██║██║     ██║██████╔╝╚██████╔╝╚██████╗
    ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝  ╚═════╝

            v5.0.0-alpha.1 • https://apidoc.app

◒  Generating documentation...
warn: @apiParam 'id' was defined but does not appear in URL...

✅ Documentation generated successfully

🎉 Done! Documentation ready at ./doc
💡 Tip: Use npx serve ./doc to preview
```

### Verbose Mode

With the `-v` or `--verbose` flag, you get detailed statistics:

```bash
apidoc generate -v
```

**Additional output:**
```
📊 Statistics:
• Build time: 2.34s
• Output: ./doc
• API endpoints: 42
• Project: My API v1.2.0
```

### Debug Mode

For advanced troubleshooting:

```bash
apidoc generate -d
```

---

## 💡 Usage Examples

### Quick Development

```bash
# 1. Initialize project
apidoc init

# 2. Watch mode for development
apidoc generate --watch

# 3. Preview in browser
npx serve doc
```

### Production

```bash
# Clean generation
apidoc generate -i src/ -o public/docs/

# With verbose for CI/CD
apidoc generate -i src/ -o docs/ -v
```

### Multi-Format Export

```bash
# Export everything
apidoc export json -o api.json
apidoc export openapi -o swagger.yaml
apidoc export markdown -o API.md
```

### NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "docs": "apidoc generate",
    "docs:watch": "apidoc generate --watch",
    "docs:verbose": "apidoc generate -v",
    "docs:export": "apidoc export openapi -o swagger.yaml"
  }
}
```

Then:
```bash
npm run docs
npm run docs:watch
npm run docs:export
```

---

## 🔄 Migration from v4

### Syntax Changes

| v4 (Obsolete ❌) | v5 (Current ✅) |
|------------------|----------------|
| `apidoc -i src/ -o doc/` | `apidoc generate -i src/ -o doc/` |
| `apidoc -i src/ -o doc/ -v` | `apidoc generate -i src/ -o doc/ -v` |
| `apidoc --filter-version 2.0.0` | `apidoc generate --filter-version 2.0.0` |
| Not available | `apidoc` (interactive menu) |
| Not available | `apidoc init` |
| Not available | `apidoc export <format>` |
| Not available | `apidoc generate --watch` |

### Migration Script

Update your scripts automatically:

**Before (v4):**
```json
{
  "scripts": {
    "docs": "apidoc -i src/ -o docs/",
    "docs:watch": "nodemon --exec 'apidoc -i src/ -o docs/'",
    "docs:verbose": "apidoc -i src/ -o docs/ -v"
  }
}
```

**After (v5):**
```json
{
  "scripts": {
    "docs": "apidoc generate -i src/ -o docs/",
    "docs:watch": "apidoc generate -i src/ -o docs/ --watch",
    "docs:verbose": "apidoc generate -i src/ -o docs/ -v",
    "docs:export": "apidoc export openapi -o swagger.yaml"
  }
}
```

### Backward Compatibility

APIDoc v5 maintains partial backward compatibility:

- ⚠️ Old syntax `apidoc -i -o` is **deprecated**
- ✅ Will continue working in v5.0.x with warning
- ❌ Will be removed in v6.0.0
- 💡 **Recommendation**: Migrate to subcommands now

---

## 🎯 Best Practices

### 1. Use Watch Mode in Development

```bash
apidoc generate --watch
```

- ✅ Automatic regeneration
- ✅ Saves time
- ✅ Immediate feedback

### 2. Verbose Mode in CI/CD

```bash
apidoc generate -v
```

- ✅ Statistics in logs
- ✅ Easier debugging
- ✅ Traceability

### 3. Export for Integrations

```bash
# Swagger UI
apidoc export openapi -o swagger.yaml

# Postman
apidoc export json -o collection.json
```

### 4. Organized Scripts

```json
{
  "scripts": {
    "docs:dev": "apidoc generate --watch",
    "docs:build": "apidoc generate -v",
    "docs:export:all": "npm run docs:export:openapi && npm run docs:export:json",
    "docs:export:openapi": "apidoc export openapi -o swagger.yaml",
    "docs:export:json": "apidoc export json -o api.json"
  }
}
```

---

## 🐛 Troubleshooting

### Banner not showing

**Problem**: The banner doesn't appear.

**Solution**: The banner only shows in TTY mode. In CI/CD it's automatically omitted.

### Excessive warnings

**Problem**: Too many warnings.

**Solution**: Silent mode only shows important warnings. If you want to hide all:
```bash
apidoc generate 2>/dev/null  # Unix/Mac
```

### Watch mode not working

**Problem**: `--watch` doesn't detect changes.

**Solution**: Verify that nodemon is installed:
```bash
npm install nodemon --save-dev
```

---

## 📚 Resources

- [Complete Documentation](../00-index.md)
- [apidoc.json Configuration](./01-configuration.md)
- [Build Tools Integration](./17-build-tools.md)
- [GitHub](https://github.com/hrefcl/apidoc)
- [Website](https://apidoc.app)

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-03
**APIDoc Version**: 5.0.0-alpha.1
