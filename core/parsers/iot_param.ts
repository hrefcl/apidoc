/**
 * @file Parser for @iotParam tags - handles IoT function parameter documentation
 *
 * This parser processes @iotParam tags to extract parameter definitions including:
 * - C/C++ data types (uint8_t, float, char*, int, etc.)
 * - Parameter names
 * - Optional parameters with default values
 * - Size constraints and allowed values
 * - Pointer and array parameters
 * @since 5.1.0
 */

import unindent from '../utils/unindent';

/** Current parameter group being processed */
let group = '';

/**
 * Complex regular expression patterns for parsing @iotParam syntax
 *
 * Handles the full @iotParam syntax including:
 * - Optional parameter groups: `(groupName)`
 * - C/C++ types: `{uint8_t}`, `{float}`, `{char*}`, `{int[10]}`
 * - Parameter names with nesting: `config.timeout`
 * - Optional parameters: `[paramName]`
 * - Default values: `[paramName=0]`
 * @example Supported syntax patterns
 * ```
 * @iotParam {uint8_t} pin GPIO pin number (0-39)
 * @iotParam {float} temperature Temperature in Celsius
 * @iotParam {char*} ssid WiFi network name
 * @iotParam {int[10]} buffer Data buffer
 * @iotParam {uint32_t} [timeout=1000] Timeout in milliseconds
 * @iotParam (Config) {bool} enabled Enable feature
 * ```
 * @internal
 */
const regExp = {
    b: '^', // start
    oGroup: {
        // optional group: (Config)
        b: '\\s*(?:\\(\\s*',
        group: '(.+?)', // 1
        e: '\\s*\\)\\s*)?',
    },
    oType: {
        // optional type: {uint8_t}, {char*}, {int[10]}
        b: '\\s*(?:\\{\\s*',
        type: '([a-zA-Z0-9_*\\[\\]\\s]+)', // 2 - supports pointers, arrays, unsigned, etc.
        oSize: {
            // optional size within type: {uint8_t{0..255}}
            b: '\\s*(?:\\{\\s*',
            size: '(.+?)', // 3
            e: '\\s*\\}\\s*)?',
        },
        oAllowedValues: {
            // optional allowed values: {int=0,1,2}
            b: '\\s*(?:=\\s*',
            possibleValues: '(.+?)', // 4
            e: '(?=\\s*\\}\\s*))?',
        },
        e: '\\s*\\}\\s*)?',
    },
    wName: {
        b: '(\\[?\\s*', // 5 optional optional-marker
        name: '([a-zA-Z0-9_\\.\\->]+', // 6 - supports struct member access (config.timeout, ptr->value)
        withArray: '(?:\\[[a-zA-Z0-9_]*\\])?)',
        oDefaultValue: {
            // optional defaultValue
            b: '(?:\\s*=\\s*(?:',
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
 * Flatten all string values within an object into a single concatenated string.
 * @private
 */
function _objectValuesToString(obj: any): string {
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

const parseRegExp = new RegExp(_objectValuesToString(regExp));

const allowedValuesWithDoubleQuoteRegExp = /"[^"]*[^"]"/g;
const allowedValuesWithQuoteRegExp = /'[^']*[^']'/g;
const allowedValuesRegExp = /[^,\s]+/g;

/**
 * Parse @iotParam content
 * @param content Raw input string to be parsed
 * @param source - UNUSED
 * @param defaultGroup - Name to use if no group is identified
 * @returns Parsed parameter metadata or null
 */
function parse(content: string, source?: any, defaultGroup?: string): {
    group: string;
    type: string;
    size: string;
    allowedValues: any;
    optional: boolean;
    field: string;
    isPointer: boolean;
    isArray: boolean;
    defaultValue: string;
    description: string;
} | null {
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
        const list: string[] = [];

        while ((allowedValuesMatch = regExp.exec(allowedValues))) {
            list.push(allowedValuesMatch[0]);
        }
        allowedValues = list as any;
    }

    // Set global group variable
    group = matches[1] || defaultGroup || 'Parameter';

    const type = matches[2] ? matches[2].trim() : '';
    const field = matches[6];
    const isPointer = Boolean(type && type.indexOf('*') !== -1);
    const isArray = Boolean(type && (type.indexOf('[]') !== -1 || type.indexOf('[') !== -1));

    return {
        group: group,
        type: type,
        size: matches[3],
        allowedValues: allowedValues,
        optional: Boolean(matches[5] && matches[5][0] === '['),
        field: field,
        isPointer: isPointer,
        isArray: isArray,
        defaultValue: matches[7] || matches[8] || matches[9],
        description: unindent(matches[10] || ''),
    };
}

/**
 * Construct path for parameter storage
 */
function path(): string {
    return 'local.parameter.fields.' + getGroup();
}

/**
 * Get current group
 */
function getGroup(): string {
    return group;
}

export { parse, path };
export const method = 'push';
export { getGroup };
export const markdownFields = ['description', 'type'];
export const markdownRemovePTags = ['type'];
