/**
 * @file Example API endpoints demonstrating JSON Schema integration
 *
 * This file showcases apiSchema functionality with external JSON Schema files
 */

/**
 * @api {post} /api/users Create User Account
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 4.0.0
 *
 * @apiDescription Creates a new user account with the provided information.
 * This endpoint demonstrates JSON Schema integration for request validation.
 *
 * @apiSchema (Body) {jsonschema=./schemas/user-create.json} apiParam
 *
 * @apiExample {json} Request Example:
 * {
 *   "email": "jane.doe@example.com",
 *   "name": "Jane Doe",
 *   "password": "SecurePassword123!",
 *   "role": "user",
 *   "preferences": {
 *     "theme": "dark",
 *     "language": "en",
 *     "timezone": "America/New_York",
 *     "notifications": {
 *       "email": true,
 *       "push": true,
 *       "sms": false
 *     }
 *   },
 *   "metadata": {
 *     "source": "web",
 *     "referrer": "google.com",
 *     "marketing_consent": true
 *   }
 * }
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 201 Created
 * {
 *   "success": true,
 *   "data": {
 *     "id": 123,
 *     "email": "jane.doe@example.com",
 *     "name": "Jane Doe",
 *     "role": "user",
 *     "created_at": "2024-01-20T15:30:00Z"
 *   }
 * }
 *
 * @apiErrorExample {json} Validation Error:
 * HTTP/1.1 400 Bad Request
 * {
 *   "success": false,
 *   "message": "Validation failed",
 *   "code": "VALIDATION_ERROR",
 *   "details": {
 *     "field_errors": {
 *       "email": ["Email already exists"],
 *       "password": ["Password must be at least 8 characters"]
 *     }
 *   }
 * }
 */
function createUser() {
  // Implementation
}

/**
 * @api {post} /api/auth/login User Authentication
 * @apiName LoginUser
 * @apiGroup Authentication
 * @apiVersion 4.0.0
 *
 * @apiDescription Authenticates a user and returns an access token.
 * This endpoint combines manual parameter documentation with schema-based responses.
 *
 * @apiParam (Body) {String} email User's email address
 * @apiParam (Body) {String} password User's password
 * @apiParam (Body) {Boolean} [remember_me=false] Keep session active longer
 * @apiParam (Body) {String} [device_name] Name of the device for token identification
 *
 * @apiSuccess {Boolean} success Always true for successful login
 * @apiSuccess {Object} data Authentication data
 * @apiSuccess {String} data.access_token JWT access token
 * @apiSuccess {String} data.refresh_token Refresh token for renewing access
 * @apiSuccess {String} data.token_type Token type (always "Bearer")
 * @apiSuccess {Number} data.expires_in Token expiration time in seconds
 * @apiSuccess {Object} data.user User information
 * @apiSuccess {Number} data.user.id User ID
 * @apiSuccess {String} data.user.email User email
 * @apiSuccess {String} data.user.name User name
 * @apiSuccess {String} data.user.role User role
 *
 *
 * @apiExample {json} Request Example:
 * {
 *   "email": "jane.doe@example.com",
 *   "password": "SecurePassword123!",
 *   "remember_me": true,
 *   "device_name": "iPhone 15 Pro"
 * }
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
 *     "refresh_token": "def502004d8f9c...",
 *     "token_type": "Bearer",
 *     "expires_in": 3600,
 *     "user": {
 *       "id": 123,
 *       "email": "jane.doe@example.com",
 *       "name": "Jane Doe",
 *       "role": "user"
 *     }
 *   }
 * }
 *
 * @apiErrorExample {json} Authentication Error:
 * HTTP/1.1 401 Unauthorized
 * {
 *   "success": false,
 *   "message": "Invalid credentials",
 *   "code": "INVALID_CREDENTIALS"
 * }
 */
function loginUser() {
  // Implementation
}

/**
 * @api {post} /api/files/upload Upload File
 * @apiName UploadFile
 * @apiGroup Files
 * @apiVersion 4.0.0
 *
 * @apiDescription Uploads a file to the server.
 * Demonstrates mixed schema and manual documentation for multipart requests.
 *
 * @apiParam (Form Data) {File} file The file to upload
 * @apiParam (Form Data) {String} [description] File description
 * @apiParam (Form Data) {String="public","private"} [visibility="private"] File visibility
 * @apiParam (Form Data) {String[]} [tags] Array of tags for the file
 *
 * @apiSuccess {Boolean} success Always true for successful upload
 * @apiSuccess {Object} data Upload result data
 * @apiSuccess {String} data.file_id Unique file identifier
 * @apiSuccess {String} data.filename Original filename
 * @apiSuccess {Number} data.size File size in bytes
 * @apiSuccess {String} data.mime_type File MIME type
 * @apiSuccess {String} data.url File access URL
 * @apiSuccess {String} data.uploaded_at Upload timestamp
 *
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "file_id": "f7c8b3e2-4d5a-4f9c-8b2e-1a3d7c9e4f5b",
 *     "filename": "document.pdf",
 *     "size": 1024768,
 *     "mime_type": "application/pdf",
 *     "url": "https://api.example.com/files/f7c8b3e2-4d5a-4f9c-8b2e-1a3d7c9e4f5b",
 *     "uploaded_at": "2024-01-20T15:30:00Z"
 *   }
 * }
 */
function uploadFile() {
  // Implementation
}