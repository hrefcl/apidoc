/**
 * @file Configuration and content reader for APIDoc
 *
 * Handles reading project configuration files (apidoc.json, package.json),
 * header/footer content files, and manages project metadata.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 */

import * as fs from 'fs-extra';
import { isEqual } from 'lodash';
import * as path from 'path';
import { ApiDocProject, AppContext } from '../types';

/**
 * Default configuration values for APIDoc projects
 */
interface DefaultConfig {
    /** Default project name */
    name: string;
    /** Default version number */
    version: string;
    /** Default project description */
    description: string;
}

/**
 * Configuration for header and footer content files
 */
interface HeaderFooterConfig {
    /** Path to the markdown file containing content */
    filename?: string;
    /** Title for the header/footer section */
    title?: string;
    /** Font Awesome icon class (e.g., 'fa-home', 'fa-info-circle') */
    icon?: string;
}

/**
 * Logo configuration for custom branding
 */
interface LogoConfig {
    /** Logo image URL (can be relative path, absolute URL, or data URL) */
    url?: string;
    /** Alternative text for the logo image */
    alt?: string;
    /** Font Awesome icon class to use instead of image (e.g., 'fa-code', 'fa-api') */
    icon?: string;
    /** Width of the logo in CSS units (e.g., '32px', '2rem') */
    width?: string;
    /** Height of the logo in CSS units (e.g., '32px', '2rem') */
    height?: string;
}

/**
 * Group configuration for custom icons and titles
 */
interface GroupSettings {
    /** Font Awesome icon class (e.g., 'fa-user', 'fa-shield') */
    icon?: string;
    /** Custom title for the group */
    title?: string;
    /** Custom markdown file for this group/section */
    filename?: string;
}

/**
 * Extended configuration interface combining project settings with file-specific options
 */
interface Config extends Partial<Omit<ApiDocProject, 'documentation'>> {
    /** Header configuration */
    header?: HeaderFooterConfig;
    /** Footer configuration */
    footer?: HeaderFooterConfig;
    /** Logo configuration for sidebar branding */
    logo?: LogoConfig;
    /** Input directories (legacy support) */
    input?: string[];
    /** NEW: Categorized input sources (recommended - v5.0+) */
    inputs?: Record<string, string[]>;
    /** APIDoc-specific configuration */
    apidoc?: any;
    /** apiCAT plugin configuration */
    apicat?: {
        enabled: boolean;
        outputDir?: string;
        generateCollections?: boolean;
        enableLocalTesting?: boolean;
    };
    /** Custom settings for groups (icons, titles, etc.) */
    settings?: Record<string, GroupSettings>;
    /** Documentation glob pattern (e.g., "./docs/*.md", "./md/*") */
    documentation?: string;
}

/**
 * Default configuration values used when no config file is found
 */
const defaultConfig: DefaultConfig = {
    name: 'Acme project',
    version: '0.0.0',
    description: 'REST Api',
};

/**
 * Configuration and content reader for APIDoc projects
 *
 * The Reader class is responsible for:
 * - Reading and parsing configuration files (apidoc.json, package.json)
 * - Loading header and footer content from markdown files
 * - Merging configuration from multiple sources with proper precedence
 * - Providing validated project metadata for documentation generation
 * @example Basic usage
 * ```typescript
 * const reader = new Reader(appContext);
 * const projectInfo = reader.read();
 * console.log('Project:', projectInfo.name, 'v' + projectInfo.version);
 * ```
 * @example Configuration precedence
 * ```
 * 1. apidoc.json (highest priority)
 * 2. package.json (apidoc field)
 * 3. Default values (lowest priority)
 * ```
 * @since 5.0.0
 * @public
 */
class Reader {
    private app: AppContext;
    private log: any;
    private opt: any;

    /**
     * Initialize the Reader instance
     *
     * Sets up the reader with application context including logger and options.
     * The reader will use the provided configuration for file paths and processing options.
     * @param app - Application context containing logger, options, and other shared state
     * @example
     * ```typescript
     * const appContext: AppContext = {
     *   log: logger,
     *   options: { src: ['./src'], dest: './docs' },
     *   markdownParser: parser
     * };
     * const reader = new Reader(appContext);
     * ```
     */
    constructor(app: AppContext) {
        this.app = app;
        this.log = app.log;
        this.opt = app.options;
    }

