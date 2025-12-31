/**
 * @file Parser for @iotError tags - handles IoT function error documentation
 *
 * This parser processes @iotError tags to document possible error conditions
 * and return codes for IoT functions.
 * @since 5.1.0
 */

import unindent from '../utils/unindent';

/** Current error group being processed */
let group = '';

/**
 * Regular expression for parsing @iotError syntax
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
        type: '([a-zA-Z0-9_*\\[\\]\\s-]+)', // 2 - error codes like ESP_ERR_TIMEOUT
        e: '\\s*\\}\\s*)?',
    },
    wName: {
        b: '\\s*',
        name: '([a-zA-Z0-9_]+)', // 3 - error name/code
        e: '\\s*',
    },
    description: '(.*)?', // 4
    e: '$|@',
};

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
 * Parse @iotError content
 */
function parse(content: string, source?: any, defaultGroup?: string): {
    group: string;
    type: string;
    field: string;
    description: string;
} | null {
    content = content.trim();
    content = content.replace(/\n/g, '\uffff');

    const matches = parseRegExp.exec(content);

    if (!matches) {
        return null;
    }

    matches.forEach(function (val, index, array) {
        if (val) {
            array[index] = val.replace(/\uffff/g, '\n');
        }
    });

    group = matches[1] || defaultGroup || 'Error';

    return {
        group: group,
        type: matches[2] ? matches[2].trim() : '',
        field: matches[3] || '',
        description: unindent(matches[4] || ''),
    };
}

function path(): string {
    return 'local.error.fields.' + getGroup();
}

function getGroup(): string {
    return group;
}

export { parse, path };
export const method = 'push';
export { getGroup };
export const markdownFields = ['description'];
