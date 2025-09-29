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
export declare function parse(content: string): {
    tags: string[];
} | null;
/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
export declare const path = "local";
/**
 * Processing method for this parser
 *
 * @internal
 */
export declare const method = "insert";
//# sourceMappingURL=mqtt_tags.d.ts.map