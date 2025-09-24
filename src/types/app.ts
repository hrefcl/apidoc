export interface Logger {
    debug: (message: string) => void;
    verbose: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
}

export interface App {
    options: Record<string, any>;
    log: Logger;
    generator: Record<string, any>;
    packageInfos: Record<string, any>;
    markdownParser: boolean;
    filters: Record<string, string>;
    languages: Record<string, string>;
    parsers: Record<string, string>;
    workers: Record<string, string>;
    hooks: Record<string, any>;
    parser?: any;
    worker?: any;
    filter?: any;
    hook?: (name: string) => any;
}
