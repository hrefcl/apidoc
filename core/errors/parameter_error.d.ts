/**
 * Extend the error object to broadcast parameter errors in an operation or configuration.
 */
export declare class ParameterError extends Error {
    element: string;
    definition: string;
    example: string;
    constructor(message: string, element: string, definition: string, example: string);
}
//# sourceMappingURL=parameter_error.d.ts.map