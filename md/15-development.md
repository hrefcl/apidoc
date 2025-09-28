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
├── lib/                   # Código fuente TypeScript
│   ├── core/             # Lógica principal
│   │   ├── parsers/      # Parsers de comentarios
│   │   ├── workers/      # Procesadores de datos
│   │   ├── filters/      # Filtros de salida
│   │   ├── languages/    # Soporte de lenguajes
│   │   └── errors/       # Clases de error
│   ├── index.ts          # Entrada principal de la librería
│   ├── reader.ts         # Lógica de lectura de archivos
│   └── writer.ts         # Generación de salida
├── template/             # Templates HTML
│   ├── src/              # Código TypeScript/CSS del template
│   │   ├── main.ts       # JavaScript principal
│   │   └── css/          # Estilos CSS
│   └── index.html        # Template principal
├── example/              # API de ejemplo para testing
├── test/                 # Suite de pruebas
├── md/                   # Documentación del proyecto
├── dist/                 # Salida compilada
└── tmp/                  # Archivos temporales de build
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

### Comandos Principales
```bash
# Compilación TypeScript
npm run build              # Compilar TypeScript + Stencil
npm run typecheck          # Solo verificación de tipos
npm run dev                # Watch mode para desarrollo

# Generación de documentación
npm run build:example      # Generar ejemplo de documentación
npm run docs               # Generar documentación TypeDoc
npm run docs:serve         # Servir docs en http://localhost:3001

# Desarrollo del template
npm run dev:template       # Build ejemplo + servidor en puerto 8080
npm run start              # Servir documentación generada

# Quality Assurance
npm run test               # Ejecutar suite de pruebas
npm run test:lint          # ESLint + spell check
npm run test:fix           # Auto-fix de issues de ESLint
npm run pre-commit         # Validación completa (tipos + lint + tests)

# Workflows con contenedores
npm run serve              # Build, containerizar y servir con auto-open
npm run serve:stop         # Detener contenedor
```

### Scripts Avanzados
```bash
# CSS y estilos
npm run build:css          # Compilar CSS para producción
npm run build:css:dev      # CSS para desarrollo local

# Limpieza
npm run clean              # Limpiar directorios de build
npm run clean:all          # Limpieza completa + node_modules

# Release
npm run version:patch      # Incrementar versión patch
npm run version:minor      # Incrementar versión minor
npm run version:major      # Incrementar versión major
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
// lib/core/parsers/my-new-parser.ts
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
// lib/core/parsers/index.ts
import { parseMyNewTag } from './my-new-parser.js';

export const parsers = {
  // ... parsers existentes
  mynew: parseMyNewTag
};
```

### Agregar Test para Parser
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

## 🎨 Desarrollo del Template

### Estructura del Template
```
template/
├── src/
│   ├── main.ts           # JavaScript principal
│   ├── css/
│   │   ├── tailwind.css  # Estilos TailwindCSS
│   │   └── bootstrap.css # Estilos Bootstrap
│   └── components/       # Componentes Stencil
├── assets/              # Assets estáticos
├── index.html           # Template principal
└── stencil.config.ts    # Configuración Stencil
```

### Desarrollo de Componentes
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

### Compilación del Template
```bash
# Desarrollo con hot reload
npm run dev:template

# Build para producción
npm run build:template
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