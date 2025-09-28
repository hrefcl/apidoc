# 📝 Ejemplos y Plantillas

Ejemplos prácticos de uso de APIDoc con diferentes patrones y casos de uso comunes.

## 🚀 Ejemplo Básico

### API REST Simple

```javascript
/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 * @apiSuccess {String} email     Email of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe",
 *       "email": "john.doe@example.com"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
function getUser(id) {
    // Implementation
}
```

## 🏗️ Ejemplos Avanzados

### API con Autenticación

```javascript
/**
 * @api {post} /user Create User
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 2.0.0
 * @apiPermission admin
 *
 * @apiDescription Creates a new user account. Requires admin privileges.
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 * @apiHeader {String} Content-Type Must be application/json.
 *
 * @apiBody {String} email User's email address (must be unique).
 * @apiBody {String} password User's password (minimum 8 characters).
 * @apiBody {String} firstName User's first name.
 * @apiBody {String} lastName User's last name.
 * @apiBody {String="admin","user","moderator"} [role="user"] User role.
 * @apiBody {Object} [profile] Optional profile information.
 * @apiBody {String} [profile.bio] User biography.
 * @apiBody {String[]} [profile.interests] Array of user interests.
 *
 * @apiSuccess {Number} id Unique user ID.
 * @apiSuccess {String} email User's email address.
 * @apiSuccess {String} firstName User's first name.
 * @apiSuccess {String} lastName User's last name.
 * @apiSuccess {String} role User's assigned role.
 * @apiSuccess {Date} createdAt Account creation timestamp.
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
 * @apiError EmailExists Email address already in use.
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
 * @apiErrorExample {json} Unauthorized-Error:
 * HTTP/1.1 401 Unauthorized
 * {
 *   "error": "Unauthorized",
 *   "message": "Admin privileges required"
 * }
 *
 * @apiExample {curl} Example usage:
 * curl -X POST https://api.example.com/user \
 *   -H "Authorization: Bearer your-admin-token" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "email": "john@example.com",
 *     "password": "securepassword123",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "role": "user"
 *   }'
 */
```

### API con Paginación

```javascript
/**
 * @api {get} /users Get Users List
 * @apiName GetUsersList
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiDescription Retrieves a paginated list of users with optional filtering.
 *
 * @apiQuery {Number} [page=1] Page number (1-based).
 * @apiQuery {Number} [limit=20] Number of users per page (max 100).
 * @apiQuery {String} [search] Search term for filtering by name or email.
 * @apiQuery {String="admin","user","moderator"} [role] Filter by user role.
 * @apiQuery {String="asc","desc"} [sort="asc"] Sort order for results.
 * @apiQuery {String="name","email","createdAt"} [sortBy="name"] Sort field.
 *
 * @apiSuccess {Object[]} users Array of user objects.
 * @apiSuccess {Number} users.id User's unique ID.
 * @apiSuccess {String} users.firstName User's first name.
 * @apiSuccess {String} users.lastName User's last name.
 * @apiSuccess {String} users.email User's email address.
 * @apiSuccess {String} users.role User's role.
 * @apiSuccess {Date} users.createdAt Account creation date.
 * @apiSuccess {Object} pagination Pagination information.
 * @apiSuccess {Number} pagination.page Current page number.
 * @apiSuccess {Number} pagination.limit Users per page.
 * @apiSuccess {Number} pagination.total Total number of users.
 * @apiSuccess {Number} pagination.pages Total number of pages.
 * @apiSuccess {Boolean} pagination.hasNext Has next page.
 * @apiSuccess {Boolean} pagination.hasPrev Has previous page.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "users": [
 *     {
 *       "id": 1,
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "email": "john@example.com",
 *       "role": "user",
 *       "createdAt": "2023-01-15T10:30:00Z"
 *     },
 *     {
 *       "id": 2,
 *       "firstName": "Jane",
 *       "lastName": "Smith",
 *       "email": "jane@example.com",
 *       "role": "admin",
 *       "createdAt": "2023-01-16T09:15:00Z"
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 150,
 *     "pages": 8,
 *     "hasNext": true,
 *     "hasPrev": false
 *   }
 * }
 *
 * @apiExample {curl} Example with pagination:
 * curl -X GET "https://api.example.com/users?page=2&limit=10&role=admin&sort=desc"
 */
```

## 🔄 Herencia y Reutilización

### Definición de Bloques Reutilizables

