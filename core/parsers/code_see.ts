/**
 * @codeSee Parser - Cross-references to related code
 *
 * Usage: @codeSee reference [description]
 *
 * Example:
 *   @codeSee UserRepository.saveUser For saving users
 *   @codeSee https://example.com/docs Documentation
 *   @codeSee User Related model
 */

export function parse(content: string): { reference: string; description: string } | null {
    if (!content.trim()) return null;

    const parts = content.trim().split(/\s+/);
    const reference = parts[0] || '';
    const description = parts.slice(1).join(' ');

    return {
        reference,
        description,
    };
}

export const path = 'local.see';
export const method = 'push';
