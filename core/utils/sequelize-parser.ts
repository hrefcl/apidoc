/**
 * @file Sequelize Model Parser - extracts model definitions from Sequelize classes
 * @description Extracts Sequelize model attributes, decorators, relationships, and hooks
 * from TypeScript class definitions with decorators.
 *
 * @author hrefcl
 * @since 5.0.0
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * Represents a parsed Sequelize model attribute
 */
interface ParsedAttribute {
    name: string;
    type: string;
    decorators: string[];
    optional: boolean;
    defaultValue?: string;
    description?: string;
}

/**
 * Represents a parsed Sequelize relationship
 */
interface ParsedRelationship {
    name: string;
    type: 'BelongsTo' | 'HasMany' | 'HasOne' | 'BelongsToMany';
    targetModel: string;
    decorators: string[];
    description?: string;
}

/**
 * Represents a parsed Sequelize lifecycle hook
 */
interface ParsedHook {
    decorator: string;
    methodName: string;
    description?: string;
}

/**
 * Represents a complete parsed Sequelize model
 */
interface ParsedModel {
    name: string;
    tableName?: string;
    attributes: ParsedAttribute[];
    relationships: ParsedRelationship[];
    hooks: ParsedHook[];
    typeInference?: string;
}

/**
 * Cache for parsed models
 */
const modelCache = new Map<string, ParsedModel>();

/**
 * Find a Sequelize model class in source files
 * @param modelName - Name of the model class to find
 * @param sourceFile - Current source file path for relative resolution
 * @returns Parsed model or null if not found
 */
export function findModel(modelName: string, sourceFile: string): ParsedModel | null {
    const cacheKey = `${sourceFile}:${modelName}`;

    if (modelCache.has(cacheKey)) {
        return modelCache.get(cacheKey)!;
    }

    // Search for model in common locations
    const searchPaths = [
        path.dirname(sourceFile),
        path.join(path.dirname(sourceFile), 'models'),
        path.join(path.dirname(sourceFile), '../models'),
        path.join(path.dirname(sourceFile), '../../models'),
        path.join(process.cwd(), 'src/models'),
        path.join(process.cwd(), 'models'),
    ];

    for (const searchPath of searchPaths) {
        try {
            if (!fs.existsSync(searchPath)) continue;

            const files = glob.sync('**/*.{ts,js}', {
                cwd: searchPath,
                absolute: true,
                ignore: ['node_modules/**', 'dist/**', '**/*.d.ts'],
            });

            for (const file of files) {
                const model = extractModelFromFile(file, modelName);
                if (model) {
                    modelCache.set(cacheKey, model);
                    return model;
                }
            }
        } catch (error) {
            // Continue searching in other paths
        }
    }

    return null;
}

/**
 * Extract Sequelize model from a file
 * @param filePath - Path to the TypeScript file
 * @param modelName - Name of the model class
 * @returns Parsed model or null
 */
function extractModelFromFile(filePath: string, modelName: string): ParsedModel | null {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check if file contains the model class
        const classRegex = new RegExp(`export\\s+(?:default\\s+)?class\\s+${modelName}\\s+extends\\s+Model`, 'm');
        if (!classRegex.test(content)) {
            return null;
        }

        return parseModelClass(content, modelName);
    } catch (error) {
        return null;
    }
}

/**
 * Parse Sequelize model class from source content
 * @param content - File content
 * @param modelName - Model class name
 * @returns Parsed model
 */
function parseModelClass(content: string, modelName: string): ParsedModel | null {
    const model: ParsedModel = {
        name: modelName,
        attributes: [],
        relationships: [],
        hooks: [],
    };

    // Extract table name from @Table decorator
    const tableMatch = content.match(/@Table\(\{[^}]*tableName:\s*['"]([^'"]+)['"]/);
    if (tableMatch) {
        model.tableName = tableMatch[1];
    }

    // Extract type inference (export type IModelName = ...)
    const typeInferenceRegex = new RegExp(`export\\s+type\\s+I${modelName}\\s*=\\s*InferAttributes<${modelName}>`, 'm');
    if (typeInferenceRegex.test(content)) {
        model.typeInference = `I${modelName}`;
    }

    // Extract attributes with decorators
    model.attributes = extractAttributes(content);

    // Extract relationships
    model.relationships = extractRelationships(content);

    // Extract hooks
    model.hooks = extractHooks(content);

    return model;
}

/**
 * Extract model attributes from class content
 * @param content - Class source content
 * @returns Array of parsed attributes
 */
function extractAttributes(content: string): ParsedAttribute[] {
    const attributes: ParsedAttribute[] = [];

    // Match attribute declarations with decorators
    // Pattern: @Decorator()\n declare field: type
    const attributeRegex = /@Attribute\([^)]*\)\s+declare\s+(\w+)(\?)?\s*:\s*([^;]+);/g;
    let match;

    while ((match = attributeRegex.exec(content))) {
        const [, name, optional, typeDecl] = match;

        // Extract decorators for this attribute (look backwards)
        const beforeAttribute = content.substring(0, match.index);
        const decorators = extractDecoratorsForField(beforeAttribute, match.index);

        // Parse type
        const type = parseSequelizeType(typeDecl.trim());

        attributes.push({
            name,
            type,
            decorators,
            optional: Boolean(optional),
        });
    }

    return attributes;
}

