# Multi-Version API Documentation

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Version Comparison](#version-comparison)
- [Complete Examples](#complete-examples)
- [Combine with i18n](#combine-with-i18n)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Introduction

APIDoc v5.0.7 introduces complete support for **side-by-side multi-version API documentation**, allowing you to display multiple versions of an endpoint simultaneously with visual change comparison.

### Why Multi-Version?

- **Evolutionary Documentation**: Show how your API has evolved
- **Visual Comparison**: See what changed between v1.0.0 and v2.0.0
- **Deprecation Path**: Help users migrate from old versions
- **Compatibility**: Document multiple versions in production simultaneously

---

## Features

### ✅ What's Included

1. **`@apiVersion` Tag**: Define the version of each endpoint
2. **Version Selector**: Dropdown to switch between versions
3. **Side-by-Side Comparison**: Display versions side by side
4. **Visual Diff**: Highlight changes between versions:
   - 🟢 **Added**: New parameters/fields
   - 🔴 **Removed**: Removed parameters
   - 🟡 **Modified**: Changes in type, description, values
5. **"Latest" Badge**: Automatically marks the most recent version
6. **Version Inheritance**: Versions inherit from previous versions

---

## Configuration

### 1. Enable in `apidoc.json`

No special configuration required - the system automatically detects when you use `@apiVersion`:

```json
{
  "name": "My API",
  "version": "2.0.0",
  "description": "API with multi-version support"
}
```

### 2. Semantic Versioning

Use [Semantic Versioning](https://semver.org/) for your versions:

- **MAJOR** (`1.0.0` → `2.0.0`): Incompatible changes
- **MINOR** (`1.0.0` → `1.1.0`): New backwards-compatible features
- **PATCH** (`1.0.0` → `1.0.1`): Bug fixes

```javascript
/**
 * @apiVersion 1.0.0
 * @apiVersion 1.1.0
 * @apiVersion 2.0.0
 */
```

---

## Basic Usage

### `@apiVersion` Tag

Add `@apiVersion` after `@api` to define the version:

```javascript
/**
 * @api {get} /users Get Users
 * @apiVersion 1.0.0
 * @apiGroup Users
 */
```

### Simple Example: 2 Versions of Same Endpoint

```javascript
// routes/users.js

/**
 * @api {get} /users/:id Get User
 * @apiVersion 1.0.0
 * @apiGroup Users
 * @apiDescription Retrieves user information
 *
 * @apiParam {Number} id User's ID
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 */

/**
 * @api {get} /users/:id Get User
 * @apiVersion 2.0.0
 * @apiGroup Users
 * @apiDescription Retrieves user information with extended profile
 *
 * @apiParam {Number} id User's ID
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 * @apiSuccess {Object} profile User's extended profile (NEW)
 * @apiSuccess {String} profile.avatar Avatar URL
 * @apiSuccess {String} profile.bio User biography
 */
router.get('/users/:id', getUser);
```

### Result in Template

```
┌─────────────────────────────────────────────┐
│  GET /users/:id                             │
│                                             │
│  [Version: v2.0.0 ▼] [Compare with v1.0.0] │
│  ┌──────────────────────────────────────┐  │
│  │ v1.0.0                               │  │
│  │ v2.0.0 (Latest)                      │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  📋 Parameters:                             │
│  • id (Number) - User's ID                  │
│                                             │
│  ✅ Success Response:                       │
│  • id (Number) - User ID                    │
│  • name (String) - User's name              │
│  • email (String) - User's email            │
│  • profile (Object) - Extended profile 🟢   │  ← NEW
│    • avatar (String) - Avatar URL           │
│    • bio (String) - User biography          │
└─────────────────────────────────────────────┘
```

---

## Version Comparison

### Activate Comparison Mode

Click "Compare with:" and select a previous version:

```
┌─────────────────────────────────────────────────────┐
│  GET /users/:id                                     │
│                                                     │
│  [v2.0.0 ▼]  vs  [v1.0.0 ▼]                        │
│                                                     │
│  ┌──────────────────────┬──────────────────────┐   │
│  │ v1.0.0               │ v2.0.0 (Latest)      │   │
│  ├──────────────────────┼──────────────────────┤   │
│  │ Parameters:          │ Parameters:          │   │
│  │ • id (Number)        │ • id (Number)        │   │
│  ├──────────────────────┼──────────────────────┤   │
│  │ Success:             │ Success:             │   │
│  │ • id (Number)        │ • id (Number)        │   │
│  │ • name (String)      │ • name (String)      │   │
│  │ • email (String)     │ • email (String)     │   │
│  │                      │ • profile (Object) 🟢│   │  ← ADDED
│  └──────────────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Change Indicators

The system automatically marks changes:

- **🟢 ADDED** (Green): New field in most recent version
- **🔴 REMOVED** (Red): Field removed in most recent version
- **🟡 MODIFIED** (Yellow): Field modified (type, description, etc.)
- **⚪ UNCHANGED** (No mark): Field unchanged

---

## Complete Examples

### Example 1: API Evolution with 3 Versions

```javascript
/**
 * @api {post} /auth/login User Login
 * @apiVersion 1.0.0
 * @apiGroup Authentication
 * @apiDescription Basic email/password authentication
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 * @apiSuccess {String} token JWT token
 * @apiSuccess {Object} user User object
 * @apiSuccess {Number} user.id User ID
 * @apiSuccess {String} user.name User name
 */

/**
 * @api {post} /auth/login User Login
 * @apiVersion 1.5.0
 * @apiGroup Authentication
 * @apiDescription Authentication with optional "remember me"
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 * @apiParam {Boolean} [remember=false] Remember user session
 *
 * @apiSuccess {String} token JWT token
 * @apiSuccess {Object} user User object
 * @apiSuccess {Number} user.id User ID
 * @apiSuccess {String} user.name User name
 * @apiSuccess {Date} expiresAt Token expiration date
 */

/**
 * @api {post} /auth/login User Login
 * @apiVersion 2.0.0
 * @apiGroup Authentication
 * @apiDescription Authentication with 2FA support
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 * @apiParam {Boolean} [remember=false] Remember user session
 * @apiParam {String} [twoFactorCode] 2FA code if enabled
 *
 * @apiSuccess {String} token JWT token
 * @apiSuccess {Object} user User object
 * @apiSuccess {Number} user.id User ID
 * @apiSuccess {String} user.name User name
 * @apiSuccess {String} user.email User email
 * @apiSuccess {Boolean} user.twoFactorEnabled Whether 2FA is enabled
 * @apiSuccess {Date} expiresAt Token expiration date
 */
router.post('/auth/login', login);
```

**Change comparison**:
- **v1.0.0 → v1.5.0**:
  - 🟢 `remember` (Boolean) - NEW parameter
  - 🟢 `expiresAt` (Date) - NEW success field

- **v1.5.0 → v2.0.0**:
  - 🟢 `twoFactorCode` (String) - NEW parameter
  - 🟢 `user.email` (String) - NEW success field
  - 🟢 `user.twoFactorEnabled` (Boolean) - NEW success field

### Example 2: Breaking Changes

```javascript
/**
 * @api {get} /products/:id Get Product
 * @apiVersion 1.0.0
 * @apiGroup Products
 *
 * @apiParam {Number} id Product ID
 *
 * @apiSuccess {Number} id Product ID
 * @apiSuccess {String} title Product title
 * @apiSuccess {Number} price Product price
 * @apiSuccess {String} category Product category
 */

/**
 * @api {get} /products/:id Get Product
 * @apiVersion 2.0.0
 * @apiGroup Products
 * @apiDescription BREAKING: "title" renamed to "name", category is now object
 *
 * @apiParam {String} id Product ID (now string UUID)
 *
 * @apiSuccess {String} id Product UUID
 * @apiSuccess {String} name Product name (was "title")
 * @apiSuccess {Number} price Product price
 * @apiSuccess {Object} category Product category object
 * @apiSuccess {Number} category.id Category ID
 * @apiSuccess {String} category.name Category name
 */
router.get('/products/:id', getProduct);
```

**Visualized changes**:
- **🔴 REMOVED**: `title` (String) - Removed in v2.0.0
- **🟢 ADDED**: `name` (String) - Added in v2.0.0
- **🟡 MODIFIED**: `id` changed from Number to String
- **🟡 MODIFIED**: `category` changed from String to Object

---

## Combine with i18n

You can combine versioning with multi-language for maximum flexibility:

```javascript
/**
 * @apiLang en
 * @api {post} /orders Create Order
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiDescription Creates a new order
 */

/**
 * @apiLang es
 * @api {post} /orders Crear Orden
 * @apiVersion 1.0.0
 * @apiGroup Orders
 * @apiDescription Crea una nueva orden
 */

/**
 * @apiLang en
 * @api {post} /orders Create Order
 * @apiVersion 2.0.0
 * @apiGroup Orders
 * @apiDescription Creates a new order with shipping address
 */

/**
 * @apiLang es
 * @api {post} /orders Crear Orden
 * @apiVersion 2.0.0
 * @apiGroup Orders
 * @apiDescription Crea una nueva orden con dirección de envío
 */
```

**Result**: 4 variations
- EN v1.0.0
- ES v1.0.0
- EN v2.0.0
- ES v2.0.0

---

## Best Practices

### 1. Use Semantic Versioning

✅ **Good**:
```
1.0.0 → 1.1.0 (minor feature)
1.1.0 → 1.1.1 (bugfix)
1.1.1 → 2.0.0 (breaking change)
```

❌ **Bad**:
```
v1 → v2 → v3 (no semver)
```

### 2. Document Breaking Changes

```javascript
/**
 * @apiVersion 2.0.0
 * @apiDescription BREAKING: Field "username" renamed to "email"
 */
```

### 3. Keep Previous Versions

Don't delete documentation for previous versions until they're no longer in production:

```javascript
// ❌ DON'T do this
// Deleted v1.0.0 but it's still in production

// ✅ Keep both versions
/**
 * @apiVersion 1.0.0
 * @apiDeprecated Use version 2.0.0 instead
 */

/**
 * @apiVersion 2.0.0
 * @apiDescription New implementation
 */
```

### 4. Use `@apiDeprecated`

Mark old versions as deprecated:

```javascript
/**
 * @api {get} /legacy-endpoint Old Endpoint
 * @apiVersion 1.0.0
 * @apiDeprecated use version 2.0.0 with /new-endpoint instead
 */
```

### 5. Document Migration Path

Help users migrate:

```javascript
/**
 * @apiVersion 2.0.0
 * @apiDescription Migration from v1.0.0:
 * - "username" → "email"
 * - "fullName" → "name"
 * - New required field: "country"
 */
```

---

## Troubleshooting

### Problem: Version selector doesn't appear

**Cause**: Only one version of the endpoint exists
- **Solution**: Add at least 2 versions with `@apiVersion`

```javascript
// ❌ Only v1.0.0 - no selector appears
/**
 * @apiVersion 1.0.0
 * @api {get} /users Get Users
 */

// ✅ Multiple versions - selector appears
/**
 * @apiVersion 1.0.0
 * @api {get} /users Get Users
 */

/**
 * @apiVersion 2.0.0
 * @api {get} /users Get Users
 */
```

### Problem: "Latest" version is incorrect

**Cause**: Versions are not semantically ordered

```javascript
// ❌ Bad - versions not ordered
@apiVersion 2.0.0
@apiVersion 1.5.0
@apiVersion 1.0.0

// ✅ Good - use semver correctly
@apiVersion 1.0.0
@apiVersion 1.5.0
@apiVersion 2.0.0
```

### Problem: Changes not detected in comparison

**Cause**: Parameter names don't match exactly

```javascript
// ❌ v1 has "user_name", v2 has "userName"
// System can't detect they're the same field

// ✅ Keep names consistent or document the rename
/**
 * @apiVersion 2.0.0
 * @apiDescription RENAMED: "user_name" → "userName"
 */
```

---

## Additional Resources

- [General Configuration](./01-configuration.md)
- [API Content i18n](./19-i18n-api-content.md)
- [@api Parameters Reference](./05-apidoc-params.md)
- [Code Examples](./06-examples.md)

---

## Summary

- ✅ Use `@apiVersion` with Semantic Versioning
- ✅ Document multiple versions of the same endpoint
- ✅ Version selector appears automatically with 2+ versions
- ✅ Use side-by-side comparison to see changes
- ✅ Mark obsolete versions with `@apiDeprecated`
- ✅ Combine with `@apiLang` for maximum flexibility

**You're now ready to document multi-version APIs with APIDoc v5.0.7!**
