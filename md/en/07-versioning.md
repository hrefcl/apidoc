# 🔄 Versioning and Inheritance

APIDoc provides a robust versioning system that allows you to maintain multiple API versions and inherit configurations between versions.

## 🎯 Fundamental Concepts

### API Versioning
APIDoc can generate documentation for multiple versions of your API simultaneously, enabling:
- **Semantic versioning** (1.0.0, 1.1.0, 2.0.0)
- **Configuration inheritance** between versions
- **Comparative documentation** between versions
- **Gradual migration** of endpoints

## 📋 Version Configuration

### Basic Configuration
```json
{
  "name": "My API",
  "version": "2.0.0",
  "description": "API version 2.0",
  "title": "My API v2.0"
}
```

### Configuration with Inheritance
```json
{
  "name": "My API",
  "version": "2.0.0",
  "versions": {
    "1.0.0": {
      "description": "Initial stable version",
      "deprecated": true
    },
    "1.5.0": {
      "description": "Version with performance improvements",
      "deprecated": false
    },
    "2.0.0": {
      "description": "Current version with breaking changes",
      "deprecated": false
    }
  }
}
```

## 🏷️ Version Tags in Code

### @apiVersion
Defines the specific version of an endpoint:

```javascript
/**
 * @api {get} /users/:id Get User
 * @apiVersion 2.0.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 */
```

### Multiple Versions of the Same Endpoint
```javascript
/**
 * @api {get} /users/:id Get User (v1.0)
 * @apiVersion 1.0.0
 * @apiName GetUserV1
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID
 * @apiSuccess {String} name User's name
 */

/**
 * @api {get} /users/:id Get User (v2.0)
 * @apiVersion 2.0.0
 * @apiName GetUserV2
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 * @apiSuccess {Date} createdAt Creation date
 * @apiSuccess {Object} profile Detailed user profile
 */
```

## 🔗 Configuration Inheritance

### @apiDefine for Reusability
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
 * @api {get} /users/:id Get User
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiUse UserSuccessExample
 */
```

### @apiUse for Inheritance
```javascript
/**
 * @apiDefine UserObject
 * @apiSuccess {Number} id User's unique ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 */

/**
 * @api {get} /users/:id Get User
 * @apiVersion 2.0.0
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiUse UserObject
 * @apiSuccess {Date} createdAt Creation date (new in v2.0)
 */
```

## 📊 Versioning Strategies

### 1. Semantic Versioning
```json
{
  "versions": {
    "1.0.0": "Initial version",
    "1.1.0": "New compatible features",
    "1.1.1": "Bug fixes",
    "2.0.0": "Breaking changes"
  }
}
```

### 2. Date-based Versioning
```javascript
/**
 * @apiVersion 2024-01-15
 * @api {get} /users User List
 */
```

### 3. Named Versioning
```javascript
/**
 * @apiVersion beta
 * @api {post} /users/beta Create User (Beta)
 */
```

## 🔧 Advanced Configuration

### Deprecation Configuration
```json
{
  "versions": {
    "1.0.0": {
      "description": "Initial version",
      "deprecated": true,
      "deprecationDate": "2024-12-31",
      "replacedBy": "2.0.0"
    }
  }
}
```

### Deprecation Tags in Code
```javascript
/**
 * @api {get} /users/old Get Users (Deprecated)
 * @apiVersion 1.0.0
 * @apiName GetUsersOld
 * @apiGroup User
 * @apiDeprecated Use /users instead
 *
 * @apiParam {Number} [limit=10] Result limit
 */
```

## 📁 Version-based File Organization

### Recommended Structure
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

### Configuration for Multiple Directories
```json
{
  "name": "My API",
  "version": "2.0.0",
  "src": [
    "./src/v1/",
    "./src/v2/",
    "./src/shared/"
  ]
}
```

## 🎨 Version Customization

### Icons and Titles per Version
```json
{
  "versions": {
    "1.0.0": {
      "title": "Legacy API",
      "icon": "fa-archive",
      "deprecated": true
    },
    "2.0.0": {
      "title": "Modern API",
      "icon": "fa-rocket",
      "deprecated": false
    }
  }
}
```

## 📈 Version Comparison

### Endpoint with Changes
```javascript
// v1.0.0
/**
 * @api {post} /users Create User
 * @apiVersion 1.0.0
 * @apiParam {String} name User's name
 * @apiParam {String} email User's email
 */

