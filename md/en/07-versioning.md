---
title: "API Versioning & Inheritance"
category: "Core"
order: 7
---

# 📊 API Versioning & Inheritance

Complete guide for managing API versions, inheritance patterns, and maintaining backward compatibility with APIDoc's powerful versioning system.

## 🚀 Overview

APIDoc 4.0 provides sophisticated versioning capabilities to manage API evolution while maintaining documentation clarity and backward compatibility:

- **📈 Version Management**: Semantic versioning support
- **🔄 Inheritance Patterns**: Version-to-version inheritance
- **⚖️ Comparison Views**: Side-by-side version comparisons
- **🛡️ Backward Compatibility**: Maintain older API versions
- **📋 Change Documentation**: Track API evolution

## 🏗️ Version Declaration

### Basic Version Setup
```javascript
/**
 * @api {get} /users Get Users
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiDescription Retrieves a list of all users in the system.
 */
```

### Multiple Version Support
```javascript
/**
 * @api {get} /users Get Users (v1)
 * @apiVersion 1.0.0
 * @apiName GetUsersV1
 * @apiGroup Users
 *
 * @apiParam {Number} [limit=10] Maximum number of users to return
 * @apiParam {Number} [offset=0] Number of users to skip
 */

/**
 * @api {get} /users Get Users (v2)
 * @apiVersion 2.0.0
 * @apiName GetUsersV2
 * @apiGroup Users
 *
 * @apiParam {Number{1..100}} [limit=20] Maximum number of users to return
 * @apiParam {Number} [offset=0] Number of users to skip
 * @apiParam {String="name","email","created"} [sort=created] Sort field
 * @apiParam {String="asc","desc"} [order=desc] Sort order
 */
```

## 🔄 Inheritance System

### Version Inheritance
APIDoc automatically inherits documentation from previous versions, reducing duplication:

```javascript
/**
 * @api {post} /users Create User (v1)
 * @apiVersion 1.0.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiParam {String} name User's full name
 * @apiParam {String} email User's email address
 * @apiParam {String} password User's password
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 * @apiSuccess {Date} createdAt Creation timestamp
 */

/**
 * @api {post} /users Create User (v2)
 * @apiVersion 2.0.0
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiParam {String{2..50}} name User's full name (2-50 characters)
 * @apiParam {String} email Valid email address
 * @apiParam {String{8..}} password Strong password (min 8 chars)
 * @apiParam {String="user","admin","moderator"} [role=user] User role
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 * @apiSuccess {String} role User's role
 * @apiSuccess {Boolean} active Account status
 * @apiSuccess {Date} createdAt Creation timestamp
 * @apiSuccess {Date} updatedAt Last update timestamp
 */
```

### Inheritance Override
Explicitly override inherited parameters:

```javascript
/**
 * @api {put} /users/:id Update User (v3)
 * @apiVersion 3.0.0
 * @apiName UpdateUser
 * @apiGroup Users
 *
 * @apiParam {Number} id User's unique ID
 * @apiParam {String{2..50}} [name] User's full name
 * @apiParam {String} [email] Valid email address
 * @apiParam {Object} [profile] User profile data
 * @apiParam {String} [profile.bio] Profile biography
 * @apiParam {String[]} [profile.interests] User interests
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 * @apiSuccess {Object} profile User profile
 * @apiSuccess {Date} updatedAt Last update timestamp
 */
```

## 📋 Version Configuration

### Project-Level Versioning
```json
{
  "name": "My API",
  "version": "2.1.0",
  "description": "RESTful API with versioning support",
  "defaultVersion": "2.0.0",
  "versions": {
    "1.0.0": {
      "description": "Initial API release",
      "deprecated": true,
      "sunset": "2025-12-31"
    },
    "1.5.0": {
      "description": "Enhanced authentication",
      "deprecated": false
    },
    "2.0.0": {
      "description": "Major API redesign",
      "deprecated": false,
      "stable": true
    },
    "2.1.0": {
      "description": "Latest features",
      "deprecated": false,
      "beta": true
    }
  }
}
```

### Version-Specific Settings
```json
{
  "template": {
    "showVersions": true,
    "compareVersions": true,
    "defaultVersion": "2.0.0",
    "versionSeparator": " | ",
    "showDeprecated": true,
    "highlightChanges": true
  }
}
```

## 🛠️ Advanced Versioning Patterns

