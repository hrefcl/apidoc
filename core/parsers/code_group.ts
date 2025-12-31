/**
 * @codeGroup Parser - Grouping for code elements (module, namespace, class)
 *
 * Usage: @codeGroup groupName
 */

export function parse(content: string): { group: string } | null {
    const group = content.trim();
    if (!group) return null;
    return { group };
}

export const path = 'local';
export const method = 'insert';
