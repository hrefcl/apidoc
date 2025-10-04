/**
 * @file Core Parser Engine for APIDoc 4.0
 *
 * The main parsing engine that processes source code files to extract API documentation.
 * Handles file discovery, language detection, comment extraction, and API tag parsing.
 * This is the core component that powers the entire APIDoc documentation generation system.
 *
 * Features:
 * - Multi-language source code parsing (JavaScript, TypeScript, PHP, etc.)
 * - Recursive file search with include/exclude filtering
 * - Block-based API comment extraction
 * - Plugin-based parser architecture
 * - Error handling and validation
 * - Markdown processing support
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 4.0.0
 * @public
 */

const { isObject, get, set, extend } = require('lodash');
import fs from 'fs';
import iconv from 'iconv-lite';
import path from 'path';
import util from 'util';

import findFiles from './utils/find_files';

import { ParameterError } from './errors/parameter_error';
import { ParserError } from './errors/parser_error';
import { isParserEnabled } from './apidoc/category-parsers';

let app: any = {};
let filterTag = null; // define the tag to filter by

/**
 * Parser
 *
 * Manage and load languages, parsers, and related configurations.
 * @param _app - Application instance
 * @class
 */
function Parser(_app) {
    const self = this;

    // global variables
    app = _app;

    // class variables
    self.languages = {};
    self.parsers = {};
    self.parsedFileElements = [];
    self.parsedFiles = [];
    self.countDeprecated = {};

    // load languages
    const languages = Object.keys(app.languages);
    languages.forEach(function (language) {
        if (isObject(app.languages[language])) {
            app.log.debug('inject parser language: ' + language);
            self.addLanguage(language, app.languages[language]);
        } else {
            const filename = app.languages[language];
            app.log.debug('load parser language: ' + language + ', ' + filename);
            self.addLanguage(language, require(filename));
        }
    });

    // load parser
    const parsers = Object.keys(app.parsers);
    parsers.forEach(function (parser) {
        let parserModule;
        if (isObject(app.parsers[parser])) {
            app.log.debug('inject parser: ' + parser);
            parserModule = app.parsers[parser];
            self.addParser(parser, parserModule);
        } else {
            const filename = app.parsers[parser];
            app.log.debug('load parser: ' + parser + ', ' + filename);
            parserModule = require(filename);
            // Handle both CommonJS and ES module exports
            // If module has default export, use it instead of the module itself
            const moduleToUse = parserModule?.default || parserModule;
            self.addParser(parser, moduleToUse);
        }

        // Call init function if it exists (for schema processing hooks)
        // Use the same module reference that was added to parsers
        const moduleToCheck = self.parsers[parser];
        if (moduleToCheck && typeof moduleToCheck.init === 'function') {
            app.log.debug('initialize parser: ' + parser);
            moduleToCheck.init(app);
        }
    });

    // check app.options.filterBy and define the tag to filter by
    if (app.options.filterBy) {
        const tag = app.options.filterBy.split('=')[0];
        filterTag = tag.indexOf('api') !== -1 ? tag : null;
    }
}

/**
 * Inherit
 */
util.inherits(Parser, Object);

/**
 * Add a new programming, or spoken language, to the existing collection.
 * @param name - Key for the language being added.
 * @param language - Language object associated with the provided name.
 * @memberof Parser
 */
Parser.prototype.addLanguage = function (name, language) {
    this.languages[name] = language;
};

/**
 * Register a parser function under a specified name.
 *
 * Enables the extension or customization of parsing behavior.
 * @param name - Unique identifier for the parser.
 * @param parser - Function that defines the parser behavior.
 * @memberof Parser
 */
Parser.prototype.addParser = function (name, parser) {
    this.parsers[name] = parser;
};

/**
 * Parse files in specified folder
 * @param options The options used to parse and filter the files.
 * @param parsedFiles List of parsed files.
 * @param parsedFilenames List of parsed files, with full path.
 * @memberof Parser
 */
