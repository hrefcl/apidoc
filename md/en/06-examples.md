---
title: "Examples & Templates"
category: "Core"
order: 6
---

# 💡 Examples & Templates

Practical examples and templates for documenting APIs with APIDoc, including real-world patterns, best practices, and complete implementation guides.

## 🚀 Basic REST API Examples

### Simple GET Endpoint
```javascript
/**
 * @api {get} /users Get All Users
 * @apiName GetUsers
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a paginated list of all users in the system.
 *
 * @apiQuery {Number{1..100}} [limit=10] Number of users per page
 * @apiQuery {Number} [offset=0] Number of users to skip
 * @apiQuery {String} [search] Search term for filtering users
 * @apiQuery {String="name","email","created"} [sort=name] Sort field
 * @apiQuery {String="asc","desc"} [order=asc] Sort order
 *
 * @apiSuccess {Number} total Total number of users
 * @apiSuccess {Number} count Number of users in current page
 * @apiSuccess {Object[]} users Array of user objects
 * @apiSuccess {Number} users.id User ID
 * @apiSuccess {String} users.name User's full name
 * @apiSuccess {String} users.email User's email address
 * @apiSuccess {Boolean} users.active Account status
 * @apiSuccess {Date} users.createdAt Account creation date
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "total": 150,
 *   "count": 10,
 *   "users": [
 *     {
 *       "id": 1,
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "active": true,
 *       "createdAt": "2024-01-15T10:30:00Z"
 *     }
 *   ]
 * }
 */
```

### POST with Validation
```javascript
/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new user account with comprehensive validation.
 * Email must be unique and password must meet security requirements.
 *
 * @apiHeader {String} Content-Type=application/json Request content type
 * @apiHeader {String} Authorization Bearer token for authentication
 *
 * @apiBody {String{2..50}} name User's full name
 * @apiBody {String} email Valid email address (must be unique)
 * @apiBody {String{8..}} password Strong password (min 8 characters)
 * @apiBody {String="user","admin","moderator"} [role=user] User role
 * @apiBody {Object} [profile] Optional profile information
 * @apiBody {String{..500}} [profile.bio] User biography
 * @apiBody {String[]} [profile.interests] Array of interests
 * @apiBody {String} [profile.website] Personal website URL
 *
 * @apiSuccess (201) {Number} id Created user ID
 * @apiSuccess (201) {String} name User's name
 * @apiSuccess (201) {String} email User's email
 * @apiSuccess (201) {String} role User's role
 * @apiSuccess (201) {Boolean} active=true Account status
 * @apiSuccess (201) {Object} profile User profile
 * @apiSuccess (201) {Date} createdAt Creation timestamp
 *
 * @apiError (400) {String} error="ValidationError" Validation failed
 * @apiError (400) {String} message Error description
 * @apiError (400) {Object[]} errors Array of validation errors
 * @apiError (400) {String} errors.field Field name with error
 * @apiError (400) {String} errors.message Field-specific error message
 * @apiError (409) {String} error="ConflictError" Email already exists
 * @apiError (401) {String} error="Unauthorized" Invalid authentication
 *
 * @apiExample {curl} cURL Example:
 * curl -X POST http://localhost:3000/api/users \
 *   -H "Content-Type: application/json" \
 *   -H "Authorization: Bearer your-jwt-token" \
 *   -d '{
 *     "name": "Jane Smith",
 *     "email": "jane@example.com",
 *     "password": "SecurePass123!",
 *     "role": "user",
 *     "profile": {
 *       "bio": "Software developer passionate about APIs",
 *       "interests": ["programming", "api-design"],
 *       "website": "https://janesmith.dev"
 *     }
 *   }'
 *
 * @apiExample {javascript} JavaScript/Fetch:
 * const response = await fetch('/api/users', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'Authorization': 'Bearer ' + token
 *   },
 *   body: JSON.stringify({
 *     name: 'Jane Smith',
 *     email: 'jane@example.com',
 *     password: 'SecurePass123!',
 *     profile: {
 *       bio: 'Software developer passionate about APIs'
 *     }
 *   })
 * });
 * const user = await response.json();
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": 42,
 *   "name": "Jane Smith",
 *   "email": "jane@example.com",
 *   "role": "user",
 *   "active": true,
 *   "profile": {
 *     "bio": "Software developer passionate about APIs",
 *     "interests": ["programming", "api-design"],
 *     "website": "https://janesmith.dev"
 *   },
 *   "createdAt": "2024-01-15T14:22:33Z"
 * }
 *
 * @apiErrorExample {json} Validation Error:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "ValidationError",
 *   "message": "Invalid input data",
 *   "errors": [
 *     {
 *       "field": "email",
 *       "message": "Email already exists"
 *     },
 *     {
 *       "field": "password",
 *       "message": "Password must contain at least one special character"
 *     }
 *   ]
 * }
 */
```