/**
 * Extract decorators for a specific field
 * @param beforeContent - Content before the field declaration
 * @param fieldIndex - Index of the field declaration
 * @returns Array of decorator names
 */
function extractDecoratorsForField(beforeContent: string, fieldIndex: number): string[] {
    const decorators: string[] = [];

    // Look for decorators in the lines before this field
    const lines = beforeContent.split('\n');
    const relevantLines = lines.slice(-10); // Last 10 lines should contain decorators

    for (let i = relevantLines.length - 1; i >= 0; i--) {
        const line = relevantLines[i].trim();

        // Stop if we hit a non-decorator line
        if (line && !line.startsWith('@') && !line.startsWith('*') && !line.startsWith('//')) {
            break;
        }

        // Extract decorator
        const decoratorMatch = line.match(/@([A-Z][a-zA-Z0-9]*)/);
        if (decoratorMatch) {
            const decoratorWithParams = line.match(/@([A-Z][a-zA-Z0-9]*(?:\([^)]*\))?)/);
            if (decoratorWithParams) {
                decorators.unshift(decoratorWithParams[1]);
            }
        }
    }

    return decorators;
}

/**
 * Parse Sequelize DataTypes to APIDoc types
 * @param typeDecl - Type declaration string
 * @returns APIDoc-compatible type string
 */
function parseSequelizeType(typeDecl: string): string {
    // Handle CreationOptional<Type>
    const creationOptionalMatch = typeDecl.match(/CreationOptional<([^>]+)>/);
    if (creationOptionalMatch) {
        return parseSequelizeType(creationOptionalMatch[1]);
    }

    // Handle NonAttribute<Type>
    const nonAttributeMatch = typeDecl.match(/NonAttribute<([^>]+)>/);
    if (nonAttributeMatch) {
        return parseSequelizeType(nonAttributeMatch[1]);
    }

    // Basic type mapping
    if (typeDecl.includes('string')) return 'String';
    if (typeDecl.includes('number')) return 'Number';
    if (typeDecl.includes('boolean')) return 'Boolean';
    if (typeDecl.includes('Date')) return 'Date';
    if (typeDecl.includes('UUID')) return 'UUID';
    if (typeDecl.match(/\[\]$/)) return parseSequelizeType(typeDecl.replace(/\[\]$/, '')) + '[]';
    if (typeDecl.includes('JsonObject') || typeDecl.includes('JSON')) return 'JSON';

    return 'Mixed';
}

/**
 * Extract relationships from class content
 * @param content - Class source content
 * @returns Array of parsed relationships
 */
function extractRelationships(content: string): ParsedRelationship[] {
    const relationships: ParsedRelationship[] = [];

    // Match relationship declarations with multiline support
    // Pattern: @BelongsTo(() => Model, { foreignKey: 'id' })
    //          field!: NonAttribute<Model>
    const relationTypes = ['BelongsTo', 'HasMany', 'HasOne', 'BelongsToMany'];

    for (const relType of relationTypes) {
        // Simpler regex that handles multiline between decorator and field
        // Matches: @RelationType(...any params...) [whitespace/newlines] fieldName!: NonAttribute<Type>
        const regex = new RegExp(
            `@${relType}\\(` + // Decorator start
                `(?:[^)(]|\\([^)]*\\))*` + // Params (handles nested parens for () => Model)
                `\\)` + // Decorator end
                `[\\s\\S]*?` + // Any whitespace/newlines/comments (non-greedy)
                `(\\w+)!?\\s*:\\s*NonAttribute<([^>]+)>`, // Field declaration
            'g'
        );
        let match;

        while ((match = regex.exec(content))) {
            const fullMatch = match[0];
            const name = match[1];
            const targetType = match[2];

            // Extract target model from decorator params
            const paramsMatch = fullMatch.match(/=>\s*(\w+)/);
            const targetModel = paramsMatch ? paramsMatch[1] : targetType.replace(/\[\]$/, '');

            relationships.push({
                name,
                type: relType as any,
                targetModel,
                decorators: [relType],
            });
        }
    }

    return relationships;
}

