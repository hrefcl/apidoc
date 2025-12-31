/**
 * @codeAnnotation Parser - Annotations/Decorators on the code element
 *
 * Usage: @codeAnnotation annotation
 *
 * Example:
 *   @codeAnnotation @Composable
 *   @codeAnnotation @MainActor
 *   @codeAnnotation @Override
 *   @codeAnnotation @discardableResult
 *   @codeAnnotation @available(iOS 14.0, *)
 */

export function parse(content: string): { annotation: string } | null {
    const annotation = content.trim();
    if (!annotation) return null;
    return { annotation };
}

export const path = 'local.annotations';
export const method = 'push';
