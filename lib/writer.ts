/**
 * @file Output writer and asset bundler for APIDoc
 *
 * Handles the generation of HTML documentation files, bundling of assets,
 * and management of output directory structure.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 */

import esbuild from 'esbuild';
import fs from 'fs-extra';
import path from 'path';
import { convertToOpenApi } from './exporters/openapi-converter';
const AuthProcessor = require('./core/auth-processor');

/**
 * Documentation output writer and asset bundler
 *
 * The Writer class is responsible for:
 * - Generating HTML documentation files from parsed API data
 * - Bundling JavaScript and CSS assets using esbuild
 * - Managing output directory structure and file copying
 * - Handling template processing and content generation
 * - Cache busting for static assets
 *
 * @example Basic usage
 * ```typescript
 * const writer = new Writer(apiData, appContext);
 * await writer.write();
 * console.log('Documentation generated successfully');
 * ```
 *
 * @example Custom cache busting
 * ```typescript
 * const writer = new Writer(apiData, appContext, 'v=1.2.0');
 * await writer.write();
 * ```
 *
 * @since 4.0.0
 * @public
 */
class Writer {
    public api: any;
    public log: any;
    public opt: any;
    public cacheBustingQueryParam: string;
    public fs: typeof fs;
    public path: typeof path;
    private authProcessor: any;
    /**
     * Creates a new Writer instance for generating documentation output
     *
     * @param api - Parsed API data and project information from the core parser
     * @param api.data - JSON string containing the parsed API endpoints and documentation
     * @param api.project - JSON string containing project metadata (name, version, etc.)
     * @param app - Application context containing shared instances and configuration
     * @param app.log - Logger instance for output and debugging
     * @param app.options - Application options including source paths, destination, etc.
     * @param cacheBustingQueryParam - Cache-busting query parameter for static assets.
     *   Defaults to current timestamp to ensure fresh assets on each build.
     *
     * @example
     * ```typescript
     * const writer = new Writer(
     *   { data: '[]', project: '{}' },
     *   { log: logger, options: { dest: './docs' } }
     * );
     * ```
     *
     * @example With custom cache busting
     * ```typescript
     * const writer = new Writer(apiData, appContext, 'v=2.1.0');
     * ```
     */
    constructor(api: any, app: any, cacheBustingQueryParam = `v=${Date.now()}`) {
        this.api = api;
        this.log = app.log;
        this.opt = app.options;
        this.cacheBustingQueryParam = String(cacheBustingQueryParam);
        this.fs = fs;
        this.path = path;

        // Initialize authentication processor
        this.authProcessor = new AuthProcessor();
        this.initializeAuthentication();
    }

    /**
     * Initialize authentication system if login configuration is present
     */
    private initializeAuthentication(): void {
        try {
            // Parse project data to look for login configuration
            const projectInfo = JSON.parse(this.api.project);

            if (projectInfo.login) {
                this.log.info('🔐 Initializing authentication system...');

                // Validate configuration
                const validation = AuthProcessor.validateConfig(projectInfo.login);
                if (!validation.valid) {
                    this.log.error('Authentication configuration errors:');
                    validation.errors.forEach((error) => this.log.error(`  - ${error}`));
                    return;
                }

                // Initialize auth processor
                this.authProcessor.init(projectInfo.login);

                const stats = this.authProcessor.getStats();
                this.log.info(`✅ Authentication configured:`, stats);
            }
        } catch (error) {
            this.log.warn('Could not initialize authentication:', error.message);
        }
    }

    /**
     * Write output files based on configuration.
     *
     * If dry run mode is enabled, no files are created, and the method simply logs the operation and
     * resolves the promise. Otherwise, it creates the necessary files either as a single file or
     * multiple output files based on the specified options.
     *
     * @returns {Promise<void>} Promise that resolves when file writing is complete.
     * @memberof Writer
     */
    write() {
        if (this.opt.dryRun) {
            this.log.info('Dry run mode enabled: no files created.');
            return new Promise((resolve) => {
                return resolve(undefined);
            });
        }

        this.log.verbose('Writing files...');
        if (this.opt.single) {
            return this.createSingleFile();
        }
        return this.createOutputFiles();
    }

    /**
     * Attempt to locate the specified asset file path and retrieve its resolved path.
     * If the file cannot be resolved, an error is logged.
     *
     * @param {string} assetPath - Relative file path of the asset to find.
     * @returns {string|undefined} Return the resolved file path
     * @memberof Writer
     */
    findAsset(assetPath) {
        try {
            const path = require.resolve(assetPath);
            return path;
        } catch {
            this.log.error('Could not find where dependencies of apidoc live!');
        }
    }

