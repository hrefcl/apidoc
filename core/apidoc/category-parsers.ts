/**
 * @file Category-specific parser mappings for inputs system
 *
 * Defines which parsers should be used for each category type.
 * This allows filtering content based on source category.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 */

/**
 * Parser filter configuration for input categories
 *
 * Defines which file patterns and parsers should be enabled
 * for each category type in the inputs configuration.
 */
export interface CategoryParserConfig {
    /** File extension patterns to include (e.g., ['.js', '.ts']) */
    filePatterns?: string[];
    /** Specific parsers to enable for this category */
    enabledParsers?: string[];
    /** Parsers to disable for this category */
    disabledParsers?: string[];
    /** Description of this category */
    description?: string;
}

/**
 * Predefined category parser configurations
 *
 * These categories have optimized parser settings for specific use cases.
 * Custom categories not listed here will use all available parsers.
 * @example Using predefined categories
 * ```json
 * {
 *   "inputs": {
 *     "api": ["./routes"],        // REST API parsers only
 *     "tsdoc": ["./types"],       // TypeScript parsers only
 *     "mqtt": ["./mqtt"],         // MQTT parsers only
 *     "custom": ["./other"]       // All parsers (no filter)
 *   }
 * }
 * ```
 */
export const CATEGORY_PARSERS: Record<string, CategoryParserConfig> = {
    /**
     * Markdown documentation files
     * Only processes markdown content, skips API parsing
     */
    docs: {
        filePatterns: ['.md', '.markdown'],
        enabledParsers: [],
        description: 'Markdown documentation files (header/footer content)',
    },

    /**
     * TypeScript/JSDoc documentation
     * Focuses on TypeScript interfaces, types, and JSDoc comments
     */
    tsdoc: {
        filePatterns: ['.ts', '.tsx', '.d.ts'],
        enabledParsers: [
            'apiSchema',
            'apiDefine',
            'apiUse',
            'apiTypedef',
            'apiInterface',
            'apiEnum',
        ],
        description: 'TypeScript interfaces and type definitions',
    },

    /**
     * REST API endpoints
     * Standard REST API documentation with @api tags
     */
    api: {
        filePatterns: ['.js', '.ts', '.jsx', '.tsx', '.php', '.py', '.rb', '.go', '.java'],
        enabledParsers: [
            'api',
            'apiParam',
            'apiQuery',
            'apiBody',
            'apiSuccess',
            'apiError',
            'apiHeader',
            'apiExample',
            'apiUse',
            'apiGroup',
            'apiName',
            'apiDescription',
            'apiVersion',
            'apiPermission',
            'apiSampleRequest',
        ],
        description: 'REST API endpoint definitions',
    },

    /**
     * Data models and schemas
     * TypeScript interfaces, JSON schemas, database models
     */
    models: {
        filePatterns: ['.ts', '.js', '.json'],
        enabledParsers: ['apiSchema', 'apiDefine', 'apiTypedef', 'apiInterface'],
        description: 'Data models, schemas, and type definitions',
    },

    /**
     * MQTT protocol documentation
     * IoT and message queue endpoints
     */
    mqtt: {
        filePatterns: ['.js', '.ts', '.jsx', '.tsx'],
        enabledParsers: [
            'mqtt',
            'mqttPublish',
            'mqttSubscribe',
            'mqttMessage',
            'mqttPayload',
            'mqttPayloadExample',
            'mqttQos',
            'mqttRetain',
            'mqttClientId',
            'mqttTopic',
            'mqttTopicExample',
            'mqttSchema',
            'mqttSchemaExample',
            'mqttExample',
            'mqttGroup',
            'mqttName',
            'mqttDescription',
            'mqttVersion',
        ],
        description: 'MQTT/IoT protocol endpoints',
    },

    /**
     * OpenAPI/Swagger specifications
     * Native OpenAPI 3.0 syntax support
     */
    openapi: {
        filePatterns: ['.js', '.ts', '.yaml', '.yml', '.json'],
        enabledParsers: [
            'openapi',
            'openapiPath',
            'openapiOperation',
            'openapiSchema',
            'openapiComponent',
        ],
        description: 'OpenAPI 3.0 specifications',
    },

    /**
     * GraphQL schemas and resolvers
     * GraphQL API documentation
     */
    graphql: {
        filePatterns: ['.js', '.ts', '.graphql', '.gql'],
        enabledParsers: [
            'apiSchema',
            'apiDefine',
            'apiParam',
            'apiSuccess',
            'apiError',
            'apiExample',
        ],
        description: 'GraphQL schemas and resolvers',
    },
};

/**
 * Get parser configuration for a specific category
 *
 * Returns the parser config for predefined categories,
 * or undefined for custom categories (which use all parsers).
 * @param category - Category name from inputs configuration
 * @returns Parser configuration or undefined
 * @example
 * ```typescript
 * const config = getCategoryConfig('api');
 * console.log(config.enabledParsers); // ['api', 'apiParam', ...]
 * ```
 */
export function getCategoryConfig(category: string): CategoryParserConfig | undefined {
    return CATEGORY_PARSERS[category.toLowerCase()];
}

/**
 * Check if a category should process a specific file
 *
 * @param category - Category name
 * @param filename - File path to check
 * @returns True if file should be processed by this category
 * @example
 * ```typescript
 * shouldProcessFile('tsdoc', 'types/user.ts'); // true
 * shouldProcessFile('tsdoc', 'routes/api.js');  // false
 * ```
 */
export function shouldProcessFile(category: string, filename: string): boolean {
    const config = getCategoryConfig(category);

    // Custom categories process all files
    if (!config || !config.filePatterns) {
        return true;
    }

    // Check if file matches category patterns
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return config.filePatterns.includes(ext);
}

/**
 * Check if a parser should be enabled for a category
 *
 * @param category - Category name
 * @param parserName - Parser name to check
 * @returns True if parser should be enabled
 * @example
 * ```typescript
 * isParserEnabled('api', 'apiParam');  // true
 * isParserEnabled('api', 'mqtt');       // false
 * ```
 */
export function isParserEnabled(category: string, parserName: string): boolean {
    const config = getCategoryConfig(category);

    // Custom categories enable all parsers
    if (!config) {
        return true;
    }

    // Check disabled parsers first
    if (config.disabledParsers?.includes(parserName)) {
        return false;
    }

    // If enabledParsers is defined, only enable listed parsers
    if (config.enabledParsers && config.enabledParsers.length > 0) {
        return config.enabledParsers.includes(parserName);
    }

    // Default: enable all parsers
    return true;
}

/**
 * Get list of all available category names
 *
 * @returns Array of predefined category names
 */
export function getAvailableCategories(): string[] {
    return Object.keys(CATEGORY_PARSERS);
}
