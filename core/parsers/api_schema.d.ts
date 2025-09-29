/**
 * @file Parser for @apiSchema tags - handles API schema documentation
 *
 * @description This parser processes @apiSchema tags to extract schema definitions including:
 * - TypeScript interfaces from .ts files
 * - JSON Schema files (external references)
 * - Automatic parameter/success/error generation
 * - Type validation and documentation
 * - Group support for organizing parameters
 *
 * @example Basic Usage
 * ```typescript
 * // In your API documentation:
 * /**
 *  @apiSchema {interface=UserProfile} apiSuccess
 *  @apiSchema (Body) {interface=CreateUser} apiParam
 *  @apiSchema {jsonschema=./schemas/user.json} apiParam
 *  \/
 * ```
 *
 * @author hrefcl
 * @since 4.0.0
 * @version 4.0.0
 */
/**
 * Parses @apiSchema tag content and extracts schema configuration
 *
 * @description This function processes the content of @apiSchema tags to extract
 * the schema type, value, target element, and optional group information. It supports
 * both TypeScript interface references and external JSON Schema file paths with
 * flexible syntax for different APIDoc elements.
 *
 * @param content - The raw content string from the @apiSchema tag
 * @param source - The complete source line (used for error reporting)
 *
 * @returns Parsed schema configuration object or null if parsing fails
 *
 * @example Supported syntax patterns
 * ```typescript
 * // TypeScript interface with group
 * parse("(Body) {interface=UserProfile} apiParam", "@apiSchema ...")
 * // Returns: { group: "Body", schemaType: "interface", schemaValue: "UserProfile", element: "apiParam" }
 *
 * // JSON Schema for success response
 * parse("{jsonschema=./schemas/user.json} apiSuccess", "@apiSchema ...")
 * // Returns: { group: "", schemaType: "jsonschema", schemaValue: "./schemas/user.json", element: "apiSuccess" }
 *
 * // Interface without group (defaults to apiParam)
 * parse("{interface=ResponseError}", "@apiSchema ...")
 * // Returns: { group: "", schemaType: "interface", schemaValue: "ResponseError", element: "apiParam" }
 * ```
 *
 * @example Return object structure
 * ```typescript
 * interface ParseResult {
 *   group: string;        // Optional group name (e.g., "Body", "Query")
 *   schemaType: string;   // Either "interface" or "jsonschema"
 *   schemaValue: string;  // Interface name or file path
 *   element: string;      // Target APIDoc element (apiParam, apiSuccess, apiError, etc.)
 * }
 * ```
 *
 * @returns null for invalid syntax, multiline content, or commented content
 *
 * @public
 * @since 4.0.0
 */
declare function parse(content: string, source: string): any;
/**
 * Initializes the @apiSchema parser by registering the processor hook
 *
 * @description This initialization function registers the @apiSchema processor
 * with the APIDoc parser hook system. It sets up the parser to intercept
 * and process @apiSchema tags during the documentation generation phase.
 *
 * @param app - The APIDoc application instance with hook registration capabilities
 *
 * @example Hook registration
 * ```typescript
 * // Registers processor function as 'parser-find-elements' hook with priority 200
 * init(apiDocApp);
 * // Now @apiSchema tags will be processed during documentation generation
 * ```
 *
 * @hook Registers processor function with 'parser-find-elements' event at priority 200
 * @priority 200 - Runs after basic element parsing but before final processing
 * @public
 * @since 4.0.0
 */
declare function init(app: any): void;
declare const _default: {
    parse: typeof parse;
    path: string;
    method: string;
    markdownFields: any[];
    markdownRemoveFields: any[];
    init: typeof init;
};
export default _default;
//# sourceMappingURL=api_schema.d.ts.map