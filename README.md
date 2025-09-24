# @hrefcl/apidoc v4.0.0

**RESTful web API Documentation Generator** - A modern TypeScript fork of the original apidoc project with active maintenance and modern tooling.

[![License](https://img.shields.io/github/license/hrefcl/apidoc)](https://github.com/hrefcl/apidoc/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@hrefcl/apidoc)](https://www.npmjs.com/package/@hrefcl/apidoc)
[![Node.js Version](https://img.shields.io/node/v/@hrefcl/apidoc)](https://nodejs.org/)

## 🚀 What's New in v4.0

### Major Improvements
- **✅ Full TypeScript Migration** - Complete codebase migration from JavaScript to TypeScript
- **✅ Modern ESLint Configuration** - Advanced linting with TypeScript support and Prettier integration
- **✅ TypeDoc API Documentation** - Auto-generated HTML documentation from TypeScript comments
- **✅ Enhanced Build System** - Improved esbuild configuration with better performance
- **✅ Updated Dependencies** - All dependencies updated to latest versions with security fixes
- **✅ Node.js 20+ Support** - Minimum Node.js version updated to 20.0.0
- **🆕 @apiSchema Integration** - Built-in TypeScript interface and JSON Schema support
- **🆕 Dual Authentication System** - Comprehensive protection with local/remote authentication (all issues fixed!)
- **🆕 Native OpenAPI 3.0 Support** - Write OpenAPI specifications directly in comments + external file references with full $ref resolution

### New @apiSchema Feature
APIDoc 4.0 introduces powerful schema integration that automatically generates API documentation from:

- **TypeScript Interfaces** - Parse `.ts` files and generate parameters from interface definitions
- **JSON Schema Files** - Load external schema files and convert to API documentation
- **Complex Type Support** - Handle nested objects, arrays, union types, and optional fields
- **Group Support** - Organize parameters by groups (Body, Headers, Query, etc.)

### Breaking Changes from v3.x
- Minimum Node.js version: **20.0.0** (was 18.0.0)
- Full TypeScript migration - all source files now use `.ts` extension
- Enhanced type safety and better IntelliSense support
- Improved error handling and validation

## 🔐 NEW: Dual Authentication System

**APIDoc 4.0** introduces a **comprehensive authentication system** that allows you to protect your API documentation with both local and remote authentication methods.

### ✨ Authentication Features

- **🏠 Local Authentication**: Predefined users in `apidoc.json` with SHA256 password hashing
- **🌐 Remote Authentication**: Integration with existing APIs (Auth0, Firebase, Custom REST APIs)
- **🔗 Hybrid Authentication**: Combine both methods - try local first, fallback to remote
- **🛡️ Content Protection**: Main content encrypted and hidden until authentication
- **👤 Session Management**: 24-hour persistent sessions with secure localStorage encryption
- **🎨 Modern UI**: Responsive login forms with dark/light theme support
- **🔄 Auto-Recovery**: Sessions persist across browser restarts and page refreshes
- **⚡ Instant Access**: No login delays - seamless transition after authentication

### 🚀 Quick Authentication Setup

#### 1. Configure `apidoc.json`

Add the `login` section to your configuration:

```json
{
  "name": "Protected API Documentation",
  "version": "1.0.0",
  "login": {
    "active": true,
    "admited": [
      {
        "email": "admin@company.com",
        "password": "secure_password_2024"
      },
      {
        "email": "developer@company.com",
        "password": "dev_password"
      }
    ],
    "urlAuth": "https://api.company.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401
  }
}
```

#### 2. Generate Protected Documentation

```bash
# Generate documentation with authentication
apidoc -i src/ -o docs/

# The system automatically detects and processes authentication
```

#### 3. Access Your Protected Documentation

```bash
# Serve documentation
npx serve docs/ -p 8080

# Open http://localhost:8080
# Login with configured credentials
```

### 🔐 Authentication Types

#### Local Authentication Only
```json
{
  "login": {
    "active": true,
    "admited": [
      {"email": "user@company.com", "password": "password123"}
    ]
  }
}
```

#### Remote Authentication Only
```json
{
  "login": {
    "active": true,
    "urlAuth": "https://auth.company.com/login",
    "value_form": {"email": "email", "password": "password"},
    "response_success": 200,
    "response_error": 401
  }
}
```

#### Hybrid Authentication (Local + Remote)
```json
{
  "login": {
    "active": true,
    "admited": [
      {"email": "admin@local.com", "password": "emergency_access"}
    ],
    "urlAuth": "https://sso.company.com/oauth/token",
    "value_form": {"email": "username", "password": "password"},
    "response_success": 200
  }
}
```

### 📚 Authentication Documentation

- **[🚀 Quick Start Guide](./md/QUICK-START-AUTH.md)** - Setup in 3 steps
- **[📖 Complete Authentication Guide](./md/AUTHENTICATION.md)** - Comprehensive documentation
- **[🛠️ Developer Reference](./md/AUTH-DEVELOPER-GUIDE.md)** - Technical API and customization
- **[📝 Changelog](./md/CHANGELOG-AUTH.md)** - Implementation details and history

### 🧪 Test Authentication

Use the included test credentials:
```
Email: tester1@href.cl  or  tester2@href.cl
Password: 1234
```

**✅ All Authentication Issues Fixed in v4.0.0:**
- **Session Persistence**: Fixed session expiring immediately after login
- **Remote Authentication**: Now works correctly when server responds with 200
- **Local Authentication**: Proper login form display and content protection
- **Hybrid Mode**: Both local and remote authentication work seamlessly together

### 🔧 Recent Fixes (v4.0.0)

**Fixed Issues:**

1. **❌ → ✅ Local authentication not prompting for login**
   - **Problem**: Content wasn't being protected, users could access without login
   - **Solution**: Fixed content protection system to properly hide documentation

2. **❌ → ✅ Remote authentication failing despite 200 response**
   - **Problem**: API responded correctly but authentication logic was flawed
   - **Solution**: Corrected authentication flow and response handling

3. **❌ → ✅ Session expiring immediately after successful login**
   - **Problem**: Session recovery failed for remote users, causing immediate logouts
   - **Solution**: Implemented secure email encryption for session persistence

4. **❌ → ✅ Hybrid authentication prioritizing incorrectly**
   - **Problem**: Only local users could access when both methods were configured
   - **Solution**: Fixed logic to try local first, then fallback to remote API

These work for both local and remote authentication testing.

### 🏢 Production Use Cases

**Small Team (5-10 people)**:
```json
{"login": {"active": true, "admited": [/* local users */]}}
```

**Enterprise (50+ people)**:
```json
{"login": {"active": true, "urlAuth": "https://sso.company.com/auth"}}
```

**Hybrid Setup**:
```json
{"login": {"active": true, "admited": [/* emergency */], "urlAuth": "https://..."}}
```

## 🚀 NEW: Native OpenAPI 3.0 Support

**APIDoc 4.0** introduces **native OpenAPI syntax** support, allowing you to write OpenAPI specifications directly in your code comments using standard OpenAPI 3.0 syntax.

### 🎯 Quick Example: External File References

**NEW**: Load complete OpenAPI specifications from external files with automatic $ref resolution:

```javascript
/**
 * Load API specification from external YAML file
 * @openapi /api/products/{id} {openapi=./schemas/products-api.yaml}
 */
function updateProduct() {
    // Automatically generates complete documentation including:
    // ✅ Request Body table with all fields
    // ✅ Success Response table with all fields
    // ✅ Error Response table with all fields
    // ✅ Interactive forms for testing
}
```

The external YAML file with `$ref` components is automatically resolved to generate full API tables and interactive forms. See [Advanced $ref Resolution](#-advanced-ref-resolution-new) for complete examples.

### ✨ Native OpenAPI Features

- **📝 Native Syntax**: Write OpenAPI 3.0 specifications directly in comments
- **🔄 Smart Versioning**: Automatic version extraction from `x-version` fields and tags
- **🎯 Full Compatibility**: Works alongside traditional APIDoc comments
- **📊 Multiple Parsers**: Support for paths, operations, schemas, and full specs
- **⚡ Zero Migration**: Add OpenAPI syntax incrementally to existing projects

### 🚀 OpenAPI Parsers

#### `@openapi` - Full OpenAPI Specifications
Write complete OpenAPI specifications directly in comments:

```javascript
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their unique identifier
 *     tags: [Users]
 *     x-version: "2.1.0"
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
function getUserById(id) {
    // Implementation
}
```

#### `@openapi-path` - Path-Specific Operations
Define operations for specific paths:

```javascript
/**
 * @openapi-path /api/users
 * post:
 *   summary: Create new user
 *   tags: [Users, v1.5.0]  # Version extracted from tags
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/CreateUserRequest'
 *   responses:
 *     201:
 *       description: User created successfully
 */
```

#### `@openapi-schema` - Reusable Schemas
Define reusable schema components:

```javascript
/**
 * @openapi-schema User
 * type: object
 * x-version: "1.2.0"
 * required:
 *   - id
 *   - name
 *   - email
 * properties:
 *   id:
 *     type: integer
 *     format: int64
 *   name:
 *     type: string
 *     example: "John Doe"
 *   email:
 *     type: string
 *     format: email
 */
```

### 🎯 Smart Version Management

OpenAPI operations now support intelligent version extraction:

#### Priority Order:
1. **`x-version` Extension** (Highest Priority)
   ```yaml
   x-version: "2.1.0"  # ← This version is used
   ```

2. **Version Tags**
   ```yaml
   tags: [Users, v1.5.0]  # ← Version extracted: "1.5.0"
   tags: [API, "version:2.0"]  # ← Version extracted: "2.0"
   ```

3. **Info Version** (Full OpenAPI specs)
   ```yaml
   info:
     version: "3.1.0"  # ← Version extracted from info
   ```

4. **Default Version**
   ```
   version: "4.0.0"  # ← Fallback when no version found
   ```

### 📊 Mixed Usage Example

Combine traditional APIDoc with native OpenAPI syntax:

```javascript
/**
 * Traditional APIDoc comment
 * @api {get} /api/legacy Legacy Endpoint
 * @apiVersion 1.0.0
 * @apiName GetLegacy
 * @apiGroup Legacy
 */
function legacyEndpoint() {}

/**
 * Native OpenAPI comment
 * @openapi-path /api/modern
 * get:
 *   summary: Modern Endpoint
 *   x-version: "4.0.0"
 *   tags: [Modern]
 *   responses:
 *     200:
 *       description: Success
 */
function modernEndpoint() {}
```

Both endpoints will appear in the same documentation with proper versioning and navigation.

### 🎯 Integration Benefits

1. **Seamless Migration**: Existing OpenAPI specs can be embedded directly
2. **Automatic Conversion**: OpenAPI operations become APIDoc endpoints
3. **Version Compatibility**: Supports OpenAPI 3.0.x specifications
4. **Rich Validation**: Parameter types and constraints are preserved
5. **Response Documentation**: Full response schema documentation

### 📁 External File References

**APIDoc 4.0** now supports **external OpenAPI file references**, allowing you to reuse existing OpenAPI specifications without copying them into your code comments.

#### 🚀 Quick External File Usage

```javascript
/**
 * Load complete external OpenAPI specification
 * @openapi {openapi=./schemas/users-api.json}
 */
function loadCompleteUserAPI() {
    // All operations from users-api.json will be loaded
}

/**
 * Load specific path from external file
 * @openapi /api/users/{id} {openapi=./schemas/users-api.json}
 */
function getUserById() {
    // Only the /api/users/{id} operations will be loaded
}

/**
 * Support for YAML files
 * @openapi /api/products {openapi=./schemas/products-api.yaml}
 */
function getProducts() {
    // Load operations from YAML OpenAPI specification
}
```

#### 📊 Supported External Formats

- **JSON Files**: `{openapi=./path/to/spec.json}`
- **YAML Files**: `{openapi=./path/to/spec.yaml}` or `{openapi=./path/to/spec.yml}`
- **Relative Paths**: Resolved relative to the current source file
- **Absolute Paths**: Full system paths supported

#### 🎯 Path-Specific Loading

You can load specific operations from large OpenAPI files:

```javascript
// Load only the GET operation for /api/users/{id}
/**
 * @openapi /api/users/{id} {openapi=./schemas/complete-api.yaml}
 */

// Load all operations for /api/products
/**
 * @openapi /api/products {openapi=./schemas/complete-api.yaml}
 */

// Load complete specification (all paths)
/**
 * @openapi {openapi=./schemas/complete-api.yaml}
 */
```

#### 🔄 Mixed Approaches

Combine external file references with inline documentation:

```javascript
/**
 * @openapi /api/users/{id} {openapi=./schemas/users.json}
 * @apiVersion 2.1.0
 * @apiGroup Users
 *
 * @apiDescription This endpoint is loaded from an external OpenAPI file
 * but enhanced with additional APIDoc documentation.
 *
 * @apiExample {curl} Example Request:
 * curl -X GET https://api.example.com/api/users/123
 */
```

#### 🔗 Advanced $ref Resolution (NEW!)

**APIDoc 4.0** now includes **complete OpenAPI component reference resolution**, automatically resolving `$ref` references in external files to generate full documentation including Request Body and Response tables.

```yaml
# example/schemas/products-api.yaml
openapi: 3.0.0
info:
  title: Products API
  version: 1.0.0
paths:
  /api/products/{id}:
    put:
      summary: Update product
      description: Update product information
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateProductRequest'  # ✅ Auto-resolved
      responses:
        '200':
          description: Product updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Product'  # ✅ Auto-resolved
        '400':
          description: Invalid request data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'  # ✅ Auto-resolved

components:
  schemas:
    UpdateProductRequest:
      type: object
      properties:
        name: { type: string }
        description: { type: string }
        price: { type: number }
        category: { type: string }
        tags: { type: array, items: { type: string } }
        in_stock: { type: boolean }
    Product:
      type: object
      required: [id, name, price, category]
      properties:
        id: { type: string }
        name: { type: string }
        description: { type: string }
        price: { type: number }
        category: { type: string }
        tags: { type: array, items: { type: string } }
        in_stock: { type: boolean }
        reviews: { type: array, items: { type: string } }
    Error:
      type: object
      required: [error, message]
      properties:
        error: { type: string }
        message: { type: string }
        details: { type: object }
```

Using this external file:

```javascript
/**
 * @openapi /api/products/{id} {openapi=./schemas/products-api.yaml}
 */
function updateProduct() {
    // Automatically generates complete documentation with all tables
}
```

**Generates in HTML documentation:**

📋 **Request Body Table:**
| Field | Type | Description |
|-------|------|-------------|
| name | String | (optional) |
| description | String | (optional) |
| price | Number | (optional) |
| category | String | (optional) |
| tags | String[] | (optional) |
| in_stock | Boolean | (optional) |

✅ **Success Response Table:**
| Field | Type | Description |
|-------|------|-------------|
| id | String | (required) |
| name | String | (required) |
| description | String | (optional) |
| price | Number | (required) |
| category | String | (required) |
| tags | String[] | (optional) |
| in_stock | Boolean | (optional) |
| reviews | String[] | (optional) |

❌ **Error Response Table:**
| Field | Type | Description |
|-------|------|-------------|
| error | String | (required) |
| message | String | (required) |
| details | Object | (optional) |

🎛️ **Interactive Forms:**
- JSON request body editor with pre-filled structure
- Form-data input fields with proper types
- Send/Reset buttons for testing
- Response display area

#### 🚀 Complete Feature Matrix

| Feature | Supported | Notes |
|---------|-----------|-------|
| **File Formats** | | |
| JSON files (.json) | ✅ | Full support |
| YAML files (.yaml, .yml) | ✅ | Full support |
| **OpenAPI Components** | | |
| $ref resolution | ✅ | Automatic component resolution |
| Request body schemas | ✅ | Full table generation |
| Response schemas | ✅ | Success & Error tables |
| Path parameters | ✅ | Auto-extracted |
| Query parameters | ✅ | Auto-extracted |
| Header parameters | ✅ | Auto-extracted |
| **Schema Types** | | |
| Objects | ✅ | Full property extraction |
| Arrays | ✅ | Proper `Type[]` notation |
| Nested objects | ✅ | Recursive resolution |
| Required fields | ✅ | Marked appropriately |
| Optional fields | ✅ | Marked appropriately |
| **Loading Modes** | | |
| Complete file | ✅ | `{openapi=./file.yaml}` |
| Specific path | ✅ | `/path {openapi=./file.yaml}` |
| Multiple operations | ✅ | All operations for a path |

#### ✅ Benefits of External File References

1. **🔄 Reusability**: Share OpenAPI specs across multiple projects
2. **📝 Maintainability**: Update specification in one place
3. **🎯 Selective Loading**: Load only needed operations
4. **📊 Format Flexibility**: Support both JSON and YAML formats
5. **⚡ Performance**: Load large specs without bloating code comments

### 📤 OpenAPI Export Capabilities

**APIDoc 4.0** also supports **exporting** your documentation to OpenAPI 3.0 format, converting both traditional APIDoc comments and native OpenAPI syntax to standard OpenAPI specifications.

#### Generate HTML + OpenAPI Together
```bash
# Creates both HTML documentation AND swagger.json
apidoc -i src/ -o docs/ --openapi
```

#### Generate Only OpenAPI Specification
```bash
# Creates only swagger.json and openapi.json (no HTML)
apidoc -i src/ -o api-spec/ --openapi-only
```

#### 📊 What Gets Generated

```
docs/
├── index.html          # Traditional APIDoc HTML
├── assets/            # CSS, JS, fonts
├── swagger.json       # OpenAPI 3.0 specification 🆕
└── openapi.json       # Same as swagger.json (compatibility) 🆕
```

#### 🔄 Bidirectional Support

APIDoc 4.0 provides complete OpenAPI integration:

**Write OpenAPI → Render as APIDoc**
- Use native `@openapi` syntax in comments
- Automatic conversion to APIDoc-compatible documentation
- Smart version extraction and parameter parsing

**Write APIDoc → Export as OpenAPI**
- Traditional `@api` comments convert to OpenAPI 3.0
- Generate industry-standard swagger.json files
- Compatible with Postman, Insomnia, Swagger UI

#### 🎯 Use Cases for Export

**API Development Teams:**
- Generate OpenAPI for API design-first workflows
- Import into Postman/Insomnia for testing
- Share with frontend teams for client generation

**Enterprise Integration:**
- API gateways that require OpenAPI specs
- Documentation portals supporting both formats
- CI/CD pipelines generating multiple formats

**Modern Tooling:**
- Code generation from OpenAPI specifications
- API testing and validation frameworks
- Schema-driven development workflows


## 📖 Documentation

- **Main Documentation**: [apidocts.com](https://apidocts.com)
- **Live Demo**: [apidocts.com/example](http://apidocts.com/example/)
- **API Documentation**: Generated with TypeDoc (see [Development](#development) section)

## 🎯 Installation

### Global Installation
```bash
npm install -g @hrefcl/apidoc
```

### Local Installation
```bash
npm install --save-dev @hrefcl/apidoc
```

### TypeScript Types
```bash
npm install -D @types/apidoc
```

## 🔧 Quick Start

### 1. Add API Documentation Comments
Add apidoc comments anywhere in your source code:

```javascript
/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 * @apiSuccess {String} email     Email of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe",
 *       "email": "john.doe@example.com"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
```

### 2. Generate Documentation
```bash
# Basic usage
apidoc -i src/ -o doc/

# With verbose output
apidoc -v -i src/ -o doc/

# With debug information
apidoc --debug -i src/ -o doc/
```

### 3. View Documentation
Open `doc/index.html` in your browser to view the generated documentation.

## 🎯 @apiSchema: Advanced Schema Integration

APIDoc 4.0 introduces the powerful `@apiSchema` tag that automatically generates API documentation from TypeScript interfaces and JSON Schema files, eliminating the need to manually write repetitive `@apiParam` and `@apiSuccess` declarations.

### TypeScript Interface Integration

#### 1. Define TypeScript Interfaces
Create interfaces in `.ts` files alongside your API code:

```typescript
// interfaces.ts
export interface UserProfile {
    /** User's unique identifier */
    id: number;
    /** User's email address */
    email: string;
    /** User's full name */
    name: string;
    /** User role in system */
    role: 'admin' | 'user' | 'moderator';
    /** User preferences */
    preferences?: {
        /** UI theme preference */
        theme: 'light' | 'dark' | 'auto';
        /** Language preference (ISO code) */
        language: string;
        /** Notification settings */
        notifications: {
            email: boolean;
            push: boolean;
            sms: boolean;
        };
    };
}

export interface ResponseSuccess {
    /** Indicates successful response */
    success: true;
    /** Response data payload */
    data: any;
    /** Optional response message */
    message?: string;
}
```

#### 2. Use @apiSchema in API Documentation
```javascript
/**
 * @api {get} /api/users/:id Get User Profile
 * @apiName GetUserProfile
 * @apiGroup Users
 * @apiVersion 4.0.0
 *
 * @apiDescription Retrieves detailed profile information for a specific user.
 *
 * @apiParam {Number} id User's unique identifier
 *
 * @apiSchema {interface=UserProfile} apiSuccess
 * @apiSchema {interface=ResponseError} apiError
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "id": 1,
 *     "email": "john@example.com",
 *     "name": "John Doe",
 *     "role": "user",
 *     "preferences": {
 *       "theme": "dark",
 *       "language": "en",
 *       "notifications": {
 *         "email": true,
 *         "push": true,
 *         "sms": false
 *       }
 *     }
 *   }
 * }
 */
```

#### 3. Group Parameters with @apiSchema
```javascript
/**
 * @api {post} /api/company/pricing Update Company Pricing
 * @apiName UpdateCompanyPricing
 * @apiGroup Company
 * @apiVersion 4.0.0
 *
 * @apiDescription Updates the pricing configuration for a company.
 *
 * @apiSchema (Body) {interface=CompanyPricing} apiParam
 * @apiSchema {interface=ResponseSuccess} apiSuccess
 * @apiSchema {interface=ResponseError} apiError
 */
```

### JSON Schema Integration

#### 1. Create JSON Schema Files
```json
// schemas/user-create.json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "User Creation Schema",
  "description": "Schema for creating a new user account",
  "required": ["email", "name", "password"],
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "description": "User's email address (must be unique)"
    },
    "name": {
      "type": "string",
      "minLength": 2,
      "maxLength": 100,
      "description": "User's full name"
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "maxLength": 128,
      "description": "User's password (8-128 characters)"
    },
    "role": {
      "type": "string",
      "enum": ["user", "moderator", "admin"],
      "default": "user",
      "description": "User's role in the system"
    }
  }
}
```

#### 2. Reference JSON Schema in API Documentation
```javascript
/**
 * @api {post} /api/users Create User Account
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 4.0.0
 *
 * @apiDescription Creates a new user account with the provided information.
 *
 * @apiSchema {jsonschema=./schemas/user-create.json} apiParam
 * @apiSchema {interface=ResponseSuccess} apiSuccess
 * @apiSchema {interface=ResponseError} apiError
 */
```

### @apiSchema Syntax Reference

| Syntax | Description | Example |
|--------|-------------|---------|
| `{interface=InterfaceName}` | Reference TypeScript interface | `@apiSchema {interface=UserProfile} apiSuccess` |
| `{jsonschema=./path/file.json}` | Reference JSON Schema file | `@apiSchema {jsonschema=./schemas/user.json} apiParam` |
| `(Group) {interface=Name}` | Group parameters | `@apiSchema (Body) {interface=UserData} apiParam` |
| `{interface=Name} apiParam` | Generate @apiParam | `@apiSchema {interface=User} apiParam` |
| `{interface=Name} apiSuccess` | Generate @apiSuccess | `@apiSchema {interface=Response} apiSuccess` |
| `{interface=Name} apiError` | Generate @apiError | `@apiSchema {interface=Error} apiError` |

### Supported TypeScript Features

- **✅ Basic Types**: `string`, `number`, `boolean`, `any`
- **✅ Arrays**: `Type[]`, `Array<Type>`
- **✅ Union Types**: `'admin' | 'user' | 'moderator'`
- **✅ Optional Properties**: `field?: string`
- **✅ Nested Objects**: Complex object hierarchies
- **✅ String Literals**: `'value1' | 'value2'`
- **✅ Comments**: JSDoc comments for descriptions
- **✅ Generic Interfaces**: Simplified handling

### Benefits of @apiSchema

1. **🚀 Reduced Duplication** - Write interfaces once, use everywhere
2. **🔄 Automatic Sync** - Changes to interfaces update documentation automatically
3. **💪 Type Safety** - Leverage TypeScript's type system
4. **📝 Better Maintenance** - Single source of truth for data structures
5. **🎯 Consistent Documentation** - Standardized parameter descriptions
6. **⚡ Faster Development** - Less manual documentation writing

### Migration from Manual @apiParam

**Before (Manual)**:
```javascript
/**
 * @apiParam {String} email User's email address
 * @apiParam {String} name User's full name
 * @apiParam {String} password User's password
 * @apiParam {String="user","admin"} [role="user"] User's role
 * @apiParam {Object} [preferences] User preferences
 * @apiParam {String="light","dark"} [preferences.theme] UI theme
 * @apiParam {String} [preferences.language] Language code
 */
```

**After (@apiSchema)**:
```javascript
/**
 * @apiSchema {interface=UserCreateRequest} apiParam
 */
```

## 💻 Programmatic Usage

### TypeScript/ES Modules
```typescript
import path from 'path';
import { createDoc } from '@hrefcl/apidoc';

const doc = createDoc({
  src: path.resolve(__dirname, 'src'),
  dest: path.resolve(__dirname, 'doc'),
  dryRun: false,
  silent: false
});

if (typeof doc !== 'boolean') {
  console.log(doc.data);    // Parsed API data
  console.log(doc.project); // Project information
}
```

### CommonJS
```javascript
const path = require('path');
const { createDoc } = require('@hrefcl/apidoc');

const doc = createDoc({
  src: path.resolve(__dirname, 'src'),
  dest: path.resolve(__dirname, 'doc'),
  dryRun: false,
  silent: false
});
```

## ⚙️ Configuration

### apidoc.json
Create an `apidoc.json` file in your project root:

```json
{
  "name": "My API",
  "version": "1.0.0",
  "description": "My API Documentation",
  "title": "My API Documentation",
  "url": "https://api.example.com",
  "sampleUrl": "https://api.example.com",
  "header": {
    "title": "Introduction",
    "filename": "header.md"
  },
  "footer": {
    "title": "Footer",
    "filename": "footer.md"
  },
  "order": [
    "User",
    "Account",
    "Admin"
  ]
}
```

## 🎨 Custom Icons & Localization

APIDoc 4.0 introduces powerful customization features that allow you to personalize your API documentation with Font Awesome icons and custom titles.

### ✨ Font Awesome Icons

You can now assign Font Awesome icons to API groups and header/footer sections for a more professional and visual documentation experience.

#### Group Icons Configuration

Add custom icons and localized titles for API groups in your `apidoc.json`:

```json
{
  "name": "My API Documentation",
  "version": "1.0.0",
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Usuarios"
    },
    "Authentication": {
      "icon": "fa-shield-alt",
      "title": "Autenticación"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Empresa"
    },
    "Payment": {
      "icon": "fa-credit-card",
      "title": "Pagos"
    },
    "Analytics": {
      "icon": "fa-chart-line",
      "title": "Analíticas"
    }
  }
}
```

#### Header & Footer Icons

Customize your header and footer sections with icons:

```json
{
  "header": {
    "title": "Getting Started",
    "filename": "header.md",
    "icon": "fa-home"
  },
  "footer": {
    "title": "Best Practices",
    "filename": "footer.md",
    "icon": "fa-lightbulb"
  }
}
```

#### 🎯 Custom Logo Configuration

Personalize your navbar with a custom logo or icon in `apidoc.json`:

```json
{
  "name": "My API Documentation",
  "version": "1.0.0",
  "logo": {
    "url": "https://example.com/logo.png",
    "alt": "Company Logo",
    "width": "40px",
    "height": "40px"
  }
}
```

**Alternative: Font Awesome Icon**
```json
{
  "logo": {
    "icon": "fa-rocket",
    "alt": "API Logo"
  }
}
```

**Logo Configuration Options:**

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `url` | string | Logo image URL (absolute, relative, or data URL) | - |
| `icon` | string | Font Awesome icon class (e.g., `fa-code`, `fa-rocket`) | - |
| `alt` | string | Alternative text for accessibility | "Logo" |
| `width` | string | Logo width in CSS units | "32px" |
| `height` | string | Logo height in CSS units | "32px" |

**Priority Order:**
1. Custom image (`url`) - highest priority
2. Font Awesome icon (`icon`) - if no URL provided
3. Default SVG icon - fallback if no configuration

**Examples:**

```json
// Company logo
{
  "logo": {
    "url": "/assets/company-logo.svg",
    "alt": "Acme Corp Logo",
    "width": "45px",
    "height": "35px"
  }
}

// Font Awesome icon
{
  "logo": {
    "icon": "fa-code",
    "alt": "API Documentation"
  }
}

// Data URL (embedded image)
{
  "logo": {
    "url": "data:image/svg+xml;base64,PHN2Zz...",
    "alt": "Logo",
    "width": "30px"
  }
}
```

### 🌍 Multilingual Support

The `settings` configuration allows you to:

- **Localize group names**: Display "Usuarios" instead of "Users"
- **Use custom titles**: More descriptive names for your groups
- **Maintain consistency**: Standardized naming across your documentation

### 📦 Font Awesome Integration

- **Local Assets**: Font Awesome CSS is included locally (no CDN dependency)
- **Full Icon Library**: Access to the complete Font Awesome icon set
- **Smart Fallbacks**: Automatic fallback to default icons for unconfigured groups
- **Professional Appearance**: Modern, clean icons enhance visual appeal

### 🔧 Icon Reference

Popular Font Awesome icons for API documentation:

| Group Type | Recommended Icon | Class Name |
|------------|-----------------|------------|
| Users/Authentication | 👤 | `fa-user`, `fa-users`, `fa-shield-alt` |
| Admin/Settings | ⚙️ | `fa-cog`, `fa-tools`, `fa-crown` |
| Payment/Billing | 💳 | `fa-credit-card`, `fa-dollar-sign` |
| Files/Upload | 📁 | `fa-folder`, `fa-upload`, `fa-file` |
| Analytics/Reports | 📊 | `fa-chart-line`, `fa-chart-bar` |
| Location/Maps | 📍 | `fa-map-marker-alt`, `fa-globe` |
| Communication | 📧 | `fa-envelope`, `fa-comments` |
| Company/Business | 🏢 | `fa-building`, `fa-briefcase` |

### 💡 Implementation Details

The icon system implements intelligent prioritization:

1. **Custom icons** from `settings` configuration (highest priority)
2. **Header/footer icons** from project configuration
3. **Default icons** for common group names
4. **Generic fallback** icon (`fa-file-alt`)

This ensures your documentation always displays appropriate icons, even for unconfigured groups.

## 🐳 Container Usage

### Podman (Recommended)
```bash
# Build image
podman build -t apidoc/apidoc .

# Generate documentation
podman run --rm -v $(pwd):/home/node/apidoc apidoc/apidoc -i src -o doc
```

### Docker
```bash
# Build image
docker build -t apidoc/apidoc .

# Generate documentation
docker run --rm -v $(pwd):/home/node/apidoc apidoc/apidoc -i src -o doc
```

## 🛠️ Development

### Prerequisites
- Node.js >= 20.0.0
- npm or yarn

### Setup
```bash
# Clone repository
git clone https://github.com/hrefcl/apidoc.git
cd apidoc

# Install dependencies
npm install

# Build project
npm run build
```

### Development Commands
```bash
# TypeScript compilation
npm run build              # Compile TypeScript + Stencil
npm run typecheck          # Type checking only

# Documentation generation
npm run build:example      # Generate example documentation
npm run docs               # Generate TypeDoc API docs
npm run docs:serve         # Serve API docs on port 3001

# Development server
npm run dev                # Watch mode compilation
npm run dev:template       # Build example + serve on port 8080
npm run start              # Serve built documentation

# Code quality
npm run test               # Run test suite
npm run test:lint          # ESLint + spell check
npm run test:fix           # Auto-fix ESLint issues
npm run pre-commit         # Full validation (typecheck + lint + test)

# Container workflow
npm run serve              # Build, containerize, and serve with auto-open
npm run serve:stop         # Stop container
```

### Project Structure
```
apidoc/
├── bin/apidoc             # CLI executable
├── lib/                   # TypeScript source code
│   ├── core/             # Core parsing logic
│   │   ├── parsers/      # API comment parsers
│   │   ├── workers/      # Data processors
│   │   ├── filters/      # Output filters
│   │   ├── languages/    # Language support
│   │   └── errors/       # Error classes
│   ├── index.ts          # Main library entry
│   ├── reader.ts         # File reading logic
│   └── writer.ts         # Output generation
├── template/             # HTML output templates
│   ├── src/              # Template TypeScript/CSS
│   └── index.html        # Main template
├── example/              # Example API for testing
├── test/                 # Test suites
├── docs/                 # Generated API documentation
├── dist/                 # Compiled output
└── tmp/                  # Temporary build files
```

### TypeScript API Documentation
This project includes comprehensive TypeScript API documentation generated with TypeDoc:

```bash
# Generate HTML documentation
npm run docs

# Serve documentation locally
npm run docs:serve
```

Visit http://localhost:3001 to browse the generated API documentation.

## 🌍 Supported Languages

### DocBlock Style
**C#, Go, Dart, Java, JavaScript, TypeScript, PHP, Scala**
```javascript
/**
 * This is a comment.
 */
```

### Other Languages
- **Clojure**: `;;;; comment ;;;;`
- **CoffeeScript**: `### comment ###`
- **Elixir**: `#{ comment #}`
- **Erlang**: `%{ comment %}`
- **Perl**: `#** comment #*` or `=pod comment =cut`
- **Python**: `""" comment """`
- **Ruby**: `=begin comment =end`

## 📦 Build Tools & Integrations

### Build Tools
- [flask-apidoc](https://pypi.python.org/pypi/flask-apidoc/) - Python Flask integration
- [grunt-apidoc](https://github.com/apidoc/grunt-apidoc) - Grunt task
- [gapidoc](https://github.com/techgaun/gulp-apidoc) - Gulp task
- [webpack-apidoc](https://github.com/c0b41/webpack-apidoc) - Webpack plugin

### Editor Support
- [Eclipse Java apiDoc templates](https://github.com/skhani/eclipse_java_apiDoc_templates)
- [Eclipse PDT plugin](https://github.com/DWand/eclipse_pdt_apiDoc_editor_templates)
- [Sublime Text plugin](https://github.com/DWand/ST3_apiDocAutocompletion)




## 🏗️ Architecture & Technical Stack

### Core Technologies
- **TypeScript 5.7+** - Full type safety and modern language features
- **Node.js 20+** - Modern runtime with latest features
- **esbuild** - Fast bundling and compilation
- **Stencil** - Component compilation for templates
- **Handlebars** - Template rendering engine

### Development Tools
- **ESLint 9** - Modern flat config with TypeScript support
- **Prettier** - Code formatting with custom rules
- **TypeDoc** - API documentation generation
- **Mocha** - Test framework
- **Commander** - CLI argument parsing

### Build Pipeline
1. TypeScript compilation with `tsc`
2. Stencil component building
3. Template processing with esbuild
4. Output bundling and optimization

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and ensure tests pass: `npm run pre-commit`
4. Commit changes: `git commit -m "Add my feature"`
5. Push to branch: `git push origin feature/my-feature`
6. Create a Pull Request

### Code Quality Standards
- All code must pass TypeScript compilation
- ESLint must pass without warnings
- All tests must pass
- New features should include tests
- Maintain backward compatibility when possible

## 📋 Requirements

- **Node.js**: >= 20.0.0
- **npm**: >= 8.0.0 (or yarn >= 1.22.0)
- **Operating Systems**: macOS, Linux, Windows, FreeBSD, OpenBSD

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🏢 Maintenance & Support

This project is actively maintained by [@hrefcl](https://github.com/hrefcl).

**Maintenance Focus:**
- ✅ Dependency updates and security patches
- ✅ Node.js compatibility for latest LTS versions
- ✅ TypeScript migration and modernization
- ✅ Build system improvements and performance
- ✅ Bug fixes and stability improvements

**Support Channels:**
- [GitHub Issues](https://github.com/hrefcl/apidoc/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/hrefcl/apidoc/discussions) - Community support

## 🎉 New in This Version

**External OpenAPI File References with Full $ref Resolution**:
- ✅ Load complete OpenAPI specifications from external JSON/YAML files
- ✅ Automatic component reference resolution (`$ref: '#/components/schemas/...'`)
- ✅ Generate complete Request Body and Response tables
- ✅ Interactive forms with proper field types
- ✅ Support for complex nested objects and arrays
- ✅ Mixed syntax support (APIDoc + external OpenAPI)

Example: `@openapi /api/products/{id} {openapi=./schemas/products-api.yaml}` automatically resolves all $ref components to create full documentation.

## 🔗 Links

- **NPM Package**: [@hrefcl/apidoc](https://www.npmjs.com/package/@hrefcl/apidoc)
- **GitHub Repository**: [hrefcl/apidoc](https://github.com/hrefcl/apidoc)
- **Official Website**: [apidocts.com](https://apidocts.com)
- **Live Demo**: [apidocts.com/example](http://apidocts.com/example/)

---

Made with ❤️ by the apiDoc community. Originally created by Peter Rottmann.