/**
 * @file Post-processing filter for @apiParam tags - removes duplicate parameter fields
 *
 * This filter handles deduplication of parameter fields that can occur when local
 * definitions override inherited global definitions from @apiUse or @apiDefine blocks.
 * It ensures each parameter field appears only once in the final documentation.
 */

/**
 * Post-process filter to remove duplicate parameter fields
 *
 * Scans through parsed API blocks to identify and remove duplicate parameter fields
 * based on their field names. This typically occurs when a local @apiParam definition
 * overrides a parameter inherited from a global @apiDefine block via @apiUse.
 *
 * The filter preserves the first occurrence of each field and removes subsequent
 * duplicates, ensuring that local definitions take precedence over inherited ones.
 *
 * @param parsedFiles - Array of parsed file objects containing API documentation blocks
 * @param filenames - Array of filenames (unused but required for filter interface)
 * @param tagName - Type of parameter fields to deduplicate (default: 'parameter')
 *
 * @example Deduplication process
 * ```typescript
 * // Before filtering:
 * // block.local.parameter.fields.Parameter = [
 * //   { field: "name", description: "Inherited description" },
 * //   { field: "name", description: "Local description" },
 * //   { field: "email", description: "Email field" }
 * // ]
 *
 * postFilter(parsedFiles, filenames, 'parameter');
 *
 * // After filtering:
 * // block.local.parameter.fields.Parameter = [
 * //   { field: "name", description: "Inherited description" },
 * //   { field: "email", description: "Email field" }
 * // ]
 * ```
 *
 * @since 4.0.0
 * @public
 */
export function postFilter(parsedFiles: any[], filenames: string[], tagName: string = 'parameter'): void {
    parsedFiles.forEach(function (parsedFile) {
        parsedFile.forEach(function (block) {
            if (block.local[tagName] && block.local[tagName].fields) {
                const blockFields = block.local[tagName].fields;
                Object.keys(blockFields).forEach(function (blockFieldKey) {
                    const fields = block.local[tagName].fields[blockFieldKey];
                    const newFields: any[] = [];
                    const existingKeys: { [key: string]: number } = {};
                    fields.forEach(function (field: any) {
                        const key = field.field; // .field (=id) is the key to check if it exists twice
                        if (!existingKeys[key]) {
                            existingKeys[key] = 1;
                            newFields.push(field);
                        }
                    });
                    block.local[tagName].fields[blockFieldKey] = newFields;
                });
            }
        });
    });
}
