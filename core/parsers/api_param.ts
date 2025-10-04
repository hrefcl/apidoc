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

import unindent from '../utils/unindent';

/** Current parameter group being processed */
let group = '';

/** Registry of parent parameter structures for nested objects */
const parents = {};

/**
 * Complex regular expression patterns for parsing @apiParam syntax
 *
 * Handles the full @apiParam syntax including:
 * - Optional parameter groups: `(groupName)`
 * - Data types with constraints: `{String{1..10}}`
 * - Allowed values: `{String="small","medium","large"}`
 * - Parameter names with nesting: `user.profile.name`
 * - Optional parameters: `[paramName]`
 * - Default values: `[paramName="default value"]`
 * - Array parameters: `paramName[]`
 * @example Supported syntax patterns
 * ```
 * @apiParam {String} name User name
 * @apiParam {String{3..20}} username Login username (3-20 chars)
 * @apiParam {String="admin","user"} role User role
 * @apiParam (Profile) {String} [displayName="Anonymous"] Display name
 * @apiParam {Object} user User object
 * @apiParam {String} user.name User's full name
 * @apiParam {Number[]} scores Array of scores
 * ```
 *
 * Naming convention for regex components:
 * - `b` -> begin (start of pattern)
 * - `e` -> end (end of pattern)
 * - `o` -> optional (wrapper for optional elements)
 * - `w` -> wrapper (container for elements)
 * - `name` -> field name or value identifier
 * @internal
 */
const regExp = {
    b: '^', // start
    oGroup: {
        // optional group: (404)
        b: '\\s*(?:\\(\\s*', // starting with '(', optional surrounding spaces
        group: '(.+?)', // 1
        e: '\\s*\\)\\s*)?', // ending with ')', optional surrounding spaces
    },
    oType: {
        // optional type: {string}
        b: '\\s*(?:\\{\\s*', // starting with '{', optional surrounding spaces
        type: '([a-zA-Z0-9()#:\\.\\/\\\\\\[\\]_|-]+)', // 2
        oSize: {
            // optional size within type: {string{1..4}}
            b: '\\s*(?:\\{\\s*', // starting with '{', optional surrounding spaces
            size: '(.+?)', // 3
            e: '\\s*\\}\\s*)?', // ending with '}', optional surrounding spaces
        },
        oAllowedValues: {
            // optional allowed values within type: {string='abc','def'}
            b: '\\s*(?:=\\s*', // starting with '=', optional surrounding spaces
            possibleValues: '(.+?)', // 4
            e: '(?=\\s*\\}\\s*))?', // ending with '}', optional surrounding spaces
        },
        e: '\\s*\\}\\s*)?', // ending with '}', optional surrounding spaces
    },
    wName: {
        b: '(\\[?\\s*', // 5 optional optional-marker
        name: '([#@a-zA-Z0-9\\u00C0-\\u017F\\$\\:\\.\\/\\\\_-]+', // 6 - Fixed: Added Unicode Latin Extended support (\u00C0-\u017F includes á, é, í, ó, ú, ñ, etc.)
        withArray: '(?:\\[[a-zA-Z0-9\\u00C0-\\u017F\\.\\/\\\\_-]*\\])?)', // Fixed: Added Unicode support
        oDefaultValue: {
            // optional defaultValue
            b: '(?:\\s*=\\s*(?:', // starting with '=', optional surrounding spaces
            withDoubleQuote: '"([^"]*)"', // 7
            withQuote: "|'([^']*)'", // 8
            withoutQuote: '|(.*?)(?:\\s|\\]|$)', // 9
            e: '))?',
        },
        e: '\\s*\\]?\\s*)',
    },
    description: '(.*)?', // 10
    e: '$|@',
};

/**
 * Flatten all string values within an object, and nested objects, into a single concatenated string.
 * @param obj - The input object whose string values need to be concatenated.
 * @returns {string}
 * @private
 */
function _objectValuesToString(obj) {
    let str = '';
    for (const el in obj) {
        if (typeof obj[el] === 'string') {
            str += obj[el];
        } else {
            str += _objectValuesToString(obj[el]);
        }
    }
    return str;
}

/**
 * Retrieve the parent node object of a given field by traversing the field string
 * to find a matching path in the parent object.
 * @param field - The string representing the field path to search for a parent node.
 * @returns {{ path: string }|undefined}
 * @private
 */
function _getParentNode(field) {
    let i = field.length;
    while (i--) {
        if (field.charAt(i) === '.') {
            const path = field.substring(0, i);
            const parentNode = parents[path];
            if (parentNode) {
                return Object.assign({ path: path }, parentNode);
            }
        }
    }
}

const parseRegExp = new RegExp(_objectValuesToString(regExp)); // Unicode ranges used directly in regex

const allowedValuesWithDoubleQuoteRegExp = /"[^"]*[^"]"/g;
const allowedValuesWithQuoteRegExp = /'[^']*[^']'/g;
const allowedValuesRegExp = /[^,\s]+/g;

/**
 * Parse to extract API param
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
function parse(content, source, defaultGroup) {
    content = content.trim();

    // replace Linebreak with Unicode
    content = content.replace(/\n/g, '\uffff');

    const matches = parseRegExp.exec(content);

    if (!matches) {
        return null;
    }

    // reverse Unicode Linebreaks
    matches.forEach(function (val, index, array) {
        if (val) {
            array[index] = val.replace(/\uffff/g, '\n');
        }
    });

    let allowedValues = matches[4];
    if (allowedValues) {
        let regExp;
        if (allowedValues.charAt(0) === '"') {
            regExp = allowedValuesWithDoubleQuoteRegExp;
        } else if (allowedValues.charAt(0) === "'") {
            regExp = allowedValuesWithQuoteRegExp;
        } else {
            regExp = allowedValuesRegExp;
        }

        let allowedValuesMatch;
        const list = [];

        while ((allowedValuesMatch = regExp.exec(allowedValues))) {
            list.push(allowedValuesMatch[0]);
        }
        allowedValues = list as any;
    }

    // Set global group variable
    group = matches[1] || defaultGroup || 'Parameter';

    const type = matches[2];
    const field = matches[6];
    const parentNode = _getParentNode(field);
    const isArray = Boolean(type && type.indexOf('[]') !== -1);

    // store the parent to assign it to its children later
    if (type && type.indexOf('Object') !== -1) {
        parents[field] = { parentNode, field, type, isArray };
    }

    return {
        group: group,
        type: type,
        size: matches[3],
        allowedValues: allowedValues,
        optional: Boolean(matches[5] && matches[5][0] === '['),
        parentNode: parentNode,
        field: field,
        isArray: isArray,
        defaultValue: matches[7] || matches[8] || matches[9],
        description: unindent(matches[10] || ''),
    };
}

/**
 * Construct and return a string representing a structured path for parameter fields
 * based on a group retrieved from the API parser.
 * @returns {string}
 */
function path() {
    return 'local.parameter.fields.' + getGroup();
}

/**
 * Retrieve the current group.
 * @returns {string}
 */
function getGroup() {
    return group;
}

export { parse, path };
export const method = 'push';
export { getGroup };
export const markdownFields = ['description', 'type'];
export const markdownRemovePTags = ['type'];
