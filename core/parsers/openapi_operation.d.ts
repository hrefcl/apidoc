/**
 * Parser for @openapi-operation tags - OpenAPI operation definitions
 *
 * Allows defining specific OpenAPI operations with detailed parameters,
 * request bodies, and responses using standard OpenAPI syntax. Operations
 * are automatically converted to APIDoc-compatible format for navigation.
 *
 * @example OpenAPI operation definition
 * ```javascript
 * /**
 *  @openapi-operation
 *  summary: Create a new user
 *  description: Creates a new user account with the provided information
 *  operationId: createUser
 *  tags:
 *  - Users
 *  requestBody:
 *  required: true
 *  content:
 *  application/json:
 *  *       schema:
 *  *         $ref: '#/components/schemas/CreateUserRequest'
 *  * responses:
 *  *   201:
 *  *     description: User created successfully
 *  * /
 * ```
 *
 * @since 4.0.0
 * @public
 */
interface ApiDocCompatibleResult {
    type?: string;
    name?: string;
    title?: string;
    group?: string;
    description?: string;
    version?: string;
    openapi?: any;
}
/**
 * Parse @openapi-operation content and convert to APIDoc-compatible format
 *
 * @param content - Raw content from the @openapi-operation tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
export declare function parse(content: string): ApiDocCompatibleResult | null;
/**
 * APIDoc parser exports
 */
export declare const path = "local";
export declare const method = "insert";
export {};
//# sourceMappingURL=openapi_operation.d.ts.map