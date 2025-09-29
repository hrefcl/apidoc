/**
 * @file Parser for @package tags - handles package information
 *
 * This parser processes @package tags to extract package name and namespace information.
 * Package information is used for organizing documentation by module or namespace.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

/**
 * Parse @package tag to extract package/namespace information
 *
 * Processes @package tags to identify the module, namespace, or package that
 * the documented code belongs to. This is used for organizing documentation
 * hierarchically and generating proper navigation structures.
 * @param content - Raw content from the @package tag
 * @returns Object containing package information, or null if content is empty
 * @example Simple package name
 * ```
 * // Input: "MyPackage"
 * // Output: { packageName: "MyPackage" }
 * ```
 * @example Namespaced package
 * ```
 * // Input: "MyCompany.MyPackage"
 * // Output: {
 * //   packageName: "MyCompany.MyPackage",
 * //   packageNamespace: "MyCompany",
 * //   packageModule: "MyPackage"
 * // }
 * ```
 * @example Deep namespace
 * ```
 * // Input: "com.example.utils.auth"
 * // Output: {
 * //   packageName: "com.example.utils.auth",
 * //   packageNamespace: "com.example.utils",
 * //   packageModule: "auth"
 * // }
 * ```
 * @example Empty content
 * ```
 * // Input: "   "
 * // Output: null
 * ```
 * @since 5.0.0
 * @public
 */
export function parse(content: string): { packageName: string; packageNamespace?: string; packageModule?: string } | null {
    const packageName = content.trim();

    if (packageName.length === 0) {
        return null;
    }

    const result = { packageName };

    // Check if package has namespace (contains dots)
    if (packageName.includes('.')) {
        const parts = packageName.split('.');
        const module = parts.pop(); // Last part is the module
        const namespace = parts.join('.'); // Everything before is namespace

        return {
            ...result,
            packageNamespace: namespace,
            packageModule: module,
        };
    }

    return result;
}

// Parser configuration - defines how this parser integrates with APIDoc
export const path: string = 'local';
export const method: string = 'insert';
