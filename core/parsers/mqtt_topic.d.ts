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
export declare function parse(content: string): {
    topic: string;
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
//# sourceMappingURL=mqtt_topic.d.ts.map