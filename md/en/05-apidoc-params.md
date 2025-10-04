---
title: "APIDoc Parameters"
category: "Reference"
order: 5
---

# 📖 APIDoc Parameters

Complete reference of all available parameters in APIDoc for documenting your APIs.

## 🎯 Main Parameters

### @api (Required)

Defines an API endpoint. **Required** for APIDoc to process the documentation block.

```javascript
/**
 * @api {method} path title
 */
```

**Example:**
```javascript
/**
 * @api {get} /user/:id Get User Information
 * @apiName GetUser
 * @apiGroup User
 */
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| `method` | HTTP method (GET, POST, PUT, DELETE, etc.) | `get`, `post`, `put` |
| `path` | Endpoint path | `/user/:id`, `/api/users` |
| `title` | Descriptive title for the endpoint | `Get User Information` |

### @apiName

Defines a unique name for the endpoint. **Always recommended**.

```javascript
/**
 * @apiName GetUser
 */
```

### @apiGroup

Groups related endpoints. **Always recommended**.

```javascript
/**
 * @apiGroup User
 */
```

### @apiVersion

Specifies the endpoint version.

```javascript
/**
 * @apiVersion 1.0.0
 */
```

## 📥 Input Parameters

### @apiParam

Documents URL parameters.

```javascript
/**
 * @apiParam [(group)] [{type}] [field=defaultValue] [description]
 */
```

**Examples:**
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

Documents query string parameters.

```javascript
/**
 * @apiQuery {String} [search] Search term.
 * @apiQuery {Number} [page=1] Page number.
 * @apiQuery {String="asc","desc"} [sort="asc"] Sort direction.
 */
```

### @apiBody

Documents the request body (for POST, PUT, etc.).

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

Documents required headers.

```javascript
/**
 * @apiHeader {String} Authorization Bearer token.
 * @apiHeader {String} Content-Type Must be application/json.
 * @apiHeader (Optional) {String} X-API-Key Optional API key.
 */
```

## 📤 Response Parameters

### @apiSuccess

Documents successful responses.

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

Documents error responses.

```javascript
/**
 * @apiError UserNotFound The user was not found.
 * @apiError (Error 4xx) ValidationError Invalid input data.
 * @apiError (Error 5xx) ServerError Internal server error.
 */
```

## 📝 Examples and Documentation

### @apiExample

Shows endpoint usage examples.

```javascript
/**
 * @apiExample {curl} Example usage:
 * curl -X GET https://api.example.com/user/123 \
 *   -H "Authorization: Bearer token123"
 */
```

### @apiSuccessExample

Examples of successful responses.

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

Examples of error responses.

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

Parameter examples.

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

Header examples.

```javascript
/**
 * @apiHeaderExample {json} Header-Example:
 * {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "Content-Type": "application/json"
 * }
 */
```

## 🔧 Control Parameters

### @apiDescription

Detailed endpoint description.

```javascript
/**
 * @apiDescription This endpoint retrieves detailed user information
 * including profile data, preferences, and account status.
 *
 * Requires authentication via Bearer token.
 */
```

### @apiPermission

Defines required permissions.

```javascript
/**
 * @apiPermission admin
 * @apiPermission user
 */
```

### @apiDeprecated

Marks an endpoint as deprecated.

```javascript
/**
 * @apiDeprecated use now (#User:GetUserProfile).
 */
```

### @apiIgnore

Ignores a documentation block.

```javascript
/**
 * @apiIgnore Not implemented yet
 * @api {get} /user/:id
 */
```

### @apiPrivate

Marks an endpoint as private.

```javascript
/**
 * @apiPrivate
 */
```

### @apiSampleRequest

Configures test forms.

```javascript
/**
 * @apiSampleRequest https://api.example.com
 * @apiSampleRequest off  // Disable form
 */
```

## 🏗️ Inheritance Parameters

### @apiDefine

Defines reusable blocks.

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

Includes blocks defined with @apiDefine.

```javascript
/**
 * @apiUse UserNotFoundError
 */
```

## 🔧 Advanced Data Types

### Basic types

| Type | Description | Example |
|------|-------------|---------|
| `String` | Text string | `{String} name` |
| `Number` | Number | `{Number} age` |
| `Boolean` | True/False | `{Boolean} active` |
| `Object` | Object | `{Object} user` |
| `Array` | Array | `{String[]} tags` |

### Types with restrictions

```javascript
/**
 * @apiParam {String{2..10}} username Username (2-10 chars).
 * @apiParam {Number{1-100}} age Age between 1 and 100.
 * @apiParam {String="admin","user"} role User role.
 * @apiParam {String[]} tags Array of strings.
 */
```

### Nested objects

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

## 📋 Complete Example

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

## 📡 MQTT Parameters {#mqtt}

### @mqtt

Defines MQTT operations.

```javascript
/**
 * @mqtt {publish} sensors/temperature Temperature Data
 * @mqtt {subscribe} alerts/+/critical Critical Alerts
 */
```

### @topic

Specifies the MQTT topic pattern.

```javascript
/**
 * @topic sensors/{deviceId}/temperature
 * @topic alerts/+/critical
 */
```

### @payload

Documents the payload structure.

```javascript
/**
 * @payload {Object} data Sensor data
 * @payload {Number} data.temperature Temperature in Celsius
 * @payload {Number} data.humidity Humidity percentage
 */
```

### @qos

Defines the Quality of Service level.

```javascript
/**
 * @qos 0  // Fire and forget
 * @qos 1  // At least once
 * @qos 2  // Exactly once
 */
```

## 📚 Additional References

- **[📝 Examples and Templates](./06-examples.md)** - Practical examples
- **[🔄 Versioning and Inheritance](./07-versioning.md)** - Version management
- **[📊 TypeScript Schemas](./11-typescript-schemas.md)** - TypeScript integration
- **[📡 MQTT Protocol](./10-mqtt.md)** - Complete MQTT documentation
