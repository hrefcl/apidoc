---
title: "Programmatic Usage & Node.js Integration"
category: "Development"
order: 8
---

# 🔧 Programmatic Usage & Node.js Integration

Complete guide for integrating APIDoc into Node.js applications, build pipelines, and automated workflows with comprehensive API examples.

## 🚀 Overview

APIDoc 4.0 provides powerful programmatic APIs for seamless integration into development workflows:

- **📦 Node.js API**: Direct integration in applications
- **🔄 Build Pipeline Integration**: Automated documentation generation
- **⚙️ Configuration Management**: Dynamic configuration handling
- **🧪 Testing Integration**: Documentation validation in tests
- **🎯 Custom Workflows**: Tailored documentation processes

## 📦 Installation & Setup

### NPM Installation
```bash
# Install as development dependency
npm install --save-dev @hrefcl/apidoc

# Install globally for CLI usage
npm install -g @hrefcl/apidoc

# Install with TypeScript support
npm install --save-dev @hrefcl/apidoc @types/node
```

### Basic Node.js Integration
```javascript
// generate-docs.js
const apidoc = require('@hrefcl/apidoc');
const path = require('path');

async function generateDocs() {
  try {
    const options = {
      src: path.join(__dirname, 'src/'),
      dest: path.join(__dirname, 'docs/'),
      config: path.join(__dirname, 'apidoc.json')
    };

    const result = await apidoc.createDoc(options);

    if (result === true) {
      console.log('✅ Documentation generated successfully');
    } else {
      console.error('❌ Documentation generation failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error generating documentation:', error);
    process.exit(1);
  }
}

generateDocs();
```

## 🔧 Core API Reference

### createDoc() Method
```typescript
interface ApiDocOptions {
  src: string | string[];           // Source directories
  dest: string;                     // Output directory
  config?: string;                  // Configuration file path
  template?: string;                // Custom template path
  debug?: boolean;                  // Enable debug mode
  verbose?: boolean;                // Verbose output
  simulate?: boolean;               // Simulate without writing
  parse?: boolean;                  // Parse only, don't generate
  colorize?: boolean;              // Colorize console output
  markdown?: boolean;              // Enable markdown processing
  lineEnding?: string;             // Line ending style
  encoding?: string;               // File encoding
  silent?: boolean;                // Suppress output
  includeFilters?: string[];       // Include file patterns
  excludeFilters?: string[];       // Exclude file patterns
}

function createDoc(options: ApiDocOptions): Promise<boolean>;
```

