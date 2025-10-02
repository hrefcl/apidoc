# 📊 Esquemas TypeScript

APIDoc 5.0 introduce integración nativa con TypeScript, permitiendo generar documentación automáticamente desde tipos e interfaces TypeScript usando la etiqueta `@apiSchema`.

## 🚀 Características Principales

### ✨ Funcionalidades
- **🎯 Tipado Automático**: Genera documentación desde interfaces TypeScript
- **🔄 Sincronización**: Mantén documentación actualizada con tipos de código
- **📝 Validación**: Valida automáticamente ejemplos contra esquemas
- **🎨 Renderizado Rico**: Tablas detalladas con tipos, descripciones y ejemplos
- **🔗 Referencias**: Soporte para tipos importados y referencias complejas

## 📋 Configuración Básica

### Requisitos
```bash
# Instalar dependencias de TypeScript
npm install --save-dev typescript @types/node

# APIDoc ya incluye soporte nativo para TypeScript
```

### tsconfig.json Recomendado
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

## 🏷️ Uso de @apiSchema

### Sintaxis Básica
```typescript
/**
 * @apiSchema {TypeName} Descripción del esquema
 * @apiSchemaFile ./path/to/types.ts
 */
```

### Ejemplo Simple
```typescript
// types/user.ts
export interface User {
  /** ID único del usuario */
  id: number;

  /** Nombre completo del usuario */
  name: string;

  /** Email del usuario (debe ser válido) */
  email: string;

  /** Fecha de creación */
  createdAt: Date;

  /** Perfil del usuario (opcional) */
  profile?: UserProfile;
}

export interface UserProfile {
  /** URL del avatar */
  avatar?: string;

  /** Biografía del usuario */
  bio?: string;

  /** Configuraciones de usuario */
  settings: {
    /** Notificaciones habilitadas */
    notifications: boolean;

    /** Tema preferido */
    theme: 'light' | 'dark';
  };
}
```

```javascript
// api/users.js
/**
 * @api {get} /users/:id Obtener Usuario
 * @apiName GetUser
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id ID único del usuario
 *
 * @apiSuccess {Object} user Datos del usuario
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

## 🔧 Configuración Avanzada

### Múltiples Archivos de Esquemas
```javascript
/**
 * @api {post} /orders Crear Pedido
 * @apiName CreateOrder
 * @apiGroup Orders
 *
 * @apiParam {Object} order Datos del pedido
 * @apiSchema {CreateOrderRequest} order
 * @apiSchemaFile ../types/orders.ts
 *
 * @apiSuccess {Object} order Pedido creado
 * @apiSchema {Order} order
 * @apiSchemaFile ../types/orders.ts
 *
 * @apiSuccess {Object} user Usuario que creó el pedido
 * @apiSchema {User} user
 * @apiSchemaFile ../types/user.ts
 */
```

### Esquemas Inline
```typescript
/**
 * @api {put} /users/:id/settings Actualizar Configuración
 * @apiName UpdateUserSettings
 * @apiGroup User
 *
 * @apiParam {Number} id ID del usuario
 * @apiParam {Object} settings Nueva configuración
 * @apiSchema {UserSettings} settings
 *
 * @apiSchemaInline UserSettings
 * interface UserSettings {
 *   // Notificaciones por email
 *   emailNotifications: boolean;
 *
 *   // Notificaciones push
 *   pushNotifications: boolean;
 *
 *   // Tema de la interfaz
 *   theme: 'light' | 'dark' | 'auto';
 *
 *   // Idioma preferido
 *   language: 'es' | 'en' | 'fr';
 * }
 */
```

## 📊 Tipos Soportados

### Tipos Primitivos
```typescript
interface Example {
  // Números
  id: number;
  price: number;
  rating: 1 | 2 | 3 | 4 | 5;

  // Cadenas
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';

  // Booleanos
  isActive: boolean;
  isVerified: boolean;

  // Fechas
  createdAt: Date;
  updatedAt: Date;

  // Opcionales
  description?: string;
  tags?: string[];
}
```

### Tipos Complejos
```typescript
interface Product {
  // Arrays
  tags: string[];
  images: string[];
  variants: ProductVariant[];

