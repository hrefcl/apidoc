# 📊 TypeScript Schemas

APIDoc 5.0 introduces native TypeScript integration, allowing automatic documentation generation from TypeScript types and interfaces using the `@apiSchema` tag.

## 🚀 Main Features

### ✨ Functionalities
- **🎯 Automatic Typing**: Generate documentation from TypeScript interfaces
- **🔄 Synchronization**: Keep documentation updated with code types
- **📝 Validation**: Automatically validate examples against schemas
- **🎨 Rich Rendering**: Detailed tables with types, descriptions, and examples
- **🔗 References**: Support for imported types and complex references

## 📋 Basic Configuration

### Requirements
```bash
# Install TypeScript dependencies
npm install --save-dev typescript @types/node

# APIDoc already includes native TypeScript support
```

### Recommended tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "docs"]
}
```

## 🏷️ Using @apiSchema

### Basic Syntax
```typescript
/**
 * @apiSchema {TypeName} Schema description
 * @apiSchemaFile ./path/to/types.ts
 */
```

### Simple Example
```typescript
// types/user.ts
export interface User {
  /** User's unique ID */
  id: number;

  /** User's full name */
  name: string;

  /** User's email (must be valid) */
  email: string;

  /** Creation date */
  createdAt: Date;

  /** User's profile (optional) */
  profile?: UserProfile;
}

export interface UserProfile {
  /** Avatar URL */
  avatar?: string;

  /** User's biography */
  bio?: string;

  /** User settings */
  settings: {
    /** Notifications enabled */
    notifications: boolean;

    /** Preferred theme */
    theme: 'light' | 'dark';
  };
}
```

```javascript
// api/users.js
/**
 * @api {get} /users/:id Get User
 * @apiName GetUser
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id User's unique ID
 *
 * @apiSuccess {Object} user User data
 * @apiSchema {User} user
 * @apiSchemaFile ../types/user.ts
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "id": 1,
 *         "name": "Juan Pérez",
 *         "email": "juan@example.com",
 *         "createdAt": "2024-01-15T10:30:00Z",
 *         "profile": {
 *           "avatar": "https://avatar.com/juan.jpg",
 *           "bio": "Desarrollador Full Stack",
 *           "settings": {
 *             "notifications": true,
 *             "theme": "dark"
 *           }
 *         }
 *       }
 *     }
 */
```

## 🔧 Advanced Configuration

### Multiple Schema Files
```javascript
/**
 * @api {post} /orders Create Order
 * @apiName CreateOrder
 * @apiGroup Orders
 *
 * @apiParam {Object} order Order data
 * @apiSchema {CreateOrderRequest} order
 * @apiSchemaFile ../types/orders.ts
 *
 * @apiSuccess {Object} order Created order
 * @apiSchema {Order} order
 * @apiSchemaFile ../types/orders.ts
 *
 * @apiSuccess {Object} user User who created the order
 * @apiSchema {User} user
 * @apiSchemaFile ../types/user.ts
 */
```

### Inline Schemas
```typescript
/**
 * @api {put} /users/:id/settings Update Settings
 * @apiName UpdateUserSettings
 * @apiGroup User
 *
 * @apiParam {Number} id User ID
 * @apiParam {Object} settings New settings
 * @apiSchema {UserSettings} settings
 *
 * @apiSchemaInline UserSettings
 * interface UserSettings {
 *   // Email notifications
 *   emailNotifications: boolean;
 *
 *   // Push notifications
 *   pushNotifications: boolean;
 *
 *   // Interface theme
 *   theme: 'light' | 'dark' | 'auto';
 *
 *   // Preferred language
 *   language: 'es' | 'en' | 'fr';
 * }
 */
```

## 📊 Supported Types

### Primitive Types
```typescript
interface Example {
  // Numbers
  id: number;
  price: number;
  rating: 1 | 2 | 3 | 4 | 5;

  // Strings
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';

  // Booleans
  isActive: boolean;
  isVerified: boolean;

  // Dates
  createdAt: Date;
  updatedAt: Date;

  // Optional
  description?: string;
  tags?: string[];
}
```

### Complex Types
```typescript
interface Product {
  // Arrays
  tags: string[];
  images: string[];
  variants: ProductVariant[];

  // Nested objects
  price: {
    amount: number;
    currency: string;
    tax: number;
  };

  // Unions
  status: 'draft' | 'published' | 'archived';

  // Generic types
  metadata: Record<string, any>;

  // Enums
  category: ProductCategory;
}

enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home'
}

interface ProductVariant {
  sku: string;
  size?: string;
  color?: string;
  stock: number;
  price: number;
}
```

### Inheritance and Interfaces
```typescript
// Base interface
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface extension
interface User extends BaseEntity {
  name: string;
  email: string;
}

// Composition
interface UserWithProfile {
  user: User;
  profile: UserProfile;
  permissions: Permission[];
}

