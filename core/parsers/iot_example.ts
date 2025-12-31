/**
 * @file Parser for @iotExample tags - handles IoT code examples
 *
 * This parser processes @iotExample tags to extract code examples showing
 * how to use IoT functions. Supports syntax highlighting hints.
 * @since 5.1.0
 */

/**
 * Parse @iotExample content
 *
 * Handles syntax like:
 * - `@iotExample {c} float temp = readTemperature(4);`
 * - `@iotExample Basic Usage: gpio_set_level(LED_PIN, 1);`
 * @param content Raw input string to be parsed
 * @returns Parsed example metadata or null
 * @example With language hint
 * ```
 * // Input: "{c} Basic Usage\nfloat temp = readTemperature(GPIO_NUM_4);"
 * // Output: { type: "c", title: "Basic Usage", content: "float temp = readTemperature(GPIO_NUM_4);" }
 * ```
 */
function parse(content: string): {
    type: string;
    title: string;
    content: string;
} | null {
    content = content.trim();

    if (content.length === 0) {
        return null;
    }

    // Replace Linebreak with Unicode for processing
    content = content.replace(/\n/g, '\uffff');

    // Search for optional type/language and title
    // Example: {c} Basic Usage
    // Example: {cpp} Arduino LED Control
    // Example: Timer Interrupt Setup (no type specified)
    const parseRegExp = /^(?:\{([a-zA-Z0-9_+-]+)\}\s*)?(.+?)(?:\uffff(.*))?$/;
    const matches = parseRegExp.exec(content);

    if (!matches) {
        return null;
    }

    // Reverse Unicode Linebreaks
    let title = matches[2] ? matches[2].trim() : '';
    let exampleContent = matches[3] ? matches[3].replace(/\uffff/g, '\n').trim() : '';

    // If no separate content, the title might actually be the content
    if (!exampleContent && title) {
        // Check if title looks like code (contains = or ; or ( )
        if (title.includes('=') || title.includes(';') || title.includes('(')) {
            exampleContent = title;
            title = '';
        }
    }

    return {
        type: matches[1] || 'c', // Default to C language
        title: title,
        content: exampleContent,
    };
}

/**
 * Target location in the data structure where parsed results are stored
 */
function path(): string {
    return 'local.examples';
}

export { parse, path };
export const method = 'push';