    /**
     * Generate OpenAPI 3.0 specification file (swagger.json)
     *
     * @memberof Writer
     */
    writeOpenApiSpec(): void {
        try {
            this.log.verbose('🔄 Generating OpenAPI 3.0 specification...');

            // Parse API data
            const apiData = JSON.parse(this.api.data);
            const projectData = JSON.parse(this.api.project);

            // Convert to OpenAPI
            const openApiSpec = convertToOpenApi(apiData, projectData);

            // Write swagger.json file
            const swaggerPath = this.path.join(this.opt.dest, 'swagger.json');
            this.fs.writeFileSync(swaggerPath, JSON.stringify(openApiSpec, null, 2));

            this.log.verbose(`✅ OpenAPI specification generated: ${swaggerPath}`);

            // Also create openapi.json for compatibility
            const openApiPath = this.path.join(this.opt.dest, 'openapi.json');
            this.fs.writeFileSync(openApiPath, JSON.stringify(openApiSpec, null, 2));

            this.log.verbose(`✅ OpenAPI specification generated: ${openApiPath}`);
        } catch (error) {
            this.log.error(`❌ Failed to generate OpenAPI specification: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create output files in the destination directory
     *
     * Performs the following tasks:
     * - Creates the destination directory where the output files will be generated.
     * - Copies a template `index.html` file into the destination directory.
     * - Creates an `assets` folder within the destination directory.
     * - Optionally saves a parsed API file as `api-data.json` into the assets folder if the `writeJson` option is enabled.
     * - Generates OpenAPI specification if requested
     * - Executes a bundler operation for the assets folder.
     *
     * @returns {Promise<string>} Resolves as the bundling operation assets folder.
     * @memberof Writer
     */
    createOutputFiles() {
        this.createDir(this.opt.dest);

        // Generate OpenAPI specification if requested
        if (this.opt.openapi || this.opt.openapiOnly) {
            this.writeOpenApiSpec();
        }

        // If openapi-only mode, skip HTML generation
        if (this.opt.openapiOnly) {
            this.log.verbose('🎉 OpenAPI-only mode: Skipping HTML generation');
            return Promise.resolve(this.opt.dest);
        }

        // create index.html
        this.log.verbose('Copying template index.html to: ' + this.opt.dest);
        this.fs.writeFileSync(this.path.join(this.opt.dest, 'index.html'), this.getIndexContent());

        // Check if StencilJS template exists and copy StencilJS dist files
        const stencilTemplate = this.path.join(this.opt.template, 'index-stencil.html');
        if (this.fs.existsSync(stencilTemplate)) {
            const stencilDistPath = this.path.join(this.opt.template, 'dist');
            if (this.fs.existsSync(stencilDistPath)) {
                const destDistPath = this.path.join(this.opt.dest, 'dist');
                this.log.verbose('Copying StencilJS components to: ' + destDistPath);
                this.fs.copySync(stencilDistPath, destDistPath);
            }
        }

        // create assets folder
        const assetsPath = this.path.resolve(this.path.join(this.opt.dest, 'assets'));
        this.createDir(assetsPath);

        // copy Font Awesome CSS file
        const fontAwesomeSource = this.path.join(this.opt.template, 'src', 'css', 'font-awesome-all.min.css');
        const fontAwesomeDest = this.path.join(assetsPath, 'font-awesome-all.min.css');
        if (this.fs.existsSync(fontAwesomeSource)) {
            this.log.verbose('Copying Font Awesome CSS to: ' + fontAwesomeDest);
            this.fs.copyFileSync(fontAwesomeSource, fontAwesomeDest);
        } else {
            this.log.warn('Font Awesome CSS file not found at: ' + fontAwesomeSource);
        }

        // copy Font Awesome webfonts folder
        const webfontsSource = this.path.join(this.opt.template, 'src', 'webfonts');
        const webfontsDest = this.path.join(this.opt.dest, 'webfonts');
        if (this.fs.existsSync(webfontsSource)) {
            this.log.verbose('Copying Font Awesome webfonts to: ' + webfontsDest);
            this.fs.copySync(webfontsSource, webfontsDest);
        } else {
            this.log.warn('Font Awesome webfonts folder not found at: ' + webfontsSource);
        }

        // save the parsed api file
        if (this.opt.writeJson) {
            const jsonFile = this.path.join(assetsPath, 'api-data.json');
            this.log.verbose('Saving parsed API to: ' + jsonFile);
            this.fs.writeFileSync(jsonFile, this.api.data);
        }

        // Always run bundler to generate CSS and JS assets
        // StencilJS components are additional, not replacement for core functionality
        return this.runBundler(this.path.resolve(assetsPath));
    }

    /**
     * Run the bundler to create a bundled JS file using esbuild.
     *
     * @param {string} outputPath - Path where the bundler will output
     * @returns {Promise<string>} Resolves with the output path upon successful bundling,
     *     or rejects with an error if the bundling process fails.
     * @memberof Writer
     */
    runBundler(outputPath) {
        this.log.verbose('Running bundler');

        return new Promise((resolve, reject) => {
            // Data is now injected directly into HTML via getIndexContent()
            // No need for temporary file

            // run esbuild to create the bundle file in assets
            const entryPoint = this.path.resolve(this.path.join(this.opt.template, 'src', 'main.js'));
            const outfile = this.path.join(outputPath, 'main.bundle.js');

            this.log.debug(`output file: ${outfile}`);
            this.log.debug(`API data length: ${JSON.stringify(this.api.data).length}`);
            this.log.debug(`API project length: ${JSON.stringify(this.api.project).length}`);

            // Load esbuild config
            const esbuildConfig = require(this.path.resolve(this.path.join(this.opt.template, 'src', 'esbuild.config.js')));

            const buildOptions = {
                ...esbuildConfig,
                entryPoints: [entryPoint],
                outfile: outfile,
                minify: !this.opt.debug,
                sourcemap: this.opt.debug ? 'inline' : false,
                logLevel: this.opt.debug ? 'debug' : 'info',
            };

            esbuild
                .build(buildOptions)
                .then(() => {
                    this.log.debug('Generated bundle successfully');

                    // Data is now injected directly into HTML, no temp file needed

                    return resolve(outputPath);
                })
                .catch((err) => {
                    this.log.error('Bundle failure:', err);
                    return reject(err);
                });
        });
    }

    /**
     * Read image files from a directory, then convert them to Base64 strings and map them to tokens.
     * - The tokens are used as keys to represent the Base64-encoded strings of the images.
     * - Images are sourced from the "img" subdirectory of the specified template path.
     * - Only valid files within the directory are processed. And the MIME type is determined based on the file extension.
     *
     * @returns {object} A mapping of token keys to Base64-encoded image strings, where each
     *     key is in the format "IMAGE_LINK_TOKEN_<filename>".
     * @memberof Writer
     */
    getBase64HeaderImages() {
        const imageTokens = {};
        const imgDir = this.path.join(this.opt.template, 'img');

        if (this.fs.existsSync(imgDir)) {
            this.fs.readdirSync(imgDir).forEach((file) => {
                const filePath = this.path.join(imgDir, file);
                if (this.fs.statSync(filePath).isFile()) {
                    // Read the file and convert to base64
                    const fileData = this.fs.readFileSync(filePath);
                    const fileExt = this.path.extname(file).substring(1);
                    const mimeType = fileExt === 'ico' ? 'image/x-icon' : `image/${fileExt}`;

                    // Store the base64 data with the token key
                    imageTokens[`IMAGE_LINK_TOKEN_${file}`] = `data:${mimeType};base64,${fileData.toString('base64')}`;
                }
            });
        }

        return imageTokens;
    }

    /**
     * Generate and return the content of the `index.html` file for the API documentation.
     *
     * Replaces predefined tokens with dynamic values such as the project title, description,
     * and cache-busting query parameters.
     *
     * @returns {string} Processed HTML content for the index page of the API documentation.
     * @memberof Writer
     */
    getIndexContent() {
        const projectInfo = JSON.parse(this.api.project);
        const title = projectInfo.title || projectInfo.name || 'Loading...';
        const description = projectInfo.description || projectInfo.name || 'API Documentation';

        // Check for StencilJS template first, fallback to regular template
        const stencilTemplate = this.path.join(this.opt.template, 'index-stencil.html');
        const templateFile = this.fs.existsSync(stencilTemplate) ? stencilTemplate : this.path.join(this.opt.template, 'index.html');

        let indexHtml = this.fs.readFileSync(templateFile, 'utf8').toString();

        // Process authentication if enabled
        if (this.authProcessor && this.authProcessor.isAuthEnabled) {
            this.log.verbose('🔒 Processing authentication for template...');
            indexHtml = this.authProcessor.processTemplate(indexHtml, projectInfo);
        }

        // Replace image tokens with base64 data
        const imageTokens = this.getBase64HeaderImages();
        Object.keys(imageTokens).forEach((token) => {
            indexHtml = indexHtml.replace(token, imageTokens[token]);
        });

        // Inject API data as global variables
        const apiDataJson = JSON.stringify(this.api.data, null, 0);
        const apiProjectJson = JSON.stringify(this.api.project, null, 0);

        // Check if this is a StencilJS template
        const isStencilTemplate = templateFile.includes('index-stencil.html');

        if (isStencilTemplate) {
            // For StencilJS template, inject both apiDocData and original format
            const dataScript = `<script>
      window.apiDocData = ${apiDataJson};
      window.API_DATA = ${apiDataJson};
      window.API_PROJECT = ${apiProjectJson};
    </script>`;

            // Insert data script before the bundle script - match actual cache-busted filename
            const scriptReplaced = indexHtml.replace(/<script src="assets\/main\.bundle\.js[^"]*"><\/script>/, dataScript + '\n  $&');

            if (scriptReplaced === indexHtml) {
                // Fallback: insert before closing body tag if script tag not found
                indexHtml = indexHtml.replace(/<\/body>/, dataScript + '\n</body>');
            } else {
                indexHtml = scriptReplaced;
            }
        } else {
            // For regular template, use original method
            const dataScript = `<script>
      window.API_DATA = ${apiDataJson};
      window.API_PROJECT = ${apiProjectJson};
    </script>`;

            // Insert data script before the bundle script - match actual cache-busted filename
            const scriptReplaced = indexHtml.replace(/<script src="assets\/main\.bundle\.js[^"]*"><\/script>/, dataScript + '\n    $&');

            if (scriptReplaced === indexHtml) {
                // Fallback: insert before closing body tag if script tag not found
                indexHtml = indexHtml.replace(/<\/body>/, dataScript + '\n</body>');
            } else {
                indexHtml = scriptReplaced;
            }
        }

        // Replace other tokens
        return indexHtml
            .replace(/__API_NAME__/g, title)
            .replace(/__API_DESCRIPTION__/g, description)
            .replace(/__API_VERSION__/g, projectInfo.version || '1.0.0')
            .replace(/__API_CACHE_BUSTING_QUERY_PARAM__/g, this.cacheBustingQueryParam);
    }

    /**
     * Create a self-contained single HTML file by bundling CSS and JS into the file
     * - modify the main index HTML content to embed CSS, JS directly
     * - remove external links to assets
     * - save the final file to the destination directory
     *
     * @returns {Promise<void>} A promise that resolves once the single HTML file is successfully created.
     * @memberof Writer
     */
    createSingleFile() {
        // dest is a file path, so get the folder with dirname
        this.createDir(this.path.dirname(this.opt.dest));

        const tmpPath = '/tmp/apidoc-tmp';
        this.createDir(tmpPath);

        return this.runBundler(tmpPath).then((outputPath: string) => {
            const mainBundleCss = this.fs.readFileSync(this.path.join(outputPath, 'main.bundle.css'), 'utf8');
            const mainBundle = this.fs.readFileSync(this.path.join(outputPath, 'main.bundle.js'), 'utf8');

            // modify index html for single page use
            const indexContent = this.getIndexContent()
                // replace image and css assets
                .replace(/<link href="assets\/main[^>]*>/g, `<style>${mainBundleCss}</style>`)
                // replace js assets
                .replace(/<script src="assets[^>]*><\/script>/, '');

            // concatenate all the content (html + javascript bundle with bundled CSS)
            const finalContent = `${indexContent}
      <script>${mainBundle}</script>`;

            // create a target file
            const finalPath = this.path.join(this.opt.dest, 'index.html');
            // make sure the destination exists
            this.createDir(this.opt.dest);
            this.log.verbose(`Generating self-contained single file: ${finalPath}`);
            this.fs.writeFileSync(finalPath, finalContent);
        });
    }

    /**
     * Write a JSON file with the provided data.
     *
     * @param {string} dest - Destination file path where the file will be written.
     * @param {string} data - File data
     * @memberof Writer
     */
    writeJsonFile(dest, data) {
        this.log.verbose(`Writing json file: ${dest}`);
        this.fs.writeFileSync(dest, data + '\n');
    }

    /**
     * Write a JS file with the provided data.
     *
     * @param {string} dest - Destination file path where the file will be written.
     * @param {string} data - File data
     * @memberof Writer
     */
    writeJSFile(dest, data) {
        this.log.verbose(`Writing js file: ${dest}`);
        switch (this.opt.mode) {
            case 'amd':
            case 'es':
                this.fs.writeFileSync(dest, 'export default ' + data + ';\n');
                break;
            case 'commonJS':
                this.fs.writeFileSync(dest, 'module.exports = ' + data + ';\n');
                break;
            default:
                this.fs.writeFileSync(dest, 'define(' + data + ');' + '\n');
        }
    }

    /**
     * Create a directory
     *
     * @param {string} dir - Path of the directory to create
     * @memberof Writer
     */
    createDir(dir) {
        if (!this.fs.existsSync(dir)) {
            this.log.verbose('Creating dir: ' + dir);
            this.fs.mkdirsSync(dir);
        }
    }
}

export default Writer;