```javascript
/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound The requested user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound",
 *       "message": "User with the specified ID does not exist"
 *     }
 */

/**
 * @apiDefine AuthenticationError
 *
 * @apiError (Error 401) Unauthorized Authentication required.
 * @apiError (Error 403) Forbidden Insufficient privileges.
 *
 * @apiErrorExample Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Unauthorized",
 *       "message": "Authentication token required"
 *     }
 *
 * @apiErrorExample Forbidden:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "Forbidden",
 *       "message": "Insufficient privileges for this operation"
 *     }
 */

/**
 * @apiDefine SuccessUserResponse
 *
 * @apiSuccess {Number} id User's unique identifier.
 * @apiSuccess {String} firstName User's first name.
 * @apiSuccess {String} lastName User's last name.
 * @apiSuccess {String} email User's email address.
 * @apiSuccess {String} role User's role in the system.
 * @apiSuccess {Date} createdAt Account creation timestamp.
 * @apiSuccess {Date} updatedAt Last update timestamp.
 */
```

### Uso de Bloques Definidos

```javascript
/**
 * @api {get} /user/:id Get User by ID
 * @apiName GetUserById
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiUse SuccessUserResponse
 * @apiUse UserNotFoundError
 * @apiUse AuthenticationError
 */

/**
 * @api {put} /user/:id Update User
 * @apiName UpdateUser
 * @apiGroup User
 * @apiVersion 2.0.0
 *
 * @apiParam {Number} id User's unique ID.
 * @apiBody {String} [firstName] Updated first name.
 * @apiBody {String} [lastName] Updated last name.
 * @apiBody {String} [email] Updated email address.
 *
 * @apiUse SuccessUserResponse
 * @apiUse UserNotFoundError
 * @apiUse AuthenticationError
 */
```

## 📊 Objetos Complejos y Arrays

### Objetos Anidados

```javascript
/**
 * @api {post} /company Create Company
 * @apiName CreateCompany
 * @apiGroup Company
 * @apiVersion 1.0.0
 *
 * @apiBody {String} name Company name.
 * @apiBody {String} industry Industry sector.
 * @apiBody {Object} address Company address.
 * @apiBody {String} address.street Street address.
 * @apiBody {String} address.city City name.
 * @apiBody {String} address.state State or province.
 * @apiBody {String} address.zipCode Postal code.
 * @apiBody {String} address.country Country code (ISO 3166).
 * @apiBody {Object} address.coordinates GPS coordinates.
 * @apiBody {Number} address.coordinates.lat Latitude.
 * @apiBody {Number} address.coordinates.lng Longitude.
 * @apiBody {Object[]} contacts Array of contact persons.
 * @apiBody {String} contacts.name Contact person name.
 * @apiBody {String} contacts.email Contact email address.
 * @apiBody {String} contacts.phone Contact phone number.
 * @apiBody {String="primary","secondary","billing"} contacts.type Contact type.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 456,
 *   "name": "Acme Corporation",
 *   "industry": "Technology",
 *   "address": {
 *     "street": "123 Tech Street",
 *     "city": "San Francisco",
 *     "state": "CA",
 *     "zipCode": "94105",
 *     "country": "US",
 *     "coordinates": {
 *       "lat": 37.7749,
 *       "lng": -122.4194
 *     }
 *   },
 *   "contacts": [
 *     {
 *       "name": "John Smith",
 *       "email": "john@acme.com",
 *       "phone": "+1-555-0123",
 *       "type": "primary"
 *     }
 *   ],
 *   "createdAt": "2023-01-15T10:30:00Z"
 * }
 */
```

### Arrays de Diferentes Tipos

```javascript
/**
 * @api {get} /analytics/dashboard Get Dashboard Data
 * @apiName GetDashboard
 * @apiGroup Analytics
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} metrics Array of metric objects.
 * @apiSuccess {String} metrics.name Metric name.
 * @apiSuccess {Number} metrics.value Current value.
 * @apiSuccess {Number} metrics.change Percentage change.
 * @apiSuccess {String="up","down","stable"} metrics.trend Trend direction.
 * @apiSuccess {String[]} labels Array of chart labels.
 * @apiSuccess {Number[]} values Array of numeric values.
 * @apiSuccess {Object[]} timeSeriesData Time series data points.
 * @apiSuccess {Date} timeSeriesData.timestamp Data point timestamp.
 * @apiSuccess {Number} timeSeriesData.value Data point value.
 * @apiSuccess {String} timeSeriesData.label Data point label.
 *
 * @apiSuccessExample {json} Success-Response:
 * {
 *   "metrics": [
 *     {
 *       "name": "Total Users",
 *       "value": 1250,
 *       "change": 12.5,
 *       "trend": "up"
 *     },
 *     {
 *       "name": "Revenue",
 *       "value": 45000,
 *       "change": -2.1,
 *       "trend": "down"
 *     }
 *   ],
 *   "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
 *   "values": [100, 150, 120, 180, 220],
 *   "timeSeriesData": [
 *     {
 *       "timestamp": "2023-01-01T00:00:00Z",
 *       "value": 100,
 *       "label": "January"
 *     },
 *     {
 *       "timestamp": "2023-02-01T00:00:00Z",
 *       "value": 150,
 *       "label": "February"
 *     }
 *   ]
 * }
 */
```

