# 💻 Uso Programático

APIDoc puede ser utilizado programáticamente en aplicaciones Node.js, permitiendo integración automatizada en pipelines de CI/CD y flujos de trabajo personalizados.

## 🚀 Instalación y Configuración

### Instalación
```bash
# Como dependencia de desarrollo
npm install --save-dev @hrefcl/apidoc

# Como dependencia global
npm install -g @hrefcl/apidoc
```

### Importación ES6/ESM
```javascript
import { createDoc } from '@hrefcl/apidoc';
```

### Importación CommonJS
```javascript
const { createDoc } = require('@hrefcl/apidoc');
```

## 📋 API Principal

### createDoc(options)
Función principal para generar documentación programáticamente.

#### Opciones Disponibles
```typescript
interface ApiDocOptions {
  src: string[];           // Directorios fuente
  dest: string;           // Directorio de salida
  dryRun?: boolean;       // Solo validar, no generar archivos
  silent?: boolean;       // Suprimir salida en consola
  verbose?: boolean;      // Salida detallada
  debug?: boolean;        // Modo debug
  config?: string;        // Ruta al archivo de configuración
  template?: string;      // Directorio de template personalizado
  filterVersion?: string; // Filtrar por versión específica
  mqttOnly?: boolean;     // Solo endpoints MQTT
  failOnMqttSchemaError?: boolean; // Fallar en errores de schema MQTT
}
```

## 🎯 Ejemplos Básicos

### Uso Simple
```javascript
import path from 'path';
import { createDoc } from '@hrefcl/apidoc';

// Configuración básica
const result = await createDoc({
  src: [path.resolve(__dirname, 'src')],
  dest: path.resolve(__dirname, 'docs'),
  dryRun: false,
  silent: false
});

if (result.success) {
  console.log('✅ Documentación generada exitosamente');
  console.log(`📁 Archivos generados en: ${result.dest}`);
} else {
  console.error('❌ Error generando documentación:', result.error);
}
```

### Con Configuración Personalizada
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

  console.log('📊 Estadísticas:');
  console.log(`- Archivos procesados: ${result.stats.filesProcessed}`);
  console.log(`- Endpoints documentados: ${result.stats.endpointsFound}`);
  console.log(`- Grupos generados: ${result.stats.groupsGenerated}`);
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
```

## 🔧 Integración en Build Scripts

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

### Script de Generación (generate-docs.js)
```javascript
#!/usr/bin/env node

import { createDoc } from '@hrefcl/apidoc';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.argv.includes('--dev');

