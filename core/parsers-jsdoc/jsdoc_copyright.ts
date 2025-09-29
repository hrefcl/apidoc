/**
 * @file Parser for @copyright tags - handles copyright information
 *
 * This parser processes @copyright tags to extract copyright notices and year information.
 * Copyright information is used for legal attribution in generated documentation.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

/**
 * Interface for parsed copyright information
 */
interface CopyrightInfo {
    copyright: string;
    copyrightYear?: string;
    copyrightHolder?: string;
}

/**
 * Parse @copyright tag to extract copyright year and holder
 *
 * Processes @copyright tags supporting various formats including year-only,
 * holder-only, and combined year/holder formats. Handles standard copyright
 * notation patterns.
 * @param content - Raw content from the @copyright tag
 * @returns Object containing copyright information, or null if content is empty
 * @example Year and holder
 * ```
 * // Input: "2025 Href SpA"
 * // Output: {
 * //   copyright: "2025 Href SpA",
 * //   copyrightYear: "2025",
 * //   copyrightHolder: "Href SpA"
 * // }
 * ```
 * @example Year range
 * ```
 * // Input: "2020-2025 MyCompany Inc."
 * // Output: {
 * //   copyright: "2020-2025 MyCompany Inc.",
 * //   copyrightYear: "2020-2025",
 * //   copyrightHolder: "MyCompany Inc."
 * // }
 * ```
 * @example Holder only
 * ```
 * // Input: "Acme Corporation"
 * // Output: {
 * //   copyright: "Acme Corporation",
 * //   copyrightHolder: "Acme Corporation"
 * // }
 * ```
 * @example Year only
 * ```
 * // Input: "2025"
 * // Output: {
 * //   copyright: "2025",
 * //   copyrightYear: "2025"
 * // }
 * ```
 * @since 5.0.0
 * @public
 */
export function parse(content: string): CopyrightInfo | null {
    const copyrightText = content.trim();

    if (copyrightText.length === 0) {
        return null;
    }

    const result: CopyrightInfo = { copyright: copyrightText };

    // Pattern to match year(s) at the beginning: "2025", "2020-2025", etc.
    const yearMatch = copyrightText.match(/^(\d{4}(?:-\d{4})?)\s*(.+)?$/);

    if (yearMatch) {
        result.copyrightYear = yearMatch[1];
        if (yearMatch[2] && yearMatch[2].trim()) {
            result.copyrightHolder = yearMatch[2].trim();
        }
    } else {
        // If no year pattern found, treat entire content as holder
        // unless it's just a year
        if (/^\d{4}$/.test(copyrightText)) {
            result.copyrightYear = copyrightText;
        } else {
            result.copyrightHolder = copyrightText;
        }
    }

    return result;
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path: string = 'local';
export const method: string = 'insert';
