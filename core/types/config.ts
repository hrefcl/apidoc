/**
 * @file APIDoc Configuration Type Definitions
 *
 * Defines TypeScript interfaces for apidoc.json configuration,
 * including the new inputs system for multiple data sources.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

/**
 * Categorized input sources configuration
 *
 * Allows defining multiple input sources with meaningful categories.
 * Each category can have multiple directory paths that will be scanned
 * for documentation.
 * @example Multiple data sources
 * ```json
 * {
 *   "inputs": {
 *     "docs": ["/md"],
 *     "tsdoc": ["../core"],
 *     "api": ["."],
 *     "models": ["../model/sq/"]
 *   }
 * }
 * ```
 * @since 5.0.0
 * @public
 */
export interface InputSources {
    /** Documentation files category */
    docs?: string[];
    /** TypeScript documentation category */
    tsdoc?: string[];
    /** API endpoint files category */
    api?: string[];
    /** Data models category */
    models?: string[];
    /** Custom categories - any string key */
    [category: string]: string[] | undefined;
}

/**
 * APIDoc JSON Configuration
 *
 * Main configuration interface for apidoc.json file.
 * Supports both legacy "input" array and new "inputs" object.
 * @example Complete configuration
 * ```json
 * {
 *   "name": "My API",
 *   "version": "1.0.0",
 *   "description": "API Documentation",
 *   "inputs": {
 *     "api": ["."],
 *     "models": ["../models"]
 *   },
 *   "login": {
 *     "active": true,
 *     "encryptionKey": "..."
 *   }
 * }
 * ```
 * @since 5.0.0
 * @public
 */
export interface ApidocConfig {
    /** Project name */
    name?: string;
    /** Project version */
    version?: string;
    /** Project description */
    description?: string;
    /** Project title */
    title?: string;
    /** API base URL */
    url?: string;
    /** Sample URL for testing */
    sampleUrl?: string;

    /**
     * NEW: Categorized input sources (recommended)
     * Allows multiple data sources with meaningful categories
     */
    inputs?: InputSources;

    /**
     * LEGACY: Simple input array (backwards compatibility)
     * Use "inputs" instead for better organization
     * @deprecated Use inputs object instead
     */
    input?: string[];

    /** Header configuration */
    header?: {
        title?: string;
        filename?: string;
        icon?: string;
    };

    /** Footer configuration */
    footer?: {
        title?: string;
        filename?: string;
        icon?: string;
    };

    /** Custom settings per group */
    settings?: Record<string, any>;

    /** Authentication and encryption configuration */
    login?: {
        active?: boolean;
        urlAuth?: string;
        value_form?: Record<string, string>;
        response_success?: number;
        response_error?: number;
        encryptionKey?: string;
        admited?: string[];
    };

    /** apiCAT plugin configuration */
    apicat?: {
        enabled?: boolean;
        [key: string]: any;
    };

    /** Template configuration */
    template?: {
        withCompare?: boolean;
        withGenerator?: boolean;
        [key: string]: any;
    };

    /** Order of groups in output */
    order?: string[];

    /** Additional custom fields */
    [key: string]: any;
}
