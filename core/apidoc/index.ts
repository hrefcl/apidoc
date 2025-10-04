/**
 * @file Main entry point for the APIDoc library
 *
 * APIDoc creates documentation from API descriptions in your source code.
 * This is a RESTful web API Documentation Generator with TypeScript support.
 * @package
 * @version 5.0.0
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @see {@link https://apidocjs.com} Official documentation
 * @see {@link https://github.com/hrefcl/apidoc} GitHub repository
 *
 * This project is a TypeScript refactor inspired by the original apidoc project.
 * @example
 * ```typescript
 * import { createDoc } from '@hrefcl/apidoc';
 *
 * const result = createDoc({
 *   src: ['./src'],
 *   dest: './doc',
 *   name: 'My API'
 * });
 *
 * if (typeof result !== 'boolean') {
 *   console.log('API Documentation generated successfully');
 *   console.log('Data:', result.data);
 *   console.log('Project info:', result.project);
 * }
 * ```
 */

import * as path from 'path';
import * as pkgJson from '../../package.json';
import * as core from '../index';
import { ApiDocOptions, ApiDocParseResult, AppContext, LoggerInterface, MarkdownParser } from '../types';
import { createEncryption, encryptDirectoryJSON } from '../utils/encryption';
import * as defaults from './defaults';
import * as optionsProcessor from './options';
import { ApiCatPlugin } from './plugins/apicat';
import { Reader } from './reader';
import Writer from './writer';

/**
 * Global application context containing shared instances and configuration
 * @internal
 */
const app: AppContext = {
    log: {} as LoggerInterface,
    markdownParser: {} as MarkdownParser,
    options: {} as ApiDocOptions,
};

/**
 * Global error handler for uncaught exceptions
 * Ensures graceful shutdown and proper error reporting
 * @internal
 */