// Utility types
interface PartialUser extends Partial<User> {}
interface RequiredProfile extends Required<UserProfile> {}
interface UserEmail = Pick<User, 'email'>;
```

## 🎨 Rendering Customization

### Configuration in apidoc.json
```json
{
  "name": "My API",
  "version": "1.0.0",
  "typescript": {
    "enabled": true,
    "compilerOptions": {
      "strict": true,
      "target": "ES2020"
    },
    "schemaValidation": true,
    "generateExamples": true,
    "includeOptional": true
  }
}
```

### Custom Annotations
```typescript
interface User {
  /**
   * User's unique ID
   * @example 123
   * @minimum 1
   */
  id: number;

  /**
   * User's email
   * @example user@example.com
   * @format email
   * @pattern ^\S+@\S+\.\S+$
   */
  email: string;

  /**
   * User's age
   * @example 25
   * @minimum 18
   * @maximum 120
   */
  age: number;

  /**
   * Registration date
   * @example "2024-01-15T10:30:00Z"
   * @format date-time
   */
  registeredAt: Date;
}
```

## 🔄 OpenAPI Integration

### Exporting to OpenAPI Schema
```typescript
/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {Object} user User data
 * @apiSchema {CreateUserRequest} user
 * @apiSchemaFile ../types/user.ts
 * @apiSchemaOpenAPI true
 *
 * @openapi
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       $ref: '#/components/schemas/CreateUserRequest'
 */
```

### Automatic Generation of OpenAPI Schemas
```javascript
// In the build process
const { generateOpenAPISchemas } = require('@hrefcl/apidoc');

await generateOpenAPISchemas({
  src: ['./src/types'],
  output: './schemas/openapi.json',
  format: 'json' // or 'yaml'
});
```

## 🔍 Validation and Testing {#example-validation}

### Example Validation
```typescript
// types/validation.ts
export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

// In tests
import { validateSchema } from '@hrefcl/apidoc/validators';

const example = {
  name: "Juan Pérez",
  email: "juan@example.com",
  age: 30
};

const isValid = validateSchema('CreateUserRequest', example, './types/validation.ts');
console.log(isValid); // true
```

### Type Testing
```typescript
// tests/schema.test.ts
import { compileSchema } from '@hrefcl/apidoc';

describe('Schema Validation', () => {
  test('User schema should be valid', async () => {
    const schema = await compileSchema('./types/user.ts', 'User');

    expect(schema).toBeDefined();
    expect(schema.properties).toHaveProperty('id');
    expect(schema.properties).toHaveProperty('name');
    expect(schema.properties).toHaveProperty('email');
  });

  test('Example should match schema', async () => {
    const example = {
      id: 1,
      name: "Juan Pérez",
      email: "juan@example.com",
      createdAt: new Date()
    };

    const isValid = await validateExample('./types/user.ts', 'User', example);
    expect(isValid).toBe(true);
  });
});
```

## 🛠️ Development Tools

### CLI for Schemas
```bash
# Validate TypeScript schemas
apidoc validate-schemas --src ./types --strict

# Generate examples from schemas
apidoc generate-examples --schema ./types/user.ts --output ./examples

# Convert to OpenAPI
apidoc to-openapi --schemas ./types --output ./openapi.json
```

### VS Code Integration
```json
// .vscode/settings.json
{
  "apiDoc.typescript.enabled": true,
  "apiDoc.typescript.autoValidate": true,
  "apiDoc.schema.showInlineHelp": true,
  "apiDoc.schema.generateExamples": true
}
```

## 📈 Best Practices

### 1. Type Organization
```
types/
├── api/
│   ├── users.ts        # User types
│   ├── products.ts     # Product types
│   └── orders.ts       # Order types
├── common/
│   ├── base.ts         # Base types
│   ├── pagination.ts   # Pagination types
│   └── errors.ts       # Error types
└── index.ts            # Re-exports
```

### 2. Complete Documentation
```typescript
/**
 * Represents a system user
 * @version 1.0.0
 * @since 1.0.0
 */
export interface User {
  /**
   * User's unique identifier
   * @example 123
   * @minimum 1
   */
  id: number;

  /**
   * User's full name
   * @example "Juan Pérez"
   * @minLength 2
   * @maxLength 100
   */
  name: string;

  /**
   * Unique email address
   * @example "juan@example.com"
   * @format email
   */
  email: string;
}
```

### 3. Schema Versioning
```typescript
// v1/user.ts
export interface UserV1 {
  id: number;
  name: string;
  email: string;
}

// v2/user.ts
export interface UserV2 extends Omit<UserV1, 'id'> {
  /** UUID instead of number */
  id: string;

  /** New field added in v2 */
  avatar?: string;
}

// Alias for compatibility
export type User = UserV2;
```

TypeScript integration with APIDoc provides a powerful way to keep documentation synchronized with code, ensuring accuracy and reducing manual maintenance.
