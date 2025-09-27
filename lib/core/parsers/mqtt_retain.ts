/**
 * Parser for @retain tags - defines MQTT retain flag
 *
 * This parser handles the @retain tag that defines whether MQTT messages should be retained by the broker.
 * It extracts:
 * - Retain flag (true or false)
 * - Validates boolean value
 *
 * @param content - Raw content from the @retain tag
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
export function parse(content: string): { retain: boolean } | null {
    // Extract only the first line to avoid content from following tags
    const firstLine = content.split(/\n|@/)[0].trim().toLowerCase();

    let retainValue: boolean;

    // Parse boolean values in various formats
    switch (firstLine) {
        case 'true':
        case '1':
        case 'yes':
        case 'on':
            retainValue = true;
            break;
        case 'false':
        case '0':
        case 'no':
        case 'off':
            retainValue = false;
            break;
        default:
            return null; // Invalid boolean value
    }

    return {
        retain: retainValue,
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
