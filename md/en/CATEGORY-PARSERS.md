# Category-Based Parser System - APIDoc v5.0

## 📋 Index

1. [Introduction](#introduction)
2. [Predefined Categories](#predefined-categories)
3. [Configuration](#configuration)
4. [Parsers by Category](#parsers-by-category)
5. [Usage Examples](#usage-examples)
6. [Testing and Verification](#testing-and-verification)
7. [Troubleshooting](#troubleshooting)

---

## Introduction

The **Category-Based Parser System** allows you to organize your documentation sources into specific categories, where each category runs **only the relevant parsers** for that type of content.

### 🎯 Benefits

- **Improved performance**: Only relevant parsers are executed
- **Clear organization**: Semantic separation of different code types
- **Avoids unnecessary parsing**: No need to run 50+ parsers on every file
- **Predefined categories**: Optimized configuration ready to use
- **Extensibility**: Custom categories automatically supported

### ⚙️ How It Works

1. Define categories in `apidoc.json` using the `inputs` field
2. Each directory is assigned to a specific category
3. The system filters which parsers to run based on the category
4. Only enabled parsers process the content

---

## Predefined Categories

### 1. **`docs`** - Markdown Documentation

Processes pure markdown files without APIDoc tags.

**Files**: `.md`, `.markdown`
**Parsers**: None (markdown processing only)

```json
{
  "inputs": {
    "docs": ["./markdown-files"]
  }
}
```

### 2. **`api`** - REST API Endpoints

REST endpoint documentation with @api tags.

**Files**: `.js`, `.ts`, `.jsx`, `.tsx`, `.php`, `.py`, `.rb`, `.go`, `.java`

**Enabled parsers**:
- `@api` - Define endpoint
- `@apiParam` - URL parameters
- `@apiQuery` - Query parameters
- `@apiBody` - Request body
- `@apiSuccess` - Successful responses
- `@apiError` - Error responses
- `@apiHeader` - HTTP headers
- `@apiExample` - Code examples
- `@apiGroup`, `@apiName`, `@apiDescription`, `@apiVersion`, `@apiPermission`

```json
{
  "inputs": {
    "api": ["./routes", "./controllers"]
  }
}
```

### 3. **`models`** - Data Models & Schemas

Data models, TypeScript interfaces, JSON schemas.

**Files**: `.ts`, `.js`, `.json`

**Enabled parsers**:
- `@apiSchema` - TypeScript/JSON schemas
- `@apiDefine` - Reusable definitions
- `@model` - Sequelize/ORM models
- `@modelGroup`, `@modelName`, `@modelDescription`

```json
{
  "inputs": {
    "models": ["./models", "./schemas"]
  }
}
```

### 4. **`tsdoc`** - TypeScript Documentation

TypeScript/JSDoc documentation for interfaces and types.

**Files**: `.ts`, `.tsx`, `.d.ts`

**Enabled parsers**:
- `@apiSchema` - TypeScript interfaces
- `@apiDefine` - Shared definitions
- `@apiUse` - Use definitions

```json
{
  "inputs": {
    "tsdoc": ["./types", "./interfaces"]
  }
}
```

### 5. **`mqtt`** - MQTT/IoT Protocol

MQTT endpoint documentation for IoT.

**Files**: `.js`, `.ts`, `.jsx`, `.tsx`

**Enabled parsers**:
- `@mqtt`, `@mqttGroup`
- `@topic`, `@topicParam`
- `@qos`, `@retain`, `@auth`
- `@payload`, `@payloadSchema`
- `@responsetopic`, `@examplePublish`, `@exampleSubscribe`

```json
{
  "inputs": {
    "mqtt": ["./mqtt", "./iot-devices"]
  }
}
```

### 6. **`openapi`** - OpenAPI 3.0 Specifications

Native OpenAPI/Swagger specifications.

**Files**: `.js`, `.ts`, `.yaml`, `.yml`, `.json`

**Enabled parsers**:
- `@openapi`
- `@openapiPath`
- `@openapiOperation`
- `@openapiSchema`
- `@openapiComponent`

```json
{
  "inputs": {
    "openapi": ["./openapi-specs"]
  }
}
```

### 7. **`graphql`** - GraphQL Schemas

GraphQL schemas and resolvers.

**Files**: `.js`, `.ts`, `.graphql`, `.gql`

**Enabled parsers**:
- `@apiSchema`
- `@apiDefine`
- `@apiParam`
- `@apiSuccess`
- `@apiError`
- `@apiExample`

```json
{
  "inputs": {
    "graphql": ["./graphql", "./resolvers"]
  }
}
```

---

## Configuration

### Basic Format

```json
{
  "inputs": {
    "category": ["./path/to/directory"],
    "another-category": ["./another/path", "./more/paths"]
  }
}
```

### Complete Example

```json
{
  "name": "My Documented API",
  "version": "1.0.0",
  "inputs": {
    "api": ["./src/routes", "./src/controllers"],
    "models": ["./src/models"],
    "tsdoc": ["./src/types"],
    "mqtt": ["./src/mqtt"],
    "docs": ["./markdown"]
  }
}
```

### Relative Paths

Paths are resolved **relative to the directory where `apidoc.json` is located**:

```json
{
  "inputs": {
    "api": ["."],              // Same directory as apidoc.json
    "models": ["../models"],   // Parent directory
    "docs": ["./docs"]         // Subdirectory
  }
}
```

---

## Parsers by Category

### Verify Enabled Parsers

Use the `--debug` flag to see which parsers are being skipped:

```bash
./bin/apidoc --debug --config apidoc.json -o output/
```

Example output:
```
verbose: Parsing with category filter: api
debug: Skipping parser 'apidefine' for category 'api' in block: '0'
debug: found @api in block: 1
debug: found @apiParam in block: 1
```

### Filtering Behavior

| Category | Parser `@apiDefine` | Parser `@api` | Parser `@model` |
|----------|---------------------|---------------|-----------------|
| `api`    | ❌ SKIP             | ✅ PARSE      | ❌ SKIP         |
| `models` | ✅ PARSE            | ❌ SKIP       | ✅ PARSE        |
| `tsdoc`  | ✅ PARSE            | ❌ SKIP       | ❌ SKIP         |
| custom   | ✅ PARSE            | ✅ PARSE      | ✅ PARSE        |

> **Note**: Custom categories (not predefined) run ALL available parsers.

---

## Usage Examples

### Example 1: REST API + Models

**Project Structure**:
```
my-project/
├── apidoc.json
├── routes/
│   ├── users.js      # REST endpoints
│   └── products.js
└── models/
    ├── User.ts       # Sequelize models
    └── Product.ts
```

**apidoc.json**:
```json
{
  "name": "My API",
  "version": "1.0.0",
  "inputs": {
    "api": ["./routes"],
    "models": ["./models"]
  }
}
```

**Result**:
- `routes/*.js` → Only REST API parsers (`@api`, `@apiParam`, etc.)
- `models/*.ts` → Only model parsers (`@model`, `@apiSchema`, etc.)

### Example 2: Full-Stack Project

**Project Structure**:
```
fullstack-app/
├── apidoc.json
├── backend/
│   ├── api/          # REST endpoints
│   ├── models/       # Database models
│   └── mqtt/         # MQTT handlers
├── frontend/
│   └── types/        # TypeScript types
└── docs/
    └── guides/       # Markdown docs
```

**apidoc.json**:
```json
{
  "inputs": {
    "api": ["./backend/api"],
    "models": ["./backend/models"],
    "mqtt": ["./backend/mqtt"],
    "tsdoc": ["./frontend/types"],
    "docs": ["./docs/guides"]
  }
}
```

### Example 3: Monorepo with Multiple Services

```json
{
  "inputs": {
    "api": [
      "./services/auth/routes",
      "./services/users/routes",
      "./services/payments/routes"
    ],
    "models": [
      "./shared/models"
    ],
    "mqtt": [
      "./services/iot/mqtt"
    ]
  }
}
```

---

## Testing and Verification

### Testing Structure

Use the `examples/category-test/` directory as reference:

```
examples/category-test/
├── apidoc.json
├── api-only/
│   └── users.js          # Only @api tags
├── models-only/
│   └── product.ts        # Only @model tags
├── tsdoc-only/
│   └── types.ts          # Only @apiSchema
├── mqtt-only/
│   └── mqtt-examples.ts  # Only @mqtt tags
└── docs-only/
    └── intro.md          # Only markdown
```

### Verification Commands

1. **Generate Documentation**:
```bash
./bin/apidoc --config examples/category-test/apidoc.json \
             -o tmp/category-test-output
```

2. **View Parsers in Debug**:
```bash
./bin/apidoc --debug \
             --config examples/category-test/apidoc.json \
             -o tmp/test \
             2>&1 | grep -E "(Skipping|found @)"
```

3. **Verify Output**:
```bash
# Open in browser
open tmp/category-test-output/index.html

# View generated structure
ls -R tmp/category-test-output/
```

### Verification Checklist

- [ ] **API Endpoints**: Verify that 4 endpoints from `users.js` appear
- [ ] **Models**: Verify that `Product` model from `product.ts` appears
- [ ] **Types**: Verify TypeScript interfaces from `types.ts`
- [ ] **MQTT**: Verify MQTT endpoints from `mqtt-examples.ts`
- [ ] **Filtering**: Verify that `@apiDefine` does NOT appear (filtered by `api` category)
- [ ] **Groups**: Verify that groups are correctly organized

---

## Troubleshooting

### Problem: "Parsers are not being filtered"

**Symptom**: All parsers run on all files.

**Solution**:
1. Verify you're using the `inputs` field (not `input`)
2. Compile the project: `npm run build`
3. Use `--debug` to see filtering in action

### Problem: "Unnamed" endpoints appear

**Symptom**: Documentation shows endpoints without correct name.

**Possible causes**:

1. **Parser doesn't exist**:
   ```bash
   # Verify if parser exists
   grep "parser-name:" core/index.ts
   ```

2. **Incorrect names**: Parser names are **all lowercase**
   - ❌ `@apiParam` → `apiParam`
   - ✅ `@apiParam` → `apiparam`

3. **Parser not enabled for category**:
   - Check `core/apidoc/category-parsers.ts`
   - Add parser to `enabledParsers` array

### Problem: "Files are not being parsed"

**Solution**:
1. Verify paths are correct (relative to `apidoc.json`)
2. Verify file extensions in `filePatterns`
3. Verify directory exists:
   ```bash
   ls -la $(dirname apidoc.json)/your-directory
   ```

### Problem: "Too many parsers running"

**Solution**: You're using a custom category (not predefined).

Options:
1. Use a predefined category (`api`, `models`, etc.)
2. Define a new category in `category-parsers.ts`

---

## Contributing

To add a new predefined category:

1. Edit `/core/apidoc/category-parsers.ts`
2. Add your category to the `CATEGORY_PARSERS` object
3. Define `filePatterns` and `enabledParsers`
4. Document in this file

**Example**:
```typescript
export const CATEGORY_PARSERS = {
    // ... existing categories

    'my-category': {
        filePatterns: ['.ext'],
        enabledParsers: [
            'parser1',
            'parser2',
        ],
        description: 'Description of my category',
    },
};
```

---

## Resources

- **Configuration file**: `core/apidoc/category-parsers.ts`
- **Implementation**: `core/parser.ts` (line 299)
- **Examples**: `examples/category-test/`
- **Tests**: `npm run build && ./bin/apidoc --config examples/category-test/apidoc.json -o tmp/test`

---

**Version**: 5.0.0
**Last Updated**: 2025-10-03
