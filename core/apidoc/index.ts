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

        // ⚠️ IMPORTANT: Respect "input" field from apidoc.json
        // If "input" is defined in apidoc.json AND CLI didn't override it,
        // it restricts which subdirectories to process relative to apidoc.json location
        // This prevents parsing ALL files in the repository
        if (packageInfo.input && Array.isArray(packageInfo.input) && packageInfo.input.length > 0) {
            // packageInfo.input is relative to the apidoc.json file location
            // We need to resolve it relative to where apidoc.json is located
            const apidocJsonDir = Array.isArray(app.options.src) ? app.options.src[0] : app.options.src;

            app.options.src = packageInfo.input.map((subdir: string) => {
                // Resolve the input path relative to apidoc.json location
                const resolvedPath = path.resolve(apidocJsonDir, subdir);
                app.log.verbose(`Using input directory from apidoc.json: ${resolvedPath}`);
                return resolvedPath;
            });

            app.log.info(`📁 Restricting to "input" directories from apidoc.json: ${packageInfo.input.join(', ')}`);
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
                    dest: app.options.dest
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
