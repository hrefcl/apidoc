/**
 * @file Parser for @apiModel tags - handles data model documentation
 *
 * This parser processes @apiModel tags to extract data model definitions from Sequelize classes.
 * Supports automatic extraction of attributes, relationships, and hooks from model code.
 *
 * @example Automatic extraction
 * ```typescript
 * // Input: @apiModel {model=User}
 * // Automatically extracts all User model attributes, relationships, and hooks
 * ```
 */

import { findModel } from '../utils/sequelize-parser';

/**
 * Parse @apiModel tag to extract model configuration
 *
 * @param content - Raw content from the @apiModel tag
 * @param source - Complete source line
 * @returns Parsed model configuration or null
 *
 * @example Simple model extraction
 * ```typescript
 * // Input: "{model=User}"
 * // Output: { modelName: "User" }
 * ```
 *
 * @example With description
 * ```typescript
 * // Input: "{model=User} Complete user entity with authentication"
 * // Output: { modelName: "User", description: "Complete user entity with authentication" }
 * ```
 */
function parse(
    content: string,
    source?: string
): {
    modelName: string;
    description?: string;
} | null {
    const trimmed = content.trim();

    if (trimmed.length === 0) {
        return null;
    }

    // Skip if doesn't look like automatic extraction syntax
    if (!trimmed.includes('{') || !trimmed.includes('model=') || !trimmed.includes('}')) {
        return null;
    }

    // Parse: @apiModel {model=ModelName} [description]
    // Example: @apiModel {model=User} User entity model
    const parseRegExp = /^\{model=(.+?)\}\s*(.*)$/;
    const matches = parseRegExp.exec(trimmed);

    if (!matches) {
        return null;
    }

    return {
        modelName: matches[1],
        description: matches[2] || undefined,
    };
}

/**
 * Processor function that converts @apiModel tags into model documentation
 * @param elements - Current array of parsed elements
 * @param element - The @apiModel element being processed
 * @param block - Complete documentation block
 * @param filename - Source file path
 * @returns Updated elements array
 */
function processor(elements: Array<any>, element: any, block: any, filename: string): Array<any> {
    if (element.name !== 'apimodel') {
        return elements;
    }

    // Remove the @apiModel element
    elements.pop();

    const parsed = parse(element.content, element.source);
    if (!parsed) {
        return elements;
    }

    // Find the Sequelize model in source code
    const model = findModel(parsed.modelName, filename);

    if (!model) {
        console.warn(`Warning: Could not find Sequelize model '${parsed.modelName}' in source files`);

        // Fallback: create basic model documentation
        elements.push({
            source: `@apiModel {model=${parsed.modelName}}`,
            name: 'apimodel',
            sourceName: 'apiModel',
            content: `{model=${parsed.modelName}} ${parsed.description || ''}`,
            model: {
                name: parsed.modelName,
                description: parsed.description,
                attributes: [],
                relationships: [],
                hooks: [],
            },
        });

        return elements;
    }

    // Create model documentation element with extracted data
    elements.push({
        source: `@apiModel {model=${parsed.modelName}}`,
        name: 'apimodel',
        sourceName: 'apiModel',
        content: `{model=${parsed.modelName}} ${parsed.description || model.tableName || ''}`,
        model: {
            name: model.name,
            tableName: model.tableName,
            description: parsed.description,
            typeInference: model.typeInference,
            attributes: model.attributes,
            relationships: model.relationships,
            hooks: model.hooks,
            // Add stats for display
            stats: {
                totalAttributes: model.attributes.length,
                totalRelationships: model.relationships.length,
                totalHooks: model.hooks.length,
                primaryKeys: model.attributes.filter((a) => a.decorators.includes('PrimaryKey')).length,
                uniqueFields: model.attributes.filter((a) => a.decorators.includes('Unique')).length,
                indexedFields: model.attributes.filter((a) => a.decorators.includes('Index')).length,
            },
        },
    });

    return elements;
}

/**
 * Initialize the @apiModel parser
 * @param app - APIDoc application instance
 */
function init(app: any) {
    app.addHook('parser-find-elements', processor, 200);
}

export default {
    parse,
    path: 'local',
    method: 'push',
    markdownFields: [],
    markdownRemoveFields: [],
    init,
};
