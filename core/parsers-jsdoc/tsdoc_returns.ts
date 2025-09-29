/**
 * @file Parser for @returns tags - handles return value documentation (TSDoc standard)
 *
 * This parser processes @returns tags to extract return value documentation following
 * TSDoc standards. Only one @returns tag is allowed per function/method.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

export interface ReturnsInfo {
  description: string;
}

/**
 * Parse @returns tag to extract return value description
 *
 * Processes @returns tags following TSDoc standards:
 * - Single @returns tag per function
 * - Description only (no types, handled by TypeScript)
 * - Supports multi-line descriptions
 *
 * @param content - Raw content from the @returns tag
 * @returns Object containing return description, or null if content is empty
 *
 * @example Simple return description
 * ```
 * // Input: "The calculated result as a number"
 * // Output: { description: "The calculated result as a number" }
 * ```
 *
 * @example Multi-line return description
 * ```
 * // Input: "Promise that resolves to user data\\n\\nContains user profile and preferences"
 * // Output: {
 * //   description: "Promise that resolves to user data\\n\\nContains user profile and preferences"
 * // }
 * ```
 *
 * @example Empty return
 * ```
 * // Input: ""
 * // Output: null
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function parse(content: string): ReturnsInfo | null {
  const description = content.trim();

  if (!description) {
    return null;
  }

  return {
    description: description
  };
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path = 'local.tsdocReturns';
export const method = 'insert';