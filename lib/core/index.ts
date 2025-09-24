/*
 * apidocts
 * https://apidocts.com
 * https://apidoc.app
 * Href Spa API Doc (TypeScript version)
 *
 * Author: Href Spa <hola@apidoc.app>
 * Copyright (c) 2025 Href SpA
 * Licensed under the MIT license.
 *
 * This project is a TypeScript refactor inspired by the original apidoc project.
 */

import _ from 'lodash';
import os from 'os';
import path from 'path';
import semver from 'semver';

import Filter from './filter';
import Parser from './parser';
import Worker from './worker';

import PluginLoader from './plugin_loader';

import { FileError } from './errors/file_error';
import { ParserError } from './errors/parser_error';
import { WorkerError } from './errors/worker_error';

// const
const SPECIFICATION_VERSION = '4.0.0';

const defaults = {
    excludeFilters: [],
    includeFilters: [
        '.*\\.(clj|cls|coffee|cpp|cs|dart|erl|exs?|go|groovy|ino?|java|js|jsx|litcoffee|lua|p|php?|pl|pm|py|rb|scala|ts|vue)$',
    ],

    src: path.join(__dirname, '../../example/'),

    filters: {},
    languages: {},
    parsers: {},
    workers: {},

    lineEnding: os.EOL,
    encoding: 'utf8',
};

// Simple logger interface
const logger = {
    debug: function (...args: any[]) {
        console.log(...args);
    },
    verbose: function (...args: any[]) {
        console.log(...args);
    },
    info: function (...args: any[]) {
        console.log(...args);
    },
    warn: function (...args: any[]) {
        console.log(...args);
    },
    error: function (...args: any[]) {
        console.log(...args);
    },
};

const app = {
    options: {} as any, // see defaults
    log: logger,
    generator: {} as any,
    packageInfos: {} as any,
    markdownParser: false,
    filters: {
        apierror: './filters/api_error.js',
        apiheader: './filters/api_header.js',
        apiparam: './filters/api_param.js',
        apisuccess: './filters/api_success.js',
    },
    languages: {
        '.clj': './languages/clj.js',
        '.coffee': './languages/coffee.js',
        '.erl': './languages/erl.js',
        '.ex': './languages/ex.js',
        '.exs': './languages/ex.js',
        '.litcoffee': './languages/coffee.js',
        '.lua': './languages/lua.js',
        '.pl': './languages/pm.js',
        '.pm': './languages/pm.js',
        '.py': './languages/py.js',
        '.rb': './languages/rb.js',
        default: './languages/default.js',
    },
    parsers: {
        api: './parsers/api.js',
        apibody: './parsers/api_body.js',
        apiquery: './parsers/api_query.js',
        apidefine: './parsers/api_define.js',
        apidescription: './parsers/api_description.js',
        apierror: './parsers/api_error.js',
        apierrorexample: './parsers/api_error_example.js',
        apiexample: './parsers/api_example.js',
        apiheader: './parsers/api_header.js',
        apiheaderexample: './parsers/api_header_example.js',
        apigroup: './parsers/api_group.js',
        apiname: './parsers/api_name.js',
        apiparam: './parsers/api_param.js',
        apiparamexample: './parsers/api_param_example.js',
        apipermission: './parsers/api_permission.js',
        apisuccess: './parsers/api_success.js',
        apisuccessexample: './parsers/api_success_example.js',
        apiuse: './parsers/api_use.js',
        apiversion: './parsers/api_version.js',
        apisamplerequest: './parsers/api_sample_request.js',
        apideprecated: './parsers/api_deprecated.js',
        apiprivate: './parsers/api_private.js',
        apischema: './parsers/api_schema.js',
        openapi: './parsers/openapi.js',
        'openapi-path': './parsers/openapi_path.js',
        'openapi-schema': './parsers/openapi_schema.js',
        'openapi-operation': './parsers/openapi_operation.js',
    },
    workers: {
        // Temporarily disabled while migrating workers to TypeScript
        // apierrorstructure: './workers/api_error_structure.js',
        // apierrortitle: './workers/api_error_title.js',
        // apigroup: './workers/api_group.js',
        // apiheaderstructure: './workers/api_header_structure.js',
        // apiheadertitle: './workers/api_header_title.js',
        // apiname: './workers/api_name.js',
        // apiparamtitle: './workers/api_param_title.js',
        // apipermission: './workers/api_permission.js',
        apisamplerequest: './workers/api_sample_request.js',
        // apistructure: './workers/api_structure.js',
        // apisuccessstructure: './workers/api_success_structure.js',
        // apisuccesstitle: './workers/api_success_title.js',
        // apiuse: './workers/api_use.js'
    },
    hooks: {},
    addHook: addHook,
    hook: applyHook,
    parser: null as any,
    worker: null as any,
    filter: null as any,
};

