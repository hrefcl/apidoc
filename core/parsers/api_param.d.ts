/**
 * @file Parser for @apiParam tags - handles API parameter documentation
 *
 * This parser processes @apiParam tags to extract parameter definitions including:
 * - Parameter groups and nesting
 * - Data types and validation rules
 * - Optional parameters and default values
 * - Size constraints and allowed values
 * - Nested object parameter structures
 */
/**
 * Parse to extract API param
 *
 * @param content Raw input string to be parsed. May contain line breaks and metadata formatted in a predefined syntax.
 * @param source - UNUSED
 * @param defaultGroup - Name to use if no group is identified in the content.
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
 *     description: string}|null} Parsed metadata
 */
declare function parse(content: any, source: any, defaultGroup: any): {
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
 * Construct and return a string representing a structured path for parameter fields
 * based on a group retrieved from the API parser.
 *
 * @returns {string}
 */
declare function path(): string;
/**
 * Retrieve the current group.
 *
 * @returns {string}
 */
declare function getGroup(): string;
export { parse, path };
export declare const method = "push";
export { getGroup };
export declare const markdownFields: string[];
export declare const markdownRemovePTags: string[];
//# sourceMappingURL=api_param.d.ts.map