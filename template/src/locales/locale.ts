/*
 * apidocts
 * https://apidoc.app
 * https://apidoc.app
 * Href Spa API Doc (TypeScript version)
 *
 * Author: Href Spa <hola@apidoc.app>
 * Copyright (c) 2025 Href SpA
 * Licensed under the MIT license.
 *
 * This project is a TypeScript refactor inspired by the original apidoc project.
 */

import { ca } from './ca';
import { cs } from './cs';
import { de } from './de';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { nl } from './nl';
import { pl } from './pl';
import { ptBr } from './pt_br';
import { ro } from './ro';
import { ru } from './ru';
import { tr } from './tr';
import { vi } from './vi';
import { zhCn } from './zh_cn';

/**
 * Interface for localization strings
 */
export interface LocaleStrings {
    'Allowed values:'?: string;
    'Compare all with predecessor'?: string;
    'compare changes to:'?: string;
    'compared to'?: string;
    'Default value:'?: string;
    Description?: string;
    Error?: string;
    Field?: string;
    General?: string;
    'Generated with'?: string;
    Name?: string;
    'No response values.'?: string;
    optional?: string;
    Parameter?: string;
    'Permission:'?: string;
    required?: string;
    Response?: string;
    Send?: string;
    'Send a Sample Request'?: string;
    'show up to version:'?: string;
    'Size range:'?: string;
    'Success 200'?: string;
    'Toggle navigation'?: string;
    Type?: string;
    url?: string;
    Copy?: string;
    'Press Ctrl+C to copy'?: string;
    'copied!'?: string;
    'Body Parameters'?: string;
    'Header Parameters'?: string;
    'Query Parameters'?: string;
}

/**
 * Language localization
 *
 * Keys are ISO 639-1 language codes or locale identifiers
 * (e.g., 'en', 'fr', 'zh_cn'). Values are the corresponding localization
 * objects.
 */
const locales: Record<string, LocaleStrings> = {
    ca: ca,
    cn: zhCn,
    cs: cs,
    de: de,
    es: es,
    en: {},
    fr: fr,
    it: it,
    nl: nl,
    pl: pl,
    pt: ptBr,
    pt_br: ptBr,
    ro: ro,
    ru: ru,
    tr: tr,
    vi: vi,
    // for chinese, allow cn, zh and zh_cn
    zh: zhCn,
    zh_cn: zhCn,
};

/**
 * A string representing the two-letter language code determined from the user's browser settings.
 */
const lang: string = (window.navigator.language ?? 'en-GB').toLowerCase().substring(0, 2);

let locale: LocaleStrings = locales[lang] ? locales[lang] : locales.en;

/**
 * Translates given text based on current locale settings.
 * @param text - Text to be translated.
 * @returns Translated text if a translation exists; otherwise, the original text.
 */
function __(text: string): string {
    const index = locale[text as keyof LocaleStrings];
    if (index === undefined) {
        return text;
    }
    return index;
}

/**
 * Set the application language to the specified language code.
 * @param language - Language code to set. Must be a valid key within the "locales" object.
 * @throws Throws an error if the provided language code is not valid.
 */
function setLanguage(language: string): void {
    if (!Object.prototype.hasOwnProperty.call(locales, language)) {
        throw new Error(`Invalid value for language setting! Available values are ${Object.keys(locales).join(',')}`);
    }
    locale = locales[language];
}

export { __, lang, locale, setLanguage };
