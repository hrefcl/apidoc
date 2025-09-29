/**
 * Parser for examplePublish tags - provides MQTT publish examples
 *
 * This parser handles the examplePublish tag that provides examples of publishing
 * MQTT messages. It supports:
 * - mosquitto_pub command examples
 * - Payload examples
 * - Multi-line content
 * @param content - Raw content from the examplePublish tag
 * @returns Parsed example information with title and content, or null if parsing fails
 * @example mosquitto_pub command
 * ```
 * // Input: multiline content with mosquitto_pub command and payload
 * // Output: { title: "Publish Example", content: "mosquitto_pub -h...", type: "bash" }
 * ```
 * @example JSON payload only
 * ```
 * // Input: JSON payload example
 * // Output: { title: "Payload Example", content: "{...}", type: "json" }
 * ```
 * @since 4.1.0
 * @public
 */

import unindent from '../utils/unindent';

/**
 *
 * @param content
 */
export function parse(content: string): { title: string; content: string; type: string } | null {
    if (!content || !content.trim()) {
        return null;
    }

    // Remove leading/trailing whitespace but preserve internal structure
    content = content.trim();

    // Detect content type based on content
    let type = 'text';
    let title = 'Publish Example';

    // Check if it starts with mosquitto_pub
    if (content.includes('mosquitto_pub')) {
        type = 'bash';
        title = 'mosquitto_pub Command';
    }
    // Check if it looks like JSON
    else if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        type = 'json';
        title = 'Payload Example';
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
 * @internal
 */
export const path = 'local.examplePublish';

/**
 * Processing method for this parser
 * @internal
 */
export const method = 'push';
