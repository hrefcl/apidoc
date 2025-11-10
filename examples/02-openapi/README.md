# OpenAPI Integration Example

## Overview

This example demonstrates how to integrate external OpenAPI 3.0 specifications (YAML/JSON files) with APIDoc v5. It shows how to import complete OpenAPI specs or specific paths, maintaining full OpenAPI semantics and compatibility.

## Parser Used

**Parser**: `openapi` (OpenAPI 3.0 Parser)

This parser processes external OpenAPI 3.0 specification files and converts them into APIDoc documentation. It supports both YAML and JSON formats and handles `$ref` resolution automatically.

## How it Works

The `openapi` parser reads OpenAPI specification files and extracts:

### Supported Features

- **Complete Spec Loading**: Load entire OpenAPI files with all paths and operations
- **Selective Path Loading**: Import only specific paths from OpenAPI files
- **Schema Resolution**: Automatic resolution of `$ref` references and `components`
- **All HTTP Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
- **Parameter Types**: Path, query, header, and body parameters
- **Response Schemas**: Multiple status codes with detailed schemas
- **Examples**: Request and response examples

### OpenAPI Annotation Format

```javascript
/**
 * Load complete OpenAPI specification
 * @openapi {openapi=./schemas/inventory-api.yaml}
 */

/**
 * Load specific path only
 * @openapi /api/inventory/{id} {openapi=./schemas/inventory-api.yaml}
 */
```

## Example Code

```javascript
/**
 * OpenAPI Integration Example - Inventory API
 *
 * This file demonstrates how to load external OpenAPI 3.0 specifications
 * into APIDoc v5 documentation.
 */

/**
 * Example 1: Load complete OpenAPI specification
 *
 * This loads ALL paths and operations from the external YAML file.
 * Use this when you want to include the entire API specification.
 *
 * @openapi {openapi=./schemas/inventory-api.yaml}
 */
function loadCompleteInventoryAPI() {
  // All 5 endpoints will be loaded from inventory-api.yaml
}

/**
 * Example 2: Mixing APIDoc native annotations with OpenAPI
 *
 * You can combine native APIDoc annotations with OpenAPI references.
 *
 * @api {get} /api/inventory/categories List Categories
 * @apiName ListInventoryCategories
 * @apiGroup Inventory
 * @apiVersion 1.0.0
 * @apiDescription Get a list of all available inventory categories.
 */
function listInventoryCategories(req, res) {
  // Native APIDoc annotation - not from OpenAPI file
}
```

## Files Structure

```
02-openapi/
├── apidoc.json              # Configuration file
├── README.md                # This file
├── src/
│   └── inventory-loader.js  # OpenAPI loader file
└── schemas/
    └── inventory-api.yaml   # OpenAPI 3.0 specification
```

## Key Features

- **External Spec Integration**: Reference complete OpenAPI files
- **Schema Reusability**: Use `components/schemas` with `$ref`
- **Multi-format Support**: YAML and JSON specifications
- **Path Filtering**: Load complete specs or specific paths
- **Standard Compliance**: Full OpenAPI 3.0 compatibility
- **Hybrid Documentation**: Mix OpenAPI and native APIDoc
- **Automatic Resolution**: `$ref` pointers resolved automatically

## Configuration (apidoc.json)

```json
{
  "name": "OpenAPI Integration Example",
  "version": "1.0.0",
  "title": "Inventory API - OpenAPI Example",
  "url": "https://api.example.com",
  "inputs": {
    "docs": ["/"],
    "openapi": ["src"]
  },
  "order": ["Inventory"]
}
```

### Inputs Configuration

- `"docs": ["/"]` - Includes this README.md in the documentation
- `"openapi": ["src"]` - Processes `@openapi` annotations in src/ directory
  - Looks for `@openapi` tags
  - Loads referenced OpenAPI files
  - Converts to APIDoc format

## OpenAPI Specification Example

```yaml
# schemas/inventory-api.yaml
openapi: 3.0.0
info:
  title: Inventory API
  version: 1.0.0

paths:
  /api/inventory:
    get:
      summary: List all inventory items
      operationId: listInventory
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/InventoryItem'

components:
  schemas:
    InventoryItem:
      type: object
      required:
        - id
        - name
        - quantity
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        quantity:
          type: integer
```

## Testing

Generate documentation:

```bash
# From the example directory
apidoc generate -i src -o doc

# Or from project root
npm run example:openapi
```

Preview documentation:

```bash
npx serve doc
# Open http://localhost:3000
```

## What You'll Learn

1. How to integrate external OpenAPI 3.0 specifications
2. Loading complete specs vs specific paths
3. Mixing OpenAPI with native APIDoc annotations
4. Using `$ref` and `components` for schema reuse
5. Supporting multiple response status codes
6. Documenting request/response examples
7. Maintaining OpenAPI standard compliance

## Advantages of OpenAPI Integration

1. **Spec Reusability**: Same OpenAPI file can be used for code generation, testing, mock servers
2. **Industry Standard**: OpenAPI is the de-facto standard for API documentation
3. **Separation of Concerns**: API specification separated from implementation code
4. **Tool Ecosystem**: Compatible with Swagger UI, Postman, validation tools
5. **Single Source of Truth**: One spec file for all API documentation needs

## Related Examples

- **01-basic-api**: For native APIDoc annotations
- **06-versioning**: For managing API versions with OpenAPI
- **03-models**: For database model integration
