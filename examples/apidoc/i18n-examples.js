/**
 * @file Multi-language documentation examples
 * @description Demonstrates the @apiLang annotation for creating multi-language API documentation
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 *
 * The @apiLang annotation allows you to create multiple language versions of the same endpoint.
 * Similar to @apiVersion, you can have multiple blocks with different @apiLang values.
 *
 * Usage:
 * - @apiLang <iso-639-1-code>  (e.g., @apiLang es, @apiLang en, @apiLang zh)
 * - ISO 639-1 two-letter codes only
 * - Optional - endpoints without @apiLang are language-neutral
 * - Configure in apidoc.json: "i18n": { "enabled": true, "defaultLang": "en" }
 */

// ============================================================================
// Example 1: Single language (Chinese only, no @apiLang needed)
// ============================================================================

/**
 * @api {get} /products/:id 获取产品
 * @apiName GetProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 *
 * @apiDescription 获取特定产品的详细信息
 *
 * @apiParam {Number} id 产品的唯一标识符
 *
 * @apiSuccess {String} name 产品名称
 * @apiSuccess {Number} price 产品价格
 * @apiSuccess {String} description 产品描述
 *
 * @apiError ProductNotFound 找不到指定的产品
 */

// ============================================================================
// Example 2: Bilingual (Spanish + English)
// ============================================================================

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang es
 *
 * @apiDescription Crea un nuevo usuario en el sistema
 *
 * @apiParam {String} name Nombre completo del usuario
 * @apiParam {String} email Dirección de correo electrónico
 * @apiParam {String} password Contraseña (mínimo 8 caracteres)
 *
 * @apiSuccess {Number} id ID del usuario creado
 * @apiSuccess {String} name Nombre del usuario
 * @apiSuccess {String} email Correo electrónico
 * @apiSuccess {Date} createdAt Fecha de creación
 *
 * @apiError EmailAlreadyExists El correo electrónico ya está registrado
 * @apiError WeakPassword La contraseña no cumple los requisitos de seguridad
 *
 * @apiExample {curl} Ejemplo de uso:
 *    curl -X POST https://api.ejemplo.com/users \
 *         -H "Content-Type: application/json" \
 *         -d '{"name":"Juan Pérez","email":"juan@ejemplo.com","password":"MiPassword123"}'
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 42,
 *      "name": "Juan Pérez",
 *      "email": "juan@ejemplo.com",
 *      "createdAt": "2025-10-04T12:00:00Z"
 *    }
 */

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang en
 *
 * @apiDescription Creates a new user in the system
 *
 * @apiParam {String} name Full name of the user
 * @apiParam {String} email Email address
 * @apiParam {String} password Password (minimum 8 characters)
 *
 * @apiSuccess {Number} id ID of the created user
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email Email address
 * @apiSuccess {Date} createdAt Creation date
 *
 * @apiError EmailAlreadyExists The email address is already registered
 * @apiError WeakPassword The password does not meet security requirements
 *
 * @apiExample {curl} Example usage:
 *    curl -X POST https://api.example.com/users \
 *         -H "Content-Type: application/json" \
 *         -d '{"name":"John Doe","email":"john@example.com","password":"MyPassword123"}'
 *
 * @apiSuccessExample {json} Success response:
 *    HTTP/1.1 201 Created
 *    {
 *      "id": 42,
 *      "name": "John Doe",
 *      "email": "john@example.com",
 *      "createdAt": "2025-10-04T12:00:00Z"
 *    }
 */

// ============================================================================
// Example 3: Multi-language (Chinese + English + Japanese)
// ============================================================================

/**
 * @api {get} /orders/:id Get Order
 * @apiName GetOrder
 * @apiGroup Orders
 * @apiVersion 2.0.0
 * @apiLang zh
 *
 * @apiDescription 获取订单详细信息
 *
 * @apiParam {Number} id 订单ID
 *
 * @apiSuccess {Number} id 订单编号
 * @apiSuccess {String} status 订单状态 (pending, processing, shipped, delivered)
 * @apiSuccess {Number} total 订单总额
 * @apiSuccess {Object[]} items 订单项目列表
 *
 * @apiError OrderNotFound 订单不存在
 * @apiError Unauthorized 未授权访问
 */

/**
 * @api {get} /orders/:id Get Order
 * @apiName GetOrder
 * @apiGroup Orders
 * @apiVersion 2.0.0
 * @apiLang en
 *
 * @apiDescription Retrieves detailed information about an order
 *
 * @apiParam {Number} id Order ID
 *
 * @apiSuccess {Number} id Order number
 * @apiSuccess {String} status Order status (pending, processing, shipped, delivered)
 * @apiSuccess {Number} total Order total amount
 * @apiSuccess {Object[]} items List of order items
 *
 * @apiError OrderNotFound The order does not exist
 * @apiError Unauthorized Unauthorized access
 */

