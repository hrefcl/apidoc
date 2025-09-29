/**
 * Parser for MQTT tags - defines MQTT operation type (publish or subscribe)
 *
 * This parser handles the main MQTT tag that defines MQTT endpoints. It extracts:
 * - Operation type (publish or subscribe)
 * - Optional description
 * @param content - Raw content from the MQTT tag
 * @returns Parsed MQTT information or null if parsing fails
 * @returns Object with .type (MQTT operation type 'publish' or 'subscribe') and .title (optional title/description)
 * @example Basic MQTT publish
 * ```
 * // Input: "publish Send device telemetry"
 * // Output: { type: "publish", title: "Send device telemetry" }
 * ```
 * @example Basic MQTT subscribe
 * ```
 * // Input: "subscribe Receive device commands"
 * // Output: { type: "subscribe", title: "Receive device commands" }
 * ```
 * @example MQTT without description
 * ```
 * // Input: "publish"
 * // Output: { type: "publish", title: "" }
 * ```
 * @since 4.1.0
 * @public
 */
export function parse(content: string): { type: string; title: string } | null {
    content = content.trim();

    // Extract only the first line (up to \n or @)
    const firstLine = content.split(/\n|@/)[0].trim();

    // Search: operation type and optional title
    // Example: publish Send device telemetry data
    // Example: subscribe Receive commands from server
    const parseRegExp = /^(publish|subscribe)(?:\s+(.+?))?$/;
    const matches = parseRegExp.exec(firstLine);

    if (!matches) {
        return null;
    }

    const type = matches[1];

    // Validate operation type
    if (type !== 'publish' && type !== 'subscribe') {
        return null;
    }

    return {
        type: type,
        title: matches[2] || '',
    };
}

/**
 * Target location in the data structure where parsed results are stored
 * @internal
 */
export const path = 'local';

/**
 * Processing method for this parser
 * @internal
 */
export const method = 'insert';
