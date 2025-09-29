/**
 * @file Parser for @beta tags - handles beta API documentation (TSDoc standard)
 *
 * This parser processes @beta tags to mark APIs as beta/experimental stage following
 * TSDoc release visibility standards. Beta APIs are released for feedback but
 * not stable for production use.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

export interface BetaInfo {
  releaseStage: 'beta';
  experimental: boolean;
  productionReady: boolean;
}

/**
 * Parse @beta tag to mark API as beta/experimental stage
 *
 * Processes @beta modifier tags following TSDoc standards:
 * - Indicates API in beta/experimental stage
 * - Released for feedback and testing
 * - Not stable for production use
 * - No additional content expected
 *
 * @param content - Raw content from the @beta tag (usually empty)
 * @returns Object indicating beta release stage status
 *
 * @example Beta API marker
 * ```
 * // Input: ""
 * // Output: { releaseStage: "beta", experimental: true, productionReady: false }
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function parse(content: string): BetaInfo {
  // @beta is a modifier tag with no content
  return {
    releaseStage: 'beta',
    experimental: true,
    productionReady: false
  };
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path = 'local.tsdocReleaseStage';
export const method = 'insert';