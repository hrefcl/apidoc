/**
 * @file Parser for @public tags - handles API visibility documentation (TSDoc standard)
 *
 * This parser processes @public tags to mark APIs as public and stable following
 * TSDoc release visibility standards. Public APIs have SemVer guarantees.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

export interface PublicInfo {
    visibility: 'public';
    stable: boolean;
}

/**
 * Parse @public tag to mark API as public and stable
 *
 * Processes @public modifier tags following TSDoc standards:
 * - Indicates public and stable API
 * - Subject to SemVer guarantees
 * - No additional content expected
 * @param content - Raw content from the @public tag (usually empty)
 * @returns Object indicating public visibility status
 * @example Public API marker
 * ```
 * // Input: ""
 * // Output: { visibility: "public", stable: true }
 * ```
 * @since 5.0.0
 * @public
 */
export function parse(content: string): PublicInfo {
    // @public is a modifier tag with no content
    return {
        visibility: 'public',
        stable: true,
    };
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path = 'local.tsdocVisibility';
export const method = 'insert';
