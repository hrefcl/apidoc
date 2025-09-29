/**
 * @file Parser for @internal tags - handles internal API documentation (TSDoc standard)
 *
 * This parser processes @internal tags to mark APIs as internal-use only following
 * TSDoc release visibility standards. Internal APIs may be omitted from publication.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

export interface InternalInfo {
  visibility: 'internal';
  publishable: boolean;
}

/**
 * Parse @internal tag to mark API as internal-use only
 *
 * Processes @internal modifier tags following TSDoc standards:
 * - Indicates internal API not for public consumption
 * - May be omitted from published documentation
 * - No additional content expected
 *
 * @param content - Raw content from the @internal tag (usually empty)
 * @returns Object indicating internal visibility status
 *
 * @example Internal API marker
 * ```
 * // Input: ""
 * // Output: { visibility: "internal", publishable: false }
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function parse(content: string): InternalInfo {
  // @internal is a modifier tag with no content
  return {
    visibility: 'internal',
    publishable: false
  };
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path = 'local.tsdocVisibility';
export const method = 'insert';