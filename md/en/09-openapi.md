# 🔌 OpenAPI 3.0

APIDoc 5.0 introduces native support for OpenAPI 3.0, allowing you to write OpenAPI specifications directly in code comments and export documentation to standard OpenAPI format.

## 🚀 OpenAPI Features

### ✨ Main Features

- **📝 Native syntax** - Write OpenAPI 3.0 directly in comments
- **🔄 Smart versioning** - Automatic version extraction from `x-version` and tags
- **🎯 Full compatibility** - Works alongside traditional APIDoc comments
- **📊 Multiple parsers** - Support for paths, operations, schemas, and complete specifications
- **⚡ Incremental migration** - Add OpenAPI syntax to existing projects
- **📁 External references** - Load OpenAPI specifications from external files
- **🔗 $ref resolution** - Automatic component and reference resolution

## 🎯 Available OpenAPI Parsers

### @openapi - Complete Specifications

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
 *       404:
 *         description: User not found
 */
function getUserById(id) {
    // Implementation
}
```

### @openapi-path - Specific Operations

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
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     400:
 *       description: Invalid input data
 */
function createUser() {
    // Implementation
}
```

### @openapi-schema - Reusable Schemas

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
 *     example: 123
 *   name:
 *     type: string
 *     example: "John Doe"
 *   email:
 *     type: string
 *     format: email
 *     example: "john@example.com"
 *   role:
 *     type: string
 *     enum: [admin, user, moderator]
 *     default: user
 */
```

## 🎯 Smart Versioning System

APIDoc automatically extracts versions in the following priority order:

### 1. x-version Extension (Highest Priority)

```yaml
x-version: "2.1.0"  # ← This version is used
tags: [Users, v1.0.0]  # ← Ignored
```

### 2. Version Tags

```yaml
tags: [Users, v1.5.0]     # ← Version extracted: "1.5.0"
tags: [API, "version:2.0"] # ← Version extracted: "2.0"
```

### 3. Info Version (Complete Specifications)

```yaml
openapi: 3.0.0
info:
  version: "3.1.0"  # ← Version extracted from info
```

### 4. Default Version

```
version: "4.0.0"  # ← Fallback when no version found
```

## 📁 External File References

### 🚀 Basic Usage

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

### 📊 Supported Formats

- **JSON files**: `{openapi=./path/to/spec.json}`
- **YAML files**: `{openapi=./path/to/spec.yaml}` or `{openapi=./path/to/spec.yml}`
- **Relative paths**: Resolved relative to current source file
- **Absolute paths**: Full system paths supported

### 🎯 Specific Path Loading

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

## 🔗 Advanced $ref Resolution

APIDoc 5.0 includes **complete OpenAPI component reference resolution**, automatically resolving `$ref` references in external files to generate complete documentation.

### External File Example

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

### Using External File

```javascript
/**
 * @openapi /api/products/{id} {openapi=./schemas/products-api.yaml}
 */
function updateProduct() {
    // Automatically generates complete documentation with all tables
}
```

### Result in HTML Documentation

**📋 Request Body Table:**
| Field | Type | Description |
|-------|------|-------------|
| name | String | (optional) |
| description | String | (optional) |
| price | Number | (optional) |
| category | String | (optional) |
| tags | String[] | (optional) |
| in_stock | Boolean | (optional) |

**✅ Success Response Table:**
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

**❌ Error Response Table:**
| Field | Type | Description |
|-------|------|-------------|
| error | String | (required) |
| message | String | (required) |
| details | Object | (optional) |

## 📤 OpenAPI Export

### Generate HTML + OpenAPI with CLI v5

```bash
# Creates both HTML documentation AND swagger.json
apidoc generate -i src/ -o docs/ --openapi

# You can also use the export command (new in v5)
apidoc export openapi -o docs/swagger.yaml
```

### Generate Only OpenAPI

```bash
# Using export command (recommended in v5)
apidoc export openapi -o api-spec/swagger.json

# Alternative: generate only OpenAPI without HTML
apidoc generate -i src/ -o api-spec/ --openapi-only

# Export in YAML format
apidoc export openapi -o api-spec/swagger.yaml
```

### 📊 Generated Files

```
docs/
├── index.html          # Traditional HTML documentation
├── assets/            # CSS, JS, fonts
├── swagger.json       # OpenAPI 3.0 specification 🆕
└── openapi.json       # Same as swagger.json (compatibility) 🆕
```

## 🔄 Bidirectional Support

### Write OpenAPI → Render as APIDoc

- Use native `@openapi` syntax in comments
- Automatic conversion to APIDoc-compatible documentation
- Smart version extraction and parameter parsing

### Write APIDoc → Export as OpenAPI

- Traditional `@api` comments convert to OpenAPI 3.0
- Generates industry-standard swagger.json files
- Compatible with Postman, Insomnia, Swagger UI

## 📊 Mixed Usage

Combine traditional APIDoc syntax with native OpenAPI:

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

Both endpoints will appear in the same documentation with appropriate versioning and navigation.

## 🎯 Export Use Cases

### API Development Teams

- Generate OpenAPI for design-first workflows
- Import into Postman/Insomnia for testing
- Share with frontend teams for client generation

### Enterprise Integration

- API gateways requiring OpenAPI specifications
- Documentation portals supporting both formats
- CI/CD pipelines generating multiple formats

### Modern Tooling

- Code generation from OpenAPI specifications
- API testing and validation frameworks
- Schema-driven development workflows

## 🚀 Complete Feature Matrix

| Feature | Supported | Notes |
|---------|-----------|-------|
| **File Formats** | | |
| JSON files (.json) | ✅ | Full support |
| YAML files (.yaml, .yml) | ✅ | Full support |
| **OpenAPI Components** | | |
| $ref resolution | ✅ | Automatic component resolution |
| Request body schemas | ✅ | Complete table generation |
| Response schemas | ✅ | Success & Error tables |
| Path parameters | ✅ | Auto-extracted |
| Query parameters | ✅ | Auto-extracted |
| Header parameters | ✅ | Auto-extracted |
| **Schema Types** | | |
| Objects | ✅ | Complete property extraction |
| Arrays | ✅ | Proper `Type[]` notation |
| Nested objects | ✅ | Recursive resolution |
| Required fields | ✅ | Marked appropriately |
| Optional fields | ✅ | Marked appropriately |
| **Loading Modes** | | |
| Complete file | ✅ | `{openapi=./file.yaml}` |
| Specific path | ✅ | `/path {openapi=./file.yaml}` |
| Multiple operations | ✅ | All operations for a path |

## ✅ Benefits of OpenAPI Integration

1. **🔄 Reusability** - Share OpenAPI specifications across multiple projects
2. **📝 Maintainability** - Update specification in a single place
3. **🎯 Selective loading** - Load only needed operations
4. **📊 Format flexibility** - Support for both JSON and YAML
5. **⚡ Performance** - Load large specifications without bloating code comments
6. **🔗 Standards** - Use industry-standard formats
7. **🛠️ Tooling** - Integration with existing OpenAPI tools

## 📚 Additional References

- **[📖 APIDoc Parameters](./05-apidoc-params.md)** - Traditional APIDoc syntax
- **[📊 TypeScript Schemas](./11-typescript-schemas.md)** - TypeScript integration
- **[📝 Examples](./06-examples.md)** - More practical examples
