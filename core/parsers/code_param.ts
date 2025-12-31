/**
 * @codeParam Parser - Function/method parameters
 *
 * Usage: @codeParam {type} name description
 *        @codeParam {type} [name] optional parameter
 *        @codeParam {type} [name=default] parameter with default value
 */

export function parse(content: string): any {
    // Pattern: {type} [name] or {type} name - description
    const pattern = /^\s*\{([^}]+)\}\s+(\[([^\]=]+)(?:=([^\]]+))?\]|(\S+))(?:\s+(.*))?$/;
    const match = content.match(pattern);

    if (!match) {
        return {
            type: 'any',
            field: content.trim(),
            description: '',
            optional: false,
        };
    }

    const type = match[1].trim();
    const isOptional = !!match[3];
    const name = match[3] || match[5] || '';
    const defaultValue = match[4]?.trim();
    const description = match[6]?.trim() || '';

    return {
        type,
        field: name.trim(),
        description,
        optional: isOptional,
        defaultValue,
    };
}

export const path = 'local.params';
export const method = 'push';
