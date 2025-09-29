"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = exports.path = void 0;
exports.parse = parse;
/**
 * Parser for responseTopic tags - defines MQTT response topic paths
 *
 * This parser handles the responseTopic tag that defines where responses or
 * acknowledgments should be published for command/response patterns in MQTT.
 * It extracts:
 * - Response topic path with placeholders
 * - Validates topic format
 *
 * @param content - Raw content from the responseTopic tag
 * @returns Parsed response topic information with topic path, or null if parsing fails
 *
 * @example Command acknowledgment topic
 * ```
 * // Input: "v1/{tenant}/devices/{deviceId}/commands/ack"
 * // Output: { topic: "v1/{tenant}/devices/{deviceId}/commands/ack" }
 * ```
 *
 * @example Status response topic
 * ```
 * // Input: "v1/{tenant}/devices/{deviceId}/status/response"
 * // Output: { topic: "v1/{tenant}/devices/{deviceId}/status/response" }
 * ```
 *
 * @example Simple response topic
 * ```
 * // Input: "responses/device-commands"
 * // Output: { topic: "responses/device-commands" }
 * ```
 *
 * @since 4.1.0
 * @public
 */
function parse(content) {
    content = content.trim();
    if (!content) {
        return null;
    }
    // Basic validation for MQTT topic format
    // MQTT topics should not start with $ (reserved for system topics)
    // Should not contain null characters or be empty
    if (content.startsWith('$') && !content.startsWith('$share/')) {
        return null;
    }
    // Check for invalid characters
    if (content.includes('\0')) {
        return null;
    }
    return {
        topic: content,
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
//# sourceMappingURL=mqtt_response_topic.js.map