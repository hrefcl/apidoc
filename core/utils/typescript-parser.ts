/**
 * @file TypeScript Interface Parser - extracts and converts interface definitions
 * @description This module provides comprehensive TypeScript interface parsing capabilities
 * for the @apiSchema functionality. It extracts interface definitions from TypeScript source
 * files and converts them into APIDoc-compatible parameter documentation. The parser handles:
 * - Complex nested object structures with proper brace counting
 * - Union types and string literal enums
 * - Array types in both `Type[]` and `Array<Type>` syntax
 * - Optional properties with proper bracket notation
 * - Generic types with simplified base type extraction
 * - Comment and string literal filtering for accurate parsing
 * - Caching for performance optimization
 * - Cross-file interface discovery and resolution
 * @example Basic usage
 * ```typescript
 * // Find an interface definition
 * const userInterface = findInterface('UserProfile', '/api/users.ts');
 *
 * // Convert to APIDoc elements
 * const elements = interfaceToApiDocElements(userInterface, 'apiParam', 'Body');
 *
 * // Extract all interfaces from a file
 * const allInterfaces = extractInterfacesFromFile('/types/interfaces.ts');
 * ```
 * @author hrefcl
 * @since 4.0.0
 * @version 4.0.0
 */

import fs from 'fs';
import path from 'path';

/**
 * Represents a parsed TypeScript interface property with type information
 * @description This interface defines the structure for storing parsed property
 * information from TypeScript interface definitions. It captures all necessary
 * details for converting properties to APIDoc parameter documentation.
 * @interface ParsedProperty
 * @since 4.0.0
 */
interface ParsedProperty {
    /** Property name as defined in the interface */
    name: string;
    /** APIDoc-compatible type string (e.g., 'String', 'Number[]', 'Object') */
    type: string;
    /** Whether the property is optional (marked with ?) */
    optional: boolean;
    /** Generated or extracted property description */
    description?: string;
    /** Nested properties for complex object types (future extension) */
    nested?: ParsedProperty[];
}

/**
 * Represents a complete parsed TypeScript interface definition
 * @description This interface stores the complete structure of a parsed TypeScript
 * interface including all its properties and inheritance information. It serves
 * as the primary data structure for interface-to-APIDoc conversion.
 * @interface ParsedInterface
 * @since 4.0.0
 */
interface ParsedInterface {
    /** Interface name as declared in TypeScript */
    name: string;
    /** Array of parsed properties from the interface body */
    properties: ParsedProperty[];
    /** Names of interfaces this interface extends (future extension) */
    extends?: string[];
}

/**
 * Cache for parsed interfaces to avoid re-parsing and improve performance
 * @description This cache stores previously parsed interface definitions using
 * a composite key of "filePath:interfaceName" to enable fast lookups and avoid
 * redundant file parsing operations.
 * @internal
 * @since 4.0.0
 */
const interfaceCache = new Map<string, ParsedInterface>();

/**
 * Extracts all TypeScript interface definitions from a source file
 * @description This function reads and parses a TypeScript file to extract all
 * interface definitions. It handles complex nested structures, inheritance,
 * and caches results for performance. The function is resilient to parsing
 * errors and will log warnings for problematic files.
 * @param filePath - Absolute path to the TypeScript file to parse
 * @returns Map of interface names to their parsed definitions
 * @example Basic file parsing
 * ```typescript
 * const interfaces = extractInterfacesFromFile('/src/types/user.ts');
 * console.log(interfaces.get('UserProfile'));
 * // Returns: { name: 'UserProfile', properties: [...], extends: undefined }
 * ```
 * @example Handling multiple interfaces
 * ```typescript
 * const interfaces = extractInterfacesFromFile('/src/types/api.ts');
 * for (const [name, definition] of interfaces) {
 *   console.log(`Found interface: ${name} with ${definition.properties.length} properties`);
 * }
 * ```
 * @throws Logs warning and returns empty Map if file cannot be read or parsed
 * @public
 * @since 4.0.0
 */
