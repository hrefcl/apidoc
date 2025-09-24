// Same as @apiParamTitle
import * as apiWorker from './api_param_title';

// Additional information for error log
const _messages = {
    common: {
        element: 'apiError',
        usage: '@apiError (group) varname',
        example: '@apiDefine MyValidErrorGroup Some title or 40X Error\n@apiError (MyValidErrorGroup) username',
    },
};

/**
 * PreProcess API Error Title
 *
 * Pre-processes the given parsed files, filenames, and package information
 * by delegating the operation to an API worker.
 *
 * @param {Array<object>} parsedFiles - Array of parsed file objects to process.
 * @param {Array<string>} filenames - Array of filenames corresponding to the parsed files.
 * @param {object} packageInfos - Object containing package information to apply during processing.
 * @returns {object}
 */
function preProcess(parsedFiles, filenames, packageInfos) {
    return apiWorker.preProcess(parsedFiles, filenames, packageInfos, 'defineErrorTitle');
}

/**
 * PostProcess API Error Title
 *
 * Processes the parsed files and metadata after the initial processing is completed.
 *
 * @param {Array<object>} parsedFiles - Array of objects containing the parsed file data.
 * @param {Array<string>} filenames - Array of filenames associated with the parsed files.
 * @param {Function} preProcess - Pre-processing function executed prior to this post-processing step.
 * @param {object} packageInfos - Collection of package-level details and information.
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos) {
    apiWorker.postProcess(parsedFiles, filenames, preProcess, packageInfos, 'defineErrorTitle', 'error', _messages);
}

/**
 * Exports
 */
module.exports = {
    preProcess: preProcess,
    postProcess: postProcess,
};
