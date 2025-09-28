---
title: "Build Tools Integration"
category: "Development"
order: 17
---

# 🛠️ Build Tools Integration

Complete guide for integrating APIDoc with modern build tools including Webpack, Vite, Gulp, Rollup, and custom build pipelines for automated documentation generation.

## 🚀 Overview

APIDoc 4.0 seamlessly integrates with all major build tools and development workflows:

- **📦 Webpack Integration**: Plugins and loaders for development and production
- **⚡ Vite Support**: Fast development with Hot Module Replacement
- **🥤 Gulp Tasks**: Streaming build pipelines
- **📊 Rollup Plugins**: ES module bundling
- **🔄 Custom Pipelines**: Flexible integration patterns
- **🧪 Watch Mode**: Real-time documentation updates

## 📦 Webpack Integration

### Basic Webpack Plugin
```javascript
// webpack.config.js
const path = require('path');
const ApiDocPlugin = require('./plugins/apidoc-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new ApiDocPlugin({
      src: path.join(__dirname, 'src/'),
      dest: path.join(__dirname, 'dist/docs/'),
      config: path.join(__dirname, 'apidoc.json'),
      debug: process.env.NODE_ENV === 'development'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    open: true
  }
};
```

### Custom APIDoc Webpack Plugin
```javascript
// plugins/apidoc-webpack-plugin.js
const apidoc = require('@hrefcl/apidoc');
const path = require('path');
const fs = require('fs').promises;

class ApiDocPlugin {
  constructor(options = {}) {
    this.options = {
      src: './src/',
      dest: './docs/',
      config: './apidoc.json',
      debug: false,
      watch: true,
      ...options
    };
  }

  apply(compiler) {
    const pluginName = 'ApiDocPlugin';

    // Generate docs before compilation
    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      try {
        console.log('🔄 Generating API documentation...');
        const startTime = Date.now();

        const success = await apidoc.createDoc(this.options);

        if (success) {
          const duration = Date.now() - startTime;
          console.log(`✅ API documentation generated in ${duration}ms`);
        } else {
          console.error('❌ API documentation generation failed');
        }

        callback();
      } catch (error) {
        console.error('API documentation error:', error);
        callback(error);
      }
    });

    // Copy documentation to output directory
    compiler.hooks.emit.tapAsync(pluginName, async (compilation, callback) => {
      try {
        await this.copyDocsToOutput(compilation);
        callback();
      } catch (error) {
        callback(error);
      }
    });

    // Watch mode support
    if (this.options.watch && compiler.watchMode) {
      this.setupWatcher(compiler);
    }
  }

  async copyDocsToOutput(compilation) {
    const docsPath = path.resolve(this.options.dest);

    try {
      const files = await this.getFilesRecursively(docsPath);

      for (const file of files) {
        const relativePath = path.relative(docsPath, file);
        const content = await fs.readFile(file);

        compilation.assets[`docs/${relativePath}`] = {
          source: () => content,
          size: () => content.length
        };
      }
    } catch (error) {
      console.warn('Warning: Could not copy documentation files:', error.message);
    }
  }

  async getFilesRecursively(dir) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...await this.getFilesRecursively(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  setupWatcher(compiler) {
    const chokidar = require('chokidar');

    const watcher = chokidar.watch(this.options.src, {
      ignored: /node_modules/,
      persistent: true
    });

    watcher.on('change', async (filePath) => {
      if (this.shouldRegenerateForFile(filePath)) {
        console.log(`📝 File changed: ${filePath}`);
        await this.regenerateDocumentation();
      }
    });
  }

  shouldRegenerateForFile(filePath) {
    const extensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.php', '.rb', '.go'];
    return extensions.some(ext => filePath.endsWith(ext));
  }

  async regenerateDocumentation() {
    try {
      console.log('🔄 Regenerating documentation...');
      const success = await apidoc.createDoc(this.options);

      if (success) {
        console.log('✅ Documentation updated');
      } else {
        console.error('❌ Documentation update failed');
      }
    } catch (error) {
      console.error('Documentation update error:', error);
    }
  }
}

module.exports = ApiDocPlugin;
```

