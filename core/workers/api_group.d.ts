/**
 * @file Worker for @apiGroup tags - processes API endpoint grouping and organization
 *
 * This worker handles @apiGroup tags that organize API endpoints into logical groups
 * for documentation. It manages group definitions, title extraction, and URL-safe
 * group name generation for navigation and linking.
 */
/**
 * PreProcess API Group tags to collect group definitions
 *
 * First phase of group processing that scans parsed files to collect @apiDefine
 * blocks that define group metadata (titles and descriptions). These definitions
 * will be used later to enhance group information in API endpoints.
 *
 * @param parsedFiles - Array of parsed file objects containing group definitions
 * @param filenames - Array of filenames for the parsed files
 * @param packageInfos - Package information for version handling
 * @param target - Target key in result object for storing group definitions
 * @returns Object containing group definitions organized by name and version
 *
 * @example Group definition collection
 * ```typescript
 * // Collects @apiDefine blocks for groups
 * const result = preProcess(parsedFiles, filenames, packageInfos, 'defineGroup');
 * // Returns: { defineGroup: { "User": { "1.0.0": { title: "User Management", description: "..." } } } }
 * ```
 *
 * @since 4.0.0
 * @internal
 */
declare function preProcess(parsedFiles: any, filenames: any, packageInfos: any, target: any): {};
/**
 * PostProcess API Group tags to enhance endpoint grouping
 *
 * Second phase of group processing that assigns group information to API endpoints.
 * For endpoints without explicit groups, uses filename as fallback. Normalizes group
 * names for URL safety and applies group titles and descriptions from definitions.
 *
 * @param parsedFiles - Array of parsed file objects to process for group assignment
 * @param filenames - Array of filenames for fallback group names and error reporting
 * @param preProcess - Previously collected group definitions from preprocessing
 * @param packageInfos - Package information for version matching
 * @param source - Key in preProcess object containing group definitions
 * @param target - Key in block.local for group information storage
 * @param messages - Error message templates for consistent error reporting
 *
 * @throws {WorkerError} When referenced group definition has version mismatch
 *
 * @example Group assignment and normalization
 * ```typescript
 * // Before: block.local.group = "User Management"
 * postProcess(parsedFiles, filenames, preProcess, packageInfos);
 * // After: block.local.group = "User_Management", block.local.groupTitle = "User Management"
 * ```
 *
 * @since 4.0.0
 * @internal
 */
declare function postProcess(parsedFiles: any[], filenames: string[], preProcess: any, packageInfos: any, source?: string, target?: string, messages?: any): void;
/**
 * Export configuration for the group worker
 */
export { postProcess, preProcess };
//# sourceMappingURL=api_group.d.ts.map