Parser.prototype.parseFiles = function (options, parsedFiles, parsedFilenames) {
    const self = this;

    // Store current category for parser filtering
    self.currentCategory = options.category || null;
    if (self.currentCategory) {
        app.log.verbose(`Parsing with category filter: ${self.currentCategory}`);
    }

    findFiles.setPath(options.src);
    findFiles.setExcludeFilters(options.excludeFilters);
    findFiles.setIncludeFilters(options.includeFilters);
    const files = findFiles.search();

    // Parser
    for (let i = 0; i < files.length; i += 1) {
        const filename = options.src + files[i];
        const parsedFile = self.parseFile(filename, options.encoding);
        if (parsedFile) {
            app.log.verbose('parse file: ' + filename);
            parsedFiles.push(parsedFile);
            // only push the filename without full path to prevent information disclosure
            parsedFilenames.push(files[i]);
        }
    }
};

/**
 * Execute file parsing
 * @param filename - Name of the file to be parsed, including its path.
 * @param [encoding] - The encoding to be used for processing the file.
 * @returns {object|boolean|void|*}
 * @throws {Error} If the file cannot be read or processed.
 * @memberof Parser
 */
Parser.prototype.parseFile = function (filename, encoding) {
    const self = this;

    if (typeof encoding === 'undefined') {
        encoding = 'utf8';
    }

    app.log.debug('inspect file: ' + filename);

    self.filename = filename;
    self.extension = path.extname(filename).toLowerCase();

    // File-type filtering: Skip files that should not be parsed
    // Markdown files are processed separately by the markdown processor
    const nonParsableExtensions = ['.md', '.markdown'];
    if (nonParsableExtensions.includes(self.extension)) {
        app.log.verbose(`Skipping parser for ${self.extension} file (processed separately): ${filename}`);
        return null;
    }

    // Category-based filtering: Skip TypeScript files in tsdoc category
    // TSDoc uses TypeScript compiler directly via generateTSDocData(), not traditional parsers
    if (self.currentCategory === 'tsdoc') {
        const tsExtensions = ['.ts', '.tsx', '.d.ts'];
        if (tsExtensions.includes(self.extension)) {
            app.log.verbose(`Skipping parser for ${self.extension} in tsdoc category (processed via TypeScript compiler): ${filename}`);
            return null;
        }
    }

    // TODO: Not sure if this is correct. Without skipDecodeWarning we got string errors
    // https://github.com/apidoc/apidoc-core/pull/25
    const fileContent = fs.readFileSync(filename, { encoding: 'binary' });
    return self.parseSource(fileContent, encoding, filename);
};

/**
 * Execute source parsing
 *
 * Parses the source content of a file and extracts structured information
 * such as blocks and elements, with a focus on API documentation elements.
 *
 * Performs the following operations:
 * 1. Decodes the file content using the specified encoding.
 * 2. Replaces all line endings with a unified format (`\n`).
 * 3. Identifies and extracts blocks from the source content.
 * 4. Extracts elements from each identified block.
 * 5. Identifies which blocks contain API elements.
 * 6. Parses the elements within the API-related blocks and performs sanity checks.
 *
 * If no blocks, elements, or API-related blocks are identified, the function
 * returns without further processing.
 *
 * Internal methods used:
 * - `_findBlocks`: Determines blocks of content in the source.
 * - `findElements`: Extracts elements from a given block.
 * - `_findBlockWithApiGetIndex`: Identifies the index of blocks containing API elements.
 * - `_parseBlockElements`: Parses the block-level API elements.
 * - `_sanityChecks`: Performs validation on the parsed blocks.
 *
 * Logs:
 * - Logs the size of the parsed source.
 * - Logs the number of identified blocks.
 * - Logs the number of elements in each block.
 * @param fileContent - Content to be parsed.
 * @param encoding - Content character encoding
 * @param filename - Name of the file being parsed.
 * @returns {Array<object>|undefined} Return an array of parsed blocks containing API elements, or undefined
 *     if no blocks or elements were found.
 * @memberof Parser
 */
