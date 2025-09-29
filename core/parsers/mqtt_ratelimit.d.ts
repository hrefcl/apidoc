/**
 * Parser for ratelimit tags - defines MQTT rate limiting recommendations
 *
 * This parser handles the ratelimit tag that defines recommended rate limits
 * for MQTT publishing or subscribing. It extracts:
 * - Rate value (number)
 * - Time unit (second, minute, hour, day)
 * - Optional description
 *
 * @param content - Raw content from the ratelimit tag
 * @returns Parsed rate limit information, or null if parsing fails
 *
 * @example Messages per second
 * ```
 * // Input: "10/second Maximum telemetry frequency"
 * // Output: { rate: 10, unit: "second", description: "Maximum telemetry frequency" }
 * ```
 *
 * @example Commands per minute
 * ```
 * // Input: "5/minute Command rate limit per device"
 * // Output: { rate: 5, unit: "minute", description: "Command rate limit per device" }
 * ```
 *
 * @example Simple rate limit
 * ```
 * // Input: "100/hour"
 * // Output: { rate: 100, unit: "hour", description: "" }
 * ```
 *
 * @since 4.1.0
 * @public
 */
export declare function parse(content: string): {
    rate: number;
    unit: string;
    description: string;
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
//# sourceMappingURL=mqtt_ratelimit.d.ts.map