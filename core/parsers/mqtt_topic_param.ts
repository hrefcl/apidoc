/**
 * Parser for topicParam tags - handles MQTT topic parameter documentation
 *
 * This parser processes @topicParam tags to extract parameter definitions for MQTT topic placeholders.
 * It supports:
 * - Parameter data types
 * - Parameter descriptions
 * - Parameter validation rules
 *
 * @param content - Raw content from the topicParam tag
 * @returns Parsed parameter information or null if parsing fails
 *
 * @example Basic topic parameter
 * ```
 * // Input: "{String} tenant Tenant identifier"
 * // Output: { type: "String", name: "tenant", description: "Tenant identifier" }
 * ```
 *
 * @example Parameter with constraints
 * ```
 * // Input: "{String{3..50}} deviceId Device unique identifier"
 * // Output: { type: "String", size: "3..50", name: "deviceId", description: "Device unique identifier" }
 * ```
 *
 * @since 4.1.0
 * @public
 */

import unindent from '../utils/unindent';

/** Current parameter group being processed */
let group = '';

/**
 * Regular expression for parsing @topicParam syntax
 * Simplified version of apiParam focused on MQTT topic parameters
 */
const regExp = {
    b: '^', // start
    oGroup: {
        // optional group: (GroupName)
        b: '\\s*(?:\\(\\s*', // starting with '(', optional surrounding spaces
        group: '(.+?)', // 1
        e: '\\s*\\)\\s*)?', // ending with ')', optional surrounding spaces
    },
    oType: {
        // optional type: {String}
        b: '\\s*(?:\\{\\s*', // starting with '{', optional surrounding spaces
        type: '([a-zA-Z0-9()#:\\.\\/\\\\\\[\\]_|-]+)', // 2
        oSize: {
            // optional size within type: {String{3..50}}
            b: '\\s*(?:\\{\\s*', // starting with '{', optional surrounding spaces
            size: '(.+?)', // 3
            e: '\\s*\\}\\s*)?', // ending with '}', optional surrounding spaces
        },
        e: '\\s*\\}\\s*)?', // ending with '}', optional surrounding spaces
    },
    wName: {
        b: '\\s*', // 4
        name: '([a-zA-Z0-9\\$\\:\\.\\/_-]+)', // 5 parameter name
        e: '\\s*',
    },
    description: '(.*)?', // 6
    e: '$|@',
};

/**
 * Flatten regex object into a single string pattern
 */
function flattenObject(obj: any): string {
    let str = '';
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'object') {
            str += flattenObject(obj[key]);
        } else {
            str += obj[key];
        }
    });
    return str;
}

const pattern = flattenObject(regExp);

/**
 * Parse @topicParam content
 */
export function parse(content: string) {
    content = content.trim();

    const parseRegExp = new RegExp(pattern, 'gm');
    const matches = parseRegExp.exec(content);

    if (!matches) {
        return null;
    }

    // Set group if provided
    if (matches[1]) {
        group = matches[1];
    }

    const result: any = {
        group: group,
        type: matches[2] || 'String',
        size: matches[3] || undefined,
        name: matches[5],
        description: matches[6] ? unindent(matches[6]) : '',
    };

    // Clean up undefined values
    if (result.size === undefined) {
        delete result.size;
    }

    return result;
}

/**
 * Path where the parsed result will be stored
 */
export const path = function (): string {
    return 'local.topicParameter.fields.' + group;
};

/**
 * Processing method for this parser
 */
export const method = 'push';
