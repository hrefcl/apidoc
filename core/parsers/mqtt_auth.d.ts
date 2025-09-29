/**
 * Parser for auth tags - defines MQTT authentication requirements
 *
 * This parser handles the auth tag that defines authentication methods and requirements
 * for MQTT connections. It extracts:
 * - Authentication type (username, tls, apikey, etc.)
 * - Optional authentication details and requirements
 *
 * @param content - Raw content from the auth tag
 * @returns Parsed authentication information with type and details, or null if parsing fails
 *
 * @example Username/password authentication
 * ```
 * // Input: "username Device credentials with TLS recommended"
 * // Output: { type: "username", details: "Device credentials with TLS recommended" }
 * ```
 *
 * @example TLS client certificate
 * ```
 * // Input: "tls mTLS client certificate authentication"
 * // Output: { type: "tls", details: "mTLS client certificate authentication" }
 * ```
 *
 * @example API key authentication
 * ```
 * // Input: "apikey Bearer token in username field"
 * // Output: { type: "apikey", details: "Bearer token in username field" }
 * ```
 *
 * @example No authentication
 * ```
 * // Input: "none Public topic, no authentication required"
 * // Output: { type: "none", details: "Public topic, no authentication required" }
 * ```
 *
 * @since 4.1.0
 * @public
 */
export declare function parse(content: string): {
    type: string;
    details: string;
} | null;
/**
 * Target location in the data structure where parsed results are stored
 *
 * @internal
 */
export declare const path = "local";
/**
 * Processing method for this parser
 *
 * @internal
 */
export declare const method = "insert";
//# sourceMappingURL=mqtt_auth.d.ts.map