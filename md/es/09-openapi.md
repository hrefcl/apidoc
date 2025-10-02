# 🔌 OpenAPI 3.0

APIDoc 5.0 introduce soporte nativo para OpenAPI 3.0, permitiendo escribir especificaciones OpenAPI directamente en comentarios de código y exportar documentación a formato OpenAPI estándar.

## 🚀 Características OpenAPI

### ✨ Funcionalidades Principales

- **📝 Sintaxis nativa** - Escribe OpenAPI 3.0 directamente en comentarios
- **🔄 Versionado inteligente** - Extracción automática de versiones desde `x-version` y tags
- **🎯 Compatibilidad total** - Funciona junto con comentarios APIDoc tradicionales
- **📊 Múltiples parsers** - Soporte para paths, operaciones, esquemas y especificaciones completas
- **⚡ Migración incremental** - Añade sintaxis OpenAPI a proyectos existentes
- **📁 Referencias externas** - Carga especificaciones OpenAPI desde archivos externos
- **🔗 Resolución $ref** - Resolución automática de componentes y referencias

## 🎯 Parsers OpenAPI Disponibles

### @openapi - Especificaciones Completas

Escribe especificaciones OpenAPI completas directamente en comentarios:

```javascript
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their unique identifier
 *     tags: [Users]
 *     x-version: "2.1.0"
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
function getUserById(id) {
    // Implementation
}
```

### @openapi-path - Operaciones Específicas

Define operaciones para paths específicos:

```javascript
/**
 * @openapi-path /api/users
 * post:
 *   summary: Create new user
 *   tags: [Users, v1.5.0]  # Version extracted from tags
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/CreateUserRequest'
 *   responses:
 *     201:
 *       description: User created successfully
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     400:
 *       description: Invalid input data
 */
function createUser() {
    // Implementation
}
```

### @openapi-schema - Esquemas Reutilizables

Define componentes de esquema reutilizables:

```javascript
/**
 * @openapi-schema User
 * type: object
 * x-version: "1.2.0"
 * required:
 *   - id
 *   - name
 *   - email
 * properties:
 *   id:
 *     type: integer
 *     format: int64
 *     example: 123
 *   name:
 *     type: string
 *     example: "John Doe"
 *   email:
 *     type: string
 *     format: email
 *     example: "john@example.com"
 *   role:
 *     type: string
 *     enum: [admin, user, moderator]
 *     default: user
 */
```

## 🎯 Sistema de Versionado Inteligente

APIDoc extrae versiones automáticamente en el siguiente orden de prioridad:

### 1. x-version Extension (Máxima Prioridad)

```yaml
x-version: "2.1.0"  # ← Esta versión se usa
tags: [Users, v1.0.0]  # ← Ignorado
```

### 2. Version Tags

```yaml
tags: [Users, v1.5.0]     # ← Versión extraída: "1.5.0"
tags: [API, "version:2.0"] # ← Versión extraída: "2.0"
```

### 3. Info Version (Especificaciones Completas)

```yaml
openapi: 3.0.0
info:
  version: "3.1.0"  # ← Versión extraída desde info
```

### 4. Versión por Defecto

```
version: "4.0.0"  # ← Fallback cuando no se encuentra versión
```

## 📁 Referencias a Archivos Externos

### 🚀 Uso Básico

```javascript
/**
 * Load complete external OpenAPI specification
 * @openapi {openapi=./schemas/users-api.json}
 */
function loadCompleteUserAPI() {
    // All operations from users-api.json will be loaded
}

/**
 * Load specific path from external file
 * @openapi /api/users/{id} {openapi=./schemas/users-api.json}
 */
function getUserById() {
    // Only the /api/users/{id} operations will be loaded
}

/**
 * Support for YAML files
 * @openapi /api/products {openapi=./schemas/products-api.yaml}
 */
function getProducts() {
    // Load operations from YAML OpenAPI specification
}
```

### 📊 Formatos Soportados

