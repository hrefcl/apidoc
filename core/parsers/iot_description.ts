/**
 * Parser for @iotDescription tags - detailed description for IoT elements
 *
 * This parser processes @iotDescription tags to extract detailed descriptions
 * for IoT code elements. Supports multiline content and markdown formatting.
 * @param content - Raw content from the iotDescription tag
 * @returns Object containing the description, or null if content is empty
 * @example Simple description
 * ```
 * // Input: "Reads temperature from DS18B20 sensor"
 * // Output: { description: "Reads temperature from DS18B20 sensor" }
 * ```
 * @example Multiline description
 * ```
 * // Input: "Reads temperature from DS18B20 sensor.\nSupports resolutions from 9 to 12 bits."
 * // Output: { description: "Reads temperature from DS18B20 sensor.\nSupports resolutions from 9 to 12 bits." }
 * ```
 * @since 5.1.0
 * @public
 */
export function parse(content: string): { description: string } | null {
    const description = content.trim();

    if (description.length === 0) {
        return null;
    }

    return {
        description: description,
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
