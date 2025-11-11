/**
 * @file Multi-language API documentation test
 * Tests: Spanish (es), English (en), Chinese (zh), French (fr), German (de), Japanese (ja)
 */

// ============================================================================
// Version 1.0.0 - 6 Languages (es, en, zh, fr, de, ja)
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
 * @apiParam {String} name 用户的全名
 * @apiParam {String} email 电子邮件地址
 * @apiParam {String} password 密码（至少8个字符）
 *
 * @apiSuccess {Number} id 创建的用户ID
 * @apiSuccess {String} name 用户名
 * @apiSuccess {String} email 电子邮件地址
 *
 * @apiSuccessExample {json} 成功响应:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "张伟",
 *   "email": "zhang@example.com"
 * }
 */

/**
 * @api {post} /users Créer un Utilisateur
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang fr
 *
 * @apiDescription Crée un nouvel utilisateur dans le système
 *
 * @apiParam {String} nom Nom complet de l'utilisateur
 * @apiParam {String} email Adresse e-mail
 * @apiParam {String} password Mot de passe (minimum 8 caractères)
 *
 * @apiSuccess {Number} id ID de l'utilisateur créé
 * @apiSuccess {String} nom Nom de l'utilisateur
 * @apiSuccess {String} email Adresse e-mail
 *
 * @apiSuccessExample {json} Réponse-Succès:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "nom": "Jean Dupont",
 *   "email": "jean@example.com"
 * }
 */

/**
 * @api {post} /users Benutzer Erstellen
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang de
 *
 * @apiDescription Erstellt einen neuen Benutzer im System
 *
 * @apiParam {String} name Vollständiger Name des Benutzers
 * @apiParam {String} email E-Mail-Adresse
 * @apiParam {String} password Passwort (mindestens 8 Zeichen)
 *
 * @apiSuccess {Number} id ID des erstellten Benutzers
 * @apiSuccess {String} name Benutzername
 * @apiSuccess {String} email E-Mail-Adresse
 *
 * @apiSuccessExample {json} Erfolg-Antwort:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "Hans Müller",
 *   "email": "hans@example.com"
 * }
 */

/**
 * @api {post} /users ユーザーを作成
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang ja
 *
 * @apiDescription システムに新しいユーザーを作成します
 *
 * @apiParam {String} name ユーザーのフルネーム
 * @apiParam {String} email メールアドレス
 * @apiParam {String} password パスワード（最低8文字）
 *
 * @apiSuccess {Number} id 作成されたユーザーのID
 * @apiSuccess {String} name ユーザー名
 * @apiSuccess {String} email メールアドレス
 *
 * @apiSuccessExample {json} 成功レスポンス:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "name": "田中太郎",
 *   "email": "tanaka@example.com"
 * }
 */

// ============================================================================
// Version 2.0.0 - 3 Languages (es, en, fr) - Testing partial language support
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

/**
 * @api {post} /users Créer un Utilisateur (v2)
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 2.0.0
 * @apiLang fr
 *
 * @apiDescription Crée un nouvel utilisateur avec avatar et rôles (version 2.0)
 *
 * @apiParam {String} nom Nom complet de l'utilisateur
 * @apiParam {String} email Adresse e-mail
 * @apiParam {String} password Mot de passe (minimum 8 caractères)
 * @apiParam {String} [avatar] URL de l'avatar de l'utilisateur
 * @apiParam {String[]} [roles] Tableau de rôles (admin, user, guest)
 *
 * @apiSuccess {Number} id ID de l'utilisateur créé
 * @apiSuccess {String} nom Nom de l'utilisateur
 * @apiSuccess {String} email Adresse e-mail
 * @apiSuccess {String} avatar URL de l'avatar
 * @apiSuccess {String[]} roles Rôles attribués
 *
 * @apiSuccessExample {json} Réponse-Succès:
 * HTTP/1.1 200 OK
 * {
 *   "id": 123,
 *   "nom": "Jean Dupont",
 *   "email": "jean@example.com",
 *   "avatar": "https://example.com/avatar.jpg",
 *   "roles": ["user"]
 * }
 */

// ============================================================================
// Additional endpoint - Get User (single version, 4 languages)
// ============================================================================

/**
 * @api {get} /users/:id Obtener Usuario
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang es
 *
 * @apiDescription Obtiene la información de un usuario específico
 *
 * @apiParam {Number} id ID único del usuario
 *
 * @apiSuccess {Number} id ID del usuario
 * @apiSuccess {String} nombre Nombre del usuario
 * @apiSuccess {String} email Correo electrónico
 */

