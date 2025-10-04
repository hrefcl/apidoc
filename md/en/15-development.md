# 🔨 Local Development

Complete guide to set up a local development environment for APIDoc, contribute to the project, and customize functionalities.

## 🚀 Initial Setup

### System Requirements
- **Node.js**: >= 20.0.0 (LTS recommended)
- **npm**: >= 8.0.0 or **yarn**: >= 1.22.0
- **Git**: For version control
- **Editor**: VS Code recommended with TypeScript extensions

### Repository Cloning
```bash
# Clone the repository
git clone https://github.com/hrefcl/apidoc.git
cd apidoc

# Install dependencies
npm install

# Verify installation
npm run typecheck
npm run test:lint
```

## 📂 Project Structure

### Main Directories
```
apidoc/
├── bin/                    # CLI executable
│   └── apidoc             # Main script
├── core/                  # TypeScript source code (⚠️ NOT lib/)
│   ├── apidoc/           # APIDoc logic
│   ├── parsers/          # REST parsers (50+ parsers)
│   ├── parsers-jsdoc/    # JSDoc/TSDoc parsers
│   ├── workers/          # Data processors
│   ├── filters/          # Output filters
│   ├── languages/        # Language support
│   ├── errors/           # Error classes
│   ├── utils/            # Utilities (encryption, etc.)
│   ├── types/            # TypeScript types
│   ├── index.ts          # Main entry point
│   ├── parser.ts         # Main parser
│   └── worker.ts         # Main worker
├── apps/                 # Monorepo applications
│   └── apidoc-template-v5/ # Vue 3 + Vite Template (v5)
│       ├── src/          # Vue 3 components
│       ├── public/       # Public assets
│       └── package.json  # Template dependencies
├── examples/             # Usage examples
│   ├── apicat/          # apiCAT v5 example (current)
│   └── apidoc/          # v4 example (legacy)
├── scripts/             # Build scripts
│   └── build-css.js     # CSS build
├── md/                  # Project documentation
│   └── es/              # Spanish documentation
├── dist/                # Compiled TypeScript output
└── tmp/                 # Temporary build files
```

### Configuration Files
```
├── package.json          # npm configuration and scripts
├── tsconfig.json         # TypeScript configuration
├── eslint.config.js      # ESLint configuration
├── typedoc.json          # TypeDoc configuration
├── .gitignore           # Git ignored files
└── .github/             # GitHub Actions workflows
    └── workflows/
        ├── test.yml      # Automated tests
        └── release.yml   # Release pipeline
```

## 🛠️ Development Scripts

### Main Commands (UPDATED 2025)
```bash
# === BUILD SCRIPTS ===
npm run build              # Compile CSS + TypeScript + copy core
npm run build:css          # Only compile CSS (production)
npm run build:css:dev      # Compile CSS for development
npm run build:watch        # TypeScript watch mode
npm run build:clean        # Complete clean + rebuild

# === EXAMPLES AND v5 DEVELOPMENT (Vue 3 Template) ===
npm run example            # Generate docs with apiCAT v5 → tmp/apidoc-output
npm run dev:template       # Vue 3 template development (hot reload)
npm run start              # Serve documentation on port 8080
npm run preview            # Preview on port 9999

# === LEGACY v4 (Old Template) ===
npm run example:v4         # Generate docs with v4 template → tmp/apidoc-output-v4
npm run start:v4           # Serve v4 documentation

# === DEVELOPMENT ===
npm run dev                # Alias for build:watch

# === TESTING ===
npm run test               # Run Mocha test suite
npm run test:ci            # CI tests (lint + mocha)
npm run test:lint          # ESLint + spell check
npm run test:fix           # Auto-fix ESLint issues
npm run test:spell         # Spell check only

# === QUALITY ASSURANCE ===
npm run typecheck          # TypeScript type checking
npm run eslint             # ESLint only
npm run pre-commit         # Full validation (typecheck + eslint + test)
npm run format             # Format code with Prettier
npm run format:check       # Verify format without modifying

# === DOCUMENTATION ===
npm run docs               # Generate TypeDoc documentation
npm run docs:serve         # Serve TypeDoc on port 3001
npm run docs:watch         # TypeDoc in watch mode
```

