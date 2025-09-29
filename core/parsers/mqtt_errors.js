"use strict";
/**
 * Parser for errors tags - defines expected MQTT errors and failure scenarios
 *
 * This parser handles the errors tag that defines expected errors or failure
 * scenarios for MQTT operations. It extracts:
 * - Error descriptions
 * - Multi-line error scenarios
 *
 * @param content - Raw content from the errors tag
 * @returns Parsed error information with description, or null if parsing fails
 *
 * @example Connection errors
 * ```
 * // Input: "Connection refused due to invalid credentials"
 * // Output: { description: "Connection refused due to invalid credentials" }
 * ```
 *
 * @example Topic access errors
 * ```
 * // Input: "Topic access denied - insufficient permissions"
 * // Output: { description: "Topic access denied - insufficient permissions" }
 * ```
 *
 * @example Multi-line error scenarios
 * ```
 * // Input: multiline content with various error conditions
 * // Output: { description: "..." }
 * ```
 *
 * @since 4.1.0
 * @public
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = exports.path = void 0;
exports.parse = parse;
const unindent_1 = __importDefault(require("../utils/unindent"));
function parse(content) {
    if (!content || !content.trim()) {
        return null;
    }
    // Process the content - unindent for better formatting
    const processedContent = (0, unindent_1.default)(content.trim());
    return {
        description: processedContent,
    };
}
/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
exports.path = 'local.errors';
/**
 * Processing method for this parser
 *
 * @internal
 */
exports.method = 'push';
//# sourceMappingURL=mqtt_errors.js.map