/**
 * @file Parser for @apiModelHook tags - handles Sequelize lifecycle hooks documentation
 *
 * This parser processes @apiModelHook tags to extract hook definitions from data models.
 * Supports all Sequelize hooks: @BeforeCreate, @AfterUpdate, @BeforeDestroy, etc.
 */

import unindent from '../utils/unindent';

/** Current model being processed */
let currentModel = '';

/**
 * Regular expression patterns for parsing @apiModelHook syntax
 *
 * @example Supported syntax patterns
 * ```typescript
 * @apiModelHook (User) @BeforeCreate DataFormating Normalizes user data before creation
 * @apiModelHook (User) @AfterUpdate UpdateUser Synchronizes user with external systems
 * @apiModelHook (User) @BeforeDestroy invalidate_accesses Invalidates all user accesses
 * ```
 *
 * @internal
 */
const regExp = {
    b: '^',
    oModel: {
        b: '\\s*(?:\\(\\s*',
        model: '(.+?)', // 1 - model name
        e: '\\s*\\)\\s*)?',
    },
    decorator: '@([a-zA-Z0-9]+)', // 2 - hook decorator (@BeforeCreate, @AfterUpdate, etc.)
    methodName: '\\s+([a-zA-Z0-9_]+)', // 3 - static method name
    description: '\\s*(.*)?', // 4 - description
    e: '$',
};

/**
 * Flatten object values to string
 * @param obj - Input object
 * @returns Concatenated string
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
 * Sequelize hook types categorized by lifecycle phase
 */
const HOOK_CATEGORIES: Record<string, string[]> = {
    beforeValidate: ['BeforeValidate'],
    afterValidate: ['AfterValidate', 'ValidationFailed'],
    beforeCreate: ['BeforeCreate'],
    afterCreate: ['AfterCreate'],
    beforeDestroy: ['BeforeDestroy'],
    afterDestroy: ['AfterDestroy'],
    beforeRestore: ['BeforeRestore'],
    afterRestore: ['AfterRestore'],
    beforeUpdate: ['BeforeUpdate'],
    afterUpdate: ['AfterUpdate'],
    beforeSave: ['BeforeSave'],
    afterSave: ['AfterSave'],
    beforeUpsert: ['BeforeUpsert'],
    afterUpsert: ['AfterUpsert'],
    beforeBulkCreate: ['BeforeBulkCreate'],
    afterBulkCreate: ['AfterBulkCreate'],
    beforeBulkDestroy: ['BeforeBulkDestroy'],
    afterBulkDestroy: ['AfterBulkDestroy'],
    beforeBulkRestore: ['BeforeBulkRestore'],
    afterBulkRestore: ['AfterBulkRestore'],
    beforeBulkUpdate: ['BeforeBulkUpdate'],
    afterBulkUpdate: ['AfterBulkUpdate'],
    beforeFind: ['BeforeFind'],
    beforeFindAfterExpandIncludeAll: ['BeforeFindAfterExpandIncludeAll'],
    beforeFindAfterOptions: ['BeforeFindAfterOptions'],
    afterFind: ['AfterFind'],
    beforeCount: ['BeforeCount'],
    beforeSync: ['BeforeSync'],
    afterSync: ['AfterSync'],
    beforeBulkSync: ['BeforeBulkSync'],
    afterBulkSync: ['AfterBulkSync'],
    beforeAssociate: ['BeforeAssociate'],
    afterAssociate: ['AfterAssociate'],
    beforeConnect: ['BeforeConnect'],
    afterConnect: ['AfterConnect'],
    beforeDisconnect: ['BeforeDisconnect'],
    afterDisconnect: ['AfterDisconnect'],
};

/**
 * Get hook category from decorator name
 * @param hookName - Hook decorator name (e.g., "BeforeCreate")
 * @returns Hook category or "other"
 * @private
 */
function getHookCategory(hookName: string): string {
    for (const [category, hooks] of Object.entries(HOOK_CATEGORIES)) {
        if (hooks.includes(hookName)) {
            return category;
        }
    }
    return 'other';
}

/**
 * Get hook phase (before/after/validation)
 * @param hookName - Hook decorator name
 * @returns Hook phase
 * @private
 */
function getHookPhase(hookName: string): 'before' | 'after' | 'validation' | 'other' {
    if (hookName.startsWith('Before')) return 'before';
    if (hookName.startsWith('After')) return 'after';
    if (hookName.includes('Validat')) return 'validation';
    return 'other';
}

/**
 * Parse @apiModelHook to extract hook information
 *
 * @param content - Raw input string
 * @param source - UNUSED
 * @param defaultModel - Model name to use if not specified
 * @returns Parsed hook metadata or null
 */
function parse(
    content: string,
    source?: string,
    defaultModel?: string
): {
    model: string;
    decorator: string;
    methodName: string;
    description: string;
    category: string;
    phase: 'before' | 'after' | 'validation' | 'other';
    isBulk: boolean;
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

    const decorator = matches[2];
    const methodName = matches[3];
    const description = unindent(matches[4] || '');

    const category = getHookCategory(decorator);
    const phase = getHookPhase(decorator);
    const isBulk = decorator.includes('Bulk');

    return {
        model: currentModel,
        decorator: decorator,
        methodName: methodName,
        description: description,
        category: category,
        phase: phase,
        isBulk: isBulk,
    };
}

/**
 * Construct path for model hooks
 * @returns Path string
 */
function path(): string {
    return 'local.model.hooks.' + getModel();
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
export const markdownFields = ['description'];
