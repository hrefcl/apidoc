import semver from 'semver';
import { WorkerError } from '../errors/worker_error';

// Type definitions
interface MatchedData {
    name?: string;
    title?: string;
    description?: string;
}

// Additional information for error log
const _messages = {
    common: {
        element: 'apiPermission',
        usage: '@apiPermission group',
        example: '@apiDefine MyValidPermissionGroup Some title\n@apiPermission MyValidPermissionGroup',
    },
};

/**
 * PreProcess API Permission
 *
 * Pre-processes the given parsed files, filenames, and package information
 * to extract and organize permission definitions.
 * @param parsedFiles - Array of parsed file objects to process.
 * @param filenames - Array of filenames corresponding to the parsed files.
 * @param packageInfos - Object containing package information to apply during processing.
 * @param target - Target key/path in preProcess-Object, returned result, where the data will be set.
 * @returns {object}
 */
function preProcess(parsedFiles, filenames, packageInfos, target) {
    target = target || 'definePermission';
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

                // fetch from local
                result[target][name][version] = block.global[source];
            }
        });
    });

    if (result[target].length === 0) {
        delete result[target];
    }

    return result;
}

/**
 * PostProcess API Permission
 *
 * Processes the parsed files and metadata after the initial processing is completed.
 * Handles permission definitions, versioning, and updates permission information.
 * @param parsedFiles - Array of objects containing the parsed file data.
 * @param filenames - Array of filenames associated with the parsed files.
 * @param preProcess - Pre-processing results containing defined permissions.
 * @param packageInfos - Collection of package-level details and information.
 * @param source - Source path in preProcess-Object.
 * @param target - Relative path to the tree (local.), where the data should be modified.
 * @param messages - Messages used for error reporting.
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos, source, target, messages) {
    source = source || 'definePermission';
    target = target || 'permission';
    messages = messages || _messages;

    parsedFiles.forEach(function (parsedFile, parsedFileIndex) {
        parsedFile.forEach(function (block) {
            if (!block.local[target]) {
                return;
            }

            const newPermissions = [];
            block.local[target].forEach(function (definition) {
                const name = definition.name;
                const version = block.version || packageInfos.defaultVersion;
                let matchedData: MatchedData = {};

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
                    matchedData.title = definition.title;
                    matchedData.description = definition.description;
                } else {
                    // TODO: Remove in the next version
                    if (preProcess[source][name][version]) {
                        // found the version
                        matchedData = preProcess[source][name][version];
                    } else {
                        // find nearest matching version
                        let foundIndex = -1;
                        let lastVersion = packageInfos.defaultVersion;

                        const versionKeys = Object.keys(preProcess[source][name]);
                        versionKeys.forEach(function (currentVersion, versionIndex) {
                            if (semver.gte(version, currentVersion) && semver.gte(currentVersion, lastVersion)) {
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
                            throw new WorkerError(
                                'Referenced definition has no matching or a higher version. ' +
                                    'Check version number in referenced define block.',
                                filenames[parsedFileIndex],
                                block.index,
                                messages.common.element,
                                messages.common.usage,
                                messages.common.example,
                                extra
                            );
                        }

                        const versionName = versionKeys[foundIndex];
                        matchedData = preProcess[source][name][versionName];
                    }

                    // TODO: Remove in the next version
                }

                newPermissions.push(matchedData);
            });

            // replace permissions with new permissions
            // TODO: reduce complexity and remove group
            block.local[target] = newPermissions;
        });
    });
}

/**
 * Exports
 */
module.exports = {
    preProcess: preProcess,
    postProcess: postProcess,
};
