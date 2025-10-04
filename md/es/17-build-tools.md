# 🔧 Herramientas y Plugins

APIDoc se integra perfectamente con herramientas de build populares, permitiendo automatizar la generación de documentación en pipelines de desarrollo y CI/CD.

## 🛠️ Herramientas Soportadas

### Build Tools
- **Webpack**: Plugin oficial y configuraciones personalizadas
- **Vite**: Plugin nativo para proyectos modernos
- **Rollup**: Plugin para bundling de librerías
- **Grunt**: Task runner clásico con plugin dedicado
- **Gulp**: Stream-based build system

### Task Runners
- **npm scripts**: Integración directa en package.json
- **yarn scripts**: Soporte completo para Yarn workspaces
- **Makefile**: Para proyectos que prefieren Make
- **Just**: Comandos modernos tipo Make

### CI/CD Platforms
- **GitHub Actions**: Workflows automatizados
- **GitLab CI**: Pipeline completo con cache
- **Jenkins**: Jobs de integración continua
- **Circle CI**: Configuración optimizada
- **Azure DevOps**: Pipeline Azure YAML

## 📦 Webpack Integration

### Plugin Oficial
```bash
npm install --save-dev webpack-apidoc-plugin
```

```javascript
// webpack.config.js
const ApiDocPlugin = require('webpack-apidoc-plugin');

module.exports = {
  // ... otras configuraciones
  plugins: [
    new ApiDocPlugin({
      src: './src',
      dest: './docs',
      config: './apidoc.json',
      silent: false
    })
  ]
};
```

### Configuración Avanzada con Webpack
```javascript
// webpack.config.js
const path = require('path');
const ApiDocPlugin = require('webpack-apidoc-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',

  plugins: [
    new ApiDocPlugin({
      src: [
        path.resolve(__dirname, 'src/api'),
        path.resolve(__dirname, 'src/controllers')
      ],
      dest: path.resolve(__dirname, 'public/docs'),
      config: path.resolve(__dirname, 'apidoc.json'),

      // Opciones avanzadas
      template: path.resolve(__dirname, 'custom-template'),
      dryRun: process.env.NODE_ENV === 'test',
      verbose: process.env.NODE_ENV === 'development',

      // Filtros
      filterVersion: process.env.API_VERSION,
      mqttOnly: process.env.MQTT_ONLY === 'true',

      // Watch mode
      watch: process.env.NODE_ENV === 'development',
      watchOptions: {
        ignored: /node_modules/,
        poll: 1000
      }
    }),

    // Servir documentación en dev mode
    ...(process.env.NODE_ENV === 'development' ? [
      new (require('webpack-dev-server'))({
        static: {
          directory: path.resolve(__dirname, 'public/docs')
        },
        port: 8081
      })
    ] : [])
  ]
};
```

## ⚡ Vite Integration

### Plugin para Vite
```bash
npm install --save-dev vite-plugin-apidoc
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import apidoc from 'vite-plugin-apidoc';

export default defineConfig({
  plugins: [
    apidoc({
      src: ['./src/api'],
      dest: './dist/docs',
      config: './apidoc.json',

      // Ejecutar solo en build
      buildOnly: true,

      // Watch en desarrollo
      watch: {
        enabled: true,
        paths: ['src/**/*.js', 'src/**/*.ts']
      }
    })
  ],

  // Servir docs en desarrollo
  server: {
    proxy: {
      '/docs': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
});
```

### Plugin Personalizado para Vite
```javascript
// plugins/vite-apidoc.js
import { createDoc } from '@hrefcl/apidoc';
import { watch } from 'chokidar';
import path from 'path';

export function apidocPlugin(options = {}) {
  let isBuilding = false;

  return {
    name: 'apidoc',

    async buildStart() {
      if (!isBuilding) {
        isBuilding = true;
        await generateDocs(options);
      }
    },

    configureServer(server) {
      if (options.watch?.enabled) {
        const watcher = watch(options.watch.paths || ['src/**/*']);

        watcher.on('change', async () => {
          console.log('📝 Regenerando documentación APIDoc...');
          await generateDocs(options);

          // Hot reload de docs
          server.ws.send({
            type: 'full-reload'
          });
        });
      }
    }
  };
}

async function generateDocs(options) {
  try {
    await createDoc({
      src: options.src,
      dest: options.dest,
      config: options.config,
      silent: true
    });
    console.log('✅ Documentación APIDoc actualizada');
  } catch (error) {
    console.error('❌ Error generando documentación:', error.message);
  }
}
```

## 🏗️ Rollup Integration

### Plugin para Rollup
```bash
npm install --save-dev rollup-plugin-apidoc
```

