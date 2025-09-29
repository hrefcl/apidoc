/**
 * @file Parser for @apiSchema tags - handles API schema documentation
 * @description This parser processes @apiSchema tags to extract schema definitions including:
 * - TypeScript interfaces from .ts files
 * - JSON Schema files (external references)
 * - Automatic parameter/success/error generation
 * - Type validation and documentation
 * - Group support for organizing parameters
 * @example Basic Usage
 * ```typescript
 * // In your API documentation:
 * /**
 *  @apiSchema {interface=UserProfile} apiSuccess
 *  @apiSchema (Body) {interface=CreateUser} apiParam
 *  @apiSchema {jsonschema=./schemas/user.json} apiParam
 *  \/
 * ```
 * @author hrefcl
 * @since 4.0.0
 * @version 4.0.0
 */

import fs from 'fs';
import path from 'path';
import { findInterface, interfaceToApiDocElements } from '../utils/typescript-parser';

/**
 * Current schema group being processed
 * @internal
 * @deprecated This global variable is maintained for legacy compatibility but not actively used
 */
const group = '';

/**
 * Parses TypeScript interface definitions and converts them to APIDoc elements
 * @description This function extracts properties from TypeScript interface definitions
 * and converts them into APIDoc-compatible parameter definitions. It handles:
 * - Basic types (string, number, boolean)
 * - Optional properties marked with ?
 * - Nested objects and arrays
 * - Union types and string literals
 * - JSDoc comments for descriptions
 * @param interfaceContent - The raw interface content as a string
 * @param interfaceName - The name of the interface being parsed
 * @returns Array of APIDoc elements with parsed properties
 * @example
 * ```typescript
 * const elements = parseTypeScriptInterface(`
 *   interface User {
 *     id: number;
 *     name?: string;
 *     role: 'admin' | 'user';
 *   }
 * `, 'User');
 * // Returns: [
 * //   { source: '@apiParam {Number} id ...', ... },
 * //   { source: '@apiParam {String} [name] ...', ... },
 * //   { source: '@apiParam {String="admin","user"} role ...', ... }
 * // ]
 * ```
 * @internal
 * @since 4.0.0
 */
function parseTypeScriptInterface(interfaceContent: string, interfaceName: string): Array<any> {
    const elements: Array<any> = [];

    // Remove interface declaration and braces
    const cleanContent = interfaceContent
        .replace(new RegExp(`interface\\s+${interfaceName}\\s*\\{`), '')
        .replace(/\}$/, '')
        .trim();

    // Split by lines and parse each property
    const lines = cleanContent.split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

        // Parse property: name?: type; or name: type;
        const propertyMatch = trimmed.match(/^(\w+)(\?)?:\s*(.+?);?\s*(?:\/\/.*)?$/);
        if (propertyMatch) {
            const [, propertyName, isOptional, typeDefinition] = propertyMatch;

            // Parse type information
            const typeInfo = parseTypeScriptType(typeDefinition);

            // Create field name with optional brackets
            const fieldName = isOptional ? `[${propertyName}]` : propertyName;

            // Generate description from property name (convert camelCase)
            const description = propertyName.replace(/([A-Z])/g, ' $1').toLowerCase();

            elements.push({
                source: `@apiParam {${typeInfo.type}} ${fieldName} ${description}`,
                name: 'apiparam',
                sourceName: 'apiParam',
                content: `{${typeInfo.type}} ${fieldName} ${description}`,
            });
        }

        // Handle nested objects and arrays
        const nestedMatch = trimmed.match(/^(\w+)(\?)?:\s*\{/);
        if (nestedMatch) {
            const [, propertyName, isOptional] = nestedMatch;
            const fieldName = isOptional ? `[${propertyName}]` : propertyName;

            elements.push({
                source: `@apiParam {Object} ${fieldName} ${propertyName} object`,
                name: 'apiparam',
                sourceName: 'apiParam',
                content: `{Object} ${fieldName} ${propertyName} object`,
            });
        }
    }

    return elements;
}

