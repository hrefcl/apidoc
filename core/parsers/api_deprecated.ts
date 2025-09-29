/**
 * @file Parser for @apiDeprecated tags - handles API deprecation notices
 *
 * Processes @apiDeprecated tags to mark API endpoints as deprecated and
 * optionally include deprecation messages. Supports both simple boolean
 * deprecation flags and detailed deprecation notices with explanations.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 4.0.0
 * @internal
 */

import unindent from '../utils/unindent';

/**
 * Parse @apiDeprecated tag content and create deprecation metadata
 *
 * Extracts deprecation information from @apiDeprecated tags. If content
 * is provided, it creates a detailed deprecation notice. If no content
 * is provided, it creates a simple boolean deprecation flag.
 *
 * @param content - Raw content from the @apiDeprecated tag
 * @returns Deprecation metadata object
 *
 * @example Simple deprecation
 * ```typescript
 * // @apiDeprecated
 * parse('')
 * // Returns: { deprecated: true }
 * ```
 *
 * @example Deprecation with message
 * ```typescript
 * // @apiDeprecated This endpoint will be removed in v2.0. Use /v2/users instead.
 * parse('This endpoint will be removed in v2.0. Use /v2/users instead.')
 * // Returns: {
 * //   deprecated: {
 * //     content: 'This endpoint will be removed in v2.0. Use /v2/users instead.'
 * //   }
 * // }
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function parse(content) {
    const deprecated = content.trim();

    if (deprecated.length > 0) {
        return {
            deprecated: {
                content: unindent(deprecated),
            },
        };
    }

    return {
        deprecated: true,
    };
}

/**
 * Parser configuration for @apiDeprecated tags
 *
 * Defines the parser configuration including the parsing function,
 * data path, insertion method, and markdown processing options
 * for deprecation notices.
 *
 * @since 4.0.0
 * @internal
 */
module.exports = {
    /** Parser function for processing @apiDeprecated content */
    parse: parse,
    /** Data path where parsed content is stored (local scope) */
    path: 'local',
    /** Insertion method for the parsed data */
    method: 'insert',
    /** Fields that should be processed as Markdown */
    markdownFields: ['deprecated.content'],
    /** Fields where paragraph tags should be removed from Markdown */
    markdownRemovePTags: ['deprecated.content'],
};
