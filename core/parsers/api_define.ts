import unindent from '../utils/unindent';

import { ParameterError } from '../errors/parameter_error';

/**
 * Error message related to API definitions.
 * @property {object} common - Contains messages related to API definition usage.
 * @property {string} common.element - Refers to the identifier key for API definition.
 * @property {string} common.usage - Specify the prescribed usage of the API definition element.
 * @property {string} common.example - Provide an example of a valid API definition usage.
 * @private
 */
const _messages = {
    common: {
        element: 'apiDefine',
        usage: '@apiDefine name',
        example: '@apiDefine MyValidName',
    },
};

/**
 * Parse to extract API define. Throw a `ParameterError` if the content is improperly formatted.
 * @param content - Content to be parsed. Must follow a specific format: name, optional title,
 *     and description, separated by spaces or line breaks.
 * @param source - UNUSED
 * @param [messages] - Object containing configuration messages, can include error messages. If not provided, a default `_messages` object is used.
 * @returns {{ name: string, title: string, description: string }|null}
 */
function parse(content, source, messages) {
    messages = messages || _messages;

    content = content.trim();

    const parseRegExp = /^([\w:]*)(.*?)(?:\s+|$)(.*)$/gm;
    let matches = parseRegExp.exec(content);

    if (!matches) {
        return null;
    }

    if (matches[0] === '') {
        throw new ParameterError('No arguments found.', messages.common.element, messages.common.usage, messages.common.example);
    }

    if (matches[2] !== '') {
        throw new ParameterError('Name must contain only alphanumeric and colon characters.', messages.common.element, messages.common.usage, messages.common.example);
    }

    const name = matches[1];
    const title = matches[3];
    let description = '';

    while ((matches = parseRegExp.exec(content))) {
        description += matches[0] + '\n';
    }

    return {
        name: name,
        title: title,
        description: unindent(description),
    };
}

/**
 * Exports
 */
module.exports = {
    parse: parse,
    path: 'global.define',
    method: 'insert',
    markdownFields: ['description'],
};
