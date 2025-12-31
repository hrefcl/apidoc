/**
 * @file Parser for @iotSince tags - marks when a function was added
 *
 * This parser processes @iotSince tags to document the version when
 * a function or feature was first introduced.
 * @since 5.1.0
 */

/**
 * Parse @iotSince content
 * @param content Version string (e.g., "1.0.0", "2.1.0-beta")
 * @returns Parsed version info or null
 */
function parse(content: string): { since: string } | null {
    const since = content.trim();

    if (since.length === 0) {
        return null;
    }

    return {
        since: since,
    };
}

export const path = 'local';
export const method = 'insert';
export { parse };
