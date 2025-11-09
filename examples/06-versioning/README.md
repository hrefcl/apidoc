# Example 06: API Versioning

Este ejemplo demuestra el sistema de versionado de APIs en APIDoc v5, mostrando cómo gestionar múltiples versiones de endpoints.

## Objetivo

Demostrar:
- Versionado semántico (v1.0.0, v2.0.0, v3.0.0, v4.0.0)
- Agrupación automática de versiones del mismo endpoint
- Herencia de documentación entre versiones
- Selector de versiones en la interfaz
- Dos enfoques: paths diferentes vs mismo path con versiones

## Problema Que Este Ejemplo Resuelve

**BUG ORIGINAL**: En el sistema anterior, las referencias duplicadas a archivos OpenAPI causaban que:
- Todos los endpoints mostraran la misma versión (ej: "v4.0.0" para todos)
- Los menús de navegación mostraran entradas duplicadas
- El selector de versiones no funcionara correctamente

**SOLUCIÓN**: Este ejemplo muestra la forma correcta de versionar APIs sin duplicados.

## Enfoques de Versionado

### Enfoque 1: Diferentes Paths por Versión (OpenAPI)

Usa diferentes URLs para cada versión (recomendado para cambios breaking):

```
/api/products/{id}     → v1.0.0
/api/products-v2/{id}  → v2.0.0
/api/products-v3/{id}  → v3.0.0
```

### Enfoque 2: Mismo Path, Diferentes Versiones (Nativo APIDoc)

Usa el mismo path pero documenta múltiples versiones:

```javascript
/**
 * @api {get} /api/products/:id Get Product
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /api/products/:id Get Product
 * @apiVersion 2.0.0
 * @apiParam {Boolean} [include_reviews] Include product reviews
 */
```

## Endpoints Incluidos

### Desde OpenAPI (`schemas/products-multi-version.yaml`)
- **GET /api/products/:id** - v1.0.0 (campos básicos)
- **GET /api/products-v2/:id** - v2.0.0 (+ category)
- **GET /api/products-v3/:id** - v3.0.0 (+ inventory tracking)
- **PUT /api/products/:id** - v1.0.0, v2.0.0, v3.0.0

### Desde archivo nativo (`src/products-v4.js`)
- **GET /api/products/:id** - v4.0.0 (+ reviews, ratings)
- **PUT /api/products/:id** - v4.0.0

## Estructura

```
06-versioning/
├── README.md                           # Este archivo
├── apidoc.json                        # Configuración del ejemplo
├── src/
│   └── products-v4.js                 # Versión 4.0.0 (nativa)
├── schemas/
│   └── products-multi-version.yaml    # Versiones 1-3 (OpenAPI)
└── output/                            # Documentación generada (gitignored)
```

## Generar Documentación

### Todas las Versiones

```bash
cd examples/06-versioning/
apidoc generate -c apidoc.json -o output/
npx serve output/
```

### Filtrar por Versión Específica

```bash
# Solo v2.0.0
apidoc generate -c apidoc.json -o output-v2/ --filter-version 2.0.0

# Solo v4.0.0
apidoc generate -c apidoc.json -o output-v4/ --filter-version 4.0.0
```

## Características Demostradas

- ✅ Versionado semántico (SemVer)
- ✅ Agrupación automática de versiones
- ✅ Selector de versiones en interfaz
- ✅ Herencia de documentación
- ✅ Campos x-version en OpenAPI
- ✅ @apiVersion en anotaciones nativas
- ✅ Filtrado por versión en CLI
- ✅ Múltiples enfoques de versionado

## Cómo Funciona el Agrupamiento

APIDoc v5 agrupa automáticamente endpoints con:
- Mismo método HTTP (GET, POST, etc.)
- Misma ruta
- Diferentes versiones

Resultado:
```json
{
  "id": "products-get-getproduct",
  "method": "get",
  "url": "/api/products/:id",
  "versions": [
    { "version": "1.0.0", "name": "Get Product", ... },
    { "version": "2.0.0", "name": "Get Product", ... },
    { "version": "3.0.0", "name": "Get Product", ... },
    { "version": "4.0.0", "name": "Get Product (Enhanced)", ... }
  ]
}
```

## Mejores Prácticas

1. **Usa SemVer**: Sigue versionado semántico (MAJOR.MINOR.PATCH)
2. **Documenta Cambios**: Explica qué cambió entre versiones
3. **Evita Duplicados**: NO cargues el mismo archivo OpenAPI múltiples veces
4. **Usa x-version**: En OpenAPI, especifica versión con campo `x-version`
5. **Paths Consistentes**: Para herencia, usa el mismo path entre versiones

## Anti-Patrones (NO HACER)

❌ **INCORRECTO**: Cargar el mismo archivo OpenAPI múltiples veces
```javascript
// ❌ Archivo 1
/** @openapi {openapi=./products-api.yaml} */

// ❌ Archivo 2
/** @openapi /api/products/:id {openapi=./products-api.yaml} */
```

❌ **INCORRECTO**: Definir mismo endpoint en múltiples archivos sin versiones distintas

✅ **CORRECTO**: Un solo archivo OpenAPI con todas las versiones usando paths diferentes o x-version

## Ver También

- **Documentación Versionado**: `/md/es/07-versioning.md`
- **CLI Filter Version**: `/md/es/18-cli-v5.md`
- **OpenAPI Integration**: `/examples/02-openapi/`