```javascript
// rollup.config.js
import apidoc from 'rollup-plugin-apidoc';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },

  plugins: [
    apidoc({
      src: ['src/api'],
      dest: 'dist/docs',

      // Solo en build de producción
      enabled: process.env.NODE_ENV === 'production',

      // Opciones de APIDoc
      options: {
        config: './apidoc.json',
        silent: true
      }
    })
  ]
};
```

## 🥤 Gulp Integration

### Plugin Oficial
```bash
npm install --save-dev gulp-apidoc
```

```javascript
// gulpfile.js
const gulp = require('gulp');
const apidoc = require('gulp-apidoc');
const browserSync = require('browser-sync').create();

// Task de documentación
gulp.task('docs', (done) => {
  apidoc({
    src: 'src/',
    dest: 'docs/',
    config: './apidoc.json'
  }, done);
});

// Watch para desarrollo
gulp.task('docs:watch', () => {
  gulp.watch(['src/**/*.js', 'apidoc.json'], gulp.series('docs'));
});

// Servir documentación
gulp.task('docs:serve', () => {
  browserSync.init({
    server: {
      baseDir: './docs'
    },
    port: 8080
  });

  gulp.watch('./docs/**/*').on('change', browserSync.reload);
});

// Task de desarrollo completo
gulp.task('dev', gulp.parallel('docs:watch', 'docs:serve'));

// Build de producción
gulp.task('build', gulp.series('docs'));
```

### Configuración Avanzada con Gulp
```javascript
// gulpfile.js
const gulp = require('gulp');
const apidoc = require('gulp-apidoc');
const clean = require('gulp-clean');
const zip = require('gulp-zip');
const deploy = require('gulp-deploy');

// Limpiar directorio de salida
gulp.task('clean', () => {
  return gulp.src('docs', { read: false, allowEmpty: true })
    .pipe(clean());
});

// Generar documentación con múltiples versiones
gulp.task('docs:v1', (done) => {
  apidoc({
    src: 'src/v1/',
    dest: 'docs/v1/',
    config: './apidoc.v1.json'
  }, done);
});

gulp.task('docs:v2', (done) => {
  apidoc({
    src: 'src/v2/',
    dest: 'docs/v2/',
    config: './apidoc.v2.json'
  }, done);
});

// Copiar assets adicionales
gulp.task('assets', () => {
  return gulp.src(['assets/**/*', 'README.md'])
    .pipe(gulp.dest('docs/'));
});

// Comprimir documentación
gulp.task('package', () => {
  return gulp.src('docs/**/*')
    .pipe(zip(`api-docs-${new Date().toISOString().split('T')[0]}.zip`))
    .pipe(gulp.dest('dist/'));
});

// Deploy a servidor
gulp.task('deploy', () => {
  return gulp.src('docs/**/*')
    .pipe(deploy({
      host: 'docs.example.com',
      username: process.env.DEPLOY_USER,
      password: process.env.DEPLOY_PASS,
      destination: '/var/www/docs'
    }));
});

// Workflow completo
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('docs:v1', 'docs:v2'),
  'assets',
  'package'
));
```

## 🎯 Grunt Integration

### Plugin Oficial
```bash
npm install --save-dev grunt-apidoc
```

```javascript
// Gruntfile.js
module.exports = function(grunt) {
  grunt.initConfig({
    // Configuración APIDoc
    apidoc: {
      myapi: {
        src: "src/",
        dest: "docs/",
        options: {
          config: "./apidoc.json",
          includeFilters: [".*\\.js$"],
          excludeFilters: ["node_modules/"]
        }
      },

      // Múltiples targets
      v1: {
        src: "src/v1/",
        dest: "docs/v1/",
        options: {
          config: "./apidoc.v1.json"
        }
      },

      v2: {
        src: "src/v2/",
        dest: "docs/v2/",
        options: {
          config: "./apidoc.v2.json"
        }
      }
    },

    // Watch para desarrollo
    watch: {
      apidoc: {
        files: ['src/**/*.js', 'apidoc.json'],
        tasks: ['apidoc:myapi']
      }
    },

    // Servidor de desarrollo
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'docs',
          livereload: true
        }
      }
    },

    // Limpieza
    clean: {
      docs: ['docs/']
    },

    // Compresión
    compress: {
      docs: {
        options: {
          archive: 'dist/api-docs.zip'
        },
        files: [{
          expand: true,
          cwd: 'docs/',
          src: ['**/*'],
          dest: 'api-docs/'
        }]
      }
    }
  });

  // Cargar plugins
  grunt.loadNpmTasks('grunt-apidoc');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Tasks
  grunt.registerTask('docs', ['clean:docs', 'apidoc:myapi']);
  grunt.registerTask('docs:all', ['clean:docs', 'apidoc:v1', 'apidoc:v2']);
  grunt.registerTask('serve', ['docs', 'connect:server', 'watch']);
  grunt.registerTask('build', ['docs:all', 'compress:docs']);
  grunt.registerTask('default', ['docs']);
};
```

