// Same as @apiParam
import * as apiParser from './api_param';

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
function parse(content, source) {
    return apiParser.parse(content, source, 'Query');
}

/**
 * Exports
 */
export { parse };
export const path = 'local.query';
export const method = apiParser.method;
export const markdownFields = ['description'];
