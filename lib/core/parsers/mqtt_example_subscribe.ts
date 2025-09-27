/**
 * Parser for @exampleSubscribe tags - provides MQTT subscribe examples
 *
 * This parser handles the @exampleSubscribe tag that provides examples of subscribing
 * to MQTT topics. It supports:
 * - mosquitto_sub command examples
 * - Expected message examples
 * - Multi-line content
 *
 * @param content - Raw content from the @exampleSubscribe tag
 * @returns Parsed example information with title and content, or null if parsing fails
 *
 * @example mosquitto_sub command
 * ```
 * // Input: multiline content with mosquitto_sub command
 * // Output: { title: "Subscribe Example", content: "mosquitto_sub -h...", type: "bash" }
 * ```
 *
 * @example Expected message format
 * ```
 * // Input: JSON message format example
 * // Output: { title: "Expected Message", content: "{...}", type: "json" }
 * ```
 *
 * @since 4.1.0
 * @public
 */

import unindent from '../utils/unindent';

export function parse(content: string): { title: string; content: string; type: string } | null {
    if (!content || !content.trim()) {
        return null;
    }

    // Remove leading/trailing whitespace but preserve internal structure
    content = content.trim();

    // Detect content type based on content
    let type = 'text';
    let title = 'Subscribe Example';

    // Check if it starts with mosquitto_sub
    if (content.includes('mosquitto_sub')) {
        type = 'bash';
        title = 'mosquitto_sub Command';
    }
    // Check if it looks like JSON
    else if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        type = 'json';
        title = 'Expected Message';
    }
    // Check if it looks like a shell command
    else if (content.includes('$') || content.includes('#!/')) {
        type = 'bash';
        title = 'Command Example';
    }

    // Process the content - unindent for better formatting
    const processedContent = unindent(content);

    return {
        title: title,
        content: processedContent,
        type: type,
    };
}

/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
export const path = 'local.exampleSubscribe';

/**
 * Processing method for this parser
 *
 * @internal
 */
export const method = 'push';
