# Sequelize Models Example

## Overview

This example demonstrates how to document APIs that use Sequelize ORM models with the `@apiSchema` annotation in APIDoc v5. It shows automatic schema extraction from Sequelize model definitions including validations, relationships, and lifecycle hooks.

## Parser Used

**Parser**: `models` (Sequelize Models Parser)

This parser extracts documentation from Sequelize model class definitions using TypeScript decorators. It automatically generates API documentation from model schemas, validations, and relationships.

## How it Works

The `models` parser reads Sequelize model definitions and extracts:

### Extracted Information

- **Model Attributes**: All fields defined with `@Attribute` decorator
- **Data Types**: Sequelize DataTypes mapped to JSON Schema types
- **Validations**: `@ValidateAttribute`, `@AllowNull`, `@Unique` decorators
- **Relationships**: `@HasMany`, `@BelongsTo`, `@HasOne`, `@BelongsToMany`
- **Indexes**: `@Index`, `@PrimaryKey` decorators
- **Timestamps**: `@CreatedAt`, `@UpdatedAt`, `@DeletedAt` fields
- **Lifecycle Hooks**: `@BeforeCreate`, `@AfterCreate`, `@BeforeUpdate`, etc.

### Model Annotation Format

```typescript
/**
 * @model User Complete user entity with authentication
 * @modelname UserModel
 * @modelgroup User Management
 * @modeldescription Complete User entity model with all attributes and relationships
 * @apiVersion 5.0.1
 */
@Table({ tableName: 'users', schema: 'public', timestamps: true, paranoid: true })
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @PrimaryKey
  @AutoIncrement
  @Attribute(DataTypes.INTEGER)
  declare id: CreationOptional<number>;

  @Unique
  @Attribute(DataTypes.STRING)
  declare email: string;
}
```

## Example Code

```typescript
/**
 * @model User Complete user entity with authentication and access control
 * @modelname UserModel
 * @modelgroup User Management
 * @modeldescription Complete User entity model with all attributes, relationships,
 * and lifecycle hooks automatically extracted from the Sequelize class definition.
 */
@Table({ tableName: 'users', schema: 'public', timestamps: true, paranoid: true })
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @PrimaryKey
  @Index
  @Unique
  @AutoIncrement
  @Attribute(DataTypes.INTEGER)
  declare id: CreationOptional<number>;

  @Index
  @Unique
  @AllowNull(false)
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare uuid: CreationOptional<string>;

  @Index
  @Unique
  @Attribute(DataTypes.STRING)
  @ValidateAttribute({
    async isUnique(value: string) {
      // Validation logic
    },
  })
  declare email: string;

  @CreatedAt
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  declare updatedAt: CreationOptional<Date>;

  // Relationships
  @BelongsTo(() => Community, { foreignKey: 'id_community' })
  community!: NonAttribute<Community>;

  @HasMany(() => Access, { foreignKey: 'id_user' })
  accesses!: NonAttribute<Access[]>;

  // Lifecycle Hooks
  @BeforeCreate
  static async DataFormating(instance: User) {
    // Normalize and validate data before creation
  }

  @AfterCreate
  static async AddUserToCommunity(instance: User) {
    // Create relationships after user creation
  }
}
```

## Files Structure

```
03-models/
├── apidoc.json          # Configuration file
├── README.md            # This file
└── src/
    └── User.ts          # Sequelize model with @model annotations
```

## Key Features

- **Automatic Schema Extraction**: Models automatically documented from decorators
- **Type Mapping**: Sequelize DataTypes to JSON Schema types
- **Validation Documentation**: `@ValidateAttribute` and constraints
- **Relationship Documentation**: `@HasMany`, `@BelongsTo` associations
- **Lifecycle Hooks**: `@BeforeCreate`, `@AfterUpdate` documented
- **Timestamps**: Auto-generated `createdAt`, `updatedAt`, `deletedAt`
- **Indexes**: Primary keys and unique constraints
- **Soft Deletes**: Paranoid mode with `@DeletedAt`

## Configuration (apidoc.json)

```json
{
  "name": "Models & Schemas Example",
  "version": "1.0.0",
  "title": "Products API - Sequelize Models Example",
  "url": "https://api.example.com",
  "inputs": {
    "docs": ["/"],
    "models": ["src"]
  },
  "order": ["Products", "Categories"]
}
```

### Inputs Configuration

- `"docs": ["/"]` - Includes this README.md in the documentation
- `"models": ["src"]` - Processes `@model` annotations in src/ directory
  - Extracts Sequelize model schemas
  - Documents attributes and relationships
  - Generates JSON Schema from models

## Testing

Generate documentation:

```bash
# From the example directory
apidoc generate -i src -o doc

# Or from project root
npm run example:models
```

Preview documentation:

```bash
npx serve doc
# Open http://localhost:3000
```

## What You'll Learn

1. How to document Sequelize models automatically
2. Using TypeScript decorators for model definitions
3. Documenting validations and constraints
4. Documenting model relationships (hasMany, belongsTo)
5. Lifecycle hook documentation
6. Auto-generated fields (timestamps, IDs)
7. Soft delete (paranoid mode) documentation

## Supported Sequelize Features

- **Data Types**: All Sequelize DataTypes supported
- **Decorators**: All @sequelize/core decorators
- **Validations**: Built-in and custom validators
- **Relationships**: All association types
- **Hooks**: All lifecycle hooks
- **Indexes**: Primary, unique, and composite indexes
- **Schemas**: PostgreSQL schema support
- **Paranoid**: Soft delete with deletedAt

## Related Examples

- **08-apiSchema**: For TypeScript interface documentation
- **12-tsdoc**: For TypeScript/JSDoc comments
- **01-basic-api**: For REST endpoint documentation
