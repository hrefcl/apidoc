/**
 * Sequelize Models for Products API
 *
 * This file defines database models using Sequelize ORM.
 * These models are referenced in API documentation using @apiSchema.
 */

import { DataTypes, Model } from 'sequelize';

/**
 * @apiDefine CategoryModel Category Database Model
 * @apiDescription Sequelize model for product categories
 *
 * @apiSchema {jsonschema} CategorySchema
 * @apiSchemaTitle Category
 * @apiSchemaDescription Product category with name and description
 *
 * @apiSchemaProperty {Integer} id Category unique identifier (auto-generated)
 * @apiSchemaProperty {String{3..50}} name Category name (required, unique)
 * @apiSchemaProperty {String{0..200}} description Category description (optional)
 * @apiSchemaProperty {DateTime} createdAt Creation timestamp (auto-generated)
 * @apiSchemaProperty {DateTime} updatedAt Last update timestamp (auto-generated)
 */
export interface CategorySchema {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Category Model Definition
 */
export class Category extends Model<CategorySchema> implements CategorySchema {
  public id!: number;
  public name!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

/**
 * @apiDefine ProductModel Product Database Model
 * @apiDescription Sequelize model for products with full validation
 *
 * @apiSchema {jsonschema} ProductSchema
 * @apiSchemaTitle Product
 * @apiSchemaDescription Complete product information with category relationship
 *
 * @apiSchemaProperty {Integer} id Product unique identifier (auto-generated)
 * @apiSchemaProperty {String{3..100}} name Product name (required)
 * @apiSchemaProperty {String{0..500}} description Product description (optional)
 * @apiSchemaProperty {Decimal(10,2)} price Product price (required, must be > 0)
 * @apiSchemaProperty {String} sku Stock Keeping Unit (required, unique, format: XXX-NNNN)
 * @apiSchemaProperty {Integer} stock Available stock quantity (required, >= 0)
 * @apiSchemaProperty {Integer} categoryId Foreign key to Category (required)
 * @apiSchemaProperty {String} status Product status (enum: active, inactive, discontinued)
 * @apiSchemaProperty {String} imageUrl Product image URL (optional, must be valid URL)
 * @apiSchemaProperty {Object} metadata Additional product metadata (JSON, optional)
 * @apiSchemaProperty {DateTime} createdAt Creation timestamp (auto-generated)
 * @apiSchemaProperty {DateTime} updatedAt Last update timestamp (auto-generated)
 *
 * @apiSchemaRelation belongsTo Category Product belongs to one category
 */
export interface ProductSchema {
  id: number;
  name: string;
  description?: string;
  price: number;
  sku: string;
  stock: number;
  categoryId: number;
  status: 'active' | 'inactive' | 'discontinued';
  imageUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  category?: CategorySchema;
}

/**
 * Product Model Definition
 */
export class Product extends Model<ProductSchema> implements ProductSchema {
  public id!: number;
  public name!: string;
  public description?: string;
  public price!: number;
  public sku!: string;
  public stock!: number;
  public categoryId!: number;
  public status!: 'active' | 'inactive' | 'discontinued';
  public imageUrl?: string;
  public metadata?: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Relations
  public readonly category?: Category;
}

/**
 * Sequelize Model Initialization (pseudo-code for documentation)
 *
 * In a real application, you would initialize these models like:
 *
 * Category.init({
 *   id: {
 *     type: DataTypes.INTEGER,
 *     autoIncrement: true,
 *     primaryKey: true
 *   },
 *   name: {
 *     type: DataTypes.STRING(50),
 *     allowNull: false,
 *     unique: true,
 *     validate: {
 *       len: [3, 50]
 *     }
 *   },
 *   description: {
 *     type: DataTypes.STRING(200),
 *     allowNull: true,
 *     validate: {
 *       len: [0, 200]
 *     }
 *   }
 * }, {
 *   sequelize,
 *   tableName: 'categories',
 *   timestamps: true
 * });
 *
 * Product.init({
 *   id: {
 *     type: DataTypes.INTEGER,
 *     autoIncrement: true,
 *     primaryKey: true
 *   },
 *   name: {
 *     type: DataTypes.STRING(100),
 *     allowNull: false,
 *     validate: {
 *       len: [3, 100]
 *     }
 *   },
 *   description: {
 *     type: DataTypes.STRING(500),
 *     allowNull: true
 *   },
 *   price: {
 *     type: DataTypes.DECIMAL(10, 2),
 *     allowNull: false,
 *     validate: {
 *       min: 0.01
 *     }
 *   },
 *   sku: {
 *     type: DataTypes.STRING(20),
 *     allowNull: false,
 *     unique: true,
 *     validate: {
 *       is: /^[A-Z]{3}-\d{4}$/
 *     }
 *   },
 *   stock: {
 *     type: DataTypes.INTEGER,
 *     allowNull: false,
 *     defaultValue: 0,
 *     validate: {
 *       min: 0
 *     }
 *   },
 *   categoryId: {
 *     type: DataTypes.INTEGER,
 *     allowNull: false,
 *     references: {
 *       model: 'categories',
 *       key: 'id'
 *     }
 *   },
 *   status: {
 *     type: DataTypes.ENUM('active', 'inactive', 'discontinued'),
 *     allowNull: false,
 *     defaultValue: 'active'
 *   },
 *   imageUrl: {
 *     type: DataTypes.STRING(255),
 *     allowNull: true,
 *     validate: {
 *       isUrl: true
 *     }
 *   },
 *   metadata: {
 *     type: DataTypes.JSON,
 *     allowNull: true
 *   }
 * }, {
 *   sequelize,
 *   tableName: 'products',
 *   timestamps: true
 * });
 *
 * // Define Relations
 * Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
 * Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
 */
