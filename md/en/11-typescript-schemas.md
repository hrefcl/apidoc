---
title: "TypeScript Schema Integration"
category: "Modern Protocols"
order: 11
---

# 🔧 TypeScript Schema Integration

Complete guide for integrating TypeScript interfaces and types with APIDoc documentation, providing type safety and automatic schema generation.

## 🚀 Overview

APIDoc 4.0 provides seamless TypeScript integration for modern development workflows:

- **🎯 Type-Safe Documentation**: Generate docs from TypeScript interfaces
- **🔄 Automatic Schema Generation**: Convert TypeScript types to API schemas
- **✅ Runtime Validation**: Type-safe request/response validation
- **📋 Interface Synchronization**: Keep docs in sync with code
- **🧪 Enhanced Development**: IntelliSense and compile-time checking

## 🎯 @apiSchema Integration

### Basic TypeScript Interface Documentation
```typescript
// types/user.ts
export interface CreateUserRequest {
  /** User's full name (2-50 characters) */
  name: string;
  /** Valid email address */
  email: string;
  /** Strong password (minimum 8 characters) */
  password: string;
  /** User role */
  role?: 'user' | 'admin' | 'moderator';
  /** User profile data */
  profile?: UserProfile;
}

export interface UserProfile {
  /** Profile biography */
  bio?: string;
  /** User interests */
  interests?: string[];
  /** Social media links */
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface User {
  /** Unique user identifier */
  id: number;
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's role in the system */
  role: 'user' | 'admin' | 'moderator';
  /** Account activation status */
  active: boolean;
  /** User profile information */
  profile: UserProfile;
  /** Account creation timestamp */
  createdAt: Date;
  /** Last account update timestamp */
  updatedAt: Date;
}
```

### APIDoc with TypeScript Schema Reference
```javascript
/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new user account with comprehensive validation.
 * This endpoint accepts TypeScript-validated user data and returns a
 * complete user object with profile information.
 *
 * @apiSchema (Body) {CreateUserRequest} user User creation data
 * @apiSchema (Success) {User} user Created user object
 *
 * @apiBody {CreateUserRequest} user User data conforming to TypeScript interface
 *
 * @apiSuccess (201) {User} user Created user with all fields populated
 *
 * @apiError (400) {Object} error Validation error
 * @apiError (400) {String} error.type Error type identifier
 * @apiError (400) {String} error.message Human-readable error message
 * @apiError (400) {Object[]} [error.details] Field-specific validation errors
 *
 * @apiExample {typescript} TypeScript Usage:
 * import { CreateUserRequest, User } from './types/user';
 *
 * const userData: CreateUserRequest = {
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "securePassword123",
 *   role: "user",
 *   profile: {
 *     bio: "Software developer passionate about TypeScript",
 *     interests: ["programming", "music", "travel"],
 *     social: {
 *       github: "johndoe",
 *       twitter: "@johndoe"
 *     }
 *   }
 * };
 *
 * const response = await fetch('/api/users', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ user: userData })
 * });
 *
 * const result: { user: User } = await response.json();
 *
 * @apiSuccessExample {json} Success Response:
 * HTTP/1.1 201 Created
 * {
 *   "user": {
 *     "id": 1,
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "role": "user",
 *     "active": true,
 *     "profile": {
 *       "bio": "Software developer passionate about TypeScript",
 *       "interests": ["programming", "music", "travel"],
 *       "social": {
 *         "github": "johndoe",
 *         "twitter": "@johndoe"
 *       }
 *     },
 *     "createdAt": "2024-01-15T10:30:00Z",
 *     "updatedAt": "2024-01-15T10:30:00Z"
 *   }
 * }
 */
```

## 🔧 Complex TypeScript Patterns

