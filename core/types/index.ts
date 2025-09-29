/**
 * @file APIDoc 4.0 TypeScript Definitions
 *
 * Core types and interfaces for the APIDoc documentation generator.
 * Provides comprehensive type safety for all APIDoc components including
 * configuration options, parsed data structures, and plugin interfaces.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 4.0.0
 * @public
 */

/**
 * Configuration options for APIDoc generation
 *
 * Defines all available configuration options for customizing the APIDoc
 * generation process. These options can be provided via CLI arguments,
 * configuration files, or programmatic API calls.
 *
 * @example Basic configuration
 * ```typescript
 * const options: ApiDocOptions = {
 *   src: './src/',
 *   dest: './docs/',
 *   template: 'template/',
 *   verbose: true
 * }
 * ```
 *
 * @example Advanced configuration with filters
 * ```typescript
 * const options: ApiDocOptions = {
 *   src: ['./src/', './lib/'],
 *   dest: './api-docs/',
 *   includeFilters: ['*.js', '*.ts'],
 *   excludeFilters: ['node_modules', 'test'],
 *   filterBy: 'version=1.0.0'
 * }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface ApiDocOptions {
    /** Source files or directories to parse for API documentation */
    src: string | string[];
    /** Destination directory for generated documentation */
    dest: string;
    /** Custom template directory path */
    template?: string;
    /** Configuration file path (apidoc.json) */
    config?: string;
    /** Include private API endpoints marked with @apiprivate */
    apiprivate?: boolean;
    /** Enable verbose logging output */
    verbose?: boolean;
    /** Generate documentation as a single file */
    single?: boolean;
    /** Enable debug mode with detailed logging */
    debug?: boolean;
    /** Enable colored console output */
    colorize?: boolean;
    /** Custom filter plugins to load */
    filters?: Record<string, string>;
    /** Custom language plugins to load */
    languages?: Record<string, string>;
    /** Custom parser plugins to load */
    parsers?: Record<string, string>;
    /** Custom worker plugins to load */
    workers?: Record<string, string>;
    /** Suppress all console output */
    silent?: boolean;
    /** Parse files but don't write output (validation mode) */
    dryRun?: boolean;
    /** Enable markdown processing or specify custom parser */
    markdown?: boolean | string;
    /** Line ending style for generated files ('\\n', '\\r\\n') */
    lineEnding?: string;
    /** File encoding for reading source files */
    encoding?: string;
    /** Copy @apiDefine definitions to output for external usage */
    copyDefinitions?: boolean;
    /** Filter documentation by specific criteria (e.g., 'version=1.0.0') */
    filterBy?: string;
    /** Log output format */
    logFormat?: 'simple' | 'json';
    /** Treat warnings as errors (fail on warnings) */
    warnError?: boolean;
    /** Generate additional JSON output file */
    writeJson?: boolean;
    /** File patterns to exclude from parsing */
    excludeFilters?: string[];
    /** File patterns to include in parsing */
    includeFilters?: string[];
    /** Generate only MQTT protocol documentation (exclude REST APIs) */
    mqttOnly?: boolean;
    /** Exit with error code if MQTT payload schemas are invalid */
    failOnMqttSchemaError?: boolean;
    /** apiCAT plugin configuration */
    apicat?: {
        enabled: boolean;
        outputDir?: string;
        generateCollections?: boolean;
        enableLocalTesting?: boolean;
    };
}

/**
 * Project metadata and configuration for APIDoc documentation
 *
 * Contains project-level information and template configuration options.
 * This data is typically read from package.json and apidoc.json files
 * and used to customize the generated documentation appearance and behavior.
 *
 * @example Basic project configuration
 * ```typescript
 * const project: ApiDocProject = {
 *   name: 'My API',
 *   version: '1.0.0',
 *   description: 'RESTful API for my application',
 *   url: 'https://api.example.com'
 * }
 * ```
 *
 * @example Advanced project with template options
 * ```typescript
 * const project: ApiDocProject = {
 *   name: 'Enterprise API',
 *   version: '2.1.0',
 *   template: {
 *     showRequiredLabels: true,
 *     withCompare: true,
 *     forceLanguage: 'en'
 *   },
 *   header: {
 *     title: 'Custom Header',
 *     filename: './header.md'
 *   }
 * }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface ApiDocProject {
    /** Project name displayed in documentation */
    name: string;
    /** Semantic version of the API */
    version: string;
    /** Custom title for the documentation (defaults to name) */
    title?: string;
    /** Project description shown in documentation header */
    description?: string;
    /** Base URL for the API endpoints */
    url?: string;
    /** Sample request URL or boolean to enable/disable sample requests */
    sampleUrl?: string | boolean;
    /** Custom ordering for API groups */
    order?: string[];
    /** Template-specific configuration options */
    template?: {
        /** Display single endpoint per page */
        aloneDisplay?: boolean;
        /** Show required/optional labels on parameters */
        showRequiredLabels?: boolean;
        /** Include generator information in footer */
        withGenerator?: boolean;
        /** Enable version comparison features */
        withCompare?: boolean;
        /** Force specific language for documentation */
        forceLanguage?: string;
    };
    /** Custom header configuration */
    header?: {
        /** Header title text */
        title?: string;
        /** Path to header content file */
        filename?: string;
        /** Inline header content */
        content?: string;
    };
    /** Custom footer configuration */
    footer?: {
        /** Footer title text */
        title?: string;
        /** Path to footer content file */
        filename?: string;
        /** Inline footer content */
        content?: string;
    };
}