## 🔧 Advanced Examples

### Nested Objects and Arrays
```javascript
/**
 * @api {put} /products/:id Update Product
 * @apiName UpdateProduct
 * @apiGroup Product
 * @apiVersion 2.0.0
 *
 * @apiDescription Updates a product with complex nested data structure
 * including variants, pricing, and metadata.
 *
 * @apiParam {Number} id Product unique identifier
 *
 * @apiBody {String} name Product name
 * @apiBody {String} description Product description
 * @apiBody {String} category Product category
 * @apiBody {Object} pricing Pricing information
 * @apiBody {Number} pricing.basePrice Base price in cents
 * @apiBody {String} pricing.currency=USD Currency code
 * @apiBody {Number} [pricing.discount] Discount percentage (0-100)
 * @apiBody {Object[]} variants Product variants
 * @apiBody {String} variants.sku Variant SKU
 * @apiBody {String} variants.name Variant name
 * @apiBody {Number} variants.price Variant price in cents
 * @apiBody {Object} variants.attributes Variant attributes
 * @apiBody {String} [variants.attributes.color] Color attribute
 * @apiBody {String} [variants.attributes.size] Size attribute
 * @apiBody {Number} variants.inventory Inventory count
 * @apiBody {String[]} tags Product tags
 * @apiBody {Object} metadata Additional metadata
 * @apiBody {String} metadata.vendor Vendor information
 * @apiBody {Boolean} metadata.featured Featured product flag
 *
 * @apiExample {json} Request Example:
 * {
 *   "name": "Premium T-Shirt",
 *   "description": "High-quality cotton t-shirt",
 *   "category": "clothing",
 *   "pricing": {
 *     "basePrice": 2999,
 *     "currency": "USD",
 *     "discount": 10
 *   },
 *   "variants": [
 *     {
 *       "sku": "TSHIRT-RED-M",
 *       "name": "Red Medium",
 *       "price": 2999,
 *       "attributes": {
 *         "color": "red",
 *         "size": "medium"
 *       },
 *       "inventory": 50
 *     },
 *     {
 *       "sku": "TSHIRT-BLUE-L",
 *       "name": "Blue Large",
 *       "price": 2999,
 *       "attributes": {
 *         "color": "blue",
 *         "size": "large"
 *       },
 *       "inventory": 25
 *     }
 *   ],
 *   "tags": ["clothing", "t-shirt", "cotton"],
 *   "metadata": {
 *     "vendor": "Premium Apparel Co.",
 *     "featured": true
 *   }
 * }
 */
```

