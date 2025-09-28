/**
 * Parser for errors tags - defines expected MQTT errors and failure scenarios
 *
 * This parser handles the errors tag that defines expected errors or failure
 * scenarios for MQTT operations. It extracts:
 * - Error descriptions
 * - Multi-line error scenarios
 *
 * @param content - Raw content from the errors tag
 * @returns Parsed error information with description, or null if parsing fails
 *
 * @example Connection errors
 * ```
 * // Input: "Connection refused due to invalid credentials"
 * // Output: { description: "Connection refused due to invalid credentials" }
 * ```
 *
 * @example Topic access errors
 * ```
 * // Input: "Topic access denied - insufficient permissions"
 * // Output: { description: "Topic access denied - insufficient permissions" }
 * ```
 *
 * @example Multi-line error scenarios
 * ```
 * // Input: multiline content with various error conditions
 * // Output: { description: "..." }
 * ```
 *
 * @since 4.1.0
 * @public
 */

import unindent from '../utils/unindent';

export function parse(content: string): { description: string } | null {
    if (!content || !content.trim()) {
        return null;
    }

    // Process the content - unindent for better formatting
    const processedContent = unindent(content.trim());

    return {
        description: processedContent,
    };
}

/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
export const path = 'local.errors';

/**
 * Processing method for this parser
 *
 * @internal
 */
export const method = 'push';