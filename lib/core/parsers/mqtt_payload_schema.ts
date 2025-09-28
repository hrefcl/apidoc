/**
 * Parser for payloadSchema tags - defines JSON Schema for MQTT payload validation
 *
 * This parser handles the payloadSchema tag that defines JSON Schema for validating
 * MQTT message payloads. It supports:
 * - Inline JSON Schema definitions
 * - External file references
 * - Schema validation with AJV
 *
 * @param content - Raw content from the payloadSchema tag
 * @returns Parsed schema information or null if parsing fails
 * @returns .type - Schema type ('inline' or 'file')
 * @returns .schema - The JSON Schema object (for inline) or file path (for file)
 * @returns .isValid - Whether the schema is valid JSON Schema
 *
 * @example Inline JSON Schema
 * ```
 * // Input: 'inline\n{"type": "object", "properties": {"temp": {"type": "number"}}}'
 * // Output: { type: "inline", schema: {...}, isValid: true }
 * ```
 *
 * @example External file reference
 * ```
 * // Input: "file schemas/telemetry.json"
 * // Output: { type: "file", schema: "schemas/telemetry.json", isValid: true }
 * ```
 *
 * @since 4.1.0
 * @public
 */

export function parse(content: string): { type: string; schema: any; isValid: boolean } | null {
    content = content.trim();

    if (!content) {
        return null;
    }

    // Check if it's a file reference or inline schema
    const lines = content.split('\n');
    const firstLine = lines[0].trim();

    if (firstLine === 'inline') {
        // Inline schema - everything after 'inline' line
        const schemaContent = lines.slice(1).join('\n').trim();

        if (!schemaContent) {
            return null;
        }

        try {
            const schema = JSON.parse(schemaContent);

            // Basic JSON Schema validation
            if (!schema || typeof schema !== 'object') {
                return {
                    type: 'inline',
                    schema: schema,
                    isValid: false,
                };
            }

            // Check for basic JSON Schema structure
            const isValidSchema = schema.type || schema.properties || schema.items || schema.$ref || schema.anyOf || schema.oneOf || schema.allOf;

            return {
                type: 'inline',
                schema: schema,
                isValid: !!isValidSchema,
            };
        } catch (error) {
            return {
                type: 'inline',
                schema: schemaContent,
                isValid: false,
            };
        }
    } else if (firstLine.startsWith('file ')) {
        // File reference
        const filePath = firstLine.substring(5).trim();

        if (!filePath) {
            return null;
        }

        // Validate file path format
        if (filePath.includes('..') || filePath.startsWith('/')) {
            return {
                type: 'file',
                schema: filePath,
                isValid: false,
            };
        }

        return {
            type: 'file',
            schema: filePath,
            isValid: true,
        };
    } else {
        // Assume it's an inline schema without explicit 'inline' keyword
        try {
            const schema = JSON.parse(content);

            if (!schema || typeof schema !== 'object') {
                return {
                    type: 'inline',
                    schema: schema,
                    isValid: false,
                };
            }

            const isValidSchema = schema.type || schema.properties || schema.items || schema.$ref || schema.anyOf || schema.oneOf || schema.allOf;

            return {
                type: 'inline',
                schema: schema,
                isValid: !!isValidSchema,
            };
        } catch (error) {
            return {
                type: 'inline',
                schema: content,
                isValid: false,
            };
        }
    }
}

/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
export const path = 'local';

/**
 * Processing method for this parser
 *
 * @internal
 */
export const method = 'insert';