/**
 * Represents a single API endpoint documentation entry
 *
 * Contains all parsed information for a single API endpoint including
 * metadata, parameters, responses, and examples. This is the core data
 * structure that represents each documented API endpoint.
 *
 * @example Complete API endpoint
 * ```typescript
 * const apiEntry: ApiDocEntry = {
 *   group: 'User',
 *   name: 'GetUser',
 *   title: 'Get User Information',
 *   type: 'GET',
 *   url: '/api/users/:id',
 *   version: '1.0.0',
 *   description: 'Retrieves detailed information about a specific user',
 *   parameter: {
 *     fields: {
 *       Parameter: [{
 *         group: 'Parameter',
 *         type: 'Number',
 *         field: 'id',
 *         description: 'User unique identifier'
 *       }]
 *     }
 *   }
 * }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface ApiDocEntry {
    /** API group name for organization */
    group: string;
    /** Display title for the API group */
    groupTitle?: string;
    /** Description of the API group */
    groupDescription?: string;
    /** Unique identifier for this API endpoint */
    name: string;
    /** Human-readable title for the endpoint */
    title: string;
    /** HTTP method (GET, POST, PUT, DELETE, etc.) */
    type: string;
    /** URL path with parameter placeholders */
    url: string;
    /** API version this endpoint belongs to */
    version: string;
    /** Detailed description of the endpoint functionality */
    description?: string;
    /** Source file where this endpoint was defined */
    filename?: string;
    /** Required permissions to access this endpoint */
    permission?: ApiDocPermission[];
    /** URL and query parameters */
    parameter?: ApiDocFields;
    /** HTTP headers */
    header?: ApiDocFields;
    /** Success response fields */
    success?: ApiDocFields;
    /** Error response fields */
    error?: ApiDocFields;
    /** Request body parameters */
    body?: ApiDocFields;
    /** Query string parameters */
    query?: ApiDocFields;
    /** Code examples for this endpoint */
    examples?: ApiDocExample[];
    /** Sample request configuration */
    sampleRequest?: ApiDocSampleRequest[];
}

/**
 * Collection of API fields grouped by category
 *
 * Organizes related API fields (parameters, headers, responses) into
 * logical groups. Each group can contain multiple fields and examples.
 *
 * @example Parameter fields
 * ```typescript
 * const paramFields: ApiDocFields = {
 *   fields: {
 *     'Parameter': [
 *       { group: 'Parameter', field: 'id', type: 'Number', description: 'User ID' },
 *       { group: 'Parameter', field: 'name', type: 'String', description: 'User name' }
 *     ]
 *   },
 *   examples: [{
 *     title: 'Example request',
 *     content: 'GET /users/123',
 *     type: 'curl'
 *   }]
 * }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface ApiDocFields {
    /** Fields organized by group name */
    fields?: Record<string, ApiDocField[]>;
    /** Usage examples for these fields */
    examples?: ApiDocExample[];
}

/**
 * Individual API field definition
 *
 * Represents a single parameter, header, or response field with its
 * type information, constraints, and documentation.
 *
 * @example Required parameter
 * ```typescript
 * const userIdField: ApiDocField = {
 *   group: 'Parameter',
 *   field: 'userId',
 *   type: 'Number',
 *   optional: false,
 *   description: 'Unique identifier for the user'
 * }
 * ```
 *
 * @example Optional field with constraints
 * ```typescript
 * const statusField: ApiDocField = {
 *   group: 'Parameter',
 *   field: 'status',
 *   type: 'String',
 *   optional: true,
 *   allowedValues: ['active', 'inactive', 'pending'],
 *   defaultValue: 'active',
 *   description: 'User account status'
 * }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface ApiDocField {
    /** Field group (Parameter, Header, Response, etc.) */
    group: string;
    /** Data type (String, Number, Boolean, Object, etc.) */
    type?: string;
    /** Size constraint for the field value */
    size?: string;
    /** Array of allowed values for this field */
    allowedValues?: string[];
    /** Whether this field is optional */
    optional?: boolean;
    /** Field name/key */
    field: string;
    /** Default value if not provided */
    defaultValue?: any;
    /** Human-readable description of the field */
    description?: string;
}

