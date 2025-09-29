"use strict";
/**
 * @file Parser for @apiGroup tags - handles API endpoint grouping
 *
 * This parser processes @apiGroup tags to extract and normalize API endpoint groups.
 * Groups are used to organize related endpoints in the generated documentation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = exports.path = void 0;
exports.parse = parse;
/**
 * Parse @apiGroup tag to extract and normalize API endpoint group
 *
 * Processes @apiGroup tags by trimming whitespace and converting spaces to underscores
 * to create valid group identifiers. Groups are used to organize related API endpoints
 * in the documentation navigation and structure.
 *
 * @param content - Raw content from the @apiGroup tag
 * @returns Object containing the normalized group name, or null if content is empty
 *
 * @example Basic group
 * ```
 * // Input: "User"
 * // Output: { group: "User" }
 * ```
 *
 * @example Group with spaces
 * ```
 * // Input: "User Management"
 * // Output: { group: "User_Management" }
 * ```
 *
 * @example Empty content
 * ```
 * // Input: "   "
 * // Output: null
 * ```
 *
 * @since 4.0.0
 * @public
 */
function parse(content) {
    const group = content.trim();
    if (group.length === 0) {
        return null;
    }
    return {
        group: group.replace(/(\s+)/g, '_'),
    };
}
exports.path = 'local';
exports.method = 'insert';
//# sourceMappingURL=api_group.js.map