/**
 * Parser for exampleSubscribe tags - provides MQTT subscribe examples
 *
 * This parser handles the exampleSubscribe tag that provides examples of subscribing
 * to MQTT topics. It supports:
 * - mosquitto_sub command examples
 * - Expected message examples
 * - Multi-line content
 *
 * @param content - Raw content from the exampleSubscribe tag
 * @returns Parsed example information with title and content, or null if parsing fails
 *
 * @example mosquitto_sub command
 * ```
 * // Input: multiline content with mosquitto_sub command
 * // Output: { title: "Subscribe Example", content: "mosquitto_sub -h...", type: "bash" }
 * ```
 *
 * @example Expected message format
 * ```
 * // Input: JSON message format example
 * // Output: { title: "Expected Message", content: "{...}", type: "json" }
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
export declare const path = "local.exampleSubscribe";
/**
 * Processing method for this parser
 *
 * @internal
 */
export declare const method = "push";
//# sourceMappingURL=mqtt_example_subscribe.d.ts.map