### Webpack Development Server Integration
```javascript
// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
      },
      {
        directory: path.join(__dirname, 'dist/docs'),
        publicPath: '/docs',
      }
    ],
    port: 3000,
    open: ['/docs'],
    hot: true,
    watchFiles: ['src/**/*.js', 'src/**/*.ts'],
    onBeforeSetupMiddleware: (devServer) => {
      // Custom middleware for API documentation
      devServer.app.get('/api/docs-status', (req, res) => {
        res.json({
          status: 'ready',
          timestamp: new Date().toISOString(),
          docsPath: '/docs'
        });
      });
    }
  }
});
```

## ⚡ Vite Integration

### Vite Plugin
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { apidocPlugin } from './plugins/vite-apidoc-plugin';

export default defineConfig({
  plugins: [
    apidocPlugin({
      src: './src/',
      dest: './docs/',
      config: './apidoc.json',
      watch: true
    })
  ],
  server: {
    port: 3000,
    open: '/docs',
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        docs: './docs/index.html'
      }
    }
  }
});
```

### Custom Vite APIDoc Plugin
```javascript
// plugins/vite-apidoc-plugin.js
import apidoc from '@hrefcl/apidoc';
import { watch } from 'chokidar';
import path from 'path';

export function apidocPlugin(options = {}) {
  const opts = {
    src: './src/',
    dest: './docs/',
    config: './apidoc.json',
    watch: true,
    ...options
  };

  let watcher;

  return {
    name: 'apidoc',
    configResolved(config) {
      opts.isDev = config.command === 'serve';
    },
    async buildStart() {
      console.log('🔄 Generating API documentation...');

      try {
        const success = await apidoc.createDoc(opts);

        if (success) {
          console.log('✅ API documentation generated');

          // Setup file watcher in development mode
          if (opts.isDev && opts.watch) {
            this.setupWatcher();
          }
        } else {
          console.error('❌ API documentation generation failed');
        }
      } catch (error) {
        console.error('API documentation error:', error);
      }
    },
    setupWatcher() {
      if (watcher) return;

      watcher = watch(opts.src, {
        ignored: /node_modules/,
        persistent: true
      });

      watcher.on('change', async (filePath) => {
        if (this.shouldUpdate(filePath)) {
          console.log(`📝 Updating docs for: ${path.basename(filePath)}`);

          try {
            const success = await apidoc.createDoc(opts);
            if (success) {
              console.log('✅ Documentation updated');
            }
          } catch (error) {
            console.error('Documentation update error:', error);
          }
        }
      });
    },
    shouldUpdate(filePath) {
      const extensions = ['.js', '.ts', '.jsx', '.tsx'];
      return extensions.some(ext => filePath.endsWith(ext));
    },
    closeBundle() {
      if (watcher) {
        watcher.close();
      }
    }
  };
}
```

### Vite + TypeScript Integration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { apidocPlugin } from './plugins/vite-apidoc-plugin';

export default defineConfig({
  plugins: [
    apidocPlugin({
      src: './src/',
      dest: './docs/',
      config: './apidoc.json',
      includeFilters: ['**/*.ts', '**/*.js'],
      excludeFilters: ['**/*.test.ts', '**/*.spec.ts']
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@docs': resolve(__dirname, 'docs')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

## 🥤 Gulp Integration

### Basic Gulp Tasks
```javascript
// gulpfile.js
const gulp = require('gulp');
const apidoc = require('@hrefcl/apidoc');
const del = require('del');
const connect = require('gulp-connect');
const path = require('path');

// Configuration
const config = {
  src: 'src/**/*.js',
  dest: 'docs/',
  apidocConfig: './apidoc.json',
  port: 3000
};

// Clean documentation directory
gulp.task('docs:clean', () => {
  return del([config.dest]);
});

// Generate API documentation
gulp.task('docs:generate', () => {
  return new Promise((resolve, reject) => {
    apidoc.createDoc({
      src: 'src/',
      dest: config.dest,
      config: config.apidocConfig,
      verbose: true
    }).then(success => {
      if (success) {
        console.log('✅ API documentation generated');
        resolve();
      } else {
        reject(new Error('API documentation generation failed'));
      }
    }).catch(reject);
  });
});

