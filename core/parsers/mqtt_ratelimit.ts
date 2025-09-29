/**
 * Parser for ratelimit tags - defines MQTT rate limiting recommendations
 *
 * This parser handles the ratelimit tag that defines recommended rate limits
 * for MQTT publishing or subscribing. It extracts:
 * - Rate value (number)
 * - Time unit (second, minute, hour, day)
 * - Optional description
 *
 * @param content - Raw content from the ratelimit tag
 * @returns Parsed rate limit information, or null if parsing fails
 *
 * @example Messages per second
 * ```
 * // Input: "10/second Maximum telemetry frequency"
 * // Output: { rate: 10, unit: "second", description: "Maximum telemetry frequency" }
 * ```
 *
 * @example Commands per minute
 * ```
 * // Input: "5/minute Command rate limit per device"
 * // Output: { rate: 5, unit: "minute", description: "Command rate limit per device" }
 * ```
 *
 * @example Simple rate limit
 * ```
 * // Input: "100/hour"
 * // Output: { rate: 100, unit: "hour", description: "" }
 * ```
 *
 * @since 4.1.0
 * @public
 */
export function parse(content: string): { rate: number; unit: string; description: string } | null {
    content = content.trim();

    if (!content) {
        return null;
    }

    // Parse rate limit format: "number/unit optional description"
    // Example: "10/second Maximum telemetry frequency"
    const parseRegExp = /^(\d+)\/([a-zA-Z]+)\s*(.*)?$/;
    const matches = parseRegExp.exec(content);

    if (!matches) {
        return null;
    }

    const rate = parseInt(matches[1], 10);
    const unit = matches[2].toLowerCase();
    const description = matches[3] ? matches[3].trim() : '';

    // Validate rate is positive
    if (rate <= 0) {
        return null;
    }

    // Validate unit is a recognized time unit
    const validUnits = ['second', 'minute', 'hour', 'day', 'sec', 'min', 'hr'];
    if (!validUnits.includes(unit)) {
        return null;
    }

    // Normalize common abbreviations
    let normalizedUnit = unit;
    if (unit === 'sec') normalizedUnit = 'second';
    if (unit === 'min') normalizedUnit = 'minute';
    if (unit === 'hr') normalizedUnit = 'hour';

    return {
        rate: rate,
        unit: normalizedUnit,
        description: description,
    };
}

/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
export const path = 'local';

/**
 * Processing method for this parser
 *
 * @internal
 */
export const method = 'insert';