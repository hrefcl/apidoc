/**
 * Parser for qos tags - defines MQTT Quality of Service level
 *
 * This parser handles the qos tag that defines MQTT QoS levels. It extracts:
 * - QoS level (0, 1, or 2)
 * - Validates QoS value is within allowed range
 * @param content - Raw content from the qos tag
 * @returns Parsed QoS information or null if parsing fails
 * @returns .qos - MQTT QoS level (0, 1, or 2)
 * @example QoS 0 - At most once delivery
 * ```
 * // Input: "0"
 * // Output: { qos: 0 }
 * ```
 * @example QoS 1 - At least once delivery
 * ```
 * // Input: "1"
 * // Output: { qos: 1 }
 * ```
 * @example QoS 2 - Exactly once delivery
 * ```
 * // Input: "2"
 * // Output: { qos: 2 }
 * ```
 * @since 4.1.0
 * @public
 */
export function parse(content: string): { qos: number } | null {
    content = content.trim();

    // Parse QoS value
    const qosValue = parseInt(content, 10);

    // Validate QoS is 0, 1, or 2
    if (isNaN(qosValue) || qosValue < 0 || qosValue > 2) {
        return null;
    }

    return {
        qos: qosValue,
    };
}

/**
 * Target location in the data structure where parsed results are stored
 * @internal
 */
export const path = 'local';

/**
 * Processing method for this parser
 * @internal
 */
export const method = 'insert';