    /**
     * Reads and merges configuration from multiple sources
     *
     * This method searches for configuration files in the following order of precedence:
     * 1. `apidoc.json` - Dedicated APIDoc configuration file (highest priority)
     * 2. `apidoc.config.js` - JavaScript configuration file
     * 3. `package.json` - NPM package file with 'apidoc' field
     * 4. Default values - Built-in fallback configuration (lowest priority)
     *
     * The method also reads header and footer content files if specified in the configuration.
     * @returns Merged configuration object containing:
     *   - Project metadata (name, version, description, etc.)
     *   - Header content and title (if specified)
     *   - Footer content and title (if specified)
     *   - API base URL and sample URL
     *   - Template and styling options
     * @throws {Error} When configuration files exist but contain invalid JSON
     * @example Configuration file precedence
     * ```
     * // 1. apidoc.json (if exists)
     * {
     *   "name": "My API",
     *   "version": "1.0.0",
     *   "header": { "filename": "header.md" }
     * }
     *
     * // 2. package.json (if apidoc.json doesn't exist)
     * {
     *   "name": "my-package",
     *   "version": "1.0.0",
     *   "apidoc": {
     *     "name": "My API Documentation"
     *   }
     * }
     * ```
     * @example Return value structure
     * ```typescript
     * const config = reader.read();
     * // Returns:
     * {
     *   name: "My API",
     *   version: "1.0.0",
     *   description: "API documentation",
     *   header: {
     *     title: "Introduction",
     *     content: "<markdown content>"
     *   },
     *   footer: {
     *     title: "Contact",
     *     content: "<markdown content>"
     *   }
     * }
     * ```
     * @since 5.0.0
     * @public
     */
    read(): Config {
        let config: Config = {};

        // if the config file is provided, we use this and do no try to read other files
        if (this.opt.config) {
            this.log.debug('Config file provided, reading this.');
            config = require(path.resolve(this.opt.config));
        } else {
            config = this.search();
        }

        // replace header footer with file contents
        const headerFooter = this.getHeaderFooter(config);

        // Process documentation files if pattern specified
        const documentation = this.getDocumentation(config);

        return Object.assign(config, headerFooter, { documentation });
    }

    /**
     * Search for API documentation configuration files in specified directories.
     * @returns Merged configuration object
     */
    search(): Config {
        this.log.debug('Now looking for apidoc config files');

        // possible sources of information
        const sources = ['package.json', 'apidoc.json', 'apidoc.config.js'];

        // create a new object because JavaScript will not assign value
        const config: Config = Object.assign({}, defaultConfig);

        // loop the three possible sources of information to try and find packageInfo
        sources.forEach((configFile) => {
            this.log.debug(`Now looking for ${configFile}`);

            // first look in cwd dir
            Object.assign(config, this.findConfigFileInDir(configFile, process.cwd()));

            // scan each source dir to find a valid config file
            this.opt.src.forEach((dir: string) => {
                Object.assign(config, this.findConfigFileInDir(configFile, dir));
            });
        });

        if (isEqual(config, defaultConfig)) {
            this.log.warn('No config files found.');
        }

        return config;
    }

    /**
     * Get json.header / json.footer title and markdown content
     *
     * Retrieves and processes header and footer configurations by reading content from the specified files
     * and rendering it with a Markdown parser if available.
     * @param config - Configuration object containing details about header and footer settings.
     * @returns Object containing processed header and footer content, including their titles.
     * @throws If the header or footer file cannot be read.
     */
    getHeaderFooter(config: Config): { header?: any; footer?: any } {
        const result: any = {};

        ['header', 'footer'].forEach((key) => {
            const configSection = config[key as keyof Config] as HeaderFooterConfig;

            if (configSection) {
                // Handle case where only title/icon are configured without filename
                if (!configSection.filename) {
                    if (configSection.title || configSection.icon) {
                        result[key] = {
                            title: configSection.title,
                            content: null, // No content if no file
                            icon: configSection.icon,
                        };
                    }
                    return; // Skip file processing
                }

                // Handle case with filename
                this.log.debug('Now looking for ' + key);

                // note that markdown files path is taken from first input value
                let filePath = path.join(config.input ? config.input[0] : './', configSection.filename);

                // try again to find it in current dir
                if (!fs.existsSync(filePath)) {
                    filePath = path.join(process.cwd(), configSection.filename);
                }

                // try again to find it in input folders
                if (!fs.existsSync(filePath)) {
                    filePath = this.findFileInSrc(configSection.filename);
                }

                // try again to find it in dir with the config file
                if (!fs.existsSync(filePath) && typeof this.opt.config === 'string') {
                    filePath = path.join(path.dirname(this.opt.config), configSection.filename);
                }

                try {
                    this.log.debug(`Reading ${key} file: ${filePath}`);
                    const content = fs.readFileSync(filePath, 'utf8');
                    result[key] = {
                        title: configSection.title,
                        content: this.app.markdownParser ? this.app.markdownParser.render(content) : content,
                        icon: configSection.icon, // Include icon if specified
                    };
                } catch (e) {
                    throw new Error('Can not read: ' + filePath);
                }
            }
        });

        return result;
    }

