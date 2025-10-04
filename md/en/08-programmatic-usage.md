# 💻 Programmatic Usage

APIDoc can be used programmatically in Node.js applications, enabling automated integration into CI/CD pipelines and custom workflows.

## 🚀 Installation and Configuration

### Installation
```bash
# As development dependency
npm install --save-dev @hrefcl/apidoc

# As global dependency
npm install -g @hrefcl/apidoc
```

### ES6/ESM Import
```javascript
import { createDoc } from '@hrefcl/apidoc';
```

### CommonJS Import
```javascript
const { createDoc } = require('@hrefcl/apidoc');
```

## 📋 Main API

### createDoc(options)
Main function for programmatically generating documentation.

#### Available Options
```typescript
interface ApiDocOptions {
  src: string[];           // Source directories
  dest: string;           // Output directory
  dryRun?: boolean;       // Validate only, don't generate files
  silent?: boolean;       // Suppress console output
  verbose?: boolean;      // Detailed output
  debug?: boolean;        // Debug mode
  config?: string;        // Path to configuration file
  template?: string;      // Custom template directory
  filterVersion?: string; // Filter by specific version
  mqttOnly?: boolean;     // Only MQTT endpoints
  failOnMqttSchemaError?: boolean; // Fail on MQTT schema errors
}
```

## 🎯 Basic Examples

### Simple Usage
```javascript
import path from 'path';
import { createDoc } from '@hrefcl/apidoc';

// Basic configuration
const result = await createDoc({
  src: [path.resolve(__dirname, 'src')],
  dest: path.resolve(__dirname, 'docs'),
  dryRun: false,
  silent: false
});

if (result.success) {
  console.log('✅ Documentation generated successfully');
  console.log(`📁 Files generated in: ${result.dest}`);
} else {
  console.error('❌ Error generating documentation:', result.error);
}
```

### With Custom Configuration
```javascript
import { createDoc } from '@hrefcl/apidoc';

const options = {
  src: ['./src/api', './src/controllers'],
  dest: './public/docs',
  config: './custom-apidoc.json',
  template: './custom-template',
  verbose: true,
  filterVersion: '2.0.0'
};

try {
  const result = await createDoc(options);

  console.log('📊 Statistics:');
  console.log(`- Files processed: ${result.stats.filesProcessed}`);
  console.log(`- Endpoints documented: ${result.stats.endpointsFound}`);
  console.log(`- Groups generated: ${result.stats.groupsGenerated}`);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
```

## 🔧 Integration in Build Scripts

### package.json Scripts
```json
{
  "scripts": {
    "docs": "node scripts/generate-docs.js",
    "docs:dev": "node scripts/generate-docs.js --dev",
    "docs:watch": "node scripts/watch-docs.js",
    "build": "npm run compile && npm run docs"
  }
}
```

### Generation Script (generate-docs.js)
```javascript
#!/usr/bin/env node

// ⚠️ APIDoc uses CommonJS, not ESM by default
const { createDoc } = require('@hrefcl/apidoc');
const path = require('path');

const isDev = process.argv.includes('--dev');

async function generateDocs() {
  console.log('🚀 Starting documentation generation...');

  const startTime = Date.now();

  const options = {
    src: [
      path.resolve(__dirname, '../src/api'),
      path.resolve(__dirname, '../src/controllers')
    ],
    dest: path.resolve(__dirname, '../docs'),
    dryRun: false,
    silent: false,
    verbose: isDev,
    debug: isDev
  };

  try {
    const result = await createDoc(options);

    const duration = Date.now() - startTime;

    if (result.success) {
      console.log('✅ Documentation generated successfully');
      console.log(`⏱️  Time: ${duration}ms`);
      console.log(`📁 Location: ${result.dest}`);

      // Show detailed statistics in dev mode
      if (isDev && result.stats) {
        console.log('\n📊 Detailed statistics:');
        console.log(`- Files processed: ${result.stats.filesProcessed}`);
        console.log(`- Lines of code: ${result.stats.linesOfCode}`);
        console.log(`- REST endpoints: ${result.stats.restEndpoints}`);
        console.log(`- MQTT endpoints: ${result.stats.mqttEndpoints}`);
        console.log(`- Groups generated: ${result.stats.groupsGenerated}`);
      }
    } else {
      console.error('❌ Error generating documentation');
      console.error(result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    if (isDev) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

generateDocs();
```

## 👀 Watch Mode for Development

