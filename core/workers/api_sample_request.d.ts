/**
 * PostProcess API Sample Request
 *
 * Processes the parsed files and metadata after the initial processing is completed.
 * Handles sample request URLs, including prepending the sampleUrl from packageInfos
 * for relative URLs and filtering out disabled sample requests.
 *
 * @param parsedFiles - Array of objects containing the parsed file data.
 * @param filenames - Array of filenames associated with the parsed files.
 * @param preProcess - Pre-processing results containing defined sample requests.
 * @param packageInfos - Collection of package-level details and information.
 */
declare function postProcess(parsedFiles: any, filenames: any, preProcess: any, packageInfos: any): void;
/**
 * Exports
 */
export { postProcess };
//# sourceMappingURL=api_sample_request.d.ts.map