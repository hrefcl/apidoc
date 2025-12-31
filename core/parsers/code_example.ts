/**
 * @codeExample Parser - Code usage examples
 *
 * Usage: @codeExample [title]
 *        code block follows...
 */

export function parse(content: string): { title: string; code: string } | null {
    if (!content.trim()) return null;

    const lines = content.split('\n');
    const firstLine = lines[0].trim();

    // Check if first line is a title or code
    let title = 'Example';
    let code = content;

    // If first line doesn't look like code, treat it as title
    if (firstLine && !firstLine.includes('(') && !firstLine.includes('{') &&
        !firstLine.includes('=') && !firstLine.includes(';') &&
        !firstLine.startsWith('//') && !firstLine.startsWith('#') &&
        !firstLine.startsWith('val ') && !firstLine.startsWith('let ') &&
        !firstLine.startsWith('var ') && !firstLine.startsWith('const ') &&
        !firstLine.startsWith('def ') && !firstLine.startsWith('func ') &&
        !firstLine.startsWith('fun ') && firstLine.length < 50) {
        title = firstLine;
        code = lines.slice(1).join('\n').trim();
    }

    return { title, code };
}

export const path = 'local.examples';
export const method = 'push';