// Copy additional assets
gulp.task('docs:assets', () => {
  return gulp.src(['assets/**/*', 'images/**/*'], { base: '.' })
    .pipe(gulp.dest(config.dest));
});

// Start development server
gulp.task('docs:serve', () => {
  return connect.server({
    root: config.dest,
    port: config.port,
    livereload: true
  });
});

// Watch for changes
gulp.task('docs:watch', () => {
  gulp.watch(config.src, gulp.series('docs:generate'));
  gulp.watch(['assets/**/*', 'images/**/*'], gulp.series('docs:assets'));
  gulp.watch(`${config.dest}/**/*`).on('change', () => {
    gulp.src(`${config.dest}/**/*`).pipe(connect.reload());
  });
});

// Main documentation task
gulp.task('docs', gulp.series(
  'docs:clean',
  'docs:generate',
  'docs:assets'
));

// Development workflow
gulp.task('docs:dev', gulp.series(
  'docs',
  gulp.parallel('docs:serve', 'docs:watch')
));

// Production build
gulp.task('docs:build', gulp.series(
  'docs:clean',
  'docs:generate',
  'docs:assets'
));

// Default task
gulp.task('default', gulp.series('docs:dev'));
```

### Advanced Gulp Pipeline
```javascript
// gulpfile.advanced.js
const gulp = require('gulp');
const apidoc = require('@hrefcl/apidoc');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');

// Error handling
const handleError = (err) => {
  console.error('Task failed:', err.message);
  notify.onError({
    title: 'Gulp Error',
    message: '<%= error.message %>'
  })(err);
};

// Advanced documentation generation with error handling
gulp.task('docs:generate:advanced', () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('🔄 Starting documentation generation...');

      // Pre-generation validation
      const fs = require('fs').promises;
      const configExists = await fs.access('./apidoc.json').then(() => true).catch(() => false);

      if (!configExists) {
        throw new Error('apidoc.json configuration file not found');
      }

      // Generate documentation
      const success = await apidoc.createDoc({
        src: ['src/', 'routes/'],
        dest: 'docs/',
        config: './apidoc.json',
        template: './template/',
        debug: process.env.NODE_ENV === 'development',
        verbose: true
      });

      if (!success) {
        throw new Error('Documentation generation failed');
      }

      console.log('✅ Documentation generated successfully');
      resolve();

    } catch (error) {
      handleError(error);
      reject(error);
    }
  });
});

// Optimize generated documentation
gulp.task('docs:optimize', () => {
  return gulp.src('docs/**/*.html')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(size({ title: 'HTML files', showFiles: true }))
    .pipe(gulp.dest('docs/'));
});

// Optimize CSS files
gulp.task('docs:css', () => {
  return gulp.src('docs/**/*.css')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write('.'))
    .pipe(size({ title: 'CSS files', showFiles: true }))
    .pipe(gulp.dest('docs/'));
});

// Optimize JavaScript files
gulp.task('docs:js', () => {
  return gulp.src('docs/**/*.js')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(size({ title: 'JS files', showFiles: true }))
    .pipe(gulp.dest('docs/'));
});

// Optimize images
gulp.task('docs:images', () => {
  return gulp.src('docs/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe(plumber({ errorHandler: handleError }))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 85, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(size({ title: 'Images', showFiles: true }))
    .pipe(gulp.dest('docs/'));
});

// Production build with optimizations
gulp.task('docs:production', gulp.series(
  'docs:clean',
  'docs:generate:advanced',
  gulp.parallel(
    'docs:optimize',
    'docs:css',
    'docs:js',
    'docs:images'
  )
));
```

## 📊 Rollup Integration

### Rollup Plugin
```javascript
// rollup.config.js
import apidocPlugin from './plugins/rollup-apidoc-plugin';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'cjs'
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    apidocPlugin({
      src: './src/',
      dest: './docs/',
      config: './apidoc.json'
    }),
    terser()
  ]
};
```

### Custom Rollup APIDoc Plugin
```javascript
// plugins/rollup-apidoc-plugin.js
import apidoc from '@hrefcl/apidoc';