// v2.0.0
/**
 * @api {post} /users Create User
 * @apiVersion 2.0.0
 * @apiParam {String} name User's name
 * @apiParam {String} email User's email
 * @apiParam {String} [phone] Phone number (new)
 * @apiParam {Object} [address] Address (new)
 * @apiParam {String} address.street Street
 * @apiParam {String} address.city City
 */
```

## 🚀 Best Practices

### 1. Consistent Versioning
- Use semantic versioning for public APIs
- Maintain backward compatibility when possible
- Clearly document breaking changes

### 2. Smart Inheritance
```javascript
/**
 * @apiDefine CommonHeaders
 * @apiHeader {String} Authorization Bearer token
 * @apiHeader {String} Content-Type application/json
 */

/**
 * @apiDefine CommonErrors
 * @apiError (400) BadRequest Invalid request
 * @apiError (401) Unauthorized Invalid token
 * @apiError (500) InternalError Server error
 */
```

### 3. Migration Documentation
```javascript
/**
 * @api {get} /users User List
 * @apiVersion 2.0.0
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiDescription
 * **Changes since v1.0.0:**
 * - New `createdAt` field in response
 * - `sort` parameter now accepts multiple values
 * - Improved pagination with `cursor`
 *
 * **Migration:**
 * ```
 * // v1.0.0
 * GET /users?sort=name
 *
 * // v2.0.0
 * GET /users?sort=name,email&cursor=abc123
 * ```
 */
```

## 🔍 Version Filtering

### CLI v5 to Generate Specific Version
```bash
# Generate only v2.0.0
apidoc generate -i src/ -o doc/ --filter-version 2.0.0

# Generate multiple versions
apidoc generate -i src/ -o doc/ --filter-version "1.5.0,2.0.0"
```

### Configuration in package.json
```json
{
  "scripts": {
    "docs:v1": "apidoc generate -i src/ -o doc/v1 --filter-version 1.0.0",
    "docs:v2": "apidoc generate -i src/ -o doc/v2 --filter-version 2.0.0",
    "docs:all": "apidoc generate -i src/ -o doc/"
  }
}
```

## 📋 Complete Example

### apidoc.json
```json
{
  "name": "E-commerce API",
  "version": "2.1.0",
  "description": "Complete e-commerce API",
  "title": "E-commerce API Documentation",
  "url": "https://api.mystore.com",
  "sampleUrl": "https://api.mystore.com",
  "versions": {
    "1.0.0": {
      "description": "Initial version with basic features",
      "deprecated": true,
      "deprecationDate": "2024-12-31"
    },
    "1.5.0": {
      "description": "Added payment system",
      "deprecated": false
    },
    "2.0.0": {
      "description": "Complete refactoring with GraphQL",
      "deprecated": false
    },
    "2.1.0": {
      "description": "Performance improvements and new features",
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

### Code with Versioning
```javascript
/**
 * @apiDefine AuthHeaders
 * @apiHeader {String} Authorization Bearer authentication token
 * @apiHeader {String} [X-API-Version] Specific API version
 */

/**
 * @api {post} /auth/login Login
 * @apiVersion 2.1.0
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiDescription
 * Authenticates a user and returns a JWT token.
 *
 * **New in v2.1.0:** Multi-factor authentication support
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password Password
 * @apiParam {String} [mfa_code] Multi-factor authentication code
 *
 * @apiSuccess {String} token JWT token for authentication
 * @apiSuccess {Object} user User information
 * @apiSuccess {String} user.id User's ID
 * @apiSuccess {String} user.name User's name
 * @apiSuccess {String} user.email User's email
 * @apiSuccess {Boolean} [user.mfa_enabled] MFA enabled (new in v2.1.0)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *       "user": {
 *         "id": "123",
 *         "name": "John Doe",
 *         "email": "john@example.com",
 *         "mfa_enabled": true
 *       }
 *     }
 */
```

APIDoc's versioning system allows you to maintain clear and organized documentation as your API evolves, facilitating both development and adoption by your API users.
