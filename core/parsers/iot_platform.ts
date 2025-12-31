/**
 * @file Parser for @iotPlatform tags - handles IoT platform/board specification
 *
 * This parser processes @iotPlatform tags to specify which hardware platforms
 * the code supports. Common platforms include ESP32, ESP8266, Arduino, STM32, etc.
 * @since 5.1.0
 */

/**
 * Parse @iotPlatform content
 *
 * Handles syntax like:
 * - `@iotPlatform ESP32`
 * - `@iotPlatform Arduino Uno`
 * - `@iotPlatform {ESP32,ESP8266} WiFi-capable boards`
 * @param content Raw input string to be parsed
 * @returns Parsed platform metadata or null
 * @example Single platform
 * ```
 * // Input: "ESP32"
 * // Output: { platforms: ["ESP32"], description: "" }
 * ```
 * @example Multiple platforms
 * ```
 * // Input: "{ESP32,ESP8266,Arduino} WiFi and basic boards"
 * // Output: { platforms: ["ESP32", "ESP8266", "Arduino"], description: "WiFi and basic boards" }
 * ```
 */
function parse(content: string): {
    platforms: string[];
    description: string;
} | null {
    content = content.trim();

    if (content.length === 0) {
        return null;
    }

    let platforms: string[] = [];
    let description = '';

    // Check for multiple platforms in braces: {ESP32,ESP8266}
    const multiPlatformRegExp = /^\{([^}]+)\}\s*(.*)$/;
    const multiMatch = multiPlatformRegExp.exec(content);

    if (multiMatch) {
        // Multiple platforms specified
        platforms = multiMatch[1].split(',').map(p => p.trim()).filter(p => p.length > 0);
        description = multiMatch[2].trim();
    } else {
        // Single platform or platform with description
        const parts = content.split(/\s+/);
        platforms = [parts[0]];
        description = parts.slice(1).join(' ');
    }

    if (platforms.length === 0) {
        return null;
    }

    return {
        platforms: platforms,
        description: description,
    };
}

/**
 * Target location in the data structure where parsed results are stored
 */
export const path = 'local';

/**
 * Processing method for this parser
 */
export const method = 'insert';

export { parse };
