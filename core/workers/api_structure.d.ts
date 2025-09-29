/**
 * @file Worker for @apiStructure tags - processes reusable parameter structures
 *
 * This worker handles @apiStructure tags that allow definition and inclusion of
 * reusable parameter structures. It delegates most processing to the @apiUse worker
 * but with specific configuration for structure definitions.
 */
/**
 * PreProcess API Structure tags to collect structure definitions
 *
 * First phase of @apiStructure processing that delegates to the @apiUse worker
 * to collect @apiDefine blocks specifically for parameter structures. These
 * structures define reusable parameter patterns that can be included in multiple endpoints.
 *
 * @param parsedFiles - Array of parsed file objects containing structure definitions
 * @param filenames - Array of filenames for the parsed files
 * @param packageInfos - Package information for version handling
 * @returns Object containing collected structure definitions organized by name and version
 *
 * @example Structure definition collection
 * ```typescript
 * // Collects @apiDefine blocks marked for structure use
 * const result = preProcess(parsedFiles, filenames, packageInfos);
 * // Returns: { defineStructure: { "UserStructure": { "1.0.0": {...} } } }
 * ```
 *
 * @since 4.0.0
 * @internal
 */
declare function preProcess(parsedFiles: any, filenames: any, packageInfos: any): any;
/**
 * PostProcess API Structure tags to include structure definitions
 *
 * Second phase of @apiStructure processing that delegates to the @apiUse worker
 * to find @apiStructure references and replace them with the corresponding
 * structure definitions. This enables reuse of complex parameter structures
 * across multiple API endpoints.
 *
 * @param parsedFiles - Array of parsed file objects to process for @apiStructure references
 * @param filenames - Array of filenames for error reporting
 * @param preProcess - Previously collected structure definitions from preprocessing
 * @param packageInfos - Package information for version matching
 *
 * @throws {WorkerError} When referenced structure doesn't exist (via delegated worker)
 * @throws {WorkerError} When version matching fails (via delegated worker)
 *
 * @example Structure inclusion
 * ```typescript
 * // Before: block contains @apiStructure UserStructure
 * postProcess(parsedFiles, filenames, preProcess, packageInfos);
 * // After: UserStructure parameters are merged into the block
 * ```
 *
 * @since 4.0.0
 * @internal
 */
declare function postProcess(parsedFiles: any, filenames: any, preProcess: any, packageInfos: any): void;
/**
 * Export configuration for the structure worker
 */
export { postProcess, preProcess };
//# sourceMappingURL=api_structure.d.ts.map