# APIDoc v5 Examples

Colección completa de 11 ejemplos que demuestran todas las características de APIDoc v5.

## ✅ Ejemplos Disponibles (11/11 COMPLETOS)

### 01. Basic API
**Carpeta**: `01-basic-api/`
**Descripción**: Endpoints REST básicos con CRUD completo
**Entidad**: Company API (Create, Read, Update, Delete)
**Script**: `npm run example:01`

### 02. OpenAPI Integration
**Carpeta**: `02-openapi/`
**Descripción**: Integración con archivos OpenAPI 3.0 externos (YAML)
**Entidad**: Inventory API con esquemas externos
**Script**: `npm run example:02`

### 03. Sequelize Models + @apiSchema
**Carpeta**: `03-models/`
**Descripción**: Modelos de base de datos Sequelize con @apiSchema
**Entidad**: Products con Categories (relaciones DB)
**Script**: `npm run example:03`

### 04. MQTT Protocol
**Carpeta**: `04-mqtt/`
**Descripción**: Documentación MQTT publish/subscribe para IoT
**Entidad**: Smart Home (sensors + actuators)
**Script**: `npm run example:04`

### 05. Internationalization (i18n)
**Carpeta**: `05-i18n/`
**Descripción**: Documentación multi-idioma con selector de lenguaje
**Idiomas**: English, Español, 中文
**Script**: `npm run example:05`

### 06. API Versioning
**Carpeta**: `06-versioning/`
**Descripción**: Gestión de múltiples versiones de API (v1-v4)
**Entidad**: Products API con evolución de features
**Script**: `npm run example:06`

### 07. Dual Authentication
**Carpeta**: `07-authentication/`
**Descripción**: Sistema de autenticación dual (Form + API Key)
**Endpoints**: Login, Register, Generate API Key, Protected routes
**Script**: `npm run example:07`

### 08. TypeScript @apiSchema
**Carpeta**: `08-apiSchema/`
**Descripción**: Interfaces TypeScript con @apiSchema
**Entidad**: Tasks API con interfaces tipadas
**Script**: `npm run example:08`

### 09. Embedded Code Examples
**Carpeta**: `09-code/`
**Descripción**: Ejemplos de código en múltiples lenguajes
**Lenguajes**: JavaScript, Python, PHP, cURL
**Script**: `npm run example:09`

### 10. Markdown-Only Documentation
**Carpeta**: `10-markdown/`
**Descripción**: Documentación pura en Markdown con exportación
**Entidad**: Notes API
**Script**: `npm run example:10`

### 11. Multi-Language Support
**Carpeta**: `11-multi-language/`
**Descripción**: Parseo de comentarios en 11+ lenguajes
**Lenguajes**: Python, Ruby, Java, Clojure, CoffeeScript, Erlang, Elixir, Lua, Perl, TypeScript, JavaScript
**Script**: `npm run example:11`

## 📊 Tabla de Características

| Ejemplo | REST | OpenAPI | MQTT | Auth | Versioning | i18n | Models | Multi-Lang | Code Examples |
|---------|------|---------|------|------|------------|------|--------|------------|---------------|
| 01-basic-api | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 02-openapi | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 03-models | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| 04-mqtt | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 05-i18n | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| 06-versioning | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| 07-authentication | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 08-apiSchema | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 09-code | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 10-markdown | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 11-multi-language | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

## 🚀 Uso Rápido

### Generar Ejemplo Específico

```bash
# Desde la raíz del proyecto
npm run example:01  # Basic API
npm run example:04  # MQTT
npm run example:06  # Versioning
# ... etc
```

### Generar Todos los Ejemplos

```bash
npm run example:all
```

### Generar Manualmente

```bash
# Ejemplo específico
./bin/apidoc generate -i examples/01-basic-api/src/ -o examples/01-basic-api/output

# Ver documentación
npx serve examples/01-basic-api/output -p 8080
```

## 📁 Estructura de Cada Ejemplo

```
XX-nombre-ejemplo/
├── README.md           # Explicación detallada del ejemplo
├── apidoc.json        # Configuración específica
├── src/               # Código fuente con anotaciones APIDoc
│   ├── archivo1.js
│   ├── archivo2.py
│   └── ...
└── output/            # Documentación generada (gitignored)
```

## 🔥 Características Únicas de Cada Ejemplo

- **01-basic-api**: Fundamentos de REST con @api, @apiParam, @apiSuccess
- **02-openapi**: Integración @openapi con archivos externos YAML/JSON
- **03-models**: @apiSchema con modelos Sequelize y relaciones DB
- **04-mqtt**: Anotaciones especializadas MQTT (publish/subscribe)
- **05-i18n**: Selector de idioma dinámico con traducciones
- **06-versioning**: Versionado semántico sin duplicados (v1-v4)
- **07-authentication**: Dual auth (Bearer + API Key) con endpoints protegidos
- **08-apiSchema**: TypeScript interfaces y type safety
- **09-code**: SDK examples en JavaScript, Python, PHP
- **10-markdown**: Pure markdown docs con export capability
- **11-multi-language**: Support para 11+ lenguajes de programación

## 📚 Recursos Adicionales

- **CLI v5**: `md/en/18-cli-v5.md`
- **Configuración**: `md/en/01-configuration.md`
- **OpenAPI**: `md/en/09-openapi.md`
- **MQTT**: `md/en/10-mqtt.md`
- **Authentication**: `md/en/12-authentication.md`
- **Versioning**: `md/en/07-versioning.md`

## 🎯 Notas Importantes

- ✅ Cada ejemplo es **independiente** y puede ejecutarse por separado
- ✅ **Sin duplicados** de endpoints entre ejemplos
- ✅ Numerados en orden de **complejidad creciente**
- ✅ Scripts npm pre-configurados para cada ejemplo
- ✅ Documentación completa en cada subdirectorio
