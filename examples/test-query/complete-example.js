/**
 * @api {get} /api/community/complete Complete @apiSchema Example
 * @apiName CompleteSchemaExample
 * @apiGroup TestQuery
 * @apiVersion 1.0.0
 * @apiDescription
 * Complete example demonstrating @apiSchema with ALL element types:
 * - @apiHeader (authentication headers)
 * - @apiQuery (query parameters)
 * - @apiSuccess (success response)
 * - @apiError (error responses)
 *
 * This shows how to use TypeScript interfaces to generate complete API documentation.
 *
 * @apiSchema {interface=AuthHeaders} apiHeader
 * @apiSchema {interface=CommunityQueryParams} apiQuery
 * @apiSchema (Success 200) {interface=SuccessResponse} apiSuccess
 * @apiSchema (Success 200) {interface=CommunityData} apiSuccess
 * @apiSchema (Error 4xx) {interface=ErrorResponse} apiError
 */

/**
 * @api {get} /api/community/list Complete List Example with Pagination
 * @apiName CompleteListExample
 * @apiGroup TestQuery
 * @apiVersion 1.0.0
 * @apiDescription
 * Example of paginated list endpoint using @apiSchema for:
 * - Authentication headers
 * - Pagination query parameters
 * - Paginated response structure
 *
 * @apiSchema {interface=AuthHeaders} apiHeader
 * @apiSchema {interface=PaginationQuery} apiQuery
 * @apiSchema (Success 200) {interface=SuccessResponse} apiSuccess
 * @apiSchema (Success 200) {interface=PaginatedData} apiSuccess
 * @apiSchema (Error 4xx) {interface=ErrorResponse} apiError
 */

/**
 * @api {post} /api/community/create Create with Body Parameters
 * @apiName CreateWithBody
 * @apiGroup TestQuery
 * @apiVersion 1.0.0
 * @apiDescription
 * Example showing POST endpoint with body parameters
 *
 * @apiSchema {interface=AuthHeaders} apiHeader
 * @apiSchema (Body) {interface=CommunityQueryParams} apiParam
 * @apiSchema (Success 200) {interface=SuccessResponse} apiSuccess
 * @apiSchema (Success 200) {interface=CommunityData} apiSuccess
 * @apiSchema (Error 4xx) {interface=ValidationErrorResponse} apiError
 */
