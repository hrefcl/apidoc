import * as path from 'path';

/**
 * Extend the base error object to include additional file and path details.
 */
export class FileError extends Error {
    public file: string;
    public path: string;

    constructor(message: string, file?: string, filePath?: string) {
        super(message);
        this.name = this.constructor.name;

        this.file = file || '';
        this.path = filePath || file || '';

        if (this.path && this.path.charAt(this.path.length - 1) !== '/') {
            this.path = path.dirname(this.path);
        }

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FileError);
        }
    }
}
