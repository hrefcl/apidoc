/**
 * @file Parser for @alpha tags - handles alpha API documentation (TSDoc standard)
 *
 * This parser processes @alpha tags to mark APIs as alpha stage following
 * TSDoc release visibility standards. Alpha APIs are not released yet and
 * may be hidden in public builds.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

export interface AlphaInfo {
  releaseStage: 'alpha';
  released: boolean;
  hideInPublic: boolean;
}

/**
 * Parse @alpha tag to mark API as alpha stage
 *
 * Processes @alpha modifier tags following TSDoc standards:
 * - Indicates API in alpha stage
 * - Not yet released to public
 * - May be hidden in public documentation builds
 * - No additional content expected
 *
 * @param content - Raw content from the @alpha tag (usually empty)
 * @returns Object indicating alpha release stage status
 *
 * @example Alpha API marker
 * ```
 * // Input: ""
 * // Output: { releaseStage: "alpha", released: false, hideInPublic: true }
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function parse(content: string): AlphaInfo {
  // @alpha is a modifier tag with no content
  return {
    releaseStage: 'alpha',
    released: false,
    hideInPublic: true
  };
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path = 'local.tsdocReleaseStage';
export const method = 'insert';