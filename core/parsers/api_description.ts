/**
 * @file Parser for @apiDescription tags - handles API endpoint descriptions
 *
 * This parser processes @apiDescription tags to extract detailed descriptions
 * for API endpoints. Descriptions provide comprehensive information about what
 * an endpoint does and how to use it.
 */

import unindent from '../utils/unindent';

/**
 * Parse @apiDescription tag to extract endpoint description
 *
 * Processes @apiDescription tags by trimming whitespace and unindenting
 * multi-line descriptions to create clean, readable documentation text.
 * The description supports markdown formatting and multi-line content.
 * @param content - Raw description content from the @apiDescription tag
 * @returns Object containing the processed description, or null if content is empty
 * @example Single line description
 * ```
 * // Input: "Retrieves user information by ID"
 * // Output: { description: "Retrieves user information by ID" }
 * ```
 * @example Multi-line description with markdown
 * ```
 * // Input: "Creates a new user account.\n\n**Requirements:**\n- Valid email\n- Strong password"
 * // Output: { description: "Creates a new user account.\n\n**Requirements:**\n- Valid email\n- Strong password" }
 * ```
 * @example Empty content
 * ```
 * // Input: "   "
 * // Output: null
 * ```
 * @since 4.0.0
 * @public
 */
function parse(content: string): { description: string } | null {
    const description = content.trim();

    if (description.length === 0) {
        return null;
    }

    return {
        description: unindent(description),
    };
}

/**
 * Export configuration for the description parser
 */
export { parse };
export const path = 'local';
export const method = 'insert';
export const markdownFields = ['description'];