### Generic Types and Utility Types
```typescript
// types/api.ts
export interface ApiResponse<T> {
  /** Response data */
  data: T;
  /** Response metadata */
  meta: {
    /** Request timestamp */
    timestamp: string;
    /** Response time in milliseconds */
    responseTime: number;
    /** API version used */
    version: string;
  };
  /** Success indicator */
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  /** Pagination information */
  pagination: {
    /** Current page number */
    page: number;
    /** Items per page */
    limit: number;
    /** Total number of items */
    total: number;
    /** Total number of pages */
    pages: number;
    /** Has next page */
    hasNext: boolean;
    /** Has previous page */
    hasPrev: boolean;
  };
}

export interface QueryOptions {
  /** Page number for pagination */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Search query string */
  search?: string;
  /** Sort field */
  sort?: string;
  /** Sort order */
  order?: 'asc' | 'desc';
  /** Filters to apply */
  filters?: Record<string, any>;
}

export type UpdateUserRequest = Partial<Pick<User, 'name' | 'email'>> & {
  profile?: Partial<UserProfile>;
  preferences?: UserPreferences;
};

export interface UserPreferences {
  /** Email notification settings */
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  /** UI theme preference */
  theme: 'light' | 'dark' | 'auto';
  /** Preferred language */
  language: string;
  /** Timezone setting */
  timezone: string;
}
```

### Advanced API Documentation with Generics
```javascript
/**
 * @api {get} /users Search Users
 * @apiName SearchUsers
 * @apiGroup Users
 * @apiVersion 1.0.0
 *
 * @apiDescription Search and retrieve users with pagination and filtering.
 * Returns a paginated response following TypeScript generic patterns.
 *
 * @apiSchema (Query) {QueryOptions} options Search and pagination options
 * @apiSchema (Success) {PaginatedResponse<User>} response Paginated user list
 *
 * @apiQuery {Number{1..100}} [page=1] Page number
 * @apiQuery {Number{1..100}} [limit=20] Items per page
 * @apiQuery {String} [search] Search term for name or email
 * @apiQuery {String="name","email","createdAt"} [sort=createdAt] Sort field
 * @apiQuery {String="asc","desc"} [order=desc] Sort order
 * @apiQuery {Object} [filters] Additional filters
 * @apiQuery {String="user","admin","moderator"} [filters.role] Filter by role
 * @apiQuery {Boolean} [filters.active] Filter by active status
 *
 * @apiSuccess {Object} data Response data wrapper
 * @apiSuccess {User[]} data.data Array of user objects
 * @apiSuccess {Object} data.meta Response metadata
 * @apiSuccess {Object} data.pagination Pagination information
 * @apiSuccess {Boolean} data.success Success indicator
 *
 * @apiExample {typescript} TypeScript Usage:
 * import { QueryOptions, PaginatedResponse, User } from './types/api';
 *
 * const queryOptions: QueryOptions = {
 *   page: 1,
 *   limit: 20,
 *   search: "john",
 *   sort: "name",
 *   order: "asc",
 *   filters: {
 *     role: "user",
 *     active: true
 *   }
 * };
 *
 * const response = await fetch('/api/users?' + new URLSearchParams(queryOptions));
 * const result: PaginatedResponse<User> = await response.json();
 *
 * // Type-safe access to response data
 * result.data.forEach((user: User) => {
 *   console.log(`User: ${user.name} (${user.email})`);
 * });
 *
 * @apiSuccessExample {json} Success Response:
 * {
 *   "data": [
 *     {
 *       "id": 1,
 *       "name": "John Doe",
 *       "email": "john@example.com",
 *       "role": "user",
 *       "active": true,
 *       "profile": {
 *         "bio": "Software developer",
 *         "interests": ["programming", "music"]
 *       },
 *       "createdAt": "2024-01-15T10:30:00Z",
 *       "updatedAt": "2024-01-15T10:30:00Z"
 *     }
 *   ],
 *   "meta": {
 *     "timestamp": "2024-01-15T14:30:00Z",
 *     "responseTime": 45,
 *     "version": "1.0.0"
 *   },
 *   "pagination": {
 *     "page": 1,
 *     "limit": 20,
 *     "total": 150,
 *     "pages": 8,
 *     "hasNext": true,
 *     "hasPrev": false
 *   },
 *   "success": true
 * }
 */
```

