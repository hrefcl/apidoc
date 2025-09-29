/**
 * Parser for @openapi tags - native OpenAPI 3.0 syntax support
 *
 * Allows writing OpenAPI specifications directly in comments using standard OpenAPI syntax.
 * Supports both JSON and YAML formats for maximum flexibility.
 *
 * This parser processes OpenAPI definitions and converts them into APIDoc-compatible
 * data structures that integrate seamlessly with APIDoc's navigation and grouping system.
 *
 * @example Basic OpenAPI path definition
 * ```javascript
 * /**
 *  @openapi
 *  /users/{id}:
 *  get:
 *  summary: Get user by ID
 *  tags: [Users]
 *  parameters:
 *  - name: id
 *  in: path
 *  required: true
 *  schema:
 *  *           type: integer
 *  *     responses:
 *  *       200:
 *  *         description: User details
 *  * /
 * ```
 *
 * @since 4.0.0
 * @public
 */

import * as fs from 'fs';
import * as YAML from 'js-yaml';
import * as pathModule from 'path';

/**
 * APIDoc parser configuration
 * - path: 'local' means data goes into the main API object
 * - method: 'insert' means data replaces existing values
 */

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
    parameter?: any[]; // Parameters (path, query, header)
    body?: any[]; // Request body fields
    success?: any; // Success response fields (array or structured object)
    error?: any; // Error response fields (array or structured object)
    externalSource?: {
        // Metadata for external file references
        file: string; // Path to external file
        path: string; // Specific path/operation within file
    };
}

/**
 * Parse @openapi content and convert to APIDoc-compatible format
 *
 * This function processes OpenAPI YAML/JSON content and converts it into the exact
 * format that APIDoc expects for navigation, grouping, and display purposes.
 *
 * @param content - Raw YAML/JSON content from the @openapi tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
function parse(content: string, filePath?: string): ApiDocCompatibleResult | null {
    if (!content || content.trim().length === 0) {
        return null;
    }

    content = content.trim();

    // Check if content references an external file
    const externalFileMatch = content.match(/^(.+?)\s*\{openapi=(.+?)\}$/);
    if (externalFileMatch) {
        return parseExternalOpenApiFile(externalFileMatch[1].trim(), externalFileMatch[2].trim(), filePath);
    }

    // Check if it's a simple external file reference without path specification
    const simpleFileMatch = content.match(/^\{openapi=(.+?)\}$/);
    if (simpleFileMatch) {
        return parseExternalOpenApiFile('', simpleFileMatch[1].trim(), filePath);
    }

    try {
        let parsedOpenApi: any;

        // Try to detect format and parse inline content
        if (content.startsWith('{') || content.startsWith('[')) {
            // Looks like JSON
            try {
                parsedOpenApi = JSON.parse(content);
            } catch (jsonError) {
                // If JSON parsing fails, try YAML
                parsedOpenApi = YAML.load(content);
            }
        } else {
            // Try YAML first (more common for OpenAPI)
            try {
                parsedOpenApi = YAML.load(content);
            } catch (yamlError) {
                // If YAML parsing fails, try JSON
                parsedOpenApi = JSON.parse(content);
            }
        }

        if (!parsedOpenApi || typeof parsedOpenApi !== 'object') {
            return null;
        }

        const result = processOpenApiForApiDoc(parsedOpenApi, content);
        return result;
    } catch (error) {
        console.warn(`[OpenAPI Parser] Failed to parse content: ${error.message}`);
        return null;
    }
}

/**
 * Process OpenAPI content and convert to APIDoc-compatible format
 *
 * This function extracts the first operation from an OpenAPI specification
 * and converts it to the format expected by APIDoc's navigation system.
 */
function processOpenApiForApiDoc(openapi: any, rawContent: string): ApiDocCompatibleResult | null {
    // Handle path definitions (most common case)
    if (openapi.paths || isPathDefinition(openapi)) {
        return extractFirstOperation(openapi.paths || openapi, openapi.components);
    }

    // Handle single operation definitions
    if (isOperationDefinition(openapi)) {
        return processStandaloneOperation(openapi);
    }

    // For components, schemas, info, etc. - create a documentation entry
    if (openapi.components || openapi.schemas || openapi.info) {
        return createDocumentationEntry(openapi);
    }

    return null;
}

/**
 * Extract the first operation from OpenAPI paths and convert to APIDoc format
 */
