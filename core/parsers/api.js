"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = exports.path = void 0;
exports.parse = parse;
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
function parse(content) {
    content = content.trim();
    // Search: type, url and title
    // Example: {get} /user/:id Get User by ID.
    const parseRegExp = /^(?:(?:\{(.+?)\})?\s*)?(.+?)(?:\s+(.+?))?$/g;
    const matches = parseRegExp.exec(content);
    if (!matches) {
        return null;
    }
    return {
        type: matches[1],
        url: matches[2],
        title: matches[3] || '',
    };
}
/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
exports.path = 'local';
/**
 * Processing method for this parser
 *
 * @internal
 */
exports.method = 'insert';
//# sourceMappingURL=api.js.map