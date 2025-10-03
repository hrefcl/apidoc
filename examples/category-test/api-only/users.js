/**
 * @api {GET} /api/users Get All Users
 * @apiName GetUsers
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription Retrieve a list of all users in the system.
 * This endpoint should ONLY be parsed by API parsers.
 *
 * @apiQuery {Number} [page=1] Page number for pagination
 * @apiQuery {Number} [limit=10] Number of items per page
 * @apiQuery {String} [sort=createdAt] Sort field
 *
 * @apiSuccess {Object[]} users List of users
 * @apiSuccess {String} users.id User unique ID
 * @apiSuccess {String} users.name User full name
 * @apiSuccess {String} users.email User email address
 * @apiSuccess {String} users.role User role (admin, user, guest)
 *
 * @apiError (400) {String} message Error message
 * @apiError (401) {String} message Unauthorized access
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET "https://api.example.com/api/users?page=1&limit=10"
 */

/**
 * @api {POST} /api/users Create User
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription Create a new user in the system.
 * This endpoint demonstrates API-only parsing.
 *
 * @apiBody {String} name User full name (required)
 * @apiBody {String} email User email address (required)
 * @apiBody {String} password User password (required, min 8 chars)
 * @apiBody {String} [role=user] User role (admin, user, guest)
 *
 * @apiSuccess (201) {String} id Created user ID
 * @apiSuccess (201) {String} name User name
 * @apiSuccess (201) {String} email User email
 * @apiSuccess (201) {String} role User role
 *
 * @apiError (400) {String} message Validation error
 * @apiError (409) {String} message Email already exists
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST "https://api.example.com/api/users" \
 *          -H "Content-Type: application/json" \
 *          -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'
 */

/**
 * @api {PUT} /api/users/:id Update User
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription Update an existing user's information.
 *
 * @apiParam {String} id User unique ID
 *
 * @apiBody {String} [name] User full name
 * @apiBody {String} [email] User email address
 * @apiBody {String} [role] User role
 *
 * @apiSuccess {String} id User ID
 * @apiSuccess {String} name Updated user name
 * @apiSuccess {String} email Updated user email
 *
 * @apiError (404) {String} message User not found
 * @apiError (400) {String} message Validation error
 */

/**
 * @api {DELETE} /api/users/:id Delete User
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiDescription Delete a user from the system.
 *
 * @apiParam {String} id User unique ID
 *
 * @apiSuccess (204) NoContent User successfully deleted
 *
 * @apiError (404) {String} message User not found
 * @apiError (403) {String} message Forbidden - cannot delete own account
 */

// NOTE: This file contains ONLY @api tags
// If @apiDefine or @apiSchema appear here, the category filter should SKIP them
/**
 * @apiDefine UserNotFound
 * THIS SHOULD BE SKIPPED by api category filter!
 * @apiError UserNotFoundError The user was not found.
 */
