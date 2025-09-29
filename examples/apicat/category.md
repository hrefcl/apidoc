## 🏷️ Sistema de Categorías

### Organización Jerárquica

Las categorías permiten organizar contenido de manera estructurada y jerárquica.

#### Funcionalidades:

- **Categorías padre e hijas**: Estructura árbol ilimitada
- **Etiquetas múltiples**: Un elemento puede tener varias categorías
- **Búsqueda por categoría**: Filtrado eficiente por taxonomía

### Ejemplos de Uso

```javascript
// Crear categoría principal
const mainCategory = {
  name: "Tecnología",
  slug: "tecnologia",
  parent_id: null,
  description: "Artículos sobre tecnología"
};

// Crear subcategoría
const subCategory = {
  name: "Inteligencia Artificial",
  slug: "inteligencia-artificial",
  parent_id: mainCategory.id,
  description: "Artículos específicos sobre IA"
};
```

### Reglas de Negocio

⚠️ **Importante**:
- Los slugs deben ser únicos a nivel global
- No se puede eliminar una categoría que tiene hijos
- La profundidad máxima es de 5 niveles