- **Archivos JSON**: `{openapi=./path/to/spec.json}`
- **Archivos YAML**: `{openapi=./path/to/spec.yaml}` o `{openapi=./path/to/spec.yml}`
- **Rutas relativas**: Se resuelven relativamente al archivo fuente actual
- **Rutas absolutas**: Rutas completas del sistema soportadas

### 🎯 Carga Específica de Paths

```javascript
// Cargar solo la operación GET para /api/users/{id}
/**
 * @openapi /api/users/{id} {openapi=./schemas/complete-api.yaml}
 */

// Cargar todas las operaciones para /api/products
/**
 * @openapi /api/products {openapi=./schemas/complete-api.yaml}
 */

// Cargar especificación completa (todos los paths)
/**
 * @openapi {openapi=./schemas/complete-api.yaml}
 */
```

## 🔗 Resolución Avanzada de $ref

APIDoc 5.0 incluye **resolución completa de referencias de componentes OpenAPI**, resolviendo automáticamente referencias `$ref` en archivos externos para generar documentación completa.

### Ejemplo de Archivo Externo

```yaml
# example/schemas/products-api.yaml
openapi: 3.0.0
info:
  title: Products API
  version: 1.0.0

paths:
  /api/products/{id}:
    put:
      summary: Update product
      description: Update product information
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateProductRequest'  # ✅ Auto-resolved
      responses:
        '200':
          description: Product updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'  # ✅ Auto-resolved
        '400':
          description: Invalid request data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'  # ✅ Auto-resolved

components:
  schemas:
    UpdateProductRequest:
      type: object
      properties:
        name: { type: string }
        description: { type: string }
        price: { type: number }
        category: { type: string }
        tags: { type: array, items: { type: string } }
        in_stock: { type: boolean }

    Product:
      type: object
      required: [id, name, price, category]
      properties:
        id: { type: string }
        name: { type: string }
        description: { type: string }
        price: { type: number }
        category: { type: string }
        tags: { type: array, items: { type: string } }
        in_stock: { type: boolean }
        reviews: { type: array, items: { type: string } }

    Error:
      type: object
      required: [error, message]
      properties:
        error: { type: string }
        message: { type: string }
        details: { type: object }
```

### Uso del Archivo Externo

```javascript
/**
 * @openapi /api/products/{id} {openapi=./schemas/products-api.yaml}
 */
function updateProduct() {
    // Automatically generates complete documentation with all tables
}
```

### Resultado en la Documentación HTML

**📋 Tabla Request Body:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | String | (opcional) |
| description | String | (opcional) |
| price | Number | (opcional) |
| category | String | (opcional) |
| tags | String[] | (opcional) |
| in_stock | Boolean | (opcional) |

**✅ Tabla Success Response:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | String | (requerido) |
| name | String | (requerido) |
| description | String | (opcional) |
| price | Number | (requerido) |
| category | String | (requerido) |
| tags | String[] | (opcional) |
| in_stock | Boolean | (opcional) |
| reviews | String[] | (opcional) |

**❌ Tabla Error Response:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| error | String | (requerido) |
| message | String | (requerido) |
| details | Object | (opcional) |

## 📤 Exportación a OpenAPI

### Generar HTML + OpenAPI

```bash
# Crea tanto documentación HTML COMO swagger.json
apidoc -i src/ -o docs/ --openapi
```

### Generar Solo OpenAPI

```bash
# Crea solo swagger.json y openapi.json (sin HTML)
apidoc -i src/ -o api-spec/ --openapi-only
```

### 📊 Archivos Generados

```
docs/
├── index.html          # Documentación HTML tradicional
├── assets/            # CSS, JS, fonts
├── swagger.json       # Especificación OpenAPI 3.0 🆕
└── openapi.json       # Igual que swagger.json (compatibilidad) 🆕
```

## 🔄 Soporte Bidireccional

### Escribir OpenAPI → Renderizar como APIDoc

- Usa sintaxis nativa `@openapi` en comentarios
- Conversión automática a documentación compatible con APIDoc
- Extracción inteligente de versiones y parsing de parámetros

