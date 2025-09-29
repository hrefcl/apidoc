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
//# sourceMappingURL=mqtt_response_topic.d.ts.map