/**
 * @code Parser - Main parser for generic code documentation
 *
 * Supports any programming language: Kotlin, Swift, Java, Python, Go, Rust, C++, etc.
 *
 * Usage: @code {type} name
 * Types: function, class, method, property, enum, interface, protocol, struct, extension, constant, module
 */

export function parse(content: string): { type: string; name: string } | null {
    // Pattern: @code {type} name
    const pattern = /^\s*\{([^}]+)\}\s+(.+)$/;
    const match = content.match(pattern);

    if (!match) {
        // Simple format: @code name (defaults to function type)
        const simpleName = content.trim();
        if (simpleName) {
            return {
                type: 'function',
                name: simpleName,
            };
        }
        return null;
    }

    return {
        type: match[1].trim().toLowerCase(),
        name: match[2].trim(),
    };
}

export const path = 'local.code';
export const method = 'insert';
export const extendRoot = true;
