"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// Same as @apiUse
const apiWorker = __importStar(require("./api_use"));
// Additional information for error log
const _messages = {
    common: {
        element: 'apiErrorStructure',
        usage: '@apiErrorStructure group',
        example: '@apiDefine MyValidErrorStructureGroup Some title\n@apiErrorStructure MyValidErrorStructureGroup',
    },
};
/**
 * PreProcess API Error Structure
 *
 * Pre-processes the given parsed files, filenames, and package information
 * by delegating the operation to an API worker.
 *
 * @param parsedFiles - Array of parsed file objects to process.
 * @param filenames - Array of filenames corresponding to the parsed files.
 * @param packageInfos - Information about the package being processed.
 * @returns {object}
 */
function preProcess(parsedFiles, filenames, packageInfos) {
    return apiWorker.preProcess(parsedFiles, filenames, packageInfos, 'defineErrorStructure');
}
/**
 * PostProcess API Error Structure
 *
 * Processes the parsed files and metadata after the initial processing is completed.
 *
 * @param parsedFiles - Array of objects containing the parsed file data.
 * @param filenames - Array of filenames associated with the parsed files.
 * @param preProcess - Pre-processing function executed prior to this post-processing step.
 * @param packageInfos - Collection of package-level details and information.
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos) {
    apiWorker.postProcess(parsedFiles, filenames, preProcess, packageInfos, 'defineErrorStructure', 'errorStructure', _messages);
}
/**
 * Exports
 */
module.exports = {
    preProcess: preProcess,
    postProcess: postProcess,
};
//# sourceMappingURL=api_error_structure.js.map