/**
 * @codeLang Parser - Programming language
 *
 * Usage: @codeLang language
 * Languages: kotlin, swift, java, python, go, rust, cpp, c, csharp, javascript, typescript, ruby, php, dart, scala, etc.
 */

export function parse(content: string): { lang: string } | null {
    const lang = content.trim().toLowerCase();
    if (!lang) return null;
    return { lang };
}

export const path = 'local';
export const method = 'insert';