### Advanced Usage Example
```javascript
const apidoc = require('@hrefcl/apidoc');
const fs = require('fs').promises;
const path = require('path');

class DocumentationGenerator {
  constructor(config = {}) {
    this.defaultOptions = {
      src: ['./src/', './routes/'],
      dest: './docs/',
      template: './template/',
      debug: process.env.NODE_ENV === 'development',
      verbose: true,
      markdown: true,
      includeFilters: ['.*\\.js$', '.*\\.ts$'],
      excludeFilters: ['.*\\.test\\.js$', '.*\\.spec\\.ts$'],
      ...config
    };
  }

  async generate(customOptions = {}) {
    const options = { ...this.defaultOptions, ...customOptions };

    try {
      // Pre-generation validation
      await this.validateSources(options.src);

      // Clean destination directory
      await this.cleanDestination(options.dest);

      // Generate documentation
      console.log('📚 Generating API documentation...');
      const startTime = Date.now();

      const success = await apidoc.createDoc(options);

      const duration = Date.now() - startTime;

      if (success) {
        console.log(`✅ Documentation generated in ${duration}ms`);
        await this.postProcessDocs(options.dest);
        return true;
      } else {
        throw new Error('Documentation generation failed');
      }
    } catch (error) {
      console.error('❌ Documentation generation error:', error.message);
      return false;
    }
  }

  async validateSources(sources) {
    const srcArray = Array.isArray(sources) ? sources : [sources];

    for (const src of srcArray) {
      try {
        const stat = await fs.stat(src);
        if (!stat.isDirectory()) {
          throw new Error(`Source path is not a directory: ${src}`);
        }
      } catch (error) {
        throw new Error(`Invalid source directory: ${src}`);
      }
    }
  }

  async cleanDestination(dest) {
    try {
      await fs.rm(dest, { recursive: true, force: true });
      await fs.mkdir(dest, { recursive: true });
    } catch (error) {
      console.warn(`Warning: Could not clean destination: ${error.message}`);
    }
  }

  async postProcessDocs(dest) {
    // Add custom post-processing logic
    console.log('🔧 Post-processing documentation...');

    // Example: Add custom CSS
    const customCssPath = path.join(dest, 'assets/custom.css');
    const customCss = `
      /* Custom API documentation styles */
      .header { border-bottom: 3px solid #007bff; }
      .api-group { margin-bottom: 2rem; }
    `;

    try {
      await fs.writeFile(customCssPath, customCss);
      console.log('📝 Custom styles added');
    } catch (error) {
      console.warn('Warning: Could not add custom styles');
    }
  }
}

// Usage
const generator = new DocumentationGenerator({
  src: ['./api/', './controllers/'],
  dest: './public/docs/',
  debug: true
});

generator.generate().then(success => {
  process.exit(success ? 0 : 1);
});
```

## 🔄 Build Pipeline Integration

### npm Scripts Integration
```json
{
  "scripts": {
    "docs": "node scripts/generate-docs.js",
    "docs:watch": "nodemon --watch src --ext js,ts --exec \"npm run docs\"",
    "docs:serve": "npm run docs && http-server docs -p 8080",
    "prebuild": "npm run docs",
    "build": "webpack --mode production",
    "test:docs": "node scripts/validate-docs.js"
  },
  "devDependencies": {
    "@hrefcl/apidoc": "^4.0.5",
    "nodemon": "^3.0.0",
    "http-server": "^14.0.0"
  }
}
```

### Webpack Integration
```javascript
// webpack.config.js
const apidoc = require('@hrefcl/apidoc');
const path = require('path');

class ApiDocPlugin {
  constructor(options = {}) {
    this.options = {
      src: path.join(__dirname, 'src'),
      dest: path.join(__dirname, 'dist/docs'),
      ...options
    };
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('ApiDocPlugin', (params, callback) => {
      console.log('🔄 Generating API documentation...');

      apidoc.createDoc(this.options)
        .then(success => {
          if (success) {
            console.log('✅ API documentation generated');
          } else {
            console.error('❌ API documentation generation failed');
          }
          callback();
        })
        .catch(error => {
          console.error('API documentation error:', error);
          callback(error);
        });
    });
  }
}

module.exports = {
  // ... other webpack config
  plugins: [
    new ApiDocPlugin({
      src: ['./src/api/', './src/routes/'],
      dest: './dist/docs/',
      debug: process.env.NODE_ENV === 'development'
    })
  ]
};
```

### Gulp Integration
```javascript
// gulpfile.js
const gulp = require('gulp');
const apidoc = require('@hrefcl/apidoc');
const del = require('del');

// Clean documentation directory
gulp.task('docs:clean', () => {
  return del(['docs/**/*']);
});

// Generate API documentation
gulp.task('docs:generate', () => {
  return new Promise((resolve, reject) => {
    apidoc.createDoc({
      src: 'src/',
      dest: 'docs/',
      config: 'apidoc.json',
      template: 'template/',
      debug: false,
      verbose: true
    }).then(success => {
      if (success) {
        console.log('✅ Documentation generated successfully');
        resolve();
      } else {
        reject(new Error('Documentation generation failed'));
      }
    }).catch(reject);
  });
});

// Watch for changes and regenerate
gulp.task('docs:watch', () => {
  return gulp.watch(['src/**/*.js', 'apidoc.json'], gulp.series('docs:generate'));
});

// Copy additional assets
gulp.task('docs:assets', () => {
  return gulp.src(['assets/**/*'])
    .pipe(gulp.dest('docs/assets/'));
});

// Main documentation task
gulp.task('docs', gulp.series('docs:clean', 'docs:generate', 'docs:assets'));

// Development task with watch
gulp.task('docs:dev', gulp.series('docs', 'docs:watch'));
```

## 🧪 Testing Integration

### Jest Integration
```javascript
// tests/docs.test.js
const apidoc = require('@hrefcl/apidoc');
const fs = require('fs').promises;
const path = require('path');

describe('API Documentation', () => {
  const tempDir = path.join(__dirname, 'temp-docs');

  beforeEach(async () => {
    // Clean temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  afterEach(async () => {
    // Clean up temp directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  test('should generate documentation successfully', async () => {
    const success = await apidoc.createDoc({
      src: path.join(__dirname, '../src'),
      dest: tempDir,
      silent: true
    });

    expect(success).toBe(true);

    // Verify output files exist
    const indexExists = await fs.access(path.join(tempDir, 'index.html'))
      .then(() => true)
      .catch(() => false);

    expect(indexExists).toBe(true);
  });

  test('should validate all API endpoints have documentation', async () => {
    const success = await apidoc.createDoc({
      src: path.join(__dirname, '../src'),
      dest: tempDir,
      parse: true,
      silent: true
    });

    expect(success).toBe(true);

    // Read generated API data
    const apiDataPath = path.join(tempDir, 'api_data.json');
    const apiData = JSON.parse(await fs.readFile(apiDataPath, 'utf8'));

    // Validate required endpoints exist
    const requiredEndpoints = [
      'GET /users',
      'POST /users',
      'GET /users/:id',
      'PUT /users/:id',
      'DELETE /users/:id'
    ];

    requiredEndpoints.forEach(endpoint => {
      const found = apiData.some(api =>
        `${api.type.toUpperCase()} ${api.url}` === endpoint
      );
      expect(found).toBe(true);
    });
  });

  test('should fail on invalid source directory', async () => {
    const success = await apidoc.createDoc({
      src: 'non-existent-directory',
      dest: tempDir,
      silent: true
    });

    expect(success).toBe(false);
  });
});
```

### Documentation Validation
```javascript
// scripts/validate-docs.js
const apidoc = require('@hrefcl/apidoc');
const fs = require('fs').promises;
const path = require('path');

class DocumentationValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  async validate(srcDir, tempDir = './temp-validation') {
    try {
      // Generate documentation with parse-only mode
      const success = await apidoc.createDoc({
        src: srcDir,
        dest: tempDir,
        parse: true,
        silent: true
      });

      if (!success) {
        this.errors.push('Documentation generation failed');
        return false;
      }

      // Load generated API data
      const apiDataPath = path.join(tempDir, 'api_data.json');
      const apiData = JSON.parse(await fs.readFile(apiDataPath, 'utf8'));

      // Validation rules
      await this.validateEndpoints(apiData);
      await this.validateExamples(apiData);
      await this.validateParameters(apiData);

      // Clean up
      await fs.rm(tempDir, { recursive: true, force: true });

      return this.errors.length === 0;
    } catch (error) {
      this.errors.push(`Validation error: ${error.message}`);
      return false;
    }
  }

  async validateEndpoints(apiData) {
    apiData.forEach((endpoint, index) => {
      // Check required fields
      if (!endpoint.type) {
        this.errors.push(`Endpoint ${index}: Missing HTTP method`);
      }

      if (!endpoint.url) {
        this.errors.push(`Endpoint ${index}: Missing URL`);
      }

      if (!endpoint.name) {
        this.warnings.push(`Endpoint ${index}: Missing @apiName`);
      }

      if (!endpoint.group) {
        this.warnings.push(`Endpoint ${index}: Missing @apiGroup`);
      }

      if (!endpoint.description) {
        this.warnings.push(`Endpoint ${endpoint.type} ${endpoint.url}: Missing description`);
      }
    });
  }

  async validateExamples(apiData) {
    apiData.forEach(endpoint => {
      const hasExample = endpoint.examples && endpoint.examples.length > 0;
      const hasSuccessExample = endpoint.success && endpoint.success.examples && endpoint.success.examples.length > 0;

      if (!hasExample && !hasSuccessExample) {
        this.warnings.push(`${endpoint.type} ${endpoint.url}: No examples provided`);
      }
    });
  }

  async validateParameters(apiData) {
    apiData.forEach(endpoint => {
      if (endpoint.type === 'POST' || endpoint.type === 'PUT') {
        const hasBodyParams = endpoint.parameter &&
          endpoint.parameter.fields &&
          endpoint.parameter.fields.Body;

        if (!hasBodyParams) {
          this.warnings.push(`${endpoint.type} ${endpoint.url}: No body parameters documented`);
        }
      }
    });
  }

  report() {
    console.log('\n📊 Documentation Validation Report\n');

    if (this.errors.length === 0) {
      console.log('✅ No errors found');
    } else {
      console.log(`❌ ${this.errors.length} error(s) found:`);
      this.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (this.warnings.length === 0) {
      console.log('✅ No warnings');
    } else {
      console.log(`⚠️  ${this.warnings.length} warning(s) found:`);
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }

    return this.errors.length === 0;
  }
}

// Usage
async function main() {
  const validator = new DocumentationValidator();
  const isValid = await validator.validate('./src');
  const success = validator.report();

  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = DocumentationValidator;
```

## ⚙️ Configuration Management

### Dynamic Configuration
```javascript
// config/apidoc.config.js
const path = require('path');

function createConfig(environment = 'development') {
  const baseConfig = {
    name: 'My API',
    version: require('../package.json').version,
    description: 'RESTful API with comprehensive documentation',
    title: 'API Documentation',
    url: process.env.API_BASE_URL || 'http://localhost:3000',
    sampleUrl: process.env.API_SAMPLE_URL || 'http://localhost:3000'
  };

  const environments = {
    development: {
      ...baseConfig,
      template: {
        withGenerator: true,
        customCSS: './assets/dev-styles.css',
        debug: true
      }
    },
    production: {
      ...baseConfig,
      template: {
        withGenerator: false,
        customCSS: './assets/prod-styles.css',
        minify: true
      }
    },
    staging: {
      ...baseConfig,
      url: 'https://api-staging.example.com',
      sampleUrl: 'https://api-staging.example.com',
      template: {
        withGenerator: true,
        customCSS: './assets/staging-styles.css'
      }
    }
  };

  return environments[environment] || environments.development;
}

module.exports = createConfig;
```

### Configuration Usage
```javascript
// scripts/generate-docs-env.js
const apidoc = require('@hrefcl/apidoc');
const fs = require('fs').promises;
const createConfig = require('../config/apidoc.config');

async function generateDocsForEnvironment(env = 'development') {
  const config = createConfig(env);
  const configPath = `./apidoc.${env}.json`;

  // Write environment-specific config
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));

  try {
    const success = await apidoc.createDoc({
      src: './src/',
      dest: `./docs/${env}/`,
      config: configPath,
      debug: env === 'development',
      verbose: true
    });

    if (success) {
      console.log(`✅ Documentation generated for ${env} environment`);
    } else {
      throw new Error(`Documentation generation failed for ${env}`);
    }

    // Clean up temporary config
    await fs.unlink(configPath);

  } catch (error) {
    console.error(`❌ Error generating docs for ${env}:`, error.message);
    // Clean up temporary config on error
    try {
      await fs.unlink(configPath);
    } catch {}
    throw error;
  }
}

// Generate for multiple environments
async function generateAll() {
  const environments = ['development', 'staging', 'production'];

  for (const env of environments) {
    await generateDocsForEnvironment(env);
  }
}

if (require.main === module) {
  const env = process.argv[2] || 'development';

  if (env === 'all') {
    generateAll().catch(error => {
      console.error('❌ Failed to generate documentation:', error.message);
      process.exit(1);
    });
  } else {
    generateDocsForEnvironment(env).catch(error => {
      console.error('❌ Failed to generate documentation:', error.message);
      process.exit(1);
    });
  }
}
```

## 🎯 Custom Workflows

### Continuous Integration
```yaml
# .github/workflows/docs.yml
name: Generate Documentation

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Validate documentation
      run: npm run test:docs

    - name: Generate documentation
      run: npm run docs

    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs
```

### Custom Processing Pipeline
```javascript
// scripts/advanced-docs-pipeline.js
const apidoc = require('@hrefcl/apidoc');
const fs = require('fs').promises;
const path = require('path');

class AdvancedDocumentationPipeline {
  constructor(options = {}) {
    this.options = {
      src: './src/',
      dest: './docs/',
      config: './apidoc.json',
      enableAnalytics: true,
      enableSearch: true,
      enableVersioning: true,
      ...options
    };
  }

  async run() {
    console.log('🚀 Starting advanced documentation pipeline...');

    try {
      // Stage 1: Pre-processing
      await this.preProcess();

      // Stage 2: Generate documentation
      await this.generateDocs();

      // Stage 3: Post-processing
      await this.postProcess();

      // Stage 4: Quality checks
      await this.qualityChecks();

      console.log('✅ Documentation pipeline completed successfully');

    } catch (error) {
      console.error('❌ Pipeline failed:', error.message);
      throw error;
    }
  }

  async preProcess() {
    console.log('📋 Pre-processing...');

    // Clean destination
    await fs.rm(this.options.dest, { recursive: true, force: true });
    await fs.mkdir(this.options.dest, { recursive: true });

    // Validate source files
    await this.validateSourceFiles();

    // Generate dynamic config
    await this.generateDynamicConfig();
  }

  async generateDocs() {
    console.log('📚 Generating documentation...');

    const success = await apidoc.createDoc({
      src: this.options.src,
      dest: this.options.dest,
      config: this.options.config,
      debug: false,
      verbose: true,
      markdown: true
    });

    if (!success) {
      throw new Error('Documentation generation failed');
    }
  }

  async postProcess() {
    console.log('🔧 Post-processing...');

    if (this.options.enableSearch) {
      await this.addSearchFunctionality();
    }

    if (this.options.enableAnalytics) {
      await this.addAnalytics();
    }

    if (this.options.enableVersioning) {
      await this.addVersioningSupport();
    }

    await this.optimizeAssets();
  }

  async qualityChecks() {
    console.log('🔍 Running quality checks...');

    // Check broken links
    await this.checkBrokenLinks();

    // Validate HTML
    await this.validateHTML();

    // Performance audit
    await this.performanceAudit();
  }

  async validateSourceFiles() {
    // Implementation for source validation
    console.log('   ✓ Source files validated');
  }

  async generateDynamicConfig() {
    // Implementation for dynamic config generation
    console.log('   ✓ Dynamic configuration generated');
  }

  async addSearchFunctionality() {
    // Implementation for search functionality
    console.log('   ✓ Search functionality added');
  }

  async addAnalytics() {
    // Implementation for analytics
    console.log('   ✓ Analytics integration added');
  }

  async addVersioningSupport() {
    // Implementation for versioning
    console.log('   ✓ Versioning support added');
  }

  async optimizeAssets() {
    // Implementation for asset optimization
    console.log('   ✓ Assets optimized');
  }

  async checkBrokenLinks() {
    // Implementation for broken link checking
    console.log('   ✓ No broken links found');
  }

  async validateHTML() {
    // Implementation for HTML validation
    console.log('   ✓ HTML validation passed');
  }

  async performanceAudit() {
    // Implementation for performance audit
    console.log('   ✓ Performance audit completed');
  }
}

// Usage
const pipeline = new AdvancedDocumentationPipeline({
  src: ['./api/', './routes/'],
  dest: './dist/docs/',
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableSearch: true,
  enableVersioning: true
});

pipeline.run().catch(error => {
  console.error('Pipeline failed:', error);
  process.exit(1);
});
```

## 📋 Best Practices

### 1. Error Handling
- ✅ Always wrap APIDoc calls in try-catch blocks
- ✅ Provide meaningful error messages
- ✅ Use proper exit codes for CI/CD
- ✅ Log errors for debugging

### 2. Performance
- ✅ Use parse-only mode for validation
- ✅ Implement caching for large projects
- ✅ Process only changed files when possible
- ✅ Optimize source file patterns

### 3. Integration
- ✅ Separate configuration from code
- ✅ Support multiple environments
- ✅ Integrate with existing build tools
- ✅ Provide clear feedback to developers

### 4. Maintenance
- ✅ Validate documentation in CI/CD
- ✅ Monitor documentation quality
- ✅ Keep dependencies updated
- ✅ Document custom workflows

APIDoc's programmatic API enables seamless integration into any Node.js development workflow, providing flexibility and automation for professional documentation generation.