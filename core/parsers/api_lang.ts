/**
 * @file Parser for @apiLang tags - handles language/locale specification for i18n
 *
 * This parser processes @apiLang tags to extract and validate ISO 639-1 language codes.
 * It enables multi-language documentation by allowing multiple blocks of the same
 * endpoint with different language annotations.
 */

import { ParameterError } from '../errors/parameter_error';

/**
 * ISO 639-1 two-letter language codes
 * Common languages supported - can be extended as needed
 */
const SUPPORTED_LANGS = new Set([
    'aa',
    'ab',
    'ae',
    'af',
    'ak',
    'am',
    'an',
    'ar',
    'as',
    'av',
    'ay',
    'az',
    'ba',
    'be',
    'bg',
    'bh',
    'bi',
    'bm',
    'bn',
    'bo',
    'br',
    'bs',
    'ca',
    'ce',
    'ch',
    'co',
    'cr',
    'cs',
    'cu',
    'cv',
    'cy',
    'da',
    'de',
    'dv',
    'dz',
    'ee',
    'el',
    'en',
    'eo',
    'es',
    'et',
    'eu',
    'fa',
    'ff',
    'fi',
    'fj',
    'fo',
    'fr',
    'fy',
    'ga',
    'gd',
    'gl',
    'gn',
    'gu',
    'gv',
    'ha',
    'he',
    'hi',
    'ho',
    'hr',
    'ht',
    'hu',
    'hy',
    'hz',
    'ia',
    'id',
    'ie',
    'ig',
    'ii',
    'ik',
    'io',
    'is',
    'it',
    'iu',
    'ja',
    'jv',
    'ka',
    'kg',
    'ki',
    'kj',
    'kk',
    'kl',
    'km',
    'kn',
    'ko',
    'kr',
    'ks',
    'ku',
    'kv',
    'kw',
    'ky',
    'la',
    'lb',
    'lg',
    'li',
    'ln',
    'lo',
    'lt',
    'lu',
    'lv',
    'mg',
    'mh',
    'mi',
    'mk',
    'ml',
    'mn',
    'mr',
    'ms',
    'mt',
    'my',
    'na',
    'nb',
    'nd',
    'ne',
    'ng',
    'nl',
    'nn',
    'no',
    'nr',
    'nv',
    'ny',
    'oc',
    'oj',
    'om',
    'or',
    'os',
    'pa',
    'pi',
    'pl',
    'ps',
    'pt',
    'qu',
    'rm',
    'rn',
    'ro',
    'ru',
    'rw',
    'sa',
    'sc',
    'sd',
    'se',
    'sg',
    'si',
    'sk',
    'sl',
    'sm',
    'sn',
    'so',
    'sq',
    'sr',
    'ss',
    'st',
    'su',
    'sv',
    'sw',
    'ta',
    'te',
    'tg',
    'th',
    'ti',
    'tk',
    'tl',
    'tn',
    'to',
    'tr',
    'ts',
    'tt',
    'tw',
    'ty',
    'ug',
    'uk',
    'ur',
    'uz',
    've',
    'vi',
    'vo',
    'wa',
    'wo',
    'xh',
    'yi',
    'yo',
    'za',
    'zh',
    'zu',
]);

/**
 * Parse @apiLang tag to extract and validate ISO 639-1 language code
 *
 * Processes @apiLang tags by trimming whitespace and validating the language code
 * against ISO 639-1 standard. This enables multi-language documentation where
 * the same endpoint can have different descriptions/params/responses in different languages.
 *
 * Unlike @apiVersion, @apiLang is completely optional. If not specified, the content
 * is considered language-neutral and will be used as fallback.
 *
 * @param content - Raw language code from the @apiLang tag (e.g., "es", "en", "zh")
 * @returns Object containing the validated language code, or null if content is empty
 * @throws {ParameterError} When the language code is not a valid ISO 639-1 code
 *
 * @example Spanish documentation
 * ```
 * // Input: "es"
 * // Output: { lang: "es" }
 * ```
 *
 * @example Chinese documentation
 * ```
 * // Input: "zh"
 * // Output: { lang: "zh" }
 * ```
 *
 * @example Invalid language code
 * ```
 * // Input: "spanish"
 * // Throws: ParameterError - must use ISO 639-1 code
 * ```
 *
 * @example Empty content (language-neutral)
 * ```
 * // Input: "   "
 * // Output: null  (will be treated as language-neutral fallback)
 * ```
 *
 * @since 5.0.0
 * @public
 */
function parse(content: string): { lang: string } | null {
    content = content.trim().toLowerCase();

    // If empty, return null (language-neutral content)
    if (content.length === 0) {
        return null;
    }

    // Validate ISO 639-1 format (2 letters)
    if (content.length !== 2) {
        throw new ParameterError('Language code must be ISO 639-1 format (2 letters).', 'apiLang', '@apiLang <iso-639-1-code>', '@apiLang es\n@apiLang en\n@apiLang zh\n@apiLang fr');
    }

    // Check if it's a supported language code
    if (!SUPPORTED_LANGS.has(content)) {
        throw new ParameterError(
            `Language code "${content}" is not a valid ISO 639-1 code.`,
            'apiLang',
            '@apiLang <iso-639-1-code>',
            '@apiLang es (Spanish)\n@apiLang en (English)\n@apiLang zh (Chinese)\n@apiLang ja (Japanese)'
        );
    }

    return {
        lang: content,
    };
}

/**
 * Exports
 */
export { parse };
export const path = 'local';
export const method = 'insert';
export const extendRoot = true;
