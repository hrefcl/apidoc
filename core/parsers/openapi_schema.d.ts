/**
 * Parser for @openapi-schema tags - OpenAPI schema definitions
 *
 * Allows defining reusable OpenAPI schemas and components that integrate
 * seamlessly with APIDoc's navigation and grouping system.
 * These schemas can be referenced by other endpoints.
 *
 * @example OpenAPI schema definition
 * ```javascript
 * /**
 *  @openapi-schema User
 *  type: object
 *  required:
 *  - id
 *  - name
 *  - email
 *  properties:
 *  id:
 *  type: integer
 *  format: int64
 *  *     example: 12345
 *  *   name:
 *  *     type: string
 *  *     example: "John Doe"
 *  *   email:
 *  *     type: string
 *  *     format: email
 *  *     example: "john@example.com"
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
 * Parse @openapi-schema content and convert to APIDoc-compatible format
 *
 * Expected format:
 *
 * @openapi-schema SchemaName
 * schema_definition_in_yaml_or_json
 *
 * @param content - Raw content from the @openapi-schema tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
export declare function parse(content: string): ApiDocCompatibleResult | null;
/**
 * APIDoc parser exports
 */
export declare const path = "local";
export declare const method = "insert";
export {};
//# sourceMappingURL=openapi_schema.d.ts.map