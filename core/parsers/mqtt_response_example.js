"use strict";
/**
 * Parser for responseExample tags - provides MQTT response examples
 *
 * This parser handles the responseExample tag that provides examples of response
 * messages for MQTT command/response patterns. It supports:
 * - JSON response examples
 * - Acknowledgment message examples
 * - Multi-line content
 *
 * @param content - Raw content from the responseExample tag
 * @returns Parsed response example with title and content, or null if parsing fails
 *
 * @example JSON acknowledgment
 * ```
 * // Input: JSON acknowledgment response
 * // Output: { title: "Response Example", content: "{...}", type: "json" }
 * ```
 *
 * @example Status response
 * ```
 * // Input: Status response message
 * // Output: { title: "Status Response", content: "...", type: "text" }
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
    // Remove leading/trailing whitespace but preserve internal structure
    content = content.trim();
    // Detect content type based on content
    let type = 'text';
    let title = 'Response Example';
    // Check if it looks like JSON
    if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        type = 'json';
        title = 'Response Example';
    }
    // Check if it looks like XML
    else if (content.trim().startsWith('<') && content.trim().endsWith('>')) {
        type = 'xml';
        title = 'XML Response';
    }
    // Check if it contains acknowledgment patterns
    else if (content.toLowerCase().includes('ack') || content.toLowerCase().includes('status')) {
        title = 'Acknowledgment Example';
    }
    // Process the content - unindent for better formatting
    const processedContent = (0, unindent_1.default)(content);
    return {
        title: title,
        content: processedContent,
        type: type,
    };
}
/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
exports.path = 'local.responseExample';
/**
 * Processing method for this parser
 *
 * @internal
 */
exports.method = 'push';
//# sourceMappingURL=mqtt_response_example.js.map