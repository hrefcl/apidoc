/**
 * Parser for @model tag - defines data model documentation
 *
 * This parser handles the main @model tag that defines model entities. It works with:
 * - @modelGroup to organize models
 * - @modelAttribute for automatic extraction of attributes
 * - @modelHook for automatic extraction of lifecycle hooks
 *
 * @example Basic model
 * ```typescript
 * // Input: "User Complete user entity with authentication"
 * // Output: { name: "User", title: "Complete user entity with authentication" }
 * ```
 *
 * @since 5.0.0
 * @public
 */

import { findModel } from '../utils/sequelize-parser';

export function parse(content: string | any): { name: string; title: string; model?: any } | null {
    // If content is already an object (processed by processor hook), return it
    if (typeof content === 'object' && content !== null) {
        return content;
    }

    // Otherwise, parse the string content
    content = content.trim();

    // Extract only the first line (up to \n or @)
    const firstLine = content.split(/\n|@/)[0].trim();

    // Search: model name and optional title
    // Example: User Complete user entity
    // Example: Company Company model with relationships
    const parseRegExp = /^(\w+)(?:\s+(.+?))?$/;
    const matches = parseRegExp.exec(firstLine);

    if (!matches) {
        return null;
    }

    const name = matches[1];
    const title = matches[2] || '';

    return {
        name: name,
        title: title,
    };
}

/**
 * Processor function that extracts model from source code
 * @param elements - Current array of parsed elements
 * @param element - The @model element being processed
 * @param block - Complete documentation block
 * @param filename - Source file path
 * @returns Updated elements array
 */
function processor(elements: Array<any>, element: any, block: any, filename: string): Array<any> {
    if (element.name !== 'model') {
        return elements;
    }

    // Parse the element content to extract model name and title
    const parsed = parse(element.content);
    if (!parsed) {
        console.warn('Warning: Could not parse @model content:', element.content);
        return elements;
    }

    const modelName = parsed.name;
    const modelTitle = parsed.title;

    // Find the Sequelize model in source code
    const model = findModel(modelName, filename);

    if (model) {
        // Replace element content with structured data
        element.content = {
            name: parsed.name,
            title: parsed.title,
            model: {
                name: model.name,
                tableName: model.tableName,
                description: modelTitle,
                typeInference: model.typeInference,
                attributes: model.attributes,
                relationships: model.relationships,
                hooks: model.hooks,
                stats: {
                    totalAttributes: model.attributes.length,
                    totalRelationships: model.relationships.length,
                    totalHooks: model.hooks.length,
                    primaryKeys: model.attributes.filter((a) => a.decorators.includes('PrimaryKey')).length,
                    uniqueFields: model.attributes.filter((a) => a.decorators.includes('Unique')).length,
                    indexedFields: model.attributes.filter((a) => a.decorators.includes('Index')).length,
                },
            },
        };
    } else {
        console.warn(`Warning: Could not find Sequelize model '${modelName}' in source files`);
        // Create basic model structure even if not found
        element.content = {
            name: parsed.name,
            title: parsed.title,
            model: {
                name: modelName,
                description: modelTitle,
                attributes: [],
                relationships: [],
                hooks: [],
                stats: {
                    totalAttributes: 0,
                    totalRelationships: 0,
                    totalHooks: 0,
                    primaryKeys: 0,
                    uniqueFields: 0,
                    indexedFields: 0,
                },
            },
        };
    }

    return elements;
}

/**
 * Initialize the @model parser
 * @param app - APIDoc application instance
 */
function init(app: any) {
    app.addHook('parser-find-elements', processor, 200);
}

/**
 * Initialize the parser (exported for compatibility)
 * @internal
 */
export { init };

/**
 * Target location in the data structure where parsed results are stored
 * @internal
 */
export const path = 'local';

/**
 * Processing method for this parser
 * @internal
 */
export const method = 'insert';

/**
 * Markdown fields (none for this parser)
 * @internal
 */
export const markdownFields: string[] = [];

/**
 * Markdown remove fields (none for this parser)
 * @internal
 */
export const markdownRemoveFields: string[] = [];