## 🔄 Runtime Validation Integration

### Zod Schema Integration
```typescript
// validation/user.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(50).describe('User\'s full name (2-50 characters)'),
  email: z.string().email().describe('Valid email address'),
  password: z.string().min(8).describe('Strong password (minimum 8 characters)'),
  role: z.enum(['user', 'admin', 'moderator']).optional().default('user'),
  profile: z.object({
    bio: z.string().optional().describe('Profile biography'),
    interests: z.array(z.string()).optional().describe('User interests'),
    social: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().optional()
    }).optional()
  }).optional()
});

export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['user', 'admin', 'moderator']),
  active: z.boolean(),
  profile: z.object({
    bio: z.string().nullable(),
    interests: z.array(z.string()),
    social: z.object({
      twitter: z.string().nullable(),
      linkedin: z.string().nullable(),
      github: z.string().nullable()
    }).nullable()
  }),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type User = z.infer<typeof UserSchema>;
```

### API Controller with Validation
```typescript
// controllers/userController.ts
import { Request, Response } from 'express';
import { CreateUserSchema, UserSchema } from '../validation/user';

/**
 * @api {post} /users Create User
 * @apiName CreateUser
 * @apiGroup Users
 *
 * @apiDescription Creates a new user with Zod schema validation.
 * Request body is validated against TypeScript interface at runtime.
 *
 * @apiSchema (Body) {CreateUserRequest} user User creation data (Zod validated)
 * @apiSchema (Success) {User} user Created user object (Zod validated)
 *
 * @apiBody {CreateUserRequest} user User data conforming to Zod schema
 *
 * @apiSuccess (201) {User} user Created user with validation guarantees
 *
 * @apiError (400) {Object} error Zod validation error
 * @apiError (400) {String} error.type="ZodError" Error type
 * @apiError (400) {String} error.message Validation error message
 * @apiError (400) {Object[]} error.issues Detailed validation issues
 */
export async function createUser(req: Request, res: Response) {
  try {
    // Runtime validation with Zod
    const validatedData = CreateUserSchema.parse(req.body.user);

    // Business logic (type-safe)
    const userData = {
      ...validatedData,
      id: Math.floor(Math.random() * 1000),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Validate output (ensures API contract compliance)
    const validatedUser = UserSchema.parse(userData);

    res.status(201).json({ user: validatedUser });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: {
          type: 'ZodError',
          message: 'Validation failed',
          issues: error.issues
        }
      });
    } else {
      res.status(500).json({
        error: {
          type: 'InternalError',
          message: 'Internal server error'
        }
      });
    }
  }
}
```

## 📋 Schema Generation Tools