/**
 * @api {get} /users/:id Get User
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang en
 *
 * @apiDescription Retrieves information for a specific user
 *
 * @apiParam {Number} id Unique user ID
 *
 * @apiSuccess {Number} id User ID
 * @apiSuccess {String} name User's name
 * @apiSuccess {String} email Email address
 */

/**
 * @api {get} /users/:id 获取用户
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang zh
 *
 * @apiDescription 获取特定用户的信息
 *
 * @apiParam {Number} id 唯一用户ID
 *
 * @apiSuccess {Number} id 用户ID
 * @apiSuccess {String} name 用户名
 * @apiSuccess {String} email 电子邮件地址
 */

/**
 * @api {get} /users/:id Utilisateur Obtenir
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiLang fr
 *
 * @apiDescription Récupère les informations d'un utilisateur spécifique
 *
 * @apiParam {Number} id ID unique de l'utilisateur
 *
 * @apiSuccess {Number} id ID de l'utilisateur
 * @apiSuccess {String} nom Nom de l'utilisateur
 * @apiSuccess {String} email Adresse e-mail
 */

// ============================================================================
// NO VERSION - Multiple Languages Only (Testing language-only selector)
// ============================================================================

/**
 * @api {delete} /users/:id Eliminar Usuario
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiLang es
 *
 * @apiDescription Elimina permanentemente un usuario del sistema
 *
 * @apiParam {Number} id ID único del usuario a eliminar
 *
 * @apiSuccess {Boolean} success Indica si la eliminación fue exitosa
 * @apiSuccess {String} message Mensaje de confirmación
 *
 * @apiSuccessExample {json} Ejemplo de respuesta exitosa:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "message": "Usuario eliminado exitosamente"
 * }
 *
 * @apiError {String} error Descripción del error
 * @apiError {Number} code Código de error
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Usuario no encontrado",
 *   "code": 404
 * }
 */

/**
 * @api {delete} /users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiLang en
 *
 * @apiDescription Permanently deletes a user from the system
 *
 * @apiParam {Number} id Unique ID of the user to delete
 *
 * @apiSuccess {Boolean} success Indicates if deletion was successful
 * @apiSuccess {String} message Confirmation message
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "message": "User deleted successfully"
 * }
 *
 * @apiError {String} error Error description
 * @apiError {Number} code Error code
 *
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "User not found",
 *   "code": 404
 * }
 */

/**
 * @api {delete} /users/:id 删除用户
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiLang zh
 *
 * @apiDescription 永久从系统中删除用户
 *
 * @apiParam {Number} id 要删除的用户的唯一ID
 *
 * @apiSuccess {Boolean} success 表示删除是否成功
 * @apiSuccess {String} message 确认消息
 *
 * @apiSuccessExample {json} 成功响应:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "message": "用户删除成功"
 * }
 *
 * @apiError {String} error 错误描述
 * @apiError {Number} code 错误代码
 *
 * @apiErrorExample {json} 错误响应:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "未找到用户",
 *   "code": 404
 * }
 */

/**
 * @api {delete} /users/:id Supprimer Utilisateur
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiLang fr
 *
 * @apiDescription Supprime définitivement un utilisateur du système
 *
 * @apiParam {Number} id ID unique de l'utilisateur à supprimer
 *
 * @apiSuccess {Boolean} success Indique si la suppression a réussi
 * @apiSuccess {String} message Message de confirmation
 *
 * @apiSuccessExample {json} Réponse-Succès:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "message": "Utilisateur supprimé avec succès"
 * }
 *
 * @apiError {String} error Description de l'erreur
 * @apiError {Number} code Code d'erreur
 *
 * @apiErrorExample {json} Réponse-Erreur:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Utilisateur non trouvé",
 *   "code": 404
 * }
 */

/**
 * @api {delete} /users/:id Benutzer Löschen
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiLang de
 *
 * @apiDescription Löscht einen Benutzer dauerhaft aus dem System
 *
 * @apiParam {Number} id Eindeutige ID des zu löschenden Benutzers
 *
 * @apiSuccess {Boolean} success Gibt an, ob das Löschen erfolgreich war
 * @apiSuccess {String} message Bestätigungsnachricht
 *
 * @apiSuccessExample {json} Erfolg-Antwort:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "message": "Benutzer erfolgreich gelöscht"
 * }
 *
 * @apiError {String} error Fehlerbeschreibung
 * @apiError {Number} code Fehlercode
 *
 * @apiErrorExample {json} Fehler-Antwort:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Benutzer nicht gefunden",
 *   "code": 404
 * }
 */
