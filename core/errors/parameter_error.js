"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterError = void 0;
/**
 * Extend the error object to broadcast parameter errors in an operation or configuration.
 */
class ParameterError extends Error {
    element;
    definition;
    example;
    constructor(message, element, definition, example) {
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
exports.ParameterError = ParameterError;
//# sourceMappingURL=parameter_error.js.map