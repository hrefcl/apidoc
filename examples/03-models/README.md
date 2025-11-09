# Example 03: Sequelize Models + @apiSchema

Este ejemplo demuestra cómo documentar APIs que utilizan modelos de base de datos Sequelize con la anotación `@apiSchema` de APIDoc v5.

## 🎯 Objetivo

Mostrar la integración entre:
- **Sequelize ORM**: Definición de modelos de base de datos
- **@apiSchema**: Anotación para referenciar esquemas TypeScript/Sequelize
- **Validaciones**: Documentación de reglas de validación de modelos
- **Relaciones**: Documentación de relaciones entre modelos (hasMany, belongsTo)

## 📁 Estructura

```
03-models/
├── README.md
├── apidoc.json
└── src/
    ├── models.ts          # Modelos Sequelize con @apiSchema
    └── products-api.js    # Endpoints REST que usan los modelos
```

## 🗂️ Entidad Utilizada

**Product** - Sistema de gestión de productos con categorías

Evita duplicados con otros ejemplos:
- ❌ Company (usado en 01-basic-api)
- ❌ Inventory (usado en 02-openapi)
- ✅ Product (usado aquí con enfoque en modelos DB)

## 🔧 Características Demostradas

### 1. Modelos Sequelize
```typescript
@apiDefine ProductModel Product Database Model
@apiSchema (body) {jsonschema=./models.ts#ProductSchema} Product
```

### 2. Validaciones en Modelos
- Campo requerido: `allowNull: false`
- Validaciones de formato: email, URL, enum
- Validaciones custom: min/max length, ranges

### 3. Relaciones
- **Category hasMany Products**
- **Product belongsTo Category**

### 4. Timestamps Automáticos
- `createdAt`: Timestamp de creación
- `updatedAt`: Timestamp de última actualización

## 📚 Uso

### Generar Documentación
```bash
# Desde la raíz del proyecto
npm run example:03

# O directamente
./bin/apidoc generate -i examples/03-models/src/ -o examples/03-models/output
npx serve examples/03-models/output -p 8080
```

### Ver Documentación
Abrir en navegador: `http://localhost:8080`

## 🎓 Conceptos Aprendidos

1. **@apiSchema con Sequelize**: Cómo referenciar modelos de base de datos
2. **Validaciones**: Documentar reglas de validación del ORM
3. **Relaciones**: Documentar asociaciones entre modelos
4. **Tipos de Datos**: Mapeo de tipos Sequelize a tipos de API
5. **Campos Automáticos**: Timestamps y campos generados por DB

## 🔗 Referencias

- [Sequelize ORM](https://sequelize.org/)
- [APIDoc @apiSchema](../../md/en/11-typescript-schemas.md)
- [TypeScript Schemas](../../md/en/11-typescript-schemas.md)

## ⚙️ Configuración

El archivo `apidoc.json` incluye:
```json
{
  "name": "Models & Schemas Example",
  "version": "1.0.0",
  "title": "Products API - Sequelize Models Example",
  "template": {
    "forceLanguage": "en"
  }
}
```

## 📝 Notas Técnicas

- Los modelos Sequelize se definen en TypeScript para mejor tipado
- Las validaciones de Sequelize se documentan en los comentarios @apiParam
- Las relaciones se documentan en comentarios dedicados
- Los campos generados automáticamente (id, timestamps) se marcan claramente
