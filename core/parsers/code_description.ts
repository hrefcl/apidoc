/**
 * @codeDescription Parser - Detailed description of the code element
 *
 * Usage: @codeDescription description text
 */

export function parse(content: string): { description: string } | null {
    const description = content.trim();
    if (!description) return null;
    return { description };
}

export const path = 'local';
export const method = 'insert';
