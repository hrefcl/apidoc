/**
 * @file Parser for @license tags - handles license information
 *
 * This parser processes @license tags to extract license type and URL information.
 * License information is used for legal compliance in generated documentation.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

/**
 * Interface for parsed license information
 */
interface LicenseInfo {
    license: string;
    licenseType?: string;
    licenseUrl?: string;
}

/**
 * Parse @license tag to extract license type and optional URL
 *
 * Processes @license tags supporting various formats including license names,
 * URLs, and combined formats. Recognizes common open source licenses and
 * extracts structured information for documentation generation.
 * @param content - Raw content from the @license tag
 * @returns Object containing license information, or null if content is empty
 * @example Simple license name
 * ```
 * // Input: "MIT"
 * // Output: { license: "MIT", licenseType: "MIT" }
 * ```
 * @example License with URL
 * ```
 * // Input: "MIT https://opensource.org/licenses/MIT"
 * // Output: {
 * //   license: "MIT https://opensource.org/licenses/MIT",
 * //   licenseType: "MIT",
 * //   licenseUrl: "https://opensource.org/licenses/MIT"
 * // }
 * ```
 * @example URL only
 * ```
 * // Input: "https://example.com/license"
 * // Output: {
 * //   license: "https://example.com/license",
 * //   licenseUrl: "https://example.com/license"
 * // }
 * ```
 * @example Complex license
 * ```
 * // Input: "Apache-2.0"
 * // Output: { license: "Apache-2.0", licenseType: "Apache-2.0" }
 * ```
 * @since 5.0.0
 * @public
 */
export function parse(content: string): LicenseInfo | null {
    const licenseText = content.trim();

    if (licenseText.length === 0) {
        return null;
    }

    const result: LicenseInfo = { license: licenseText };

    // Check if content contains a URL
    const urlMatch = licenseText.match(/(https?:\/\/[^\s]+)/);

    if (urlMatch) {
        result.licenseUrl = urlMatch[1];

        // Extract license type (everything before the URL)
        const typeText = licenseText.replace(urlMatch[0], '').trim();
        if (typeText) {
            result.licenseType = typeText;
        }
    } else {
        // If no URL, check if the entire content is a URL
        if (licenseText.match(/^https?:\/\//)) {
            result.licenseUrl = licenseText;
        } else {
            // Treat as license type
            result.licenseType = licenseText;
        }
    }

    return result;
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path: string = 'local';
export const method: string = 'insert';
