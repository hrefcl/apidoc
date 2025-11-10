# API Versioning Example

## Overview

This example demonstrates complete API versioning management in APIDoc v5, showing how to handle multiple API versions (v1.0.0 through v4.0.0) without duplicates or conflicts using both OpenAPI files and native annotations.

## Parser Used

**Parsers**: `api` (Standard API Parser) + `openapi` (OpenAPI Parser)

This example combines both parsers to show two approaches to versioning:
1. OpenAPI files with different paths (v1-v3)
2. Native APIDoc annotations with same path but different versions (v4)

## How it Works

APIDoc v5 provides sophisticated versioning features:

### Versioning Features

- **Multiple Versions**: Support unlimited API versions
- **Version Selector**: UI dropdown to switch between versions
- **Version Filtering**: Generate docs for specific versions only
- **Inheritance**: Newer versions inherit from older versions
- **Deprecation**: Mark old versions as deprecated
- **Version Comparison**: Side-by-side version comparison

### Two Versioning Approaches

**Approach 1: OpenAPI with Different Paths**
```yaml
# products-v1.yaml
paths:
  /api/v1/products:
    get: ...
```

**Approach 2: Native APIDoc Same Path**
```javascript
/**
 * @api {get} /api/products Get Products
 * @apiVersion 4.0.0
 */
```

## Configuration (apidoc.json)

```json
{
  "name": "API Versioning Example",
  "version": "4.0.0",
  "title": "Products API - Multi Version Example",
  "url": "https://api.example.com",
  "inputs": {
    "docs": ["/"],
    "all": ["src"]
  },
  "order": ["Products"]
}
```

## Testing

Generate all versions:

```bash
apidoc generate -i src -o doc
```

Generate specific version only:

```bash
apidoc generate -i src -o doc --filter-version 2.0.0
```

## What You'll Learn

1. Managing multiple API versions
2. Using version selector in UI
3. Filtering documentation by version
4. Combining OpenAPI and native versioning
5. Version inheritance patterns
6. Deprecation strategies

## Related Examples

- **01-basic-api**: For basic API documentation
- **02-openapi**: For OpenAPI integration
