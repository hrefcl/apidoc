/**
 * Parser for retain tags - defines MQTT retain flag
 *
 * This parser handles the retain tag that defines whether MQTT messages should be retained by the broker.
 * It extracts:
 * - Retain flag (true or false)
 * - Validates boolean value
 *
 * @param content - Raw content from the retain tag
 * @returns Parsed retain information or null if parsing fails
 * @returns .retain - MQTT retain flag (true or false)
 *
 * @example Retain enabled
 * ```
 * // Input: "true"
 * // Output: { retain: true }
 * ```
 *
 * @example Retain disabled
 * ```
 * // Input: "false"
 * // Output: { retain: false }
 * ```
 *
 * @example Alternative boolean values
 * ```
 * // Input: "1" or "yes" or "on"
 * // Output: { retain: true }
 * // Input: "0" or "no" or "off"
 * // Output: { retain: false }
 * ```
 *
 * @since 4.1.0
 * @public
 */
export declare function parse(content: string): {
    retain: boolean;
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
//# sourceMappingURL=mqtt_retain.d.ts.map