const defaultGenerator = {
    name: 'apidoc',
    time: new Date().toString(),
    url: 'https://apidocts.com',
    version: '0.0.0',
};

// default apidoc.conf values
const defaultApidocConf = {
    description: 'API Documentation',
    name: '',
    sampleUrl: false,
    version: '0.0.0',
    defaultVersion: '0.0.0',
};

/**
 * Return the used version.
 *
 * @returns {string}
 */
function getSpecificationVersion() {
    return SPECIFICATION_VERSION;
}

/**
 * Parse options to process and generate API documentation.
 *
 * Handles parsing of source directories/files, processing of parsing results,
 * and generating output data (e.g., API data and project metadata).
 *
 * @param {object} options - Configuration options. Overwrite default options.
 * @returns {{data: string, project: string}|boolean} If successful, an object containing API data (`data`) and project information (`project`)
 *     is returned, otherwise returns `true` if no data is parsed, or `false` if an error occurs.
 */
function parse(options) {
    try {
        initApp(options);
        options = app.options;
        const parsedFiles = [];
        const parsedFilenames = [];
        // if input option for source is an array of folders,
        // parse each folder in the order provided.
        app.log.verbose('run parser');
        if (options.src instanceof Array) {
            options.src.forEach(function (folder) {
                // Keep same options for each folder, but ensure the 'src' of options
                // is the folder currently being processed.
                const folderOptions = options;
                folderOptions.src = path.join(folder, './');
                app.parser.parseFiles(folderOptions, parsedFiles, parsedFilenames);
            });
        } else {
            // if the input option for source is a single folder, parse as usual.
            options.src = path.join(options.src, './');
            app.parser.parseFiles(options, parsedFiles, parsedFilenames);
        }

        if (parsedFiles.length > 0) {
            // process transformations and assignments
            app.log.verbose('run worker');
            app.worker.process(parsedFiles, parsedFilenames, app.packageInfos);

            // cleanup
            app.log.verbose('run filter');
            const blocks = app.filter.process(parsedFiles, parsedFilenames);

            // sort by group ASC, name ASC, version DESC
            blocks.sort(function (a, b) {
                const nameA = a.group + a.name;
                const nameB = b.group + b.name;
                if (nameA === nameB) {
                    if (a.version === b.version) {
                        return 0;
                    }
                    return semver.gte(a.version, b.version) ? -1 : 1;
                }
                return nameA < nameB ? -1 : 1;
            });

            // add apiDoc specification version
            app.packageInfos.apidoc = SPECIFICATION_VERSION;

            // add apiDoc specification version
            app.packageInfos.generator = app.generator;

            // api_data
            let apiData = JSON.stringify(blocks, null, 2);
            apiData = apiData.replace(/(\r\n|\n|\r)/g, app.options.lineEnding);

            // api_project
            let apiProject = JSON.stringify(app.packageInfos, null, 2);
            apiProject = apiProject.replace(/(\r\n|\n|\r)/g, app.options.lineEnding);

            return {
                data: apiData,
                project: apiProject,
            };
        }
        return true;
    } catch (e) {
        // display error by instance
        let extra;
        let meta = {};
        if (e instanceof FileError) {
            meta = { Path: e.path };
            app.log.error(e.message, meta);
        } else if (e instanceof ParserError) {
            extra = e.extra;
            if (e.source) {
                extra.unshift({ Source: e.source });
            }
            if (e.element) {
                extra.unshift({ Element: '@' + e.element });
            }
            if (e.block) {
                extra.unshift({ Block: e.block });
            }
            if (e.file) {
                extra.unshift({ File: e.file });
            }

            extra.forEach(function (obj) {
                const key = Object.keys(obj)[0];
                meta[key] = obj[key];
            });

            app.log.error(e.message, meta);
        } else if (e instanceof WorkerError) {
            extra = e.extra;
            if (e.definition) {
                extra.push({ Definition: e.definition });
            }
            if (e.example) {
                extra.push({ Example: e.example });
            }
            extra.unshift({ Element: '@' + e.element });
            extra.unshift({ Block: e.block });
            extra.unshift({ File: e.file });

            extra.forEach(function (obj) {
                const key = Object.keys(obj)[0];
                meta[key] = obj[key];
            });

            app.log.error(e.message, meta);
        } else {
            app.log.error(e.message);
            if (e.stack) {
                app.log.debug(e.stack);
            }
        }
        return false;
    }
}

/**
 * Parse a source using application parser config.
 *
 * @param {string} source - Source to be parsed.
 * @param {object} options - Configuration options. Overwrite default options.
 * @returns {Array<object>|undefined|*} Parsed result from source, or `undefined` if an error occurs.
 */
function parseSource(source, options) {
    try {
        initApp(options);
        return app.parser.parseSource(source, app.options.encoding, app.options.filename);
    } catch (e) {
        app.log.error(e.message);
    }
}

