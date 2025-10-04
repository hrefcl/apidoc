/**
 * Examples of using native OpenAPI syntax in APIDoc 5.0
 *
 * These examples show how to write OpenAPI 3.0 specifications
 * directly in code comments using the new @openapi parsers.
 */

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their unique identifier
 *     operationId: getUserById
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: integer
 *           format: int64
 *           minimum: 1
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
function getUserById(id) {
    // Implementation
}

/**
 * @openapi-path /api/users
 * post:
 *   summary: Create new user
 *   description: Creates a new user account
 *   operationId: createUser
 *   x-version: "2.1.0"
 *   tags:
 *     - Users
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required: [name, email]
 *           properties:
 *             name:
 *               type: string
 *               minLength: 1
 *               maxLength: 100
 *               example: "John Doe"
 *             email:
 *               type: string
 *               format: email
 *               example: "john@example.com"
 *             age:
 *               type: integer
 *               minimum: 0
 *               maximum: 150
 *               example: 30
 *   responses:
 *     201:
 *       description: User created successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/User'
 *               - type: object
 *                 properties:
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
function createUser(userData) {
    // Implementation
}

/**
 * @openapi-schema User
 * type: object
 * required:
 *   - id
 *   - name
 *   - email
 * properties:
 *   id:
 *     type: integer
 *     format: int64
 *     example: 12345
 *     description: Unique user identifier
 *   name:
 *     type: string
 *     minLength: 1
 *     maxLength: 100
 *     example: "John Doe"
 *     description: Full name of the user
 *   email:
 *     type: string
 *     format: email
 *     example: "john@example.com"
 *     description: User's email address
 *   age:
 *     type: integer
 *     minimum: 0
 *     maximum: 150
 *     example: 30
 *     description: User's age in years
 *   active:
 *     type: boolean
 *     default: true
 *     description: Whether the user account is active
 *   created_at:
 *     type: string
 *     format: date-time
 *     example: "2024-01-15T10:30:00Z"
 *     readOnly: true
 *   tags:
 *     type: array
 *     items:
 *       type: string
 *     example: ["developer", "premium"]
 *     description: User tags for categorization
 */

/**
 * @openapi-schema Error
 * type: object
 * required:
 *   - code
 *   - message
 * properties:
 *   code:
 *     type: integer
 *     example: 404
 *     description: HTTP error code
 *   message:
 *     type: string
 *     example: "Resource not found"
 *     description: Human readable error message
 *   details:
 *     type: string
 *     example: "User with ID 123 does not exist"
 *     description: Additional error details
 *   timestamp:
 *     type: string
 *     format: date-time
 *     example: "2024-01-15T10:30:00Z"
 *     description: When the error occurred
 */

/**
 * @openapi-operation
 * summary: Update user
 * description: Updates an existing user's information
 * operationId: updateUser
 * x-version: "3.0.0"
 * x-group: "User_Management"
 * tags:
 *   - Users
 * parameters:
 *   - name: id
 *     in: path
 *     required: true
 *     description: User ID to update
 *     schema:
 *       type: integer
 *       format: int64
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *             minLength: 1
 *             maxLength: 100
 *           email:
 *             type: string
 *             format: email
 *           age:
 *             type: integer
 *             minimum: 0
 *             maximum: 150
 *           active:
 *             type: boolean
 * responses:
 *   200:
 *     description: User updated successfully
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/User'
 *   400:
 *     description: Invalid input
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Error'
 *   404:
 *     description: User not found
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Error'
 */
function updateUser(id, userData) {
    // Implementation
}

/**
 * @openapi
 * /api/users/{id}/avatar:
 *   post:
 *     summary: Upload user avatar
 *     description: Uploads a new avatar image for the user
 *     operationId: uploadAvatar
 *     x-version: "3.0.0"
 *     x-group: "Files_Management"
 *     tags:
 *       - Users
 *       - Files
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 description: Optional description for the avatar
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar_url:
 *                   type: string
 *                   format: uri
 *                   example: "https://api.example.com/avatars/12345.jpg"
 *       400:
 *         description: Invalid file
 *       413:
 *         description: File too large
 */
function uploadAvatar(id, file) {
    // Implementation
}

/**
 * Mixed usage: Traditional APIDoc + OpenAPI Schema reference
 *
 * @api {get} /api/users Get all users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiVersion 4.0.0
 * @apiDescription Retrieve a paginated list of all users
 *
 * @apiParam {Number} [page=1] Page number for pagination
 * @apiParam {Number} [limit=10] Number of users per page
 * @apiParam {String} [sort=name] Field to sort by
 * @apiParam {String="asc","desc"} [order=asc] Sort order
 *
 * @apiSuccess {Object[]} users List of users
 * @apiSuccess {Number} total Total number of users
 * @apiSuccess {Number} page Current page number
 * @apiSuccess {Number} pages Total number of pages
 *
 * @openapi-schema UserListResponse
 * type: object
 * properties:
 *   users:
 *     type: array
 *     items:
 *       $ref: '#/components/schemas/User'
 *   total:
 *     type: integer
 *     example: 150
 *   page:
 *     type: integer
 *     example: 1
 *   pages:
 *     type: integer
 *     example: 15
 */
function getUsers(query) {
    // Implementation
}
