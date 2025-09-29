/**
 * @file Post-processing filter for @apiSuccess tags - removes duplicate success fields
 *
 * This filter handles deduplication of success response fields using the same logic
 * as parameter deduplication. It delegates to the @apiParam filter with the 'success'
 * tag name to ensure consistent behavior across different field types.
 */

import { postFilter as apiParamPostFilter } from './api_param';

/**
 * Post-process filter to remove duplicate success response fields
 *
 * Delegates to the parameter filter to remove duplicate success response fields
 * that can occur when local @apiSuccess definitions override inherited success
 * fields from @apiDefine blocks. Uses the same deduplication logic as parameters.
 * @param parsedFiles - Array of parsed file objects containing API documentation blocks
 * @param filenames - Array of filenames (unused but required for filter interface)
 * @example Success field deduplication
 * ```typescript
 * // Removes duplicate success response fields
 * postFilter(parsedFiles, filenames);
 * // Equivalent to: apiParamPostFilter(parsedFiles, filenames, 'success')
 * ```
 * @since 4.0.0
 * @public
 */
export function postFilter(parsedFiles: any[], filenames: string[]): void {
    apiParamPostFilter(parsedFiles, filenames, 'success');
}
