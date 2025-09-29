/**
 * PostProcess API Name
 *
 * - Priority: process after use and api
 * - Processes parsed files and modifies their structure by generating specific identifiers for each block.
 * - Ensures that every block has a local name, which is either provided or constructed dynamically using type and URL information.
 *
 * @param parsedFiles - An array of parsed files, where each file contains an array of blocks.
 *     Each block is an object that contains local and global properties, among other metadata.
 */
declare function postProcess(parsedFiles: any): void;
/**
 * Exports
 */
export { postProcess };
//# sourceMappingURL=api_name.d.ts.map