"use strict";
/**
 * Parser for @openapi-path tags - OpenAPI path-specific definitions
 *
 * Allows defining specific OpenAPI paths with their operations and converts them
 * to APIDoc-compatible format for seamless navigation integration.
 *
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
 *  *   responses:
 *  *     200:
 *  *       description: Success
 *  * /
 * ```
 *
 * @since 4.0.0
 * @public
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = exports.path = void 0;
exports.parse = parse;
const YAML = __importStar(require("js-yaml"));
// Default version for OpenAPI operations when not specified
const DEFAULT_OPENAPI_VERSION = '4.0.0';
/**
 * Parse @openapi-path content and convert to APIDoc-compatible format
 *
 * Expected format:
 *
 * @openapi-path /path/to/endpoint
 * operation_definition_in_yaml_or_json
 *
 * @param content - Raw content from the @openapi-path tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
function parse(content) {
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
            }
            else {
                return null;
            }
        }
        let operationsDefinition = {};
        if (definitionLines) {
            // Parse the operations definition
            try {
                if (definitionLines.startsWith('{') || definitionLines.startsWith('[')) {
                    // JSON format
                    operationsDefinition = JSON.parse(definitionLines);
                }
                else {
                    // YAML format
                    operationsDefinition = YAML.load(definitionLines) || {};
                }
            }
            catch (parseError) {
                console.warn(`[OpenAPI Path Parser] Failed to parse operations for ${path}: ${parseError.message}`);
                operationsDefinition = {};
            }
        }
        return processPathDefinition(path, operationsDefinition);
    }
    catch (error) {
        console.warn(`[OpenAPI Path Parser] Failed to parse content: ${error.message}`);
        return null;
    }
}
/**
 * Process the path and operations definition for APIDoc compatibility
 */
function processPathDefinition(path, operations) {
    // Find the first HTTP method in the operations
    const httpMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'options', 'trace'];
    const method = httpMethods.find((m) => operations[m]);
    if (!method) {
        return null;
    }
    const operation = operations[method];
    const result = {
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
    }
    else if (operation.tags && operation.tags.length > 0) {
        result.group = operation.tags[0].replace(/\s+/g, '_');
    }
    return result;
}
/**
 * Convert OpenAPI path format to APIDoc format
 * Converts {param} to :param for APIDoc compatibility
 */
function convertOpenApiPathToApiDoc(openApiPath) {
    return openApiPath.replace(/\{([^}]+)\}/g, ':$1');
}
/**
 * Generate operation name from method and path
 */
function generateOperationName(method, path) {
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
 */
function extractVersionFromOperation(operation) {
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
exports.path = 'local';
exports.method = 'insert';
//# sourceMappingURL=openapi_path.js.map