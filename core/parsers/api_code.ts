/**
 * @file Parser for @apiCode tags - handles code examples from external files
 *
 * This parser processes @apiCode tags to load code examples from external files.
 * Supports multiple languages and automatic syntax highlighting based on file extension.
 */

import fs from 'fs';
import nodePath from 'path';

/**
 * Parse @apiCode tag to load code from external file
 *
 * Processes @apiCode tags to load code examples from files with language specification.
 * Supports automatic language detection from file extension.
 *
 * @param content - Raw content from the @apiCode tag (file path)
 * @param source - Source metadata containing type and title information
 * @returns Object containing title, content, and type, or null if file not found
 *
 * @example JavaScript example from file
 * ```
 * // Input: "@apiCode (javascript) {file=examples/auth.js} JavaScript Example"
 * // Output: { title: "JavaScript Example", content: "const token = ...", type: "javascript" }
 * ```
 *
 * @example cURL example from file
 * ```
 * // Input: "@apiCode (curl) {file=examples/curl.sh} cURL Example"
 * // Output: { title: "cURL Example", content: "curl -X GET ...", type: "curl" }
 * ```
 *
 * @since 5.0.5
 * @public
 */
function parse(content: string, source: string): { title: string; content: string; type: string } | null {
    source = source.trim();

    // Parse: @apiCode (type) {file=path} title
    const parseRegExp = /^(?:@\w+)?\s*(?:\(([a-zA-Z0-9_-]+)\))?\s*\{file=([^}]+)\}\s*(.*)$/;
    const matches = parseRegExp.exec(source);

    if (!matches) {
        console.warn(`Warning: Could not parse @apiCode syntax: ${source}`);
        return null;
    }

    const type = matches[1] || detectLanguageFromExtension(matches[2]);
    const filePath = matches[2];
    const title = matches[3] || 'Code Example';

    // The content parameter contains the full source file path context
    // We need to extract the actual source file directory from the parser context
    // This will be handled by the processor hook

    return {
        title,
        content: filePath, // Store file path, will be resolved by processor
        type,
    };
}

/**
 * Detect programming language from file extension
 *
 * @param filePath - Path to the code file
 * @returns Language identifier for syntax highlighting
 *
 * @internal
 */
function detectLanguageFromExtension(filePath: string): string {
    const ext = nodePath.extname(filePath).toLowerCase();

    const extensionMap: Record<string, string> = {
        '.js': 'javascript',
        '.ts': 'typescript',
        '.py': 'python',
        '.java': 'java',
        '.rb': 'ruby',
        '.php': 'php',
        '.go': 'go',
        '.rs': 'rust',
        '.cpp': 'cpp',
        '.c': 'c',
        '.cs': 'csharp',
        '.sh': 'bash',
        '.bash': 'bash',
        '.ps1': 'powershell',
        '.json': 'json',
        '.xml': 'xml',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.md': 'markdown',
        '.html': 'html',
        '.css': 'css',
        '.sql': 'sql',
        '.kt': 'kotlin',
        '.swift': 'swift',
        '.dart': 'dart',
    };

    return extensionMap[ext] || 'text';
}

/**
 * Processor hook to load code from external files
 *
 * @param elements - Current array of parsed APIDoc elements
 * @param element - The @apiCode element being processed
 * @param block - Complete documentation block context
 * @param filename - Source file path for resolving relative paths
 * @returns Updated elements array with code content loaded
 *
 * @internal
 */
function processor(elements: Array<any>, element: any, block: any, filename: string): Array<any> {
    if (element.name !== 'apicode') {
        return elements;
    }

    // Remove the @apiCode element from the elements array
    // The element parameter IS the code element we need to process
    elements.pop();

    // Parse the content to extract file path, type, and title
    // Content format: "(type) {file=path} title"
    const parseRegExp = /^(?:\(([a-zA-Z0-9_-]+)\))?\s*\{file=([^}]+)\}\s*(.*)$/;
    const matches = parseRegExp.exec(element.content);

    if (!matches) {
        console.warn(`Warning: Could not parse @apiCode content: ${element.content}`);
        return elements;
    }

    const type = matches[1] || detectLanguageFromExtension(matches[2]);
    const filePath = matches[2];
    const title = matches[3] || 'Code Example';

    try {
        const fullPath = nodePath.resolve(nodePath.dirname(filename), filePath);

        // Read code file
        const codeContent = fs.readFileSync(fullPath, 'utf8');

        // Create new example element with loaded code
        // We need to create an element that the @apiExample parser can process.
        // However, since we're in a processor hook that runs AFTER parsing,
        // we need to manually create the correct structure.

        // Strategy: Create an element with the correct structure that matches
        // what @apiExample parser would create, but we do it manually.

        // The @apiExample parser creates: {title, content, type}
        // and that gets pushed to 'local.examples' array

        const newElement = {
            source: `@apiExample {${type}} ${title}\n${codeContent}`,
            name: 'apiexample',
            sourceName: 'apiExample',
            content: codeContent, // Just the code content
            local: {
                // Manually create the structure that would be created by method='push' and path='local.examples'
                examples: [
                    {
                        title: title,
                        content: codeContent.trim(),
                        type: type,
                    },
                ],
            },
        };

        elements.push(newElement);
    } catch (error) {
        console.warn(`Warning: Could not load code file: ${error.message}`);
    }

    return elements;
}

/**
 * Initialize the @apiCode parser
 *
 * @param app - APIDoc application instance
 *
 * @internal
 */
function init(app: any) {
    // Priority 300: LATE - after most parsers run, so we have access to parsed data
    app.addHook('parser-find-elements', processor, 300);
}

export { parse, init };
export const path = 'local.examples';
export const method = 'push';
