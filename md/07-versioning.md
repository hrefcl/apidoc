# 🔄 Versionado y Herencia

APIDoc proporciona un sistema robusto de versionado que permite mantener múltiples versiones de API y heredar configuraciones entre versiones.

## 🎯 Conceptos Fundamentales

### Versionado de APIs
APIDoc puede generar documentación para múltiples versiones de tu API simultáneamente, permitiendo:
- **Versionado semántico** (1.0.0, 1.1.0, 2.0.0)
- **Herencia de configuración** entre versiones
- **Documentación comparativa** entre versiones
- **Migración gradual** de endpoints

## 📋 Configuración de Versiones

### Configuración Básica
```json
{
  "name": "Mi API",
  "version": "2.0.0",
  "description": "API versión 2.0",
  "title": "Mi API v2.0"
}
```

### Configuración con Herencia
```json
{
  "name": "Mi API",
  "version": "2.0.0",
  "versions": {
    "1.0.0": {
      "description": "Versión inicial estable",
      "deprecated": true
    },
    "1.5.0": {
      "description": "Versión con mejoras de rendimiento",
      "deprecated": false
    },
    "2.0.0": {
      "description": "Versión actual con breaking changes",
      "deprecated": false
    }
  }
}
```

## 🏷️ Etiquetas de Versión en Código

### @apiVersion
Define la versión específica de un endpoint:

```javascript
/**
 * @api {get} /users/:id Obtener Usuario
 * @apiVersion 2.0.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id ID único del usuario
 * @apiSuccess {String} name Nombre del usuario
 * @apiSuccess {String} email Email del usuario
 */
```

### Múltiples Versiones del Mismo Endpoint
```javascript
/**
 * @api {get} /users/:id Obtener Usuario (v1.0)
 * @apiVersion 1.0.0
 * @apiName GetUserV1
 * @apiGroup User
 *
 * @apiParam {Number} id ID único del usuario
 * @apiSuccess {String} name Nombre del usuario
 */

/**
 * @api {get} /users/:id Obtener Usuario (v2.0)
 * @apiVersion 2.0.0
 * @apiName GetUserV2
 * @apiGroup User
 *
 * @apiParam {Number} id ID único del usuario
 * @apiSuccess {String} name Nombre del usuario
 * @apiSuccess {String} email Email del usuario
 * @apiSuccess {Date} createdAt Fecha de creación
 * @apiSuccess {Object} profile Perfil detallado del usuario
 */
```

## 🔗 Herencia de Configuración

### @apiDefine para Reutilización
```javascript
/**
 * @apiDefine UserSuccessExample
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id": 1,
 *       "name": "John Doe",
 *       "email": "john@example.com"
 *     }
 */

/**
 * @api {get} /users/:id Obtener Usuario
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiUse UserSuccessExample
 */
```

### @apiUse para Herencia
```javascript
/**
 * @apiDefine UserObject
 * @apiSuccess {Number} id ID único del usuario
 * @apiSuccess {String} name Nombre del usuario
 * @apiSuccess {String} email Email del usuario
 */

/**
 * @api {get} /users/:id Obtener Usuario
 * @apiVersion 2.0.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiUse UserObject
 * @apiSuccess {Date} createdAt Fecha de creación (nuevo en v2.0)
 */
```

## 📊 Estrategias de Versionado

### 1. Versionado Semántico
```json
{
  "versions": {
    "1.0.0": "Versión inicial",
    "1.1.0": "Nuevas funcionalidades compatibles",
    "1.1.1": "Corrección de bugs",
    "2.0.0": "Breaking changes"
  }
}
```

### 2. Versionado por Fecha
```javascript
/**
 * @apiVersion 2024-01-15
 * @api {get} /users Lista de Usuarios
 */
```

### 3. Versionado por Nombre
```javascript
/**
 * @apiVersion beta
 * @api {post} /users/beta Crear Usuario (Beta)
 */
```

## 🔧 Configuración Avanzada

### Configuración de Deprecación
```json
{
  "versions": {
    "1.0.0": {
      "description": "Versión inicial",
      "deprecated": true,
      "deprecationDate": "2024-12-31",
      "replacedBy": "2.0.0"
    }
  }
}
```

### Etiquetas de Deprecación en Código
```javascript
/**
 * @api {get} /users/old Obtener Usuarios (Deprecated)
 * @apiVersion 1.0.0
 * @apiName GetUsersOld
 * @apiGroup User
 * @apiDeprecated Usar /users en su lugar
 *
 * @apiParam {Number} [limit=10] Límite de resultados
 */
```

## 📁 Organización de Archivos por Versión

### Estructura Recomendada
```
src/
├── v1/
│   ├── users.js
│   ├── auth.js
│   └── products.js
├── v2/
│   ├── users.js
│   ├── auth.js
│   └── products.js
└── shared/
    ├── middleware.js
    └── utils.js
```

### Configuración para Múltiples Directorios
```json
{
  "name": "Mi API",
  "version": "2.0.0",
  "src": [
    "./src/v1/",
    "./src/v2/",
    "./src/shared/"
  ]
}
```

## 🎨 Personalización de Versiones

