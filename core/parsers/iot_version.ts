/**
 * Parser for @iotVersion tags - defines version for IoT elements
 *
 * This parser processes @iotVersion tags to extract semantic version information
 * for IoT code elements. Supports standard semver format (major.minor.patch).
 * @param content - Raw content from the iotVersion tag
 * @returns Object containing the version string, or null if content is empty
 * @example Basic version
 * ```
 * // Input: "1.0.0"
 * // Output: { version: "1.0.0" }
 * ```
 * @example Version with prerelease
 * ```
 * // Input: "2.1.0-beta"
 * // Output: { version: "2.1.0-beta" }
 * ```
 * @since 5.1.0
 * @public
 */
export function parse(content: string): { version: string } | null {
    const version = content.trim();

    if (version.length === 0) {
        return null;
    }

    return {
        version: version,
    };
}

/**
 * Target location in the data structure where parsed results are stored
 * @internal
 */
export const path = 'local';

/**
 * Processing method for this parser
 * @internal
 */
export const method = 'insert';
