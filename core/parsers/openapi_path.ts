/**
 * Parser for @openapi-path tags - OpenAPI path-specific definitions
 *
 * Allows defining specific OpenAPI paths with their operations and converts them
 * to APIDoc-compatible format for seamless navigation integration.
 * @example OpenAPI path definition
 * ```javascript
 * /**
 *  @openapi-path /users/{id}
 *  get:
 *  summary: Get user by ID
 *  tags: [Users]
 *  parameters:
 *  - name: id
 *  in: path
 *  required: true
 *  schema:
 *  type: integer
 *  responses:
 *  200:
 *  description: Success
 *  /
 * ```
 * @since 4.0.0
 * @public
 */

import * as YAML from 'js-yaml';

// Default version for OpenAPI operations when not specified
const DEFAULT_OPENAPI_VERSION = '4.0.0';

// APIDoc-compatible result structure
interface ApiDocCompatibleResult {
    type?: string; // HTTP method (get, post, etc.)
    url?: string; // API endpoint path
    title?: string; // Operation summary
    name?: string; // Operation ID or generated name
    group?: string; // Group name (from tags)
    description?: string; // Operation description
    version?: string; // API version
    openapi?: any; // Full OpenAPI data for advanced processing
}

/**
 * Parse @openapi-path content and convert to APIDoc-compatible format
 *
 * Expected format:
 * @openapi-path /path/to/endpoint
 * operation_definition_in_yaml_or_json
 * @param content - Raw content from the @openapi-path tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
export function parse(content: string): ApiDocCompatibleResult | null {
    if (!content || content.trim().length === 0) {
        return null;
    }

    content = content.trim();

    try {
        // Split content into path and definition
        const lines = content.split('\n');
        const pathLine = lines[0].trim();
        const definitionLines = lines.slice(1).join('\n').trim();

        if (!pathLine) {
            return null;
        }

        // Extract path (should start with /)
        let path = pathLine;
        if (!path.startsWith('/')) {
            // Maybe the path is in the first word
            const words = pathLine.split(/\s+/);
            const pathWord = words.find((word) => word.startsWith('/'));
            if (pathWord) {
                path = pathWord;
            } else {
                return null;
            }
        }

        let operationsDefinition: any = {};

        if (definitionLines) {
            // Parse the operations definition
            try {
                if (definitionLines.startsWith('{') || definitionLines.startsWith('[')) {
                    // JSON format
                    operationsDefinition = JSON.parse(definitionLines);
                } else {
                    // YAML format
                    operationsDefinition = YAML.load(definitionLines) || {};
                }
            } catch (parseError) {
                console.warn(`[OpenAPI Path Parser] Failed to parse operations for ${path}: ${parseError.message}`);
                operationsDefinition = {};
            }
        }

        return processPathDefinition(path, operationsDefinition);
    } catch (error) {
        console.warn(`[OpenAPI Path Parser] Failed to parse content: ${error.message}`);
        return null;
    }
}

/**
 * Process the path and operations definition for APIDoc compatibility
 * @param path
 * @param operations
 */
function processPathDefinition(path: string, operations: any): ApiDocCompatibleResult | null {
    // Find the first HTTP method in the operations
    const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'];
    const method = httpMethods.find((m) => operations[m]);

    if (!method) {
        return null;
    }

    const operation = operations[method];
    const result: ApiDocCompatibleResult = {
        type: method.toLowerCase(),
        url: convertOpenApiPathToApiDoc(path),
        title: operation.summary || operation.operationId || `${method.toUpperCase()} ${path}`,
        name: operation.operationId || generateOperationName(method, path),
        description: operation.description || '',
        version: extractVersionFromOperation(operation) || DEFAULT_OPENAPI_VERSION || '4.0.0',
        openapi: { paths: { [path]: operations } },
    };

    // Convert OpenAPI tags to APIDoc group
    // Priority: x-group > tags[0] > default
    if (operation['x-group']) {
        result.group = operation['x-group'].replace(/\s+/g, '_');
    } else if (operation.tags && operation.tags.length > 0) {
        result.group = operation.tags[0].replace(/\s+/g, '_');
    }

    return result;
}

/**
 * Convert OpenAPI path format to APIDoc format
 * Converts {param} to :param for APIDoc compatibility
 * @param openApiPath
 */
function convertOpenApiPathToApiDoc(openApiPath: string): string {
    return openApiPath.replace(/\{([^}]+)\}/g, ':$1');
}

/**
 * Generate operation name from method and path
 * @param method
 * @param path
 */
function generateOperationName(method: string, path: string): string {
    // Convert path to camelCase operation name
    // e.g., GET /users/{id} -> getUsersId
    const cleanPath = path.replace(/[{}/:]/g, ' ').trim();
    const words = cleanPath.split(/\s+/).filter((w) => w.length > 0);
    const camelCase = method.toLowerCase() + words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    return camelCase;
}

/**
 * Extract version from OpenAPI operation
 * Looks for version in various places: x-version extension, tags, etc.
 * @param operation
 */
function extractVersionFromOperation(operation: any): string | null {
    // Check for x-version extension
    if (operation['x-version']) {
        return operation['x-version'];
    }

    // Check for version in tags (e.g., "v1.0", "version:1.0")
    if (operation.tags && operation.tags.length > 0) {
        for (const tag of operation.tags) {
            const versionMatch = tag.match(/^v?(\d+\.\d+(?:\.\d+)?)$/i);
            if (versionMatch) {
                return versionMatch[1];
            }
            const versionPrefixMatch = tag.match(/^version:?[\s-]*(\d+\.\d+(?:\.\d+)?)$/i);
            if (versionPrefixMatch) {
                return versionPrefixMatch[1];
            }
        }
    }

    return null;
}

/**
 * APIDoc parser exports
 */
export const path = 'local';
export const method = 'insert';