### Iconos y Títulos por Versión
```json
{
  "versions": {
    "1.0.0": {
      "title": "API Legacy",
      "icon": "fa-archive",
      "deprecated": true
    },
    "2.0.0": {
      "title": "API Moderna",
      "icon": "fa-rocket",
      "deprecated": false
    }
  }
}
```

## 📈 Comparación de Versiones

### Endpoint con Cambios
```javascript
// v1.0.0
/**
 * @api {post} /users Crear Usuario
 * @apiVersion 1.0.0
 * @apiParam {String} name Nombre del usuario
 * @apiParam {String} email Email del usuario
 */

// v2.0.0
/**
 * @api {post} /users Crear Usuario
 * @apiVersion 2.0.0
 * @apiParam {String} name Nombre del usuario
 * @apiParam {String} email Email del usuario
 * @apiParam {String} [phone] Teléfono (nuevo)
 * @apiParam {Object} [address] Dirección (nuevo)
 * @apiParam {String} address.street Calle
 * @apiParam {String} address.city Ciudad
 */
```

## 🚀 Mejores Prácticas

### 1. Versionado Consistente
- Usa versionado semántico para APIs públicas
- Mantén compatibilidad hacia atrás cuando sea posible
- Documenta claramente los breaking changes

### 2. Herencia Inteligente
```javascript
/**
 * @apiDefine CommonHeaders
 * @apiHeader {String} Authorization Bearer token
 * @apiHeader {String} Content-Type application/json
 */

/**
 * @apiDefine CommonErrors
 * @apiError (400) BadRequest Solicitud inválida
 * @apiError (401) Unauthorized Token inválido
 * @apiError (500) InternalError Error del servidor
 */
```

### 3. Documentación de Migración
```javascript
/**
 * @api {get} /users Lista de Usuarios
 * @apiVersion 2.0.0
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiDescription
 * **Cambios desde v1.0.0:**
 * - Nuevo campo `createdAt` en respuesta
 * - Parámetro `sort` ahora acepta múltiples valores
 * - Paginación mejorada con `cursor`
 *
 * **Migración:**
 * ```
 * // v1.0.0
 * GET /users?sort=name
 *
 * // v2.0.0
 * GET /users?sort=name,email&cursor=abc123
 * ```
 */
```

## 🔍 Filtrado por Versión

### CLI para Generar Versión Específica
```bash
# Generar solo v2.0.0
apidoc -i src/ -o doc/ --filter-version 2.0.0

# Generar múltiples versiones
apidoc -i src/ -o doc/ --filter-version "1.5.0,2.0.0"
```

### Configuración en package.json
```json
{
  "scripts": {
    "docs:v1": "apidoc -i src/ -o doc/v1 --filter-version 1.0.0",
    "docs:v2": "apidoc -i src/ -o doc/v2 --filter-version 2.0.0",
    "docs:all": "apidoc -i src/ -o doc/"
  }
}
```

## 📋 Ejemplo Completo

### apidoc.json
```json
{
  "name": "E-commerce API",
  "version": "2.1.0",
  "description": "API completa para e-commerce",
  "title": "E-commerce API Documentation",
  "url": "https://api.mitienda.com",
  "sampleUrl": "https://api.mitienda.com",
  "versions": {
    "1.0.0": {
      "description": "Versión inicial con funcionalidades básicas",
      "deprecated": true,
      "deprecationDate": "2024-12-31"
    },
    "1.5.0": {
      "description": "Añadido sistema de pagos",
      "deprecated": false
    },
    "2.0.0": {
      "description": "Refactorización completa con GraphQL",
      "deprecated": false
    },
    "2.1.0": {
      "description": "Mejoras de rendimiento y nuevas funcionalidades",
      "deprecated": false
    }
  },
  "order": [
    "Auth",
    "Users",
    "Products",
    "Orders",
    "Payments"
  ]
}
```

### Código con Versionado
```javascript
/**
 * @apiDefine AuthHeaders
 * @apiHeader {String} Authorization Bearer token de autenticación
 * @apiHeader {String} [X-API-Version] Versión específica de API
 */

/**
 * @api {post} /auth/login Iniciar Sesión
 * @apiVersion 2.1.0
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiDescription
 * Autentica un usuario y devuelve un token JWT.
 *
 * **Nuevo en v2.1.0:** Soporte para autenticación multi-factor
 *
 * @apiParam {String} email Email del usuario
 * @apiParam {String} password Contraseña
 * @apiParam {String} [mfa_code] Código de autenticación multi-factor
 *
 * @apiSuccess {String} token Token JWT para autenticación
 * @apiSuccess {Object} user Información del usuario
 * @apiSuccess {String} user.id ID del usuario
 * @apiSuccess {String} user.name Nombre del usuario
 * @apiSuccess {String} user.email Email del usuario
 * @apiSuccess {Boolean} [user.mfa_enabled] MFA habilitado (nuevo en v2.1.0)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *       "user": {
 *         "id": "123",
 *         "name": "Juan Pérez",
 *         "email": "juan@example.com",
 *         "mfa_enabled": true
 *       }
 *     }
 */
```

El sistema de versionado de APIDoc te permite mantener documentación clara y organizada a medida que tu API evoluciona, facilitando tanto el desarrollo como la adopción por parte de los usuarios de tu API.