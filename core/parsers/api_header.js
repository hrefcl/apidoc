"use strict";
/**
 * @file Parser for @apiHeader tags - handles HTTP header documentation
 *
 * This parser processes @apiHeader tags to extract HTTP header definitions.
 * It reuses the @apiParam parsing logic but applies it specifically to
 * HTTP headers with the default group "Header".
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownFields = exports.method = void 0;
exports.parse = parse;
exports.path = path;
const api_param_1 = require("./api_param");
/**
 * Parse @apiHeader tag to extract HTTP header information
 *
 * Processes @apiHeader tags using the same syntax as @apiParam but specifically
 * for HTTP headers. Automatically assigns the "Header" group unless a different
 * group is specified in the tag.
 *
 * @param content - Raw content from the @apiHeader tag
 * @param source - Source file path (unused but required for interface compatibility)
 * @returns Parsed header information or null if parsing fails
 *
 * @example Authorization header
 * ```
 * // Input: "{String} Authorization Bearer token for authentication"
 * // Output: { type: "String", field: "Authorization", description: "Bearer token for authentication", group: "Header" }
 * ```
 *
 * @example Content-Type header
 * ```
 * // Input: "{String} Content-Type=application/json Request content type"
 * // Output: { type: "String", field: "Content-Type", defaultValue: "application/json", description: "Request content type" }
 * ```
 *
 * @since 4.0.0
 * @public
 */
function parse(content, source) {
    return (0, api_param_1.parse)(content, source, 'Header');
}
/**
 * Generate the data path for storing header fields
 *
 * Constructs a hierarchical path string that determines where header field
 * data is stored in the parsed API data structure. The path includes the
 * current group to organize headers by type or category.
 *
 * @returns Path string in format "local.header.fields.{group}"
 *
 * @since 4.0.0
 * @internal
 */
function path() {
    return 'local.header.fields.' + (0, api_param_1.getGroup)();
}
exports.method = api_param_1.method;
exports.markdownFields = ['description'];
//# sourceMappingURL=api_header.js.map