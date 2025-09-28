---
title: "APIDoc Parameters Reference"
category: "Core"
order: 5
---

# 📖 APIDoc Parameters Reference

Complete reference for all APIDoc tags and parameters including syntax, examples, and best practices for documenting REST APIs and MQTT protocols.

## 🚀 Core API Tags

### @api
Defines the API endpoint and HTTP method.

**Syntax:**
```javascript
@api {method} path [title]
```

**Examples:**
```javascript
/**
 * @api {get} /users Get All Users
 * @api {post} /users Create User
 * @api {put} /users/:id Update User
 * @api {delete} /users/:id Delete User
 * @api {patch} /users/:id Partial Update User
 */
```

**Supported Methods:**
- `GET`, `POST`, `PUT`, `DELETE`, `PATCH`
- `HEAD`, `OPTIONS`, `CONNECT`, `TRACE`

### @apiName
Unique name for the API endpoint (used for referencing).

**Syntax:**
```javascript
@apiName UniqueName
```

**Examples:**
```javascript
/**
 * @api {get} /users Get Users
 * @apiName GetUsers
 * @apiName CreateUser
 * @apiName UpdateUserProfile
 */
```

### @apiGroup
Groups related API endpoints together.

**Syntax:**
```javascript
@apiGroup GroupName
```

**Examples:**
```javascript
/**
 * @apiGroup User
 * @apiGroup Authentication
 * @apiGroup Product
 * @apiGroup Order
 */
```

### @apiVersion
Specifies the API version.

**Syntax:**
```javascript
@apiVersion version
```

**Examples:**
```javascript
/**
 * @apiVersion 1.0.0
 * @apiVersion 2.1.0
 * @apiVersion 0.1.0-beta
 */
```

## 📝 Description Tags

### @apiDescription
Detailed description of the API endpoint.

**Syntax:**
```javascript
@apiDescription text
```

**Example:**
```javascript
/**
 * @api {post} /users Create User
 * @apiDescription Creates a new user account with validation.
 * This endpoint validates email uniqueness and password strength
 * before creating the user in the database.
 */
```

### @apiSummary
Short summary of the API endpoint.

**Syntax:**
```javascript
@apiSummary text
```

**Example:**
```javascript
/**
 * @api {get} /users Get Users
 * @apiSummary Retrieves paginated list of users
 */
```

## 🔧 Parameter Tags

### @apiParam
Documents request parameters.

**Syntax:**
```javascript
@apiParam [(group)] [{type}] [field=defaultValue] [description]
```

**Examples:**
```javascript
/**
 * @apiParam {String} name User's full name
 * @apiParam {String{3..50}} username Username (3-50 characters)
 * @apiParam {Number} age User's age
 * @apiParam {Boolean} [active=true] Account status
 * @apiParam {String[]} tags Array of user tags
 * @apiParam {Object} profile User profile object
 * @apiParam {String} profile.bio Profile biography
 * @apiParam {Number} profile.avatar_id Avatar image ID
 */
```

**Parameter Types:**
- `String`, `Number`, `Boolean`, `Object`, `Array`
- `String{size}` - Fixed size
- `String{2..10}` - Size range
- `String="val1","val2"` - Allowed values
- `[field]` - Optional parameter
- `[field=default]` - Optional with default

### @apiQuery
Documents query string parameters.

**Syntax:**
```javascript
@apiQuery [(group)] [{type}] [field=defaultValue] [description]
```

**Examples:**
```javascript
/**
 * @api {get} /users Search Users
 * @apiQuery {String} [search] Search term
 * @apiQuery {Number{1..100}} [limit=10] Results per page
 * @apiQuery {Number} [offset=0] Results offset
 * @apiQuery {String="name","email","created"} [sort=name] Sort field
 * @apiQuery {String="asc","desc"} [order=asc] Sort order
 */
```

### @apiBody
Documents request body parameters.

**Syntax:**
```javascript
@apiBody [(group)] [{type}] [field=defaultValue] [description]
```

**Examples:**
```javascript
/**
 * @api {post} /users Create User
 * @apiBody {String} name User's full name
 * @apiBody {String} email User's email address
 * @apiBody {String{8..}} password User's password (min 8 chars)
 * @apiBody {Object} [profile] User profile data
 * @apiBody {String} [profile.bio] Profile biography
 * @apiBody {String[]} [profile.interests] User interests
 */
```

### @apiHeader
Documents HTTP headers.

**Syntax:**
```javascript
@apiHeader [(group)] [{type}] [field=defaultValue] [description]
```

