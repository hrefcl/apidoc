/**
 * Parser for @iotName tags - defines the display name for IoT elements
 *
 * This parser processes @iotName tags to extract the human-readable name
 * for IoT code elements in documentation.
 * @param content - Raw content from the iotName tag
 * @returns Object containing the element name, or null if content is empty
 * @example Basic name
 * ```
 * // Input: "ReadTemperatureSensor"
 * // Output: { name: "ReadTemperatureSensor" }
 * ```
 * @since 5.1.0
 * @public
 */
export function parse(content: string): { name: string } | null {
    const name = content.trim();

    if (name.length === 0) {
        return null;
    }

    return {
        name: name,
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
