/**
 * Parser for payloadSchema tags - defines JSON Schema for MQTT payload validation
 *
 * This parser handles the payloadSchema tag that defines JSON Schema for validating
 * MQTT message payloads. It supports:
 * - Inline JSON Schema definitions
 * - External file references
 * - Schema validation with AJV
 *
 * @param content - Raw content from the payloadSchema tag
 * @returns Parsed schema information or null if parsing fails
 * @returns .type - Schema type ('inline' or 'file')
 * @returns .schema - The JSON Schema object (for inline) or file path (for file)
 * @returns .isValid - Whether the schema is valid JSON Schema
 *
 * @example Inline JSON Schema
 * ```
 * // Input: 'inline\n{"type": "object", "properties": {"temp": {"type": "number"}}}'
 * // Output: { type: "inline", schema: {...}, isValid: true }
 * ```
 *
 * @example External file reference
 * ```
 * // Input: "file schemas/telemetry.json"
 * // Output: { type: "file", schema: "schemas/telemetry.json", isValid: true }
 * ```
 *
 * @since 4.1.0
 * @public
 */
export declare function parse(content: string): {
    type: string;
    schema: any;
    isValid: boolean;
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
//# sourceMappingURL=mqtt_payload_schema.d.ts.map