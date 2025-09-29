"use strict";
/**
 * @file Parser for @apiSuccess tags - handles API success response documentation
 *
 * This parser processes @apiSuccess tags to extract success response field definitions.
 * It reuses the @apiParam parsing logic but applies it specifically to success response
 * fields with the default group "Success 200".
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownRemovePTags = exports.markdownFields = exports.method = void 0;
exports.parse = parse;
exports.path = path;
const apiParser = __importStar(require("./api_param"));
/**
 * Parse @apiSuccess tag to extract success response field information
 *
 * Processes @apiSuccess tags using the same syntax as @apiParam but specifically
 * for success response fields. Automatically assigns the "Success 200" group
 * unless a different group is specified in the tag.
 *
 * @param content - Raw content from the @apiSuccess tag
 * @param source - Source file path (unused but required for interface compatibility)
 * @returns Parsed success response field information or null if parsing fails
 *
 * @example Basic success field
 * ```
 * // Input: "{String} name User's full name"
 * // Output: { type: "String", field: "name", description: "User's full name", group: "Success 200" }
 * ```
 *
 * @example Success field with custom group
 * ```
 * // Input: "(Success 201) {String} id Created resource ID"
 * // Output: { type: "String", field: "id", description: "Created resource ID", group: "Success 201" }
 * ```
 *
 * @example Nested success object
 * ```
 * // Input: "{Object} user User data object"
 * // Output: { type: "Object", field: "user", description: "User data object", group: "Success 200" }
 * ```
 *
 * @since 4.0.0
 * @public
 */
function parse(content, source) {
    return apiParser.parse(content, source, 'Success 200');
}
/**
 * Generate the data path for storing success response fields
 *
 * Constructs a hierarchical path string that determines where success response
 * field data is stored in the parsed API data structure. The path includes the
 * current group to organize fields by response status code.
 *
 * @returns Path string in format "local.success.fields.{group}"
 *
 * @example
 * ```
 * // If current group is "Success 200"
 * // Returns: "local.success.fields.Success 200"
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function path() {
    return 'local.success.fields.' + apiParser.getGroup();
}
exports.method = apiParser.method;
exports.markdownFields = ['description', 'type'];
exports.markdownRemovePTags = ['type'];
//# sourceMappingURL=api_success.js.map