/**
 * @codeStatic Parser - Marks element as static/class-level
 *
 * Usage: @codeStatic [true|false]
 *
 * Example:
 *   @codeStatic
 *   @codeStatic true
 *   @codeStatic false
 */

export function parse(content: string): { isStatic: boolean } {
    const value = content.trim().toLowerCase();
    return {
        isStatic: value !== 'false',
    };
}

export const path = 'local.isStatic';
export const method = 'insert';