/**
 * @api {get} /orders/:id Get Order
 * @apiName GetOrder
 * @apiGroup Orders
 * @apiVersion 2.0.0
 * @apiLang ja
 *
 * @apiDescription 注文の詳細情報を取得します
 *
 * @apiParam {Number} id 注文ID
 *
 * @apiSuccess {Number} id 注文番号
 * @apiSuccess {String} status 注文ステータス (pending, processing, shipped, delivered)
 * @apiSuccess {Number} total 注文合計金額
 * @apiSuccess {Object[]} items 注文アイテムリスト
 *
 * @apiError OrderNotFound 注文が存在しません
 * @apiError Unauthorized 未承認のアクセス
 */

// ============================================================================
// Example 4: Versioned + Multi-language (Version 1.0.0 + 2.0.0, both bilingual)
// ============================================================================

/**
 * @api {delete} /users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang es
 *
 * @apiDescription Elimina un usuario del sistema (versión antigua, sin confirmación)
 *
 * @apiParam {Number} id ID del usuario
 *
 * @apiSuccess {String} message Mensaje de confirmación
 *
 * @apiError UserNotFound Usuario no encontrado
 */

/**
 * @api {delete} /users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang en
 *
 * @apiDescription Deletes a user from the system (old version, no confirmation)
 *
 * @apiParam {Number} id User ID
 *
 * @apiSuccess {String} message Confirmation message
 *
 * @apiError UserNotFound User not found
 */

/**
 * @api {delete} /users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiVersion 2.0.0
 * @apiLang es
 *
 * @apiDescription Elimina un usuario del sistema (nueva versión con confirmación requerida)
 *
 * @apiParam {Number} id ID del usuario
 * @apiParam {String} confirm Palabra de confirmación (debe ser "CONFIRM")
 *
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Object} deletedUser Información del usuario eliminado
 *
 * @apiError UserNotFound Usuario no encontrado
 * @apiError ConfirmationRequired Se requiere confirmación explícita
 * @apiError InvalidConfirmation La confirmación no es válida
 */

/**
 * @api {delete} /users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiVersion 2.0.0
 * @apiLang en
 *
 * @apiDescription Deletes a user from the system (new version with required confirmation)
 *
 * @apiParam {Number} id User ID
 * @apiParam {String} confirm Confirmation word (must be "CONFIRM")
 *
 * @apiSuccess {String} message Confirmation message
 * @apiSuccess {Object} deletedUser Information about the deleted user
 *
 * @apiError UserNotFound User not found
 * @apiError ConfirmationRequired Explicit confirmation is required
 * @apiError InvalidConfirmation The confirmation is not valid
 */

// ============================================================================
// Example 5: Mix - Some endpoints with language, some without
// ============================================================================

/**
 * @api {get} /health Health Check
 * @apiName HealthCheck
 * @apiGroup System
 * @apiVersion 1.0.0
 *
 * @apiDescription Returns system health status (language-neutral)
 *
 * @apiSuccess {String} status Always returns "OK"
 * @apiSuccess {Number} timestamp Current server timestamp
 * @apiSuccess {String} version API version
 */

/**
 * @api {get} /stats Statistics
 * @apiName GetStats
 * @apiGroup System
 * @apiVersion 1.0.0
 * @apiLang es
 *
 * @apiDescription Obtiene estadísticas del sistema
 *
 * @apiSuccess {Number} totalUsers Total de usuarios registrados
 * @apiSuccess {Number} totalOrders Total de órdenes
 * @apiSuccess {Number} revenue Ingresos totales
 */

/**
 * @api {get} /stats Statistics
 * @apiName GetStats
 * @apiGroup System
 * @apiVersion 1.0.0
 * @apiLang en
 *
 * @apiDescription Retrieves system statistics
 *
 * @apiSuccess {Number} totalUsers Total registered users
 * @apiSuccess {Number} totalOrders Total orders
 * @apiSuccess {Number} revenue Total revenue
 */

/**
 * @apiDefine MultiLanguageNotes
 *
 * ## Multi-Language Documentation Notes
 *
 * This API supports documentation in multiple languages:
 *
 * - **Spanish (es)**: Documentación completa en español
 * - **English (en)**: Full documentation in English
 * - **Chinese (zh)**: 中文完整文档
 * - **Japanese (ja)**: 日本語の完全なドキュメント
 *
 * Use the language selector in the documentation interface to switch between languages.
 * If a translation is not available for your selected language, the system will
 * automatically fallback to the default language configured in `apidoc.json`.
 */
