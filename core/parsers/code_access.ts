/**
 * @codeAccess Parser - Access modifier
 *
 * Usage: @codeAccess modifier
 *
 * Modifiers:
 *   - public: Accessible from anywhere
 *   - private: Only accessible within the class
 *   - protected: Accessible within class and subclasses
 *   - internal: Accessible within the module (Kotlin/Swift)
 *   - fileprivate: Accessible within the file (Swift)
 *   - package: Package-private (Java)
 *   - open: Can be overridden (Kotlin)
 *
 * Example:
 *   @codeAccess public
 *   @codeAccess private
 *   @codeAccess internal
 */

export function parse(content: string): { access: string } | null {
    const access = content.trim().toLowerCase();
    if (!access) return null;
    return { access };
}

export const path = 'local.access';
export const method = 'insert';
