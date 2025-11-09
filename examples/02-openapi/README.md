# Example 02: OpenAPI Integration

Este ejemplo demuestra cómo integrar archivos OpenAPI 3.0 externos (YAML/JSON) con APIDoc v5.

## Objetivo

Mostrar la capacidad de APIDoc para:
- Referenciar especificaciones OpenAPI 3.0 completas desde archivos externos
- Extraer paths específicos de archivos OpenAPI
- Combinar documentación nativa de APIDoc con especificaciones OpenAPI
- Soportar tanto formato YAML como JSON

## Endpoints Incluidos

Este ejemplo documenta una API de gestión de inventario (Inventory API):

**Desde OpenAPI externo** (`schemas/inventory-api.yaml`):
- **GET /api/inventory** - Listar todos los items
- **POST /api/inventory** - Crear nuevo item
- **GET /api/inventory/:id** - Obtener item por ID
- **PUT /api/inventory/:id** - Actualizar item
- **DELETE /api/inventory/:id** - Eliminar item

## Estructura

```
02-openapi/
├── README.md                  # Este archivo
├── apidoc.json               # Configuración del ejemplo
├── src/
│   └── inventory-loader.js   # Archivo que carga OpenAPI externo
├── schemas/
│   └── inventory-api.yaml    # Especificación OpenAPI 3.0
└── output/                   # Documentación generada (gitignored)
```

## Formato de Referencia

### Cargar Especificación Completa

```javascript
/**
 * Load complete OpenAPI specification
 * @openapi {openapi=./schemas/inventory-api.yaml}
 */
```

### Cargar Path Específico

```javascript
/**
 * Load specific path from OpenAPI file
 * @openapi /api/inventory/{id} {openapi=./schemas/inventory-api.yaml}
 */
```

## Generar Documentación

Desde esta carpeta:

```bash
# Usando CLI v5
apidoc generate -c apidoc.json -o output/

# Ver documentación
npx serve output/
```

Desde la raíz del proyecto:

```bash
# Generar este ejemplo específico
./bin/apidoc generate -c examples/02-openapi/apidoc.json -o examples/02-openapi/output/
```

## Características Demostradas

- ✅ Referencia a archivos OpenAPI 3.0 externos
- ✅ Formato YAML y JSON soportados
- ✅ Carga de especificación completa
- ✅ Carga de paths específicos
- ✅ Esquemas con `$ref` y `components`
- ✅ Parámetros de path, query y body
- ✅ Respuestas con múltiples códigos de estado
- ✅ Ejemplos de request/response

## Ventajas del Enfoque OpenAPI

1. **Reutilización**: El mismo archivo OpenAPI puede usarse para generación de código, testing, etc.
2. **Estandarización**: OpenAPI es un estándar de la industria
3. **Separación de Concerns**: Spec separada del código
4. **Mantenibilidad**: Un solo lugar para actualizar la API spec

## Notas

- Las referencias OpenAPI externas se procesan en tiempo de generación
- Los esquemas con `$ref` se resuelven automáticamente
- Se mantiene toda la semántica de OpenAPI 3.0
- Compatible con validadores y herramientas OpenAPI estándar

## Ver También

- **Documentación OpenAPI**: `/md/es/09-openapi.md`
- **Ejemplo de Versionado**: `/examples/06-versioning/`
- **Ejemplo Completo**: `/examples/10-complete-app/`
