/**
 * Parse to extract API private
 * @returns {{private: boolean}} Return an object with the `private` property always set to true.
 */
function parse() {
    return {
        private: true,
    };
}

/**
 * Exports
 */
export { parse };
export const path = 'local';
export const method = 'insert';
