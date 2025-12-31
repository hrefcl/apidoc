/**
 * Parser for IoT tags - defines IoT element type (function, macro, struct, enum, typedef, callback, isr)
 *
 * This parser handles the main @iot tag that defines IoT code elements. It extracts:
 * - Element type (function, macro, struct, enum, typedef, callback, isr)
 * - Element name/signature
 * - Optional title/description
 * @param content - Raw content from the IoT tag
 * @returns Parsed IoT information or null if parsing fails
 * @returns Object with .type (element type), .name (element name), and .title (optional title)
 * @example Function declaration
 * ```
 * // Input: "{function} readTemperature Read temperature from sensor"
 * // Output: { type: "function", name: "readTemperature", title: "Read temperature from sensor" }
 * ```
 * @example Struct declaration
 * ```
 * // Input: "{struct} SensorData Sensor reading data structure"
 * // Output: { type: "struct", name: "SensorData", title: "Sensor reading data structure" }
 * ```
 * @example Enum declaration
 * ```
 * // Input: "{enum} SensorStatus Status codes for sensor operations"
 * // Output: { type: "enum", name: "SensorStatus", title: "Status codes for sensor operations" }
 * ```
 * @example Macro declaration
 * ```
 * // Input: "{macro} GPIO_SET Set GPIO pin high"
 * // Output: { type: "macro", name: "GPIO_SET", title: "Set GPIO pin high" }
 * ```
 * @example ISR (Interrupt Service Routine)
 * ```
 * // Input: "{isr} TIMER0_ISR Timer 0 overflow interrupt"
 * // Output: { type: "isr", name: "TIMER0_ISR", title: "Timer 0 overflow interrupt" }
 * ```
 * @example Callback function
 * ```
 * // Input: "{callback} onDataReceived Callback when data arrives"
 * // Output: { type: "callback", name: "onDataReceived", title: "Callback when data arrives" }
 * ```
 * @since 5.1.0
 * @public
 */
export function parse(content: string): { type: string; name: string; title: string } | null {
    content = content.trim();

    // Extract only the first line (up to \n or @)
    const firstLine = content.split(/\n|@/)[0].trim();

    // Search: {type} name optional_title
    // Example: {function} readTemperature Read temperature from sensor
    // Example: {struct} SensorData Sensor data structure
    // Example: {enum} Status Status codes
    // Example: {macro} LED_ON Turn LED on
    // Example: {isr} TIMER_ISR Timer interrupt handler
    // Example: {callback} onComplete Completion callback
    const parseRegExp = /^\{(function|macro|struct|enum|typedef|callback|isr|define|const|variable|class)\}\s+(\w+)(?:\s+(.+?))?$/;
    const matches = parseRegExp.exec(firstLine);

    if (!matches) {
        return null;
    }

    const type = matches[1];
    const name = matches[2];

    // Validate element type
    const validTypes = ['function', 'macro', 'struct', 'enum', 'typedef', 'callback', 'isr', 'define', 'const', 'variable', 'class'];
    if (!validTypes.includes(type)) {
        return null;
    }

    return {
        type: type,
        name: name,
        title: matches[3] || '',
    };
}

/**
 * Target location in the data structure where parsed results are stored
 * @internal
 */
export const path = 'local';

/**
 * Processing method for this parser
 * @internal
 */
export const method = 'insert';