/**
 * Converts TypeScript type definitions to APIDoc-compatible type strings
 * @description This function normalizes TypeScript types into the format expected by APIDoc.
 * It handles complex type transformations including:
 * - Basic primitive types (string → String, number → Number, etc.)
 * - Array types (Type[] → Type[], Array<Type> → Type[])
 * - Union types ('a' | 'b' → String="a","b")
 * - Generic types (simplified to base type)
 * - String literal types with quoted values
 * - Complex nested types (fallback to Object)
 * @param typeDefinition - The TypeScript type definition as a string
 * @returns Object containing the normalized APIDoc type and optional constraints
 * @example Basic Types
 * ```typescript
 * parseTypeScriptType('string') // { type: 'String' }
 * parseTypeScriptType('number') // { type: 'Number' }
 * parseTypeScriptType('boolean') // { type: 'Boolean' }
 * ```
 * @example Array Types
 * ```typescript
 * parseTypeScriptType('string[]') // { type: 'String[]' }
 * parseTypeScriptType('Array<number>') // { type: 'Number[]' }
 * ```
 * @example Union Types
 * ```typescript
 * parseTypeScriptType("'admin' | 'user'") // { type: 'String="admin","user"' }
 * parseTypeScriptType('string | number') // { type: 'String/Number' }
 * ```
 * @internal
 * @since 4.0.0
 */
function parseTypeScriptType(typeDefinition: string): { type: string; constraints?: string } {
    const type = typeDefinition.trim();

    // Handle basic types
    if (type === 'string') return { type: 'String' };
    if (type === 'number') return { type: 'Number' };
    if (type === 'boolean') return { type: 'Boolean' };
    if (type === 'any') return { type: 'Mixed' };

    // Handle arrays
    if (type.endsWith('[]')) {
        const baseType = parseTypeScriptType(type.slice(0, -2));
        return { type: `${baseType.type}[]` };
    }

    if (type.startsWith('Array<') && type.endsWith('>')) {
        const innerType = type.slice(6, -1);
        const baseType = parseTypeScriptType(innerType);
        return { type: `${baseType.type}[]` };
    }

    // Handle union types
    if (type.includes('|')) {
        const types = type.split('|').map((t) => t.trim());
        const mappedTypes = types.map((t) => parseTypeScriptType(t).type);
        return { type: mappedTypes.join('/') };
    }

    // Handle generic types
    if (type.includes('<')) {
        const baseType = type.split('<')[0];
        return parseTypeScriptType(baseType);
    }

    // Handle string literals
    if (type.includes('"') || type.includes("'")) {
        const values = type.match(/["']([^"']+)["']/g);
        if (values) {
            return { type: `String=${values.join(',')}` };
        }
    }

    // Default to Object for unknown types
    return { type: 'Object' };
}

/**
 * Parses JSON Schema files and converts them to APIDoc parameter definitions
 * @description This function reads external JSON Schema files and converts their
 * property definitions into APIDoc-compatible parameter documentation. It supports:
 * - Standard JSON Schema format (draft-07)
 * - Nested object properties with dot notation
 * - Required vs optional field detection
 * - Type conversion from JSON Schema to APIDoc types
 * - Recursive traversal of nested objects
 * @param schemaPath - Relative path to the JSON Schema file
 * @param relativeTo - Base file path to resolve the schema path against
 * @returns Array of APIDoc elements generated from the schema
 * @example
 * ```typescript
 * // For schema file: ./schemas/user.json
 * const elements = parseJsonSchema('./schemas/user.json', '/api/users.js');
 * // Returns: [
 * //   { source: '@apiParam {String} email User email address', ... },
 * //   { source: '@apiParam {String} name User full name', ... },
 * //   { source: '@apiParam {String} [role] User role', ... }
 * // ]
 * ```
 * @throws Will log warning if schema file cannot be read or parsed
 * @public
 * @since 4.0.0
 */
function parseJsonSchema(schemaPath: string, relativeTo: string): Array<any> {
    const elements: Array<any> = [];

    try {
        const fullPath = path.resolve(path.dirname(relativeTo), schemaPath);
        const schemaContent = fs.readFileSync(fullPath, 'utf8');
        const schema = JSON.parse(schemaContent);

        // Use simplified traversal for now
        const params = traverseJsonSchema(schema);

        for (const [field, definition] of Object.entries(params)) {
            elements.push({
                source: `@apiParam ${definition}`,
                name: 'apiparam',
                sourceName: 'apiParam',
                content: definition,
            });
        }
    } catch (error) {
        console.warn(`Warning: Could not parse JSON schema at ${schemaPath}:`, error.message);
    }

    return elements;
}

