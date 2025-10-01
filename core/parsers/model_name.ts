/**
 * Parser for @modelName tag - unique identifier for model
 *
 * This parser handles the @modelName tag that provides a unique identifier
 * for referencing the model. Similar to @apiName but for models.
 *
 * @example Basic name
 * ```typescript
 * // Input: "UserModel"
 * // Output: { name: "UserModel" }
 * ```
 *
 * @since 5.0.0
 * @public
 */
export function parse(content: string): { name: string } | null {
    content = content.trim();

    if (content.length === 0) {
        return null;
    }

    return {
        name: content,
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
