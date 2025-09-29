/**
 * @file Parser for @apiVersion tags - handles API version specification and validation
 *
 * This parser processes @apiVersion tags to extract and validate semantic version strings.
 * It ensures all API versions follow semantic versioning (semver) standards for consistency
 * and compatibility checking.
 */
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
declare function parse(content: string): {
    version: string;
} | null;
/**
 * Exports
 */
export { parse };
export declare const path = "local";
export declare const method = "insert";
export declare const extendRoot = true;
//# sourceMappingURL=api_version.d.ts.map