### File Upload Endpoint
```javascript
/**
 * @api {post} /uploads/images Upload Image
 * @apiName UploadImage
 * @apiGroup Media
 * @apiVersion 1.0.0
 *
 * @apiDescription Uploads an image file with validation and processing.
 * Supports JPEG, PNG, and WebP formats up to 10MB.
 *
 * @apiHeader {String} Content-Type=multipart/form-data Request content type
 * @apiHeader {String} Authorization Bearer token required
 *
 * @apiBody {File} image Image file (JPEG, PNG, WebP)
 * @apiBody {String} [title] Image title
 * @apiBody {String} [description] Image description
 * @apiBody {String="public","private"} [visibility=public] Image visibility
 * @apiBody {String[]} [tags] Image tags
 *
 * @apiSuccess {String} id Image unique identifier
 * @apiSuccess {String} filename Original filename
 * @apiSuccess {String} url Public URL to access image
 * @apiSuccess {String} thumbnailUrl URL to thumbnail version
 * @apiSuccess {Number} size File size in bytes
 * @apiSuccess {String} mimeType MIME type of the file
 * @apiSuccess {Object} dimensions Image dimensions
 * @apiSuccess {Number} dimensions.width Image width in pixels
 * @apiSuccess {Number} dimensions.height Image height in pixels
 * @apiSuccess {Date} uploadedAt Upload timestamp
 *
 * @apiExample {curl} cURL Example:
 * curl -X POST http://localhost:3000/api/uploads/images \
 *   -H "Authorization: Bearer your-token" \
 *   -F "image=@/path/to/image.jpg" \
 *   -F "title=Product Photo" \
 *   -F "description=Main product image" \
 *   -F "visibility=public" \
 *   -F "tags=product,photo"
 *
 * @apiExample {javascript} JavaScript/FormData:
 * const formData = new FormData();
 * formData.append('image', file);
 * formData.append('title', 'Product Photo');
 * formData.append('visibility', 'public');
 *
 * const response = await fetch('/api/uploads/images', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': 'Bearer ' + token
 *   },
 *   body: formData
 * });
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 201 Created
 * {
 *   "id": "img_1234567890",
 *   "filename": "product-photo.jpg",
 *   "url": "https://cdn.example.com/images/img_1234567890.jpg",
 *   "thumbnailUrl": "https://cdn.example.com/thumbnails/img_1234567890.jpg",
 *   "size": 2048576,
 *   "mimeType": "image/jpeg",
 *   "dimensions": {
 *     "width": 1920,
 *     "height": 1080
 *   },
 *   "uploadedAt": "2024-01-15T16:45:00Z"
 * }
 */
```

## 🔐 Authentication Examples

### JWT Authentication
```javascript
/**
 * @api {post} /auth/login User Login
 * @apiName LoginUser
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 *
 * @apiDescription Authenticates user credentials and returns JWT token.
 * Token expires after 24 hours and can be refreshed.
 *
 * @apiBody {String} email User's email address
 * @apiBody {String} password User's password
 * @apiBody {Boolean} [rememberMe=false] Extended session duration
 *
 * @apiSuccess {String} token JWT access token
 * @apiSuccess {String} refreshToken Token for refreshing access
 * @apiSuccess {Number} expiresIn Token expiration time in seconds
 * @apiSuccess {Object} user User information
 * @apiSuccess {Number} user.id User ID
 * @apiSuccess {String} user.name User's name
 * @apiSuccess {String} user.email User's email
 * @apiSuccess {String} user.role User's role
 *
 * @apiError (401) {String} error="AuthenticationError" Invalid credentials
 * @apiError (429) {String} error="TooManyRequests" Rate limit exceeded
 * @apiError (423) {String} error="AccountLocked" Account temporarily locked
 *
 * @apiExample {curl} cURL Example:
 * curl -X POST http://localhost:3000/api/auth/login \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "email": "user@example.com",
 *     "password": "userPassword123",
 *     "rememberMe": true
 *   }'
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "expiresIn": 86400,
 *   "user": {
 *     "id": 1,
 *     "name": "John Doe",
 *     "email": "user@example.com",
 *     "role": "user"
 *   }
 * }
 *
 * @apiErrorExample {json} Invalid Credentials:
 * HTTP/1.1 401 Unauthorized
 * {
 *   "error": "AuthenticationError",
 *   "message": "Invalid email or password"
 * }
 */
```