/**
 * Recursively traverses JSON Schema objects to extract parameter definitions
 * @description This function performs deep traversal of JSON Schema structures,
 * converting nested object properties into flattened APIDoc parameter definitions.
 * It handles the recursive nature of JSON Schema objects and maintains proper
 * field naming with dot notation for nested properties.
 * @param schema - The JSON Schema object or sub-schema to traverse
 * @param prefix - Current property path prefix for nested traversal (e.g., "user.preferences")
 * @returns Record mapping field names to their APIDoc parameter definition strings
 * @example Basic object traversal
 * ```typescript
 * const schema = {
 *   type: 'object',
 *   required: ['name'],
 *   properties: {
 *     name: { type: 'string', description: 'User name' },
 *     age: { type: 'number', description: 'User age' }
 *   }
 * };
 *
 * const result = traverseJsonSchema(schema);
 * // Returns: {
 * //   'name': '{String} name User name',
 * //   'age': '{Number} [age] User age'
 * // }
 * ```
 * @example Nested object traversal
 * ```typescript
 * const schema = {
 *   type: 'object',
 *   properties: {
 *     user: {
 *       type: 'object',
 *       properties: {
 *         profile: {
 *           type: 'object',
 *           properties: {
 *             name: { type: 'string', description: 'Profile name' }
 *           }
 *         }
 *       }
 *     }
 *   }
 * };
 *
 * const result = traverseJsonSchema(schema);
 * // Returns: {
 * //   'user': '{Object} [user] user object',
 * //   'user.profile': '{Object} [user.profile] profile object',
 * //   'user.profile.name': '{String} [user.profile.name] Profile name'
 * // }
 * ```
 * @internal
 * @since 4.0.0
 */
function traverseJsonSchema(schema: any, prefix = ''): Record<string, string> {
    const params: Record<string, string> = {};

    if (schema.type === 'object' && schema.properties) {
        for (const [key, prop] of Object.entries(schema.properties)) {
            const fieldName = prefix ? `${prefix}.${key}` : key;
            const isRequired = schema.required?.includes(key);
            const field = isRequired ? fieldName : `[${fieldName}]`;

            const propSchema = prop as any;
            const type = getJsonSchemaType(propSchema);
            const description = propSchema.description || '';

            params[fieldName] = `{${type}} ${field} ${description}`;

            // Handle nested objects
            if (propSchema.type === 'object' && propSchema.properties) {
                const nested = traverseJsonSchema(propSchema, fieldName);
                Object.assign(params, nested);
            }
        }
    }

    return params;
}

/**
 * Converts JSON Schema type definitions to APIDoc-compatible type strings
 * @description This function maps JSON Schema type definitions to the format expected
 * by APIDoc documentation. It handles all standard JSON Schema types including complex
 * array types with nested item definitions. The conversion ensures that generated
 * documentation uses consistent APIDoc type notation.
 * @param schema - The JSON Schema type definition object
 * @returns APIDoc-compatible type string (e.g., 'String', 'Number[]', 'Object')
 * @example Basic type conversion
 * ```typescript
 * getJsonSchemaType({ type: 'string' })     // Returns: 'String'
 * getJsonSchemaType({ type: 'number' })     // Returns: 'Number'
 * getJsonSchemaType({ type: 'boolean' })    // Returns: 'Boolean'
 * getJsonSchemaType({ type: 'integer' })    // Returns: 'Number'
 * ```
 * @example Array type conversion
 * ```typescript
 * getJsonSchemaType({
 *   type: 'array',
 *   items: { type: 'string' }
 * })  // Returns: 'String[]'
 *
 * getJsonSchemaType({
 *   type: 'array',
 *   items: { type: 'object' }
 * })  // Returns: 'Object[]'
 *
 * getJsonSchemaType({ type: 'array' })  // Returns: 'Array' (no items defined)
 * ```
 * @example Complex type conversion
 * ```typescript
 * getJsonSchemaType({ type: 'object' })     // Returns: 'Object'
 * getJsonSchemaType({ type: 'null' })       // Returns: 'Mixed'
 * getJsonSchemaType({})                     // Returns: 'Mixed' (unknown type)
 * ```
 * @internal
 * @since 4.0.0
 */
