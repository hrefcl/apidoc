/**
 * @file Core Application Type Definitions
 *
 * Defines the fundamental interfaces for the APIDoc application context
 * and logging system. These types are used throughout the application
 * to ensure type safety and provide structure for core components.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 4.0.0
 * @public
 */

/**
 * Logger interface for standardized logging across APIDoc
 *
 * Provides a consistent logging interface with multiple log levels.
 * Used by all components for status reporting, debugging, and error handling.
 *
 * @example Logger implementation
 * ```typescript
 * const logger: Logger = {
 *   debug: (msg) => console.debug(`[DEBUG] ${msg}`),
 *   verbose: (msg) => console.log(`[VERBOSE] ${msg}`),
 *   info: (msg) => console.info(`[INFO] ${msg}`),
 *   warn: (msg) => console.warn(`[WARN] ${msg}`),
 *   error: (msg) => console.error(`[ERROR] ${msg}`)
 * };
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface Logger {
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

/**
 * Main application context interface
 *
 * Represents the core application state and dependencies. This interface
 * defines the structure of the main app object that is passed between
 * components throughout the APIDoc processing pipeline.
 *
 * @example App context usage
 * ```typescript
 * const app: App = {
 *   options: { src: './src', dest: './docs' },
 *   log: logger,
 *   generator: { name: 'APIDoc', version: '4.0.0' },
 *   packageInfos: { name: 'my-api', version: '1.0.0' },
 *   markdownParser: true,
 *   filters: {},
 *   languages: {},
 *   parsers: {},
 *   workers: {},
 *   hooks: {}
 * };
 * ```
 *
 * @since 4.0.0
 * @public
 */
export interface App {
    /** Configuration options for the documentation generation */
    options: Record<string, any>;
    /** Logger instance for output and debugging */
    log: Logger;
    /** Generator metadata (name, version, etc.) */
    generator: Record<string, any>;
    /** Package information from package.json/apidoc.json */
    packageInfos: Record<string, any>;
    /** Whether markdown processing is enabled */
    markdownParser: boolean;
    /** Registered filter plugins */
    filters: Record<string, string>;
    /** Registered language plugins */
    languages: Record<string, string>;
    /** Registered parser plugins */
    parsers: Record<string, string>;
    /** Registered worker plugins */
    workers: Record<string, string>;
    /** Registered hook functions */
    hooks: Record<string, any>;
    /** Parser instance (optional) */
    parser?: any;
    /** Worker instance (optional) */
    worker?: any;
    /** Filter instance (optional) */
    filter?: any;
    /** Hook execution function (optional) */
    hook?: (name: string) => any;
}