  // Objetos anidados
  price: {
    amount: number;
    currency: string;
    tax: number;
  };

  // Uniones
  status: 'draft' | 'published' | 'archived';

  // Tipos genéricos
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

### Herencia e Interfaces
```typescript
// Interface base
interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Extensión de interface
interface User extends BaseEntity {
  name: string;
  email: string;
}

// Composición
interface UserWithProfile {
  user: User;
  profile: UserProfile;
  permissions: Permission[];
}

// Tipos utilitarios
interface PartialUser extends Partial<User> {}
interface RequiredProfile extends Required<UserProfile> {}
interface UserEmail = Pick<User, 'email'>;
```

## 🎨 Personalización de Renderizado

### Configuración en apidoc.json
```json
{
  "name": "Mi API",
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

### Anotaciones Personalizadas
```typescript
interface User {
  /**
   * ID único del usuario
   * @example 123
   * @minimum 1
   */
  id: number;

  /**
   * Email del usuario
   * @example user@example.com
   * @format email
   * @pattern ^\S+@\S+\.\S+$
   */
  email: string;

  /**
   * Edad del usuario
   * @example 25
   * @minimum 18
   * @maximum 120
   */
  age: number;

  /**
   * Fecha de registro
   * @example "2024-01-15T10:30:00Z"
   * @format date-time
   */
  registeredAt: Date;
}
```

## 🔄 Integración con OpenAPI

### Exportación a OpenAPI Schema
```typescript
/**
 * @api {post} /users Crear Usuario
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {Object} user Datos del usuario
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

### Generación Automática de Schemas OpenAPI
```javascript
// En el proceso de build
const { generateOpenAPISchemas } = require('@hrefcl/apidoc');

await generateOpenAPISchemas({
  src: ['./src/types'],
  output: './schemas/openapi.json',
  format: 'json' // o 'yaml'
});
```

## 🔍 Validación y Testing {#validación-de-ejemplos}

### Validación de Ejemplos
```typescript
// types/validation.ts
export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
}

// En tests
import { validateSchema } from '@hrefcl/apidoc/validators';

const example = {
  name: "Juan Pérez",
  email: "juan@example.com",
  age: 30
};

const isValid = validateSchema('CreateUserRequest', example, './types/validation.ts');
console.log(isValid); // true
```

### Testing de Tipos
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

## 🛠️ Herramientas de Desarrollo

### CLI para Schemas
```bash
# Validar esquemas TypeScript
apidoc validate-schemas --src ./types --strict

# Generar ejemplos desde esquemas
apidoc generate-examples --schema ./types/user.ts --output ./examples

# Convertir a OpenAPI
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

## 📈 Mejores Prácticas

### 1. Organización de Tipos
```
types/
├── api/
│   ├── users.ts        # Tipos de usuario
│   ├── products.ts     # Tipos de producto
│   └── orders.ts       # Tipos de pedidos
├── common/
│   ├── base.ts         # Tipos base
│   ├── pagination.ts   # Tipos de paginación
│   └── errors.ts       # Tipos de errores
└── index.ts            # Re-exportaciones
```

### 2. Documentación Completa
```typescript
/**
 * Representa un usuario del sistema
 * @version 1.0.0
 * @since 1.0.0
 */
export interface User {
  /**
   * Identificador único del usuario
   * @example 123
   * @minimum 1
   */
  id: number;

  /**
   * Nombre completo del usuario
   * @example "Juan Pérez"
   * @minLength 2
   * @maxLength 100
   */
  name: string;

  /**
   * Dirección de email única
   * @example "juan@example.com"
   * @format email
   */
  email: string;
}
```

### 3. Versionado de Schemas
```typescript
// v1/user.ts
export interface UserV1 {
  id: number;
  name: string;
  email: string;
}

// v2/user.ts
export interface UserV2 extends Omit<UserV1, 'id'> {
  /** UUID en lugar de número */
  id: string;

  /** Nuevo campo añadido en v2 */
  avatar?: string;
}

// Alias para compatibilidad
export type User = UserV2;
```

La integración de TypeScript con APIDoc proporciona una forma poderosa de mantener la documentación sincronizada con el código, garantizando precisión y reduciendo el mantenimiento manual.