**Examples:**
```javascript
/**
 * @apiHeader {String} Authorization Bearer token
 * @apiHeader {String} Content-Type=application/json Request content type
 * @apiHeader {String} [Accept=application/json] Response content type
 * @apiHeader {String} [X-API-Key] Optional API key
 */
```

## ✅ Response Tags

### @apiSuccess
Documents successful response fields.

**Syntax:**
```javascript
@apiSuccess [(group)] [{type}] field [description]
```

**Examples:**
```javascript
/**
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 * @apiSuccess {Boolean} active Account status
 * @apiSuccess {Object} profile User profile
 * @apiSuccess {String} profile.bio Profile biography
 * @apiSuccess {Date} createdAt Account creation date
 * @apiSuccess {Date} updatedAt Last update date
 */
```

### @apiError
Documents error response fields.

**Syntax:**
```javascript
@apiError [(group)] [{type}] field [description]
```

**Examples:**
```javascript
/**
 * @apiError {Number} status HTTP status code
 * @apiError {String} error Error type
 * @apiError {String} message Error description
 * @apiError {Object[]} [errors] Validation errors
 * @apiError {String} errors.field Field name
 * @apiError {String} errors.message Field error message
 */
```

## 📋 Example Tags

### @apiExample
Documents request examples.

**Syntax:**
```javascript
@apiExample [{type}] title
example
```

**Examples:**
```javascript
/**
 * @apiExample {curl} Example usage:
 * curl -X POST http://localhost:3000/api/users \
 *   -H "Content-Type: application/json" \
 *   -d '{"name":"John Doe","email":"john@example.com"}'
 *
 * @apiExample {javascript} JavaScript:
 * const response = await fetch('/api/users', {
 *   method: 'POST',
 *   headers: {'Content-Type': 'application/json'},
 *   body: JSON.stringify({
 *     name: 'John Doe',
 *     email: 'john@example.com'
 *   })
 * });
 */
```

### @apiSuccessExample
Documents successful response examples.

**Syntax:**
```javascript
@apiSuccessExample [{type}] title
example
```

**Examples:**
```javascript
/**
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "active": true,
 *   "createdAt": "2024-01-15T10:30:00Z"
 * }
 *
 * @apiSuccessExample {json} Created-Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 2,
 *   "name": "Jane Smith",
 *   "email": "jane@example.com",
 *   "active": true
 * }
 */
```

### @apiErrorExample
Documents error response examples.

**Syntax:**
```javascript
@apiErrorExample [{type}] title
example
```

**Examples:**
```javascript
/**
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "ValidationError",
 *   "message": "Invalid input data",
 *   "errors": [
 *     {
 *       "field": "email",
 *       "message": "Email already exists"
 *     }
 *   ]
 * }
 *
 * @apiErrorExample {json} Unauthorized-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *   "error": "Unauthorized",
 *   "message": "Invalid or expired token"
 * }
 */
```

## 🔗 Reference Tags

### @apiUse
References a predefined block of documentation.

**Syntax:**
```javascript
@apiUse name
```

**Example:**
```javascript
/**
 * @apiDefine CommonErrors
 * @apiError {Number} status HTTP status code
 * @apiError {String} error Error type
 * @apiError {String} message Error message
 */

/**
 * @api {get} /users Get Users
 * @apiUse CommonErrors
 */
```

### @apiDefine
Defines reusable documentation blocks.

**Syntax:**
```javascript
@apiDefine name [title] [description]
```

**Examples:**
```javascript
/**
 * @apiDefine UserObject
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 */

/**
 * @apiDefine AuthRequired
 * @apiHeader {String} Authorization Bearer token required
 * @apiError (401) {String} error="Unauthorized" Missing or invalid token
 */
```

## 🔐 Security Tags

### @apiPermission
Documents required permissions.

**Syntax:**
```javascript
@apiPermission name
```

**Examples:**
```javascript
/**
 * @apiPermission admin
 * @apiPermission user
 * @apiPermission read:users
 * @apiPermission write:products
 */
```

