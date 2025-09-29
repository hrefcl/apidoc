// Same as @apiParamTitle
import * as apiWorker from './api_param_title';

// Additional information for error log
const _messages = {
    common: {
        element: 'apiSuccess',
        usage: '@apiSuccess (group) varname',
        example: '@apiDefine MyValidSuccessGroup Some title or 200 OK\n@apiSuccess (MyValidSuccessGroup) username',
    },
};

/**
 * PreProcess API Success Title
 *
 * Pre-processes the given parsed files, filenames, and package information
 * by delegating the operation to an API worker.
 * @param parsedFiles - Array of parsed file objects to process.
 * @param filenames - Array of filenames corresponding to the parsed files.
 * @param packageInfos - Object containing package information to apply during processing.
 * @returns {object}
 */
function preProcess(parsedFiles, filenames, packageInfos) {
    return apiWorker.preProcess(parsedFiles, filenames, packageInfos, 'defineSuccessTitle');
}

/**
 * PostProcess API Success Title
 *
 * Processes the parsed files and metadata after the initial processing is completed.
 * @param parsedFiles - Array of objects containing the parsed file data.
 * @param filenames - Array of filenames associated with the parsed files.
 * @param preProcess - Pre-processing results containing defined titles.
 * @param packageInfos - Collection of package-level details and information.
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos) {
    apiWorker.postProcess(parsedFiles, filenames, preProcess, packageInfos, 'defineSuccessTitle', 'success', _messages);
}

/**
 * Exports
 */
module.exports = {
    preProcess: preProcess,
    postProcess: postProcess,
};