function extractFirstOperation(paths: any, components?: any): ApiDocCompatibleResult | null {
    const pathKeys = Object.keys(paths);
    if (pathKeys.length === 0) {
        return null;
    }

    const firstPath = pathKeys[0];
    const pathItem = paths[firstPath];

    // Find the first HTTP method in the path
    const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'];
    const method = httpMethods.find((m) => pathItem[m]);

    if (!method) {
        return null;
    }

    const operation = pathItem[method];

    const result: ApiDocCompatibleResult = {
        type: method.toLowerCase(),
        url: convertOpenApiPathToApiDoc(firstPath),
        title: operation.summary || operation.operationId || `${method.toUpperCase()} ${firstPath}`,
        name: operation.operationId || generateOperationName(method, firstPath),
        description: operation.description || '',
        version: extractVersionFromOperation(operation) || DEFAULT_OPENAPI_VERSION,
        openapi: { paths: { [firstPath]: pathItem } },
    };

    // Convert OpenAPI parameters to APIDoc format
    if (operation.parameters && operation.parameters.length > 0) {
        result.parameter = convertParametersToApiDoc(operation.parameters);
    }

    // Convert OpenAPI requestBody to APIDoc format
    if (operation.requestBody) {
        result.body = convertRequestBodyToApiDoc(operation.requestBody, components);
    }

    // Convert OpenAPI responses to APIDoc format
    if (operation.responses) {
        const { success, error } = convertResponsesToApiDoc(operation.responses, components);
        if (success && success.length > 0) {
            // Convert to APIDoc expected structure: { fields: { "GroupName": [array] } }
            result.success = {
                fields: {
                    'Success 200': success,
                },
            };
        }
        if (error && error.length > 0) {
            // Convert to APIDoc expected structure: { fields: { "GroupName": [array] } }
            result.error = {
                fields: {
                    'Error 4xx': error,
                },
            };
        }
    }

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
 * Process standalone operation (operation without path context)
 */
function processStandaloneOperation(operation: any): ApiDocCompatibleResult {
    const result: ApiDocCompatibleResult = {
        type: 'openapi-operation',
        title: operation.summary || operation.operationId || 'OpenAPI Operation',
        name: operation.operationId || 'OpenAPIOperation',
        description: operation.description || '',
        version: extractVersionFromOperation(operation) || DEFAULT_OPENAPI_VERSION,
        openapi: operation,
    };

    // Convert OpenAPI tags to APIDoc group
    // Priority: x-group > tags[0] > default
    if (operation['x-group']) {
        result.group = operation['x-group'].replace(/\s+/g, '_');
    } else if (operation.tags && operation.tags.length > 0) {
        result.group = operation.tags[0].replace(/\s+/g, '_');
    } else {
        result.group = 'OpenAPI';
    }

    return result;
}

/**
 * Create documentation entry for components, schemas, info, etc.
 */
function createDocumentationEntry(openapi: any): ApiDocCompatibleResult {
    const result: ApiDocCompatibleResult = {
        type: 'openapi-doc',
        group: 'OpenAPI_Documentation',
        version: extractVersionFromOpenAPI(openapi) || DEFAULT_OPENAPI_VERSION,
        openapi: openapi,
    };

    if (openapi.info) {
        result.title = openapi.info.title || 'API Documentation';
        result.name = 'APIInfo';
        result.description = openapi.info.description || '';
        result.group = 'API_Information';
    } else if (openapi.components) {
        result.title = 'OpenAPI Components';
        result.name = 'Components';
        result.description = 'Reusable OpenAPI components';
        result.group = 'Components';
    } else if (openapi.schemas) {
        result.title = 'OpenAPI Schemas';
        result.name = 'Schemas';
        result.description = 'OpenAPI schema definitions';
        result.group = 'Schemas';
    } else {
        result.title = 'OpenAPI Documentation';
        result.name = 'OpenAPIDoc';
        result.description = 'OpenAPI specification';
    }

    return result;
}

/**
 * Convert OpenAPI path format to APIDoc format
 * Converts {param} to :param for APIDoc compatibility
 */
function convertOpenApiPathToApiDoc(openApiPath: string): string {
    return openApiPath.replace(/\{([^}]+)\}/g, ':$1');
}

/**
 * Generate operation name from method and path
 */
function generateOperationName(method: string, path: string): string {
    // Convert path to camelCase operation name
    // e.g., GET /users/{id} -> getUsersId
    const cleanPath = path.replace(/[{}/:]/g, ' ').trim();
    const words = cleanPath.split(/\s+/).filter((w) => w.length > 0);
    const camelCase =
        method.toLowerCase() + words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    return camelCase;
}

