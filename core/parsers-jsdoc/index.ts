/**
 * @file Index file for JSDoc parsers
 *
 * Exports all JSDoc parsers for integration with the APIDoc core system.
 * These parsers handle standard JSDoc tags that are not specific to API
 * documentation but provide general code documentation features.
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

// Import all JSDoc parsers
import * as jsdocAuthor from './jsdoc_author';
import * as jsdocCopyright from './jsdoc_copyright';
import * as jsdocFile from './jsdoc_file';
import * as jsdocLicense from './jsdoc_license';
import * as jsdocPackage from './jsdoc_package';
import * as jsdocSee from './jsdoc_see';

// Import all TSDoc parsers
import * as tsdocAlpha from './tsdoc_alpha';
import * as tsdocBeta from './tsdoc_beta';
import * as tsdocExample from './tsdoc_example';
import * as tsdocInternal from './tsdoc_internal';
import * as tsdocParam from './tsdoc_param';
import * as tsdocPublic from './tsdoc_public';
import * as tsdocRemarks from './tsdoc_remarks';
import * as tsdocReturns from './tsdoc_returns';

/**
 * Collection of all available JSDoc parsers
 *
 * Maps JSDoc tag names to their corresponding parser modules.
 * Each parser follows the standard APIDoc parser interface with
 * parse(), path, and method exports.
 * @example Usage in APIDoc core
 * ```typescript
 * import { jsdocParsers } from './parsers-jsdoc';
 *
 * // Register JSDoc parsers
 * Object.entries(jsdocParsers).forEach(([tagName, parser]) => {
 *   registerParser(tagName, parser);
 * });
 * ```
 * @since 5.0.0
 * @public
 */
export const jsdocParsers = {
    // JSDoc parsers
    file: jsdocFile,
    author: jsdocAuthor,
    package: jsdocPackage,
    copyright: jsdocCopyright,
    license: jsdocLicense,
    see: jsdocSee,
    // TSDoc parsers
    alpha: tsdocAlpha,
    beta: tsdocBeta,
    example: tsdocExample,
    internal: tsdocInternal,
    param: tsdocParam,
    public: tsdocPublic,
    remarks: tsdocRemarks,
    returns: tsdocReturns,
};

/**
 * List of JSDoc tag names supported by these parsers
 * @since 5.0.0
 * @public
 */
export const supportedJSDocTags = Object.keys(jsdocParsers);

/**
 * Get a specific JSDoc parser by tag name
 * @param tagName - The JSDoc tag name (without @)
 * @returns Parser module or undefined if not found
 * @example
 * ```typescript
 * const fileParser = getJSDocParser('file');
 * if (fileParser) {
 *   const result = fileParser.parse('Main entry point');
 * }
 * ```
 * @since 5.0.0
 * @public
 */
export function getJSDocParser(tagName: string) {
    return jsdocParsers[tagName as keyof typeof jsdocParsers];
}

// Export individual parsers for direct import
export {
    // JSDoc exports
    jsdocAuthor,
    jsdocCopyright,
    jsdocFile,
    jsdocLicense,
    jsdocPackage,
    jsdocSee,
    // TSDoc exports
    tsdocAlpha,
    tsdocBeta,
    tsdocExample,
    tsdocInternal,
    tsdocParam,
    tsdocPublic,
    tsdocRemarks,
    tsdocReturns,
};