function getJsonSchemaType(schema: any): string {
    if (schema.type === 'string') return 'String';
    if (schema.type === 'number' || schema.type === 'integer') return 'Number';
    if (schema.type === 'boolean') return 'Boolean';
    if (schema.type === 'array') {
        if (schema.items) {
            const itemType = getJsonSchemaType(schema.items);
            return `${itemType}[]`;
        }
        return 'Array';
    }
    if (schema.type === 'object') return 'Object';

    return 'Mixed';
}

/**
 * Parses @apiSchema tag content and extracts schema configuration
 * @description This function processes the content of @apiSchema tags to extract
 * the schema type, value, target element, and optional group information. It supports
 * both TypeScript interface references and external JSON Schema file paths with
 * flexible syntax for different APIDoc elements.
 * @param content - The raw content string from the @apiSchema tag
 * @param source - The complete source line (used for error reporting)
 * @returns Parsed schema configuration object or null if parsing fails
 * @example Supported syntax patterns
 * ```typescript
 * // TypeScript interface with group
 * parse("(Body) {interface=UserProfile} apiParam", "@apiSchema ...")
 * // Returns: { group: "Body", schemaType: "interface", schemaValue: "UserProfile", element: "apiParam" }
 *
 * // JSON Schema for success response
 * parse("{jsonschema=./schemas/user.json} apiSuccess", "@apiSchema ...")
 * // Returns: { group: "", schemaType: "jsonschema", schemaValue: "./schemas/user.json", element: "apiSuccess" }
 *
 * // Interface without group (defaults to apiParam)
 * parse("{interface=ResponseError}", "@apiSchema ...")
 * // Returns: { group: "", schemaType: "interface", schemaValue: "ResponseError", element: "apiParam" }
 * ```
 * @example Return object structure
 * ```typescript
 * interface ParseResult {
 *   group: string;        // Optional group name (e.g., "Body", "Query")
 *   schemaType: string;   // Either "interface" or "jsonschema"
 *   schemaValue: string;  // Interface name or file path
 *   element: string;      // Target APIDoc element (apiParam, apiSuccess, apiError, etc.)
 * }
 * ```
 * @returns null for invalid syntax, multiline content, or commented content
 * @public
 * @since 4.0.0
 */
function parse(content: string, source: string): any {
    const trimmedContent = content.trim();

    if (trimmedContent.length === 0) {
        return null;
    }

    // Skip if content contains commented-out lines or multiple lines
    if (trimmedContent.includes('\n') || trimmedContent.includes('//')) {
        return null;
    }

    // Skip if content doesn't look like a valid @apiSchema pattern
    if (!trimmedContent.includes('{') || !trimmedContent.includes('=') || !trimmedContent.includes('}')) {
        return null;
    }

    // Parse: @apiSchema (optional group) {type=value} element
    const parseRegExp = /^(?:\((.+?)\))?\s*\{(.+?)=(.+?)\}\s*(?:(.+?))?$/;
    const matches = parseRegExp.exec(trimmedContent);

    if (!matches) {
        return null;
    }

    return {
        group: matches[1] || '',
        schemaType: matches[2],
        schemaValue: matches[3],
        element: matches[4] || 'apiParam',
    };
}

/**
 * Main processor function that converts @apiSchema tags into APIDoc elements
 * @description This is the core processing function that transforms @apiSchema tags
 * into appropriate APIDoc elements (@apiParam, @apiSuccess, @apiError, etc.).
 * It handles both TypeScript interface resolution and JSON Schema file processing,
 * with proper error handling and fallback mechanisms.
 * @param elements - Current array of parsed APIDoc elements for the block
 * @param element - The @apiSchema element being processed
 * @param block - The complete documentation block context (unused but required for hook interface)
 * @param filename - Source file path for resolving relative schema paths and interface lookups
 * @returns Updated elements array with @apiSchema replaced by generated parameter/success elements
 * @example TypeScript interface processing
 * ```typescript
 * // Input: @apiSchema {interface=UserProfile} apiParam
 * // Processing steps:
 * // 1. Parse schema configuration
 * // 2. Find TypeScript interface definition
 * // 3. Convert interface properties to @apiParam elements
 * // 4. Replace @apiSchema with generated elements
 *
 * const result = processor(elements, apiSchemaElement, block, '/api/users.js');
 * // Returns: elements array with @apiSchema removed and @apiParam elements added
 * ```
 * @example JSON Schema processing
 * ```typescript
 * // Input: @apiSchema {jsonschema=./schemas/user.json} apiSuccess
 * // Processing steps:
 * // 1. Parse schema configuration
 * // 2. Read and parse JSON Schema file
 * // 3. Convert schema properties to @apiSuccess elements
 * // 4. Apply group information if specified
 *
 * const result = processor(elements, apiSchemaElement, block, '/api/users.js');
 * // Returns: elements array with @apiSchema removed and @apiSuccess elements added
 * ```
 * @example Error handling
 * ```typescript
 * // When interface is not found:
 * // - Logs warning message
 * // - Generates fallback documentation element
 * // - Continues processing without breaking build
 *
 * // When JSON Schema file is missing:
 * // - Logs warning with file path
 * // - Returns original elements array unchanged
 * // - Allows build to continue
 * ```
 * @hook This function is registered as a 'parser-find-elements' hook with priority 200
 * @public
 * @since 4.0.0
 */
