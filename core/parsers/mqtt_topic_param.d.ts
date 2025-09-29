/**
 * Parser for topicParam tags - handles MQTT topic parameter documentation
 *
 * This parser processes @topicParam tags to extract parameter definitions for MQTT topic placeholders.
 * It supports:
 * - Parameter data types
 * - Parameter descriptions
 * - Parameter validation rules
 *
 * @param content - Raw content from the topicParam tag
 * @returns Parsed parameter information or null if parsing fails
 *
 * @example Basic topic parameter
 * ```
 * // Input: "{String} tenant Tenant identifier"
 * // Output: { type: "String", name: "tenant", description: "Tenant identifier" }
 * ```
 *
 * @example Parameter with constraints
 * ```
 * // Input: "{String{3..50}} deviceId Device unique identifier"
 * // Output: { type: "String", size: "3..50", name: "deviceId", description: "Device unique identifier" }
 * ```
 *
 * @since 4.1.0
 * @public
 */
/**
 * Parse @topicParam content
 */
export declare function parse(content: string): any;
/**
 * Path where the parsed result will be stored
 */
export declare const path: () => string;
/**
 * Processing method for this parser
 */
export declare const method = "push";
//# sourceMappingURL=mqtt_topic_param.d.ts.map