### Breaking Changes Documentation
```javascript
/**
 * @api {delete} /users/:id Delete User
 * @apiVersion 2.0.0
 * @apiName DeleteUser
 * @apiGroup Users
 *
 * @apiDescription ⚠️ **BREAKING CHANGE**: This endpoint now requires
 * admin permissions. In v1.x, any authenticated user could delete
 * their own account.
 *
 * @apiPermission admin
 * @apiHeader {String} Authorization Bearer token with admin role
 *
 * @apiParam {Number} id User ID to delete
 *
 * @apiSuccess {Number} status HTTP status code
 * @apiSuccess {String} message Success message
 *
 * @apiError (403) {String} error="Forbidden" Insufficient permissions
 * @apiError (404) {String} error="NotFound" User not found
 */
```

### Deprecation Warnings
```javascript
/**
 * @api {get} /users/profile Get User Profile
 * @apiVersion 1.5.0
 * @apiName GetUserProfile
 * @apiGroup Users
 *
 * @apiDeprecated Use GET /users/:id instead
 *
 * @apiDescription ⚠️ **DEPRECATED**: This endpoint will be removed in v2.0.0.
 * Please migrate to GET /users/:id for better performance and consistency.
 *
 * @apiHeader {String} Authorization Bearer token
 *
 * @apiSuccess {Object} user User profile data
 * @apiSuccess {Number} user.id User ID
 * @apiSuccess {String} user.name User's name
 * @apiSuccess {String} user.email User's email
 */
```

### Feature Flags and Beta APIs
```javascript
/**
 * @api {post} /users/bulk Create Multiple Users
 * @apiVersion 2.1.0-beta
 * @apiName CreateBulkUsers
 * @apiGroup Users
 *
 * @apiDescription 🧪 **BETA FEATURE**: Bulk user creation endpoint.
 * This API is experimental and may change without notice.
 *
 * @apiParam {Object[]} users Array of user objects
 * @apiParam {String} users.name User's full name
 * @apiParam {String} users.email User's email address
 * @apiParam {String} users.password User's password
 *
 * @apiSuccess {Object[]} created Array of created users
 * @apiSuccess {Object[]} errors Array of creation errors
 *
 * @apiExample {json} Request Example:
 * {
 *   "users": [
 *     {
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "password": "securePassword123"
 *     },
 *     {
 *       "name": "Jane Smith",
 *       "email": "jane@example.com",
 *       "password": "anotherPassword456"
 *     }
 *   ]
 * }
 */
```

## 📊 Version Comparison

### Side-by-Side Comparison
APIDoc automatically generates comparison views between versions:

```javascript
/**
 * @api {get} /products Search Products
 * @apiVersion 1.0.0
 * @apiName SearchProducts
 * @apiGroup Products
 *
 * @apiParam {String} [q] Search query
 * @apiParam {Number} [limit=10] Results per page
 *
 * @apiSuccess {Object[]} products Array of products
 * @apiSuccess {Number} products.id Product ID
 * @apiSuccess {String} products.name Product name
 * @apiSuccess {Number} products.price Product price
 */

/**
 * @api {get} /products Search Products
 * @apiVersion 2.0.0
 * @apiName SearchProducts
 * @apiGroup Products
 *
 * @apiParam {String} [q] Search query
 * @apiParam {Number{1..100}} [limit=20] Results per page
 * @apiParam {String="name","price","created"} [sort=name] Sort field
 * @apiParam {String="asc","desc"} [order=asc] Sort order
 * @apiParam {String[]} [categories] Filter by categories
 *
 * @apiSuccess {Object[]} products Array of products
 * @apiSuccess {Number} products.id Product ID
 * @apiSuccess {String} products.name Product name
 * @apiSuccess {Number} products.price Product price
 * @apiSuccess {String[]} products.categories Product categories
 * @apiSuccess {Object} products.metadata Additional metadata
 * @apiSuccess {Number} total Total number of products
 * @apiSuccess {Object} pagination Pagination information
 */
```

## 🔄 Migration Guides

### Automated Migration Documentation
```javascript
/**
 * @apiDefine MigrationV1toV2
 * @apiVersion 2.0.0
 *
 * ## Migration Guide: v1.x to v2.0
 *
 * ### Breaking Changes
 * 1. **Authentication**: All endpoints now require Bearer tokens
 * 2. **Pagination**: Default limit changed from 10 to 20
 * 3. **Error Format**: Standardized error response structure
 *
 * ### New Features
 * - Advanced sorting and filtering
 * - Bulk operations support
 * - Improved metadata in responses
 *
 * ### Deprecated Endpoints
 * - `GET /users/profile` → Use `GET /users/:id`
 * - `POST /auth/login` → Use `POST /auth/token`
 */

/**
 * @api {get} /products Get Products
 * @apiVersion 2.0.0
 * @apiName GetProducts
 * @apiGroup Products
 * @apiUse MigrationV1toV2
 */
```

