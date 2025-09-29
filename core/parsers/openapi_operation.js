"use strict";
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
 *  @openapi-operation
 *  summary: Create a new user
 *  description: Creates a new user account with the provided information
 *  operationId: createUser
 *  tags:
 *  - Users
 *  requestBody:
 *  required: true
 *  content:
 *  application/json:
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
 * Parse @openapi-operation content and convert to APIDoc-compatible format
 *
 * @param content - Raw content from the @openapi-operation tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
function parse(content) {
    if (!content || content.trim().length === 0) {
        return null;
    }
    content = content.trim();
    try {
        let operationDef = {};
        // Parse the operation definition
        if (content.startsWith('{') || content.startsWith('[')) {
            // JSON format
            operationDef = JSON.parse(content);
        }
        else {
            // YAML format
            operationDef = YAML.load(content) || {};
        }
        if (!operationDef || typeof operationDef !== 'object') {
            return null;
        }
        return processOperationDefinition(operationDef);
    }
    catch (error) {
        console.warn(`[OpenAPI Operation Parser] Failed to parse content: ${error.message}`);
        return null;
    }
}
/**
 * Process the operation definition for APIDoc compatibility
 */
function processOperationDefinition(operation) {
    const name = operation.operationId || operation.summary || 'Operation';
    const result = {
        type: 'openapi-operation',
        name: name.replace(/\s+/g, '_'),
        title: operation.summary || name,
        description: operation.description || '',
        version: extractVersionFromOperation(operation) || DEFAULT_OPENAPI_VERSION || '4.0.0',
        openapi: operation,
    };
    // Convert OpenAPI tags to APIDoc group
    // Priority: x-group > tags[0] > default
    if (operation['x-group']) {
        result.group = operation['x-group'].replace(/\s+/g, '_');
    }
    else if (operation.tags && operation.tags.length > 0) {
        result.group = operation.tags[0].replace(/\s+/g, '_');
    }
    else {
        result.group = 'Operations';
    }
    return result;
}
/**
 * Extract response codes from operation
 */
function extractResponseCodes(operation) {
    if (!operation.responses) {
        return [];
    }
    return Object.keys(operation.responses);
}
/**
 * Extract parameter types from operation
 */
function extractParameterInfo(operation) {
    const info = {
        hasPathParams: false,
        hasQueryParams: false,
        hasHeaderParams: false,
        hasCookieParams: false,
        hasRequestBody: false,
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
function validateOperation(operation) {
    const errors = [];
    if (!operation || typeof operation !== 'object') {
        errors.push('Operation must be an object');
        return { valid: false, errors };
    }
    // Check for required responses
    if (!operation.responses) {
        errors.push('Operation must define responses');
    }
    else if (typeof operation.responses !== 'object') {
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
        errors,
    };
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
//# sourceMappingURL=openapi_operation.js.map