Parser.prototype.parseSource = function (fileContent, encoding, filename) {
    const self = this;
    // Ensure fileContent is a Buffer for iconv-lite
    const buffer = Buffer.isBuffer(fileContent) ? fileContent : Buffer.from(fileContent);
    self.src = iconv.decode(buffer, encoding);
    app.log.debug('size: ' + self.src.length);

    // unify line-breaks
    self.src = self.src.replace(/\r\n/g, '\n');

    self.blocks = [];
    self.indexApiBlocks = [];

    // determine blocks
    self.blocks = self._findBlocks();
    if (self.blocks.length === 0) {
        return;
    }

    app.log.debug('count blocks: ' + self.blocks.length);

    // determine elements in blocks
    self.elements = self.blocks.map(function (block, i) {
        const elements = self.findElements(block, filename);
        app.log.debug('count elements in block ' + i + ': ' + elements.length);
        return elements;
    });
    if (self.elements.length === 0) {
        return;
    }

    // determine list of blocks with API elements
    self.indexApiBlocks = self._findBlockWithApiGetIndex(self.elements);
    if (self.indexApiBlocks.length === 0) {
        return;
    }

    const parsedBlocks = self._parseBlockElements(self.indexApiBlocks, self.elements, filename);
    _sanityChecks(parsedBlocks, app.log, filename);
    return parsedBlocks;
};

/**
 * Parse API Elements with Plugins.
 *
 * Parses and processes block elements from the provided blocks and elements data.
 * - Handles warnings for deprecated parser plugins and specific syntax deprecation (e.g., square bracket notation).
 * - Supports markdown rendering for specified fields within each element.
 * - Allows flexible configuration for adding parsed values to global or local paths within the block data.
 * @param indexApiBlocks - Array of indices representing definition blocks to parse.
 * @param detectedElements - An object mapping block indices to detected elements.
 * @param filename - Name of the file being parsed, used for logging and error purposes.
 * @returns {Array<object>} - Array of parsed block objects containing globally and locally processed data.
 * @throws {ParserError} - Throw a `ParserError` when parsing fails due to invalid configurations,
 *     empty results, or unsupported options in the block elements and paths.
 * @memberof Parser
 */