export default function apidocPlugin(options = {}) {
  const opts = {
    src: './src/',
    dest: './docs/',
    config: './apidoc.json',
    ...options
  };

  return {
    name: 'apidoc',
    async buildStart() {
      console.log('🔄 Generating API documentation...');

      try {
        const success = await apidoc.createDoc(opts);

        if (success) {
          console.log('✅ API documentation generated');
        } else {
          this.error('API documentation generation failed');
        }
      } catch (error) {
        this.error(`API documentation error: ${error.message}`);
      }
    },
    generateBundle(outputOptions, bundle) {
      // Optionally include documentation files in the bundle
      if (opts.includeInBundle) {
        const fs = require('fs');
        const path = require('path');

        try {
          const docsIndex = fs.readFileSync(
            path.join(opts.dest, 'index.html'),
            'utf8'
          );

          this.emitFile({
            type: 'asset',
            fileName: 'docs/index.html',
            source: docsIndex
          });
        } catch (error) {
          this.warn(`Could not include docs in bundle: ${error.message}`);
        }
      }
    }
  };
}
```

## 🔄 Custom Build Pipelines

### Node.js Build Script
```javascript
// scripts/build-docs.js
const apidoc = require('@hrefcl/apidoc');
const fs = require('fs').promises;
const path = require('path');
const chokidar = require('chokidar');

class DocumentationBuilder {
  constructor(config = {}) {
    this.config = {
      src: './src/',
      dest: './docs/',
      config: './apidoc.json',
      watch: false,
      optimize: false,
      verbose: true,
      ...config
    };

    this.isBuilding = false;
    this.buildQueue = [];
  }

  async build() {
    if (this.isBuilding) {
      return new Promise(resolve => {
        this.buildQueue.push(resolve);
      });
    }

    this.isBuilding = true;

    try {
      await this.preBuild();
      await this.generateDocs();
      await this.postBuild();

      if (this.config.optimize) {
        await this.optimize();
      }

      console.log('✅ Documentation build completed');

      // Process queued builds
      const queuedResolvers = [...this.buildQueue];
      this.buildQueue = [];
      queuedResolvers.forEach(resolve => resolve());

    } catch (error) {
      console.error('❌ Documentation build failed:', error);
      throw error;
    } finally {
      this.isBuilding = false;
    }
  }

  async preBuild() {
    if (this.config.verbose) {
      console.log('🔄 Starting documentation build...');
    }

    // Clean destination directory
    try {
      await fs.rm(this.config.dest, { recursive: true, force: true });
      await fs.mkdir(this.config.dest, { recursive: true });
    } catch (error) {
      console.warn('Warning: Could not clean destination directory');
    }

    // Validate configuration
    await this.validateConfig();
  }

  async validateConfig() {
    try {
      await fs.access(this.config.config);
    } catch (error) {
      throw new Error(`Configuration file not found: ${this.config.config}`);
    }

    // Validate source directories
    const srcDirs = Array.isArray(this.config.src) ? this.config.src : [this.config.src];

    for (const srcDir of srcDirs) {
      try {
        const stat = await fs.stat(srcDir);
        if (!stat.isDirectory()) {
          throw new Error(`Source path is not a directory: ${srcDir}`);
        }
      } catch (error) {
        throw new Error(`Invalid source directory: ${srcDir}`);
      }
    }
  }

  async generateDocs() {
    const startTime = Date.now();

    const success = await apidoc.createDoc({
      src: this.config.src,
      dest: this.config.dest,
      config: this.config.config,
      verbose: this.config.verbose
    });

    if (!success) {
      throw new Error('APIDoc generation failed');
    }

    const duration = Date.now() - startTime;
    if (this.config.verbose) {
      console.log(`📚 Documentation generated in ${duration}ms`);
    }
  }

  async postBuild() {
    // Copy additional assets
    await this.copyAssets();

    // Generate sitemap
    await this.generateSitemap();

    // Create build manifest
    await this.createManifest();
  }

