# Category Parser Testing Suite

Este directorio contiene ejemplos y pruebas para el **Sistema de Parsers por Categoría** de APIDoc v5.0.

## 📁 Estructura

```
category-test/
├── apidoc.json           # Configuración con categorías
├── api-only/             # Solo REST API parsers
│   └── users.js          # Endpoints con @api tags
├── models-only/          # Solo model/schema parsers
│   └── product.ts        # Modelo con @model tags
├── tsdoc-only/           # Solo TypeScript doc parsers
│   └── types.ts          # Interfaces con @apiSchema
├── mqtt-only/            # Solo MQTT parsers
│   └── mqtt-examples.ts  # MQTT con @mqtt, @topic, etc.
└── docs-only/            # Solo markdown
    └── intro.md          # Archivo markdown puro
```

## 🎯 Objetivo

Verificar que el sistema de categorías **filtra correctamente** los parsers, ejecutando solo los relevantes para cada tipo de contenido.

## ✅ Pruebas Esperadas

### 1. Categoría `api` (REST API)

**Archivo**: `api-only/users.js`

**Debe parsear**:
- ✅ `@api` - Define endpoint
- ✅ `@apiParam`, `@apiQuery`, `@apiBody`
- ✅ `@apiSuccess`, `@apiError`
- ✅ `@apiGroup`, `@apiName`, `@apiDescription`

**Debe saltar**:
- ❌ `@apiDefine` (incluido en el archivo pero debe ser filtrado)

### 2. Categoría `models` (Data Models)

**Archivo**: `models-only/product.ts`

**Debe parsear**:
- ✅ `@model` - Define modelo
- ✅ `@modelGroup`, `@modelName`, `@modelDescription`
- ✅ `@apiSchema` - Schemas TypeScript

**Debe saltar**:
- ❌ Cualquier tag `@api` no relacionado con modelos

### 3. Categoría `tsdoc` (TypeScript Docs)

**Archivo**: `tsdoc-only/types.ts`

**Debe parsear**:
- ✅ `@apiSchema` - TypeScript interfaces
- ✅ `@apiDefine` - Definiciones reutilizables

**Debe saltar**:
- ❌ `@api` tags (incluido pero debe ser filtrado)

### 4. Categoría `mqtt` (MQTT/IoT)

**Archivo**: `mqtt-only/mqtt-examples.ts`

**Debe parsear**:
- ✅ `@mqtt`, `@topic`, `@topicParam`
- ✅ `@qos`, `@retain`, `@auth`
- ✅ `@payload`, `@payloadSchema`

### 5. Categoría `docs` (Markdown)

**Archivo**: `docs-only/intro.md`

**Debe parsear**:
- ✅ Solo contenido markdown (sin tags APIDoc)

## 🚀 Ejecutar Pruebas

### 1. Generar Documentación

```bash
# Desde el directorio raíz del proyecto
./bin/apidoc --config examples/category-test/apidoc.json \
             -o tmp/category-test-output
```

### 2. Ver Parsers en Debug

```bash
./bin/apidoc --debug \
             --config examples/category-test/apidoc.json \
             -o tmp/test \
             2>&1 | grep -E "(Skipping|found @|Parsing with category)"
```

**Output esperado**:
```
verbose: Parsing with category filter: api
debug: Skipping parser 'apidefine' for category 'api' in block: '0'
debug: found @api in block: 1
debug: found @apiParam in block: 1

verbose: Parsing with category filter: models
debug: found @model in block: 0
debug: found @modelGroup in block: 0

verbose: Parsing with category filter: mqtt
debug: found @mqtt in block: 1
debug: found @topic in block: 1
```

### 3. Verificar Output

```bash
# Abrir en navegador
open tmp/category-test-output/index.html

# Ver estructura generada
ls -R tmp/category-test-output/

# Ver logs verbose
./bin/apidoc -v --config examples/category-test/apidoc.json \
             -o tmp/test
```

## ✅ Checklist de Verificación

Después de generar la documentación, verifica:

- [ ] **4 Endpoints REST API** de `users.js`:
  - [ ] GET /api/users
  - [ ] POST /api/users
  - [ ] PUT /api/users/:id
  - [ ] DELETE /api/users/:id

- [ ] **1 Modelo** de `product.ts`:
  - [ ] Product Model con decorators Sequelize

- [ ] **Interfaces TypeScript** de `types.ts`:
  - [ ] ApiResponse, PaginatedResponse, ErrorResponse
  - [ ] Enums: UserRole, OrderStatus

- [ ] **6 Endpoints MQTT** de `mqtt-examples.ts`:
  - [ ] PublishTelemetry
  - [ ] SubscribeCommands
  - [ ] PublishCommandAck
  - [ ] PublishDeviceStatus
  - [ ] SubscribeAlerts
  - [ ] SubscribeConfig

- [ ] **Filtrado Correcto**:
  - [ ] `@apiDefine UserNotFound` NO aparece (filtrado por `api`)
  - [ ] Debug logs muestran "Skipping parser..." para parsers filtrados

## 📊 Estadísticas Esperadas

```
verbose: 🐱 apiCAT: Processing 12 API endpoints...
```

**Desglose**:
- 4 endpoints REST (api category)
- 1 modelo (models category)
- 3 interfaces + 2 enums (tsdoc category)
- 6 endpoints MQTT (mqtt category)
- **Total: ~12 items documentados**

## 🐛 Troubleshooting

### Problema: "Parser not found"

**Síntoma**:
```
warn: parser plugin 'X' not found in block: 'Y'
```

**Solución**: El parser no existe en el sistema. Verifica:
```bash
grep "X:" core/index.ts
```

### Problema: "Todos los parsers se ejecutan"

**Síntoma**: No hay mensajes "Skipping parser"

**Solución**:
1. Compilar proyecto: `npm run build`
2. Verificar que uses categorías **predefinidas** (`api`, `models`, etc.)
3. Categorías custom ejecutan TODOS los parsers

### Problema: "Unnamed endpoints"

**Síntoma**: Documentación muestra "Unnamed" en lugar de nombres correctos

**Causas posibles**:
1. Parser no habilitado para la categoría
2. Tag incorrecto o mal formateado
3. Nombre de parser incorrecto (deben ser minúsculas)

**Verificar**:
```bash
# Ver qué categoría tiene cada archivo
./bin/apidoc --debug [...] 2>&1 | grep "category filter"

# Ver qué parsers encuentra
./bin/apidoc --debug [...] 2>&1 | grep "found @"
```

## 📖 Documentación Relacionada

- [Sistema de Parsers por Categoría](../../md/es/CATEGORY-PARSERS.md) - Documentación completa
- [Configuración APIDoc](../../md/es/01-configuration.md) - Sistema de `inputs`
- [Core Implementation](../../core/apidoc/category-parsers.ts) - Código fuente

## 🔧 Modificar Categorías

Para agregar o modificar parsers de una categoría, edita:

```typescript
// core/apidoc/category-parsers.ts
export const CATEGORY_PARSERS = {
    api: {
        enabledParsers: [
            'api',
            'apiparam',
            // ... agregar más parsers aquí
        ]
    }
}
```

Luego recompila: `npm run build`

---

**Versión**: 5.0.0
**Última actualización**: 2025-10-03
