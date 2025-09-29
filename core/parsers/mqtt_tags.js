"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = exports.path = void 0;
exports.parse = parse;
/**
 * Parser for tags tags - defines taxonomical tags for MQTT operations
 *
 * This parser handles the tags tag that provides taxonomical classification
 * for MQTT operations. It extracts:
 * - Multiple tags separated by spaces or commas
 * - Tag normalization and validation
 *
 * @param content - Raw content from the tags tag
 * @returns Parsed tags information with array of tags, or null if parsing fails
 *
 * @example Space-separated tags
 * ```
 * // Input: "telemetry sensor temperature"
 * // Output: { tags: ["telemetry", "sensor", "temperature"] }
 * ```
 *
 * @example Comma-separated tags
 * ```
 * // Input: "command, actuator, control"
 * // Output: { tags: ["command", "actuator", "control"] }
 * ```
 *
 * @example Mixed separators
 * ```
 * // Input: "iot, devices sensor-data"
 * // Output: { tags: ["iot", "devices", "sensor-data"] }
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
    // Split by comma, space, or both, and filter out empty strings
    const tags = content
        .split(/[,\s]+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .map((tag) => tag.toLowerCase());
    if (tags.length === 0) {
        return null;
    }
    // Remove duplicates while preserving order
    const uniqueTags = [...new Set(tags)];
    return {
        tags: uniqueTags,
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
//# sourceMappingURL=mqtt_tags.js.map