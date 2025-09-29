/**
 * @file Worker error class for APIDoc processing errors
 */

/**
 * Specialized error class for worker process errors during API documentation parsing
 *
 * WorkerError extends the base Error class to provide detailed context about
 * parsing failures, including file location, block information, and usage examples.
 * This helps developers quickly identify and fix documentation syntax issues.
 * @example Basic usage
 * ```typescript
 * throw new WorkerError(
 *   'Invalid parameter syntax',
 *   'src/api/users.js',
 *   '15',
 *   '@apiParam',
 *   '@apiParam {String} name',
 *   '@apiParam {String} name User name',
 *   { line: 15, column: 10 }
 * );
 * ```
 * @example Error handling
 * ```typescript
 * try {
 *   // Parse API documentation
 * } catch (error) {
 *   if (error instanceof WorkerError) {
 *     console.error(`Error in ${error.file} at block ${error.block}`);
 *     console.error(`Element: ${error.element}`);
 *     console.error(`Usage: ${error.definition}`);
 *   }
 * }
 * ```
 * @since 4.0.0
 * @public
 */
export class WorkerError extends Error {
    /** Source file where the error occurred */
    public file: string;

    /** Block identifier or line number where the error occurred */
    public block: string;

    /** API documentation element that caused the error (e.g., '@apiParam') */
    public element: string;

    /** Correct usage definition for the element */
    public definition: string;

    /** Example of correct usage */
    public example: string;

    /** Additional error context (line numbers, validation details, etc.) */
    public extra: any;

    /**
     * Creates a new WorkerError with detailed context information
     * @param message - Primary error message describing what went wrong
     * @param file - Source file path where the error occurred
     * @param block - Block identifier, line number, or position in the file
     * @param element - API documentation element that caused the error
     * @param definition - Correct syntax/usage for the element
     * @param example - Example showing proper usage of the element
     * @param extra - Additional context like line/column numbers, validation details
     * @example
     * ```typescript
     * throw new WorkerError(
     *   'Missing parameter type',
     *   'src/controllers/user.js',
     *   '42',
     *   '@apiParam',
     *   '@apiParam {Type} name Description',
     *   '@apiParam {String} username User login name',
     *   { line: 42, column: 15, found: '{} name' }
     * );
     * ```
     */
    constructor(
        message: string,
        file: string,
        block: string,
        element: string,
        definition: string,
        example: string,
        extra?: any
    ) {
        super(message);
        this.name = this.constructor.name;

        this.file = file;
        this.block = block;
        this.element = element;
        this.definition = definition;
        this.example = example;
        this.extra = extra;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, WorkerError);
        }
    }
}
