/**
 * @file Parser for @see tags - handles reference links and cross-references
 *
 * This parser processes @see tags to extract reference links, internal references,
 * and external documentation links. See references are used for creating
 * navigational links and cross-references in generated documentation.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

/**
 * Interface for parsed see reference information
 */
interface SeeReference {
    see: string;
    seeType: 'url' | 'link' | 'reference';
    seeUrl?: string;
    seeTitle?: string;
    seeReference?: string;
}

/**
 * Parse @see tag to extract reference links and cross-references
 *
 * Processes @see tags supporting various formats including URLs, JSDoc links,
 * and internal references. Handles standard JSDoc notation patterns for
 * creating navigational and reference links.
 * @param content - Raw content from the @see tag
 * @returns Object containing reference information, or null if content is empty
 * @example URL reference
 * ```
 * // Input: "https://apidocjs.com"
 * // Output: {
 * //   see: "https://apidocjs.com",
 * //   seeType: "url",
 * //   seeUrl: "https://apidocjs.com"
 * // }
 * ```
 * @example JSDoc link with title
 * ```
 * // Input: "{@link https://apidocjs.com} Official documentation"
 * // Output: {
 * //   see: "{@link https://apidocjs.com} Official documentation",
 * //   seeType: "link",
 * //   seeUrl: "https://apidocjs.com",
 * //   seeTitle: "Official documentation"
 * // }
 * ```
 * @example JSDoc link with inline title
 * ```
 * // Input: "{@link https://apidocjs.com Official docs}"
 * // Output: {
 * //   see: "{@link https://apidocjs.com Official docs}",
 * //   seeType: "link",
 * //   seeUrl: "https://apidocjs.com",
 * //   seeTitle: "Official docs"
 * // }
 * ```
 * @example Internal reference
 * ```
 * // Input: "MyClass#method"
 * // Output: {
 * //   see: "MyClass#method",
 * //   seeType: "reference",
 * //   seeReference: "MyClass#method"
 * // }
 * ```
 * @example Plain text with title
 * ```
 * // Input: "https://example.com Documentation site"
 * // Output: {
 * //   see: "https://example.com Documentation site",
 * //   seeType: "url",
 * //   seeUrl: "https://example.com",
 * //   seeTitle: "Documentation site"
 * // }
 * ```
 * @since 5.0.0
 * @public
 */
export function parse(content: string): SeeReference | null {
    const seeText = content.trim();

    if (seeText.length === 0) {
        return null;
    }

    const result: SeeReference = {
        see: seeText,
        seeType: 'reference',
    };

    // Pattern 1: JSDoc link format {@link url title} or {@link url}
    const jsdocLinkMatch = seeText.match(/^{@link\s+([^\s}]+)(?:\s+([^}]+))?}(?:\s+(.+))?$/);

    if (jsdocLinkMatch) {
        result.seeType = 'link';
        result.seeUrl = jsdocLinkMatch[1];

        // Title can be inside the link or after it
        const inlineTitle = jsdocLinkMatch[2];
        const externalTitle = jsdocLinkMatch[3];

        if (externalTitle) {
            result.seeTitle = externalTitle;
        } else if (inlineTitle) {
            result.seeTitle = inlineTitle;
        }

        return result;
    }

    // Pattern 2: Plain URL (starts with http/https)
    const urlMatch = seeText.match(/^(https?:\/\/[^\s]+)(?:\s+(.+))?$/);

    if (urlMatch) {
        result.seeType = 'url';
        result.seeUrl = urlMatch[1];

        if (urlMatch[2]) {
            result.seeTitle = urlMatch[2];
        }

        return result;
    }

    // Pattern 3: Check if entire content is a URL
    if (seeText.match(/^https?:\/\//)) {
        result.seeType = 'url';
        result.seeUrl = seeText;
        return result;
    }

    // Pattern 4: Internal reference (everything else)
    result.seeType = 'reference';
    result.seeReference = seeText;

    return result;
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path: string = 'local';
export const method: string = 'insert';