### Watch Script (watch-docs.js)
```javascript
import { watch } from 'chokidar';
import { createDoc } from '@hrefcl/apidoc';
import { debounce } from 'lodash-es';
import path from 'path';

const srcDirs = ['./src/api', './src/controllers'];
const destDir = './docs';

// Debounced function to avoid excessive regeneration
const generateDocs = debounce(async () => {
  console.log('🔄 Regenerating documentation...');

  try {
    const result = await createDoc({
      src: srcDirs.map(dir => path.resolve(dir)),
      dest: path.resolve(destDir),
      silent: true // Silent mode for watch
    });

    if (result.success) {
      console.log('✅ Documentation updated');
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}, 1000); // Wait 1 second after last change

// Configure watcher
const watcher = watch(srcDirs, {
  ignored: [
    '**/node_modules/**',
    '**/.git/**',
    '**/tmp/**'
  ],
  persistent: true
});

watcher
  .on('change', (path) => {
    console.log(`📝 File modified: ${path}`);
    generateDocs();
  })
  .on('add', (path) => {
    console.log(`➕ File added: ${path}`);
    generateDocs();
  })
  .on('unlink', (path) => {
    console.log(`🗑️  File deleted: ${path}`);
    generateDocs();
  });

console.log('👀 Watching changes in:', srcDirs);
console.log('💡 Press Ctrl+C to stop');

// Generate initial documentation
generateDocs();
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/docs.yml
name: Generate API Documentation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Generate documentation
      run: node scripts/generate-docs.js

    - name: Upload documentation
      uses: actions/upload-artifact@v3
      with:
        name: api-docs
        path: docs/

    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs
```

### Docker Integration
```dockerfile
# Dockerfile for docs generation
FROM node:20-alpine

WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY apidoc.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY scripts/ ./scripts/

# Generate documentation
RUN node scripts/generate-docs.js

# Serve documentation
FROM nginx:alpine
COPY --from=0 /app/docs /usr/share/nginx/html
EXPOSE 80
```

## 🛠️ Advanced Configuration

### Validation with Dry Run
```javascript
import { createDoc } from '@hrefcl/apidoc';

async function validateDocs() {
  const result = await createDoc({
    src: ['./src'],
    dest: './tmp', // Not used in dry run
    dryRun: true,  // Only validate
    silent: false
  });

  if (result.success) {
    console.log('✅ Documentation valid');
    return true;
  } else {
    console.error('❌ Errors found:');
    result.errors?.forEach(error => {
      console.error(`- ${error.file}:${error.line} - ${error.message}`);
    });
    return false;
  }
}

// Use in pre-commit scripts
if (!(await validateDocs())) {
  process.exit(1);
}
```

### Multi-Project Configuration
```javascript
// Generate documentation for multiple projects
const projects = [
  {
    name: 'user-api',
    src: ['./services/user-api/src'],
    dest: './docs/user-api'
  },
  {
    name: 'product-api',
    src: ['./services/product-api/src'],
    dest: './docs/product-api'
  },
  {
    name: 'order-api',
    src: ['./services/order-api/src'],
    dest: './docs/order-api'
  }
];

async function generateAllDocs() {
  console.log('🚀 Generating documentation for all projects...');

  const results = await Promise.allSettled(
    projects.map(async (project) => {
      console.log(`📝 Processing ${project.name}...`);

      return createDoc({
        src: project.src,
        dest: project.dest,
        silent: true
      });
    })
  );

  // Report results
  results.forEach((result, index) => {
    const project = projects[index];

    if (result.status === 'fulfilled' && result.value.success) {
      console.log(`✅ ${project.name}: Completed`);
    } else {
      console.error(`❌ ${project.name}: Error`);
      if (result.status === 'rejected') {
        console.error(result.reason);
      } else {
        console.error(result.value.error);
      }
    }
  });
}

generateAllDocs();
```

## 📊 Analysis and Statistics

### Detailed Report
```javascript
async function generateReport() {
  const result = await createDoc({
    src: ['./src'],
    dest: './docs',
    verbose: true
  });

  if (result.success && result.stats) {
    // Generate JSON report
    const report = {
      timestamp: new Date().toISOString(),
      project: process.env.npm_package_name,
      version: process.env.npm_package_version,
      stats: result.stats,
      coverage: {
        documented: result.stats.endpointsFound,
        total: result.stats.endpointsTotal,
        percentage: Math.round((result.stats.endpointsFound / result.stats.endpointsTotal) * 100)
      }
    };

    // Save report
    await fs.writeFile('./docs/report.json', JSON.stringify(report, null, 2));

    console.log('📊 Report generated:');
    console.log(`- Coverage: ${report.coverage.percentage}%`);
    console.log(`- Endpoints: ${report.stats.endpointsFound}/${report.stats.endpointsTotal}`);
  }
}
```

## 🔌 Hooks and Extensibility

### Pre and Post Hooks
```javascript
async function generateWithHooks() {
  // Pre-hook: Clean output directory
  console.log('🧹 Cleaning output directory...');
  await fs.rm('./docs', { recursive: true, force: true });

  // Generate documentation
  const result = await createDoc({
    src: ['./src'],
    dest: './docs'
  });

  if (result.success) {
    // Post-hook: Compress for distribution
    console.log('📦 Compressing documentation...');
    await compress('./docs', './docs.zip');

    // Post-hook: Upload to CDN
    console.log('☁️  Uploading to CDN...');
    await uploadToCDN('./docs');
  }

  return result;
}
```

Programmatic usage of APIDoc allows you to integrate documentation generation into any workflow, automate updates, and create robust documentation pipelines.
