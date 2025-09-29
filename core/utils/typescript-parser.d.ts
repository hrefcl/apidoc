/**
 * @file TypeScript Interface Parser - extracts and converts interface definitions
 *
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
 *
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
 *
 * @author hrefcl
 * @since 4.0.0
 * @version 4.0.0
 */
/**
 * Represents a parsed TypeScript interface property with type information
 *
 * @description This interface defines the structure for storing parsed property
 * information from TypeScript interface definitions. It captures all necessary
 * details for converting properties to APIDoc parameter documentation.
 *
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
 *
 * @description This interface stores the complete structure of a parsed TypeScript
 * interface including all its properties and inheritance information. It serves
 * as the primary data structure for interface-to-APIDoc conversion.
 *
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
 * Extracts all TypeScript interface definitions from a source file
 *
 * @description This function reads and parses a TypeScript file to extract all
 * interface definitions. It handles complex nested structures, inheritance,
 * and caches results for performance. The function is resilient to parsing
 * errors and will log warnings for problematic files.
 *
 * @param filePath - Absolute path to the TypeScript file to parse
 *
 * @returns Map of interface names to their parsed definitions
 *
 * @example Basic file parsing
 * ```typescript
 * const interfaces = extractInterfacesFromFile('/src/types/user.ts');
 * console.log(interfaces.get('UserProfile'));
 * // Returns: { name: 'UserProfile', properties: [...], extends: undefined }
 * ```
 *
 * @example Handling multiple interfaces
 * ```typescript
 * const interfaces = extractInterfacesFromFile('/src/types/api.ts');
 * for (const [name, definition] of interfaces) {
 *   console.log(`Found interface: ${name} with ${definition.properties.length} properties`);
 * }
 * ```
 *
 * @throws Logs warning and returns empty Map if file cannot be read or parsed
 *
 * @public
 * @since 4.0.0
 */
export declare function extractInterfacesFromFile(filePath: string): Map<string, ParsedInterface>;
/**
 * Finds a TypeScript interface definition by name in the current file or project
 *
 * @description This function searches for a specific interface definition starting
 * with the cache, then the current file's directory. It performs cross-file lookups
 * to find interface definitions that may be defined in separate TypeScript files,
 * enabling flexible interface referencing in @apiSchema tags.
 *
 * @param interfaceName - Name of the interface to find (e.g., 'UserProfile')
 * @param currentFile - Path to the current file being processed (used for relative search)
 *
 * @returns Parsed interface definition or null if not found
 *
 * @example Finding interface in same directory
 * ```typescript
 * // In /api/users.js, looking for UserProfile interface
 * const userInterface = findInterface('UserProfile', '/api/users.js');
 * if (userInterface) {
 *   console.log(`Found ${userInterface.properties.length} properties`);
 * }
 * ```
 *
 * @example Cache hit scenario
 * ```typescript
 * // First call parses and caches
 * const interface1 = findInterface('UserProfile', '/api/users.js');
 *
 * // Second call returns cached result
 * const interface2 = findInterface('UserProfile', '/api/users.js');
 * // interface1 === interface2 (same reference)
 * ```
 *
 * @example Cross-file interface discovery
 * ```typescript
 * // File structure:
 * // /api/users.js - contains @apiSchema reference
 * // /api/types.ts - contains UserProfile interface
 *
 * const userInterface = findInterface('UserProfile', '/api/users.js');
 * // Searches /api/*.ts files and finds UserProfile in types.ts
 * ```
 *
 * @performance Uses caching to avoid re-parsing files for subsequent lookups
 * @resilient Handles file system errors gracefully with warning logs
 *
 * @public
 * @since 4.0.0
 */
export declare function findInterface(interfaceName: string, currentFile: string): ParsedInterface | null;
/**
 * Converts a parsed TypeScript interface to APIDoc documentation elements
 *
 * @description This function transforms a parsed interface definition into an array
 * of APIDoc elements (@apiParam, @apiSuccess, @apiError, etc.). It handles optional
 * properties, group organization, and proper bracket notation for APIDoc formatting.
 * Each interface property becomes a separate APIDoc element with appropriate type
 * information and descriptions.
 *
 * @param iface - Parsed interface definition to convert
 * @param elementType - Target APIDoc element type (default: 'apiParam')
 * @param group - Optional group name for parameter organization
 *
 * @returns Array of APIDoc elements ready for documentation generation
 *
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
 *
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
 *
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
 *
 * @public
 * @since 4.0.0
 */
export declare function interfaceToApiDocElements(iface: ParsedInterface, elementType?: string, group?: string): Array<any>;
export {};
//# sourceMappingURL=typescript-parser.d.ts.map