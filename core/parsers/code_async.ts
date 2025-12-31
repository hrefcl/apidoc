/**
 * @codeAsync Parser - Marks element as async/suspend/coroutine
 *
 * Usage: @codeAsync [true|false]
 *
 * Example:
 *   @codeAsync
 *   @codeAsync true
 *   @codeAsync false
 */

export function parse(content: string): { isAsync: boolean } {
    const value = content.trim().toLowerCase();
    return {
        isAsync: value !== 'false',
    };
}

export const path = 'local.isAsync';
export const method = 'insert';