## 📝 npm Scripts Integration

### package.json Básico (CLI v5)
```json
{
  "scripts": {
    "docs": "apidoc generate -i src/ -o docs/",
    "docs:watch": "apidoc generate -i src/ -o docs/ --watch",
    "docs:serve": "npm run docs && npx http-server docs -p 8080 -o",
    "docs:build": "npm run docs && npm run docs:optimize",
    "docs:optimize": "npx imagemin docs/assets/**/* --out-dir=docs/assets/optimized",
    "docs:deploy": "npm run docs:build && npx gh-pages -d docs"
  }
}
```

### Scripts Avanzados (CLI v5)
```json
{
  "scripts": {
    "docs:clean": "rimraf docs",
    "docs:generate": "apidoc generate -i src/ -o docs/ --config apidoc.json",
    "docs:validate": "apidoc generate -i src/ --dry-run --config apidoc.json",
    "docs:multi": "npm-run-all --parallel docs:v1 docs:v2",
    "docs:v1": "apidoc generate -i src/v1/ -o docs/v1/ --filter-version 1.0.0",
    "docs:v2": "apidoc generate -i src/v2/ -o docs/v2/ --filter-version 2.0.0",

    "docs:watch": "apidoc generate -i src/ -o docs/ --watch",
    "docs:serve": "concurrently \"npm run docs:watch\" \"npx http-server docs -p 8080\"",

    "docs:test": "npm run docs:validate && npm run test:docs",
    "test:docs": "jest --testPathPattern=docs",

    "docs:package": "npm run docs:generate && tar -czf api-docs.tar.gz docs/",
    "docs:upload": "npm run docs:package && aws s3 cp api-docs.tar.gz s3://my-docs-bucket/",

    "docs:export:json": "apidoc export json -o api.json",
    "docs:export:openapi": "apidoc export openapi -o swagger.yaml",
    "docs:export:markdown": "apidoc export markdown -o API.md",

    "predocs:deploy": "npm run docs:test",
    "docs:deploy": "npm run docs:generate && npx surge docs/ my-api-docs.surge.sh",

    "postinstall": "npm run docs:generate"
  }
}
```

## ⚙️ GitHub Actions

### Workflow Básico
```yaml
# .github/workflows/docs.yml
name: Generate API Documentation

on:
  push:
    branches: [main, develop]
    paths: ['src/**', 'apidoc.json']

  pull_request:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Generate documentation
      run: npm run docs

    - name: Upload docs artifact
      uses: actions/upload-artifact@v4
      with:
        name: api-documentation
        path: docs/
        retention-days: 30

    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./docs
        cname: docs.example.com
```

### Workflow Avanzado con Cache
```yaml
# .github/workflows/docs-advanced.yml
name: Advanced Documentation Workflow

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

env:
  NODE_VERSION: '20'
  DOCS_DIR: 'docs'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Validate API documentation
      run: npm run docs:validate

  generate:
    needs: validate
    runs-on: ubuntu-latest
    strategy:
      matrix:
        version: ['1.0.0', '2.0.0']

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Generate docs for v${{ matrix.version }}
      run: |
        apidoc generate -i src/ -o docs/v${{ matrix.version }}/ --filter-version ${{ matrix.version }}

    - name: Upload version-specific docs
      uses: actions/upload-artifact@v4
      with:
        name: docs-v${{ matrix.version }}
        path: docs/v${{ matrix.version }}/

  combine-and-deploy:
    needs: generate
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Download all artifacts
      uses: actions/download-artifact@v4
      with:
        path: docs/

    - name: Create index page
      run: |
        cat > docs/index.html << EOF
        <!DOCTYPE html>
        <html>
        <head><title>API Documentation</title></head>
        <body>
          <h1>API Documentation</h1>
          <ul>
            <li><a href="v1.0.0/">Version 1.0.0</a></li>
            <li><a href="v2.0.0/">Version 2.0.0</a></li>
          </ul>
        </body>
        </html>
        EOF

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './docs'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🚀 CI/CD Optimizations

### Cache Strategies
```yaml
# Cache para npm
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# Cache para documentación generada
- name: Cache generated docs
  uses: actions/cache@v3
  with:
    path: docs/
    key: docs-${{ hashFiles('src/**/*.js', 'apidoc.json') }}
```

### Parallel Processing
```yaml
jobs:
  docs:
    strategy:
      matrix:
        api: [users, products, orders, payments]

    steps:
    - name: Generate ${{ matrix.api }} docs
      run: |
        apidoc generate -i src/${{ matrix.api }}/ -o docs/${{ matrix.api }}/
```

Las herramientas de build permiten integrar APIDoc seamlessly en cualquier workflow de desarrollo, desde simples npm scripts hasta complejos pipelines de CI/CD.