function processor(elements: Array<any>, element: any, block: any, filename: string): Array<any> {
    if (element.name !== 'apischema') {
        return elements;
    }

    // Remove the @apiSchema element from processing
    elements.pop();

    const parsed = parse(element.content, element.source);
    if (!parsed) {
        // Only warn for content that looks like it should be a valid @apiSchema but failed to parse
        if (element.content.includes('{') && element.content.includes('=') && element.content.includes('}')) {
            console.warn(`Warning: Could not parse @apiSchema: ${element.content}`);
        }
        return elements;
    }

    let newElements: Array<any> = [];

    if (parsed.schemaType === 'interface') {
        // Handle TypeScript interface
        const interfaceName = parsed.schemaValue;

        // Find interface definition
        const interfaceDefinition = findInterface(interfaceName, filename);

        if (interfaceDefinition) {
            newElements = interfaceToApiDocElements(interfaceDefinition, parsed.element, parsed.group);
        } else {
            console.warn(`Warning: Could not find TypeScript interface '${interfaceName}' in source files`);

            // Fallback: generate basic documentation
            const groupPrefix = parsed.group ? `(${parsed.group}) ` : '';
            newElements.push({
                source: `@${parsed.element} ${groupPrefix}{Object} data ${interfaceName} interface`,
                name: parsed.element.toLowerCase(),
                sourceName: parsed.element,
                content: `${groupPrefix}{Object} data ${interfaceName} interface`,
            });
        }
    } else if (parsed.schemaType === 'jsonschema') {
        // Handle JSON Schema file
        newElements = parseJsonSchema(parsed.schemaValue, filename);

        // Update element names if not apiParam
        if (parsed.element !== 'apiParam') {
            newElements.forEach((el) => {
                el.name = parsed.element.toLowerCase();
                el.sourceName = parsed.element;
                el.source = el.source.replace('@apiParam', `@${parsed.element}`);
            });
        }
    }

    // Add group information for JSON Schema only (TypeScript interfaces handle groups internally)
    if (parsed.group && parsed.schemaType === 'jsonschema') {
        newElements.forEach((el) => {
            el.content = `(${parsed.group}) ${el.content}`;
            el.source = el.source.replace(`{`, `(${parsed.group}) {`);
        });
    }

    // Add new elements to the list
    newElements.forEach((el) => elements.push(el));

    return elements;
}

/**
 * Initializes the @apiSchema parser by registering the processor hook
 * @description This initialization function registers the @apiSchema processor
 * with the APIDoc parser hook system. It sets up the parser to intercept
 * and process @apiSchema tags during the documentation generation phase.
 * @param app - The APIDoc application instance with hook registration capabilities
 * @example Hook registration
 * ```typescript
 * // Registers processor function as 'parser-find-elements' hook with priority 200
 * init(apiDocApp);
 * // Now @apiSchema tags will be processed during documentation generation
 * ```
 * @hook Registers processor function with 'parser-find-elements' event at priority 200
 * @priority 200 - Runs after basic element parsing but before final processing
 * @public
 * @since 4.0.0
 */
function init(app: any) {
    app.addHook('parser-find-elements', processor, 200);
}

export default {
    parse,
    path: 'local',
    method: 'push',
    markdownFields: [],
    markdownRemoveFields: [],
    init,
};