### Automatic Schema Generation Script
```typescript
// scripts/generate-schemas.ts
import * as fs from 'fs';
import * as path from 'path';
import { Project, InterfaceDeclaration, TypeAliasDeclaration } from 'ts-morph';

interface SchemaProperty {
  name: string;
  type: string;
  description?: string;
  optional: boolean;
  constraints?: string[];
}

interface GeneratedSchema {
  name: string;
  properties: SchemaProperty[];
  description?: string;
}

class TypeScriptSchemaGenerator {
  private project: Project;

  constructor(tsConfigPath?: string) {
    this.project = new Project({
      tsConfigFilePath: tsConfigPath || './tsconfig.json'
    });
  }

  async generateSchemasFromFiles(filePaths: string[]): Promise<GeneratedSchema[]> {
    const schemas: GeneratedSchema[] = [];

    for (const filePath of filePaths) {
      const sourceFile = this.project.addSourceFileAtPath(filePath);

      // Extract interfaces
      const interfaces = sourceFile.getInterfaces();
      for (const interfaceDecl of interfaces) {
        const schema = this.generateSchemaFromInterface(interfaceDecl);
        schemas.push(schema);
      }

      // Extract type aliases
      const typeAliases = sourceFile.getTypeAliases();
      for (const typeAlias of typeAliases) {
        const schema = this.generateSchemaFromTypeAlias(typeAlias);
        schemas.push(schema);
      }
    }

    return schemas;
  }

  private generateSchemaFromInterface(interfaceDecl: InterfaceDeclaration): GeneratedSchema {
    const name = interfaceDecl.getName();
    const properties: SchemaProperty[] = [];

    for (const property of interfaceDecl.getProperties()) {
      const propertyName = property.getName();
      const propertyType = property.getType().getText();
      const isOptional = property.hasQuestionToken();

      // Extract JSDoc comments for descriptions
      const jsDocs = property.getJsDocs();
      const description = jsDocs.length > 0 ?
        jsDocs[0].getDescription().trim() : undefined;

      properties.push({
        name: propertyName,
        type: propertyType,
        description,
        optional: isOptional,
        constraints: this.extractConstraints(property)
      });
    }

    return {
      name,
      properties,
      description: this.extractDescription(interfaceDecl)
    };
  }

  private generateSchemaFromTypeAlias(typeAlias: TypeAliasDeclaration): GeneratedSchema {
    const name = typeAlias.getName();
    const typeText = typeAlias.getTypeNode()?.getText() || '';

    return {
      name,
      properties: [],
      description: `Type alias: ${typeText}`
    };
  }

  private extractDescription(node: any): string | undefined {
    const jsDocs = node.getJsDocs();
    return jsDocs.length > 0 ? jsDocs[0].getDescription().trim() : undefined;
  }

  private extractConstraints(property: any): string[] {
    const constraints: string[] = [];
    const typeText = property.getType().getText();

    // Extract string length constraints
    if (typeText.includes('string') && property.getTypeNode()) {
      // This is a simplified example - real implementation would be more complex
      const jsDocs = property.getJsDocs();
      if (jsDocs.length > 0) {
        const comment = jsDocs[0].getDescription();
        const lengthMatch = comment.match(/\((\d+)-(\d+) characters\)/);
        if (lengthMatch) {
          constraints.push(`minLength: ${lengthMatch[1]}`);
          constraints.push(`maxLength: ${lengthMatch[2]}`);
        }
      }
    }

    return constraints;
  }

  async generateAPIDocFile(schemas: GeneratedSchema[], outputPath: string): Promise<void> {
    let content = '// Auto-generated APIDoc schema definitions\n\n';

    for (const schema of schemas) {
      content += `/**\n`;
      content += ` * @apiDefine ${schema.name}\n`;

      if (schema.description) {
        content += ` * ${schema.description}\n`;
      }

      for (const property of schema.properties) {
        const optional = property.optional ? '[' : '';
        const closing = property.optional ? ']' : '';
        const description = property.description || '';

        content += ` * @apiSuccess {${property.type}} ${optional}${property.name}${closing} ${description}\n`;
      }

      content += ` */\n\n`;
    }

    await fs.promises.writeFile(outputPath, content, 'utf8');
  }
}

// Usage
async function main() {
  const generator = new TypeScriptSchemaGenerator();

  const schemas = await generator.generateSchemasFromFiles([
    './types/user.ts',
    './types/api.ts',
    './types/product.ts'
  ]);

  await generator.generateAPIDocFile(schemas, './docs/generated-schemas.js');

  console.log(`Generated ${schemas.length} schemas`);
  console.log('Schemas:', schemas.map(s => s.name).join(', '));
}

if (require.main === module) {
  main().catch(console.error);
}
```

## 🧪 Testing with TypeScript

