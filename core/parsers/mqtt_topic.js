"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = exports.path = void 0;
exports.parse = parse;
/**
 * Parser for topic tags - defines MQTT topic path with placeholders
 *
 * This parser handles the topic tag that defines MQTT topic paths. It extracts:
 * - Complete topic path with placeholders
 * - Validates topic format
 *
 * @param content - Raw content from the topic tag
 * @returns Parsed topic information or null if parsing fails
 * @returns .topic - MQTT topic path (e.g., 'v1/{tenant}/devices/{deviceId}/telemetry')
 *
 * @example Topic with placeholders
 * ```
 * // Input: "v1/{tenant}/devices/{deviceId}/telemetry"
 * // Output: { topic: "v1/{tenant}/devices/{deviceId}/telemetry" }
 * ```
 *
 * @example Simple topic
 * ```
 * // Input: "sensors/temperature"
 * // Output: { topic: "sensors/temperature" }
 * ```
 *
 * @example Topic with wildcards
 * ```
 * // Input: "devices/+/status"
 * // Output: { topic: "devices/+/status" }
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
//# sourceMappingURL=mqtt_topic.js.map