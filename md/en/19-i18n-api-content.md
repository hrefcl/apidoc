# API Content Internationalization (i18n)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Complete Examples](#complete-examples)
- [Language Selector](#language-selector)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Introduction

APIDoc v5.0.7 introduces complete support for **multi-language API documentation**, allowing you to document the same endpoint with different content in multiple languages. This is ideal for APIs that need documentation in various languages for different audiences.

### Why API Content i18n?

- **Global Audience**: Document your API in each developer's native language
- **Same Endpoint, Multiple Languages**: One `/users` endpoint, documentation in Spanish, English, Chinese, etc.
- **Automatic Selector**: UI with automatic language selector
- **Consistency**: Keep versions synchronized across different languages

---

## Features

### ✅ What's Included

1. **`@apiLang` Tag**: Define the language for each API documentation block
2. **Automatic Detection**: System automatically detects which languages are available
3. **Language Selector in UI**: Automatic button in template to switch between languages
4. **URL Preservation**: Same endpoint displays different content based on selected language
5. **Complete Coverage**: All `@api*` tags support multi-language

### ⚠️ Important: Don't Confuse with UI i18n

**API Content i18n** (this document):
- Documents your **API content** in multiple languages
- Uses `@apiLang` tag in your source code
- Changes API titles, descriptions, parameters

**UI i18n** (template translation system):
- Translates the **template interface** (buttons, labels, messages)
- Configured in `apidoc.json` with `i18n.defaultLang`
- Changes texts like "Parameters", "Response", "Headers"

**Both systems work together** but are independent.

---

## Configuration

### 1. Configure `apidoc.json`

Add the `i18n` section to enable the system:

```json
{
  "name": "My API",
  "version": "1.0.0",
  "description": "API with multi-language support",
  "i18n": {
    "enabled": true,
    "defaultLang": "en",
    "availableLangs": ["en", "es", "zh", "fr", "de", "ja", "pt"],
    "showLanguageSelector": true,
    "fallbackToDefault": true
  }
}
```

### 2. Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enables i18n system for API content |
| `defaultLang` | `string` | `"en"` | Default language for API documentation |
| `availableLangs` | `string[]` | `["en"]` | List of available languages (ISO 639-1) |
| `showLanguageSelector` | `boolean` | `true` | Shows language selector in template |
| `fallbackToDefault` | `boolean` | `true` | If language has no translation, use default |

### 3. Supported Language Codes

| Code | Language | Example |
|------|----------|---------|
| `en` | English | `@apiLang en` |
| `es` | Español | `@apiLang es` |
| `zh` | 中文 (Chinese) | `@apiLang zh` |
| `fr` | Français | `@apiLang fr` |
| `de` | Deutsch | `@apiLang de` |
| `ja` | 日本語 | `@apiLang ja` |
| `pt` | Português | `@apiLang pt` |
| `it` | Italiano | `@apiLang it` |
| `ru` | Русский | `@apiLang ru` |
| `ko` | 한국어 | `@apiLang ko` |

---

## Basic Usage

### `@apiLang` Tag Structure

The `@apiLang` tag must be the **first tag** in your API documentation block:

```javascript
/**
 * @apiLang en
 * @api {post} /users Create User
 * @apiDescription Creates a new user in the system
 */
```

### Simple Example: Endpoint in 2 Languages

```javascript
// routes/users.js

/**
 * @apiLang en
 * @api {post} /users Create User
 * @apiGroup Users
 * @apiDescription Creates a new user in the system
 *
 * @apiParam {String} name User's full name
 * @apiParam {String} email User's email address
 * @apiParam {Number} age User's age (must be 18+)
 *
 * @apiSuccess {Number} id User's unique ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email User's email
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 */

/**
 * @apiLang es
 * @api {post} /users Crear Usuario
 * @apiGroup Users
 * @apiDescription Crea un nuevo usuario en el sistema
 *
 * @apiParam {String} name Nombre completo del usuario
 * @apiParam {String} email Dirección de correo electrónico
 * @apiParam {Number} age Edad del usuario (debe ser mayor de 18)
 *
 * @apiSuccess {Number} id ID único del usuario
 * @apiSuccess {String} name Nombre del usuario
 * @apiSuccess {String} email Correo del usuario
 *
 * @apiSuccessExample {json} Respuesta Exitosa:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "Juan Pérez",
 *   "email": "juan@ejemplo.com"
 * }
 */
router.post('/users', createUser);
```

### Result in Template

When documentation is generated:

1. **Language Selector Appears**: Button with "EN | ES" in navigation bar
2. **Click "ES"**: All endpoint content changes to Spanish
3. **Click "EN"**: Everything returns to English
4. **URL Preserved**: Both languages document `POST /users`

---

## Complete Examples

### Example 1: Endpoint with 3 Languages

```javascript
/**
 * @apiLang en
 * @api {get} /products/:id Get Product
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Retrieves detailed information about a specific product
 *
 * @apiParam {Number} id Product's unique identifier
 *
 * @apiSuccess {Number} id Product ID
 * @apiSuccess {String} name Product name
 * @apiSuccess {Number} price Product price in USD
 * @apiSuccess {String} category Product category
 *
 * @apiError {String} error Error message
 * @apiError {Number} code Error code
 *
 * @apiErrorExample {json} Product Not Found:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Product not found",
 *   "code": 404
 * }
 */

/**
 * @apiLang es
 * @api {get} /products/:id Obtener Producto
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription Obtiene información detallada de un producto específico
 *
 * @apiParam {Number} id Identificador único del producto
 *
 * @apiSuccess {Number} id ID del producto
 * @apiSuccess {String} name Nombre del producto
 * @apiSuccess {Number} price Precio del producto en USD
 * @apiSuccess {String} category Categoría del producto
 *
 * @apiError {String} error Mensaje de error
 * @apiError {Number} code Código de error
 *
 * @apiErrorExample {json} Producto No Encontrado:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Producto no encontrado",
 *   "code": 404
 * }
 */

/**
 * @apiLang zh
 * @api {get} /products/:id 获取产品
 * @apiGroup Products
 * @apiVersion 1.0.0
 * @apiDescription 检索特定产品的详细信息
 *
 * @apiParam {Number} id 产品唯一标识符
 *
 * @apiSuccess {Number} id 产品ID
 * @apiSuccess {String} name 产品名称
 * @apiSuccess {Number} price 产品价格（美元）
 * @apiSuccess {String} category 产品类别
 *
 * @apiError {String} error 错误消息
 * @apiError {Number} code 错误代码
 *
 * @apiErrorExample {json} 产品未找到:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "产品未找到",
 *   "code": 404
 * }
 */
router.get('/products/:id', getProduct);
```

### Example 2: Combine i18n with Versioning

```javascript
/**
 * @apiLang en
 * @api {post} /auth/login User Login
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiDescription Authenticates a user with email and password
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 * @apiSuccess {String} token JWT token
 * @apiSuccess {Object} user User object
 */

/**
 * @apiLang es
 * @api {post} /auth/login Inicio de Sesión
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiDescription Autentica un usuario con email y contraseña
 *
 * @apiParam {String} email Correo del usuario
 * @apiParam {String} password Contraseña del usuario
 *
 * @apiSuccess {String} token Token JWT
 * @apiSuccess {Object} user Objeto de usuario
 */

/**
 * @apiLang en
 * @api {post} /auth/login User Login
 * @apiGroup Authentication
 * @apiVersion 2.0.0
 * @apiDescription Authenticates a user with email and password. Now supports 2FA!
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 * @apiParam {String} [twoFactorCode] Two-factor authentication code
 *
 * @apiSuccess {String} token JWT token
 * @apiSuccess {Object} user User object
 * @apiSuccess {Boolean} twoFactorEnabled Whether 2FA is enabled
 */

/**
 * @apiLang es
 * @api {post} /auth/login Inicio de Sesión
 * @apiGroup Authentication
 * @apiVersion 2.0.0
 * @apiDescription Autentica un usuario con email y contraseña. ¡Ahora soporta 2FA!
 *
 * @apiParam {String} email Correo del usuario
 * @apiParam {String} password Contraseña del usuario
 * @apiParam {String} [twoFactorCode] Código de autenticación de dos factores
 *
 * @apiSuccess {String} token Token JWT
 * @apiSuccess {Object} user Objeto de usuario
 * @apiSuccess {Boolean} twoFactorEnabled Si 2FA está habilitado
 */
router.post('/auth/login', login);
```

**Result**: Now you have:
- **2 languages**: English and Spanish
- **2 versions**: v1.0.0 and v2.0.0
- **Total**: 4 variations of the same endpoint (EN v1, ES v1, EN v2, ES v2)

---

## Language Selector

### How the Selector Works

1. **Automatic Detection**: APIDoc detects languages using `@apiLang`
2. **Metadata Generation**: Creates `meta.i18n.availableLangs` in JSON
3. **Vue Component**: `ApiLanguageSelector.vue` reads available languages
4. **Language Switch**: Click changes global language in Pinia store

### Selector Appearance

```
┌─────────────────────────────────────────┐
│  [🌍 EN ▼]   Documentation              │
│  ┌──────────────┐                       │
│  │ 🇺🇸 English  │                       │
│  │ 🇪🇸 Español  │                       │
│  │ 🇨🇳 中文      │                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```

### Customize the Selector

The selector respects your available languages configuration:

```json
{
  "i18n": {
    "availableLangs": ["en", "es"],  // Only shows EN and ES
    "showLanguageSelector": true
  }
}
```

If you only have 1 language, the selector hides automatically.

---

## Best Practices

### 1. Maintain Consistency Between Languages

❌ **Bad**:
```javascript
// English has 3 parameters
/**
 * @apiLang en
 * @apiParam {String} name
 * @apiParam {String} email
 * @apiParam {Number} age
 */

// Spanish only has 2 parameters - INCONSISTENT
/**
 * @apiLang es
 * @apiParam {String} name
 * @apiParam {String} email
 */
```

✅ **Good**:
```javascript
// Both languages have the same parameters
/**
 * @apiLang en
 * @apiParam {String} name User's name
 * @apiParam {String} email User's email
 * @apiParam {Number} age User's age
 */

/**
 * @apiLang es
 * @apiParam {String} name Nombre del usuario
 * @apiParam {String} email Correo del usuario
 * @apiParam {Number} age Edad del usuario
 */
```

### 2. Use `fallbackToDefault: true`

If you forget to translate an endpoint, the system will show the version in the default language:

```json
{
  "i18n": {
    "defaultLang": "en",
    "fallbackToDefault": true  // Important!
  }
}
```

### 3. Organize by Files

Separate languages into different files for better maintainability:

```
src/
├── routes/
│   ├── users.js              # Implementation
│   └── docs/
│       ├── users.en.js       # English documentation
│       ├── users.es.js       # Spanish documentation
│       └── users.zh.js       # Chinese documentation
```

### 4. Document All Tags

Don't forget to translate:
- `@apiDescription`
- `@apiParam` (names and descriptions)
- `@apiSuccess` (names and descriptions)
- `@apiError` (error messages)
- `@apiExample` (example titles)

### 5. Review with Native Speakers

Use native speakers or professional translation tools for quality.

---

## Troubleshooting

### Problem: Language selector doesn't appear

**Cause 1**: Only one language is available
- **Solution**: Add documentation in at least 2 languages

**Cause 2**: `showLanguageSelector` is disabled
```json
{
  "i18n": {
    "showLanguageSelector": true  // Must be true
  }
}
```

**Cause 3**: Not using `@apiLang`
- **Solution**: Add `@apiLang` as first tag in each block

### Problem: Language doesn't change on click

**Cause**: Pinia store is not synchronized
- **Solution**: Verify that `ApiLanguageSelector.vue` is correctly imported
- **Debug**: Open browser console and look for errors

### Problem: Some endpoints don't translate

**Cause**: Missing `@apiLang` tag in those endpoints
- **Solution**: Make sure ALL blocks have `@apiLang`

```javascript
// ❌ This endpoint won't translate
/**
 * @api {get} /test Test Endpoint
 */

// ✅ This will translate
/**
 * @apiLang en
 * @api {get} /test Test Endpoint
 */
```

### Problem: Template shows English text even though I select Spanish

**Common confusion**: There are 2 different i18n systems

1. **API Content i18n** (configured with `@apiLang`):
   - Translates your API content
   - Endpoint titles, descriptions, parameters

2. **UI i18n** (configured in `apidoc.json`):
   - Translates template interface
   - Buttons, labels, template messages

**Solution**: Configure both systems:

```json
{
  "template": {
    "language": "es"  // UI in Spanish
  },
  "i18n": {
    "enabled": true,
    "defaultLang": "es",  // API content in Spanish by default
    "availableLangs": ["en", "es", "zh"]
  }
}
```

---

## Additional Resources

- [General Configuration](./01-configuration.md)
- [API Versioning](./07-versioning.md)
- [Code Examples](./06-examples.md)
- [@api Parameters Reference](./05-apidoc-params.md)

---

## Summary

- ✅ Use `@apiLang` as first tag in each documentation block
- ✅ Configure `i18n.enabled: true` in `apidoc.json`
- ✅ List all languages in `availableLangs`
- ✅ Maintain consistency between translations
- ✅ Enable `fallbackToDefault: true` for safety
- ✅ Language selector appears automatically when there are 2+ languages

**You're now ready to create multi-language API documentation with APIDoc v5.0.7!**