/**
 * Extract version from OpenAPI operation
 * Looks for version in various places: x-version extension, tags, etc.
 */
function extractVersionFromOperation(operation: any): string | null {
    // Check for x-version extension
    if (operation['x-version'] && typeof operation['x-version'] === 'string') {
        return operation['x-version'];
    }

    // Check for version in tags (e.g., "v1.0", "version:1.0")
    if (operation.tags && operation.tags.length > 0) {
        for (const tag of operation.tags) {
            if (typeof tag === 'string') {
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
    }

    return null;
}

/**
 * Extract version from full OpenAPI specification
 * Looks for version in info.version or x-version extension
 */
function extractVersionFromOpenAPI(openapi: any): string | null {
    // Check for x-version extension at root level
    if (openapi['x-version'] && typeof openapi['x-version'] === 'string') {
        return openapi['x-version'];
    }

    // Check for version in info object
    if (openapi.info && openapi.info.version && typeof openapi.info.version === 'string') {
        return openapi.info.version;
    }

    return null;
}

/**
 * Check if the object represents a path definition
 */
function isPathDefinition(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;

    // Check if keys look like paths (start with /)
    const keys = Object.keys(obj);
    return keys.some((key) => key.startsWith('/'));
}

/**
 * Check if the object represents a schema definition
 */
function isSchemaDefinition(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;

    // Check for schema properties
    return (
        obj.type !== undefined ||
        obj.properties !== undefined ||
        obj.allOf !== undefined ||
        obj.oneOf !== undefined ||
        obj.anyOf !== undefined
    );
}

/**
 * Check if the object represents an operation definition
 */
function isOperationDefinition(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;

    // Check for operation properties
    return (
        obj.responses !== undefined ||
        obj.parameters !== undefined ||
        obj.requestBody !== undefined ||
        obj.operationId !== undefined
    );
}

/**
 * Convert OpenAPI parameters to APIDoc parameter format
 */
function convertParametersToApiDoc(parameters: any[]): any[] {
    return parameters.map((param) => ({
        group: 'Parameter',
        type: getApiDocType(param.schema),
        optional: !param.required,
        field: param.name,
        description: param.description || '',
        ...(param.schema?.example && { defaultValue: param.schema.example }),
    }));
}

/**
 * Convert OpenAPI requestBody to APIDoc body format
 */
function convertRequestBodyToApiDoc(requestBody: any, components?: any): any[] {
    const bodyFields = [];

    if (requestBody.content) {
        const contentTypes = Object.keys(requestBody.content);
        const firstContentType = contentTypes[0];
        const mediaType = requestBody.content[firstContentType];

        if (mediaType.schema) {
            const fields = extractSchemaFields(mediaType.schema, firstContentType, undefined, components);
            bodyFields.push(...fields);
        }
    }

    return bodyFields;
}

/**
 * Convert OpenAPI responses to APIDoc success/error format
 */
function convertResponsesToApiDoc(responses: any, components?: any): { success: any[]; error: any[] } {
    const success = [];
    const error = [];

    Object.keys(responses).forEach((statusCode) => {
        const response = responses[statusCode];
        const isError = parseInt(statusCode) >= 400;

        if (response.content) {
            const contentTypes = Object.keys(response.content);
            const firstContentType = contentTypes[0];
            const mediaType = response.content[firstContentType];

            if (mediaType.schema) {
                const fields = extractSchemaFields(mediaType.schema, firstContentType, statusCode, components);
                if (isError) {
                    error.push(...fields);
                } else {
                    success.push(...fields);
                }
            }
        } else {
            // Response without content (just status code and description)
            const field = {
                group: isError ? 'Error' : 'Success',
                type: 'Object',
                field: `${statusCode}`,
                description: response.description || '',
                optional: false,
            };

            if (isError) {
                error.push(field);
            } else {
                success.push(field);
            }
        }
    });

    return { success, error };
}

/**
 * Extract fields from OpenAPI schema
 */
function extractSchemaFields(schema: any, contentType?: string, statusCode?: string, components?: any): any[] {
    const fields = [];
    const group = statusCode && parseInt(statusCode) >= 400 ? 'Error' : 'Success';

    // Resolve $ref if present
    const resolvedSchema = resolveSchemaReference(schema, components);

    if (resolvedSchema.type === 'object' && resolvedSchema.properties) {
        Object.keys(resolvedSchema.properties).forEach((fieldName) => {
            const prop = resolvedSchema.properties[fieldName];
            const resolvedProp = resolveSchemaReference(prop, components);

            fields.push({
                group: group,
                type: getApiDocType(resolvedProp),
                optional: !resolvedSchema.required?.includes(fieldName),
                field: fieldName,
                description: resolvedProp.description || prop.description || '',
                ...(resolvedProp.example && { defaultValue: resolvedProp.example }),
                ...(resolvedProp.enum && { allowedValues: resolvedProp.enum }),
            });
        });
    } else if (resolvedSchema.type === 'array' && resolvedSchema.items) {
        // Handle arrays
        const itemSchema = resolveSchemaReference(resolvedSchema.items, components);
        if (itemSchema.type === 'object' && itemSchema.properties) {
            // Array of objects - extract each property
            Object.keys(itemSchema.properties).forEach((fieldName) => {
                const prop = itemSchema.properties[fieldName];
                const resolvedProp = resolveSchemaReference(prop, components);

                fields.push({
                    group: group,
                    type: `${getApiDocType(resolvedProp)}[]`,
                    optional: !itemSchema.required?.includes(fieldName),
                    field: `${fieldName}[]`,
                    description: resolvedProp.description || prop.description || '',
                    ...(resolvedProp.example && { defaultValue: resolvedProp.example }),
                });
            });
        } else {
            // Array of simple types
            fields.push({
                group: group,
                type: `${getApiDocType(itemSchema)}[]`,
                field: 'items[]',
                description: resolvedSchema.description || '',
                optional: false,
            });
        }
    } else {
        // Simple type or unresolved reference
        fields.push({
            group: group,
            type: getApiDocType(resolvedSchema),
            field: contentType === 'multipart/form-data' ? 'file' : resolvedSchema.title?.toLowerCase() || 'data',
            description: resolvedSchema.description || schema.description || '',
            optional: false,
        });
    }

    return fields;
}

/**
 * Resolve OpenAPI $ref references
 */
function resolveSchemaReference(schema: any, components?: any): any {
    if (!schema || !schema.$ref || !components) {
        return schema;
    }

    // Parse $ref path like "#/components/schemas/Product"
    const refPath = schema.$ref.split('/');
    if (refPath[0] === '#' && refPath[1] === 'components' && refPath[2] === 'schemas') {
        const schemaName = refPath[3];
        const resolvedSchema = components.schemas?.[schemaName];
        if (resolvedSchema) {
            return resolvedSchema;
        }
    }
    // If reference couldn't be resolved, return original schema
    return schema;
}

/**
 * Convert OpenAPI schema type to APIDoc type
 */
function getApiDocType(schema: any): string {
    if (!schema) return 'String';

    switch (schema.type) {
        case 'integer':
            return 'Number';
        case 'number':
            return 'Number';
        case 'boolean':
            return 'Boolean';
        case 'array':
            const itemType = getApiDocType(schema.items);
            return `${itemType}[]`;
        case 'object':
            return 'Object';
        case 'string':
            if (schema.format === 'binary') return 'File';
            if (schema.format === 'date-time') return 'Date';
            if (schema.format === 'email') return 'String';
            if (schema.format === 'uri') return 'String';
            return 'String';
        default:
            return 'String';
    }
}

/**
 * Parse external OpenAPI file reference and load content
 */
function parseExternalOpenApiFile(pathSpec: string, filePath: string, currentFilePath?: string): any | null {
    try {
        // Resolve file path relative to current file or working directory
        let resolvedPath: string;
        if (currentFilePath) {
            const currentDir = pathModule.dirname(currentFilePath);
            resolvedPath = pathModule.resolve(currentDir, filePath);
        } else {
            resolvedPath = pathModule.resolve(filePath);
        }

        // Check if file exists
        if (!fs.existsSync(resolvedPath)) {
            console.warn(`[OpenAPI External] File not found: ${resolvedPath}`);
            return null;
        }

        // Read file content
        const fileContent = fs.readFileSync(resolvedPath, 'utf8');

        // Parse file content
        let parsedOpenApi: any;
        const ext = pathModule.extname(resolvedPath).toLowerCase();

        if (ext === '.json') {
            parsedOpenApi = JSON.parse(fileContent);
        } else if (ext === '.yaml' || ext === '.yml') {
            parsedOpenApi = YAML.load(fileContent);
        } else {
            // Try auto-detection
            try {
                parsedOpenApi = JSON.parse(fileContent);
            } catch {
                parsedOpenApi = YAML.load(fileContent);
            }
        }

        if (!parsedOpenApi || typeof parsedOpenApi !== 'object') {
            console.warn(`[OpenAPI External] Invalid content in file: ${resolvedPath}`);
            return null;
        }

        // If a specific path was specified, extract only that operation
        if (pathSpec && pathSpec.trim()) {
            const extractedOpenApi = extractSpecificOperationFromFile(parsedOpenApi, pathSpec.trim());
            if (extractedOpenApi) {
                parsedOpenApi = extractedOpenApi;
            }
        }

        return {
            openapi: parsedOpenApi,
            sourceFile: resolvedPath,
            pathSpec: pathSpec || 'full-spec',
        };
    } catch (error) {
        console.warn(`[OpenAPI External] Failed to load file ${filePath}: ${error.message}`);
        return null;
    }
}

/**
 * Extract specific operation from OpenAPI specification for external files
 */
function extractSpecificOperationFromFile(openapi: any, pathSpec: string): any | null {
    // If pathSpec looks like a path (starts with /), find it in paths
    if (pathSpec.startsWith('/')) {
        if (openapi.paths && openapi.paths[pathSpec]) {
            // Return a minimal OpenAPI spec with just this path
            return {
                openapi: openapi.openapi || '3.0.0',
                info: openapi.info || { title: 'API', version: '1.0.0' },
                paths: {
                    [pathSpec]: openapi.paths[pathSpec],
                },
                components: openapi.components || {},
            };
        }
    }

    // TODO: Add support for JSON Pointer references like #/paths/~1api~1users~1{id}/get
    // For now, return the full spec
    return openapi;
}

/**
 * Convert external OpenAPI to APIDoc elements
 */
function convertOpenApiToElements(openapi: any, sourceFile: string, pathSpec: string): any[] {
    const elements: any[] = [];

    if (!openapi.paths) {
        return elements;
    }

    // Process each path and its operations
    Object.entries(openapi.paths).forEach(([path, pathItem]: [string, any]) => {
        if (!pathItem || typeof pathItem !== 'object') return;

        // Process each HTTP method for this path
        const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options'];

        httpMethods.forEach((method) => {
            const operation = pathItem[method];
            if (!operation) return;

            // Create a complete OpenAPI spec with this operation
            const completeSpec = {
                openapi: openapi.openapi || '3.0.0',
                info: openapi.info || { title: 'API', version: '1.0.0' },
                paths: {
                    [path]: {
                        [method]: operation,
                    },
                },
                components: openapi.components || {},
            };

            // Convert to YAML for consistent formatting
            const yamlContent = YAML.dump(completeSpec, { indent: 2 });

            // Create element that mimics an @openapi tag
            const element = {
                source: `@openapi\n${yamlContent}`,
                name: 'openapi',
                sourceName: 'openapi',
                content: yamlContent,
                externalSource: {
                    file: sourceFile,
                    path: pathSpec,
                },
            };

            elements.push(element);
        });
    });

    return elements;
}

/**
 * Hook processor for @openapi tags with external file references
 */
function externalFileProcessor(elements: Array<any>, element: any, block: any, filename: string): Array<any> {
    if (element.name !== 'openapi') {
        return elements;
    }

    const content = element.content?.trim() || '';

    // Check if content references an external file
    const externalFileMatch = content.match(/^(.+?)\s*\{openapi=(.+?)\}$/);
    const simpleFileMatch = content.match(/^\{openapi=(.+?)\}$/);

    if (!externalFileMatch && !simpleFileMatch) {
        // Not an external file reference, let the normal parser handle it
        return elements;
    }

    // Remove the original @openapi element from processing
    elements.pop();

    const pathSpec = externalFileMatch ? externalFileMatch[1].trim() : '';
    const filePath = externalFileMatch ? externalFileMatch[2].trim() : simpleFileMatch[1].trim();

    // Parse external file
    const externalData = parseExternalOpenApiFile(pathSpec, filePath, filename);
    if (!externalData) {
        console.warn(`[OpenAPI External] Failed to load external file: ${filePath}`);
        return elements;
    }

    // Convert external OpenAPI to APIDoc elements
    const newElements = convertOpenApiToElements(externalData.openapi, externalData.sourceFile, externalData.pathSpec);

    // Add new elements to the list
    newElements.forEach((el) => elements.push(el));

    return elements;
}

/**
 * Initialize the external OpenAPI file processor
 */
function init(app: any) {
    app.addHook('parser-find-elements', externalFileProcessor, 190); // Run before @apiSchema (priority 200)
    console.log('🔌 OpenAPI External File Processor initialized');
}

/**
 * APIDoc parser exports
 */
export { init, parse };
export const path = 'local';
export const method = 'insert';
