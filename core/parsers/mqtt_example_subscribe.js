"use strict";
/**
 * Parser for exampleSubscribe tags - provides MQTT subscribe examples
 *
 * This parser handles the exampleSubscribe tag that provides examples of subscribing
 * to MQTT topics. It supports:
 * - mosquitto_sub command examples
 * - Expected message examples
 * - Multi-line content
 *
 * @param content - Raw content from the exampleSubscribe tag
 * @returns Parsed example information with title and content, or null if parsing fails
 *
 * @example mosquitto_sub command
 * ```
 * // Input: multiline content with mosquitto_sub command
 * // Output: { title: "Subscribe Example", content: "mosquitto_sub -h...", type: "bash" }
 * ```
 *
 * @example Expected message format
 * ```
 * // Input: JSON message format example
 * // Output: { title: "Expected Message", content: "{...}", type: "json" }
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
    let title = 'Subscribe Example';
    // Check if it starts with mosquitto_sub
    if (content.includes('mosquitto_sub')) {
        type = 'bash';
        title = 'mosquitto_sub Command';
    }
    // Check if it looks like JSON
    else if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        type = 'json';
        title = 'Expected Message';
    }
    // Check if it looks like a shell command
    else if (content.includes('$') || content.includes('#!/')) {
        type = 'bash';
        title = 'Command Example';
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
exports.path = 'local.exampleSubscribe';
/**
 * Processing method for this parser
 *
 * @internal
 */
exports.method = 'push';
//# sourceMappingURL=mqtt_example_subscribe.js.map