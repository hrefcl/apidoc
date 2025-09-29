"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserError = void 0;
/**
 * Extend the error object to broadcast parsing errors in an operation.
 */
class ParserError extends Error {
    file;
    block;
    element;
    source;
    extra;
    constructor(message, file, block, element, source, extra) {
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
exports.ParserError = ParserError;
//# sourceMappingURL=parser_error.js.map