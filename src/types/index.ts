/**
 * APIDoc 4.0 TypeScript Definitions
 * Core types for the APIDoc documentation generator
 */

export interface ApiDocOptions {
    src: string | string[];
    dest: string;
    template?: string;
    config?: string;
    apiprivate?: boolean;
    verbose?: boolean;
    single?: boolean;
    debug?: boolean;
    colorize?: boolean;
    filters?: Record<string, string>;
    languages?: Record<string, string>;
    parsers?: Record<string, string>;
    workers?: Record<string, string>;
    silent?: boolean;
    dryRun?: boolean;
    markdown?: boolean | string;
    lineEnding?: string;
    encoding?: string;
    copyDefinitions?: boolean;
    filterBy?: string;
    logFormat?: 'simple' | 'json';
    warnError?: boolean;
    writeJson?: boolean;
    excludeFilters?: string[];
    includeFilters?: string[];
}

export interface ApiDocProject {
    name: string;
    version: string;
    title?: string;
    description?: string;
    url?: string;
    sampleUrl?: string | boolean;
    order?: string[];
    template?: {
        aloneDisplay?: boolean;
        showRequiredLabels?: boolean;
        withGenerator?: boolean;
        withCompare?: boolean;
        forceLanguage?: string;
    };
    header?: {
        title?: string;
        filename?: string;
        content?: string;
    };
    footer?: {
        title?: string;
        filename?: string;
        content?: string;
    };
}

export interface ApiDocEntry {
    group: string;
    groupTitle?: string;
    groupDescription?: string;
    name: string;
    title: string;
    type: string;
    url: string;
    version: string;
    description?: string;
    filename?: string;
    permission?: ApiDocPermission[];
    parameter?: ApiDocFields;
    header?: ApiDocFields;
    success?: ApiDocFields;
    error?: ApiDocFields;
    body?: ApiDocFields;
    query?: ApiDocFields;
    examples?: ApiDocExample[];
    sampleRequest?: ApiDocSampleRequest[];
}

export interface ApiDocFields {
    fields?: Record<string, ApiDocField[]>;
    examples?: ApiDocExample[];
}

export interface ApiDocField {
    group: string;
    type?: string;
    size?: string;
    allowedValues?: string[];
    optional?: boolean;
    field: string;
    defaultValue?: any;
    description?: string;
}

export interface ApiDocExample {
    title: string;
    content: string;
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

export interface ApiDocParseResult {
    data: ApiDocEntry[];
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

export interface LoggerInterface {
    debug: (message: string) => void;
    verbose: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
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

// Plugin types
export interface PluginInterface {
    parsers?: Record<string, ApiDocParser>;
    workers?: Record<string, ApiDocWorker>;
    filters?: Record<string, ApiDocFilter>;
    languages?: Record<string, ApiDocLanguage>;
}
