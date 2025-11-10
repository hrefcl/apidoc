# Authentication Example

## Overview

This example demonstrates APIDoc v5's dual authentication system, showing both form-based authentication and API key authentication patterns for securing API documentation.

## Parser Used

**Parser**: `api` (Standard API Parser)

This example uses standard API parser with special authentication-related annotations.

## How it Works

Two authentication methods are demonstrated:

### Form-Based Authentication

Form login with email/password authentication integrated into the documentation UI.

```javascript
/**
 * @api {post} /auth/login Login
 * @apiName Login
 * @apiGroup Auth
 * @apiDescription Authenticate user with email and password
 *
 * @apiParam {String} email User email
 * @apiParam {String} password User password
 *
 * @apiSuccess {String} token Authentication token
 */
```

### API Key Authentication

Header-based API key authentication for endpoints.

```javascript
/**
 * @api {get} /protected/data Get Protected Data
 * @apiName GetProtectedData
 * @apiGroup Protected
 * @apiHeader {String} Authorization API Key (e.g., "Bearer abc123")
 */
```

## Configuration (apidoc.json)

```json
{
  "name": "Authentication Example",
  "version": "1.0.0",
  "title": "Auth API - Dual Authentication",
  "url": "https://api.example.com",
  "inputs": {
    "docs": ["/"],
    "all": ["src"]
  },
  "order": ["Auth", "Protected"]
}
```

## Testing

```bash
apidoc generate -i src -o doc
npx serve doc
```

## What You'll Learn

1. Form-based authentication
2. API key authentication
3. Token-based auth patterns
4. Protecting endpoints
5. Authentication headers

## Related Examples

- **01-basic-api**: For basic endpoints