## 🌐 API Multiidioma

### Endpoint con Soporte de Localización

```javascript
/**
 * @api {get} /content/:id Get Localized Content
 * @apiName GetLocalizedContent
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Content unique ID.
 * @apiQuery {String="en","es","fr","de"} [lang="en"] Language code.
 * @apiQuery {String} [region] Region code for localization.
 *
 * @apiHeader {String} [Accept-Language] Browser language preference.
 *
 * @apiSuccess {Number} id Content ID.
 * @apiSuccess {String} title Localized title.
 * @apiSuccess {String} description Localized description.
 * @apiSuccess {String} content Localized content body.
 * @apiSuccess {String} language Content language code.
 * @apiSuccess {String} region Content region code.
 * @apiSuccess {Object} meta Metadata object.
 * @apiSuccess {String[]} meta.tags Localized tags.
 * @apiSuccess {String} meta.author Author name.
 * @apiSuccess {Date} meta.publishedAt Publication date.
 *
 * @apiExample {curl} Request in Spanish:
 * curl -X GET "https://api.example.com/content/123?lang=es" \
 *   -H "Accept-Language: es-ES,es;q=0.9"
 *
 * @apiSuccessExample {json} Spanish Content:
 * {
 *   "id": 123,
 *   "title": "Título en Español",
 *   "description": "Descripción localizada en español",
 *   "content": "Contenido completo en español...",
 *   "language": "es",
 *   "region": "ES",
 *   "meta": {
 *     "tags": ["tecnología", "api", "documentación"],
 *     "author": "Juan Pérez",
 *     "publishedAt": "2023-01-15T10:30:00Z"
 *   }
 * }
 */
```

## 🔒 APIs con Diferentes Niveles de Autenticación

### API Key Authentication

```javascript
/**
 * @api {get} /public/stats Get Public Statistics
 * @apiName GetPublicStats
 * @apiGroup Public
 * @apiVersion 1.0.0
 *
 * @apiHeader {String} X-API-Key Your API key.
 *
 * @apiSuccess {Number} totalUsers Total registered users.
 * @apiSuccess {Number} totalPosts Total published posts.
 * @apiSuccess {Date} lastUpdated Last statistics update.
 *
 * @apiExample {curl} Example:
 * curl -X GET https://api.example.com/public/stats \
 *   -H "X-API-Key: your-api-key-here"
 */
```

### OAuth 2.0 Authentication

```javascript
/**
 * @api {get} /user/profile Get User Profile
 * @apiName GetUserProfile
 * @apiGroup User
 * @apiVersion 2.0.0
 * @apiPermission user
 *
 * @apiDescription Retrieves the authenticated user's profile information.
 * Requires a valid OAuth 2.0 access token with 'profile:read' scope.
 *
 * @apiHeader {String} Authorization Bearer {access_token}
 *
 * @apiSuccess {Object} profile User profile data.
 * @apiSuccess {String} profile.username Unique username.
 * @apiSuccess {String} profile.displayName Display name.
 * @apiSuccess {String} profile.email Email address.
 * @apiSuccess {String} profile.avatar Avatar URL.
 * @apiSuccess {Object} profile.preferences User preferences.
 * @apiSuccess {String} profile.preferences.theme UI theme preference.
 * @apiSuccess {String} profile.preferences.language Preferred language.
 * @apiSuccess {String[]} scopes Granted OAuth scopes.
 *
 * @apiExample {curl} OAuth Request:
 * curl -X GET https://api.example.com/user/profile \
 *   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 * @apiError (Error 401) InvalidToken The access token is invalid or expired.
 * @apiError (Error 403) InsufficientScope Token lacks required scope.
 *
 * @apiErrorExample {json} Invalid Token:
 * HTTP/1.1 401 Unauthorized
 * {
 *   "error": "invalid_token",
 *   "error_description": "The access token is invalid or expired"
 * }
 */
```

