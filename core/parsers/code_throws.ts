/**
 * @codeThrows Parser - Exceptions/errors that can be thrown
 *
 * Usage: @codeThrows {ExceptionType} description
 */

export function parse(content: string): { type: string; description: string } | null {
    // Pattern: {type} description
    const pattern = /^\s*\{([^}]+)\}\s*(.*)$/;
    const match = content.match(pattern);

    if (!match) {
        if (!content.trim()) return null;
        return {
            type: 'Error',
            description: content.trim(),
        };
    }

    return {
        type: match[1].trim(),
        description: match[2].trim(),
    };
}

export const path = 'local.throws';
export const method = 'push';