### Additional Scripts
```bash
# === RELEASE ===
npm run prepublishOnly     # Runs before publishing (automatic build:clean)
npm run release            # Complete build + generate changelog

# === WORKSPACES (Monorepo) ===
npm run build:packages     # Build all workspaces
npm run test:packages      # Test all workspaces
```

## 🧪 Testing and Validation

### Test Suite
```bash
# Run all tests
npm run test

# Specific tests
npm test -- --grep "parser"           # Parser tests only
npm test -- --grep "MQTT"             # MQTT tests only
npm test -- test/core/parser.test.js  # Specific file

# Coverage
npm run test:coverage     # Generate coverage report
```

### Test Structure
```
test/
├── core/                 # Core tests
│   ├── parsers/         # Parser tests
│   ├── workers/         # Worker tests
│   └── filters/         # Filter tests
├── integration/          # Integration tests
├── fixtures/            # Test data
└── helpers/             # Testing utilities
```

### Test Example
```javascript
// test/core/parsers/api.test.js
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { parseApi } from '../../../lib/core/parsers/api.js';

describe('API Parser', () => {
  it('should parse basic API definition', () => {
    const content = '{get} /users Get Users';
    const result = parseApi(content);

    expect(result).to.have.property('method', 'get');
    expect(result).to.have.property('url', '/users');
    expect(result).to.have.property('title', 'Get Users');
  });

  it('should handle complex URLs with parameters', () => {
    const content = '{post} /users/:id/posts Create User Post';
    const result = parseApi(content);

    expect(result.url).to.equal('/users/:id/posts');
    expect(result.method).to.equal('post');
  });
});
```

## 🔧 Developing New Features

### Add New Parser
```typescript
// core/parsers/my-new-parser.ts (⚠️ NOT lib/core/)
export function parseMyNewTag(content: string): any {
  // 1. Define regex for parsing
  const regex = /^(.+?)\s+(.+)$/;
  const match = content.match(regex);

  if (!match) {
    throw new Error('Invalid format for @myNewTag');
  }

  // 2. Extract data
  const [, type, description] = match;

  // 3. Return normalized object
  return {
    type: type.trim(),
    description: description.trim()
  };
}
```

### Register Parser
```typescript
// core/parsers/index.ts (centralized registry file)
import { parseMyNewTag } from './my-new-parser.js';

export const parsers = {
  // ... 50+ existing parsers (api, apiParam, mqtt, etc.)
  mynew: parseMyNewTag
};
```

### Add Parser Test
```javascript
// test/parsers/my-new-parser_test.js (⚠️ Convention: *_test.js)
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { parseMyNewTag } from '../../core/parsers/my-new-parser.js';

describe('My New Parser', () => {
  it('should parse custom tag correctly', () => {
    const result = parseMyNewTag('string User description');

    expect(result.type).to.equal('string');
    expect(result.description).to.equal('User description');
  });
});
```

## 🎨 Template Development (Vue 3 + Vite)

### ⚠️ NEW v5 ARCHITECTURE
APIDoc v5 uses **Vue 3 + Vite** instead of Stencil (legacy v4)

### Template v5 Structure
```
apps/apidoc-template-v5/
├── src/
│   ├── components/         # Vue 3 components
│   │   ├── ApiContent.vue
│   │   ├── CodeTabs.vue
│   │   ├── ParametersTable.vue
│   │   └── ...
│   ├── layouts/           # Layouts
│   │   └── DocsLayout.vue
│   ├── pages/             # Pages
│   │   ├── HomePage.vue
│   │   └── DocPage.vue
│   ├── router/            # Vue Router
│   │   └── index.js
│   ├── stores/            # Pinia stores
│   │   └── docs.js
│   ├── i18n/              # Internationalization
│   ├── composables/       # Vue composables
│   ├── main.js            # Entry point
│   └── App.vue            # Root component
├── public/                # Static assets
├── index.html             # Main HTML
├── package.json           # Template dependencies
└── vite.config.js         # Vite configuration
```

