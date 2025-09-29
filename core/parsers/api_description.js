"use strict";
/**
 * @file Parser for @apiDescription tags - handles API endpoint descriptions
 *
 * This parser processes @apiDescription tags to extract detailed descriptions
 * for API endpoints. Descriptions provide comprehensive information about what
 * an endpoint does and how to use it.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownFields = exports.method = exports.path = void 0;
exports.parse = parse;
const unindent_1 = __importDefault(require("../utils/unindent"));
/**
 * Parse @apiDescription tag to extract endpoint description
 *
 * Processes @apiDescription tags by trimming whitespace and unindenting
 * multi-line descriptions to create clean, readable documentation text.
 * The description supports markdown formatting and multi-line content.
 *
 * @param content - Raw description content from the @apiDescription tag
 * @returns Object containing the processed description, or null if content is empty
 *
 * @example Single line description
 * ```
 * // Input: "Retrieves user information by ID"
 * // Output: { description: "Retrieves user information by ID" }
 * ```
 *
 * @example Multi-line description with markdown
 * ```
 * // Input: "Creates a new user account.\n\n**Requirements:**\n- Valid email\n- Strong password"
 * // Output: { description: "Creates a new user account.\n\n**Requirements:**\n- Valid email\n- Strong password" }
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
    const description = content.trim();
    if (description.length === 0) {
        return null;
    }
    return {
        description: (0, unindent_1.default)(description),
    };
}
exports.path = 'local';
exports.method = 'insert';
exports.markdownFields = ['description'];
//# sourceMappingURL=api_description.js.map