# 🔨 Desarrollo Local

Guía completa para configurar un entorno de desarrollo local para APIDoc, contribuir al proyecto y personalizar funcionalidades.

## 🚀 Configuración Inicial

### Requisitos del Sistema
- **Node.js**: >= 20.0.0 (LTS recomendado)
- **npm**: >= 8.0.0 o **yarn**: >= 1.22.0
- **Git**: Para control de versiones
- **Editor**: VS Code recomendado con extensiones TypeScript

### Clonación del Repositorio
```bash
# Clonar el repositorio
git clone https://github.com/hrefcl/apidoc.git
cd apidoc

# Instalar dependencias
npm install

# Verificar instalación
npm run typecheck
npm run test:lint
```

## 📂 Estructura del Proyecto

### Directorios Principales
```
apidoc/
├── bin/                    # Ejecutable CLI
│   └── apidoc             # Script principal
├── core/                  # Código fuente TypeScript (⚠️ NO lib/)
│   ├── apidoc/           # Lógica APIDoc
│   ├── parsers/          # Parsers REST (50+ parsers)
│   ├── parsers-jsdoc/    # Parsers JSDoc/TSDoc
│   ├── workers/          # Procesadores de datos
│   ├── filters/          # Filtros de salida
│   ├── languages/        # Soporte de lenguajes
│   ├── errors/           # Clases de error
│   ├── utils/            # Utilidades (encryption, etc.)
│   ├── types/            # TypeScript types
│   ├── index.ts          # Entrada principal
│   ├── parser.ts         # Parser principal
│   └── worker.ts         # Worker principal
├── apps/                 # Aplicaciones del monorepo
│   └── apidoc-template-v5/ # Template Vue 3 + Vite (v5)
│       ├── src/          # Componentes Vue 3
│       ├── public/       # Assets públicos
│       └── package.json  # Dependencias template
├── examples/             # Ejemplos de uso
│   ├── apicat/          # Ejemplo apiCAT v5 (actual)
│   └── apidoc/          # Ejemplo v4 (legacy)
├── scripts/             # Scripts de build
│   └── build-css.js     # Build de CSS
├── md/                  # Documentación del proyecto
│   └── es/              # Documentación en español
├── dist/                # Salida compilada TypeScript
└── tmp/                 # Archivos temporales de build
```

### Archivos de Configuración
```
├── package.json          # Configuración npm y scripts
├── tsconfig.json         # Configuración TypeScript
├── eslint.config.js      # Configuración ESLint
├── typedoc.json          # Configuración TypeDoc
├── .gitignore           # Archivos ignorados por Git
└── .github/             # Workflows de GitHub Actions
    └── workflows/
        ├── test.yml      # Tests automatizados
        └── release.yml   # Pipeline de release
```

## 🛠️ Scripts de Desarrollo

### Comandos Principales (ACTUALIZADOS 2025)
```bash
# === BUILD SCRIPTS ===
npm run build              # Compilar CSS + TypeScript + copiar core
npm run build:css          # Solo compilar CSS (producción)
npm run build:css:dev      # Compilar CSS para desarrollo
npm run build:watch        # Watch mode TypeScript
npm run build:clean        # Limpieza completa + rebuild

# === EJEMPLOS Y DESARROLLO v5 (Vue 3 Template) ===
npm run example            # Generar docs con apiCAT v5 → tmp/apidoc-output
npm run dev:template       # Desarrollo template Vue 3 (hot reload)
npm run start              # Servir documentación en puerto 8080
npm run preview            # Preview en puerto 9999

# === LEGACY v4 (Template Antiguo) ===
npm run example:v4         # Generar docs con template v4 → tmp/apidoc-output-v4
npm run start:v4           # Servir documentación v4

# === DEVELOPMENT ===
npm run dev                # Alias para build:watch

# === TESTING ===
npm run test               # Ejecutar suite de pruebas Mocha
npm run test:ci            # Tests para CI (lint + mocha)
npm run test:lint          # ESLint + spell check
npm run test:fix           # Auto-fix de issues ESLint
npm run test:spell         # Solo spell check

# === QUALITY ASSURANCE ===
npm run typecheck          # Verificación de tipos TypeScript
npm run eslint             # Solo ESLint
npm run pre-commit         # Validación completa (typecheck + eslint + test)
npm run format             # Formatear código con Prettier
npm run format:check       # Verificar formato sin modificar

# === DOCUMENTACIÓN ===
npm run docs               # Generar documentación TypeDoc
npm run docs:serve         # Servir TypeDoc en puerto 3001
npm run docs:watch         # TypeDoc en watch mode
```

### Scripts Adicionales
```bash
# === RELEASE ===
npm run prepublishOnly     # Se ejecuta antes de publicar (build:clean automático)
npm run release            # Build completo + generar changelog

# === WORKSPACES (Monorepo) ===
npm run build:packages     # Build de todos los workspaces
npm run test:packages      # Tests de todos los workspaces
```

## 🧪 Testing y Validación

### Suite de Pruebas
```bash
# Ejecutar todas las pruebas
npm run test

# Pruebas específicas
npm test -- --grep "parser"           # Solo tests de parsers
npm test -- --grep "MQTT"             # Solo tests MQTT
npm test -- test/core/parser.test.js  # Archivo específico

# Coverage
npm run test:coverage     # Generar reporte de cobertura
```

