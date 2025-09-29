/**
 * Parse to extract API query
 *
 * @param content - The content to be parsed.
 * @param source - UNUSED
 * @returns {{
 *     group: string,
 *     type: string,
 *     size: string,
 *     allowedValues: string,
 *     optional: boolean,
 *     parentNode: *,
 *     field: string,
 *     isArray: boolean,
 *     defaultValue: string,
 *     description: string}|null}
 */
declare function parse(content: any, source: any): {
    group: string;
    type: string;
    size: string;
    allowedValues: string;
    optional: boolean;
    parentNode: any;
    field: string;
    isArray: boolean;
    defaultValue: string;
    description: any;
};
/**
 * Exports
 */
export { parse };
export declare const path = "local.query";
export declare const method = "push";
export declare const markdownFields: string[];
//# sourceMappingURL=api_query.d.ts.map