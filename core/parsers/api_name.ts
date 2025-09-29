/**
 * @file Parser for @apiName tags - handles API endpoint naming
 *
 * This parser processes @apiName tags to extract and normalize API endpoint names.
 * Names are used for internal referencing and linking between documentation sections.
 */

/**
 * Parse @apiName tag to extract and normalize API endpoint name
 *
 * Processes @apiName tags by trimming whitespace and converting spaces to underscores
 * to create valid identifiers. Names are used for cross-referencing between API
 * documentation sections and generating internal links.
 * @param content - Raw content from the @apiName tag
 * @returns Object containing the normalized name, or null if content is empty
 * @example Basic name
 * ```
 * // Input: "GetUser"
 * // Output: { name: "GetUser" }
 * ```
 * @example Name with spaces
 * ```
 * // Input: "Get User Profile"
 * // Output: { name: "Get_User_Profile" }
 * ```
 * @example Empty content
 * ```
 * // Input: "   "
 * // Output: null
 * ```
 * @since 4.0.0
 * @public
 */
function parse(content: string): { name: string } | null {
    const name = content.trim();

    if (name.length === 0) {
        return null;
    }

    return {
        name: name.replace(/(\s+)/g, '_'),
    };
}

/**
 * Exports
 */
export { parse };
export const path = 'local';
export const method = 'insert';
