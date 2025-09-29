/**
 * Parser for examplePublish tags - provides MQTT publish examples
 *
 * This parser handles the examplePublish tag that provides examples of publishing
 * MQTT messages. It supports:
 * - mosquitto_pub command examples
 * - Payload examples
 * - Multi-line content
 *
 * @param content - Raw content from the examplePublish tag
 * @returns Parsed example information with title and content, or null if parsing fails
 *
 * @example mosquitto_pub command
 * ```
 * // Input: multiline content with mosquitto_pub command and payload
 * // Output: { title: "Publish Example", content: "mosquitto_pub -h...", type: "bash" }
 * ```
 *
 * @example JSON payload only
 * ```
 * // Input: JSON payload example
 * // Output: { title: "Payload Example", content: "{...}", type: "json" }
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
export declare const path = "local.examplePublish";
/**
 * Processing method for this parser
 *
 * @internal
 */
export declare const method = "push";
//# sourceMappingURL=mqtt_example_publish.d.ts.map