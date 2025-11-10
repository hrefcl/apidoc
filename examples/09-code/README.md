# Code Examples

## Overview

This example demonstrates how to embed multi-language code examples in API documentation using the `@apiExample` annotation in APIDoc v5.

## Parser Used

**Parser**: `api` (Standard API Parser)

Uses standard parser with `@apiExample` annotations for code samples.

## How it Works

The `@apiExample` annotation allows embedding code in multiple languages:

### Supported Languages

- JavaScript/Node.js
- Python
- Ruby
- PHP
- Java
- Go
- C#
- curl commands
- And many more...

### Usage Format

```javascript
/**
 * @api {get} /floor/:id Get Floor
 * @apiName GetFloor
 * @apiGroup Floor
 *
 * @apiExample {curl} curl:
 *     curl -X GET https://api.example.com/floor/123
 *
 * @apiExample {javascript} JavaScript:
 *     fetch('https://api.example.com/floor/123')
 *       .then(res => res.json())
 *
 * @apiExample {python} Python:
 *     import requests
 *     response = requests.get('https://api.example.com/floor/123')
 */
```

## Configuration (apidoc.json)

```json
{
  "name": "Code Examples",
  "version": "1.0.0",
  "title": "Thinmoo API - Floor & Community Management",
  "url": "http://api-cloud.thinmoo.net",
  "inputs": {
    "docs": ["/"],
    "all": ["src"]
  },
  "order": ["Floor", "Community"]
}
```

## Testing

```bash
apidoc generate -i src -o doc
npx serve doc
```

## What You'll Learn

1. Adding code examples
2. Multi-language code samples
3. Syntax highlighting
4. curl command examples
5. SDK usage examples

## Related Examples

- **01-basic-api**: For basic API docs