### Escribir APIDoc → Exportar como OpenAPI

- Comentarios tradicionales `@api` se convierten a OpenAPI 3.0
- Genera archivos swagger.json estándar de la industria
- Compatible con Postman, Insomnia, Swagger UI

## 📊 Uso Mixto

Combina sintaxis APIDoc tradicional con OpenAPI nativo:

```javascript
/**
 * Traditional APIDoc comment
 * @api {get} /api/legacy Legacy Endpoint
 * @apiVersion 1.0.0
 * @apiName GetLegacy
 * @apiGroup Legacy
 */
function legacyEndpoint() {}

/**
 * Native OpenAPI comment
 * @openapi-path /api/modern
 * get:
 *   summary: Modern Endpoint
 *   x-version: "4.0.0"
 *   tags: [Modern]
 *   responses:
 *     200:
 *       description: Success
 */
function modernEndpoint() {}
```

Ambos endpoints aparecerán en la misma documentación con versionado y navegación apropiados.

## 🎯 Casos de Uso para Exportación

### Equipos de Desarrollo de API

- Generar OpenAPI para workflows design-first
- Importar a Postman/Insomnia para testing
- Compartir con equipos frontend para generación de clientes

### Integración Empresarial

- API gateways que requieren especificaciones OpenAPI
- Portales de documentación que soportan ambos formatos
- Pipelines CI/CD generando múltiples formatos

### Herramientas Modernas

- Generación de código desde especificaciones OpenAPI
- Frameworks de testing y validación de APIs
- Workflows de desarrollo dirigido por esquemas

## 🚀 Matriz de Características Completa

| Característica | Soportado | Notas |
|---------------|-----------|-------|
| **Formatos de Archivo** | | |
| Archivos JSON (.json) | ✅ | Soporte completo |
| Archivos YAML (.yaml, .yml) | ✅ | Soporte completo |
| **Componentes OpenAPI** | | |
| Resolución $ref | ✅ | Resolución automática de componentes |
| Esquemas de request body | ✅ | Generación completa de tablas |
| Esquemas de response | ✅ | Tablas de Success & Error |
| Parámetros de path | ✅ | Auto-extraídos |
| Parámetros de query | ✅ | Auto-extraídos |
| Parámetros de header | ✅ | Auto-extraídos |
| **Tipos de Esquema** | | |
| Objetos | ✅ | Extracción completa de propiedades |
| Arrays | ✅ | Notación `Type[]` apropiada |
| Objetos anidados | ✅ | Resolución recursiva |
| Campos requeridos | ✅ | Marcados apropiadamente |
| Campos opcionales | ✅ | Marcados apropiadamente |
| **Modos de Carga** | | |
| Archivo completo | ✅ | `{openapi=./file.yaml}` |
| Path específico | ✅ | `/path {openapi=./file.yaml}` |
| Múltiples operaciones | ✅ | Todas las operaciones para un path |

## ✅ Beneficios de OpenAPI Integration

1. **🔄 Reutilización** - Compartir especificaciones OpenAPI entre múltiples proyectos
2. **📝 Mantenibilidad** - Actualizar especificación en un solo lugar
3. **🎯 Carga selectiva** - Cargar solo las operaciones necesarias
4. **📊 Flexibilidad de formato** - Soporte tanto para JSON como YAML
5. **⚡ Performance** - Cargar especificaciones grandes sin hinchar comentarios de código
6. **🔗 Estándares** - Usar formatos estándar de la industria
7. **🛠️ Tooling** - Integración con herramientas existentes de OpenAPI

## 📚 Referencias Adicionales

- **[📖 Parámetros APIDoc](./05-apidoc-params.md)** - Sintaxis tradicional de APIDoc
- **[📊 Esquemas TypeScript](./11-typescript-schemas.md)** - Integración con TypeScript
- **[📝 Ejemplos](./06-examples.md)** - Más ejemplos prácticos