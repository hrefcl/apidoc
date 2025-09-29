/**
 * @file Parser for @remarks tags - handles detailed remarks documentation (TSDoc standard)
 *
 * This parser processes @remarks tags to extract detailed documentation that follows
 * the summary. According to TSDoc, @remarks starts the "remarks" section and cuts off
 * the summary, continuing with detailed information.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

export interface RemarksInfo {
    description: string;
}

/**
 * Parse @remarks tag to extract detailed remarks
 *
 * Processes @remarks tags following TSDoc standards:
 * - Only one @remarks tag per comment block
 * - Separates summary from detailed documentation
 * - Supports markdown formatting and multi-line content
 * @param content - Raw content from the @remarks tag
 * @returns Object containing remarks description, or null if content is empty
 * @example Basic remarks
 * ```
 * // Input: "This function performs complex calculations and should be used carefully."
 * // Output: { description: "This function performs complex calculations and should be used carefully." }
 * ```
 * @example Multi-line remarks with markdown
 * ```
 * // Input: "**Important considerations:**\\n\\n1. Always validate input\\n2. Handle errors gracefully"
 * // Output: {
 * //   description: "**Important considerations:**\\n\\n1. Always validate input\\n2. Handle errors gracefully"
 * // }
 * ```
 * @example Empty remarks
 * ```
 * // Input: ""
 * // Output: null
 * ```
 * @since 5.0.0
 * @public
 */
export function parse(content: string): RemarksInfo | null {
    const description = content.trim();

    if (!description) {
        return null;
    }

    return {
        description: description,
    };
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path = 'local.tsdocRemarks';
export const method = 'insert';
