/**
 * Parser Core Wrapper - Wraps the original compiled parser
 */

// Since the core parser is already compiled as JS, we import it directly
const parserCore = require('./parser-core.js');

// Re-export everything
export = parserCore;