/**
 * @file Parser for @apiSchema tags - handles API schema documentation
 *
 * This parser processes @apiSchema tags to extract schema definitions including:
 * - TypeScript interfaces (inline)
 * - JSON Schema files (external)
 * - Automatic parameter/success generation
 * - Type validation and documentation
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse @apiSchema content
 *
 * Supports:
 * @apiSchema (group) {interface=InterfaceName} apiParam
 * @apiSchema {jsonschema=./path/to/schema.json} apiSuccess
 * @apiSchema {interface=ResponseSuccess} apiSuccess
 */
function parse(content, source) {
  const trimmedContent = content.trim();

  if (trimmedContent.length === 0) {
    return null;
  }

  // Parse: @apiSchema (optional group) {type=value} element
  const parseRegExp = /^(?:\((.+?)\))?\s*\{(.+?)=(.+?)\}\s*(?:(.+?))?$/;
  const matches = parseRegExp.exec(trimmedContent);

  if (!matches) {
    return null;
  }

  return {
    group: matches[1] || '',
    schemaType: matches[2],
    schemaValue: matches[3],
    element: matches[4] || 'apiParam'
  };
}

/**
 * Simplified JSON Schema traversal
 */
function traverseJsonSchema(schema, prefix = '') {
  const params = {};

  if (schema.type === 'object' && schema.properties) {
    for (const [key, prop] of Object.entries(schema.properties)) {
      const fieldName = prefix ? `${prefix}.${key}` : key;
      const isRequired = schema.required?.includes(key);
      const field = isRequired ? fieldName : `[${fieldName}]`;

      const type = getJsonSchemaType(prop);
      const description = prop.description || '';

      params[fieldName] = `{${type}} ${field} ${description}`;

      // Handle nested objects
      if (prop.type === 'object' && prop.properties) {
        const nested = traverseJsonSchema(prop, fieldName);
        Object.assign(params, nested);
      }
    }
  }

  return params;
}

/**
 * Convert JSON Schema type to APIDoc type
 */
function getJsonSchemaType(schema) {
  if (schema.type === 'string') return 'String';
  if (schema.type === 'number' || schema.type === 'integer') return 'Number';
  if (schema.type === 'boolean') return 'Boolean';
  if (schema.type === 'array') {
    if (schema.items) {
      const itemType = getJsonSchemaType(schema.items);
      return `${itemType}[]`;
    }
    return 'Array';
  }
  if (schema.type === 'object') return 'Object';

  return 'Mixed';
}

/**
 * JSON Schema support (from original plugin)
 */
function parseJsonSchema(schemaPath, relativeTo) {
  const elements = [];

  try {
    const fullPath = path.resolve(path.dirname(relativeTo), schemaPath);
    const schemaContent = fs.readFileSync(fullPath, 'utf8');
    const schema = JSON.parse(schemaContent);

    // Use simplified traversal for now
    const params = traverseJsonSchema(schema);

    for (const [field, definition] of Object.entries(params)) {
      elements.push({
        source: `@apiParam ${definition}`,
        name: 'apiparam',
        sourceName: 'apiParam',
        content: definition
      });
    }
  } catch (error) {
    console.warn(`Warning: Could not parse JSON schema at ${schemaPath}:`, error.message);
  }

  return elements;
}

/**
 * Basic TypeScript interface parsing
 * This is a simplified version - for full parsing, use the TypeScript parser utility
 */
function parseBasicInterface(interfaceName) {
  // This is a placeholder - in a real implementation, we'd parse the actual interface
  // For now, just create a basic object placeholder
  return [{
    source: `@apiParam {Object} data ${interfaceName} interface`,
    name: 'apiparam',
    sourceName: 'apiParam',
    content: `{Object} data ${interfaceName} interface`
  }];
}

/**
 * Main processor function
 * This is called by the hook system to process @apiSchema elements
 */
function processor(elements, element, block, filename) {
  if (element.name !== 'apischema') {
    return elements;
  }

  // Remove the @apiSchema element from processing
  elements.pop();

  const parsed = parse(element.content, element.source);
  if (!parsed) {
    console.warn(`Warning: Could not parse @apiSchema: ${element.content}`);
    return elements;
  }

  let newElements = [];

  if (parsed.schemaType === 'interface') {
    // Handle TypeScript interface
    const interfaceName = parsed.schemaValue;
    console.warn(`TypeScript interface parsing for '${interfaceName}' - using basic fallback`);
    newElements = parseBasicInterface(interfaceName);

  } else if (parsed.schemaType === 'jsonschema') {
    // Handle JSON Schema file
    newElements = parseJsonSchema(parsed.schemaValue, filename);

    // Update element names if not apiParam
    if (parsed.element !== 'apiParam') {
      newElements.forEach(el => {
        el.name = parsed.element.toLowerCase();
        el.sourceName = parsed.element;
        el.source = el.source.replace('@apiParam', `@${parsed.element}`);
      });
    }
  }

  // Add group information if specified
  if (parsed.group) {
    newElements.forEach(el => {
      el.content = `(${parsed.group}) ${el.content}`;
      el.source = el.source.replace(`{`, `(${parsed.group}) {`);
    });
  }

  // Add new elements to the list
  newElements.forEach(el => elements.push(el));

  return elements;
}

/**
 * Initialize the schema processor hook
 */
function init(app) {
  console.log('DEBUG: Initializing apiSchema parser hook');
  app.addHook('parser-find-elements', processor, 200);
}

/**
 * Exports
 */
module.exports = {
  parse: parse,
  path: 'local',
  method: 'push',
  markdownFields: [],
  markdownRemoveFields: [],
  init: init
};