/**
 * @codeDeprecated Parser - Deprecation notice
 *
 * Usage: @codeDeprecated [message]
 *
 * Example:
 *   @codeDeprecated Use fetchUserAsync instead
 *   @codeDeprecated Will be removed in version 3.0
 *   @codeDeprecated
 */

export function parse(content: string): { deprecated: boolean; message: string } {
    return {
        deprecated: true,
        message: content.trim() || 'This element is deprecated',
    };
}

export const path = 'local.deprecated';
export const method = 'insert';