  async copyAssets() {
    const assetsDir = path.join(process.cwd(), 'assets');

    try {
      await fs.access(assetsDir);
      await this.copyDirectory(assetsDir, path.join(this.config.dest, 'assets'));
      console.log('📁 Assets copied');
    } catch (error) {
      // Assets directory doesn't exist, skip
    }
  }

  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }

  async generateSitemap() {
    // Simple sitemap generation
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://api-docs.example.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    await fs.writeFile(path.join(this.config.dest, 'sitemap.xml'), sitemap);
    console.log('🗺️ Sitemap generated');
  }

  async createManifest() {
    const manifest = {
      buildTime: new Date().toISOString(),
      version: require('../package.json').version,
      config: this.config
    };

    await fs.writeFile(
      path.join(this.config.dest, 'build-manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
  }

  async optimize() {
    console.log('🔧 Optimizing documentation...');

    // Minify HTML files
    await this.minifyHTML();

    // Optimize images
    await this.optimizeImages();

    console.log('⚡ Optimization completed');
  }

  async minifyHTML() {
    const htmlmin = require('html-minifier-terser');
    const glob = require('glob');

    const htmlFiles = glob.sync('**/*.html', { cwd: this.config.dest });

    for (const file of htmlFiles) {
      const filePath = path.join(this.config.dest, file);
      const content = await fs.readFile(filePath, 'utf8');

      const minified = await htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true
      });

      await fs.writeFile(filePath, minified);
    }
  }

  async optimizeImages() {
    const imagemin = require('imagemin');
    const imageminPngquant = require('imagemin-pngquant');
    const imageminMozjpeg = require('imagemin-mozjpeg');

    await imagemin([`${this.config.dest}/**/*.{jpg,png}`], {
      destination: this.config.dest,
      plugins: [
        imageminMozjpeg({ quality: 85 }),
        imageminPngquant({ quality: [0.6, 0.8] })
      ]
    });
  }

  watch() {
    if (!this.config.watch) return;

    console.log('👀 Watching for changes...');

    const watcher = chokidar.watch(this.config.src, {
      ignored: /node_modules/,
      persistent: true
    });

    let timeout;

    const debouncedBuild = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.build().catch(console.error);
      }, 500);
    };

    watcher.on('change', debouncedBuild);
    watcher.on('add', debouncedBuild);
    watcher.on('unlink', debouncedBuild);

    return watcher;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const config = {
    watch: args.includes('--watch'),
    optimize: args.includes('--optimize'),
    verbose: !args.includes('--quiet')
  };

  const builder = new DocumentationBuilder(config);

  builder.build()
    .then(() => {
      if (config.watch) {
        builder.watch();
      } else {
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('Build failed:', error);
      process.exit(1);
    });
}

module.exports = DocumentationBuilder;
```

### Make Integration
```makefile
# Makefile
.PHONY: docs docs-dev docs-prod docs-watch docs-clean docs-serve

# Configuration
DOCS_SRC := src/
DOCS_DEST := docs/
DOCS_CONFIG := apidoc.json
DOCS_PORT := 3000

# Default target
docs: docs-clean docs-generate

# Development build
docs-dev:
	@echo "🔄 Building documentation for development..."
	@NODE_ENV=development npx apidoc -i $(DOCS_SRC) -o $(DOCS_DEST) -c $(DOCS_CONFIG) --debug

# Production build
docs-prod: docs-clean
	@echo "🔄 Building documentation for production..."
	@NODE_ENV=production npx apidoc -i $(DOCS_SRC) -o $(DOCS_DEST) -c $(DOCS_CONFIG)
	@echo "🔧 Optimizing documentation..."
	@node scripts/optimize-docs.js

# Generate documentation
docs-generate:
	@echo "📚 Generating API documentation..."
	@npx apidoc -i $(DOCS_SRC) -o $(DOCS_DEST) -c $(DOCS_CONFIG)

# Watch for changes
docs-watch:
	@echo "👀 Watching for changes..."
	@npx nodemon --watch $(DOCS_SRC) --ext js,ts,json --exec "make docs-generate"

# Clean documentation directory
docs-clean:
	@echo "🧹 Cleaning documentation directory..."
	@rm -rf $(DOCS_DEST)
	@mkdir -p $(DOCS_DEST)