async function generateDocs() {
  console.log('🚀 Iniciando generación de documentación...');

  const startTime = Date.now();

  const options = {
    src: [
      resolve(__dirname, '../src/api'),
      resolve(__dirname, '../src/controllers')
    ],
    dest: resolve(__dirname, '../docs'),
    dryRun: false,
    silent: false,
    verbose: isDev,
    debug: isDev
  };

  try {
    const result = await createDoc(options);

    const duration = Date.now() - startTime;

    if (result.success) {
      console.log('✅ Documentación generada exitosamente');
      console.log(`⏱️  Tiempo: ${duration}ms`);
      console.log(`📁 Ubicación: ${result.dest}`);

      // Mostrar estadísticas detalladas en modo dev
      if (isDev && result.stats) {
        console.log('\n📊 Estadísticas detalladas:');
        console.log(`- Archivos procesados: ${result.stats.filesProcessed}`);
        console.log(`- Líneas de código: ${result.stats.linesOfCode}`);
        console.log(`- Endpoints REST: ${result.stats.restEndpoints}`);
        console.log(`- Endpoints MQTT: ${result.stats.mqttEndpoints}`);
        console.log(`- Grupos generados: ${result.stats.groupsGenerated}`);
      }
    } else {
      console.error('❌ Error generando documentación');
      console.error(result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Error inesperado:', error.message);
    if (isDev) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

generateDocs();
```

## 👀 Watch Mode para Desarrollo

### Script de Watch (watch-docs.js)
```javascript
import { watch } from 'chokidar';
import { createDoc } from '@hrefcl/apidoc';
import { debounce } from 'lodash-es';
import path from 'path';

const srcDirs = ['./src/api', './src/controllers'];
const destDir = './docs';

// Función debounced para evitar regeneración excesiva
const generateDocs = debounce(async () => {
  console.log('🔄 Regenerando documentación...');

  try {
    const result = await createDoc({
      src: srcDirs.map(dir => path.resolve(dir)),
      dest: path.resolve(destDir),
      silent: true // Modo silencioso para watch
    });

    if (result.success) {
      console.log('✅ Documentación actualizada');
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}, 1000); // Esperar 1 segundo después del último cambio

// Configurar watcher
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
    console.log(`📝 Archivo modificado: ${path}`);
    generateDocs();
  })
  .on('add', (path) => {
    console.log(`➕ Archivo añadido: ${path}`);
    generateDocs();
  })
  .on('unlink', (path) => {
    console.log(`🗑️  Archivo eliminado: ${path}`);
    generateDocs();
  });

console.log('👀 Observando cambios en:', srcDirs);
console.log('💡 Presiona Ctrl+C para detener');

// Generar documentación inicial
generateDocs();
```

## 🔄 Integración CI/CD

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
# Dockerfile para generación de docs
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY apidoc.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY src/ ./src/
COPY scripts/ ./scripts/

# Generar documentación
RUN node scripts/generate-docs.js

# Servir documentación
FROM nginx:alpine
COPY --from=0 /app/docs /usr/share/nginx/html
EXPOSE 80
```

## 🛠️ Configuración Avanzada

### Validación con Dry Run
```javascript
import { createDoc } from '@hrefcl/apidoc';

async function validateDocs() {
  const result = await createDoc({
    src: ['./src'],
    dest: './tmp', // No se usa en dry run
    dryRun: true,  // Solo validar
    silent: false
  });

  if (result.success) {
    console.log('✅ Documentación válida');
    return true;
  } else {
    console.error('❌ Errores encontrados:');
    result.errors?.forEach(error => {
      console.error(`- ${error.file}:${error.line} - ${error.message}`);
    });
    return false;
  }
}

// Usar en scripts de pre-commit
if (!(await validateDocs())) {
  process.exit(1);
}
```

### Configuración Multi-Proyecto
```javascript
// Generar documentación para múltiples proyectos
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
  console.log('🚀 Generando documentación para todos los proyectos...');

  const results = await Promise.allSettled(
    projects.map(async (project) => {
      console.log(`📝 Procesando ${project.name}...`);

      return createDoc({
        src: project.src,
        dest: project.dest,
        silent: true
      });
    })
  );

  // Reportar resultados
  results.forEach((result, index) => {
    const project = projects[index];

    if (result.status === 'fulfilled' && result.value.success) {
      console.log(`✅ ${project.name}: Completado`);
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

## 📊 Análisis y Estadísticas

### Reporte Detallado
```javascript
async function generateReport() {
  const result = await createDoc({
    src: ['./src'],
    dest: './docs',
    verbose: true
  });

  if (result.success && result.stats) {
    // Generar reporte en JSON
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

    // Guardar reporte
    await fs.writeFile('./docs/report.json', JSON.stringify(report, null, 2));

    console.log('📊 Reporte generado:');
    console.log(`- Cobertura: ${report.coverage.percentage}%`);
    console.log(`- Endpoints: ${report.stats.endpointsFound}/${report.stats.endpointsTotal}`);
  }
}
```

## 🔌 Hooks y Extensibilidad

### Pre y Post Hooks
```javascript
async function generateWithHooks() {
  // Pre-hook: Limpiar directorio
  console.log('🧹 Limpiando directorio de salida...');
  await fs.rm('./docs', { recursive: true, force: true });

  // Generar documentación
  const result = await createDoc({
    src: ['./src'],
    dest: './docs'
  });

  if (result.success) {
    // Post-hook: Comprimir para distribución
    console.log('📦 Comprimiendo documentación...');
    await compress('./docs', './docs.zip');

    // Post-hook: Subir a CDN
    console.log('☁️  Subiendo a CDN...');
    await uploadToCDN('./docs');
  }

  return result;
}
```

El uso programático de APIDoc te permite integrar la generación de documentación en cualquier flujo de trabajo, automatizar actualizaciones y crear pipelines robustos de documentación.