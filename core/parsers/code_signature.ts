/**
 * @codeSignature Parser - Full method/function signature
 *
 * Usage: @codeSignature signature
 */

export function parse(content: string): { signature: string } | null {
    const signature = content.trim();
    if (!signature) return null;
    return { signature };
}

export const path = 'local';
export const method = 'insert';
