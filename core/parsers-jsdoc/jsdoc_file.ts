/**
 * @file Parser for @file tags - handles file-level documentation
 *
 * This parser processes @file tags to extract file-level descriptions and metadata.
 * File-level documentation provides context about the entire file's purpose and contents.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

/**
 * Parse @file tag to extract file-level description
 *
 * Processes @file tags by extracting the description text that follows the tag.
 * This information is used to generate file-level documentation sections that
 * appear at the top of generated documentation.
 *
 * @param content - Raw content from the @file tag
 * @returns Object containing the file description, or null if content is empty
 *
 * @example Basic file description
 * ```
 * // Input: "Main entry point for the APIDoc library"
 * // Output: { fileDescription: "Main entry point for the APIDoc library" }
 * ```
 *
 * @example Multi-line description
 * ```
 * // Input: "Authentication utilities\n\nProvides JWT and OAuth2 helpers"
 * // Output: {
 * //   fileDescription: "Authentication utilities",
 * //   fileDescriptionLong: "Authentication utilities\n\nProvides JWT and OAuth2 helpers"
 * // }
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function parse(content: string): { fileDescription: string; fileDescriptionLong?: string } | null {
    const description = content.trim();

    if (description.length === 0) {
        return null;
    }

    // Split by double newlines to separate short vs long description
    const parts = description.split(/\n\s*\n/);
    const shortDescription = parts[0].trim();

    if (parts.length > 1) {
        return {
            fileDescription: shortDescription,
            fileDescriptionLong: description
        };
    }

    return {
        fileDescription: shortDescription
    };
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path: string = 'local';
export const method: string = 'insert';