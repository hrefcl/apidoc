# Internacionalización de Contenido API (i18n)

## Índice
- [Introducción](#introducción)
- [Características](#características)
- [Configuración](#configuración)
- [Uso Básico](#uso-básico)
- [Ejemplos Completos](#ejemplos-completos)
- [Selector de Idioma](#selector-de-idioma)
- [Mejores Prácticas](#mejores-prácticas)
- [Troubleshooting](#troubleshooting)

---

## Introducción

APIDoc v5.0.7 introduce soporte completo para **documentación API multi-idioma**, permitiendo documentar el mismo endpoint con contenido diferente en múltiples idiomas. Esto es ideal para APIs que necesitan documentación en varios idiomas para diferentes audiencias.

### ¿Por qué i18n de Contenido API?

- **Audiencia Global**: Documenta tu API en el idioma nativo de cada desarrollador
- **Mismo Endpoint, Múltiples Idiomas**: Un endpoint `/users`, documentación en español, inglés, chino, etc.
- **Selector Automático**: UI con selector de idioma automático
- **Consistencia**: Mantén sincronizadas las versiones en diferentes idiomas

---

## Características

### ✅ Lo que está Incluido

1. **Tag `@apiLang`**: Define el idioma de cada bloque de documentación API
2. **Detección Automática**: El sistema detecta automáticamente qué idiomas están disponibles
3. **Selector de Idioma en UI**: Botón automático en el template para cambiar entre idiomas
4. **Preservación de URL**: El mismo endpoint muestra contenido diferente según el idioma seleccionado
5. **Cobertura Completa**: Todos los tags `@api*` soportan multi-idioma

### ⚠️ Importante: No Confundir con UI i18n

**API Content i18n** (este documento):
- Documenta el **contenido de tu API** en múltiples idiomas
- Usa el tag `@apiLang` en tu código fuente
- Cambia títulos, descripciones, parámetros de la API

**UI i18n** (sistema de traducción del template):
- Traduce la **interfaz del template** (botones, labels, mensajes)
- Se configura en `apidoc.json` con `i18n.defaultLang`
- Cambia textos como "Parameters", "Response", "Headers"

**Ambos sistemas funcionan juntos** pero son independientes.

---

## Configuración

### 1. Configurar `apidoc.json`

Agrega la sección `i18n` para habilitar el sistema:

```json
{
  "name": "Mi API",
  "version": "1.0.0",
  "description": "API con soporte multi-idioma",
  "i18n": {
    "enabled": true,
    "defaultLang": "en",
    "availableLangs": ["en", "es", "zh", "fr", "de", "ja", "pt"],
    "showLanguageSelector": true,
    "fallbackToDefault": true
  }
}
```

### 2. Opciones de Configuración

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Habilita el sistema i18n para contenido API |
| `defaultLang` | `string` | `"en"` | Idioma por defecto para la documentación API |
| `availableLangs` | `string[]` | `["en"]` | Lista de idiomas disponibles (ISO 639-1) |
| `showLanguageSelector` | `boolean` | `true` | Muestra el selector de idioma en el template |
| `fallbackToDefault` | `boolean` | `true` | Si un idioma no tiene traducción, usa el default |

### 3. Códigos de Idioma Soportados

| Código | Idioma | Ejemplo |
|--------|--------|---------|
| `en` | English | `@apiLang en` |
| `es` | Español | `@apiLang es` |
| `zh` | 中文 (Chino) | `@apiLang zh` |
| `fr` | Français | `@apiLang fr` |
| `de` | Deutsch | `@apiLang de` |
| `ja` | 日本語 | `@apiLang ja` |
| `pt` | Português | `@apiLang pt` |
| `it` | Italiano | `@apiLang it` |
| `ru` | Русский | `@apiLang ru` |
| `ko` | 한국어 | `@apiLang ko` |

---

## Uso Básico

### Estructura del Tag `@apiLang`

El tag `@apiLang` debe ser el **primer tag** en tu bloque de documentación API:

```javascript
/**
 * @apiLang en
 * @api {post} /users Create User
 * @apiDescription Creates a new user in the system
 */
```

### Ejemplo Simple: Endpoint en 2 Idiomas

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

### Resultado en el Template

Cuando se genera la documentación:

1. **Selector de Idioma Aparece**: Botón con "EN | ES" en la barra de navegación
2. **Click en "ES"**: Todo el contenido del endpoint cambia a español
3. **Click en "EN"**: Todo vuelve a inglés
4. **URL Preservada**: Ambos idiomas documentan `POST /users`

---

## Ejemplos Completos

### Ejemplo 1: Endpoint con 3 Idiomas

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

### Ejemplo 2: Combinar i18n con Versionado

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

**Resultado**: Ahora tienes:
- **2 idiomas**: Inglés y Español
- **2 versiones**: v1.0.0 y v2.0.0
- **Total**: 4 variaciones del mismo endpoint (EN v1, ES v1, EN v2, ES v2)

---

## Selector de Idioma

### Cómo Funciona el Selector

1. **Detección Automática**: APIDoc detecta los idiomas usando `@apiLang`
2. **Generación de Metadata**: Se crea `meta.i18n.availableLangs` en el JSON
3. **Componente Vue**: `ApiLanguageSelector.vue` lee los idiomas disponibles
4. **Cambio de Idioma**: Click cambia el idioma global en el store de Pinia

### Apariencia del Selector

```
┌─────────────────────────────────────────┐
│  [🌍 ES ▼]   Documentation              │
│  ┌──────────────┐                       │
│  │ 🇺🇸 English  │                       │
│  │ 🇪🇸 Español  │                       │
│  │ 🇨🇳 中文      │                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```

### Personalizar el Selector

El selector respeta tu configuración de idiomas disponibles:

```json
{
  "i18n": {
    "availableLangs": ["en", "es"],  // Solo muestra EN y ES
    "showLanguageSelector": true
  }
}
```

Si solo tienes 1 idioma, el selector se oculta automáticamente.

---

## Mejores Prácticas

### 1. Mantén Consistencia Entre Idiomas

❌ **Mal**:
```javascript
// Inglés tiene 3 parámetros
/**
 * @apiLang en
 * @apiParam {String} name
 * @apiParam {String} email
 * @apiParam {Number} age
 */

// Español solo tiene 2 parámetros - INCONSISTENTE
/**
 * @apiLang es
 * @apiParam {String} name
 * @apiParam {String} email
 */
```

✅ **Bien**:
```javascript
// Ambos idiomas tienen los mismos parámetros
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

### 2. Usa `fallbackToDefault: true`

Si olvidas traducir un endpoint, el sistema mostrará la versión en el idioma por defecto:

```json
{
  "i18n": {
    "defaultLang": "en",
    "fallbackToDefault": true  // Importante!
  }
}
```

### 3. Organiza por Archivos

Separa los idiomas en archivos diferentes para mejor mantenibilidad:

```
src/
├── routes/
│   ├── users.js              # Implementación
│   └── docs/
│       ├── users.en.js       # Documentación en inglés
│       ├── users.es.js       # Documentación en español
│       └── users.zh.js       # Documentación en chino
```

### 4. Documenta Todos los Tags

No olvides traducir:
- `@apiDescription`
- `@apiParam` (nombres y descripciones)
- `@apiSuccess` (nombres y descripciones)
- `@apiError` (mensajes de error)
- `@apiExample` (títulos de ejemplos)

### 5. Revisa con Hablantes Nativos

Usa hablantes nativos o herramientas profesionales de traducción para calidad.

---

## Troubleshooting

### Problema: El selector de idioma no aparece

**Causa 1**: Solo hay un idioma disponible
- **Solución**: Agrega documentación en al menos 2 idiomas

**Causa 2**: `showLanguageSelector` está deshabilitado
```json
{
  "i18n": {
    "showLanguageSelector": true  // Debe estar en true
  }
}
```

**Causa 3**: No estás usando `@apiLang`
- **Solución**: Agrega `@apiLang` como primer tag en cada bloque

### Problema: El idioma no cambia al hacer click

**Causa**: Store de Pinia no está sincronizado
- **Solución**: Verifica que `ApiLanguageSelector.vue` esté correctamente importado
- **Debug**: Abre la consola del navegador y busca errores

### Problema: Algunos endpoints no se traducen

**Causa**: Falta el tag `@apiLang` en esos endpoints
- **Solución**: Asegúrate de que TODOS los bloques tengan `@apiLang`

```javascript
// ❌ Este endpoint no se traduce
/**
 * @api {get} /test Test Endpoint
 */

// ✅ Este sí se traduce
/**
 * @apiLang en
 * @api {get} /test Test Endpoint
 */
```

### Problema: El template muestra texto en inglés aunque selecciono español

**Confusión común**: Hay 2 sistemas de i18n diferentes

1. **API Content i18n** (configurado con `@apiLang`):
   - Traduce el contenido de tu API
   - Endpoint titles, descriptions, parameters

2. **UI i18n** (configurado en `apidoc.json`):
   - Traduce la interfaz del template
   - Botones, labels, mensajes del template

**Solución**: Configura ambos sistemas:

```json
{
  "template": {
    "language": "es"  // UI en español
  },
  "i18n": {
    "enabled": true,
    "defaultLang": "es",  // API content en español por defecto
    "availableLangs": ["en", "es", "zh"]
  }
}
```

---

## Recursos Adicionales

- [Configuración General](./01-configuration.md)
- [Versionado de API](./07-versioning.md)
- [Ejemplos de Código](./06-examples.md)
- [Referencia de Parámetros @api](./05-apidoc-params.md)

---

## Resumen

- ✅ Usa `@apiLang` como primer tag en cada bloque de documentación
- ✅ Configura `i18n.enabled: true` en `apidoc.json`
- ✅ Lista todos los idiomas en `availableLangs`
- ✅ Mantén consistencia entre traducciones
- ✅ Habilita `fallbackToDefault: true` para seguridad
- ✅ El selector de idioma aparece automáticamente cuando hay 2+ idiomas

**¡Ya estás listo para crear documentación API multi-idioma con APIDoc v5.0.7!**
