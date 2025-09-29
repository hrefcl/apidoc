/**
 * Parser for @api tags - extracts HTTP method, URL, and title from API definitions
 *
 * This parser handles the main @api tag that defines API endpoints. It extracts:
 * - HTTP method (GET, POST, PUT, DELETE, etc.)
 * - URL path with parameters
 * - Optional title/description
 *
 * @param content - Raw content from the @api tag
 * @returns Parsed API information or null if parsing fails
 * @returns .type - HTTP method (e.g., 'get', 'post')
 * @returns .url - API endpoint URL (e.g., '/users/:id')
 * @returns .title - Optional title/description
 *
 * @example Basic API definition
 * ```
 * // Input: "{get} /users Get all users"
 * // Output: { type: "get", url: "/users", title: "Get all users" }
 * ```
 *
 * @example API with parameters
 * ```
 * // Input: "{post} /users/:id/update Update user by ID"
 * // Output: { type: "post", url: "/users/:id/update", title: "Update user by ID" }
 * ```
 *
 * @example API without method
 * ```
 * // Input: "/users Get users"
 * // Output: { type: undefined, url: "/users", title: "Get users" }
 * ```
 *
 * @example API without title
 * ```
 * // Input: "{delete} /users/:id"
 * // Output: { type: "delete", url: "/users/:id", title: "" }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export declare function parse(content: string): {
    type: string;
    url: string;
    title: string;
} | null;
/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
export declare const path = "local";
/**
 * Processing method for this parser
 *
 * @internal
 */
export declare const method = "insert";
//# sourceMappingURL=api.d.ts.map