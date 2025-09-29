/**
 * @file Post-processing filter for @apiHeader tags - removes duplicate header fields
 *
 * This filter handles deduplication of HTTP header fields using the same logic
 * as parameter deduplication. It delegates to the @apiParam filter with the 'header'
 * tag name to ensure consistent behavior across different field types.
 */
/**
 * Post-process filter to remove duplicate HTTP header fields
 *
 * Delegates to the parameter filter to remove duplicate header fields that can
 * occur when local @apiHeader definitions override inherited header fields from
 *
 * @apiDefine blocks. Uses the same deduplication logic as parameters.
 *
 * @param parsedFiles - Array of parsed file objects containing API documentation blocks
 * @param filenames - Array of filenames (unused but required for filter interface)
 *
 * @example Header field deduplication
 * ```typescript
 * // Removes duplicate HTTP header fields
 * postFilter(parsedFiles, filenames);
 * // Equivalent to: apiParamPostFilter(parsedFiles, filenames, 'header')
 * ```
 *
 * @since 4.0.0
 * @public
 */
export declare function postFilter(parsedFiles: any[], filenames: string[]): void;
//# sourceMappingURL=api_header.d.ts.map