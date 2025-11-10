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
export function getCompleteSchema(req: any, res: any) {}

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
export function getCompleteList(req: any, res: any) {}

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
export function createCommunity(req: any, res: any) {}

/**
 * Complete TypeScript interfaces for testing @apiSchema with all elements
 */

// ==================== QUERY PARAMETERS ====================

/**
 * Community query parameters for create/update operations
 */
export interface CommunityQueryParams {
    /** External community UUID (unique identifier) */
    extCommunityUuid: string;

    /** Community name */
    name: string;

    /** Full physical address (optional) */
    address?: string;

    /** City ID from database (optional) */
    cityId?: number;

    /** Management office phone number (optional) */
    managePhone?: string;
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
    /** Page number (starts from 1) */
    pageNum?: number;

    /** Items per page (default: 500, max: 1000) */
    pageSize?: number;
}

// ==================== HEADERS ====================

/**
 * Authentication headers
 */
export interface AuthHeaders {
    /** JWT access token obtained from authentication */
    accessToken: string;

    /** Optional API version header */
    'X-API-Version'?: string;

    /** Optional request ID for tracking */
    'X-Request-ID'?: string;
}

// ==================== SUCCESS RESPONSES ====================

/**
 * Standard success response wrapper
 */
export interface SuccessResponse<T = any> {
    /** Response code (0 = success) */
    code: number;

    /** Response message */
    msg: string;

    /** Response data */
    data: T;

    /** Response processing time (e.g., "25ms") */
    time: string;
}

/**
 * Community data in success response
 */
export interface CommunityData {
    /** Internal community ID (Thinmoo system generated) */
    id: number;

    /** Community UUID (Thinmoo generated UUID) */
    uuid: string;

    /** Your external community UUID */
    extCommunityUuid: string;

    /** Community name */
    name: string;

    /** Community address */
    address?: string;

    /** City ID */
    cityId?: number;

    /** Management phone */
    managePhone?: string;

    /** Number of buildings */
    buildingCount?: number;

    /** Number of devices */
    deviceCount?: number;

    /** Number of residents */
    residentCount?: number;

    /** Creation timestamp (ISO 8601 format) */
    createdAt: string;

    /** Last update timestamp (ISO 8601 format) */
    updatedAt?: string;
}

/**
 * Paginated list response
 */
export interface PaginatedData<T = any> {
    /** Array of items */
    rows: T[];

    /** Total number of items (across all pages) */
    count: number;

    /** Current page number */
    pageNum: number;

    /** Items per page */
    pageSize: number;

    /** Total number of pages */
    totalPages: number;
}

// ==================== ERROR RESPONSES ====================

/**
 * Standard error response
 */
export interface ErrorResponse {
    /** Error code (10000 = validation error, 10001 = server error, 99999 = auth error) */
    code: number;

    /** Error message describing what went wrong */
    msg: string;

    /** Response processing time */
    time: string;

    /** Additional error details (optional) */
    details?: string;
}

/**
 * Validation error with field-specific errors
 */
export interface ValidationErrorResponse extends ErrorResponse {
    /** Field-specific validation errors */
    errors?: Array<{
        /** Field name that failed validation */
        field: string;

        /** Validation error message */
        message: string;
    }>;
}