### Type-Safe API Testing
```typescript
// tests/api.test.ts
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../app';
import { CreateUserRequest, User, ApiResponse } from '../types';

describe('User API', () => {
  describe('POST /users', () => {
    it('should create user with valid TypeScript data', async () => {
      const userData: CreateUserRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'testPassword123',
        role: 'user',
        profile: {
          bio: 'Test user biography',
          interests: ['testing', 'typescript']
        }
      };

      const response = await request(app)
        .post('/api/users')
        .send({ user: userData })
        .expect(201);

      // Type-safe response validation
      const result: { user: User } = response.body;

      expect(result.user.id).toBeGreaterThan(0);
      expect(result.user.name).toBe(userData.name);
      expect(result.user.email).toBe(userData.email);
      expect(result.user.role).toBe(userData.role);
      expect(result.user.active).toBe(true);
      expect(result.user.profile.bio).toBe(userData.profile?.bio);
      expect(result.user.profile.interests).toEqual(userData.profile?.interests);
      expect(new Date(result.user.createdAt)).toBeInstanceOf(Date);
    });

    it('should validate TypeScript constraints', async () => {
      const invalidData = {
        name: 'X', // Too short
        email: 'invalid-email', // Invalid format
        password: '123' // Too short
      };

      const response = await request(app)
        .post('/api/users')
        .send({ user: invalidData })
        .expect(400);

      expect(response.body.error.type).toBe('ZodError');
      expect(response.body.error.issues).toHaveLength(3);
    });
  });

  describe('GET /users', () => {
    it('should return paginated TypeScript response', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({
          page: 1,
          limit: 10,
          sort: 'name',
          order: 'asc'
        })
        .expect(200);

      // Type-safe response validation
      const result: ApiResponse<User[]> = response.body;

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.meta.timestamp).toBeDefined();
      expect(result.meta.responseTime).toBeGreaterThan(0);
      expect(result.meta.version).toBe('1.0.0');

      // Validate each user object
      result.data.forEach((user: User) => {
        expect(typeof user.id).toBe('number');
        expect(typeof user.name).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(['user', 'admin', 'moderator']).toContain(user.role);
        expect(typeof user.active).toBe('boolean');
      });
    });
  });
});
```

## 🔧 Build Integration

### TypeScript Build with Schema Generation
```json
{
  "scripts": {
    "build": "npm run generate:schemas && tsc && npm run docs",
    "generate:schemas": "ts-node scripts/generate-schemas.ts",
    "docs": "apidoc -i src/ -o docs/ -f '\\.(ts|js)$'",
    "docs:watch": "nodemon --watch src --ext ts --exec \"npm run docs\"",
    "type-check": "tsc --noEmit",
    "validate:schemas": "ts-node scripts/validate-schemas.ts"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.0.0",
    "ts-morph": "^20.0.0",
    "zod": "^3.22.0",
    "@hrefcl/apidoc": "^4.0.5"
  }
}
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*",
    "types/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "docs"
  ]
}
```

## 📋 Best Practices

### 1. Type Definition Organization
- ✅ Separate interfaces by domain/feature
- ✅ Use consistent naming conventions
- ✅ Document all interface properties
- ✅ Export types for reuse

### 2. Schema Validation
- ✅ Implement runtime validation with Zod
- ✅ Validate both input and output
- ✅ Provide detailed error messages
- ✅ Test validation edge cases

### 3. Documentation Synchronization
- ✅ Generate schemas automatically
- ✅ Keep TypeScript and APIDoc in sync
- ✅ Use build-time validation
- ✅ Include TypeScript examples

### 4. Development Workflow
- ✅ Enable strict TypeScript checking
- ✅ Use TypeScript in tests
- ✅ Implement CI/CD type checking
- ✅ Monitor schema breaking changes

APIDoc's TypeScript integration provides powerful type safety and development experience improvements while maintaining clear, comprehensive API documentation.