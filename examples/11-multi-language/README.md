# Multi-Language Example

## Overview

This example demonstrates APIDoc v5's ability to generate documentation from source code written in 11+ different programming languages, all in a single project.

## Parser Used

**Parser**: `api` (Standard API Parser)

The API parser supports APIDoc annotations in comment blocks across multiple programming languages.

## How it Works

APIDoc v5 can extract documentation from:

### Supported Languages

- JavaScript/Node.js
- TypeScript
- Python
- Ruby
- PHP
- Java
- Go
- Rust
- C/C++
- C#
- Perl
- And more...

### Universal Annotation Format

All languages use the same APIDoc annotation format in their respective comment styles:

**JavaScript:**
```javascript
/**
 * @api {get} /books Get Books
 * @apiName GetBooks
 * @apiGroup Books
 */
```

**Python:**
```python
"""
@api {get} /books Get Books
@apiName GetBooks
@apiGroup Books
"""
```

**Ruby:**
```ruby
=begin
@api {get} /books Get Books
@apiName GetBooks
@apiGroup Books
=end
```

## Configuration (apidoc.json)

```json
{
  "name": "Multi-Language Example",
  "version": "1.0.0",
  "title": "Polyglot API - Multi-Language Support",
  "url": "https://api.example.com",
  "inputs": {
    "docs": ["/"],
    "all": ["src"]
  },
  "order": ["Books"]
}
```

## Testing

```bash
apidoc generate -i src -o doc
npx serve doc
```

## What You'll Learn

1. Multi-language API documentation
2. Comment syntax for different languages
3. Polyglot project documentation
4. Consistent documentation across languages
5. Microservices in different languages

## Related Examples

- **01-basic-api**: For JavaScript examples
- **12-tsdoc**: For TypeScript
