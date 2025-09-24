/*
 * apidocts
 * https://apidocts.com
 * https://apidoc.app
 * Href Spa API Doc (TypeScript version)
 *
 * Author: Href Spa <hola@apidoc.app>
 * Copyright (c) 2025 Href SpA
 * Licensed under the MIT license.
 *
 * This project is a TypeScript refactor inspired by the original apidoc project.
 */

interface FieldItem {
    parentNode?: {
        path: string;
    };
    field: string;
    type: string;
    optional?: boolean;
}

interface ContextEntry {
    type: string;
    defaultValue?: any;
}

type FieldEntry = [FieldItem, any];

const fieldsToJson = (items: FieldEntry[]): string => {
    let obj: any = {};

    const _get = (obj: any, path: string): any => {
        return path.split('.').reduce((o: any, key: string) => {
            if (o) {
                if (o[key]) {
                    return o[key];
                } else if (Array.isArray(o) && o[0] && o[0][key]) {
                    return o[0][key];
                }
            }
            return null;
        }, obj);
    };

    const _set = (parentPtr: any, key: string, value: any): void => {
        if (parentPtr) {
            if (Array.isArray(parentPtr)) {
                if (!parentPtr.length) {
                    parentPtr.push({ [key]: value });
                } else {
                    parentPtr[0][key] = value;
                }
            } else {
                parentPtr[key] = value;
            }
        } else {
            obj[key] = value;
        }
    };

    items.forEach((item) => {
        const { parentNode, field, type } = item[0];
        const parentPtr = parentNode ? _get(obj, parentNode.path) : undefined;
        const key = parentPtr && parentNode ? field.substring(parentNode.path.length + 1) : field;
        const isArray = type.indexOf('[]') !== -1;

        // Object / array of Object
        if (type.indexOf('Object') !== -1) {
            _set(parentPtr, key, isArray ? [] : {});
        } else {
            // all types / array of types
            _set(parentPtr, key, isArray ? [] : item[1]);
        }
    });

    // if result contains only one property that is optional, and this is an
    // array of objects, remove the key
    const objKeys = Object.keys(obj);
    if (objKeys.length === 1 && items[0] && items[0][0].optional) {
        obj = obj[objKeys[0]];
    }

    return beautify(obj);
};

/**
 * Stringify an object to JSON, with spaces.
 * @param obj - Object converted into JSON
 * @returns Formatted JSON string
 */
function beautify(obj: any): string {
    return JSON.stringify(obj, null, 4);
}

/**
 * Converts a given context of entries into a JSON object.
 * @param context - An array of entries where each entry details a
 *     field, its type, and optionally its default value.
 * @returns JSON of the fields defined in context. Each field
 *     is assigned a value based on its type and defaultValue.
 */
function body2json(context: ContextEntry[]): string {
    // build an array of fields with their type
    const fields: FieldEntry[] = [];

    context.forEach((entry) => {
        let val: any;
        switch (entry.type.toLowerCase()) {
            case 'string':
                val = entry.defaultValue || '';
                break;
            case 'boolean':
                val = Boolean(entry.defaultValue) || false;
                break;
            case 'number':
                val = parseInt(entry.defaultValue || 0, 10);
                break;
            case 'date':
                // date field will have default value or formatted date of today in current locale
                const locale = typeof window !== 'undefined' && window.navigator?.language ? window.navigator.language : 'en-US';
                val = entry.defaultValue || new Date().toLocaleDateString(locale);
                break;
            default:
                val = entry.defaultValue || '';
        }
        fields.push([entry as any, val]);
    });

    return fieldsToJson(fields);
}

export { beautify, body2json };
