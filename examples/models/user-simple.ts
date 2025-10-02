/**
 * @model User Complete user entity with authentication and access control
 * @modelname UserModel
 * @modelgroup User Management
 * @modeldescription Complete User entity model with all attributes, relationships, and lifecycle hooks
 * automatically extracted from the Sequelize class definition.
 *
 * This model represents users in the system with:
 * - Authentication (email/password)
 * - Community and Company relationships
 * - Access control and sessions
 * - Lifecycle hooks for data formatting and external system sync
 *
 * @apiVersion 5.0.1
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
import Access from './Access';
import Community from './Community';
import Company from './Company';
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

    /**
     * @description Antes de crear el usuario: se normalizan y validan datos críticos
     * (ej. email en minúsculas, strings limpios, valores por defecto) para asegurar
     * consistencia y prevenir errores aguas arriba.
     */
    @BeforeCreate
    static async DataFormating(instance: User) {
        // Normalize and validate data
    }

    /**
     * @description Después de crear el usuario: se establecen relaciones iniciales
     * como asignación a comunidad, creación de registros asociados y envío de correo
     * de bienvenida u otras notificaciones.
     */
    @AfterCreate
    static async AddUserToCommunity(instance: User) {
        // Create relationships
    }

    /**
     * @description Antes de actualizar el usuario: se aplican reglas de normalización
     * (capitalización de nombres, limpieza de strings, actualización de timestamps
     * derivados) garantizando uniformidad de datos.
     */
    @BeforeUpdate
    static async NormalizeStrings(instance: User) {
        // Normalize strings
    }

    /**
     * @description Después de actualizar el usuario: se sincronizan los cambios con
     * sistemas externos (ej. directorios, CRM, accesos remotos) y se disparan
     * eventos de integración.
     */
    @AfterUpdate
    static async UpdateUser(instance: User) {
        // Sync with external systems
    }

    /**
     * @description Antes de eliminar lógicamente o físicamente al usuario: se
     * invalidan accesos activos (tokens, sesiones, llaves digitales) para evitar
     * que el usuario pueda seguir interactuando con el sistema.
     */
    @BeforeDestroy
    static async invalidate_accesses(instance: User): Promise<void> {
        // Invalidate accesses
    }

    /**
     * @description Después de eliminar el usuario: se eliminan referencias en
     * sistemas externos (ej. ThinMoo, integraciones de terceros) y se liberan
     * recursos relacionados.
     */
    @AfterDestroy
    static async remove_user_from_thinmoo(instance: User): Promise<void> {
        // Remove from external systems
    }
}

export type IUser = InferAttributes<User>;
