/**
 * @codeType Parser - Type of code element
 *
 * Usage: @codeType type
 * Types: function, class, method, property, enum, interface, protocol, struct, extension, constant, module, trait, delegate
 */

export function parse(content: string): { type: string } | null {
    const type = content.trim().toLowerCase();
    if (!type) return null;
    return { type };
}

export const path = 'local';
export const method = 'insert';
