/**
 * Extend the error object to broadcast parsing errors in an operation.
 */
export declare class ParserError extends Error {
    file: string;
    block: string;
    element: string;
    source: string;
    extra: any[];
    constructor(message: string, file: string, block: string, element: string, source: string, extra?: any[]);
}
//# sourceMappingURL=parser_error.d.ts.map