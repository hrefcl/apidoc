"use strict";
/**
 * @file Worker for @apiUse tags - processes inclusion of predefined documentation blocks
 *
 * This worker handles the preprocessing and postprocessing of @apiUse tags, which allow
 * inclusion of predefined documentation blocks (defined with @apiDefine) into API endpoints.
 * It manages versioning, recursive merging, and error handling for undefined references.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProcess = postProcess;
exports.preProcess = preProcess;
const lodash_1 = __importDefault(require("lodash"));
const semver_1 = __importDefault(require("semver"));
const worker_error_1 = require("../errors/worker_error");
// Additional information for error log
const _messages = {
    common: {
        element: 'apiUse',
        usage: '@apiUse group',
        example: '@apiDefine MyValidGroup Some title\n@apiUse MyValidGroup',
    },
};
/**
 * PreProcess API Use tags to collect defined blocks
 *
 * First phase of @apiUse processing that scans all parsed files to collect
 *
 * @apiDefine blocks and organize them by name and version. These blocks will
 * later be referenced by @apiUse tags during postprocessing.
 *
 * @param parsedFiles - Array of parsed file objects containing API documentation blocks
 * @param filenames - Array of filenames corresponding to the parsed files
 * @param packageInfos - Package information including default version for versioning
 * @param target - Target key in result object where collected definitions are stored
 * @returns Object containing all defined blocks organized by name and version
 *
 * @example Collecting defined blocks
 * ```typescript
 * // Input: Parsed files with @apiDefine blocks
 * const result = preProcess(parsedFiles, filenames, packageInfos, 'define');
 * // Output: { define: { "UserObject": { "1.0.0": { ... block data ... } } } }
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function preProcess(parsedFiles, filenames, packageInfos, target) {
    target = target || 'define';
    const source = target; // relative path to the tree (global.), from where the data should be fetched.
    const result = {};
    result[target] = {};
    parsedFiles.forEach(function (parsedFile) {
        parsedFile.forEach(function (block) {
            if (block.global[source]) {
                const name = block.global[source].name;
                const version = block.version || packageInfos.defaultVersion;
                if (!result[target][name]) {
                    result[target][name] = {};
                }
                // fetch from local
                result[target][name][version] = block.local;
            }
        });
    });
    if (result[target].length === 0) {
        delete result[target];
    }
    return result;
}
/**
 * PostProcess API Use tags to include defined blocks
 *
 * Second phase of @apiUse processing that finds @apiUse references in API blocks
 * and replaces them with the corresponding @apiDefine block content. Handles
 * version matching, recursive inclusion, and error reporting for missing references.
 *
 * @param parsedFiles - Array of parsed file objects to process for @apiUse tags
 * @param filenames - Array of filenames for error reporting
 * @param preProcess - Previously collected defined blocks from preprocessing phase
 * @param packageInfos - Package information for version handling
 * @param source - Key in preProcess object containing the defined blocks
 * @param target - Key in block.local containing @apiUse references to process
 * @param messages - Error message templates for consistent error reporting
 *
 * @throws {WorkerError} When referenced definition doesn't exist
 * @throws {WorkerError} When recursion depth exceeds limit (10 levels)
 * @throws {WorkerError} When no matching version is found
 *
 * @example Processing @apiUse references
 * ```typescript
 * // Before: block.local.use = [{ name: "UserObject" }]
 * postProcess(parsedFiles, filenames, preProcess, packageInfos);
 * // After: UserObject definition content is merged into the block
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos, source, target, messages) {
    source = source || 'define';
    target = target || 'use';
    messages = messages || _messages;
    parsedFiles.forEach(function (parsedFile, parsedFileIndex) {
        parsedFile.forEach(function (block) {
            const loopCounter = 0; // add a loop counter to have a break condition when the recursion depth exceed a predefined limit
            while (block.local[target]) {
                if (loopCounter > 10) {
                    throw new worker_error_1.WorkerError('recursion depth exceeds limit with @apiUse', filenames[parsedFileIndex], block.index, messages.common.element, messages.common.usage, messages.common.example, [{ Groupname: block.name }]);
                }
                // create a copy of the elements for save iterating of the elements
                const blockClone = block.local[target].slice();
                // remove unneeded target before starting the loop, to allow a save insertion of new elements
                // TODO: create a cleanup filter
                delete block.local[target];
                for (let blockIndex = 0; blockIndex < blockClone.length; ++blockIndex) {
                    const definition = blockClone[blockIndex];
                    const name = definition.name;
                    const version = block.version || packageInfos.defaultVersion;
                    if (!preProcess[source] || !preProcess[source][name]) {
                        throw new worker_error_1.WorkerError('Referenced groupname does not exist / it is not defined with @apiDefine.', filenames[parsedFileIndex], block.index, messages.common.element, messages.common.usage, messages.common.example, [{ Groupname: name }]);
                    }
                    let matchedData = {};
                    if (preProcess[source][name][version]) {
                        // found the version
                        matchedData = preProcess[source][name][version];
                    }
                    else {
                        // find nearest matching version
                        let foundIndex = -1;
                        let lastVersion = packageInfos.defaultVersion;
                        const versionKeys = Object.keys(preProcess[source][name]);
                        for (let versionIndex = 0; versionIndex < versionKeys.length; ++versionIndex) {
                            const currentVersion = versionKeys[versionIndex];
                            if (semver_1.default.gte(version, currentVersion) && semver_1.default.gte(currentVersion, lastVersion)) {
                                lastVersion = currentVersion;
                                foundIndex = versionIndex;
                            }
                        }
                        if (foundIndex === -1) {
                            throw new worker_error_1.WorkerError('Referenced definition has no matching or a higher version. ' +
                                'Check version number in referenced define block.', filenames[parsedFileIndex], block.index, messages.common.element, messages.common.usage, messages.common.example, [{ Groupname: name }, { Version: version }, { 'Defined versions': versionKeys }]);
                        }
                        const versionName = versionKeys[foundIndex];
                        matchedData = preProcess[source][name][versionName];
                    }
                    // copy matched elements into parsed block
                    _recursiveMerge(block.local, matchedData);
                }
            }
        });
    });
}
/**
 * Recursively merge objects with array concatenation
 *
 * Utility function that merges two objects recursively, with special handling
 * for arrays (which are concatenated rather than replaced). This ensures that
 * when @apiUse blocks are included, their arrays are properly merged with
 * existing arrays in the target block.
 *
 * @param block - Target object to merge content into
 * @param matchedData - Source object containing content to merge
 *
 * @example Array concatenation behavior
 * ```typescript
 * const target = { params: [{ name: "id" }] };
 * const source = { params: [{ name: "name" }] };
 * _recursiveMerge(target, source);
 * // Result: { params: [{ name: "id" }, { name: "name" }] }
 * ```
 *
 * @since 4.0.0
 * @internal
 * @todo Replace with more robust merging solution
 */
function _recursiveMerge(block, matchedData) {
    lodash_1.default.mergeWith(block, matchedData, function (a, b) {
        if (a instanceof Array) {
            return a.concat(b);
        }
        if (lodash_1.default.isObject(a)) {
            _recursiveMerge(a, b);
        }
        return a;
    });
}
//# sourceMappingURL=api_use.js.map