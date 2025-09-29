/**
 * Extend the base error object to include additional file and path details.
 */
export declare class FileError extends Error {
    file: string;
    path: string;
    constructor(message: string, file?: string, filePath?: string);
}
//# sourceMappingURL=file_error.d.ts.map