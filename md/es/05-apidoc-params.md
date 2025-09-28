---
title: "Parámetros APIDoc"
category: "Referencia"
order: 5
---

# 📖 Parámetros APIDoc

Referencia completa de todos los parámetros disponibles en APIDoc para documentar tus APIs.

## 🎯 Parámetros Principales

### @api (Requerido)

Define un endpoint de API. **Obligatorio** para que APIDoc procese el bloque de documentación.

```javascript
/**
 * @api {method} path title
 */
```

**Ejemplo:**
```javascript
/**
 * @api {get} /user/:id Get User Information
 * @apiName GetUser
 * @apiGroup User
 */
```

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `method` | Método HTTP (GET, POST, PUT, DELETE, etc.) | `get`, `post`, `put` |
| `path` | Ruta del endpoint | `/user/:id`, `/api/users` |
| `title` | Título descriptivo del endpoint | `Get User Information` |

### @apiName

Define un nombre único para el endpoint. **Recomendado siempre**.

```javascript
/**
 * @apiName GetUser
 */
```

### @apiGroup

Agrupa endpoints relacionados. **Recomendado siempre**.

```javascript
/**
 * @apiGroup User
 */
```

### @apiVersion

Especifica la versión del endpoint.

```javascript
/**
 * @apiVersion 1.0.0
 */
```

## 📥 Parámetros de Entrada

### @apiParam

Documenta parámetros de la URL.

```javascript
/**
 * @apiParam [(group)] [{type}] [field=defaultValue] [description]
 */
```

**Ejemplos:**
```javascript
/**
 * @apiParam {Number} id User's unique ID.
 * @apiParam {String} [name] Optional user name.
 * @apiParam {String} country="ES" Country code with default.
 * @apiParam {Number} [age=18] Optional age with default.
 * @apiParam (Login) {String} password Only for authenticated users.
 */
```

### @apiQuery

Documenta parámetros de query string.

```javascript
/**
 * @apiQuery {String} [search] Search term.
 * @apiQuery {Number} [page=1] Page number.
 * @apiQuery {String="asc","desc"} [sort="asc"] Sort direction.
 */
```

### @apiBody

Documenta el cuerpo de la petición (para POST, PUT, etc.).

```javascript
/**
 * @apiBody {String} email User's email address.
 * @apiBody {String} password User's password.
 * @apiBody {String} [firstName] Optional first name.
 * @apiBody {Object} [address] Optional address object.
 * @apiBody {String} [address.street] Street address.
 * @apiBody {String} [address.city] City name.
 */
```

### @apiHeader

Documenta headers requeridos.

```javascript
/**
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeader {String} Content-Type Must be application/json.
 * @apiHeader (Optional) {String} X-API-Key Optional API key.
 */
```

## 📤 Parámetros de Respuesta

### @apiSuccess

Documenta respuestas exitosas.

```javascript
/**
 * @apiSuccess {String} firstname User's first name.
 * @apiSuccess {String} lastname User's last name.
 * @apiSuccess {Number} age User's age.
 * @apiSuccess {Object} profile User profile information.
 * @apiSuccess {String} profile.bio User biography.
 */
```

### @apiError

Documenta respuestas de error.

```javascript
/**
 * @apiError UserNotFound The user was not found.
 * @apiError (Error 4xx) ValidationError Invalid input data.
 * @apiError (Error 5xx) ServerError Internal server error.
 */
```

## 📝 Ejemplos y Documentación

### @apiExample

Muestra ejemplos de uso del endpoint.

```javascript
/**
 * @apiExample {curl} Example usage:
 * curl -X GET https://api.example.com/user/123 \
 *   -H "Authorization: Bearer token123"
 */
```

### @apiSuccessExample

Ejemplos de respuestas exitosas.

```javascript
/**
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 */
```

### @apiErrorExample

Ejemplos de respuestas de error.

```javascript
/**
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "UserNotFound",
 *   "message": "User with ID 123 was not found"
 * }
 */
```

### @apiParamExample

Ejemplos de parámetros.

```javascript
/**
 * @apiParamExample {json} Request-Example:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "age": 30
 * }
 */
```

### @apiHeaderExample

Ejemplos de headers.

```javascript
/**
 * @apiHeaderExample {json} Header-Example:
 * {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "Content-Type": "application/json"
 * }
 */
```

## 🔧 Parámetros de Control

### @apiDescription

Descripción detallada del endpoint.

