"use strict";
/**
 * @file Parser for @apiUse tags - handles inclusion of predefined documentation blocks
 *
 * This parser processes @apiUse tags to include predefined documentation blocks
 * defined with @apiDefine. It enables reuse of common documentation patterns
 * across multiple API endpoints.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventGlobal = exports.method = exports.path = void 0;
exports.parse = parse;
/**
 * Parse @apiUse tag to extract reference to predefined block
 *
 * Processes @apiUse tags by extracting the name of a predefined documentation
 * block that should be included in the current API endpoint documentation.
 * This enables DRY (Don't Repeat Yourself) principles in API documentation.
 *
 * @param content - Raw content from the @apiUse tag containing the block name
 * @returns Object containing the referenced block name, or null if content is empty
 *
 * @example Reference to predefined block
 * ```
 * // Input: "UserObject"
 * // Output: { name: "UserObject" }
 * ```
 *
 * @example Reference to error responses
 * ```
 * // Input: "CommonErrors"
 * // Output: { name: "CommonErrors" }
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
    const name = content.trim();
    if (name.length === 0) {
        return null;
    }
    return {
        name: name,
    };
}
exports.path = 'local.use';
exports.method = 'push';
exports.preventGlobal = true;
//# sourceMappingURL=api_use.js.map