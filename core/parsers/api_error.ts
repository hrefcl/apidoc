/**
 * @file Parser for @apiError tags - handles API error response documentation
 *
 * This parser processes @apiError tags to extract error response field definitions.
 * It reuses the @apiParam parsing logic but applies it specifically to error response
 * fields with the default group "Error 4xx".
 */

import { method as apiParamMethod, parse as apiParamParse, getGroup } from './api_param';

/**
 * Parse @apiError tag to extract error response field information
 *
 * Processes @apiError tags using the same syntax as @apiParam but specifically
 * for error response fields. Automatically assigns the "Error 4xx" group
 * unless a different group is specified in the tag.
 *
 * @param content - Raw content from the @apiError tag
 * @param source - Source file path (unused but required for interface compatibility)
 * @returns Parsed error response field information or null if parsing fails
 *
 * @example Basic error field
 * ```
 * // Input: "{String} message Error description"
 * // Output: { type: "String", field: "message", description: "Error description", group: "Error 4xx" }
 * ```
 *
 * @example Error field with specific status code
 * ```
 * // Input: "(Error 404) {String} message Resource not found"
 * // Output: { type: "String", field: "message", description: "Resource not found", group: "Error 404" }
 * ```
 *
 * @example Error object with nested fields
 * ```
 * // Input: "{Object} error Error details object"
 * // Output: { type: "Object", field: "error", description: "Error details object", group: "Error 4xx" }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export function parse(content: string, source: string): any {
    return apiParamParse(content, source, 'Error 4xx');
}

/**
 * Generate the data path for storing error response fields
 *
 * Constructs a hierarchical path string that determines where error response
 * field data is stored in the parsed API data structure. The path includes the
 * current group to organize fields by error status code or type.
 *
 * @returns Path string in format "local.error.fields.{group}"
 *
 * @example
 * ```
 * // If current group is "Error 4xx"
 * // Returns: "local.error.fields.Error 4xx"
 * ```
 *
 * @since 4.0.0
 * @internal
 */
export function path(): string {
    return 'local.error.fields.' + getGroup();
}

export const method = apiParamMethod;
export const markdownFields = ['description', 'type'];
export const markdownRemovePTags = ['type'];
