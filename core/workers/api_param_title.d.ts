interface ParsedBlock {
    global: any;
    local: any;
    version?: string;
    index: number;
}
type ParsedFile = ParsedBlock[];
interface PackageInfos {
    defaultVersion: string;
}
/**
 * PreProcess API Param Title
 *
 * Processes the parsed files and organizes the data in a structured format.
 *
 * @param parsedFiles - An array of parsed file objects containing the data blocks.
 * @param filenames - An array of filenames associated with the parsed files.
 * @param packageInfos - Information about the package, including its default version.
 * @param [target] - Target key/path in preProcess-Object where the processed data will be stored.
 * @returns {object} Processed data organized by the target key.
 */
declare function preProcess(parsedFiles: ParsedFile[], filenames: string[], packageInfos: PackageInfos, target?: string): any;
/**
 * PostProcess API Param Title
 *
 * Process parsed files and update specific target fields based on predefined and pre-processed sources.
 *
 * Handles
 * - versioning,
 * - matches data definitions
 * - updates field information
 *
 * @param parsedFiles - Array of objects containing the parsed file data. Each file contains blocks to modify.
 * @param filenames - Array of filenames associated with the parsed files.
 * @param preProcess - Pre-processed data source used for matching and updating fields.
 * @param packageInfos - Contains package-specific information such as default version.
 * @param [source] - Source path in preProcess-Object
 * @param [target] - Relative path to the tree (local.), where the data should be modified.
 * @param [messages] - Messages used for error reporting.
 */
declare function postProcess(parsedFiles: ParsedFile[], filenames: string[], preProcess: any, packageInfos: PackageInfos, source?: string, target?: string, messages?: any): void;
/**
 * Exports
 */
export { postProcess, preProcess };
//# sourceMappingURL=api_param_title.d.ts.map