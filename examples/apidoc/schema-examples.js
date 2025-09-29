/**
 * @file Example API endpoints demonstrating apiSchema functionality
 *
 * This file showcases the new apiSchema feature that allows:
 * - TypeScript interface integration
 * - JSON Schema file references
 * - Automatic parameter/response documentation generation
 */

/**
 * @api {post} /api/company/pricing Update Company Pricing
 * @apiName UpdateCompanyPricing
 * @apiGroup Company
 * @apiVersion 4.0.0
 *
 * @apiDescription Updates the pricing configuration for a company.
 * This endpoint demonstrates TypeScript interface integration with apiSchema.
 *
 * @apiSchema (Body) {interface=CompanyPricing} apiParam
 *
 * @apiParam (Body) {Boolean} active Whether pricing is active
 * @apiParam (Body) {Number} multiplier Pricing multiplier
 * @apiParam (Body) {Number} fixed_extra Fixed extra amount
 * @apiParam (Body) {String} type Pricing type
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "id": 123,
 *     "message": "Pricing updated successfully"
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
 *       "default_billing_currency": ["Invalid currency code"]
 *     }
 *   }
 * }
 */
function updateCompanyPricing() {
    // Implementation
}

/**
 * @api {get} /api/users Get Users List
 * @apiName GetUsers
 * @apiGroup Users
 * @apiVersion 4.0.0
 *
 * @apiDescription Retrieves a paginated list of users.
 * Demonstrates complex generic interface usage with pagination.
 *
 * @apiParam {Number{1..100}} [limit=10] Number of users per page
 * @apiParam {Number{1..}} [page=1] Page number
 * @apiParam {String="name","email","created_at"} [sort_by="created_at"] Sort field
 * @apiParam {String="asc","desc"} [sort_order="desc"] Sort direction
 * @apiParam {String} [search] Search query for name or email
 *
 * @apiSchema {interface=PaginatedResponse} apiSuccess
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": 1,
 *       "email": "john@example.com",
 *       "name": "John Doe",
 *       "role": "user",
 *       "created_at": "2024-01-15T10:30:00Z",
 *       "updated_at": "2024-01-20T14:45:00Z"
 *     }
 *   ],
 *   "meta": {
 *     "current_page": 1,
 *     "per_page": 10,
 *     "total": 25,
 *     "total_pages": 3,
 *     "has_next": true,
 *     "has_prev": false
 *   }
 * }
 */
function getUsers() {
    // Implementation
}

/**
 * @api {get} /api/users/:id Get User Profile
 * @apiName GetUserProfile
 * @apiGroup Users
 * @apiVersion 4.0.0
 *
 * @apiDescription Retrieves detailed profile information for a specific user.
 *
 * @apiParam {Number} id User's unique identifier
 *
 * @apiSchema {interface=UserProfile} apiSuccess
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "email": "john@example.com",
 *     "name": "John Doe",
 *     "role": "user",
 *     "created_at": "2024-01-15T10:30:00Z",
 *     "updated_at": "2024-01-20T14:45:00Z",
 *     "preferences": {
 *       "theme": "dark",
 *       "language": "en",
 *       "timezone": "UTC",
 *       "notifications": {
 *         "email": true,
 *         "push": true,
 *         "sms": false
 *       }
 *     }
 *   }
 * }
 */
function getUserProfile() {
    // Implementation
}