### Estructura de Tests
```
test/
├── core/                 # Tests del core
│   ├── parsers/         # Tests de parsers
│   ├── workers/         # Tests de workers
│   └── filters/         # Tests de filtros
├── integration/          # Tests de integración
├── fixtures/            # Datos de prueba
└── helpers/             # Utilidades de testing
```

### Ejemplo de Test
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

## 🔧 Desarrollo de Nuevas Funcionalidades

### Agregar Nuevo Parser
```typescript
// core/parsers/my-new-parser.ts (⚠️ NO lib/core/)
export function parseMyNewTag(content: string): any {
  // 1. Definir regex para parsing
  const regex = /^(.+?)\s+(.+)$/;
  const match = content.match(regex);

  if (!match) {
    throw new Error('Invalid format for @myNewTag');
  }

  // 2. Extraer datos
  const [, type, description] = match;

  // 3. Retornar objeto normalizado
  return {
    type: type.trim(),
    description: description.trim()
  };
}
```

### Registrar Parser
```typescript
// core/parsers/index.ts (archivo de registro centralizado)
import { parseMyNewTag } from './my-new-parser.js';

export const parsers = {
  // ... 50+ parsers existentes (api, apiParam, mqtt, etc.)
  mynew: parseMyNewTag
};
```

### Agregar Test para Parser
```javascript
// test/parsers/my-new-parser_test.js (⚠️ Convención: *_test.js)
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

## 🎨 Desarrollo del Template (Vue 3 + Vite)

### ⚠️ NUEVA ARQUITECTURA v5
APIDoc v5 usa **Vue 3 + Vite** en lugar de Stencil (legacy v4)

### Estructura del Template v5
```
apps/apidoc-template-v5/
├── src/
│   ├── components/         # Componentes Vue 3
│   │   ├── ApiContent.vue
│   │   ├── CodeTabs.vue
│   │   ├── ParametersTable.vue
│   │   └── ...
│   ├── layouts/           # Layouts
│   │   └── DocsLayout.vue
│   ├── pages/             # Páginas
│   │   ├── HomePage.vue
│   │   └── DocPage.vue
│   ├── router/            # Vue Router
│   │   └── index.js
│   ├── stores/            # Pinia stores
│   │   └── docs.js
│   ├── i18n/              # Internacionalización
│   ├── composables/       # Vue composables
│   ├── main.js            # Entry point
│   └── App.vue            # Componente raíz
├── public/                # Assets estáticos
├── index.html             # HTML principal
├── package.json           # Dependencias template
└── vite.config.js         # Configuración Vite
```

### Desarrollo de Componentes Vue 3
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
/* Estilos del componente */
</style>
```

### Compilación del Template v5
```bash
# Desarrollo con hot reload (Vite HMR)
npm run dev:template        # Inicia Vite dev server

# Build para producción (dentro de apps/apidoc-template-v5/)
cd apps/apidoc-template-v5
npm run build              # Build con Vite

# Servir build de producción
npm run start              # Sirve tmp/apidoc-output
```

## 🔄 Workflow de Desarrollo

### 1. Setup del Entorno
```bash
# Fork del repositorio en GitHub
git clone https://github.com/tu-usuario/apidoc.git
cd apidoc

# Configurar upstream
git remote add upstream https://github.com/hrefcl/apidoc.git

# Instalar dependencias
npm install

# Verificar que todo funciona
npm run pre-commit
```

### 2. Crear Rama de Feature
```bash
# Crear y cambiar a nueva rama
git checkout -b feature/mi-nueva-funcionalidad

# O para bugfix
git checkout -b fix/corregir-problema
```

### 3. Desarrollo y Testing
```bash
# Desarrollo iterativo
npm run dev                # Watch mode
npm run build:example      # Probar cambios
npm run test               # Ejecutar tests

# Validación continua
npm run typecheck          # Verificar tipos
npm run test:lint          # Linting
```

### 4. Commit y Push
```bash
# Staging y commit
git add .
git commit -m "feat: agregar soporte para nuevo parser"

# Push a tu fork
git push origin feature/mi-nueva-funcionalidad
```

### 5. Pull Request
- Crear PR desde tu fork al repositorio principal
- Asegurar que pasan todos los checks de CI
- Describir cambios y justificación
- Esperar review y feedback

## 🐛 Debugging

### Configuración VS Code
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

### Logging Avanzado
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

## 📦 Build y Distribución

### Build de Producción
```bash
# Build completo
npm run build

# Verificar build
npm run test
npm run typecheck

# Test de distribución local
npm pack
npm install -g ./apidoc-*.tgz
```

### Configuración de Release
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

## 🤝 Contribución

### Guidelines de Código
- **TypeScript**: Usar tipos estrictos
- **ESLint**: Seguir configuración del proyecto
- **Commits**: Usar conventional commits
- **Tests**: Mantener cobertura > 80%
- **Documentación**: Actualizar docs para nuevas features

### Checklist de PR
- [ ] Tests pasan locally
- [ ] TypeScript compila sin errores
- [ ] ESLint no tiene warnings
- [ ] Documentación actualizada
- [ ] CHANGELOG.md actualizado
- [ ] Ejemplos funcionando

### Tipos de Contribución
- 🐛 **Bug fixes**: Corrección de errores
- ✨ **Features**: Nuevas funcionalidades
- 📝 **Docs**: Mejoras en documentación
- 🎨 **Style**: Mejoras de UI/UX
- ⚡ **Performance**: Optimizaciones
- 🔧 **Tooling**: Herramientas de desarrollo

El entorno de desarrollo de APIDoc está diseñado para ser accesible y productivo, permitiendo contribuciones efectivas al proyecto.