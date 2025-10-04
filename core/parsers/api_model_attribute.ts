/**
 * @file Parser for @apiModelAttribute tags - handles model field documentation
 *
 * This parser processes @apiModelAttribute tags to extract field definitions from data models.
 * Supports Sequelize decorators, TypeScript types, validation rules, and relationships.
 */

import unindent from '../utils/unindent';

/** Current model being processed */
let currentModel = '';

/** Registry of parent field structures for nested objects */
const parents = {};

/**
 * Regular expression patterns for parsing @apiModelAttribute syntax
 *
 * Handles the full @apiModelAttribute syntax including:
 * - Model name grouping: `(ModelName)`
 * - Data types with decorators: `{String @Unique @Index}`
 * - Field names with optional marker: `[email]`
 * - Default values: `[status="active"]`
 * - Sequelize decorators: `@PrimaryKey`, `@BelongsTo`, etc.
 * - Validation rules: `@ValidateAttribute`
 *
 * @example Supported syntax patterns
 * ```typescript
 * @apiModelAttribute (User) {Integer @PrimaryKey @AutoIncrement} id User unique identifier
 * @apiModelAttribute (User) {String @Unique @Index} email User email address
 * @apiModelAttribute (User) {String @AllowNull(false)} firstname User first name
 * @apiModelAttribute (User) {String} [status="active"] User status
 * @apiModelAttribute (User) {BelongsTo @BelongsTo(Community)} community User's community
 * @apiModelAttribute (User) {HasMany @HasMany(Access)} accesses User access records
 * @apiModelAttribute (User) {JSON @Default({})} metadata User metadata
 * ```
 *
 * @internal
 */
const regExp = {
    b: '^', // start
    oModel: {
        // optional model: (User)
        b: '\\s*(?:\\(\\s*',
        model: '(.+?)', // 1
        e: '\\s*\\)\\s*)?',
    },
    oType: {
        // type with decorators: {String @Unique @Index}
        b: '\\s*(?:\\{\\s*',
        type: '([a-zA-Z0-9\\[\\]]+)', // 2 - base type
        oDecorators: {
            // decorators within type
            b: '\\s*',
            decorators: '(@[a-zA-Z0-9()\\s,._-]*)?', // 3 - decorators like @Unique @Index @BelongsTo(Community)
            e: '\\s*',
        },
        e: '\\}\\s*)?',
    },
    wName: {
        b: '(\\[?\\s*', // 4 - optional marker
        name: '([a-zA-Z0-9\\$_]+)', // 5 - field name
        oDefaultValue: {
            b: '(?:\\s*=\\s*(?:',
            withDoubleQuote: '"([^"]*)"', // 6
            withQuote: "|'([^']*)'", // 7
            withoutQuote: '|(.*?)(?:\\s|\\]|$)', // 8
            e: '))?',
        },
        e: '\\s*\\]?\\s*)',
    },
    description: '(.*)?', // 9
    e: '$',
};

/**
 * Flatten all string values within an object into a single concatenated string
 * @param obj - The input object
 * @returns Concatenated string of all values
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
 * Parse decorators string into structured array
 * @param decoratorsStr - Raw decorators string (e.g., "@Unique @Index @BelongsTo(Community)")
 * @returns Array of decorator objects
 * @private
 */
function parseDecorators(decoratorsStr: string): Array<{ name: string; params?: string }> {
    if (!decoratorsStr) return [];

    const decorators: Array<{ name: string; params?: string }> = [];
    // Match @DecoratorName or @DecoratorName(params)
    const decoratorRegex = /@([a-zA-Z0-9_]+)(?:\(([^)]*)\))?/g;
    let match;

    while ((match = decoratorRegex.exec(decoratorsStr))) {
        decorators.push({
            name: match[1],
            params: match[2] || undefined,
        });
    }

    return decorators;
}

/**
 * Categorize decorator by type
 * @param decoratorName - Name of the decorator
 * @returns Category: 'constraint', 'relation', 'validation', 'index', 'timestamp', 'other'
 * @private
 */
function categorizeDecorator(decoratorName: string): string {
    const categories: Record<string, string[]> = {
        constraint: ['PrimaryKey', 'Unique', 'AllowNull', 'AutoIncrement', 'Default'],
        relation: ['BelongsTo', 'HasMany', 'HasOne', 'BelongsToMany'],
        validation: ['ValidateAttribute', 'Validate'],
        index: ['Index'],
        timestamp: ['CreatedAt', 'UpdatedAt', 'DeletedAt'],
        attribute: ['Attribute'],
    };

    for (const [category, decorators] of Object.entries(categories)) {
        if (decorators.includes(decoratorName)) {
            return category;
        }
    }

    return 'other';
}

/**
 * Parse @apiModelAttribute to extract model field information
 *
 * @param content - Raw input string to be parsed
 * @param source - UNUSED
 * @param defaultModel - Model name to use if not specified
 * @returns Parsed field metadata or null
 */
function parse(
    content: string,
    source?: string,
    defaultModel?: string
): {
    model: string;
    type: string;
    decorators: Array<{ name: string; params?: string; category: string }>;
    optional: boolean;
    field: string;
    defaultValue?: string;
    description: string;
    isRelation: boolean;
    isPrimaryKey: boolean;
    isUnique: boolean;
    isIndex: boolean;
    isTimestamp: boolean;
} | null {
    content = content.trim();

    // Replace linebreak with Unicode
    content = content.replace(/\n/g, '\uffff');

    const matches = parseRegExp.exec(content);

    if (!matches) {
        return null;
    }

    // Reverse Unicode linebreaks
    matches.forEach((val, index, array) => {
        if (val) {
            array[index] = val.replace(/\uffff/g, '\n');
        }
    });

    // Set current model
    currentModel = matches[1] || defaultModel || 'Model';

    const type = matches[2] || 'Unknown';
    const decoratorsStr = matches[3] || '';
    const field = matches[5];
    const defaultValue = matches[6] || matches[7] || matches[8];
    const description = unindent(matches[9] || '');

    // Parse decorators
    const decoratorsList = parseDecorators(decoratorsStr);
    const decoratorsWithCategory = decoratorsList.map((dec) => ({
        ...dec,
        category: categorizeDecorator(dec.name),
    }));

    // Determine flags
    const isRelation = decoratorsList.some((d) => ['BelongsTo', 'HasMany', 'HasOne', 'BelongsToMany'].includes(d.name));
    const isPrimaryKey = decoratorsList.some((d) => d.name === 'PrimaryKey');
    const isUnique = decoratorsList.some((d) => d.name === 'Unique');
    const isIndex = decoratorsList.some((d) => d.name === 'Index');
    const isTimestamp = decoratorsList.some((d) => ['CreatedAt', 'UpdatedAt', 'DeletedAt'].includes(d.name));

    return {
        model: currentModel,
        type: type,
        decorators: decoratorsWithCategory,
        optional: Boolean(matches[4] && matches[4][0] === '['),
        field: field,
        defaultValue: defaultValue,
        description: description,
        isRelation: isRelation,
        isPrimaryKey: isPrimaryKey,
        isUnique: isUnique,
        isIndex: isIndex,
        isTimestamp: isTimestamp,
    };
}

/**
 * Construct path for model attributes
 * @returns Path string
 */
function path(): string {
    return 'local.model.attributes.' + getModel();
}

/**
 * Get current model name
 * @returns Current model name
 */
function getModel(): string {
    return currentModel;
}

export { getModel, parse, path };
export const method = 'push';
export const markdownFields = ['description', 'type'];
export const markdownRemovePTags = ['type'];
