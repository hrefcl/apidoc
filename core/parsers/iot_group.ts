/**
 * Parser for @iotGroup tags - handles IoT element grouping
 *
 * This parser processes @iotGroup tags to extract and normalize IoT element groups.
 * Groups are used to organize related IoT code elements in documentation,
 * such as Sensors, GPIO, WiFi, System, etc.
 * @param content - Raw content from the iotGroup tag
 * @returns Object containing the normalized group name, or null if content is empty
 * @example Basic IoT group
 * ```
 * // Input: "Sensors"
 * // Output: { group: "Sensors" }
 * ```
 * @example Group with spaces
 * ```
 * // Input: "System Utilities"
 * // Output: { group: "System_Utilities" }
 * ```
 * @since 5.1.0
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
 * @internal
 */
export const path = 'local';

/**
 * Processing method for this parser
 * @internal
 */
export const method = 'insert';
