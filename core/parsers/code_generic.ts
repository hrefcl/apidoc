/**
 * @codeGeneric Parser - Generic type parameters
 *
 * Usage: @codeGeneric {T} description
 *
 * Example:
 *   @codeGeneric {T} The type of elements in the list
 *   @codeGeneric {K} Key type
 *   @codeGeneric {V} Value type
 *   @codeGeneric {T: Comparable} Must implement Comparable
 */

export function parse(content: string): { name: string; constraint: string | null; description: string } | null {
    if (!content.trim()) return null;

    // Pattern: {type} description
    const pattern = /^\s*\{([^}]+)\}\s*(.*)$/;
    const match = content.match(pattern);

    if (!match) {
        return {
            name: content.trim(),
            constraint: null,
            description: '',
        };
    }

    const typeParam = match[1].trim();
    const colonIndex = typeParam.indexOf(':');

    if (colonIndex > -1) {
        return {
            name: typeParam.substring(0, colonIndex).trim(),
            constraint: typeParam.substring(colonIndex + 1).trim(),
            description: match[2].trim(),
        };
    }

    return {
        name: typeParam,
        constraint: null,
        description: match[2].trim(),
    };
}

export const path = 'local.generics';
export const method = 'push';
