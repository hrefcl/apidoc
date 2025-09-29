/**
 * @file Configuration Options Processing for APIDoc 4.0
 *
 * Handles configuration option processing, validation, and normalization.
 * Merges user-provided options with defaults, validates paths, and processes
 * configuration files to create a complete configuration object for the
 * documentation generation process.
 *
 * Features:
 * - Default configuration values
 * - Configuration file processing (apidoc.json)
 * - Path normalization and validation
 * - Option merging and inheritance
 * - Type-safe configuration handling
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */
import * as fs from 'fs';
import { defaults } from 'lodash';
import * as path from 'path';
import { ApiDocOptions } from '../types';

const DEFAULT_DEST = 'doc';
const DEFAULT_SRC = ['./src'];
const DEFAULT_TEMPLATE = 'template';

interface ConfigFile extends Partial<ApiDocOptions> {
    output?: string;
    input?: string[];
}

const defaultOptions: ApiDocOptions = {
    src: DEFAULT_SRC,
    dest: path.resolve(path.join(__dirname, '..', DEFAULT_DEST)) + path.sep,
    template: path.resolve(path.join(__dirname, '..', DEFAULT_TEMPLATE)) + path.sep,
    debug: false,
    silent: false,
    verbose: false,
    dryRun: false,
    colorize: true,
    markdown: true,
    config: '',
    apiprivate: false,
    encoding: 'utf8',
};

/**
 * Process options by merging with defaults, validating configuration paths,
 * and normalizing settings such as destinations, source paths, and line endings.
 *
 * @param options - User provided options
 * @param options.config - Path to the configuration file
 * @param options.src - Array of source paths to process. May be overridden by the configuration file settings.
 * @param options.dest - Output directory path
 * @param options.template - Template directory path
 * @param options.lineEnding - Line-ending format ('CRLF', 'CR', or 'LF')
 * @returns Normalized options object
 * @throws If the provided configuration file path is a directory instead of a file.
 */
function process(options: Partial<ApiDocOptions>): ApiDocOptions {
    // merge given options with defaults
    const mergedOptions = defaults({}, options, defaultOptions) as ApiDocOptions;

    // if a config file is given, read it to figure out input and output
    if (mergedOptions.config) {
        const configPath = path.resolve(mergedOptions.config);

        // Check if config file exists
        if (!fs.existsSync(configPath)) {
            // If config is the default 'apidoc.json' and doesn't exist, silently skip
            if (mergedOptions.config === 'apidoc.json') {
                // Continue without config file
            } else {
                throw new Error(`[error] Configuration file not found: ${configPath}`);
            }
        } else {
            // make sure that we are provided a config file, not a directory
            if (fs.statSync(configPath).isDirectory()) {
                throw new Error('[error] Invalid option: --config/-c must be a path to a file. Directory provided.');
            }

            const apidocConfig: ConfigFile = require(configPath);

            // if dest is present in config file, set it in options, but only if it's the default value, as cli options should override config file options
            if (apidocConfig.output && mergedOptions.dest === defaultOptions.dest) {
                // keep a trailing slash
                mergedOptions.dest = path.resolve(path.join(apidocConfig.output, path.sep));
            }

            // do the same for input
            if (
                apidocConfig.input instanceof Array &&
                Array.isArray(mergedOptions.src) &&
                mergedOptions.src[0] === DEFAULT_SRC[0]
            ) {
                // keep a trailing slash
                const input = apidocConfig.input.map((p) => path.resolve(p) + path.sep);
                mergedOptions.src = input;
            }

            // Merge additional configuration properties from config file
            // CLI options take precedence over config file options
            Object.keys(apidocConfig).forEach(key => {
                if (key !== 'output' && key !== 'input' && apidocConfig[key] !== undefined) {
                    // Only use config file value if the option is not explicitly set from CLI
                    if (mergedOptions[key] === undefined || mergedOptions[key] === defaultOptions[key]) {
                        mergedOptions[key] = apidocConfig[key];
                    }
                }
            });
        }
    }

    // add a trailing slash to output destination because it's always a folder
    mergedOptions.dest = path.join(mergedOptions.dest, path.sep);
    if (mergedOptions.template) {
        mergedOptions.template = path.join(mergedOptions.template, path.sep);
    }

    // Line-Ending option
    if (mergedOptions.lineEnding) {
        if (mergedOptions.lineEnding === 'CRLF') {
            // win32
            mergedOptions.lineEnding = '\r\n';
        } else if (mergedOptions.lineEnding === 'CR') {
            // darwin
            mergedOptions.lineEnding = '\r';
        } else {
            // linux
            mergedOptions.lineEnding = '\n';
        }
    }

    return mergedOptions;
}

export { defaultOptions, process };

// For CommonJS compatibility
module.exports = {
    process,
    defaultOptions,
};
