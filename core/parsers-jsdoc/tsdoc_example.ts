/**
 * @file Parser for @example tags - handles code examples documentation (TSDoc standard)
 *
 * This parser processes @example tags to extract code examples with optional titles.
 * Multiple @example tags are allowed per comment block.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

export interface ExampleInfo {
    title?: string;
    code: string;
}

/**
 * Parse @example tag to extract code examples with optional titles
 *
 * Processes @example tags following TSDoc standards:
 * - Multiple examples allowed
 * - Text on the same line as @example becomes the title
 * - Code follows on subsequent lines
 * - Supports syntax highlighting hints
 * @param content - Raw content from the @example tag
 * @returns Object containing example information, or null if no code content
 * @example Example with title
 * ```
 * // Input: "Basic usage\\n```typescript\\nconst result = calculate(5, 3);\\n```"
 * // Output: { title: "Basic usage", code: "```typescript\\nconst result = calculate(5, 3);\\n```" }
 * ```
 * @example Example without title
 * ```
 * // Input: "```javascript\\nconsole.log('Hello World');\\n```"
 * // Output: { code: "```javascript\\nconsole.log('Hello World');\\n```" }
 * ```
 * @example Multi-line example
 * ```
 * // Input: "Complex example\\n\\n```typescript\\ninterface User {\\n  name: string;\\n}\\n```"
 * // Output: {
 * //   title: "Complex example",
 * //   code: "```typescript\\ninterface User {\\n  name: string;\\n}\\n```"
 * // }
 * ```
 * @since 5.0.0
 * @public
 */
export function parse(content: string): ExampleInfo | null {
    if (!content.trim()) {
        return null;
    }

    // Split content by lines to detect title vs code
    const lines = content.split(/\r?\n/);
    const firstLine = lines[0]?.trim();

    // If first line doesn't start with code block or is not code-like,
    // treat it as title
    const looksLikeCode = /^```|^\/\/|^#|^\s*\*|^\s*const|^\s*let|^\s*var|^\s*function|^\s*class|^\s*interface|^\s*type/.test(firstLine || '');

    if (lines.length === 1 || looksLikeCode) {
        // No title, just code
        return {
            code: content.trim(),
        };
    } else {
        // First line is title, rest is code
        const title = firstLine;
        const code = lines.slice(1).join('\n').trim();

        if (!code) {
            // Only title, no code - treat title as code
            return {
                code: title,
            };
        }

        return {
            title: title,
            code: code,
        };
    }
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path = 'local.tsdocExamples';
export const method = 'push';
