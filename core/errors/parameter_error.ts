/**
 * Extend the error object to broadcast parameter errors in an operation or configuration.
 */
export class ParameterError extends Error {
    public element: string;
    public definition: string;
    public example: string;

    constructor(message: string, element: string, definition: string, example: string) {
        super(message);
        this.name = this.constructor.name;

        this.element = element;
        this.definition = definition;
        this.example = example;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ParameterError);
        }
    }
}