## 📋 Plantillas Reutilizables

### Template para CRUD Operations

```javascript
// Create
/**
 * @api {post} /resource Create Resource
 * @apiName CreateResource
 * @apiGroup Resource
 * @apiVersion 1.0.0
 * @apiPermission user
 *
 * @apiBody {String} name Resource name.
 * @apiBody {String} [description] Resource description.
 *
 * @apiSuccess {Number} id Created resource ID.
 * @apiSuccess {String} name Resource name.
 * @apiSuccess {String} description Resource description.
 * @apiSuccess {Date} createdAt Creation timestamp.
 */

// Read
/**
 * @api {get} /resource/:id Get Resource
 * @apiName GetResource
 * @apiGroup Resource
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id Resource ID.
 *
 * @apiSuccess {Number} id Resource ID.
 * @apiSuccess {String} name Resource name.
 * @apiSuccess {String} description Resource description.
 * @apiSuccess {Date} createdAt Creation timestamp.
 * @apiSuccess {Date} updatedAt Last update timestamp.
 */

// Update
/**
 * @api {put} /resource/:id Update Resource
 * @apiName UpdateResource
 * @apiGroup Resource
 * @apiVersion 1.0.0
 * @apiPermission owner
 *
 * @apiParam {Number} id Resource ID.
 * @apiBody {String} [name] Updated name.
 * @apiBody {String} [description] Updated description.
 *
 * @apiSuccess {Number} id Resource ID.
 * @apiSuccess {String} name Updated name.
 * @apiSuccess {String} description Updated description.
 * @apiSuccess {Date} updatedAt Update timestamp.
 */

// Delete
/**
 * @api {delete} /resource/:id Delete Resource
 * @apiName DeleteResource
 * @apiGroup Resource
 * @apiVersion 1.0.0
 * @apiPermission owner
 *
 * @apiParam {Number} id Resource ID.
 *
 * @apiSuccessExample {json} Success:
 * HTTP/1.1 204 No Content
 */
```

## 📡 Ejemplos MQTT {#ejemplos-mqtt}

### Publicación de Datos de Sensores

```javascript
/**
 * @mqtt {publish} sensors/{deviceId}/temperature Temperature Reading
 * @mqttGroup IoT
 * @apiName PublishTemperature
 * @apiVersion 1.0.0
 *
 * @topic sensors/{deviceId}/temperature
 * @topicParam {String} deviceId Unique device identifier
 *
 * @payload {Object} reading Temperature reading data
 * @payload {Number} reading.value Temperature in Celsius
 * @payload {String} reading.unit Unit of measurement
 * @payload {Number} reading.timestamp Unix timestamp
 * @payload {String} reading.deviceId Device identifier
 *
 * @qos 1
 * @retain false
 *
 * @examplePublish {json} Temperature Data:
 * {
 *   "value": 23.5,
 *   "unit": "celsius",
 *   "timestamp": 1642248000,
 *   "deviceId": "sensor-001"
 * }
 */
```

### Suscripción a Alertas

```javascript
/**
 * @mqtt {subscribe} alerts/+/critical Critical Alerts
 * @mqttGroup Monitoring
 * @apiName SubscribeCriticalAlerts
 * @apiVersion 1.0.0
 *
 * @topic alerts/+/critical
 * @topicParam {String} + Device or system identifier
 *
 * @payload {Object} alert Alert information
 * @payload {String} alert.type Alert type
 * @payload {String} alert.severity Alert severity level
 * @payload {String} alert.message Alert message
 * @payload {Number} alert.timestamp Alert timestamp
 *
 * @qos 2
 * @retain true
 *
 * @exampleSubscribe {json} Critical Alert:
 * {
 *   "type": "temperature_high",
 *   "severity": "critical",
 *   "message": "Temperature exceeded 40°C",
 *   "timestamp": 1642248000
 * }
 */
```

## 📚 Referencias Adicionales

- **[📖 Parámetros APIDoc](./05-apidoc-params.md)** - Referencia completa de parámetros
- **[🔄 Versionado y Herencia](./07-versioning.md)** - Gestión avanzada de versiones
- **[📊 Esquemas TypeScript](./11-typescript-schemas.md)** - Integración con TypeScript
- **[📡 Protocolo MQTT](./10-mqtt.md)** - Documentación completa MQTT