## 🎯 Version-Specific Templates

### Custom Version Templates
```json
{
  "template": {
    "versionTemplates": {
      "1.x": {
        "theme": "legacy",
        "banner": "⚠️ Legacy API - Please migrate to v2.0",
        "highlightColor": "#f39c12"
      },
      "2.x": {
        "theme": "modern",
        "banner": "✅ Current Stable Version",
        "highlightColor": "#27ae60"
      },
      "3.x-beta": {
        "theme": "beta",
        "banner": "🧪 Beta Version - Subject to Change",
        "highlightColor": "#9b59b6"
      }
    }
  }
}
```

## 📈 Version Analytics

### Usage Tracking
```javascript
/**
 * @api {get} /analytics/versions Version Usage Stats
 * @apiVersion 2.0.0
 * @apiName GetVersionStats
 * @apiGroup Analytics
 * @apiPermission admin
 *
 * @apiDescription Get API version usage statistics and adoption rates.
 *
 * @apiSuccess {Object[]} versions Array of version statistics
 * @apiSuccess {String} versions.version Version number
 * @apiSuccess {Number} versions.requests Total requests
 * @apiSuccess {Number} versions.activeUsers Active users
 * @apiSuccess {Number} versions.adoptionRate Adoption percentage
 * @apiSuccess {Date} versions.lastUsed Last usage timestamp
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *   "versions": [
 *     {
 *       "version": "2.0.0",
 *       "requests": 15420,
 *       "activeUsers": 89,
 *       "adoptionRate": 67.5,
 *       "lastUsed": "2024-01-15T14:30:00Z"
 *     },
 *     {
 *       "version": "1.5.0",
 *       "requests": 8932,
 *       "activeUsers": 43,
 *       "adoptionRate": 32.5,
 *       "lastUsed": "2024-01-15T12:15:00Z"
 *     }
 *   ]
 * }
 */
```

## 🛡️ Backward Compatibility

### Compatibility Matrix
```javascript
/**
 * @apiDefine CompatibilityMatrix
 *
 * ## API Compatibility Matrix
 *
 * | Version | Status | Support Until | Breaking Changes |
 * |---------|--------|---------------|------------------|
 * | 1.0.x   | 🔴 Deprecated | 2024-12-31 | None |
 * | 1.5.x   | 🟡 Maintenance | 2025-06-30 | Authentication |
 * | 2.0.x   | ✅ Stable | Active | Error format, Pagination |
 * | 2.1.x   | 🧪 Beta | TBD | None (additive only) |
 *
 * ### Migration Timeline
 * - **Phase 1** (Q1 2024): v2.0 stable release
 * - **Phase 2** (Q2 2024): v1.x deprecation notices
 * - **Phase 3** (Q4 2024): v1.x sunset
 */
```

### Version Routing
```javascript
/**
 * @api {get} /v1/users Get Users (Legacy)
 * @apiVersion 1.0.0
 * @apiName GetUsersLegacy
 * @apiGroup Users
 *
 * @apiDescription 🔴 **LEGACY ENDPOINT**: This endpoint is deprecated.
 * Please use /v2/users for new integrations.
 *
 * @apiHeader {String} X-API-Version=1.0 API version header
 */

/**
 * @api {get} /v2/users Get Users (Current)
 * @apiVersion 2.0.0
 * @apiName GetUsersCurrent
 * @apiGroup Users
 *
 * @apiDescription ✅ **CURRENT ENDPOINT**: Recommended for all new integrations.
 *
 * @apiHeader {String} X-API-Version=2.0 API version header
 */
```

## 📋 Best Practices

### 1. Semantic Versioning
- ✅ Use semantic versioning (MAJOR.MINOR.PATCH)
- ✅ Major version for breaking changes
- ✅ Minor version for new features
- ✅ Patch version for bug fixes

### 2. Documentation Strategy
- ✅ Document all breaking changes clearly
- ✅ Provide migration guides
- ✅ Use consistent naming conventions
- ✅ Include deprecation timelines

### 3. Version Management
- ✅ Maintain at most 3 active versions
- ✅ Provide clear sunset dates
- ✅ Monitor version adoption rates
- ✅ Communicate changes early

### 4. Backward Compatibility
- ✅ Support previous version for reasonable time
- ✅ Use feature flags for gradual rollouts
- ✅ Provide version-specific error messages
- ✅ Maintain comprehensive test coverage

APIDoc's versioning system enables professional API evolution while maintaining excellent developer experience and clear documentation throughout the API lifecycle.