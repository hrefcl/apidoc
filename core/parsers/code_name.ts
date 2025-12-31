/**
 * @codeName Parser - Name of the code element
 *
 * Usage: @codeName name
 */

export function parse(content: string): { name: string } | null {
    const name = content.trim();
    if (!name) return null;
    return { name };
}

export const path = 'local';
export const method = 'insert';
