"use strict";
/**
 * Parser for @openapi-schema tags - OpenAPI schema definitions
 *
 * Allows defining reusable OpenAPI schemas and components that integrate
 * seamlessly with APIDoc's navigation and grouping system.
 * These schemas can be referenced by other endpoints.
 *
 * @example OpenAPI schema definition
 * ```javascript
 * /**
 *  @openapi-schema User
 *  type: object
 *  required:
 *  - id
 *  - name
 *  - email
 *  properties:
 *  id:
 *  type: integer
 *  format: int64
 *  *     example: 12345
 *  *   name:
 *  *     type: string
 *  *     example: "John Doe"
 *  *   email:
 *  *     type: string
 *  *     format: email
 *  *     example: "john@example.com"
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
// Default version for OpenAPI schemas when not specified
const DEFAULT_OPENAPI_VERSION = '4.0.0';
/**
 * Parse @openapi-schema content and convert to APIDoc-compatible format
 *
 * Expected format:
 *
 * @openapi-schema SchemaName
 * schema_definition_in_yaml_or_json
 *
 * @param content - Raw content from the @openapi-schema tag
 * @returns APIDoc-compatible result or null if parsing fails
 */
function parse(content) {
    if (!content || content.trim().length === 0) {
        return null;
    }
    content = content.trim();
    try {
        // Split content into name and definition
        const lines = content.split('\n');
        const firstLine = lines[0].trim();
        const definitionLines = lines.slice(1).join('\n').trim();
        // Extract schema name from first line
        let schemaName = firstLine;
        // Remove common prefixes if present
        schemaName = schemaName.replace(/^(schema|component|model)\s+/i, '');
        if (!schemaName) {
            return null;
        }
        let schemaDef = {};
        if (definitionLines) {
            // Parse the schema definition
            try {
                if (definitionLines.startsWith('{') || definitionLines.startsWith('[')) {
                    // JSON format
                    schemaDef = JSON.parse(definitionLines);
                }
                else {
                    // YAML format
                    schemaDef = YAML.load(definitionLines) || {};
                }
            }
            catch (parseError) {
                console.warn(`[OpenAPI Schema Parser] Failed to parse schema ${schemaName}: ${parseError.message}`);
                schemaDef = {};
            }
        }
        return processSchemaDefinition(schemaName, schemaDef);
    }
    catch (error) {
        console.warn(`[OpenAPI Schema Parser] Failed to parse content: ${error.message}`);
        return null;
    }
}
/**
 * Process the schema definition for APIDoc compatibility
 */
function processSchemaDefinition(name, schema) {
    const result = {
        type: 'openapi-schema',
        name: name.replace(/\s+/g, '_'),
        title: schema.title || `Schema: ${name}`,
        group: 'Schemas',
        description: schema.description || `OpenAPI schema definition for ${name}`,
        version: extractVersionFromSchema(schema) || DEFAULT_OPENAPI_VERSION || '4.0.0',
        openapi: {
            components: {
                schemas: {
                    [name]: schema,
                },
            },
        },
    };
    // Add schema type to description for clarity
    if (schema.type) {
        result.description = `${result.description} (Type: ${schema.type})`.trim();
    }
    return result;
}
/**
 * Generate example from schema
 */
function generateExampleFromSchema(schema) {
    if (!schema || typeof schema !== 'object') {
        return undefined;
    }
    // If example is provided, use it
    if (schema.example !== undefined) {
        return schema.example;
    }
    // Generate example based on type
    switch (schema.type) {
        case 'object':
            if (schema.properties) {
                const example = {};
                for (const [propName, propSchema] of Object.entries(schema.properties)) {
                    example[propName] = generateExampleFromSchema(propSchema);
                }
                return example;
            }
            return {};
        case 'array':
            if (schema.items) {
                const itemExample = generateExampleFromSchema(schema.items);
                return itemExample !== undefined ? [itemExample] : [];
            }
            return [];
        case 'string':
            if (schema.format === 'email') {
                return 'user@example.com';
            }
            if (schema.format === 'date-time') {
                return new Date().toISOString();
            }
            if (schema.format === 'date') {
                return new Date().toISOString().split('T')[0];
            }
            return schema.enum ? schema.enum[0] : 'string';
        case 'integer':
        case 'number':
            return schema.minimum !== undefined
                ? schema.minimum
                : schema.maximum !== undefined
                    ? schema.maximum
                    : schema.multipleOf !== undefined
                        ? schema.multipleOf
                        : 0;
        case 'boolean':
            return true;
        default:
            return undefined;
    }
}
/**
 * Validate schema definition
 */
function validateSchema(schema) {
    const errors = [];
    if (!schema || typeof schema !== 'object') {
        errors.push('Schema must be an object');
        return { valid: false, errors };
    }
    // Check for required fields based on type
    if (schema.type === 'object' && !schema.properties && !schema.additionalProperties) {
        errors.push('Object schemas should define properties');
    }
    if (schema.type === 'array' && !schema.items) {
        errors.push('Array schemas must define items');
    }
    // Validate references
    if (schema.$ref && typeof schema.$ref !== 'string') {
        errors.push('$ref must be a string');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Extract version from OpenAPI schema
 * Looks for version in various places: x-version extension, etc.
 */
function extractVersionFromSchema(schema) {
    // Check for x-version extension
    if (schema['x-version']) {
        return schema['x-version'];
    }
    // Check for version in schema metadata
    if (schema.version && typeof schema.version === 'string') {
        return schema.version;
    }
    // Check for version in custom properties (non-standard but sometimes used)
    if (schema.apiVersion && typeof schema.apiVersion === 'string') {
        return schema.apiVersion;
    }
    return null;
}
/**
 * APIDoc parser exports
 */
exports.path = 'local';
exports.method = 'insert';
//# sourceMappingURL=openapi_schema.js.map