/**
 * initApp
 *
 * @param {object} options - Overwrite default options.
 * @returns {void}
 */
function initApp(options) {
    options = _.defaults({}, options, defaults);
    // extend with custom functions
    app.filters = _.defaults({}, options.filters, app.filters);
    app.languages = _.defaults({}, options.languages, app.languages);
    app.parsers = _.defaults({}, options.parsers, app.parsers);
    app.workers = _.defaults({}, options.workers, app.workers);
    app.hooks = _.defaults({}, options.hooks, app.hooks);

    // options
    app.options = options;

    // generator
    app.generator = _.defaults({}, app.generator, defaultGenerator);

    // packageInfos
    app.packageInfos = _.defaults({}, app.packageInfos, defaultApidocConf);

    // Log version information
    const pkgJson = require(path.join(__dirname, '../../', 'package.json'));
    app.log.verbose('apidoc-generator name: ' + app.generator.name);
    app.log.verbose('apidoc-generator version: ' + app.generator.version);
    app.log.verbose('apidoc version: ' + pkgJson.version);
    app.log.verbose('apidoc-spec version: ' + getSpecificationVersion());

    new PluginLoader(app);
    const parser = new Parser(app);
    const worker = new Worker(app);
    const filter = new Filter(app);

    // Make them available for plugins
    app.parser = parser;
    app.worker = worker;
    app.filter = filter;
}

/**
 * Set generator information.
 *
 * @param {{name: string, time: string, version: string, url: string}} generator - The generator instance to be set.
 *     - `generator.name` {string}: Generator name (UI-Name)
 *     - `generator.time` {string}: Time for the generated doc
 *     - `generator.version` {string}: Version (semver) of the generator, e.g. 1.2.3
 *     - `generator.url` {string}: Url to the generator homepage
 */
function setGeneratorInfos(generator) {
    app.generator = generator;
}

/**
 * Set a logger
 *
 * @param {object} logger - Logger instance (@see https://github.com/winstonjs/winston for details)
 *     Interface:
 *     - debug(msg, meta)
 *     - verbose(msg, meta)
 *     - info(msg, meta)
 *     - warn(msg, meta)
 *     - error(msg, meta)
 */
function setLogger(logger) {
    app.log = logger;
}

/**
 * Set a markdown parser
 *
 * @param {object} [markdownParser] - Markdown parser instance
 */
function setMarkdownParser(markdownParser) {
    app.markdownParser = markdownParser;
}

/**
 * Set package infos.
 *
 * @param {object} [packageInfos]             - Collected from apidoc.json / package.json.
 * @param {string} [packageInfos.name]        - Project name.
 * @param {string} [packageInfos.version]     - Version (semver) of the project, e.g. 1.0.27
 * @param {string} [packageInfos.description] - A short description.
 * @param {string} [packageInfos.sampleUrl]   - @see https://apidocts.com/#param-api-sample-request
 */
function setPackageInfos(packageInfos) {
    app.packageInfos = packageInfos;
}

/**
 * Register a hook function.
 *
 * Add a new hook to the application hook list with the specified name, function, and priority.
 *
 * @param {string} name - Name of the hook. Hook overview: https://github.com/apidoc/apidoc/wiki/Hooks
 * @param {Function} func - Callback function when the hook is triggered.
 * @param {number} [priority] - Hook priority. Defaults to `100` if not provided. A lower value will be executed first. The "same value" will
 *     overwrite a previously defined hook.
 */
function addHook(name, func, priority) {
    priority = priority || 100;

    if (!app.hooks[name]) {
        app.hooks[name] = [];
    }

    app.log.debug('add hook: ' + name + ' [' + priority + ']');

    // Find position and overwrite same priority
    let replace = 0;
    let pos = 0;
    app.hooks[name].forEach(function (entry, index) {
        if (priority === entry.priority) {
            pos = index;
            replace = 1;
        } else if (priority > entry.priority) {
            pos = index + 1;
        }
    });

    app.hooks[name].splice(pos, replace, {
        func: func,
        priority: priority,
    });
}

/**
 * Execute registered hooks for the given hook name with the provided arguments.
 *
 * If no hooks are registered for the specified name, returns the first argument passed.
 *
 * @param {string} name - Name of the hook to execute.
 * @returns {*} The first argument provided, or the modified value after applying the hooks.
 */
function applyHook(name /* , ...args */) {
    if (!app.hooks[name]) {
        return Array.prototype.slice.call(arguments, 1, 2)[0];
    }

    const args = Array.prototype.slice.call(arguments, 1);
    app.hooks[name].forEach(function (hook) {
        hook.func.apply(this, args);
    });
    return args[0];
}

export {
    getSpecificationVersion,
    parse,
    parseSource,
    setGeneratorInfos,
    setLogger,
    setMarkdownParser,
    setPackageInfos,
};
