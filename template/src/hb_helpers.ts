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

/**
 * Helper functions for HandleBars
 */
import Handlebars from 'handlebars';
import $ from 'jquery';
import { DiffMatchPatch } from './diff_match_patch';
import { body2json } from './jsonifier';
import { __ } from './locales/locale';

/**
 * Register all helpers
 */
function register(): void {
    /**
     * Return a text as markdown.
     * Currently only a little helper to replace apidoc-inline Links (#Group:Name).
     * Should be replaced with a full markdown lib.
     */
    Handlebars.registerHelper('markdown', function (text: string): string {
        if (!text) return '';

        text = text.replace(/((\n[ \t]*){2,})/gm, '</p>$1<p>');
        text = '<p>' + text + '</p>';
        text = text.replace(/<p><\/p>/gm, '');
        text = text.replace(/<p>((\s)*)<\/p>/gm, '');

        // Sanitize links
        text = text.replace(/(\s+)?#([A-Za-z0-9_\-\.\/\:\[\]]+)(#)?(\s+)?/gm, function (match, prefix, link, _anchor, suffix) {
            const linkParts = link.split(':');
            if (linkParts.length > 1) {
                const group = linkParts[0];
                const name = linkParts[1];
                return (prefix || '') + '<a href="#api-' + group + '-' + name + '">' + name + '</a>' + (suffix || '');
            }
            return match;
        });

        return new Handlebars.SafeString(text) as any;
    });

    /**
     * start/stop timer for performance tests
     */
    Handlebars.registerHelper('startTimer', function (name: string): string {
        console.time(name);
        return '';
    });

    Handlebars.registerHelper('stopTimer', function (name: string): string {
        console.timeEnd(name);
        return '';
    });

    /**
     * Return localized text
     */
    Handlebars.registerHelper('__', function (text: string): string {
        return __(text);
    });

    /**
     * Convert JSON to pretty printed string
     */
    Handlebars.registerHelper('json', function (obj: any): string {
        return JSON.stringify(obj, null, 4);
    });

    /**
     * Convert string to JSON
     */
    Handlebars.registerHelper('body2json', function (context: any): any {
        try {
            if (typeof context === 'string') {
                return JSON.parse(context);
            }
            return body2json(context);
        } catch (e) {
            return '{}';
        }
    });

    /**
     * Diff text comparison
     */
    Handlebars.registerHelper('diffText', function (left: string, right: string): string {
        if (!left || !right) return '';

        const dmp = new DiffMatchPatch();
        const diffs = dmp.diff_main(left, right);
        dmp.diff_cleanupSemantic(diffs);

        return new Handlebars.SafeString(dmp.diffPrettyHtml(diffs)) as any;
    });

    /**
     * Sanitize HTML
     */
    Handlebars.registerHelper('sanitize', function (text: string): string {
        if (!text) return '';
        return $('<div>').text(text).html();
    });

    /**
     * Compare versions
     */
    Handlebars.registerHelper('isNewerVersion', function (version1: string, version2: string): boolean {
        if (!version1 || !version2) return false;
        return version1 > version2;
    });

    /**
     * Check if object has property
     */
    Handlebars.registerHelper('hasProperty', function (obj: any, prop: string): boolean {
        return obj && Object.prototype.hasOwnProperty.call(obj, prop);
    });

    /**
     * Get object keys
     */
    Handlebars.registerHelper('keys', function (obj: any): string[] {
        return Object.keys(obj || {});
    });

    /**
     * Mathematical operations
     */
    Handlebars.registerHelper('add', function (a: number, b: number): number {
        return a + b;
    });

    Handlebars.registerHelper('subtract', function (a: number, b: number): number {
        return a - b;
    });

    /**
     * String operations
     */
    Handlebars.registerHelper('toLowerCase', function (str: string): string {
        return (str || '').toLowerCase();
    });

    Handlebars.registerHelper('toUpperCase', function (str: string): string {
        return (str || '').toUpperCase();
    });

    /**
     * Convert underscores to spaces
     */
    Handlebars.registerHelper('underscoreToSpace', function (str: string): string {
        return (str || '').replace(/_/g, ' ');
    });

    /**
     * Conditional helpers
     */
    Handlebars.registerHelper('ifEqual', function (this: any, a: any, b: any, options: any): string {
        return a === b ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('ifNotEqual', function (this: any, a: any, b: any, options: any): string {
        return a !== b ? options.fn(this) : options.inverse(this);
    });

    /**
     * Array helpers
     */
    Handlebars.registerHelper('length', function (arr: any[]): number {
        return Array.isArray(arr) ? arr.length : 0;
    });

    Handlebars.registerHelper('first', function (arr: any[]): any {
        return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
    });

    Handlebars.registerHelper('last', function (arr: any[]): any {
        return Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : null;
    });

    /**
     * Convert newlines to <br> tags
     */
    Handlebars.registerHelper('nl2br', function (text: string): string {
        if (!text) return '';
        return new Handlebars.SafeString(text.replace(/\n/g, '<br>')) as any;
    });

    /**
     * Conditional helper with comparison operators
     */
    Handlebars.registerHelper('ifCond', function (this: any, v1: any, operator: string, v2: any, options: any): string {
        switch (operator) {
            case '==':
            case '===':
                return v1 === v2 ? options.fn(this) : options.inverse(this);
            case '!=':
            case '!==':
                return v1 !== v2 ? options.fn(this) : options.inverse(this);
            case '<':
                return v1 < v2 ? options.fn(this) : options.inverse(this);
            case '<=':
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
            case '>':
                return v1 > v2 ? options.fn(this) : options.inverse(this);
            case '>=':
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
            case '&&':
                return v1 && v2 ? options.fn(this) : options.inverse(this);
            case '||':
                return v1 || v2 ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });

    /**
     * Show diff between two versions
     */
    Handlebars.registerHelper('showDiff', function (source: any, compare: any, options?: string): string {
        let ds = '';

        if (source === compare) {
            ds = source;
        } else {
            if (!source) {
                return compare;
            }

            if (!compare) {
                return source;
            }

            const diffMatchPatch = new DiffMatchPatch();
            if (options === 'code') {
                const d = diffMatchPatch.diffLineMode(compare, source);
                ds = diffMatchPatch.diffPrettyCode(d);
            } else {
                const d = diffMatchPatch.diffMain(compare, source);
                diffMatchPatch.diffCleanupSemantic(d);
                ds = diffMatchPatch.diffPrettyHtml(d);
                ds = ds.replace(/&para;/gm, '');

                if (options === 'nl2br') {
                    ds = ds.replace(/&lt;br&gt;/gm, '<br>').replace(/&lt;\/br&gt;/gm, '</br>');
                }
            }
        }

        return new Handlebars.SafeString(ds) as any;
    });

    /**
     * Render nested object notation
     */
    Handlebars.registerHelper('nestObject', function (obj: any): string {
        if (!obj || !obj.field) return '';
        return obj.field;
    });

    /**
     * Convert dot notation to bracket notation
     */
    Handlebars.registerHelper('dot2bracket', function (obj: any): string {
        if (!obj || !obj.field) return '';
        return obj.field.replace(/\./g, '[').replace(/\[/g, "['").replace(/$/g, "']");
    });

    /**
     * Remove double quotes from string
     */
    Handlebars.registerHelper('removeDblQuotes', function (str: string): string {
        if (!str) return '';
        return str.replace(/"/g, '');
    });

    /**
     * Set input type based on field type
     */
    Handlebars.registerHelper('setInputType', function (type: string): string {
        if (!type) return 'text';
        const lowerType = type.toLowerCase();
        switch (lowerType) {
            case 'number':
            case 'integer':
                return 'number';
            case 'boolean':
                return 'checkbox';
            case 'email':
                return 'email';
            case 'password':
                return 'password';
            case 'date':
                return 'date';
            case 'url':
                return 'url';
            default:
                return 'text';
        }
    });

    /**
     * Check if value is not an object
     */
    Handlebars.registerHelper('ifNotObject', function (this: any, type: string, options: any): string {
        const isObject = type && (type.toLowerCase().includes('object') || type.toLowerCase().includes('array'));
        return !isObject ? options.fn(this) : options.inverse(this);
    });

    /**
     * Reformat content based on type
     */
    Handlebars.registerHelper('reformat', function (content: string, type: string): string {
        if (!content) return '';
        try {
            if (type === 'json') {
                return JSON.stringify(JSON.parse(content), null, 2);
            }
            return content;
        } catch (e) {
            return content;
        }
    });

    /**
     * Compare fields helper - iterates over fields for comparison
     */
    Handlebars.registerHelper('each_compare_field', function (source: any, compare: any, options: any): string {
        if (!source || !compare) return '';

        // Check if source and compare are arrays (body format) or objects with .fields property
        const sourceFields = Array.isArray(source) ? source : source.fields || [];
        const compareFields = Array.isArray(compare) ? compare : compare.fields || [];

        if (sourceFields.length === 0 && compareFields.length === 0) {
            return '';
        }

        let result = '';
        const allFieldNames = new Set([...sourceFields.map((f: any) => f.field || f.name), ...compareFields.map((f: any) => f.field || f.name)]);

        allFieldNames.forEach((fieldName) => {
            const sourceField = sourceFields.find((f: any) => (f.field || f.name) === fieldName);
            const compareField = compareFields.find((f: any) => (f.field || f.name) === fieldName);

            const context = {
                source: sourceField,
                compare: compareField,
                field: fieldName,
                typeSame: sourceField && compareField,
                typeIns: sourceField && !compareField,
                typeDel: !sourceField && compareField,
            };

            result += options.fn(context);
        });

        return result;
    });

    /**
     * Compare keys helper
     */
    Handlebars.registerHelper('each_compare_keys', function (source: any, compare: any, options: any): string {
        // Handle cases where source or compare might be undefined
        if (!source && !compare) return '';

        const sourceKeys = source ? Object.keys(source) : [];
        const compareKeys = compare ? Object.keys(compare) : [];
        const allKeys = new Set([...sourceKeys, ...compareKeys]);

        let result = '';
        allKeys.forEach((key) => {
            const sourceValue = source ? source[key] : null;
            const compareValue = compare ? compare[key] : null;

            // Debug logging for empty keys
            if (!key || key.trim() === '') {
                console.log('🔍 Empty key found in each_compare_keys:', {
                    key: `"${key}"`,
                    sourceValue: sourceValue,
                    compareValue: compareValue,
                    sourceKeys: sourceKeys,
                    compareKeys: compareKeys,
                });
            }

            result += options.fn({
                key: key,
                source: { key: key, value: sourceValue },
                compare: { key: key, value: compareValue },
                typeSame: sourceValue && compareValue,
                typeIns: sourceValue && !compareValue,
                typeDel: !sourceValue && compareValue,
            });
        });

        return result;
    });

    /**
     * Compare list field helper
     */
    Handlebars.registerHelper('each_compare_list_field', function (source: any, compare: any, options: any): string {
        const field = options.hash.field || 'name';

        if (!source || !compare) return '';

        let result = '';
        const allItems = new Set([...(source || []).map((item: any) => item[field]), ...(compare || []).map((item: any) => item[field])]);

        allItems.forEach((itemValue) => {
            const sourceItem = (source || []).find((item: any) => item[field] === itemValue);
            const compareItem = (compare || []).find((item: any) => item[field] === itemValue);

            result += options.fn({
                source: sourceItem,
                compare: compareItem,
                [field]: itemValue,
                typeSame: sourceItem && compareItem,
                typeIns: sourceItem && !compareItem,
                typeDel: !sourceItem && compareItem,
            });
        });

        return result;
    });

    /**
     * Compare title helper
     */
    Handlebars.registerHelper('each_compare_title', function (source: any, compare: any, options: any): string {
        const sourceItems = source || [];
        const compareItems = compare || [];
        const maxLength = Math.max(sourceItems.length, compareItems.length);

        let result = '';
        for (let i = 0; i < maxLength; i++) {
            const sourceItem = sourceItems[i];
            const compareItem = compareItems[i];

            result += options.fn({
                source: sourceItem,
                compare: compareItem,
                index: i,
                typeSame: sourceItem && compareItem,
                typeIns: sourceItem && !compareItem,
                typeDel: !sourceItem && compareItem,
            });
        }

        return result;
    });

    /**
     * Subtemplate helper - renders subtemplates from script tags
     */
    Handlebars.registerHelper('subTemplate', function (templateName: string, options: any): string {
        try {
            // Find the template by ID
            const templateId = `template-${templateName}`;
            const templateElement = document.getElementById(templateId);

            if (!templateElement) {
                console.warn(`Subtemplate not found: ${templateId}`);
                return `<!-- Subtemplate not found: ${templateId} -->`;
            }

            const templateHtml = templateElement.innerHTML;
            if (!templateHtml) {
                console.warn(`Subtemplate content is empty: ${templateId}`);
                return `<!-- Subtemplate content is empty: ${templateId} -->`;
            }

            // Compile and execute the template
            const template = Handlebars.compile(templateHtml);

            // Create context from options.hash and current context
            const context = {
                ...this,
                ...options.hash,
            };

            const result = template(context);

            // Return as SafeString to ensure HTML is not escaped
            return new Handlebars.SafeString(result) as any;
        } catch (error) {
            console.error(`Error rendering subtemplate ${templateName}:`, error);
            return `<!-- Error rendering subtemplate ${templateName}: ${error.message} -->`;
        }
    });
}

export { register };