Parser.prototype._parseBlockElements = function (indexApiBlocks, detectedElements, filename) {
    const self = this;
    const parsedBlocks = [];

    for (let i = 0; i < indexApiBlocks.length; i += 1) {
        const blockIndex = indexApiBlocks[i];
        const elements = detectedElements[blockIndex];
        const blockData: any = {
            global: {},
            local: {},
        };
        let countAllowedMultiple = 0;

        for (let j = 0; j < elements.length; j += 1) {
            const element = elements[j];

            // Check if this parser is enabled for the current category
            if (self.currentCategory && !isParserEnabled(self.currentCategory, element.name)) {
                app.log.debug(
                    `Skipping parser '${element.name}' for category '${self.currentCategory}' in block: '${blockIndex}'`
                );
                continue;
            }

            const elementParser = self.parsers[element.name];

            if (!elementParser) {
                app.log.warn(
                    `parser plugin '${element.name}' not found in block: '${blockIndex}' in file: '${filename}'`
                );
            } else if (!element.sourceName.endsWith('Example') && element.source.match(/[^\s:]\[[^\]]/)) {
                app.log.warn(
                    `The use of square brackets for object properties is deprecated. Please use dot notation instead: "${element.source}"`
                );
            } else {
                app.log.debug('found @' + element.sourceName + ' in block: ' + blockIndex);

                // Deprecation warning
                if (elementParser.deprecated) {
                    self.countDeprecated[element.sourceName] = self.countDeprecated[element.sourceName]
                        ? self.countDeprecated[element.sourceName] + 1
                        : 1;

                    let message = '@' + element.sourceName + ' is deprecated';
                    if (elementParser.alternative) {
                        message = '@' + element.sourceName + ' is deprecated, please use ' + elementParser.alternative;
                    }

                    if (self.countDeprecated[element.sourceName] === 1) {
                        // show deprecated message only 1 time as warning
                        app.log.warn(message);
                    } else {
                        // show deprecated message more than 1 time as verbose message
                        app.log.verbose(message);
                    }

                    app.log.verbose('in file: ' + filename + ', block: ' + blockIndex);
                }

                let values = '';
                let preventGlobal = false;
                let allowMultiple = false;
                let pathTo = '';
                let attachMethod = '';
                try {
                    // parse element and retrieve values
                    values = elementParser.parse(element.content, element.source);

                    // HINT: pathTo MUST be read after elementParser.parse, because of dynamic paths
                    // Add all other options after parse too, in case of a custom plugin need to modify params.

                    // check if it is allowed to add to global namespace
                    preventGlobal = elementParser.preventGlobal === true;

                    // allow multiple inserts into pathTo
                    allowMultiple = true;

                    // path to an array, where the values should be attached
                    pathTo = '';
                    if (elementParser.path) {
                        if (typeof elementParser.path === 'string') {
                            pathTo = elementParser.path;
                        } else {
                            pathTo = elementParser.path();
                        } // for dynamic paths
                    }

                    if (!pathTo) {
                        throw new ParserError(
                            'pathTo is not defined in the parser file.',
                            '',
                            '',
                            element.sourceName,
                            ''
                        );
                    }

                    // method how the values should be attached (insert or push)
                    attachMethod = elementParser.method || 'push';

                    if (attachMethod !== 'insert' && attachMethod !== 'push') {
                        throw new ParserError(
                            'Only push or insert are allowed parser method values.',
                            '',
                            '',
                            element.sourceName,
                            ''
                        );
                    }

                    // TODO: put this into "converters"
                    if (values) {
                        // Markdown.
                        if (
                            app.markdownParser &&
                            elementParser.markdownFields &&
                            elementParser.markdownFields.length > 0
                        ) {
                            for (
                                let markdownIndex = 0;
                                markdownIndex < elementParser.markdownFields.length;
                                markdownIndex += 1
                            ) {
                                const field = elementParser.markdownFields[markdownIndex];
                                let value = get(values, field);
                                if (value) {
                                    value = app.markdownParser.render(value);
                                    // remove line breaks, but not within <pre> tags
                                    value = value.replace(/(?:^|<\/pre>)[^]*?(?:<pre>|$)/g, (m) => {
                                        return m.replace(/(\r\n|\n|\r)/g, ' ');
                                    });

                                    value = value.trim();
                                    set(values, field, value);

                                    // TODO: Little hacky, not sure to handle this here or in template
                                    if (
                                        elementParser.markdownRemovePTags &&
                                        elementParser.markdownRemovePTags.length > 0 &&
                                        elementParser.markdownRemovePTags.indexOf(field) !== -1
                                    ) {
                                        // Remove p-Tags
                                        value = value.replace(/(<p>|<\/p>)/g, '');
                                        set(values, field, value);
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    if (e instanceof ParameterError) {
                        const extra = [];
                        if (e.definition) {
                            extra.push({ Definition: e.definition });
                        }
                        if (e.example) {
                            extra.push({ Example: e.example });
                        }
                        throw new ParserError(
                            e.message,
                            self.filename,
                            blockIndex + 1,
                            element.sourceName,
                            element.source,
                            extra
                        );
                    }
                    // Log the actual error before throwing generic error
                    console.error('[Parser] Caught non-ParameterError exception:', e);
                    console.error('[Parser] Error stack:', e.stack);
                    throw new ParserError(
                        'Undefined error: ' + (e.message || String(e)),
                        self.filename,
                        blockIndex + 1,
                        element.sourceName,
                        element.source
                    );
                }

                if (!values) {
                    throw new ParserError(
                        'Empty parser result.',
                        self.filename,
                        blockIndex + 1,
                        element.sourceName,
                        element.source
                    );
                }

                if (preventGlobal) {
                    // Check if count global namespace entries > count allowed
                    // (e.g. @successTitle is global, but should co-exist with @apiErrorStructure)
                    if (Object.keys(blockData.global).length > countAllowedMultiple) {
                        throw new ParserError(
                            'Only one definition or usage is allowed in the same block.',
                            self.filename,
                            blockIndex + 1,
                            element.sourceName,
                            element.source
                        );
                    }
                }

                // only one global allowed per block
                if (pathTo === 'global' || pathTo.substr(0, 7) === 'global.') {
                    if (allowMultiple) {
                        countAllowedMultiple += 1;
                    } else {
                        if (Object.keys(blockData.global).length > 0) {
                            throw new ParserError(
                                'Only one definition is allowed in the same block.',
                                self.filename,
                                blockIndex + 1,
                                element.sourceName,
                                element.source
                            );
                        }

                        if (preventGlobal) {
                            throw new ParserError(
                                'Only one definition or usage is allowed in the same block.',
                                self.filename,
                                blockIndex + 1,
                                element.sourceName,
                                element.source
                            );
                        }
                    }
                }

                if (!blockData[pathTo]) {
                    self._createObjectPath(blockData, pathTo, attachMethod);
                }

                const blockDataPath = self._pathToObject(pathTo, blockData);

                // insert field values in Path-Array
                if (attachMethod === 'push') {
                    blockDataPath.push(values);
                } else {
                    extend(blockDataPath, values);
                }

                // insert field values in main path
                if (elementParser.extendRoot === true) {
                    extend(blockData, values);
                }

                blockData.index = blockIndex + 1;
            }
        }
        if (blockData.index && blockData.index > 0) {
            parsedBlocks.push(blockData);
        }
    }
    return parsedBlocks;
};

/**
 * Create a nonexisting path in an object.
 * @param src - The source object where the path will be created.
 * @param path - The dot-separated string defining the path in the source object.
 * @param [attachMethod] - An optional method to define the behavior for the final path, such as
 *     initializing an empty array (e.g., 'push'). Create last element as object or array: 'insert', 'push'
 * @returns {object|Array} - The object or array corresponding to the final path in the hierarchy.
 * @memberof Parser
 */
Parser.prototype._createObjectPath = function (src, path, attachMethod) {
    if (!path) {
        return src;
    }
    const pathParts = path.split('.');
    let current = src;
    for (let i = 0; i < pathParts.length; i += 1) {
        const part = pathParts[i];
        if (!current[part]) {
            if (i === pathParts.length - 1 && attachMethod === 'push') {
                current[part] = [];
            } else {
                current[part] = {};
            }
        }
        current = current[part];
    }
    return current;
};

/**
 * Return path to object
 *
 * Retrieves the value of a nested property from a source object.
 * @param path - A dot-separated string representing the path to navigate within the source object.
 *    If undefined or null, the entire source object is returned.
 * @param src - The source object to search
 * @returns {object|*} - The value of the property at the specified path, or the source object if the path is not provided.
 * @memberof Parser
 */
Parser.prototype._pathToObject = function (path, src) {
    if (!path) {
        return src;
    }
    const pathParts = path.split('.');
    let current = src;
    for (let i = 0; i < pathParts.length; i += 1) {
        const part = pathParts[i];
        current = current[part];
    }
    return current;
};

/**
 * Extracts documentation blocks from the source code of the current object.
 * Identify and process specific programming language documentation comments defined in the `src` property of the current object.
 *
 * - Line breaks in the source code are temporarily replaced with a unique Unicode character for easier regex processing.
 * - Retrieves blocks of documentation comments using the specified regular expression for the language.
 * - Inline comment patterns are removed from the extracted documentation blocks.
 * - Restores the original line breaks in the documentation blocks after processing.
 * @returns {Array<string>} An array containing the extracted documentation blocks.
 * @memberof Parser
 */
Parser.prototype._findBlocks = function () {
    const self = this;
    const blocks = [];
    let src = self.src;

    // Replace Linebreak with Unicode
    src = src.replace(/\n/g, '\uffff');

    const regexForFile = this.languages[self.extension] || this.languages.default;
    let matches = regexForFile.docBlocksRegExp.exec(src);
    while (matches) {
        let block = matches[2] || matches[1];

        // Reverse Unicode Linebreaks
        block = block.replace(/\uffff/g, '\n');

        block = block.replace(regexForFile.inlineRegExp, '');
        blocks.push(block);

        // Find next
        matches = regexForFile.docBlocksRegExp.exec(src);
    }
    return blocks;
};

/**
 * Return block indexes for active API-elements.
 *
 * An @apiIgnore ignores the block.
 * Other, non @api elements, will be ignored.
 * @param blocks - Array of block elements to be analyzed and filtered.
 *     Each block is an array of objects, where each object contains metadata, including names and content.
 * @returns {Array<number>} - An array of integers representing the indexes of blocks.
 * @memberof Parser
 */
Parser.prototype._findBlockWithApiGetIndex = function (blocks) {
    const foundIndexes = [];
    // get value to filter by
    const valueToFilter = filterTag ? app.options.filterBy.split('=')[1] : null;
    for (let i = 0; i < blocks.length; i += 1) {
        let found = false;
        let isToFilterBy = false;
        let isDefine = false;
        for (let j = 0; j < blocks[i].length; j += 1) {
            // check apiIgnore
            if (blocks[i][j].name.substr(0, 9) === 'apiignore') {
                app.log.debug('apiIgnore found in block: ' + i);
                found = false;
                break;
            }

            // check app.options.apiprivate and apiPrivate
            if (!app.options.apiprivate && blocks[i][j].name.substr(0, 10) === 'apiprivate') {
                app.log.debug('private flag is set to false and apiPrivate found in block: ' + i);
                found = false;
                break;
            }

            // check if the user want to filter by some specific tag
            if (filterTag) {
                // we need to add all apidefine
                if (blocks[i][j].name.substr(0, 9) === 'apidefine') {
                    isDefine = true;
                }
                if (
                    blocks[i][j].name.substr(0, filterTag.length) === filterTag &&
                    blocks[i][j].content === valueToFilter
                ) {
                    isToFilterBy = true;
                }
            }

            if (
                blocks[i][j].name.substr(0, 3) === 'api' ||
                blocks[i][j].name.substr(0, 7) === 'openapi' ||
                blocks[i][j].name.substr(0, 4) === 'mqtt' ||
                blocks[i][j].name.substr(0, 5) === 'model' ||
                // JSDoc/TSDoc tags
                [
                    'file',
                    'author',
                    'copyright',
                    'license',
                    'package',
                    'see',
                    'param',
                    'returns',
                    'remarks',
                    'example',
                    'public',
                    'internal',
                    'alpha',
                    'beta',
                ].includes(blocks[i][j].name)
            ) {
                found = true;
            }
        }

        // add block if it's apidefine or the tag is equal to the value defined in options
        if (filterTag) {
            found = found && (isToFilterBy || isDefine);
        }

        if (found) {
            foundIndexes.push(i);
            app.log.debug('api found in block: ' + i);
        }
    }
    return foundIndexes;
};

/**
 * Extracts and processes elements defined with the `@api` tag from a block of text.
 * And trigger "hooks" for additional customization during the extraction process.
 * @param block - A string block of text that contains the elements to extract.
 *                        Linebreaks are temporarily replaced with a Unicode character for parsing.
 * @param filename - The name of the file being processed. Used for context within the hooks.
 * @returns {Array<{source: string, name: string, sourceName: string, content: string}>} - An array of
 *     extracted elements. Each element is an object containing:
 *     - `source` {string}: The entire matched string including the `@api` annotation and its content.
 *     - `name` {string}: The lowercase `@api` name extracted from the source.
 *     - `sourceName` {string}: The original `@api` name as it appears in the source.
 *     - `content` {string}: The content associated with the specific `@api` annotation.
 * @memberof Parser
 */
Parser.prototype.findElements = function (block, filename) {
    const elements = [];

    // Replace Linebreak with Unicode
    block = block.replace(/\n/g, '\uffff');

    // Elements start with @api, @openapi, @mqtt, or @model (at beginning of comment line, not in text)
    const elementsRegExp =
        /((?:^|\uffff)[\s*]*@(api\w*|openapi(?:-\w+)?|mqtt\w*|model\w*|payloadSchema|examplePublish|exampleSubscribe|responseTopic|responseExample|topicParam|topic|payload|qos|retain|author|ratelimit|errors|tags|auth|file|copyright|license|package|see|param|returns|remarks|example|public|internal|alpha|beta)(?:\s*([\s\S]*?))?(?=\uffff[\s*]*@(?:api\w*|openapi|mqtt\w*|model\w*|payloadSchema|examplePublish|exampleSubscribe|responseTopic|responseExample|topicParam|topic|payload|qos|retain|author|ratelimit|errors|tags|auth|file|copyright|license|package|see|param|returns|remarks|example|public|internal|alpha|beta)|\*\/|$))/gm;
    let matches = elementsRegExp.exec(block);
    while (matches) {
        const element = {
            source: matches[1],
            name: matches[2].toLowerCase(),
            sourceName: matches[2],
            content: matches[3] || '',
        };

        // Debug: log all elements from schema files
        // Commented out for silent mode
        // if (element.name === 'apischema') {
        //     process.stdout.write(`[parser v2.0.0] Found @apiSchema in ${filename}\n`);
        // }

        // reverse Unicode Linebreaks
        element.content = element.content.replace(/\uffff/g, '\n');
        element.source = element.source.replace(/\uffff/g, '\n');

        app.hook('parser-find-element-' + element.name, element, block, filename);

        elements.push(element);

        // Commented out for silent mode
        // if (element.name === 'apischema') {
        //     process.stdout.write(`[parser v2.0.0] About to call hook parser-find-elements for @apiSchema\n`);
        // }

        app.hook('parser-find-elements', elements, element, block, filename);

        // next Match
        matches = elementsRegExp.exec(block);
    }
    return elements;
};

/**
 * Emit warnings through the logger instance for inconsistent API doc elements.
 * @param parsedBlocks - An array of parsed block objects containing API documentation data.
 * @param log - A logger instance used to emit warnings or errors during the sanity checks.
 * @param filename - The name of the file being processed for generating documentation.
 * @private
 */
function _sanityChecks(parsedBlocks, log, filename) {
    const definedBlocksByName = {};
    for (const block of parsedBlocks) {
        if (block.global.define && block.global.define.name) {
            definedBlocksByName[block.global.define.name] = block;
        }
    }
    for (const block of parsedBlocks) {
        const paramFields = _paramFieldsFromBlock(block);

        let paramFieldsDefinedOutside = [];
        if (block.local.use) {
            for (const define of block.local.use) {
                const definedBlock = definedBlocksByName[define.name];
                if (definedBlock) {
                    paramFieldsDefinedOutside = paramFieldsDefinedOutside.concat(_paramFieldsFromBlock(definedBlock));
                }
            }
        }

        const urlParams = [];
        if (block.local.url) {
            // The dummy URL base is only used for parses of relative URLs.
            const url = new URL(block.local.url, 'https://dummy.base');

            // For API parameters in the URL parts delimited by `/` (e.g. `/:foo/:bar`).
            for (const pathnamePart of url.pathname.split('/')) {
                if (pathnamePart.charAt(0) === ':') {
                    urlParams.push(pathnamePart.slice(1));
                }
            }
        }
        for (const urlParam of urlParams) {
            if (
                !paramFields.some((pf) => pf.field === urlParam) &&
                !paramFieldsDefinedOutside.some((pf) => pf.field === urlParam)
            ) {
                log.warn(
                    `URL contains a parameter ':${urlParam}' that is not documented as @apiParam in @api '${block.local.title}' in file: '${filename}'`
                );
            }
        }
        if (!block.global.define) {
            for (const paramField of paramFields) {
                // Emit the warning only if the field is mandatory.
                if (!paramField.optional && !urlParams.some((up) => up === paramField.field)) {
                    log.warn(
                        `@apiParam '${paramField.field}' was defined but does not appear in URL of @api '${block.local.title}' in file: '${filename}'`
                    );
                }
            }
        }
    }
}

/**
 * Process an object and extract all parameter fields across all field groups.
 * @param block - The block object containing parameter field information. It is expected to have a structure that includes `local.parameter.fields`.
 * @returns {Array<object>} Array of parameter fields extracted from the block object. If no fields are present, an empty array is returned.
 * @private
 */
function _paramFieldsFromBlock(block) {
    let paramFields = [];
    if (block.local.parameter && block.local.parameter.fields) {
        // Loop all fields regardless of the field group. The default field group is `Parameter` but it could be provided by the developer.
        for (const key in block.local.parameter.fields) {
            paramFields = paramFields.concat(block.local.parameter.fields[key]);
        }
    }
    return paramFields;
}

/**
 * Exports
 */
export default Parser;
