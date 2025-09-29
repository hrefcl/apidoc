/**
 * @file Post-processing filter for @apiError tags - removes duplicate error fields
 *
 * This filter handles deduplication of error response fields using the same logic
 * as parameter deduplication. It delegates to the @apiParam filter with the 'error'
 * tag name to ensure consistent behavior across different field types.
 */

import { postFilter as apiParamPostFilter } from './api_param';

/**
 * Post-process filter to remove duplicate error response fields
 *
 * Delegates to the parameter filter to remove duplicate error response fields
 * that can occur when local @apiError definitions override inherited error
 * fields from @apiDefine blocks. Uses the same deduplication logic as parameters.
 * @param parsedFiles - Array of parsed file objects containing API documentation blocks
 * @param filenames - Array of filenames (unused but required for filter interface)
 * @example Error field deduplication
 * ```typescript
 * // Removes duplicate error response fields
 * postFilter(parsedFiles, filenames);
 * // Equivalent to: apiParamPostFilter(parsedFiles, filenames, 'error')
 * ```
 * @since 4.0.0
 * @public
 */
export function postFilter(parsedFiles: any[], filenames: string[]): void {
    apiParamPostFilter(parsedFiles, filenames, 'error');
}
