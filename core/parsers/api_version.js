"use strict";
/**
 * @file Parser for @apiVersion tags - handles API version specification and validation
 *
 * This parser processes @apiVersion tags to extract and validate semantic version strings.
 * It ensures all API versions follow semantic versioning (semver) standards for consistency
 * and compatibility checking.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendRoot = exports.method = exports.path = void 0;
exports.parse = parse;
const semver_1 = __importDefault(require("semver"));
const parameter_error_1 = require("../errors/parameter_error");
/**
 * Parse @apiVersion tag to extract and validate semantic version
 *
 * Processes @apiVersion tags by trimming whitespace and validating the version
 * string against semantic versioning standards. This ensures consistent version
 * formatting across all API documentation and enables version comparison features.
 *
 * @param content - Raw version string from the @apiVersion tag
 * @returns Object containing the validated version string, or null if content is empty
 * @throws {ParameterError} When the version string doesn't follow semver format
 *
 * @example Valid semantic version
 * ```
 * // Input: "1.2.3"
 * // Output: { version: "1.2.3" }
 * ```
 *
 * @example Version with pre-release
 * ```
 * // Input: "2.0.0-beta.1"
 * // Output: { version: "2.0.0-beta.1" }
 * ```
 *
 * @example Invalid version format
 * ```
 * // Input: "v1.2"
 * // Throws: ParameterError with usage examples
 * ```
 *
 * @example Empty content
 * ```
 * // Input: "   "
 * // Output: null
 * ```
 *
 * @since 4.0.0
 * @public
 */
function parse(content) {
    content = content.trim();
    if (content.length === 0) {
        return null;
    }
    if (!semver_1.default.valid(content)) {
        throw new parameter_error_1.ParameterError('Version format not valid.', 'apiVersion', '@apiVersion major.minor.patch', '@apiVersion 1.2.3');
    }
    return {
        version: content,
    };
}
exports.path = 'local';
exports.method = 'insert';
exports.extendRoot = true;
//# sourceMappingURL=api_version.js.map