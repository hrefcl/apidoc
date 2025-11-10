# Basic API Example

## Overview

This example demonstrates the fundamental APIDoc v5 annotations for documenting REST APIs. It shows how to document standard CRUD operations (Create, Read, Update, Delete) with complete parameter descriptions, response schemas, error handling, and code examples.

## Parser Used

**Parser**: `api` (Standard API Parser)

This parser processes native APIDoc annotations embedded in JavaScript/TypeScript comments. It's the most common parser for REST API documentation and supports all standard HTTP methods.

## How it Works

The `api` parser extracts documentation from specially formatted JSDoc-style comments in your source code. It processes the following key annotations:

### Core Tags

- `@api {method} path title` - Defines an API endpoint
- `@apiName` - Unique identifier for the endpoint
- `@apiGroup` - Groups endpoints together in the documentation
- `@apiVersion` - API version number
- `@apiDescription` - Detailed description of the endpoint

### Parameter Tags

- `@apiParam` - Request parameters (body/query/path)
  - Format: `@apiParam {Type} [name] Description`
  - Supports nested objects: `@apiParam {String} address.city City name`
  - Optional params: `@apiParam {String} [phone] Optional phone`

### Response Tags

- `@apiSuccess` - Success response fields
- `@apiSuccessExample` - Complete success response example
- `@apiError` - Error codes and descriptions
- `@apiErrorExample` - Error response examples

### Example Tags

- `@apiExample` - Code examples (curl, JavaScript, etc.)

## Example Code

```javascript
/**
 * @api {post} /api/company Create Company
 * @apiName CreateCompany
 * @apiGroup Company
 * @apiVersion 1.0.0
 * @apiDescription Create a new company in the system.
 *
 * @apiParam {String} name Company name (required)
 * @apiParam {String} [description] Company description
 * @apiParam {String} email Contact email
 * @apiParam {Object} address Company address
 * @apiParam {String} address.street Street address
 * @apiParam {String} address.city City
 *
 * @apiSuccess {String} id Unique company ID
 * @apiSuccess {String} name Company name
 * @apiSuccess {Object} address Company address
 *
 * @apiSuccessExample {json} Success Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": "550e8400-e29b-41d4-a716-446655440000",
 *       "name": "Acme Corporation",
 *       "address": {
 *         "street": "123 Main St",
 *         "city": "San Francisco"
 *       }
 *     }
 *
 * @apiError (400) BadRequest Invalid input data
 * @apiError (409) Conflict Company already exists
 *
 * @apiExample {curl} Example usage:
 *     curl -X POST https://api.example.com/api/company \
 *       -H "Content-Type: application/json" \
 *       -d '{"name": "Acme Corporation", "email": "contact@acme.com"}'
 */
function createCompany(req, res) {
  // Implementation here
}
```

## Files Structure

```
01-basic-api/
├── apidoc.json          # Configuration file
├── README.md            # This file
└── src/
    └── company.js       # API endpoints with annotations
```

## Key Features

- **Complete CRUD Operations**: Create, Read, Update, Delete examples
- **Nested Objects**: Address object with multiple nested fields
- **Optional Parameters**: Demonstrates optional vs required fields
- **HTTP Status Codes**: Proper error codes (400, 404, 409, 500)
- **Multiple Examples**: Success and error response examples
- **Code Examples**: curl command examples for testing
- **UUID Support**: Shows UUID format for identifiers

## Configuration (apidoc.json)

```json
{
  "name": "Basic API Example",
  "version": "1.0.0",
  "title": "Company API - Basic Example",
  "url": "https://api.example.com",
  "inputs": {
    "docs": ["/"],
    "all": ["src"]
  },
  "order": ["Company"]
}
```

### Inputs Configuration

- `"docs": ["/"]` - Includes this README.md in the documentation
- `"all": ["src"]` - Processes all standard parsers on src/ directory
  - Includes `api` parser for REST endpoints
  - Also processes any other standard annotations found

## Testing

Generate documentation:

```bash
# From the example directory
apidoc generate -i src -o doc

# Or from project root
npm run example:basic-api
```

Preview documentation:

```bash
npx serve doc
# Open http://localhost:3000
```

## What You'll Learn

1. How to document REST API endpoints
2. Proper use of HTTP methods (GET, POST, PUT, DELETE)
3. Documenting request parameters and nested objects
4. Creating success and error response examples
5. Adding code examples for API consumption
6. Organizing endpoints into logical groups
7. Proper error handling documentation

## Related Examples

- **02-openapi**: For importing existing OpenAPI/Swagger specs
- **07-authentication**: For adding authentication to endpoints
- **08-apiSchema**: For referencing TypeScript interfaces
- **06-versioning**: For managing multiple API versions
