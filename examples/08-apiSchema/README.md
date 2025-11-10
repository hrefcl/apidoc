# @apiSchema Example

## Overview

This example demonstrates the `@apiSchema` annotation in APIDoc v5, showing how to reference TypeScript interfaces and JSON schemas directly in API documentation.

## Parser Used

**Parser**: `api` (Standard API Parser)

Uses the standard parser with `@apiSchema` annotation to reference external schema definitions.

## How it Works

The `@apiSchema` annotation allows referencing schemas from:

### Schema Sources

- **TypeScript Interfaces**: Reference TS interfaces directly
- **JSON Schema Files**: Reference external JSON Schema files
- **Inline JSON Schema**: Embed schemas inline

### Usage Format

```javascript
/**
 * @api {post} /tasks Create Task
 * @apiName CreateTask
 * @apiGroup Tasks
 *
 * @apiSchema (Body) {file="./types.ts#TaskInput"} TaskInput
 * @apiSchema (Response) {file="./types.ts#TaskOutput"} TaskOutput
 */
```

## Configuration (apidoc.json)

```json
{
  "name": "apiSchema Example",
  "version": "1.0.0",
  "title": "Community API - @apiSchema Complete Example",
  "url": "https://api.example.com",
  "inputs": {
    "docs": ["/"],
    "all": ["src"]
  },
  "order": ["TestQuery"]
}
```

## Testing

```bash
apidoc generate -i src -o doc
npx serve doc
```

## What You'll Learn

1. Using `@apiSchema` annotation
2. Referencing TypeScript interfaces
3. Schema reusability
4. Type-safe documentation

## Related Examples

- **12-tsdoc**: For TypeScript documentation
- **03-models**: For model schemas
