# 📜 NPM Scripts Reference

Complete guide to all available npm scripts in the APIDoc v5 project.

## 🚀 Quick Start

```bash
# Generate docs with v5 template (default)
npm run example

# Start development server for template
npm run dev:template

# Serve generated documentation
npm start
```

---

## 📦 Build Scripts

### `npm run build`
Complete build: CSS compilation + TypeScript compilation + core files copy
- Runs: `build:css` → `tsc` → `build:copy-core`
- **Use when**: Preparing for production or testing

### `npm run build:clean`
Clean build from scratch
- Removes `dist/` directory completely
- Runs full build process
- **Use when**: Starting fresh or fixing build issues

### `npm run build:watch`
TypeScript watch mode for development
- Automatically recompiles on file changes
- **Use when**: Actively developing core functionality

### `npm run build:css`
Build production CSS (pre-compiled)
- Uses existing `main.bundle.css` (400KB)
- **Use when**: Verifying CSS integrity

### `npm run build:css:dev`
Build development CSS
- Creates `main.bundle.dev.css` for local development
- **Use when**: Modifying CSS/Tailwind styles

---

## 🎯 Main Scripts (v5 - Default)

### `npm run example`
**Generate documentation with Vue 3 template (v5)**
```bash
npm run example
```
- Input: `examples/apicat/`
- Output: `tmp/apidoc-output/`
- Template: Vue 3 SPA with hash routing
- Features: Models, API, TSDoc, Custom Markdown

### `npm run dev:template`
**Start template development server**
```bash
npm run dev:template
```
- Runs Vite dev server on `http://localhost:5176`
- Hot Module Replacement enabled
- Auto-syncs data from `tmp/apidoc-output/data/`

### `npm start`
**Serve generated documentation**
```bash
npm start
```
- Serves `tmp/apidoc-output/` on `http://localhost:8080`
- **Use after**: Running `npm run example`

### `npm run preview`
**Preview documentation on alternate port**
```bash
npm run preview
```
- Serves `tmp/apidoc-output/` on `http://localhost:9999`
- **Use when**: Port 8080 is occupied

---

## 🕰️ Legacy Scripts (v4)

### `npm run example:v4`
**Generate documentation with old template (v4)**
```bash
npm run example:v4
```
- Input: `examples/apidoc/`
- Output: `tmp/apidoc-output-v4/`
- Template: Handlebars + jQuery (legacy)
- **Use when**: Testing backwards compatibility

### `npm run start:v4`
**Serve v4 documentation**
```bash
npm run start:v4
```
- Serves `tmp/apidoc-output-v4/` on `http://localhost:8080`

---

## 🧪 Testing

### `npm test`
Run Mocha test suite
```bash
npm test
```

### `npm run test:ci`
Run tests in CI environment
```bash
npm run test:ci
```
- Runs linting + tests
- Sets `CI=true` environment variable

### `npm run test:e2e`
Run Playwright end-to-end tests
```bash
npm run test:e2e
```

### `npm run test:lint`
Run all linting checks
```bash
npm run test:lint
```
- Spell checking (support docs + code)
- ESLint

### `npm run test:fix`
Auto-fix ESLint issues
```bash
npm run test:fix
```

### `npm run test:packages`
Run tests for all workspace packages
```bash
npm run test:packages
```

---

## 🎨 Quality & Formatting

### `npm run typecheck`
TypeScript type checking without emitting files
```bash
npm run typecheck
```

### `npm run eslint`
Run ESLint on all files
```bash
npm run eslint
```

### `npm run format`
Format all code files
```bash
npm run format
```
- Formats Handlebars templates
- Runs Prettier on `.ts`, `.js`, `.html`, `.json`

### `npm run format:check`
Check if files are formatted correctly
```bash
npm run format:check
```

### `npm run pre-commit`
Pre-commit hook (typecheck + lint + test)
```bash
npm run pre-commit
```

---

## 📚 Documentation

### `npm run docs`
Generate TypeDoc API documentation
```bash
npm run docs
```
- Output: `docs/api/`

### `npm run docs:serve`
Generate and serve TypeDoc
```bash
npm run docs:serve
```
- Serves on `http://localhost:3001`

### `npm run docs:watch`
TypeDoc watch mode
```bash
npm run docs:watch
```

---

## 🏗️ Workspaces

### `npm run build:packages`
Build all workspace packages
```bash
npm run build:packages
```

---

## 🚢 Release

### `npm run prepublishOnly`
Runs before npm publish
```bash
npm run prepublishOnly
```
- Automatically runs `build:clean`

### `npm run release`
Create a new release
```bash
npm run release
```
- Clean build + changelog generation

---

## 🐳 Container (Legacy)

### `npm run container:build`
Build Podman/Docker container
```bash
npm run container:build
```

### `npm run serve`
Generate docs + run in Nginx container
```bash
npm run serve
```
- Generates docs with `npm run example`
- Runs Nginx container on port 8080
- Auto-opens in browser

### `npm run serve:stop`
Stop Nginx container
```bash
npm run serve:stop
```

---

## 🎓 Common Workflows

### Development Workflow
```bash
# 1. Start TypeScript watch mode
npm run dev

# 2. In another terminal, start template dev server
npm run dev:template

# 3. Make changes to core or template
# Files auto-reload
```

### Generate & Preview Documentation
```bash
# Generate docs
npm run example

# Preview in browser
npm start
# Visit http://localhost:8080
```

### Test Legacy Template
```bash
# Generate with v4 template
npm run example:v4

# Serve v4 docs
npm run start:v4
```

### Full Quality Check
```bash
npm run pre-commit
```

### Release Preparation
```bash
# 1. Clean build
npm run build:clean

# 2. Run all tests
npm test

# 3. Type check
npm run typecheck

# 4. Format code
npm run format

# 5. Create release
npm run release
```

---

## 📝 Notes

- **Default template**: v5 (Vue 3 SPA)
- **Legacy template**: v4 (Handlebars) - use `--old` flag or `example:v4` script
- **Port conflicts**: Use `preview` for alternate port
- **Development**: Use `dev:template` for hot reload during template development
