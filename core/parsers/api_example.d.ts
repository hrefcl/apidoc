/**
 * @file Parser for @apiExample tags - handles API request/response examples
 *
 * This parser processes @apiExample tags to extract code examples with optional
 * type specification and titles. Examples are used to show actual usage of API endpoints.
 */
/**
 * Parse @apiExample tag to extract example code with metadata
 *
 * Processes @apiExample tags to extract example code snippets with optional
 * type and title information. Supports various formats including JSON, XML,
 * cURL commands, and other code examples.
 *
 * @param content - Raw example content from the @apiExample tag
 * @param source - Source metadata containing type and title information
 * @returns Object containing title, content, and type, or null if no content
 *
 * @example Basic JSON example
 * ```
 * // Input: "@apiExample {json} Request
 * //          {
 * //            "name": "John"
 * //          }"
 * // Output: { title: "Request", content: "{\n  \"name\": \"John\"\n}", type: "json" }
 * ```
 *
 * @example cURL example
 * ```
 * // Input: "@apiExample {curl} Example usage
 * //          curl -X GET http://api.example.com/users"
 * // Output: { title: "Example usage", content: "curl -X GET http://api.example.com/users", type: "curl" }
 * ```
 *
 * @example Example without type (defaults to json)
 * ```
 * // Input: "@apiExample Simple example
 * //          { "status": "ok" }"
 * // Output: { title: "Simple example", content: "{ \"status\": \"ok\" }", type: "json" }
 * ```
 *
 * @since 4.0.0
 * @public
 */
declare function parse(content: string, source: string): {
    title: string;
    content: string;
    type: string;
} | null;
export { parse };
export declare const path = "local.examples";
export declare const method = "push";
//# sourceMappingURL=api_example.d.ts.map