process.on('uncaughtException', (err: Error) => {
    console.error(new Date().toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});

/**
 * Creates API documentation from source code comments
 *
 * This is the main entry point for generating API documentation. It processes
 * source files containing API documentation comments and generates HTML output.
 * @param options - Configuration options for documentation generation
 * @param options.src - Source files or directories to process (array or string)
 * @param options.dest - Output directory for generated documentation
 * @param options.name - Name of the API project
 * @param options.version - Version of the API
 * @param options.description - Description of the API project
 * @param options.title - Title for the generated documentation
 * @param options.url - Base URL of the API
 * @param options.sampleUrl - Sample URL for API requests
 * @param options.header - Header configuration object
 * @param options.footer - Footer configuration object
 * @param options.template - Custom template directory
 * @param options.config - Configuration file path
 * @param options.apiprivate - Include private API endpoints
 * @param options.verbose - Enable verbose logging
 * @param options.debug - Enable debug mode
 * @param options.silent - Suppress all output
 * @param options.simulate - Dry run mode (don't write files)
 * @param options.warnError - Treat warnings as errors and exit with error code
 * @param options.markdown - Enable markdown parsing in descriptions
 * @param options.lineEnding - Line ending style (CRLF or LF)
 * @param options.encoding - File encoding (default: utf8)
 * @returns Processing result:
 *   - `ApiDocParseResult` object with `data` and `project` properties if successful
 *   - `true` if there are no files to process
 *   - `false` if an error occurred during processing
 * @throws {Error} Throws error if options are invalid or processing fails
 * @example Basic usage
 * ```typescript
 * import { createDoc } from '@hrefcl/apidoc';
 *
 * const result = createDoc({
 *   src: ['./src/controllers'],
 *   dest: './docs/api'
 * });
 *
 * if (typeof result !== 'boolean') {
 *   console.log('Generated docs for', result.project.name);
 * }
 * ```
 * @example Advanced configuration
 * ```typescript
 * const result = createDoc({
 *   src: ['./src/api', './src/controllers'],
 *   dest: './public/docs',
 *   name: 'My REST API',
 *   version: '1.2.0',
 *   description: 'A comprehensive REST API for managing resources',
 *   url: 'https://api.example.com/v1',
 *   sampleUrl: 'https://api.example.com/v1',
 *   header: {
 *     title: 'Introduction',
 *     filename: './docs/header.md'
 *   },
 *   footer: {
 *     title: 'Additional Info',
 *     filename: './docs/footer.md'
 *   },
 *   verbose: true,
 *   apiprivate: false
 * });
 * ```
 * @example Error handling
 * ```typescript
 * try {
 *   const result = createDoc({
 *     src: ['./nonexistent'],
 *     dest: './docs'
 *   });
 *
 *   if (result === false) {
 *     console.error('Documentation generation failed');
 *   } else if (result === true) {
 *     console.log('No API documentation found');
 *   } else {
 *     console.log('Success:', result.data.length, 'endpoints documented');
 *   }
 * } catch (error) {
 *   console.error('Configuration error:', error.message);
 * }
 * ```
 * @see {@link https://apidocjs.com} Complete documentation
 * @see {@link https://apidocjs.com/example} Live example
 * @since 5.0.0
 * @public
 */
async function createDoc(options: ApiDocOptions): Promise<ApiDocParseResult | boolean> {
    // process options
    try {
        app.options = optionsProcessor.process(options);
    } catch (e: any) {
        console.error(e.message);
        process.exit(1);
    }

    // Auto-enable/disable apiCAT plugin based on template
    if (app.options.template && app.options.template.includes('apidoc-template-v5')) {
        // Using v5 template: enable apiCAT
        if (!app.options.apicat) {
            app.options.apicat = {
                enabled: true,
                outputDir: app.options.dest,
                generateCollections: true,
                enableLocalTesting: true
            };
        } else {
            app.options.apicat.enabled = true;
        }
    } else if (app.options.template && app.options.template.includes('apidoc-template/')) {
        // Using legacy v4 template: disable apiCAT even if in config
        if (app.options.apicat) {
            app.options.apicat.enabled = false;
        }
    }

    // get the default logger
    app.log = defaults.getLogger(app.options);

    // if --warn-error was passed, treat warnings as error and exit with error code
    if (options.warnError) {
        app.log.warn = (msg: string) => {
            app.log.error(msg);
            process.exit(1);
        };
    }

    // get the markdown parser
    app.markdownParser = defaults.getMarkdownParser(app.options) || ({} as MarkdownParser);

    // make sure input is an array
    if (typeof app.options.src === 'string') {
        app.log.warn('Provided "src" option is not an array. Converting it to array.');
        app.options.src = [app.options.src];
    }

    try {
        // generator information
        core.setGeneratorInfos({
            name: pkgJson.name,
            time: new Date().toString(),
            url: pkgJson.homepage || '',
            version: pkgJson.version,
        });
        core.setLogger(app.log);
        core.setMarkdownParser(app.markdownParser);

        const reader = new Reader(app);
        const packageInfo = reader.read();
        core.setPackageInfos(packageInfo);

        // Transfer apicat configuration from packageInfo to options if present
        if (packageInfo.apicat && !app.options.apicat) {
            app.log.verbose('Loading apicat configuration from apidoc.json');
            app.options.apicat = packageInfo.apicat;
        }

        // ⚠️ IMPORTANT: Respect "input" or "inputs" field from apidoc.json
        // If "inputs" is defined (new format), it allows multiple categorized sources
        // If "input" is defined (legacy format), it restricts to specified subdirectories
        // This prevents parsing ALL files in the repository

        // Get the directory where apidoc.json is located (not the src directory)
        const configPath = app.options.config || path.join(app.options.src[0], 'apidoc.json');
        const apidocJsonDir = path.dirname(configPath);
        let inputDirectories: string[] = [];

        // Store category mapping: directory -> category
        const categoryMap: Map<string, string> = new Map();

        // NEW FORMAT: inputs object with categorized sources
        // Example: { docs: ['/md'], tsdoc: ['../core'], api: ['.'], model: ['../model/sq/'] }
        if (packageInfo.inputs && typeof packageInfo.inputs === 'object') {
            app.log.info('📁 Using categorized "inputs" configuration from apidoc.json');

            // Create resolvedInputs to store absolute paths for each category
            const resolvedInputs: Record<string, string[]> = {};

            for (const [category, paths] of Object.entries(packageInfo.inputs)) {
                if (Array.isArray(paths)) {
                    const resolvedPaths = paths.map((subdir: string) => {
                        const resolvedPath = path.resolve(apidocJsonDir, subdir);
                        app.log.verbose(`  [${category}] ${resolvedPath}`);

                        // Store category for this directory
                        categoryMap.set(resolvedPath, category);

                        return resolvedPath;
                    });
                    inputDirectories.push(...resolvedPaths);
                    resolvedInputs[category] = resolvedPaths;
                    app.log.info(`  ✓ ${category}: ${paths.join(', ')}`);
                }
            }

            // Store resolved inputs in packageInfo for use in plugins
            packageInfo.resolvedInputs = resolvedInputs;

            if (inputDirectories.length > 0) {
                app.options.src = inputDirectories;
                // Store category mapping in options for parser filtering
                app.options.categoryMap = categoryMap;

                // Process 'docs' category directories for markdown files
                const docsDirs = Array.from(categoryMap.entries())
                    .filter(([_, category]) => category === 'docs')
                    .map(([dir, _]) => dir);

                if (docsDirs.length > 0) {
                    app.log.info(`📚 Processing markdown files from 'docs' category...`);
                    const fs = require('fs-extra');
                    const glob = require('glob');
                    const MarkdownIt = require('markdown-it');
                    const md = new MarkdownIt({html: true, linkify: true, typographer: true});

                    /**
                     * Transform markdown links to internal documentation references
                     * Converts: [text](./path/file.md) -> [text](#/docs/file)
                     * Converts: [text](../README.md) -> [text](#/docs/README)
                     */
                    function transformMarkdownLinks(content: string): string {
                        // Replace markdown links to .md files with internal doc links
                        return content.replace(/\[([^\]]+)\]\(([^)]+\.md)\)/g, (match, text, url) => {
                            // Extract filename without extension
                            const filename = path.basename(url, '.md');
                            // Remove any leading ./ or ../
                            const cleanFilename = filename.replace(/^(\.\.\/|\.\/)+/, '');
                            // Create internal link to docs section
                            return `[${text}](#/docs/${cleanFilename})`;
                        });
                    }

                    // Initialize documentation array if not exists
                    if (!packageInfo.documentation || !Array.isArray(packageInfo.documentation)) {
                        packageInfo.documentation = [] as any;
                    }

                    docsDirs.forEach((docsDir) => {
                        try {
                            const files = glob.sync('**/*.{md,markdown}', { cwd: docsDir, absolute: true });
                            app.log.verbose(`  Found ${files.length} markdown files in ${path.basename(docsDir)}`);

                            files.forEach((filePath: string) => {
                                try {
                                    let content = fs.readFileSync(filePath, 'utf8');
                                    const filename = path.basename(filePath, path.extname(filePath));

                                    // Transform markdown links before rendering
                                    content = transformMarkdownLinks(content);

                                    // Extract title from filename or first H1
                                    let title = filename
                                        .replace(/-/g, ' ')
                                        .replace(/_/g, ' ')
                                        .replace(/\b\w/g, (l: string) => l.toUpperCase());

                                    const h1Match = content.match(/^#\s+(.+)$/m);
                                    if (h1Match) {
                                        title = h1Match[1];
                                    }

                                    (packageInfo.documentation as any).push({
                                        filename: filename,
                                        title: title,
                                        content: md.render(content),
                                        icon: 'fa-file-text'
                                    });

                                    app.log.verbose(`    ✓ Processed: ${filename}`);
                                } catch (e: any) {
                                    app.log.warn(`    ✗ Failed to read: ${filePath} - ${e.message}`);
                                }
                            });
                        } catch (e: any) {
                            app.log.warn(`  Error processing docs directory ${docsDir}: ${e.message}`);
                        }
                    });

                    app.log.info(`  ✓ Processed ${packageInfo.documentation.length} documentation files`);
                }
            }
        }
        // LEGACY FORMAT: input array (backwards compatibility)
        else if (packageInfo.input && Array.isArray(packageInfo.input) && packageInfo.input.length > 0) {
            app.log.info('📁 Using legacy "input" configuration from apidoc.json');

            app.options.src = packageInfo.input.map((subdir: string) => {
                const resolvedPath = path.resolve(apidocJsonDir, subdir);
                app.log.verbose(`Using input directory from apidoc.json: ${resolvedPath}`);
                return resolvedPath;
            });

            app.log.info(`  ✓ Directories: ${packageInfo.input.join(', ')}`);
        }

        // this is holding our results from parsing the source code
        const api = core.parse(app.options);

        if (api === true) {
            app.log.info('Nothing to do.');
            return true;
        }

        if (api === false) {
            app.log.error('Error during source code parsing!');
            return false;
        }

        // Check if apiCAT is enabled - use different output generation
        if (app.options.apicat?.enabled) {
            app.log.verbose('🐱 apiCAT: Plugin is enabled, using Vue 3 template system...');
            try {
                // Pass sourceDir and dest to plugin for markdown file resolution and output
                const apiCatConfig = {
                    ...app.options.apicat,
                    sourceDir: Array.isArray(app.options.src) ? app.options.src[0] : app.options.src,
                    dest: app.options.dest,
                    verbose: app.options.verbose
                };
                const apiCatPlugin = new ApiCatPlugin(apiCatConfig);
                const parsedData = JSON.parse(api.data);
                const projectData = JSON.parse(api.project);

                app.log.verbose(`🐱 apiCAT: Processing ${parsedData.length} API endpoints...`);
                await apiCatPlugin.process(parsedData, projectData);

                app.log.verbose('🐱 apiCAT: Processing completed');

                // Apply JSON encryption after apiCAT processing if authentication is active
                if (projectData.login?.active) {
                    app.log.info('🔐 Encrypting apiCAT JSON files...');
                    try {
                        const encryption = createEncryption(projectData.login);
                        if (encryption) {
                            encryptDirectoryJSON(app.options.dest, encryption);
                            app.log.info('✅ apiCAT JSON encryption completed');
                        }
                    } catch (error) {
                        app.log.error(`❌ apiCAT JSON encryption failed: ${error}`);
                    }
                }
            } catch (error) {
                app.log.warn(`⚠️ apiCAT: Plugin error: ${error.message}`);
                app.log.debug(`⚠️ apiCAT: Stack trace: ${error.stack}`);
            }
        } else {
            // Use traditional template system (writer.ts)
            app.log.verbose('Using traditional template system...');
            const writer = new Writer(api, app);
            await writer.write();
        }

        app.log.verbose('All done :)');

        // Parse the JSON strings back to objects for proper typing
        const parsedData = JSON.parse(api.data);
        const parsedProject = JSON.parse(api.project);

        return {
            data: parsedData,
            project: parsedProject,
        };
    } catch (e: any) {
        app.log.error(e.message);
        if (e.stack) {
            app.log.debug(e.stack);
        }
        return false;
    }
}

export { createDoc };

// For CommonJS compatibility
module.exports = {
    createDoc,
};
