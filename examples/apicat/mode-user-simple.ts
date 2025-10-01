/**
 * @model User Complete user entity with authentication and access control
 * @modelname UserModel
 * @modelgroup User Model
 * @modeldescription Complete User entity model with all attributes, relationships, and lifecycle hooks
 * automatically extracted from the Sequelize class definition.
 *
 * This model represents users in the system with:
 * - Authentication (email/password)
 * - Community and Company relationships
 * - Access control and sessions
 * - Lifecycle hooks for data formatting and external system sync
 * 
 * @apiVersion 5.0.0
 */

import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, sql } from '@sequelize/core';
import {
    AfterCreate,
    AfterDestroy,
    AfterUpdate,
    AllowNull,
    Attribute,
    AutoIncrement,
    BeforeCreate,
    BeforeDestroy,
    BeforeUpdate,
    BelongsTo,
    BelongsToMany,
    CreatedAt,
    Default,
    DeletedAt,
    HasMany,
    Index,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt,
    ValidateAttribute,
} from '@sequelize/core/decorators-legacy';

// Import related models (for relationships)
import Community from './Community';
import Company from './Company';
import Access from './Access';
import Session from './Session';

@Table({
    tableName: 'users',
    schema: 'public',
    timestamps: true,
    paranoid: true,
})
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

    @Attribute(DataTypes.STRING)
    declare firstname?: string;

    @Attribute(DataTypes.STRING)
    declare lastname?: string;

    @Index
    @Unique
    @Attribute(DataTypes.STRING)
    @ValidateAttribute({
        async isUnique(value: string) {
            // Validation logic
        },
    })
    declare email: string;

    @Attribute(DataTypes.STRING)
    declare password: string;

    @Default('active')
    @Attribute(DataTypes.STRING)
    declare status: string;

    @Default('resident')
    @Attribute(DataTypes.STRING)
    declare role?: string;

    @CreatedAt
    declare createdAt: CreationOptional<Date>;

    @UpdatedAt
    declare updatedAt: CreationOptional<Date>;

    @DeletedAt
    declare deletedAt: Date | null;

    @Attribute(DataTypes.INTEGER)
    declare id_community?: number;

    @Attribute(DataTypes.INTEGER)
    declare id_company: number;

    // Relationships
    @BelongsTo(() => Community, {
        foreignKey: 'id_community',
    })
    community!: NonAttribute<Community>;

    @BelongsTo(() => Company, {
        foreignKey: 'id_company',
    })
    company!: NonAttribute<Company>;

    @HasMany(() => Access, {
        foreignKey: 'id_user',
    })
    accesses!: NonAttribute<Access[]>;

    @HasMany(() => Session, {
        foreignKey: 'id_user',
    })
    sessions!: NonAttribute<Session[]>;

    // Lifecycle Hooks
    @BeforeCreate
    static async DataFormating(instance: User) {
        // Normalize and validate data
    }

    @AfterCreate
    static async AddUserToCommunity(instance: User) {
        // Create relationships
    }

    @BeforeUpdate
    static async NormalizeStrings(instance: User) {
        // Normalize strings
    }

    @AfterUpdate
    static async UpdateUser(instance: User) {
        // Sync with external systems
    }

    @BeforeDestroy
    static async invalidate_accesses(instance: User): Promise<void> {
        // Invalidate accesses
    }

    @AfterDestroy
    static async remove_user_from_thinmoo(instance: User): Promise<void> {
        // Remove from external systems
    }
}

export type IUser = InferAttributes<User>;
