/**
 * Parser for @modelDescription tag - detailed model description
 *
 * This parser handles the @modelDescription tag that provides detailed
 * documentation for the model. Supports markdown formatting.
 *
 * @example Basic description
 * ```typescript
 * // Input: "Complete user entity with authentication and access control"
 * // Output: { description: "Complete user entity with authentication and access control" }
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function parse(content: string): { description: string } | null {
    content = content.trim();

    if (content.length === 0) {
        return null;
    }

    return {
        description: content,
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
 * Markdown fields (enable markdown processing for description)
 * @internal
 */
export const markdownFields: string[] = ['description'];

/**
 * Markdown remove fields (none for this parser)
 * @internal
 */
export const markdownRemoveFields: string[] = [];
