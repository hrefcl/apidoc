/**
 * @file Worker for @apiUse tags - processes inclusion of predefined documentation blocks
 *
 * This worker handles the preprocessing and postprocessing of @apiUse tags, which allow
 * inclusion of predefined documentation blocks (defined with @apiDefine) into API endpoints.
 * It manages versioning, recursive merging, and error handling for undefined references.
 */
/**
 * PreProcess API Use tags to collect defined blocks
 *
 * First phase of @apiUse processing that scans all parsed files to collect
 *
 * @apiDefine blocks and organize them by name and version. These blocks will
 * later be referenced by @apiUse tags during postprocessing.
 *
 * @param parsedFiles - Array of parsed file objects containing API documentation blocks
 * @param filenames - Array of filenames corresponding to the parsed files
 * @param packageInfos - Package information including default version for versioning
 * @param target - Target key in result object where collected definitions are stored
 * @returns Object containing all defined blocks organized by name and version
 *
 * @example Collecting defined blocks
 * ```typescript
 * // Input: Parsed files with @apiDefine blocks
 * const result = preProcess(parsedFiles, filenames, packageInfos, 'define');
 * // Output: { define: { "UserObject": { "1.0.0": { ... block data ... } } } }
 * ```
 *
 * @since 4.0.0
 * @internal
 */
declare function preProcess(parsedFiles: any[], filenames: string[], packageInfos: any, target?: string): any;
/**
 * PostProcess API Use tags to include defined blocks
 *
 * Second phase of @apiUse processing that finds @apiUse references in API blocks
 * and replaces them with the corresponding @apiDefine block content. Handles
 * version matching, recursive inclusion, and error reporting for missing references.
 *
 * @param parsedFiles - Array of parsed file objects to process for @apiUse tags
 * @param filenames - Array of filenames for error reporting
 * @param preProcess - Previously collected defined blocks from preprocessing phase
 * @param packageInfos - Package information for version handling
 * @param source - Key in preProcess object containing the defined blocks
 * @param target - Key in block.local containing @apiUse references to process
 * @param messages - Error message templates for consistent error reporting
 *
 * @throws {WorkerError} When referenced definition doesn't exist
 * @throws {WorkerError} When recursion depth exceeds limit (10 levels)
 * @throws {WorkerError} When no matching version is found
 *
 * @example Processing @apiUse references
 * ```typescript
 * // Before: block.local.use = [{ name: "UserObject" }]
 * postProcess(parsedFiles, filenames, preProcess, packageInfos);
 * // After: UserObject definition content is merged into the block
 * ```
 *
 * @since 4.0.0
 * @internal
 */
declare function postProcess(parsedFiles: any[], filenames: string[], preProcess: any, packageInfos: any, source?: string, target?: string, messages?: any): void;
/**
 * Exports
 */
export { postProcess, preProcess };
//# sourceMappingURL=api_use.d.ts.map