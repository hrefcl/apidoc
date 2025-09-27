/**
 * Parser for @topic tags - defines MQTT topic path with placeholders
 *
 * This parser handles the @topic tag that defines MQTT topic paths. It extracts:
 * - Complete topic path with placeholders
 * - Validates topic format
 *
 * @param content - Raw content from the @topic tag
 * @returns Parsed topic information or null if parsing fails
 * @returns .topic - MQTT topic path (e.g., 'v1/{tenant}/devices/{deviceId}/telemetry')
 *
 * @example Topic with placeholders
 * ```
 * // Input: "v1/{tenant}/devices/{deviceId}/telemetry"
 * // Output: { topic: "v1/{tenant}/devices/{deviceId}/telemetry" }
 * ```
 *
 * @example Simple topic
 * ```
 * // Input: "sensors/temperature"
 * // Output: { topic: "sensors/temperature" }
 * ```
 *
 * @example Topic with wildcards
 * ```
 * // Input: "devices/+/status"
 * // Output: { topic: "devices/+/status" }
 * ```
 *
 * @since 4.1.0
 * @public
 */
export function parse(content: string): { topic: string } | null {
    content = content.trim();

    if (!content) {
        return null;
    }

    // Basic validation for MQTT topic format
    // MQTT topics should not start with $ (reserved for system topics)
    // Should not contain null characters or be empty
    if (content.startsWith('$') && !content.startsWith('$share/')) {
        return null;
    }

    // Check for invalid characters
    if (content.includes('\0')) {
        return null;
    }

    return {
        topic: content,
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