export function extractInterfacesFromFile(filePath: string): Map<string, ParsedInterface> {
    const interfaces = new Map<string, ParsedInterface>();

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = parseTypeScriptInterfaces(content);

        parsed.forEach((iface, name) => {
            interfaces.set(name, iface);
            interfaceCache.set(`${filePath}:${name}`, iface);
        });
    } catch (error) {
        console.warn(`Warning: Could not read TypeScript file ${filePath}:`, error.message);
    }

    return interfaces;
}

/**
 * Finds a TypeScript interface definition by name in the current file or project
 * @description This function searches for a specific interface definition starting
 * with the cache, then the current file's directory. It performs cross-file lookups
 * to find interface definitions that may be defined in separate TypeScript files,
 * enabling flexible interface referencing in @apiSchema tags.
 * @param interfaceName - Name of the interface to find (e.g., 'UserProfile')
 * @param currentFile - Path to the current file being processed (used for relative search)
 * @returns Parsed interface definition or null if not found
 * @example Finding interface in same directory
 * ```typescript
 * // In /api/users.js, looking for UserProfile interface
 * const userInterface = findInterface('UserProfile', '/api/users.js');
 * if (userInterface) {
 *   console.log(`Found ${userInterface.properties.length} properties`);
 * }
 * ```
 * @example Cache hit scenario
 * ```typescript
 * // First call parses and caches
 * const interface1 = findInterface('UserProfile', '/api/users.js');
 *
 * // Second call returns cached result
 * const interface2 = findInterface('UserProfile', '/api/users.js');
 * // interface1 === interface2 (same reference)
 * ```
 * @example Cross-file interface discovery
 * ```typescript
 * // File structure:
 * // /api/users.js - contains @apiSchema reference
 * // /api/types.ts - contains UserProfile interface
 *
 * const userInterface = findInterface('UserProfile', '/api/users.js');
 * // Searches /api/*.ts files and finds UserProfile in types.ts
 * ```
 * @performance Uses caching to avoid re-parsing files for subsequent lookups
 * @resilient Handles file system errors gracefully with warning logs
 * @public
 * @since 4.0.0
 */
