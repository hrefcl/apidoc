"use strict";
/**
 * @file Worker for @apiStructure tags - processes reusable parameter structures
 *
 * This worker handles @apiStructure tags that allow definition and inclusion of
 * reusable parameter structures. It delegates most processing to the @apiUse worker
 * but with specific configuration for structure definitions.
 */
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
exports.postProcess = postProcess;
exports.preProcess = preProcess;
const apiWorker = __importStar(require("./api_use"));
// Additional information for error log
const _messages = {
    common: {
        element: 'apiStructure',
        usage: '@apiStructure group',
        example: '@apiDefine MyValidStructureGroup Some title\n@apiStructure MyValidStructureGroup',
    },
};
/**
 * PreProcess API Structure tags to collect structure definitions
 *
 * First phase of @apiStructure processing that delegates to the @apiUse worker
 * to collect @apiDefine blocks specifically for parameter structures. These
 * structures define reusable parameter patterns that can be included in multiple endpoints.
 *
 * @param parsedFiles - Array of parsed file objects containing structure definitions
 * @param filenames - Array of filenames for the parsed files
 * @param packageInfos - Package information for version handling
 * @returns Object containing collected structure definitions organized by name and version
 *
 * @example Structure definition collection
 * ```typescript
 * // Collects @apiDefine blocks marked for structure use
 * const result = preProcess(parsedFiles, filenames, packageInfos);
 * // Returns: { defineStructure: { "UserStructure": { "1.0.0": {...} } } }
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function preProcess(parsedFiles, filenames, packageInfos) {
    return apiWorker.preProcess(parsedFiles, filenames, packageInfos, 'defineStructure');
}
/**
 * PostProcess API Structure tags to include structure definitions
 *
 * Second phase of @apiStructure processing that delegates to the @apiUse worker
 * to find @apiStructure references and replace them with the corresponding
 * structure definitions. This enables reuse of complex parameter structures
 * across multiple API endpoints.
 *
 * @param parsedFiles - Array of parsed file objects to process for @apiStructure references
 * @param filenames - Array of filenames for error reporting
 * @param preProcess - Previously collected structure definitions from preprocessing
 * @param packageInfos - Package information for version matching
 *
 * @throws {WorkerError} When referenced structure doesn't exist (via delegated worker)
 * @throws {WorkerError} When version matching fails (via delegated worker)
 *
 * @example Structure inclusion
 * ```typescript
 * // Before: block contains @apiStructure UserStructure
 * postProcess(parsedFiles, filenames, preProcess, packageInfos);
 * // After: UserStructure parameters are merged into the block
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function postProcess(parsedFiles, filenames, preProcess, packageInfos) {
    apiWorker.postProcess(parsedFiles, filenames, preProcess, packageInfos, 'defineStructure', 'structure', _messages);
}
//# sourceMappingURL=api_structure.js.map