/**
 * Extract lifecycle hooks from class content
 * @param content - Class source content
 * @returns Array of parsed hooks
 */
function extractHooks(content: string): ParsedHook[] {
    const hooks: ParsedHook[] = [];

    // Match hook decorators and methods
    // Pattern: @HookDecorator\n static async methodName
    const hookTypes = [
        'BeforeValidate', 'AfterValidate', 'ValidationFailed',
        'BeforeCreate', 'AfterCreate',
        'BeforeUpdate', 'AfterUpdate',
        'BeforeDestroy', 'AfterDestroy',
        'BeforeSave', 'AfterSave',
        'BeforeUpsert', 'AfterUpsert',
        'BeforeBulkCreate', 'AfterBulkCreate',
        'BeforeBulkUpdate', 'AfterBulkUpdate',
        'BeforeBulkDestroy', 'AfterBulkDestroy',
        'BeforeFind', 'AfterFind',
        'BeforeCount',
        'BeforeSync', 'AfterSync',
    ];

    for (const hookType of hookTypes) {
        const regex = new RegExp(`@${hookType}[^\\n]*\\s+static\\s+(?:async\\s+)?(\\w+)`, 'g');
        let match;

        while ((match = regex.exec(content))) {
            const methodName = match[1];

            // Extract JSDoc description before the hook decorator
            const description = extractHookDescription(content, match.index);

            hooks.push({
                decorator: hookType,
                methodName,
                description,
            });
        }
    }

    return hooks;
}

/**
 * Extract JSDoc description for a hook
 * @param content - Full content
 * @param hookIndex - Index where the hook decorator starts
 * @returns Description string or undefined
 */
function extractHookDescription(content: string, hookIndex: number): string | undefined {
    // Get content before the hook decorator (with some context - last 500 chars should be enough)
    const beforeHook = content.substring(Math.max(0, hookIndex - 500), hookIndex);

    // Find the last JSDoc comment that's immediately before this decorator
    // This will match /** ... */ followed by optional whitespace/newlines before the end
    const jsdocMatches = beforeHook.match(/\/\*\*([\s\S]*?)\*\/\s*$/);

    if (!jsdocMatches) {
        return undefined;
    }

    const jsdocContent = jsdocMatches[1];

    // Extract @description tag content
    const descMatch = jsdocContent.match(/@description\s+(.+?)(?=\s*\*\/|\s*\*\s*@|$)/s);

    if (descMatch) {
        // Clean up the description (remove leading asterisks and extra whitespace)
        return descMatch[1]
            .split('\n')
            .map(line => line.replace(/^\s*\*\s?/, '').trim())
            .filter(line => line.length > 0)
            .join(' ')
            .trim();
    }

    // Fallback: extract any text from JSDoc that's not a tag
    const lines = jsdocContent
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '').trim())
        .filter(line => line.length > 0 && !line.startsWith('@'));

    if (lines.length > 0) {
        return lines.join(' ').trim();
    }

    return undefined;
}

/**
 * Convert parsed model to APIDoc elements
 * @param model - Parsed model
 * @param elementType - Target element type (apiSuccess, apiParam, etc.)
 * @param group - Optional group name
 * @returns Array of APIDoc elements
 */
export function modelToApiDocElements(
    model: ParsedModel,
    elementType: string = 'apiSuccess',
    group?: string
): Array<any> {
    const elements: Array<any> = [];

    // Generate model header
    const groupPrefix = group ? `(${group}) ` : '';
    const modelDescription = `${model.name} model${model.tableName ? ` (table: ${model.tableName})` : ''}`;

    // Add attributes
    for (const attr of model.attributes) {
        const decoratorsStr = attr.decorators.length > 0 ? ` @${attr.decorators.join(' @')}` : '';
        const field = attr.optional ? `[${attr.name}]` : attr.name;
        const description = attr.description || `${attr.name} field`;

        elements.push({
            source: `@${elementType} ${groupPrefix}{${attr.type}${decoratorsStr}} ${field} ${description}`,
            name: elementType.toLowerCase(),
            sourceName: elementType,
            content: `${groupPrefix}{${attr.type}${decoratorsStr}} ${field} ${description}`,
        });
    }

    // Add relationships
    for (const rel of model.relationships) {
        const description = `${rel.name} (${rel.type} ${rel.targetModel})`;

        elements.push({
            source: `@${elementType} ${groupPrefix}{${rel.type}} ${rel.name} ${description}`,
            name: elementType.toLowerCase(),
            sourceName: elementType,
            content: `${groupPrefix}{${rel.type}} ${rel.name} ${description}`,
        });
    }

    return elements;
}
