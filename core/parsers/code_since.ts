/**
 * @codeSince Parser - Version when element was introduced
 *
 * Usage: @codeSince version
 *
 * Example:
 *   @codeSince 1.0.0
 *   @codeSince 2.0.0
 *   @codeSince API Level 21
 *   @codeSince iOS 14.0
 */

export function parse(content: string): { since: string } | null {
    const since = content.trim();
    if (!since) return null;
    return { since };
}

export const path = 'local.since';
export const method = 'insert';
