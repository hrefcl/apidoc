"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.method = exports.path = void 0;
exports.parse = parse;
/**
 * Parse to extract API private
 *
 * @returns {{private: boolean}} Return an object with the `private` property always set to true.
 */
function parse() {
    return {
        private: true,
    };
}
exports.path = 'local';
exports.method = 'insert';
//# sourceMappingURL=api_private.js.map