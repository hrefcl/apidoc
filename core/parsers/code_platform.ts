/**
 * @codePlatform Parser - Target platform(s)
 *
 * Usage: @codePlatform platform1, platform2, ...
 * Platforms: android, ios, macos, windows, linux, web, server, desktop, mobile, embedded, watchos, tvos, wasm
 */

export function parse(content: string): { platforms: string[] } | null {
    const platforms = content
        .split(/[,\s]+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

    if (platforms.length === 0) return null;
    return { platforms };
}

export const path = 'local';
export const method = 'insert';
