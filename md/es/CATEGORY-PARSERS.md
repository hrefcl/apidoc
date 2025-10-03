# Sistema de Parsers por Categoría - APIDoc v5.0

## 📋 Índice

1. [Introducción](#introducción)
2. [Categorías Predefinidas](#categorías-predefinidas)
3. [Configuración](#configuración)
4. [Parsers por Categoría](#parsers-por-categoría)
5. [Ejemplos de Uso](#ejemplos-de-uso)
6. [Testing y Verificación](#testing-y-verificación)
7. [Troubleshooting](#troubleshooting)

---

## Introducción

El **Sistema de Parsers por Categoría** permite organizar tus fuentes de documentación en categorías específicas, donde cada categoría ejecuta **solo los parsers relevantes** para ese tipo de contenido.

### 🎯 Beneficios

- **Rendimiento mejorado**: Solo se ejecutan parsers relevantes
- **Organización clara**: Separación semántica de diferentes tipos de código
- **Evita parsing innecesario**: No se ejecutan 50+ parsers en cada archivo
- **Categorías predefinidas**: Configuración optimizada lista para usar
- **Extensibilidad**: Categorías personalizadas automáticamente soportadas

### ⚙️ Cómo Funciona

1. Defines categorías en `apidoc.json` usando el campo `inputs`
2. Cada directorio se asigna a una categoría específica
3. El sistema filtra qué parsers ejecutar basándose en la categoría
4. Solo los parsers habilitados procesan el contenido

---

## Categorías Predefinidas

### 1. **`docs`** - Documentación Markdown

Procesa archivos markdown puros sin tags APIDoc.

**Archivos**: `.md`, `.markdown`
**Parsers**: Ninguno (solo procesamiento de markdown)

```json
{
  "inputs": {
    "docs": ["./markdown-files"]
  }
}
```

### 2. **`api`** - REST API Endpoints

Documentación de endpoints REST con tags @api.

**Archivos**: `.js`, `.ts`, `.jsx`, `.tsx`, `.php`, `.py`, `.rb`, `.go`, `.java`

**Parsers habilitados**:
- `@api` - Define endpoint
- `@apiParam` - Parámetros URL
- `@apiQuery` - Query parameters
- `@apiBody` - Request body
- `@apiSuccess` - Respuestas exitosas
- `@apiError` - Respuestas de error
- `@apiHeader` - Headers HTTP
- `@apiExample` - Ejemplos de código
- `@apiGroup`, `@apiName`, `@apiDescription`, `@apiVersion`, `@apiPermission`

```json
{
  "inputs": {
    "api": ["./routes", "./controllers"]
  }
}
```

### 3. **`models`** - Data Models & Schemas

Modelos de datos, interfaces TypeScript, schemas JSON.

**Archivos**: `.ts`, `.js`, `.json`

**Parsers habilitados**:
- `@apiSchema` - Schemas TypeScript/JSON
- `@apiDefine` - Definiciones reutilizables
- `@model` - Modelos Sequelize/ORM
- `@modelGroup`, `@modelName`, `@modelDescription`

```json
{
  "inputs": {
    "models": ["./models", "./schemas"]
  }
}
```

### 4. **`tsdoc`** - TypeScript Documentation

Documentación TypeScript/JSDoc para interfaces y types.

**Archivos**: `.ts`, `.tsx`, `.d.ts`

**Parsers habilitados**:
- `@apiSchema` - TypeScript interfaces
- `@apiDefine` - Definiciones compartidas
- `@apiUse` - Uso de definiciones

```json
{
  "inputs": {
    "tsdoc": ["./types", "./interfaces"]
  }
}
```

### 5. **`mqtt`** - MQTT/IoT Protocol

Documentación de endpoints MQTT para IoT.

**Archivos**: `.js`, `.ts`, `.jsx`, `.tsx`

**Parsers habilitados**:
- `@mqtt`, `@mqttGroup`
- `@topic`, `@topicParam`
- `@qos`, `@retain`, `@auth`
- `@payload`, `@payloadSchema`
- `@responsetopic`, `@examplePublish`, `@exampleSubscribe`

```json
{
  "inputs": {
    "mqtt": ["./mqtt", "./iot-devices"]
  }
}
```

### 6. **`openapi`** - OpenAPI 3.0 Specifications

Especificaciones OpenAPI/Swagger nativas.

**Archivos**: `.js`, `.ts`, `.yaml`, `.yml`, `.json`

**Parsers habilitados**:
- `@openapi`
- `@openapiPath`
- `@openapiOperation`
- `@openapiSchema`
- `@openapiComponent`

```json
{
  "inputs": {
    "openapi": ["./openapi-specs"]
  }
}
```

### 7. **`graphql`** - GraphQL Schemas

Schemas y resolvers de GraphQL.

**Archivos**: `.js`, `.ts`, `.graphql`, `.gql`

**Parsers habilitados**:
- `@apiSchema`
- `@apiDefine`
- `@apiParam`
- `@apiSuccess`
- `@apiError`
- `@apiExample`

```json
{
  "inputs": {
    "graphql": ["./graphql", "./resolvers"]
  }
}
```

---

## Configuración

### Formato Básico

```json
{
  "inputs": {
    "categoria": ["./ruta/directorio"],
    "otra-categoria": ["./otra/ruta", "./mas/rutas"]
  }
}
```

### Ejemplo Completo

```json
{
  "name": "Mi API Documentada",
  "version": "1.0.0",
  "inputs": {
    "api": ["./src/routes", "./src/controllers"],
    "models": ["./src/models"],
    "tsdoc": ["./src/types"],
    "mqtt": ["./src/mqtt"],
    "docs": ["./markdown"]
  }
}
```

### Rutas Relativas

Las rutas se resuelven **relativas al directorio donde está `apidoc.json`**:

```json
{
  "inputs": {
    "api": ["."],              // Mismo directorio que apidoc.json
    "models": ["../models"],   // Directorio padre
    "docs": ["./docs"]         // Subdirectorio
  }
}
```

---

## Parsers por Categoría

### Verificar Parsers Habilitados

Usa el flag `--debug` para ver qué parsers se están saltando:

```bash
./bin/apidoc --debug --config apidoc.json -o output/
```

Output de ejemplo:
```
verbose: Parsing with category filter: api
debug: Skipping parser 'apidefine' for category 'api' in block: '0'
debug: found @api in block: 1
debug: found @apiParam in block: 1
```

### Comportamiento de Filtrado

| Categoría | Parser `@apiDefine` | Parser `@api` | Parser `@model` |
|-----------|---------------------|---------------|-----------------|
| `api`     | ❌ SKIP             | ✅ PARSE      | ❌ SKIP         |
| `models`  | ✅ PARSE            | ❌ SKIP       | ✅ PARSE        |
| `tsdoc`   | ✅ PARSE            | ❌ SKIP       | ❌ SKIP         |
| custom    | ✅ PARSE            | ✅ PARSE      | ✅ PARSE        |

> **Nota**: Categorías personalizadas (no predefinidas) ejecutan TODOS los parsers disponibles.

---

## Ejemplos de Uso

### Ejemplo 1: API REST + Modelos

**Estructura de Proyecto**:
```
my-project/
├── apidoc.json
├── routes/
│   ├── users.js      # REST endpoints
│   └── products.js
└── models/
    ├── User.ts       # Sequelize models
    └── Product.ts
```

**apidoc.json**:
```json
{
  "name": "My API",
  "version": "1.0.0",
  "inputs": {
    "api": ["./routes"],
    "models": ["./models"]
  }
}
```

**Resultado**:
- `routes/*.js` → Solo parsers REST API (`@api`, `@apiParam`, etc.)
- `models/*.ts` → Solo parsers de modelos (`@model`, `@apiSchema`, etc.)

### Ejemplo 2: Proyecto Full-Stack

**Estructura de Proyecto**:
```
fullstack-app/
├── apidoc.json
├── backend/
│   ├── api/          # REST endpoints
│   ├── models/       # Database models
│   └── mqtt/         # MQTT handlers
├── frontend/
│   └── types/        # TypeScript types
└── docs/
    └── guides/       # Markdown docs
```

**apidoc.json**:
```json
{
  "inputs": {
    "api": ["./backend/api"],
    "models": ["./backend/models"],
    "mqtt": ["./backend/mqtt"],
    "tsdoc": ["./frontend/types"],
    "docs": ["./docs/guides"]
  }
}
```

### Ejemplo 3: Monorepo con Múltiples Services

```json
{
  "inputs": {
    "api": [
      "./services/auth/routes",
      "./services/users/routes",
      "./services/payments/routes"
    ],
    "models": [
      "./shared/models"
    ],
    "mqtt": [
      "./services/iot/mqtt"
    ]
  }
}
```

---

## Testing y Verificación

### Estructura de Testing

Usa el directorio `examples/category-test/` como referencia:

```
examples/category-test/
├── apidoc.json
├── api-only/
│   └── users.js          # Solo @api tags
├── models-only/
│   └── product.ts        # Solo @model tags
├── tsdoc-only/
│   └── types.ts          # Solo @apiSchema
├── mqtt-only/
│   └── mqtt-examples.ts  # Solo @mqtt tags
└── docs-only/
    └── intro.md          # Solo markdown
```

### Comandos de Verificación

1. **Generar Documentación**:
```bash
./bin/apidoc --config examples/category-test/apidoc.json \
             -o tmp/category-test-output
```

2. **Ver Parsers en Debug**:
```bash
./bin/apidoc --debug \
             --config examples/category-test/apidoc.json \
             -o tmp/test \
             2>&1 | grep -E "(Skipping|found @)"
```

3. **Verificar Output**:
```bash
# Abrir en navegador
open tmp/category-test-output/index.html

# Ver estructura generada
ls -R tmp/category-test-output/
```

### Checklist de Verificación

- [ ] **API Endpoints**: Verifica que aparezcan 4 endpoints de `users.js`
- [ ] **Models**: Verifica que aparezca el modelo `Product` de `product.ts`
- [ ] **Types**: Verifica interfaces TypeScript de `types.ts`
- [ ] **MQTT**: Verifica endpoints MQTT de `mqtt-examples.ts`
- [ ] **Filtrado**: Verifica que `@apiDefine` NO aparezca (filtrado por categoría `api`)
- [ ] **Grupos**: Verifica que los grupos estén correctamente organizados

---

## Troubleshooting

### Problema: "Parsers no se están filtrando"

**Síntoma**: Todos los parsers se ejecutan en todos los archivos.

**Solución**:
1. Verifica que estés usando el campo `inputs` (no `input`)
2. Compila el proyecto: `npm run build`
3. Usa `--debug` para ver el filtrado en acción

### Problema: "Unnamed" endpoints aparecen

**Síntoma**: Documentación muestra endpoints sin nombre correcto.

**Posibles causas**:

1. **Parser no existe**:
   ```bash
   # Verificar si el parser existe
   grep "parser-name:" core/index.ts
   ```

2. **Nombres incorrectos**: Los nombres de parsers son **todo en minúsculas**
   - ❌ `@apiParam` → `apiParam`
   - ✅ `@apiParam` → `apiparam`

3. **Parser no habilitado para la categoría**:
   - Verifica `core/apidoc/category-parsers.ts`
   - Agrega el parser al array `enabledParsers`

### Problema: "Archivos no se están parseando"

**Solución**:
1. Verifica que las rutas sean correctas (relativas a `apidoc.json`)
2. Verifica extensiones de archivo en `filePatterns`
3. Verifica que el directorio exista:
   ```bash
   ls -la $(dirname apidoc.json)/tu-directorio
   ```

### Problema: "Demasiados parsers ejecutándose"

**Solución**: Estás usando una categoría personalizada (no predefinida).

Opciones:
1. Usar una categoría predefinida (`api`, `models`, etc.)
2. Definir una nueva categoría en `category-parsers.ts`

---

## Contribuir

Para agregar una nueva categoría predefinida:

1. Edita `/core/apidoc/category-parsers.ts`
2. Agrega tu categoría al objeto `CATEGORY_PARSERS`
3. Define `filePatterns` y `enabledParsers`
4. Documenta en este archivo

**Ejemplo**:
```typescript
export const CATEGORY_PARSERS = {
    // ... categorías existentes

    'mi-categoria': {
        filePatterns: ['.ext'],
        enabledParsers: [
            'parser1',
            'parser2',
        ],
        description: 'Descripción de mi categoría',
    },
};
```

---

## Recursos

- **Archivo de configuración**: `core/apidoc/category-parsers.ts`
- **Implementación**: `core/parser.ts` (línea 299)
- **Ejemplos**: `examples/category-test/`
- **Tests**: `npm run build && ./bin/apidoc --config examples/category-test/apidoc.json -o tmp/test`

---

**Versión**: 5.0.0
**Última actualización**: 2025-10-03