### API Key Authentication
```javascript
/**
 * @api {get} /api/v1/analytics/dashboard Analytics Dashboard
 * @apiName GetAnalyticsDashboard
 * @apiGroup Analytics
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves comprehensive analytics dashboard data.
 * Requires valid API key with analytics:read scope.
 *
 * @apiHeader {String} X-API-Key Valid API key with analytics scope
 * @apiHeader {String} [X-Client-Version] Client version for compatibility
 *
 * @apiQuery {String="7d","30d","90d"} [period=30d] Analytics period
 * @apiQuery {String[]} [metrics] Specific metrics to include
 * @apiQuery {String} [timezone=UTC] Timezone for date calculations
 *
 * @apiSuccess {Object} summary Summary statistics
 * @apiSuccess {Number} summary.totalUsers Total user count
 * @apiSuccess {Number} summary.activeUsers Active users in period
 * @apiSuccess {Number} summary.revenue Total revenue
 * @apiSuccess {Number} summary.conversionRate Conversion rate percentage
 * @apiSuccess {Object[]} metrics Detailed metrics array
 * @apiSuccess {String} metrics.date Date in YYYY-MM-DD format
 * @apiSuccess {Number} metrics.users User count for date
 * @apiSuccess {Number} metrics.sessions Session count for date
 * @apiSuccess {Number} metrics.revenue Revenue for date
 *
 * @apiExample {curl} cURL Example:
 * curl -X GET "http://localhost:3000/api/v1/analytics/dashboard?period=7d" \
 *   -H "X-API-Key: ak_1234567890abcdef" \
 *   -H "X-Client-Version: 1.2.0"
 *
 * @apiExample {javascript} JavaScript Example:
 * const response = await fetch('/api/v1/analytics/dashboard?period=7d', {
 *   headers: {
 *     'X-API-Key': 'ak_1234567890abcdef',
 *     'X-Client-Version': '1.2.0'
 *   }
 * });
 * const analytics = await response.json();
 */
```

## 🌐 Multi-language API

### Internationalization Support
```javascript
/**
 * @api {get} /content/articles Get Articles
 * @apiName GetArticles
 * @apiGroup Content
 * @apiVersion 2.0.0
 *
 * @apiDescription Retrieves localized articles based on Accept-Language header.
 * Supports English (en), Spanish (es), French (fr), and German (de).
 *
 * @apiHeader {String} [Accept-Language=en] Preferred language (en, es, fr, de)
 * @apiHeader {String} [Accept=application/json] Response content type
 *
 * @apiQuery {String} [category] Filter by category
 * @apiQuery {String} [status="published"] Article status filter
 * @apiQuery {Number{1..50}} [limit=10] Number of articles per page
 * @apiQuery {Number} [offset=0] Pagination offset
 *
 * @apiSuccess {Object[]} articles Array of localized articles
 * @apiSuccess {String} articles.id Article unique identifier
 * @apiSuccess {String} articles.title Localized article title
 * @apiSuccess {String} articles.excerpt Localized article excerpt
 * @apiSuccess {String} articles.content Localized full content
 * @apiSuccess {String} articles.language Article language code
 * @apiSuccess {String} articles.category Article category
 * @apiSuccess {String[]} articles.tags Article tags (localized)
 * @apiSuccess {Date} articles.publishedAt Publication date
 * @apiSuccess {Object} articles.author Author information
 * @apiSuccess {String} articles.author.name Author name
 * @apiSuccess {String} articles.author.bio Localized author bio
 *
 * @apiExample {curl} English Request:
 * curl -X GET http://localhost:3000/api/content/articles \
 *   -H "Accept-Language: en" \
 *   -H "Accept: application/json"
 *
 * @apiExample {curl} Spanish Request:
 * curl -X GET http://localhost:3000/api/content/articles \
 *   -H "Accept-Language: es" \
 *   -H "Accept: application/json"
 *
 * @apiSuccessExample {json} English Response:
 * HTTP/1.1 200 OK
 * Content-Language: en
 * [
 *   {
 *     "id": "article_123",
 *     "title": "Getting Started with APIs",
 *     "excerpt": "Learn the basics of API development...",
 *     "content": "APIs are essential for modern applications...",
 *     "language": "en",
 *     "category": "tutorial",
 *     "tags": ["api", "tutorial", "development"],
 *     "publishedAt": "2024-01-15T10:00:00Z",
 *     "author": {
 *       "name": "John Developer",
 *       "bio": "Senior API Developer with 10+ years experience"
 *     }
 *   }
 * ]
 *
 * @apiSuccessExample {json} Spanish Response:
 * HTTP/1.1 200 OK
 * Content-Language: es
 * [
 *   {
 *     "id": "article_123",
 *     "title": "Introducción a las APIs",
 *     "excerpt": "Aprende los fundamentos del desarrollo de APIs...",
 *     "content": "Las APIs son esenciales para aplicaciones modernas...",
 *     "language": "es",
 *     "category": "tutorial",
 *     "tags": ["api", "tutorial", "desarrollo"],
 *     "publishedAt": "2024-01-15T10:00:00Z",
 *     "author": {
 *       "name": "John Developer",
 *       "bio": "Desarrollador Senior de APIs con más de 10 años de experiencia"
 *     }
 *   }
 * ]
 */
```

