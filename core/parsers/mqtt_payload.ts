/**
 * Parser for payload tags - defines MQTT message payload type and description
 *
 * This parser handles the payload tag that defines MQTT message payload format.
 * It extracts:
 * - MIME type (application/json, text/plain, etc.)
 * - Optional description of payload content
 * @param content - Raw content from the payload tag
 * @returns Parsed payload information with mimeType and description, or null if parsing fails
 * @example JSON payload
 * ```
 * // Input: "application/json Device telemetry data"
 * // Output: { mimeType: "application/json", description: "Device telemetry data" }
 * ```
 * @example Plain text payload
 * ```
 * // Input: "text/plain Simple status message"
 * // Output: { mimeType: "text/plain", description: "Simple status message" }
 * ```
 * @example Binary payload
 * ```
 * // Input: "application/octet-stream Binary sensor data"
 * // Output: { mimeType: "application/octet-stream", description: "Binary sensor data" }
 * ```
 * @example MIME type only
 * ```
 * // Input: "application/xml"
 * // Output: { mimeType: "application/xml", description: "" }
 * ```
 * @since 4.1.0
 * @public
 */
export function parse(content: string): { mimeType: string; description: string } | null {
    content = content.trim();

    if (!content) {
        return null;
    }

    // Extract only the first line to avoid content from following tags
    const firstLine = content.split(/\n|@/)[0].trim();

    // Extract MIME type and optional description
    // Example: "application/json Device telemetry data"
    const parseRegExp =
        /^([a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*(?:\+[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*)?)\s*(.*)?$/;
    const matches = parseRegExp.exec(firstLine);

    if (!matches) {
        return null;
    }

    const mimeType = matches[1];
    const description = matches[2] ? matches[2].trim() : '';

    // Basic validation of MIME type format
    if (!mimeType || !mimeType.includes('/')) {
        return null;
    }

    return {
        mimeType: mimeType,
        description: description,
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
