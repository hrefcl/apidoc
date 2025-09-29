/**
 * @file Parser for @param tags - handles parameter documentation (TSDoc standard)
 *
 * This parser processes @param tags to extract parameter documentation following
 * TSDoc standards. Unlike JSDoc, TSDoc enforces the format: @param name - description
 * (no types in TSDoc since TypeScript provides them).
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

export interface ParamInfo {
    name: string;
    description: string;
    optional?: boolean;
}

/**
 * Parse @param tag to extract parameter name and description
 *
 * Processes @param tags following TSDoc standards:
 * - Format: @param paramName - description
 * - Optional parameters detected by name (paramName?)
 * - No type information (handled by TypeScript)
 * @param content - Raw content from the @param tag
 * @returns Object containing parameter information, or null if content is invalid
 * @example Basic parameter
 * ```
 * // Input: "userName - The user's display name"
 * // Output: { name: "userName", description: "The user's display name" }
 * ```
 * @example Optional parameter
 * ```
 * // Input: "maxRetries? - Maximum number of retry attempts"
 * // Output: {
 * //   name: "maxRetries",
 * //   description: "Maximum number of retry attempts",
 * //   optional: true
 * // }
 * ```
 * @example Multi-line description
 * ```
 * // Input: "config - Configuration object\\n\\nContains all settings for initialization"
 * // Output: {
 * //   name: "config",
 * //   description: "Configuration object\\n\\nContains all settings for initialization"
 * // }
 * ```
 * @since 5.0.0
 * @public
 */
export function parse(content: string): ParamInfo | null {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
        return null;
    }

    // TSDoc format: @param paramName - description
    // Optional parameters: @param paramName? - description
    const paramRegExp = /^([a-zA-Z_$][a-zA-Z0-9_$]*)\??(?:\s*-\s*)?(.*)$/;
    const matches = paramRegExp.exec(trimmedContent);

    if (!matches) {
        return null;
    }

    const paramName = matches[1];
    const description = matches[2]?.trim() || '';
    const optional = trimmedContent.includes(paramName + '?');

    const result: ParamInfo = {
        name: paramName,
        description: description,
    };

    if (optional) {
        result.optional = true;
    }

    return result;
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path = 'local.tsdocParams';
export const method = 'push';