### @apiPrivate
Marks endpoint as private (won't be included in public docs).

**Syntax:**
```javascript
@apiPrivate
```

**Example:**
```javascript
/**
 * @api {delete} /admin/users/:id Delete User (Admin)
 * @apiPrivate
 * @apiPermission admin
 */
```

## 📡 MQTT Protocol Tags

### @mqtt
Defines MQTT operation.

**Syntax:**
```javascript
@mqtt {operation} topic [title]
```

**Examples:**
```javascript
/**
 * @mqtt {publish} sensors/temperature Temperature Data
 * @mqtt {subscribe} alerts/+/critical Critical Alerts
 * @mqtt {publish} commands/device/restart Restart Command
 */
```

### @topic
Documents MQTT topic pattern.

**Syntax:**
```javascript
@topic topic_pattern
```

**Examples:**
```javascript
/**
 * @topic sensors/{deviceId}/temperature
 * @topic alerts/+/critical
 * @topic commands/device/#
 */
```

### @payload
Documents MQTT message payload.

**Syntax:**
```javascript
@payload [{type}] field [description]
```

**Examples:**
```javascript
/**
 * @payload {Object} data Sensor data
 * @payload {Number} data.temperature Temperature in Celsius
 * @payload {Number} data.humidity Humidity percentage
 * @payload {String} data.timestamp ISO timestamp
 */
```

### @qos
Documents Quality of Service level.

**Syntax:**
```javascript
@qos level
```

**Examples:**
```javascript
/**
 * @qos 0 // Fire and forget
 * @qos 1 // At least once
 * @qos 2 // Exactly once
 */
```

## 🔧 Advanced Tags

### @apiSampleRequest
Configures sample request functionality.

**Syntax:**
```javascript
@apiSampleRequest url
```

**Examples:**
```javascript
/**
 * @apiSampleRequest https://api.example.com
 * @apiSampleRequest off
 * @apiSampleRequest /api/v1
 */
```

### @apiDeprecated
Marks endpoint as deprecated.

**Syntax:**
```javascript
@apiDeprecated [text]
```

**Examples:**
```javascript
/**
 * @api {get} /users/legacy Get Users (Legacy)
 * @apiDeprecated Use /v2/users instead
 */
```

### @apiIgnore
Ignores this block during generation.

**Syntax:**
```javascript
@apiIgnore [text]
```

**Example:**
```javascript
/**
 * @api {post} /test Test Endpoint
 * @apiIgnore Not ready for documentation
 */
```

## 📋 Complete Example

```javascript
/**
 * @api {post} /api/v1/users Create User
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiPermission admin
 *
 * @apiDescription Creates a new user account with full validation.
 * This endpoint validates email uniqueness, password strength,
 * and required fields before creating the user.
 *
 * @apiHeader {String} Authorization Bearer token required
 * @apiHeader {String} Content-Type=application/json Request content type
 *
 * @apiBody {String} name User's full name (2-50 characters)
 * @apiBody {String} email Valid email address
 * @apiBody {String{8..}} password Strong password (min 8 chars)
 * @apiBody {String="user","admin","moderator"} [role=user] User role
 * @apiBody {Object} [profile] Optional profile data
 * @apiBody {String} [profile.bio] Profile biography
 * @apiBody {String[]} [profile.interests] User interests
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 * @apiSuccess {String} role User's role
 * @apiSuccess {Boolean} active Account status
 * @apiSuccess {Object} profile User profile
 * @apiSuccess {Date} createdAt Creation timestamp
 *
 * @apiError {Number} status HTTP status code
 * @apiError {String} error Error type
 * @apiError {String} message Error description
 * @apiError {Object[]} [errors] Validation errors
 *
 * @apiExample {curl} cURL Example:
 * curl -X POST http://localhost:3000/api/v1/users \
 *   -H "Authorization: Bearer your-token" \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "password": "securePassword123",
 *     "role": "user"
 *   }'
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 1,
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "role": "user",
 *   "active": true,
 *   "profile": {
 *     "bio": null,
 *     "interests": []
 *   },
 *   "createdAt": "2024-01-15T10:30:00Z"
 * }
 *
 * @apiErrorExample {json} Validation Error:
 * HTTP/1.1 400 Bad Request
 * {
 *   "status": 400,
 *   "error": "ValidationError",
 *   "message": "Invalid input data",
 *   "errors": [
 *     {
 *       "field": "email",
 *       "message": "Email already exists"
 *     },
 *     {
 *       "field": "password",
 *       "message": "Password must contain at least one number"
 *     }
 *   ]
 * }
 */
```

## 📋 Best Practices

### 1. Consistency
- ✅ Use consistent naming conventions
- ✅ Follow standard parameter patterns
- ✅ Maintain consistent grouping
- ✅ Use standard HTTP status codes

### 2. Completeness
- ✅ Document all parameters
- ✅ Include examples for complex data
- ✅ Document all possible errors
- ✅ Provide realistic examples

### 3. Clarity
- ✅ Write clear descriptions
- ✅ Use appropriate parameter types
- ✅ Specify required vs optional
- ✅ Include validation rules

### 4. Maintenance
- ✅ Keep documentation up to date
- ✅ Use @apiUse for common patterns
- ✅ Version your API documentation
- ✅ Remove deprecated endpoints

This comprehensive reference covers all APIDoc parameters for documenting professional-grade REST APIs and MQTT protocols with complete accuracy and detail.