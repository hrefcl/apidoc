---
title: "Local Development"
category: "Development"
order: 15
---

# 🔨 Local Development

Complete guide for setting up a local development environment for APIDoc, contributing to the project, and customizing functionality.

## 🚀 Initial Setup

### System Requirements
- **Node.js**: >= 20.0.0 (LTS recommended)
- **npm**: >= 8.0.0 or **yarn**: >= 1.22.0
- **Git**: For version control
- **Editor**: VS Code recommended with TypeScript extensions

### Repository Setup
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
│   └── apidoc             # Main CLI script
├── lib/                   # TypeScript source code
│   ├── core/             # Core logic
│   │   ├── parsers/      # Comment parsers
│   │   ├── workers/      # Data processors
│   │   ├── filters/      # Output filters
│   │   ├── languages/    # Language support
│   │   └── errors/       # Error classes
│   ├── index.ts          # Main library entry
│   ├── reader.ts         # File reading logic
│   └── writer.ts         # Output generation
├── template/             # HTML templates
│   ├── src/              # TypeScript/CSS source
│   │   ├── main.ts       # Main JavaScript
│   │   └── css/          # CSS styles
│   └── index.html        # Main template
├── example/              # Example API for testing
├── test/                 # Test suite
├── md/                   # Project documentation
├── dist/                 # Compiled output
└── tmp/                  # Temporary build files
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

### Main Commands
```bash
# TypeScript compilation
npm run build              # Compile TypeScript + Stencil
npm run typecheck          # Type checking only
npm run dev                # Watch mode for development

# Documentation generation
npm run build:example      # Generate example documentation
npm run docs               # Generate TypeDoc documentation
npm run docs:serve         # Serve docs at http://localhost:3001

# Template development
npm run dev:template       # Build example + server on port 8080
npm run start              # Serve generated documentation

# Quality Assurance
npm run test               # Run test suite
npm run test:lint          # ESLint + spell check
npm run test:fix           # Auto-fix ESLint issues
npm run pre-commit         # Complete validation (types + lint + tests)

# Container workflows
npm run serve              # Build, containerize and serve with auto-open
npm run serve:stop         # Stop container
```

### Advanced Scripts
```bash
# CSS and styles
npm run build:css          # Compile CSS for production
npm run build:css:dev      # CSS for local development

# Cleanup
npm run clean              # Clean build directories
npm run clean:all          # Complete cleanup + node_modules

# Release
npm run version:patch      # Increment patch version
npm run version:minor      # Increment minor version
npm run version:major      # Increment major version
```

## 🧪 Testing and Validation

### Test Suite
```bash
# Run all tests
npm run test

# Specific tests
npm test -- --grep "parser"           # Only parser tests
npm test -- --grep "MQTT"             # Only MQTT tests
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

### Example Test
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

### Adding a New Parser
```typescript
// lib/core/parsers/my-new-parser.ts
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
// lib/core/parsers/index.ts
import { parseMyNewTag } from './my-new-parser.js';

export const parsers = {
  // ... existing parsers
  mynew: parseMyNewTag
};
```

### Add Parser Test
```javascript
// test/core/parsers/my-new-parser.test.js
describe('My New Parser', () => {
  it('should parse custom tag correctly', () => {
    const result = parseMyNewTag('string User description');

    expect(result.type).to.equal('string');
    expect(result.description).to.equal('User description');
  });
});
```

## 🎨 Template Development

### Template Structure
```
template/
├── src/
│   ├── main.ts           # Main JavaScript
│   ├── css/
│   │   ├── tailwind.css  # TailwindCSS styles
│   │   └── bootstrap.css # Bootstrap styles
│   └── components/       # Stencil components
├── assets/              # Static assets
├── index.html           # Main template
└── stencil.config.ts    # Stencil configuration
```

### Developing Components
```typescript
// template/src/components/api-endpoint.tsx
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'api-endpoint',
  styleUrl: 'api-endpoint.css',
  shadow: true
})
export class ApiEndpoint {
  @Prop() method: string;
  @Prop() url: string;
  @Prop() title: string;

  render() {
    return (
      <div class={`endpoint endpoint-${this.method}`}>
        <span class="method">{this.method.toUpperCase()}</span>
        <span class="url">{this.url}</span>
        <span class="title">{this.title}</span>
      </div>
    );
  }
}
```

### Template Compilation
```bash
# Development with hot reload
npm run dev:template

# Production build
npm run build:template
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
git checkout -b fix/fix-some-issue
```

### 3. Development and Testing
```bash
# Iterative development
npm run dev                # Watch mode
npm run build:example      # Test changes
npm run test               # Run tests

# Continuous validation
npm run typecheck          # Check types
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
- Create PR from your fork to main repository
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
- ✨ **Features**: New functionality
- 📝 **Docs**: Documentation improvements
- 🎨 **Style**: UI/UX improvements
- ⚡ **Performance**: Optimizations
- 🔧 **Tooling**: Development tools

The APIDoc development environment is designed to be accessible and productive, enabling effective contributions to the project.