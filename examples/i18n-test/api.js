/**
 * @file Simple i18n test with multiple languages and versions
 */

// ============================================================================
// Example 1: User API - Spanish version
// ============================================================================

/**
 * @api {post} /users Crear Usuario
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang es
 *
 * @apiDescription Crea un nuevo usuario en el sistema
 *
 * @apiParam {String} nombre Nombre completo del usuario
 * @apiParam {String} email Dirección de correo electrónico
 * @apiParam {String} password Contraseña (mínimo 8 caracteres)
 *
 * @apiSuccess {Number} id ID del usuario creado
 * @apiSuccess {String} nombre Nombre del usuario
 * @apiSuccess {String} email Correo electrónico
 *
 * @apiSuccessExample {json} Ejemplo de respuesta exitosa:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "nombre": "Juan Pérez",
 *   "email": "juan@example.com"
 * }
 *
 * @apiError UserExistsError El email ya está registrado
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "El usuario ya existe"
 * }
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
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 *
 * @apiError UserExistsError Email is already registered
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "User already exists"
 * }
 */

/**
 * @api {post} /users 创建用户
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang zh
 *
 * @apiDescription 在系统中创建新用户
 *
 * @apiParam {String} name 用户全名
 * @apiParam {String} email 电子邮件地址
 * @apiParam {String} password 密码（最少8个字符）
 *
 * @apiSuccess {Number} id 创建的用户ID
 * @apiSuccess {String} name 用户姓名
 * @apiSuccess {String} email 电子邮件
 *
 * @apiSuccessExample {json} 成功响应:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "张三",
 *   "email": "zhang@example.com"
 * }
 *
 * @apiError UserExistsError 电子邮件已被注册
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "用户已存在"
 * }
 */

// ============================================================================
// Example 2: Version 2.0.0 with more features - Spanish
// ============================================================================

/**
 * @api {post} /users Crear Usuario (v2)
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 2.0.0
 * @apiLang es
 *
 * @apiDescription Crea un nuevo usuario con avatar y roles (versión 2.0)
 *
 * @apiParam {String} nombre Nombre completo del usuario
 * @apiParam {String} email Dirección de correo electrónico
 * @apiParam {String} password Contraseña (mínimo 8 caracteres)
 * @apiParam {String} [avatar] URL del avatar del usuario
 * @apiParam {String[]} [roles] Array de roles (admin, user, guest)
 *
 * @apiSuccess {Number} id ID del usuario creado
 * @apiSuccess {String} nombre Nombre del usuario
 * @apiSuccess {String} email Correo electrónico
 * @apiSuccess {String} avatar URL del avatar
 * @apiSuccess {String[]} roles Roles asignados
 *
 * @apiSuccessExample {json} Ejemplo de respuesta exitosa:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "nombre": "Juan Pérez",
 *   "email": "juan@example.com",
 *   "avatar": "https://example.com/avatar.jpg",
 *   "roles": ["user"]
 * }
 */

/**
 * @api {post} /users Create User (v2)
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 2.0.0
 * @apiLang en
 *
 * @apiDescription Creates a new user with avatar and roles (version 2.0)
 *
 * @apiParam {String} name Full name of the user
 * @apiParam {String} email Email address
 * @apiParam {String} password Password (minimum 8 characters)
 * @apiParam {String} [avatar] User's avatar URL
 * @apiParam {String[]} [roles] Array of roles (admin, user, guest)
 *
 * @apiSuccess {Number} id ID of the created user
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email Email address
 * @apiSuccess {String} avatar Avatar URL
 * @apiSuccess {String[]} roles Assigned roles
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "avatar": "https://example.com/avatar.jpg",
 *   "roles": ["user"]
 * }
 */

// ============================================================================
// Example 3: Get User - Spanish and English
// ============================================================================

/**
 * @api {get} /users/:id Obtener Usuario
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang es
 *
 * @apiDescription Obtiene la información de un usuario por su ID
 *
 * @apiParam {Number} id ID único del usuario
 *
 * @apiSuccess {Number} id ID del usuario
 * @apiSuccess {String} nombre Nombre del usuario
 * @apiSuccess {String} email Correo electrónico
 *
 * @apiSuccessExample {json} Ejemplo de respuesta:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "nombre": "Juan Pérez",
 *   "email": "juan@example.com"
 * }
 *
 * @apiError UserNotFound Usuario no encontrado
 */

/**
 * @api {get} /users/:id Get User
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang en
 *
 * @apiDescription Get user information by ID
 *
 * @apiParam {Number} id Unique user ID
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email Email address
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 *
 * @apiError UserNotFound User not found
 */

// ============================================================================
// Example 4: Product without multiple languages (single language)
// ============================================================================

/**
 * @api {get} /products/:id Get Product
 * @apiName GetProduct
 * @apiGroup Products
 * @apiVersion 1.0.0
 *
 * @apiDescription Get product information (English only - no @apiLang)
 *
 * @apiParam {Number} id Product ID
 *
 * @apiSuccess {Number} id Product ID
 * @apiSuccess {String} name Product name
 * @apiSuccess {Number} price Price in USD
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "id": 456,
 *   "name": "Laptop",
 *   "price": 999.99
 * }
 */
