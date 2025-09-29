"use strict";
/**
 * @file Parser for @apiSampleRequest tags - handles sample request URL configuration
 *
 * Processes @apiSampleRequest tags to extract URL patterns for interactive
 * sample request functionality in the documentation interface.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 4.0.0
 * @internal
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = exports.path = void 0;
exports.parse = parse;
/**
 * Parse @apiSampleRequest tag content to extract sample request URL
 *
 * Extracts and validates the URL for sample request functionality.
 * The URL can be a relative or absolute path that will be used to
 * enable interactive testing of the API endpoint.
 *
 * @param content - Raw URL content from the @apiSampleRequest tag
 * @returns Object containing the sample request URL, or null if invalid
 *
 * @example Basic sample request URL
 * ```typescript
 * // @apiSampleRequest https://api.example.com/v1/users
 * parse('https://api.example.com/v1/users')
 * // Returns: { url: 'https://api.example.com/v1/users' }
 * ```
 *
 * @example Relative URL
 * ```typescript
 * // @apiSampleRequest /api/v1/users
 * parse('/api/v1/users')
 * // Returns: { url: '/api/v1/users' }
 * ```
 *
 * @example Empty content
 * ```typescript
 * parse('')
 * // Returns: null
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function parse(content) {
    const url = content.trim();
    if (url.length === 0) {
        return null;
    }
    return {
        url: url,
    };
}
exports.path = 'local.sampleRequest';
exports.method = 'push';
//# sourceMappingURL=api_sample_request.js.map