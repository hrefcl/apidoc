/**
 * @file Parser for @iotSee tags - cross-references to related functions
 *
 * This parser processes @iotSee tags to create links to related
 * functions, documentation, or external resources.
 * @since 5.1.0
 */

/**
 * Parse @iotSee content
 * @param content Reference to other function or resource
 * @returns Parsed reference info or null
 * @example Function reference
 * ```
 * // Input: "readTemperatureAsync"
 * // Output: { reference: "readTemperatureAsync" }
 * ```
 * @example URL reference
 * ```
 * // Input: "https://docs.espressif.com/gpio"
 * // Output: { reference: "https://docs.espressif.com/gpio" }
 * ```
 */
function parse(content: string): { reference: string } | null {
    const reference = content.trim();

    if (reference.length === 0) {
        return null;
    }

    return {
        reference: reference,
    };
}

function path(): string {
    return 'local.see';
}

export { parse, path };
export const method = 'push';