### Vue 3 Component Development
```vue
<!-- apps/apidoc-template-v5/src/components/ApiEndpoint.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  method: String,
  url: String,
  title: String
});

const methodClass = computed(() => `endpoint-${props.method.toLowerCase()}`);
</script>

<template>
  <div :class="['endpoint', methodClass]">
    <span class="method">{{ method.toUpperCase() }}</span>
    <span class="url">{{ url }}</span>
    <span class="title">{{ title }}</span>
  </div>
</template>

<style scoped>
/* Component styles */
</style>
```

### Template v5 Compilation
```bash
# Development with hot reload (Vite HMR)
npm run dev:template        # Start Vite dev server

# Production build (inside apps/apidoc-template-v5/)
cd apps/apidoc-template-v5
npm run build              # Build with Vite

# Serve production build
npm run start              # Serve tmp/apidoc-output
```

## 🔄 Development Workflow

### 1. Environment Setup
```bash
# Fork the repository on GitHub
git clone https://github.com/your-username/apidoc.git
cd apidoc

# Configure upstream
git remote add upstream https://github.com/hrefcl/apidoc.git

# Install dependencies
npm install

# Verify everything works
npm run pre-commit
```

### 2. Create Feature Branch
```bash
# Create and switch to new branch
git checkout -b feature/my-new-feature

# Or for bugfix
git checkout -b fix/fix-issue
```

### 3. Development and Testing
```bash
# Iterative development
npm run dev                # Watch mode
npm run build:example      # Test changes
npm run test               # Run tests

# Continuous validation
npm run typecheck          # Verify types
npm run test:lint          # Linting
```

### 4. Commit and Push
```bash
# Staging and commit
git add .
git commit -m "feat: add support for new parser"

# Push to your fork
git push origin feature/my-new-feature
```

### 5. Pull Request
- Create PR from your fork to the main repository
- Ensure all CI checks pass
- Describe changes and justification
- Wait for review and feedback

## 🐛 Debugging

### VS Code Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug APIDoc",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/bin/apidoc",
      "args": [
        "-i", "example/",
        "-o", "tmp/debug/",
        "--debug"
      ],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "sourceMaps": true
    }
  ]
}
```

### Advanced Logging
```typescript
// lib/utils/logger.ts
export const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  },

  info: (message: string) => {
    console.log(`[INFO] ${message}`);
  },

  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error || '');
  }
};
```

## 📦 Build and Distribution

### Production Build
```bash
# Complete build
npm run build

# Verify build
npm run test
npm run typecheck

# Local distribution test
npm pack
npm install -g ./apidoc-*.tgz
```

### Release Configuration
```json
// package.json
{
  "scripts": {
    "release:patch": "npm version patch && npm publish",
    "release:minor": "npm version minor && npm publish",
    "release:major": "npm version major && npm publish"
  }
}
```

## 🤝 Contributing

### Code Guidelines
- **TypeScript**: Use strict types
- **ESLint**: Follow project configuration
- **Commits**: Use conventional commits
- **Tests**: Maintain coverage > 80%
- **Documentation**: Update docs for new features

### PR Checklist
- [ ] Tests pass locally
- [ ] TypeScript compiles without errors
- [ ] ESLint has no warnings
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Examples working

### Contribution Types
- 🐛 **Bug fixes**: Error corrections
- ✨ **Features**: New functionalities
- 📝 **Docs**: Documentation improvements
- 🎨 **Style**: UI/UX improvements
- ⚡ **Performance**: Optimizations
- 🔧 **Tooling**: Development tools

The APIDoc development environment is designed to be accessible and productive, enabling effective contributions to the project.