## 📡 MQTT Examples

### IoT Sensor Data
```javascript
/**
 * @mqtt {publish} sensors/{deviceId}/telemetry Device Telemetry
 * @mqttGroup IoT Sensors
 * @topic sensors/{deviceId}/telemetry
 * @topicParam {String} deviceId Unique device identifier (format: DEV_XXXXXXXX)
 *
 * @payload {Object} telemetry Sensor telemetry data
 * @payload {Number} telemetry.temperature Temperature in Celsius (-40 to 125)
 * @payload {Number} telemetry.humidity Relative humidity percentage (0-100)
 * @payload {Number} telemetry.pressure Atmospheric pressure in hPa
 * @payload {Number} telemetry.batteryLevel Battery level percentage (0-100)
 * @payload {String} telemetry.timestamp ISO 8601 timestamp
 * @payload {Object} telemetry.location GPS coordinates
 * @payload {Number} telemetry.location.latitude Latitude (-90 to 90)
 * @payload {Number} telemetry.location.longitude Longitude (-180 to 180)
 * @payload {Number} telemetry.location.altitude Altitude in meters
 *
 * @qos 1
 * @retain true
 * @ratelimit 1/second
 * @tags iot,sensors,telemetry,monitoring
 *
 * @examplePublish {json} Sensor Data:
 * {
 *   "telemetry": {
 *     "temperature": 23.5,
 *     "humidity": 65.2,
 *     "pressure": 1013.25,
 *     "batteryLevel": 87,
 *     "timestamp": "2024-01-15T14:30:00Z",
 *     "location": {
 *       "latitude": 40.7128,
 *       "longitude": -74.0060,
 *       "altitude": 10.5
 *     }
 *   }
 * }
 */

/**
 * @mqtt {subscribe} alerts/{severity}/+ System Alerts
 * @mqttGroup System Monitoring
 * @topic alerts/{severity}/{component}
 * @topicParam {String="low","medium","high","critical"} severity Alert severity level
 * @topicParam {String} component System component (api, database, cache, etc.)
 *
 * @payload {Object} alert Alert information
 * @payload {String} alert.id Unique alert identifier
 * @payload {String} alert.type Alert type (error, warning, info)
 * @payload {String} alert.message Human-readable alert message
 * @payload {String} alert.component Affected component
 * @payload {Object} alert.metadata Additional alert metadata
 * @payload {String} alert.timestamp ISO 8601 timestamp
 * @payload {Object[]} [alert.actions] Suggested actions
 * @payload {String} alert.actions.type Action type
 * @payload {String} alert.actions.description Action description
 *
 * @qos 2
 * @errors Connection timeout,Invalid topic,Insufficient permissions
 *
 * @exampleSubscribe {json} Critical Database Alert:
 * {
 *   "alert": {
 *     "id": "alert_db_001",
 *     "type": "error",
 *     "message": "Database connection pool exhausted",
 *     "component": "database",
 *     "metadata": {
 *       "poolSize": 50,
 *       "activeConnections": 50,
 *       "queuedRequests": 25
 *     },
 *     "timestamp": "2024-01-15T14:35:00Z",
 *     "actions": [
 *       {
 *         "type": "scale",
 *         "description": "Increase database connection pool size"
 *       },
 *       {
 *         "type": "restart",
 *         "description": "Restart database service"
 *       }
 *     ]
 *   }
 * }
 */
```

