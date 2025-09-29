/**
 * @file JSON Generation Utilities for APIDoc Template
 *
 * Provides utilities for converting API parameter definitions into formatted
 * JSON objects for documentation examples. Handles complex nested structures,
 * arrays, and type-based value generation for creating realistic API examples.
 *
 * Features:
 * - Type-aware JSON generation
 * - Nested object and array support
 * - Default value handling
 * - Locale-aware date formatting
 * - Pretty-printed JSON output
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 4.0.0
 * @internal
 */

/**
 * Represents a field item with metadata for JSON generation
 *
 * @since 4.0.0
 * @internal
 */
interface FieldItem {
    /** Parent node information for nested structures */
    parentNode?: {
        /** Path to the parent node */
        path: string;
    };
    /** Field name/key */
    field: string;
    /** Data type (String, Number, Boolean, Object, Array, etc.) */
    type: string;
    /** Whether this field is optional */
    optional?: boolean;
}

/**
 * Represents a context entry for JSON body generation
 *
 * @since 4.0.0
 * @internal
 */
interface ContextEntry {
    /** Data type for the field */
    type: string;
    /** Default value to use if no type-specific value is generated */
    defaultValue?: any;
}

/**
 * Tuple representing a field and its value for JSON generation
 *
 * @since 4.0.0
 * @internal
 */
type FieldEntry = [FieldItem, any];

/**
 * Convert field entries to a formatted JSON string
 *
 * Takes an array of field definitions and their values, builds a nested
 * object structure, and returns a formatted JSON string. Handles complex
 * nested objects, arrays, and optional field optimization.
 *
 * @param items - Array of field entries with metadata and values
 * @returns Formatted JSON string representation
 *
 * @example Basic usage
 * ```typescript
 * const fields: FieldEntry[] = [
 *   [{ field: 'name', type: 'String' }, 'John Doe'],
 *   [{ field: 'age', type: 'Number' }, 30]
 * ];
 * fieldsToJson(fields);
 * // Returns: '{\n    "name": "John Doe",\n    "age": 30\n}'
 * ```
 *
 * @since 4.0.0
 * @internal
 */
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
 * Format an object as a pretty-printed JSON string
 *
 * Converts a JavaScript object to a formatted JSON string with 4-space
 * indentation for better readability in documentation examples.
 *
 * @param obj - Object to convert to formatted JSON
 * @returns Pretty-printed JSON string with 4-space indentation
 *
 * @example Format an object
 * ```typescript
 * const data = { name: 'John', age: 30 };
 * beautify(data);
 * // Returns:
 * // {
 * //     "name": "John",
 * //     "age": 30
 * // }
 * ```
 *
 * @since 4.0.0
 * @public
 */
function beautify(obj: any): string {
    return JSON.stringify(obj, null, 4);
}

/**
 * Generate JSON from API parameter context definitions
 *
 * Takes an array of parameter definitions and generates appropriate
 * example values based on their types. Supports various data types
 * including String, Number, Boolean, and Date with locale-aware formatting.
 *
 * @param context - Array of parameter definitions with types and default values
 * @returns Formatted JSON string with generated example values
 *
 * @example Generate JSON from parameters
 * ```typescript
 * const context: ContextEntry[] = [
 *   { type: 'String', defaultValue: 'John Doe' },
 *   { type: 'Number', defaultValue: '25' },
 *   { type: 'Boolean', defaultValue: 'true' },
 *   { type: 'Date' }
 * ];
 * body2json(context);
 * // Returns:
 * // {
 * //     "param1": "John Doe",
 * //     "param2": 25,
 * //     "param3": true,
 * //     "param4": "1/15/2025"
 * // }
 * ```
 *
 * @since 4.0.0
 * @public
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
