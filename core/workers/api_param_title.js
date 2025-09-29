"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postProcess = postProcess;
exports.preProcess = preProcess;
const semver_1 = __importDefault(require("semver"));
const worker_error_1 = require("../errors/worker_error");
// Additional information for error log
const _messages = {
    common: {
        element: 'apiParam',
        usage: '@apiParam (group) varname',
        example: '@apiDefine MyValidParamGroup Some title\n@apiParam (MyValidParamGroup) username',
    },
};
/**
 * PreProcess API Param Title
 *
 * Processes the parsed files and organizes the data in a structured format.
 *
 * @param parsedFiles - An array of parsed file objects containing the data blocks.
 * @param filenames - An array of filenames associated with the parsed files.
 * @param packageInfos - Information about the package, including its default version.
 * @param [target] - Target key/path in preProcess-Object where the processed data will be stored.
 * @returns {object} Processed data organized by the target key.
 */
function preProcess(parsedFiles, filenames, packageInfos, target) {
    target = target || 'defineParamTitle';
    const source = 'define'; // relative path to the tree (global.), from where the data should be fetched.
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
                // fetch from global
                result[target][name][version] = block.global[source];
            }
        });
    });
    // remove empty target
    if (result[target].length === 0) {
        delete result[target];
    }
    return result;
}
/**
 * PostProcess API Param Title
 *
 * Process parsed files and update specific target fields based on predefined and pre-processed sources.
 *
 * Handles
 * - versioning,
 * - matches data definitions
 * - updates field information
 *
 * @param parsedFiles - Array of objects containing the parsed file data. Each file contains blocks to modify.
 * @param filenames - Array of filenames associated with the parsed files.
 * @param preProcess - Pre-processed data source used for matching and updating fields.
 * @param packageInfos - Contains package-specific information such as default version.
 * @param [source] - Source path in preProcess-Object
 * @param [target] - Relative path to the tree (local.), where the data should be modified.
 * @param [messages] - Messages used for error reporting.
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos, source, target, messages) {
    source = source || 'defineParamTitle';
    target = target || 'parameter';
    messages = messages || _messages;
    parsedFiles.forEach(function (parsedFile, parsedFileIndex) {
        parsedFile.forEach(function (block) {
            if (!block.local[target] || !block.local[target].fields) {
                return;
            }
            const newFields = {};
            const fields = block.local[target].fields;
            Object.keys(fields).forEach(function (fieldGroup) {
                const params = block.local[target].fields[fieldGroup];
                params.forEach(function (definition) {
                    const name = definition.group;
                    const version = block.version || packageInfos.defaultVersion;
                    let matchedData = {};
                    if (!preProcess[source] || !preProcess[source][name]) {
                        // TODO: Enable in the next version
                        // At the moment the (groupname) is optional and must not be defined.
                        /*
                        var extra = [
                            { 'Groupname': name }
                        ];
                        throw new WorkerError('Referenced groupname does not exist / it is not defined with @apiDefine.',
                                              filenames[parsedFileIndex],
                                              block.index,
                                              messages.common.element,
                                              messages.common.usage,
                                              messages.common.example,
                                              extra);
*/
                        // TODO: Remove in the next version
                        matchedData.name = name;
                        matchedData.title = name;
                    }
                    else {
                        // TODO: Remove in the next version
                        if (preProcess[source][name][version]) {
                            // found the version
                            matchedData = preProcess[source][name][version];
                        }
                        else {
                            // find nearest matching version
                            let foundIndex = -1;
                            let lastVersion = packageInfos.defaultVersion;
                            const versionKeys = Object.keys(preProcess[source][name]);
                            versionKeys.forEach(function (currentVersion, versionIndex) {
                                if (semver_1.default.gte(version, currentVersion) && semver_1.default.gte(currentVersion, lastVersion)) {
                                    lastVersion = currentVersion;
                                    foundIndex = versionIndex;
                                }
                            });
                            if (foundIndex === -1) {
                                const extra = [
                                    { Groupname: name },
                                    { Version: version },
                                    { 'Defined versions': versionKeys },
                                ];
                                throw new worker_error_1.WorkerError('Referenced definition has no matching or a higher version. ' +
                                    'Check version number in referenced define block.', filenames[parsedFileIndex], block.index.toString(), messages.common.element, messages.common.usage, messages.common.example, extra);
                            }
                            const versionName = versionKeys[foundIndex];
                            matchedData = preProcess[source][name][versionName];
                        }
                        // TODO: Remove in the next version
                    }
                    if (!newFields[matchedData.title]) {
                        newFields[matchedData.title] = [];
                    }
                    newFields[matchedData.title].push(definition);
                });
            });
            // replace fields with new field header
            // TODO: reduce complexity and remove group
            block.local[target].fields = newFields;
        });
    });
}
//# sourceMappingURL=api_param_title.js.map