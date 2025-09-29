/**
 * Parser for @openapi-path tags - OpenAPI path-specific definitions
 *
 * Allows defining specific OpenAPI paths with their operations and converts them
 * to APIDoc-compatible format for seamless navigation integration.
 *
 * @example OpenAPI path definition
 * ```javascript
 * /**
 *  @openapi-path /users/{id}
 *  get:
 *  summary: Get user by ID
 *  tags: [Users]
 *  parameters:
 *  - name: id
 *  in: path
 *  required: true
 *  schema:
 *  type: integer
 *  *   responses:
 *  *     200:
 *  *       description: Success
 *  * /
 * ```
 *
 * @since 4.0.0
 * @public
 */
interface ApiDocCompatibleResult {
    type?: string;
    url?: string;
    title?: string;
    name?: string;
    group?: string;
    description?: string;
    version?: string;
    openapi?: any;
}
/**
 * Parse @openapi-path content and convert to APIDoc-compatible format
 *
 * Expected format:
 *
 * @openapi-path /path/to/endpoint
 * operation_definition_in_yaml_or_json
 *
 * @param content - Raw content from the @openapi-path tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
export declare function parse(content: string): ApiDocCompatibleResult | null;
/**
 * APIDoc parser exports
 */
export declare const path = "local";
export declare const method = "insert";
export {};
//# sourceMappingURL=openapi_path.d.ts.map