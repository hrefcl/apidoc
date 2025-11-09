# Versionado de API Multi-Versión

## Índice
- [Introducción](#introducción)
- [Características](#características)
- [Configuración](#configuración)
- [Uso Básico](#uso-básico)
- [Comparación de Versiones](#comparación-de-versiones)
- [Ejemplos Completos](#ejemplos-completos)
- [Combinar con i18n](#combinar-con-i18n)
- [Mejores Prácticas](#mejores-prácticas)
- [Troubleshooting](#troubleshooting)

---

## Introducción

APIDoc v5.0.7 introduce soporte completo para **documentación API multi-versión side-by-side**, permitiendo mostrar múltiples versiones de un endpoint simultáneamente con comparación visual de cambios.

### ¿Por qué Multi-Versión?

- **Documentación Evolutiva**: Muestra cómo ha evolucionado tu API
- **Comparación Visual**: Ve qué cambió entre v1.0.0 y v2.0.0
- **Deprecation Path**: Ayuda a los usuarios a migrar de versiones antiguas
- **Compatibilidad**: Documenta múltiples versiones en producción simultánea

---

## Características

### ✅ Lo que está Incluido

1. **Tag `@apiVersion`**: Define la versión de cada endpoint
2. **Selector de Versión**: Dropdown para cambiar entre versiones
3. **Comparación Side-by-Side**: Muestra versiones lado a lado
4. **Diff Visual**: Resalta cambios entre versiones:
   - 🟢 **Añadido**: Nuevos parámetros/campos
   - 🔴 **Eliminado**: Parámetros removidos
   - 🟡 **Modificado**: Cambios en tipo, descripción, valores
5. **Badge "Latest"**: Marca automáticamente la versión más reciente
6. **Herencia de Versiones**: Versiones heredan de versiones anteriores

---

## Configuración

### 1. Habilitar en `apidoc.json`

No requiere configuración especial - el sistema detecta automáticamente cuando usas `@apiVersion`:

```json
{
  "name": "Mi API",
  "version": "2.0.0",
  "description": "API con versionado multi-versión"
}
```

### 2. Semantic Versioning

Usa [Semantic Versioning](https://semver.org/) para tus versiones:

- **MAJOR** (`1.0.0` → `2.0.0`): Cambios incompatibles
- **MINOR** (`1.0.0` → `1.1.0`): Nuevas funcionalidades compatibles
- **PATCH** (`1.0.0` → `1.0.1`): Correcciones de bugs

```javascript
/**
 * @apiVersion 1.0.0
 * @apiVersion 1.1.0
 * @apiVersion 2.0.0
 */
```

---

## Uso Básico

### Tag `@apiVersion`

Agrega `@apiVersion` después de `@api` para definir la versión:

```javascript
/**
 * @api {get} /users Get Users
 * @apiVersion 1.0.0
 * @apiGroup Users
 */
```

### Ejemplo Simple: 2 Versiones del Mismo Endpoint

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

### Resultado en el Template

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

## Comparación de Versiones

### Activar Modo Comparación

Click en "Compare with:" y selecciona una versión anterior:

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

### Indicadores de Cambios

El sistema marca automáticamente los cambios:

- **🟢 ADDED** (Verde): Campo nuevo en la versión más reciente
- **🔴 REMOVED** (Rojo): Campo eliminado en la versión más reciente
- **🟡 MODIFIED** (Amarillo): Campo modificado (tipo, descripción, etc.)
- **⚪ UNCHANGED** (Sin marca): Campo sin cambios

---

## Ejemplos Completos

### Ejemplo 1: Evolución de API con 3 Versiones

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

**Comparación de cambios**:
- **v1.0.0 → v1.5.0**:
  - 🟢 `remember` (Boolean) - NEW parameter
  - 🟢 `expiresAt` (Date) - NEW success field

- **v1.5.0 → v2.0.0**:
  - 🟢 `twoFactorCode` (String) - NEW parameter
  - 🟢 `user.email` (String) - NEW success field
  - 🟢 `user.twoFactorEnabled` (Boolean) - NEW success field

### Ejemplo 2: Breaking Changes

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

**Cambios visualizados**:
- **🔴 REMOVED**: `title` (String) - Removed in v2.0.0
- **🟢 ADDED**: `name` (String) - Added in v2.0.0
- **🟡 MODIFIED**: `id` changed from Number to String
- **🟡 MODIFIED**: `category` changed from String to Object

---

## Combinar con i18n

Puedes combinar versionado con multi-idioma para máxima flexibilidad:

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

**Resultado**: 4 variaciones
- EN v1.0.0
- ES v1.0.0
- EN v2.0.0
- ES v2.0.0

---

## Mejores Prácticas

### 1. Usa Semantic Versioning

✅ **Bien**:
```
1.0.0 → 1.1.0 (minor feature)
1.1.0 → 1.1.1 (bugfix)
1.1.1 → 2.0.0 (breaking change)
```

❌ **Mal**:
```
v1 → v2 → v3 (no semver)
```

### 2. Documenta Breaking Changes

```javascript
/**
 * @apiVersion 2.0.0
 * @apiDescription BREAKING: Field "username" renamed to "email"
 */
```

### 3. Mantén Versiones Anteriores

No elimines la documentación de versiones anteriores hasta que ya no estén en producción:

```javascript
// ❌ NO hagas esto
// Eliminaste v1.0.0 pero aún está en producción

// ✅ Mantén ambas versiones
/**
 * @apiVersion 1.0.0
 * @apiDeprecated Use version 2.0.0 instead
 */

/**
 * @apiVersion 2.0.0
 * @apiDescription New implementation
 */
```

### 4. Usa `@apiDeprecated`

Marca versiones antiguas como deprecated:

```javascript
/**
 * @api {get} /legacy-endpoint Old Endpoint
 * @apiVersion 1.0.0
 * @apiDeprecated use version 2.0.0 with /new-endpoint instead
 */
```

### 5. Documenta Migration Path

Ayuda a los usuarios a migrar:

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

### Problema: El selector de versión no aparece

**Causa**: Solo hay una versión del endpoint
- **Solución**: Agrega al menos 2 versiones con `@apiVersion`

```javascript
// ❌ Solo v1.0.0 - no aparece selector
/**
 * @apiVersion 1.0.0
 * @api {get} /users Get Users
 */

// ✅ Múltiples versiones - aparece selector
/**
 * @apiVersion 1.0.0
 * @api {get} /users Get Users
 */

/**
 * @apiVersion 2.0.0
 * @api {get} /users Get Users
 */
```

### Problema: La versión "Latest" no es la correcta

**Causa**: Las versiones no están ordenadas semánticamente

```javascript
// ❌ Mal - versiones no ordenadas
@apiVersion 2.0.0
@apiVersion 1.5.0
@apiVersion 1.0.0

// ✅ Bien - usa semver correctamente
@apiVersion 1.0.0
@apiVersion 1.5.0
@apiVersion 2.0.0
```

### Problema: Los cambios no se detectan en la comparación

**Causa**: Los nombres de parámetros no coinciden exactamente

```javascript
// ❌ v1 tiene "user_name", v2 tiene "userName"
// Sistema no puede detectar que son el mismo campo

// ✅ Mantén nombres consistentes o documenta el rename
/**
 * @apiVersion 2.0.0
 * @apiDescription RENAMED: "user_name" → "userName"
 */
```

---

## Recursos Adicionales

- [Configuración General](./01-configuration.md)
- [i18n de Contenido API](./19-i18n-api-content.md)
- [Referencia de Parámetros @api](./05-apidoc-params.md)
- [Ejemplos de Código](./06-examples.md)

---

## Resumen

- ✅ Usa `@apiVersion` con Semantic Versioning
- ✅ Documenta múltiples versiones del mismo endpoint
- ✅ El selector de versión aparece automáticamente con 2+ versiones
- ✅ Usa comparación side-by-side para ver cambios
- ✅ Marca versiones obsoletas con `@apiDeprecated`
- ✅ Combina con `@apiLang` para máxima flexibilidad

**¡Ya estás listo para documentar APIs multi-versión con APIDoc v5.0.7!**
