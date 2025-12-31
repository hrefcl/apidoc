/**
 * @codeVersion Parser - Version of the code element
 *
 * Usage: @codeVersion version
 *
 * Example:
 *   @codeVersion 1.0.0
 *   @codeVersion 2.3.1-beta
 */

export function parse(content: string): { version: string } | null {
    const version = content.trim();
    if (!version) return null;
    return { version };
}

export const path = 'local.version';
export const method = 'insert';