/**
 * Code example for API documentation
 *
 * Represents a code example with syntax highlighting support.
 * Used for request/response examples, usage demonstrations, etc.
 *
 * @example cURL example
 * ```typescript
 * const curlExample: ApiDocExample = {
 *   title: 'Example Request',
 *   content: 'curl -X GET "https://api.example.com/users/123"',
 *   type: 'curl'
 * }
 * ```
 *
 * @example JSON response example
 * ```typescript
 * const jsonExample: ApiDocExample = {
 *   title: 'Success Response',
 *   content: '{\n  "id": 123,\n  "name": "John Doe"\n}',
 *   type: 'json'
 * }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface ApiDocExample {
    /** Display title for the example */
    title: string;
    /** Example code content */
    content: string;
    /** Language/format type for syntax highlighting */
    type: string;
}

export interface ApiDocPermission {
    name: string;
    title?: string;
    description?: string;
}

export interface ApiDocSampleRequest {
    url: string;
}

/**
 * Result of parsing API documentation from source files
 *
 * Contains the complete parsed API documentation including all endpoints
 * and project metadata. This is the main output of the parsing process.
 *
 * @example Parse result
 * ```typescript
 * const result: ApiDocParseResult = {
 *   data: [
 *     {
 *       group: 'User',
 *       name: 'GetUser',
 *       title: 'Get User',
 *       type: 'GET',
 *       url: '/users/:id',
 *       version: '1.0.0'
 *     }
 *   ],
 *   project: {
 *     name: 'My API',
 *     version: '1.0.0',
 *     description: 'RESTful API'
 *   }
 * }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface ApiDocParseResult {
    /** Array of parsed API endpoints */
    data: ApiDocEntry[];
    /** Project metadata and configuration */
    project: ApiDocProject;
}

export interface ApiDocParser {
    name: string;
    parse: (content: string, source: string, messages: any) => any;
}

export interface ApiDocWorker {
    name: string;
    work: (block: any, source: string, messages: any) => any;
}

export interface ApiDocFilter {
    name: string;
    process: (parsedFiles: any[], filenames: string[], packageInfos: any) => any;
}

export interface ApiDocLanguage {
    name: string;
    nameFilter: string;
    extFilter: string;
    commentFilter: string;
}

/**
 * Logger interface for APIDoc logging system
 *
 * Defines the contract for logging implementations used throughout APIDoc.
 * Supports multiple log levels for different types of output.
 *
 * @example Custom logger implementation
 * ```typescript
 * const customLogger: LoggerInterface = {
 *   debug: (msg) => console.debug(`[DEBUG] ${msg}`),
 *   verbose: (msg) => console.log(`[VERBOSE] ${msg}`),
 *   info: (msg) => console.info(`[INFO] ${msg}`),
 *   warn: (msg) => console.warn(`[WARN] ${msg}`),
 *   error: (msg) => console.error(`[ERROR] ${msg}`)
 * }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface LoggerInterface {
    /** Debug level logging for development */
    debug: (message: string) => void;
    /** Verbose logging for detailed operation info */
    verbose: (message: string) => void;
    /** General information logging */
    info: (message: string) => void;
    /** Warning messages that don't stop execution */
    warn: (message: string) => void;
    /** Error messages for failures */
    error: (message: string) => void;
}

export interface MarkdownParser {
    render: (content: string) => string;
}

export interface AppContext {
    log: LoggerInterface;
    markdownParser: MarkdownParser;
    options: ApiDocOptions;
}

// Template types
export interface TemplateData {
    API_DATA: ApiDocEntry[];
    API_PROJECT: ApiDocProject;
}

export interface NavigationItem {
    group: string;
    name?: string;
    title: string;
    type?: string;
    version?: string;
    url?: string;
    isHeader?: boolean;
    hidden?: boolean;
    isFixed?: boolean;
}

// Error types
export interface ApiDocError extends Error {
    element?: string;
    source?: string;
    line?: number;
}

/**
 * Plugin interface for extending APIDoc functionality
 *
 * Defines the structure for APIDoc plugins that can extend parsing,
 * processing, filtering, and language support capabilities.
 *
 * @example Plugin implementation
 * ```typescript
 * const myPlugin: PluginInterface = {
 *   parsers: {
 *     'custom-tag': {
 *       name: 'custom-tag',
 *       parse: (content, source, messages) => {
 *         // Custom parsing logic
 *         return { name: 'custom-tag', content }
 *       }
 *     }
 *   },
 *   languages: {
 *     'rust': {
 *       name: 'rust',
 *       nameFilter: '\\.rs$',
 *       extFilter: 'rs',
 *       commentFilter: '//'
 *     }
 *   }
 * }
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface PluginInterface {
    /** Custom tag parsers */
    parsers?: Record<string, ApiDocParser>;
    /** Post-processing workers */
    workers?: Record<string, ApiDocWorker>;
    /** Output filters */
    filters?: Record<string, ApiDocFilter>;
    /** Programming language definitions */
    languages?: Record<string, ApiDocLanguage>;
}