## 📋 Best Practices

### 1. Documentation Structure
```javascript
/**
 * @api {method} /endpoint Endpoint Title
 * @apiName UniqueName          // Always include
 * @apiGroup LogicalGroup       // Group related endpoints
 * @apiVersion 1.0.0           // Version for tracking
 *
 * @apiDescription Detailed description of what this endpoint does,
 * including business logic, validation rules, and side effects.
 *
 * @apiPermission requiredRole  // Document security requirements
 *
 * // Headers, parameters, body in logical order
 * @apiHeader {String} Authorization Bearer token
 * @apiParam {Type} param Parameter description
 * @apiBody {Type} field Field description
 *
 * // Success responses with status codes
 * @apiSuccess (200) {Type} field Success field
 * @apiSuccess (201) {Type} field Created field
 *
 * // Error responses with status codes
 * @apiError (400) {Type} field Validation error
 * @apiError (401) {Type} field Authentication error
 * @apiError (403) {Type} field Authorization error
 * @apiError (404) {Type} field Not found error
 * @apiError (500) {Type} field Server error
 *
 * // Multiple examples for clarity
 * @apiExample {curl} cURL
 * @apiExample {javascript} JavaScript
 * @apiExample {python} Python
 *
 * @apiSuccessExample {json} Success
 * @apiErrorExample {json} Error
 */
```

### 2. Reusable Components
```javascript
/**
 * @apiDefine CommonHeaders
 * @apiHeader {String} Authorization Bearer token required
 * @apiHeader {String} Content-Type=application/json Request content type
 * @apiHeader {String} [Accept=application/json] Response content type
 * @apiHeader {String} [X-Request-ID] Unique request identifier
 */

/**
 * @apiDefine CommonErrors
 * @apiError (400) {String} error="ValidationError" Request validation failed
 * @apiError (401) {String} error="Unauthorized" Authentication required
 * @apiError (403) {String} error="Forbidden" Insufficient permissions
 * @apiError (404) {String} error="NotFound" Resource not found
 * @apiError (429) {String} error="TooManyRequests" Rate limit exceeded
 * @apiError (500) {String} error="InternalError" Server error occurred
 */

/**
 * @apiDefine PaginationQuery
 * @apiQuery {Number{1..100}} [limit=10] Number of items per page
 * @apiQuery {Number} [offset=0] Number of items to skip
 * @apiQuery {String} [sort] Sort field name
 * @apiQuery {String="asc","desc"} [order=asc] Sort direction
 */

// Usage in endpoints
/**
 * @api {get} /products Get Products
 * @apiUse CommonHeaders
 * @apiUse PaginationQuery
 * @apiUse CommonErrors
 */
```

### 3. Complex Data Types
```javascript
/**
 * @apiDefine UserObject
 * @apiSuccess {Number} id User unique identifier
 * @apiSuccess {String} name User's full name
 * @apiSuccess {String} email User's email address
 * @apiSuccess {String} role User's role (user, admin, moderator)
 * @apiSuccess {Boolean} active Account active status
 * @apiSuccess {Object} profile User profile information
 * @apiSuccess {String} profile.bio Profile biography
 * @apiSuccess {String} profile.avatar Avatar image URL
 * @apiSuccess {String[]} profile.interests Array of user interests
 * @apiSuccess {Date} createdAt Account creation timestamp
 * @apiSuccess {Date} updatedAt Last update timestamp
 */
```

These examples provide comprehensive templates for documenting professional APIs with APIDoc, covering everything from simple endpoints to complex MQTT protocols with proper error handling and internationalization support.