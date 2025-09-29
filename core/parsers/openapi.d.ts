/**
 * Parser for @openapi tags - native OpenAPI 3.0 syntax support
 *
 * Allows writing OpenAPI specifications directly in comments using standard OpenAPI syntax.
 * Supports both JSON and YAML formats for maximum flexibility.
 *
 * This parser processes OpenAPI definitions and converts them into APIDoc-compatible
 * data structures that integrate seamlessly with APIDoc's navigation and grouping system.
 *
 * @example Basic OpenAPI path definition
 * ```javascript
 * /**
 *  @openapi
 *  /users/{id}:
 *  get:
 *  summary: Get user by ID
 *  tags: [Users]
 *  parameters:
 *  - name: id
 *  in: path
 *  required: true
 *  schema:
 *  *           type: integer
 *  *     responses:
 *  *       200:
 *  *         description: User details
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
    parameter?: any[];
    body?: any[];
    success?: any;
    error?: any;
    externalSource?: {
        file: string;
        path: string;
    };
}
/**
 * Parse @openapi content and convert to APIDoc-compatible format
 *
 * This function processes OpenAPI YAML/JSON content and converts it into the exact
 * format that APIDoc expects for navigation, grouping, and display purposes.
 *
 * @param content - Raw YAML/JSON content from the @openapi tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
declare function parse(content: string, filePath?: string): ApiDocCompatibleResult | null;
/**
 * Initialize the external OpenAPI file processor
 */
declare function init(app: any): void;
/**
 * APIDoc parser exports
 */
export { init, parse };
export declare const path = "local";
export declare const method = "insert";
//# sourceMappingURL=openapi.d.ts.map