/**
 * @api {put} /api/users/:id Update User Profile
 * @apiName UpdateUserProfile
 * @apiGroup Users
 * @apiVersion 4.0.0
 *
 * @apiDescription Updates user profile information.
 * Demonstrates partial interface usage for update operations.
 *
 * @apiParam {Number} id User's unique identifier
 *
 * @apiParam (Body) {String} [name] User's full name
 * @apiParam (Body) {String="admin","user","moderator"} [role] User role
 * @apiParam (Body) {Object} [preferences] User preferences object
 * @apiParam (Body) {String="light","dark","auto"} [preferences.theme] UI theme preference
 * @apiParam (Body) {String} [preferences.language] Language preference (ISO code)
 * @apiParam (Body) {String} [preferences.timezone] Timezone identifier
 * @apiParam (Body) {Object} [preferences.notifications] Notification settings
 * @apiParam (Body) {Boolean} [preferences.notifications.email] Email notifications
 * @apiParam (Body) {Boolean} [preferences.notifications.push] Push notifications
 * @apiParam (Body) {Boolean} [preferences.notifications.sms] SMS notifications
 *
 * @apiSchema {interface=UserProfile} apiSuccess
 *
 * @apiExample {json} Request Example:
 * {
 *   "name": "John Smith",
 *   "preferences": {
 *     "theme": "dark",
 *     "notifications": {
 *       "email": true,
 *       "push": false
 *     }
 *   }
 * }
 */
function updateUserProfile() {
    // Implementation
}

/**
 * @api {post} /api/company/soft-updates Create Soft Update
 * @apiName CreateSoftUpdate
 * @apiGroup Company
 * @apiVersion 4.0.0
 *
 * @apiDescription Creates a new soft configuration update.
 * Demonstrates nested interface handling.
 *
 * @apiSchema (Body) {interface=CompanySoftUpdate} apiParam
 *
 * @apiParam (Body) {String} id Update identifier
 * @apiParam (Body) {String} type Update type
 * @apiParam (Body) {Object} value Update value
 *
 * @apiExample {json} Request Example:
 * {
 *   "id": "pricing-update-001",
 *   "type": "pricing",
 *   "value": {
 *     "base_rate": 2.50,
 *     "per_km": 0.75
 *   },
 *   "effective_from": "2024-02-01T00:00:00Z",
 *   "expires_at": "2024-03-01T00:00:00Z"
 * }
 */
function createSoftUpdate() {
    // Implementation
}

/**
 * @api {post} /api/responses/generic Example with Generic Interface
 * @apiName CreateGenericResponse
 * @apiGroup Examples
 * @apiVersion 4.0.0
 * @apiDescription This example shows how complex interfaces with generics
 * and index signatures are automatically simplified.
 *
 * @apiSchema {interface=ResponseSuccessGeneric} apiSuccess
 * @apiSchema {interface=ResponseErrorOptions} apiError
 *
 * The ResponseSuccessGeneric<T> interface is simplified to ignore the generic T
 * and the index signature [extra: string]: unknown is automatically filtered out.
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": "any type of data"
 * }
 */
function createGenericResponse() {
    // Implementation
}

/**
 * @api {put} /api/responses/complex Complex Interface Example
 * @apiName UpdateComplexResponse
 * @apiGroup Examples
 * @apiVersion 4.0.0
 * @apiDescription Demonstrates resilient parsing of interfaces with:
 * - Generic type parameters (T, K, V) -> converted to Mixed
 * - Index signatures [key: string]: unknown -> ignored
 * - Complex nested structures -> properly handled
 *
 * @apiSchema {interface=ResponseErrorOptions} apiParam
 *
 * The parser will extract only the concrete properties:
 * - id: string
 * - code?: string | number
 * And ignore the [k: string]: unknown index signature.
 *
 * @apiExample {json} Request Example:
 * {
 *   "id": "error-001",
 *   "code": 400
 * }
 */
function updateComplexResponse() {
    // Implementation
}

/**
 * @api {get} /api/health Health Check
 * @apiName HealthCheck
 * @apiGroup System
 * @apiVersion 4.0.0
 *
 * @apiDescription Simple health check endpoint.
 * Demonstrates minimal schema usage.
 *
 * @apiSuccess {Boolean} success Always true for successful response
 * @apiSuccess {String} message Health status message
 * @apiSuccess {Object} data Health check data
 * @apiSuccess {String} data.status Service status
 * @apiSuccess {String} data.timestamp Current server timestamp
 * @apiSuccess {String} data.version API version
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "message": "Service is healthy",
 *   "data": {
 *     "status": "ok",
 *     "timestamp": "2024-01-20T15:30:00Z",
 *     "version": "4.0.0"
 *   }
 * }
 */
function healthCheck() {
    // Implementation
}
