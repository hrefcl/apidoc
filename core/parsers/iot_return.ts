/**
 * @file Parser for @iotReturn tags - handles IoT function return value documentation
 *
 * This parser processes @iotReturn tags to extract return value definitions including:
 * - C/C++ data types (uint8_t, float, char*, int, void, etc.)
 * - Return value description
 * - Multiple return values for complex functions
 * @since 5.1.0
 */

import unindent from '../utils/unindent';

/** Current return group being processed */
let group = '';

/**
 * Regular expression for parsing @iotReturn syntax
 *
 * Handles syntax like:
 * - `@iotReturn {float} Temperature in Celsius`
 * - `@iotReturn {int} 0=success, -1=error`
 * - `@iotReturn {void}`
 * - `@iotReturn (Success) {float} Temperature value`
 * @internal
 */
const regExp = {
    b: '^',
    oGroup: {
        b: '\\s*(?:\\(\\s*',
        group: '(.+?)', // 1
        e: '\\s*\\)\\s*)?',
    },
    oType: {
        b: '\\s*(?:\\{\\s*',
        type: '([a-zA-Z0-9_*\\[\\]\\s]+)', // 2
        e: '\\s*\\}\\s*)?',
    },
    wName: {
        b: '\\s*',
        name: '([a-zA-Z0-9_\\.\\->]*)', // 3 - optional field name for struct returns
        e: '\\s*',
    },
    description: '(.*)?', // 4
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

/**
 * Parse @iotReturn content
 * @param content Raw input string to be parsed
 * @param source - UNUSED
 * @param defaultGroup - Name to use if no group is identified
 * @returns Parsed return value metadata or null
 */
function parse(content: string, source?: any, defaultGroup?: string): {
    group: string;
    type: string;
    field: string;
    isPointer: boolean;
    isArray: boolean;
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

    // Set global group variable
    group = matches[1] || defaultGroup || 'Return';

    const type = matches[2] ? matches[2].trim() : 'void';
    const isPointer = Boolean(type && type.indexOf('*') !== -1);
    const isArray = Boolean(type && (type.indexOf('[]') !== -1 || type.indexOf('[') !== -1));

    return {
        group: group,
        type: type,
        field: matches[3] || '',
        isPointer: isPointer,
        isArray: isArray,
        description: unindent(matches[4] || ''),
    };
}

/**
 * Construct path for return value storage
 */
function path(): string {
    return 'local.return.fields.' + getGroup();
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