    /**
     * Process documentation files from glob pattern
     *
     * Reads all markdown files matching the pattern specified in config.documentation
     * and returns an array of documentation entries with their content and metadata.
     * @param config - Configuration object containing documentation glob pattern
     * @returns Array of documentation entries with filename, title, content, and icon
     */
    getDocumentation(config: Config): Array<{ filename: string; title: string; content: string; icon?: string }> {
        const docs: Array<{ filename: string; title: string; content: string; icon?: string }> = [];

        if (!config.documentation) {
            return docs;
        }

        this.log.info(`📚 Processing documentation pattern: ${config.documentation}`);

        try {
            const glob = require('glob');
            // Use CLI src directory (absolute), not config.input (relative to config file)
            const baseDir = path.resolve(this.opt.src[0]);

            // Log the paths for debugging
            this.log.verbose(`Base directory: ${baseDir}`);
            this.log.verbose(`Documentation pattern: ${config.documentation}`);

            // Use glob with cwd option for relative patterns
            const files = glob.sync(config.documentation, { cwd: baseDir, absolute: true });

            this.log.verbose(`Glob search: pattern="${config.documentation}" cwd="${baseDir}"`);
            this.log.info(`Found ${files.length} documentation files`);

            if (files.length > 0) {
                this.log.verbose(`First file found: ${files[0]}`);
            }

            files.forEach((filePath: string) => {
                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const filename = path.basename(filePath, '.md');

                    // Extract title from filename or first H1 in content
                    let title = filename
                        .replace(/-/g, ' ')
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase());

                    // Try to extract title from first H1
                    const h1Match = content.match(/^#\s+(.+)$/m);
                    if (h1Match) {
                        title = h1Match[1];
                    }

                    docs.push({
                        filename: filename,
                        title: title,
                        content: this.app.markdownParser ? this.app.markdownParser.render(content) : content,
                        icon: 'fa-file-text',
                    });

                    this.log.verbose(`  ✓ Processed: ${filename}`);
                } catch (e) {
                    this.log.warn(`  ✗ Failed to read: ${filePath}`);
                }
            });
        } catch (e) {
            this.log.error(`Error processing documentation pattern: ${e}`);
        }

        return docs;
    }

    /**
     * Search for a configuration file in a specified directory.
     * @param filename - Name of the configuration file to locate.
     * @param dir - Directory to scan
     * @returns Configuration data if the file is found, or an empty object if not found.
     */
    findConfigFileInDir(filename: string, dir: string): Config {
        let foundConfig: any;
        const target = path.resolve(path.join(dir, filename));

        if (fs.existsSync(target)) {
            this.log.debug(`Found file: ${target}`);
            foundConfig = require(target);

            // if it has an apidoc key, read that
            if (foundConfig.apidoc) {
                this.log.verbose(`Using apidoc key of ${filename}`);

                // pull any missing config from root
                ['version', 'name', 'description'].forEach((key) => {
                    if (!foundConfig.apidoc[key] && foundConfig[key]) {
                        this.log.verbose(`Using ${key} from root of ${filename}`);
                        foundConfig.apidoc[key] = foundConfig[key];
                    }
                });

                return foundConfig.apidoc;
            }

            // for package.json we don't want to read it if it has no apidoc key
            if (filename !== 'package.json') {
                return foundConfig;
            }
        }

        return {};
    }

    /**
     * Look for a file in each of the input folders.
     *
     * If multiple files with the same name exist in different directories, the method returns the first valid file it finds.
     * @param filename - Name of the file to search for
     * @returns Resolved path of the found file, or an empty string if not.
     */
    findFileInSrc(filename: string): string {
        // scan each source dir to find a valid config file
        // note that any file found here will supersede a previously found file
        for (const dir of this.opt.src) {
            const target = path.join(dir, filename);
            if (fs.existsSync(target)) {
                this.log.debug('Found file: ' + target);
                return path.resolve(target);
            }
        }
        return '';
    }
}

export { defaultConfig, Reader };
