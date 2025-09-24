/**
 * Parser for @openapi-operation tags - OpenAPI operation definitions
 *
 * Allows defining specific OpenAPI operations with detailed parameters,
 * request bodies, and responses using standard OpenAPI syntax. Operations
 * are automatically converted to APIDoc-compatible format for navigation.
 *
 * @example OpenAPI operation definition
 * ```javascript
 * /**
 *  * @openapi-operation
 *  * summary: Create a new user
 *  * description: Creates a new user account with the provided information
 *  * operationId: createUser
 *  * tags:
 *  *   - Users
 *  * requestBody:
 *  *   required: true
 *  *   content:
 *  *     application/json:
 *  *       schema:
 *  *         $ref: '#/components/schemas/CreateUserRequest'
 *  * responses:
 *  *   201:
 *  *     description: User created successfully
 *  * /
 * ```
 *
 * @since 4.0.0
 * @public
 */

import * as YAML from 'js-yaml';

// Default version for OpenAPI operations when not specified
const DEFAULT_OPENAPI_VERSION = '4.0.0';

// APIDoc-compatible result structure
interface ApiDocCompatibleResult {
    type?: string;        // Operation type identifier
    name?: string;        // Operation ID or generated name
    title?: string;       // Operation summary
    group?: string;       // Group name (from tags)
    description?: string; // Operation description
    version?: string;     // API version
    openapi?: any;        // Full OpenAPI data for advanced processing
}

/**
 * Parse @openapi-operation content and convert to APIDoc-compatible format
 *
 * @param content - Raw content from the @openapi-operation tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
export function parse(content: string): ApiDocCompatibleResult | null {
    if (!content || content.trim().length === 0) {
        return null;
    }

    content = content.trim();

    try {
        let operationDef: any = {};

        // Parse the operation definition
        if (content.startsWith('{') || content.startsWith('[')) {
            // JSON format
            operationDef = JSON.parse(content);
        } else {
            // YAML format
            operationDef = YAML.load(content) || {};
        }

        if (!operationDef || typeof operationDef !== 'object') {
            return null;
        }

        return processOperationDefinition(operationDef);

    } catch (error) {
        console.warn(`[OpenAPI Operation Parser] Failed to parse content: ${error.message}`);
        return null;
    }
}

/**
 * Process the operation definition for APIDoc compatibility
 */
function processOperationDefinition(operation: any): ApiDocCompatibleResult {
    const name = operation.operationId || operation.summary || 'Operation';

    const result: ApiDocCompatibleResult = {
        type: 'openapi-operation',
        name: name.replace(/\s+/g, '_'),
        title: operation.summary || name,
        description: operation.description || '',
        version: extractVersionFromOperation(operation) || DEFAULT_OPENAPI_VERSION || '4.0.0',
        openapi: operation
    };

    // Convert OpenAPI tags to APIDoc group
    // Priority: x-group > tags[0] > default
    if (operation['x-group']) {
        result.group = operation['x-group'].replace(/\s+/g, '_');
    } else if (operation.tags && operation.tags.length > 0) {
        result.group = operation.tags[0].replace(/\s+/g, '_');
    } else {
        result.group = 'Operations';
    }

    return result;
}

/**
 * Extract response codes from operation
 */
function extractResponseCodes(operation: any): string[] {
    if (!operation.responses) {
        return [];
    }

    return Object.keys(operation.responses);
}

/**
 * Extract parameter types from operation
 */
function extractParameterInfo(operation: any): {
    hasPathParams: boolean;
    hasQueryParams: boolean;
    hasHeaderParams: boolean;
    hasCookieParams: boolean;
    hasRequestBody: boolean;
} {
    const info = {
        hasPathParams: false,
        hasQueryParams: false,
        hasHeaderParams: false,
        hasCookieParams: false,
        hasRequestBody: false
    };

    if (operation.parameters) {
        for (const param of operation.parameters) {
            switch (param.in) {
                case 'path':
                    info.hasPathParams = true;
                    break;
                case 'query':
                    info.hasQueryParams = true;
                    break;
                case 'header':
                    info.hasHeaderParams = true;
                    break;
                case 'cookie':
                    info.hasCookieParams = true;
                    break;
            }
        }
    }

    if (operation.requestBody) {
        info.hasRequestBody = true;
    }

    return info;
}

/**
 * Validate operation definition
 */
function validateOperation(operation: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!operation || typeof operation !== 'object') {
        errors.push('Operation must be an object');
        return { valid: false, errors };
    }

    // Check for required responses
    if (!operation.responses) {
        errors.push('Operation must define responses');
    } else if (typeof operation.responses !== 'object') {
        errors.push('Responses must be an object');
    }

    // Validate parameters if present
    if (operation.parameters && !Array.isArray(operation.parameters)) {
        errors.push('Parameters must be an array');
    }

    // Validate tags if present
    if (operation.tags && !Array.isArray(operation.tags)) {
        errors.push('Tags must be an array');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Extract version from OpenAPI operation
 * Looks for version in various places: x-version extension, tags, etc.
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