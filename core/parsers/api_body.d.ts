/**
 * @file Parser for @apiBody tags - handles API request body documentation
 *
 * This parser processes @apiBody tags to extract request body parameter definitions.
 * It reuses the same parsing logic as @apiParam but applies it specifically to
 * request body parameters and adds special handling for boolean fields.
 */
/**
 * Parse @apiBody tag to extract request body parameter information
 *
 * Processes @apiBody tags using the same syntax as @apiParam but specifically
 * for request body parameters. Adds special handling for boolean fields by
 * setting a 'checked' property for HTML form rendering.
 *
 * @param content - Raw content from the @apiBody tag
 * @param source - Source file path (unused but required for interface compatibility)
 * @returns Parsed body parameter information with type, validation, and metadata
 *
 * @example Basic body parameter
 * ```
 * // Input: "{String} name User's full name"
 * // Output: { type: "String", field: "name", description: "User's full name", group: "Body" }
 * ```
 *
 * @example Boolean parameter with checkbox support
 * ```
 * // Input: "{Boolean} [active=true] User is active"
 * // Output: { type: "Boolean", field: "active", defaultValue: "true", checked: true, optional: true }
 * ```
 *
 * @example Complex nested body parameter
 * ```
 * // Input: "{Object} user User object"
 * // Output: { type: "Object", field: "user", description: "User object", parentNode: null }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export declare function parse(content: string, source: string): any;
export declare const path = "local.body";
export declare const method = "push";
export declare const markdownFields: string[];
//# sourceMappingURL=api_body.d.ts.map