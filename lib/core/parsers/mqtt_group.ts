/**
 * Parser for @mqttGroup tags - handles MQTT endpoint grouping
 *
 * This parser processes @mqttGroup tags to extract and normalize MQTT endpoint groups.
 * Groups are used to organize related MQTT endpoints in the generated documentation,
 * separate from REST API groups.
 *
 * @param content - Raw content from the @mqttGroup tag
 * @returns Object containing the normalized group name, or null if content is empty
 *
 * @example Basic MQTT group
 * ```
 * // Input: "Telemetry"
 * // Output: { group: "Telemetry" }
 * ```
 *
 * @example MQTT group with spaces
 * ```
 * // Input: "Device Commands"
 * // Output: { group: "Device_Commands" }
 * ```
 *
 * @example Complex MQTT group
 * ```
 * // Input: "IoT / Sensor Data"
 * // Output: { group: "IoT_/_Sensor_Data" }
 * ```
 *
 * @example Empty content
 * ```
 * // Input: "   "
 * // Output: null
 * ```
 *
 * @since 4.1.0
 * @public
 */
export function parse(content: string): { group: string } | null {
    const group = content.trim();

    if (group.length === 0) {
        return null;
    }

    return {
        group: group.replace(/(\s+)/g, '_'),
    };
}

/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
export const path = 'local';

/**
 * Processing method for this parser
 *
 * @internal
 */
export const method = 'insert';