# Serve documentation
docs-serve: docs
	@echo "🚀 Serving documentation on port $(DOCS_PORT)..."
	@npx http-server $(DOCS_DEST) -p $(DOCS_PORT) -o

# Development workflow
docs-dev-serve: docs-dev
	@echo "🚀 Starting development server..."
	@make docs-serve &
	@make docs-watch

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	@npm install

# Validate documentation
docs-validate:
	@echo "✅ Validating documentation..."
	@node scripts/validate-docs.js

# Deploy documentation
docs-deploy: docs-prod docs-validate
	@echo "🚀 Deploying documentation..."
	@node scripts/deploy-docs.js

# Help
help:
	@echo "Available targets:"
	@echo "  docs          - Generate documentation"
	@echo "  docs-dev      - Development build"
	@echo "  docs-prod     - Production build"
	@echo "  docs-watch    - Watch for changes"
	@echo "  docs-clean    - Clean documentation"
	@echo "  docs-serve    - Serve documentation"
	@echo "  docs-validate - Validate documentation"
	@echo "  docs-deploy   - Deploy documentation"
	@echo "  install       - Install dependencies"
	@echo "  help          - Show this help"
```

## 🧪 Testing Integration

### Jest Integration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  globalSetup: '<rootDir>/tests/global-setup.js',
  globalTeardown: '<rootDir>/tests/global-teardown.js'
};
```

```javascript
// tests/global-setup.js
const DocumentationBuilder = require('../scripts/build-docs');

module.exports = async () => {
  console.log('🔄 Generating documentation for tests...');

  const builder = new DocumentationBuilder({
    src: './src/',
    dest: './test-docs/',
    config: './apidoc.test.json',
    verbose: false
  });

  await builder.build();

  // Store config for teardown
  global.__DOCS_CONFIG__ = {
    dest: './test-docs/'
  };
};
```

```javascript
// tests/global-teardown.js
const fs = require('fs').promises;

module.exports = async () => {
  if (global.__DOCS_CONFIG__) {
    await fs.rm(global.__DOCS_CONFIG__.dest, { recursive: true, force: true });
  }
};
```

### Documentation Tests
```javascript
// tests/docs.test.js
const fs = require('fs').promises;
const path = require('path');

describe('API Documentation', () => {
  const docsPath = './test-docs/';

  test('should generate index.html', async () => {
    const indexPath = path.join(docsPath, 'index.html');
    const exists = await fs.access(indexPath).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });

  test('should include all API endpoints', async () => {
    const apiDataPath = path.join(docsPath, 'api_data.json');
    const content = await fs.readFile(apiDataPath, 'utf8');
    const apiData = JSON.parse(content);

    const expectedEndpoints = [
      'GET /users',
      'POST /users',
      'GET /users/:id',
      'PUT /users/:id',
      'DELETE /users/:id'
    ];

    expectedEndpoints.forEach(endpoint => {
      const [method, url] = endpoint.split(' ');
      const found = apiData.some(api =>
        api.type.toUpperCase() === method && api.url === url
      );
      expect(found).toBe(true);
    });
  });

  test('should have valid HTML structure', async () => {
    const indexPath = path.join(docsPath, 'index.html');
    const content = await fs.readFile(indexPath, 'utf8');

    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html');
    expect(content).toContain('</html>');
    expect(content).toContain('<title>');
  });
});
```

## 📋 Best Practices

### 1. Performance Optimization
- ✅ Use incremental builds when possible
- ✅ Implement file watching with debouncing
- ✅ Cache generated documentation
- ✅ Parallelize build tasks

### 2. Error Handling
- ✅ Implement comprehensive error handling
- ✅ Provide meaningful error messages
- ✅ Use proper exit codes
- ✅ Log build failures appropriately

### 3. Development Workflow
- ✅ Separate dev and production configurations
- ✅ Enable hot reloading in development
- ✅ Implement build validation
- ✅ Integrate with testing frameworks

### 4. CI/CD Integration
- ✅ Automate documentation generation
- ✅ Validate documentation in pipelines
- ✅ Deploy documentation automatically
- ✅ Monitor build performance

APIDoc's build tool integration provides seamless automation for documentation generation across all modern development workflows and toolchains.