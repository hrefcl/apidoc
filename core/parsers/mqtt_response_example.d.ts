/**
 * Parser for responseExample tags - provides MQTT response examples
 *
 * This parser handles the responseExample tag that provides examples of response
 * messages for MQTT command/response patterns. It supports:
 * - JSON response examples
 * - Acknowledgment message examples
 * - Multi-line content
 *
 * @param content - Raw content from the responseExample tag
 * @returns Parsed response example with title and content, or null if parsing fails
 *
 * @example JSON acknowledgment
 * ```
 * // Input: JSON acknowledgment response
 * // Output: { title: "Response Example", content: "{...}", type: "json" }
 * ```
 *
 * @example Status response
 * ```
 * // Input: Status response message
 * // Output: { title: "Status Response", content: "...", type: "text" }
 * ```
 *
 * @since 4.1.0
 * @public
 */
export declare function parse(content: string): {
    title: string;
    content: string;
    type: string;
} | null;
/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
export declare const path = "local.responseExample";
/**
 * Processing method for this parser
 *
 * @internal
 */
export declare const method = "push";
//# sourceMappingURL=mqtt_response_example.d.ts.map