```javascript
/**
 * @apiDescription This endpoint retrieves detailed user information
 * including profile data, preferences, and account status.
 *
 * Requires authentication via Bearer token.
 */
```

### @apiPermission

Define permisos requeridos.

```javascript
/**
 * @apiPermission admin
 * @apiPermission user
 */
```

### @apiDeprecated

Marca un endpoint como obsoleto.

```javascript
/**
 * @apiDeprecated use now (#User:GetUserProfile).
 */
```

### @apiIgnore

Ignora un bloque de documentación.

```javascript
/**
 * @apiIgnore Not implemented yet
 * @api {get} /user/:id
 */
```

### @apiPrivate

Marca un endpoint como privado.

```javascript
/**
 * @apiPrivate
 */
```

### @apiSampleRequest

Configura formularios de prueba.

```javascript
/**
 * @apiSampleRequest https://api.example.com
 * @apiSampleRequest off  // Deshabilita formulario
 */
```

## 🏗️ Parámetros de Herencia

### @apiDefine

Define bloques reutilizables.

```javascript
/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
```

### @apiUse

Incluye bloques definidos con @apiDefine.

```javascript
/**
 * @apiUse UserNotFoundError
 */
```

## 🔧 Tipos de Datos Avanzados

### Tipos básicos

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `String` | Cadena de texto | `{String} name` |
| `Number` | Número | `{Number} age` |
| `Boolean` | Verdadero/Falso | `{Boolean} active` |
| `Object` | Objeto | `{Object} user` |
| `Array` | Arreglo | `{String[]} tags` |

### Tipos con restriciones

```javascript
/**
 * @apiParam {String{2..10}} username Username (2-10 chars).
 * @apiParam {Number{1-100}} age Age between 1 and 100.
 * @apiParam {String="admin","user"} role User role.
 * @apiParam {String[]} tags Array of strings.
 */
```

### Objetos anidados

```javascript
/**
 * @apiParam {Object} address User address.
 * @apiParam {String} address.street Street name.
 * @apiParam {String} address.city City name.
 * @apiParam {String} address.country Country code.
 * @apiParam {Object} address.coordinates GPS coordinates.
 * @apiParam {Number} address.coordinates.lat Latitude.
 * @apiParam {Number} address.coordinates.lng Longitude.
 */
```

## 📋 Ejemplo Completo

```javascript
/**
 * @api {post} /user Create User
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiPermission admin
 *
 * @apiDescription Creates a new user account with the provided information.
 * This endpoint requires admin privileges.
 *
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeader {String} Content-Type Must be application/json.
 *
 * @apiBody {String} email User's email address.
 * @apiBody {String} password User's password (min 8 chars).
 * @apiBody {String} firstName User's first name.
 * @apiBody {String} lastName User's last name.
 * @apiBody {String="admin","user","moderator"} [role="user"] User role.
 * @apiBody {Object} [profile] Optional profile information.
 * @apiBody {String} [profile.bio] User biography.
 * @apiBody {String[]} [profile.interests] User interests.
 *
 * @apiSuccess {Number} id Unique user ID.
 * @apiSuccess {String} email User's email address.
 * @apiSuccess {String} firstName User's first name.
 * @apiSuccess {String} lastName User's last name.
 * @apiSuccess {String} role User's role.
 * @apiSuccess {Date} createdAt Account creation date.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 123,
 *   "email": "john@example.com",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "role": "user",
 *   "createdAt": "2023-01-15T10:30:00Z"
 * }
 *
 * @apiError ValidationError Invalid input data.
 * @apiError EmailExists Email already in use.
 * @apiError Unauthorized Insufficient privileges.
 *
 * @apiErrorExample {json} Validation-Error:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "ValidationError",
 *   "message": "Invalid email format",
 *   "field": "email"
 * }
 *
 * @apiExample {curl} Example usage:
 * curl -X POST https://api.example.com/user \
 *   -H "Authorization: Bearer your-token" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "email": "john@example.com",
 *     "password": "securepassword",
 *     "firstName": "John",
 *     "lastName": "Doe"
 *   }'
 */
```

## 📚 Referencias Adicionales

- **[📝 Ejemplos y Plantillas](./06-examples.md)** - Ejemplos prácticos
- **[🔄 Versionado y Herencia](./07-versioning.md)** - Gestión de versiones
- **[📊 Esquemas TypeScript](./11-typescript-schemas.md)** - Integración con TypeScript