/**
 * @file Parser for @author tags - handles author information
 *
 * This parser processes @author tags to extract author name and email information.
 * Author information is used for attribution in generated documentation.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

/**
 * Interface for parsed author information
 */
interface AuthorInfo {
    author: string;
    authorName?: string;
    authorEmail?: string;
}

/**
 * Parse @author tag to extract author name and email
 *
 * Processes @author tags supporting various formats including plain names,
 * email addresses, and combined name/email formats. Handles standard JSDoc
 * author notation patterns.
 *
 * @param content - Raw content from the @author tag
 * @returns Object containing author information, or null if content is empty
 *
 * @example Plain name
 * ```
 * // Input: "John Doe"
 * // Output: { author: "John Doe", authorName: "John Doe" }
 * ```
 *
 * @example Name with email
 * ```
 * // Input: "John Doe <john@example.com>"
 * // Output: {
 * //   author: "John Doe <john@example.com>",
 * //   authorName: "John Doe",
 * //   authorEmail: "john@example.com"
 * // }
 * ```
 *
 * @example Email only
 * ```
 * // Input: "john@example.com"
 * // Output: { author: "john@example.com", authorEmail: "john@example.com" }
 * ```
 *
 * @example Company format
 * ```
 * // Input: "Href Spa <hola@apidoc.app>"
 * // Output: {
 * //   author: "Href Spa <hola@apidoc.app>",
 * //   authorName: "Href Spa",
 * //   authorEmail: "hola@apidoc.app"
 * // }
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function parse(content: string): AuthorInfo | null {
    const authorText = content.trim();

    if (authorText.length === 0) {
        return null;
    }

    const result: AuthorInfo = { author: authorText };

    // Pattern to match "Name <email@domain.com>" format
    const nameEmailMatch = authorText.match(/^(.+?)\s*<([^>]+)>$/);

    if (nameEmailMatch) {
        // Name with email format
        result.authorName = nameEmailMatch[1].trim();
        result.authorEmail = nameEmailMatch[2].trim();
    } else if (authorText.includes('@')) {
        // Just email
        result.authorEmail = authorText;
    } else {
        // Just name
        result.authorName = authorText;
    }

    return result;
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path: string = 'local';
export const method: string = 'insert';