/**
 * Parser for @modelGroup tag - groups related data models
 *
 * This parser handles the @modelGroup tag that organizes models into logical groups.
 * Similar to @apiGroup but specifically for model documentation.
 *
 * @example Basic group
 * ```typescript
 * // Input: "User Management"
 * // Output: { group: "User Management" }
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function parse(content: string): { group: string } | null {
    content = content.trim();

    if (content.length === 0) {
        return null;
    }

    return {
        group: content,
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

/**
 * Markdown fields (none for this parser)
 * @internal
 */
export const markdownFields: string[] = [];

/**
 * Markdown remove fields (none for this parser)
 * @internal
 */
export const markdownRemoveFields: string[] = [];
