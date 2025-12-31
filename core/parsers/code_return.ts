/**
 * @codeReturn Parser - Return value documentation
 *
 * Usage: @codeReturn {type} description
 */

export function parse(content: string): { type: string; description: string } | null {
    // Pattern: {type} description
    const pattern = /^\s*\{([^}]+)\}\s*(.*)$/;
    const match = content.match(pattern);

    if (!match) {
        if (!content.trim()) return null;
        return {
            type: 'any',
            description: content.trim(),
        };
    }

    return {
        type: match[1].trim(),
        description: match[2].trim(),
    };
}

export const path = 'local.returns';
export const method = 'insert';