export function findInterface(interfaceName: string, currentFile: string): ParsedInterface | null {
    // Check cache first
    const cached = interfaceCache.get(`${currentFile}:${interfaceName}`);
    if (cached) return cached;

    // Get the directory to search in
    const dir = path.dirname(currentFile);

    // Try to find in TypeScript files in the same directory
    try {
        const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'));

        for (const file of files) {
            const fullPath = path.join(dir, file);

            const interfaces = extractInterfacesFromFile(fullPath);
            if (interfaces.has(interfaceName)) {
                return interfaces.get(interfaceName)!;
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not read directory ${dir} for interface search:`, error.message);
    }

    return null;
}

/**
 * Parse TypeScript content to extract interface definitions
 * @param content
 */
function parseTypeScriptInterfaces(content: string): Map<string, ParsedInterface> {
    const interfaces = new Map<string, ParsedInterface>();

    // Remove comments and strings to avoid false matches
    const cleanContent = removeCommentsAndStrings(content);

    // Find all interface declarations, including those with generics
    // Matches: interface Name<T>, interface Name<T = unknown>, interface Name extends Base
    const interfaceRegex = /interface\s+(\w+)(?:<[^>]*>)?(?:\s+extends\s+([\w,\s]+))?\s*\{/g;
    let match;

    while ((match = interfaceRegex.exec(cleanContent)) !== null) {
        const [, name, extendsClause] = match;
        const startPos = match.index + match[0].length;

        // Find the matching closing brace using a counter
        let braceCount = 1;
        let pos = startPos;
        while (pos < cleanContent.length && braceCount > 0) {
            if (cleanContent[pos] === '{') braceCount++;
            else if (cleanContent[pos] === '}') braceCount--;
            pos++;
        }

        if (braceCount === 0) {
            const body = cleanContent.substring(startPos, pos - 1);

            const extendsInterfaces = extendsClause ? extendsClause.split(',').map((s) => s.trim()) : undefined;

            const properties = parseInterfaceBody(body);

            interfaces.set(name, {
                name,
                properties,
                extends: extendsInterfaces,
            });
        }
    }

    return interfaces;
}

/**
 * Parse the body of an interface to extract properties
 * @param body
 */
function parseInterfaceBody(body: string): ParsedProperty[] {
    const properties: ParsedProperty[] = [];

    // Split by semicolons and newlines, handle nested objects
    const lines = body
        .split(/[;\n]/)
        .map((line) => line.trim())
        .filter((line) => line);

    for (const line of lines) {
        if (!line || line.startsWith('//') || line.startsWith('*')) continue;

        // Skip index signatures like [k: string]: unknown or [extra: string]: unknown
        if (line.match(/^\[[\w\s:]+\]:\s*\w+/)) {
            continue;
        }

        // Handle Array<> syntax with complex types FIRST
        const genericArrayMatch = line.match(/^(\w+)(\?)?:\s*Array<\{?/);
        if (genericArrayMatch) {
            const [, name, optional] = genericArrayMatch;

            // For complex Array<{...}> types, just use Array as the type
            properties.push({
                name,
                type: 'Array',
                optional: !!optional,
                description: generateDescription(name),
            });
            continue;
        }

        // Handle nested objects: name?: { ... }
        const nestedMatch = line.match(/^(\w+)(\?)?:\s*\{/);
        if (nestedMatch) {
            const [, name, optional] = nestedMatch;

            // Treat as Object type for nested objects
            properties.push({
                name,
                type: 'Object',
                optional: !!optional,
                description: generateDescription(name),
            });
            continue;
        }

        // Handle array properties: name?: Type[] or Array<Type>
        const arrayMatch = line.match(/^(\w+)(\?)?:\s*(.+?)\[\](?:\s*\/\/(.+))?$/);
        if (arrayMatch) {
            const [, name, optional, baseType, comment] = arrayMatch;

            properties.push({
                name,
                type: `${normalizeTypeScript(baseType)}[]`,
                optional: !!optional,
                description: comment?.trim() || generateDescription(name),
            });
            continue;
        }

        // Handle simple properties: name?: type (but not lines that end with just {)
        const simpleMatch = line.match(/^(\w+)(\?)?:\s*(.+?)(?:\s*\/\/(.+))?$/);
        if (simpleMatch) {
            const [, name, optional, typeStr, comment] = simpleMatch;

            // Skip if this looks like a nested object start
            if (typeStr.trim() === '{') {
                continue;
            }

            properties.push({
                name,
                type: normalizeTypeScript(typeStr),
                optional: !!optional,
                description: comment?.trim() || generateDescription(name),
            });
            continue;
        }
    }

    return properties;
}

/**
 * Convert TypeScript types to APIDoc format
 * @param type
 */
function normalizeTypeScript(type: string): string {
    const cleaned = type.trim();

    // Basic type mappings
    const typeMap: Record<string, string> = {
        string: 'String',
        number: 'Number',
        boolean: 'Boolean',
        any: 'Mixed',
        unknown: 'Mixed',
        object: 'Object',
        void: 'Void',
    };

    if (typeMap[cleaned]) {
        return typeMap[cleaned];
    }

    // Handle generic type parameters (T, U, K, V, etc.) - convert to Mixed
    if (/^[A-Z]$/.test(cleaned)) {
        return 'Mixed';
    }

    // Handle string literals: "value1" | "value2" FIRST
    if (cleaned.includes('"') || cleaned.includes("'")) {
        // Check if it's a union of string literals
        if (cleaned.includes('|')) {
            const values = cleaned.match(/['"']([^'"']+)['"']/g);
            if (values && values.length > 1) {
                return `String=${values.join(',')}`;
            }
        } else {
            // Single string literal
            const singleValue = cleaned.match(/['"']([^'"']+)['"']/);
            if (singleValue) {
                return 'String';
            }
        }
    }

    // Handle union types: string | number
    if (cleaned.includes('|')) {
        const types = cleaned.split('|').map((t) => normalizeTypeScript(t.trim()));
        return types.join('/');
    }

    // Handle generic types: Array<string>
    const genericMatch = cleaned.match(/^(\w+)<(.+)>$/);
    if (genericMatch) {
        const [, baseType, innerType] = genericMatch;

        if (baseType === 'Array') {
            return `${normalizeTypeScript(innerType)}[]`;
        }

        return normalizeTypeScript(baseType);
    }

    // Default to the original type for complex/custom types
    return cleaned;
}

/**
 * Generate description from property name
 * @param name
 */
function generateDescription(name: string): string {
    return name
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/^./, (str) => str.toUpperCase());
}

/**
 * Remove comments and strings to avoid parsing issues
 * @param content
 */
function removeCommentsAndStrings(content: string): string {
    return (
        content
            // Remove single-line comments
            .replace(/\/\/.*$/gm, '')
            // Remove multi-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove string literals (basic)
            .replace(/"[^"]*"/g, '""')
            .replace(/'[^']*'/g, "''")
            // Remove template literals (basic)
            .replace(/`[^`]*`/g, '``')
    );
}

/**
 * Converts a parsed TypeScript interface to APIDoc documentation elements
 * @description This function transforms a parsed interface definition into an array
 * of APIDoc elements (@apiParam, @apiSuccess, @apiError, etc.). It handles optional
 * properties, group organization, and proper bracket notation for APIDoc formatting.
 * Each interface property becomes a separate APIDoc element with appropriate type
 * information and descriptions.
 * @param iface - Parsed interface definition to convert
 * @param elementType - Target APIDoc element type (default: 'apiParam')
 * @param group - Optional group name for parameter organization
 * @returns Array of APIDoc elements ready for documentation generation
 * @example Basic interface conversion
 * ```typescript
 * const userInterface = {
 *   name: 'UserProfile',
 *   properties: [
 *     { name: 'id', type: 'Number', optional: false, description: 'User ID' },
 *     { name: 'email', type: 'String', optional: false, description: 'Email address' },
 *     { name: 'name', type: 'String', optional: true, description: 'Display name' }
 *   ]
 * };
 *
 * const elements = interfaceToApiDocElements(userInterface);
 * // Returns: [
 * //   { source: '@apiParam {Number} id User ID', name: 'apiparam', ... },
 * //   { source: '@apiParam {String} email Email address', name: 'apiparam', ... },
 * //   { source: '@apiParam {String} [name] Display name', name: 'apiparam', ... }
 * // ]
 * ```
 * @example Success response conversion with group
 * ```typescript
 * const responseInterface = {
 *   name: 'ApiResponse',
 *   properties: [
 *     { name: 'status', type: 'String', optional: false, description: 'Response status' },
 *     { name: 'data', type: 'Object', optional: true, description: 'Response data' }
 *   ]
 * };
 *
 * const elements = interfaceToApiDocElements(responseInterface, 'apiSuccess', 'Response');
 * // Returns: [
 * //   { source: '@apiSuccess (Response) {String} status Response status', ... },
 * //   { source: '@apiSuccess (Response) {Object} [data] Response data', ... }
 * // ]
 * ```
 * @example Error response conversion
 * ```typescript
 * const errorInterface = {
 *   name: 'ErrorResponse',
 *   properties: [
 *     { name: 'error', type: 'String', optional: false, description: 'Error message' },
 *     { name: 'code', type: 'Number', optional: false, description: 'Error code' }
 *   ]
 * };
 *
 * const elements = interfaceToApiDocElements(errorInterface, 'apiError');
 * // Returns error response documentation elements
 * ```
 * @public
 * @since 4.0.0
 */
export function interfaceToApiDocElements(
    iface: ParsedInterface,
    elementType: string = 'apiParam',
    group?: string
): Array<any> {
    const elements: Array<any> = [];

    for (const prop of iface.properties) {
        const fieldName = prop.optional ? `[${prop.name}]` : prop.name;
        const groupPrefix = group ? `(${group}) ` : '';
        const content = `${groupPrefix}{${prop.type}} ${fieldName} ${prop.description || ''}`;

        elements.push({
            source: `@${elementType} ${groupPrefix}{${prop.type}} ${fieldName} ${prop.description || ''}`,
            name: elementType.toLowerCase(),
            sourceName: elementType,
            content: content.trim(),
        });
    }

    return elements;
}
