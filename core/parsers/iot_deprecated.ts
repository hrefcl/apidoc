/**
 * @file Parser for @iotDeprecated tags - marks deprecated functions
 *
 * This parser processes @iotDeprecated tags to document deprecated
 * functions with optional replacement suggestions.
 * @since 5.1.0
 */

/**
 * Parse @iotDeprecated content
 * @param content Deprecation message and replacement info
 * @returns Parsed deprecation info or null
 * @example Basic deprecation
 * ```
 * // Input: "Use readTemperatureV2() instead"
 * // Output: { deprecated: true, message: "Use readTemperatureV2() instead" }
 * ```
 */
function parse(content: string): { deprecated: boolean; message: string } | null {
    const message = content.trim();

    return {
        deprecated: true,
        message: message,
    };
}

export const path = 'local';
export const method = 'insert';
export { parse };
