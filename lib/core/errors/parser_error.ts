/**
 * Extend the error object to broadcast parsing errors in an operation.
 */
export class ParserError extends Error {
    public file: string;
    public block: string;
    public element: string;
    public source: string;
    public extra: any[];

    constructor(message: string, file: string, block: string, element: string, source: string, extra?: any[]) {
        super(message);
        this.name = this.constructor.name;

        this.file = file;
        this.block = block;
        this.element = element;
        this.source = source;
        this.extra = extra || [];

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ParserError);
        }
    }
}
