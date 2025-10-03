---
title: "Configuración de apidoc.json"
category: "Configuración"
order: 1
---

# 📋 Configuración de apidoc.json - APIDoc 5.0

La configuración de APIDoc se realiza a través del archivo `apidoc.json` (o dentro de `package.json` bajo la sección `"apidoc"`).

## 🎯 Configuración Básica

### Estructura mínima

```json
{
  "name": "Mi API",
  "version": "1.0.0",
  "description": "Documentación de mi API",
  "title": "Mi API Documentation",
  "url": "https://api.example.com"
}
```

### Configuración completa (Todas las opciones REALES)

```json
{
  "name": "LexCorp Api documentation",
  "version": "5.0.0",
  "description": "Documentation for the REST api access provided at LexCorp",
  "title": "Href ApiDoc 5",
  "url": "https://api.example.com",
  "sampleUrl": "https://api.example.com",

  "inputs": {
    "docs": ["./md"],
    "api": ["."],
    "models": ["../models"]
  },

  "apicat": {
    "enabled": true,
    "outputDir": "./apicat-output"
  },

  "login": {
    "active": true,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "admited": [
      {
        "email": "admin@lexcorp.com",
        "password": "admin123",
        "name": "Administrador LexCorp",
        "role": "admin"
      }
    ]
  },

  "header": {
    "title": "Introducción",
    "filename": "header.md",
    "icon": "fa-home"
  },

  "footer": {
    "title": "Mejores Prácticas",
    "filename": "footer.md",
    "icon": "fa-lightbulb"
  },

  "logo": {
    "icon": "fa-solid fa-rocket",
    "alt": "API Logo"
  },

  "order": ["Users", "Company", "System", "City", "Category"],

  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Usuarios",
      "filename": "user.md"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Empresa",
      "filename": "company.md"
    }
  },

  "template": {
    "showRequiredLabels": false,
    "withCompare": true,
    "withGenerator": true,
    "aloneDisplay": false,
    "forceLanguage": "es"
  },

  "documentation": "./example/*.md",

  "mqtt": {
    "enabled": true,
    "broker": {
      "host": "test.mosquitto.org",
      "port": 8081,
      "protocol": "wss"
    },
    "authentication": {
      "username": "demo-user",
      "password": "demo-pass-123",
      "clientId": "apidoc-mqtt-client-demo"
    },
    "options": {
      "keepalive": 60,
      "connectTimeout": 30000,
      "reconnectPeriod": 1000,
      "clean": true
    }
  }
}
```

---

## ⚙️ Parámetros de Configuración

### 1. Información del Proyecto

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `name` | String | Nombre del proyecto | `"Mi API"` |
| `version` | String | Versión del proyecto | `"5.0.0"` |
| `description` | String | Descripción del proyecto | `"API para gestión de usuarios"` |
| `title` | String | Título mostrado en el navegador | `"Mi API Documentation"` |
| `url` | String | URL base de la API | `"https://api.example.com"` |
| `sampleUrl` | String/Boolean | URL para formularios de prueba | `"https://api.example.com"` |
| `homepage` | String | URL de la homepage del proyecto | `"https://example.com"` |

---

### 2. Sistema de Fuentes de Datos (`inputs`)

**✨ NUEVO EN v5.0**: Sistema flexible para especificar múltiples fuentes de datos con categorías personalizables.

#### 2.1 Formato Nuevo (Recomendado): `inputs` object

```json
{
  "inputs": {
    "docs": ["./md"],
    "tsdoc": ["../core"],
    "api": ["."],
    "models": ["../model/sq/"],
    "controllers": ["../controllers"],
    "services": ["../services"]
  }
}
```

**Beneficios**:
- 🎯 **Organización clara**: Categorías semánticas para diferentes tipos de código
- 📁 **Múltiples fuentes**: Combina archivos de distintos directorios
- 🔧 **Flexible**: Define tus propias categorías personalizadas
- 📊 **Trazabilidad**: Logs muestran de qué categoría viene cada archivo

**Categorías Comunes**:

| Categoría | Descripción | Ejemplo |
|-----------|-------------|---------|
| `docs` | Archivos markdown de documentación | `["./md", "./docs"]` |
| `tsdoc` | Código TypeScript con TSDoc | `["../core", "../lib"]` |
| `api` | Endpoints y rutas de API | `["."]` |
| `models` | Modelos de datos | `["../models", "../schemas"]` |
| `controllers` | Controladores de la aplicación | `["../controllers"]` |
| `services` | Servicios y lógica de negocio | `["../services"]` |

**Ejemplo completo** con múltiples fuentes:

```json
{
  "name": "Mi API Completa",
  "version": "2.0.0",
  "inputs": {
    "documentation": ["./md/api", "./md/guides"],
    "rest-api": ["./routes", "./controllers"],
    "graphql": ["./graphql/schema", "./graphql/resolvers"],
    "models": ["./models/user", "./models/company"],
    "typescript-interfaces": ["../shared/types"]
  }
}
```

**Log Output Example**:
```
📁 Using categorized "inputs" configuration from apidoc.json
  ✓ documentation: ./md/api, ./md/guides
  ✓ rest-api: ./routes, ./controllers
  ✓ graphql: ./graphql/schema, ./graphql/resolvers
  ✓ models: ./models/user, ./models/company
  ✓ typescript-interfaces: ../shared/types
```

#### 2.1.1 Filtrado de Parsers por Categoría

**✨ NUEVO EN v5.0**: Las categorías predefinidas ejecutan **solo los parsers relevantes** para ese tipo de contenido.

**Categorías Predefinidas con Filtrado**:

| Categoría | Parsers Habilitados | Archivos | Uso |
|-----------|---------------------|----------|-----|
| `api` | `@api`, `@apiParam`, `@apiSuccess`, `@apiError`, etc. | `.js`, `.ts`, `.php`, `.py` | REST API endpoints |
| `models` | `@model`, `@apiSchema`, `@apiDefine` | `.ts`, `.js`, `.json` | Data models & schemas |
| `tsdoc` | `@apiSchema`, `@apiDefine`, `@apiUse` | `.ts`, `.tsx`, `.d.ts` | TypeScript documentation |
| `mqtt` | `@mqtt`, `@topic`, `@qos`, `@payload` | `.js`, `.ts` | MQTT/IoT protocols |
| `docs` | (ninguno) | `.md`, `.markdown` | Markdown files |

**Ejemplo con Filtrado**:
```json
{
  "inputs": {
    "api": ["./routes"],      // Solo parsers REST API
    "models": ["./models"]    // Solo parsers de modelos/schemas
  }
}
```

**Beneficios del Filtrado**:
- ⚡ **Rendimiento**: Solo ejecuta parsers relevantes (no 50+ parsers en cada archivo)
- 🎯 **Precisión**: Evita parsing incorrecto de tags en contextos equivocados
- 📊 **Claridad**: Logs muestran qué parsers se están saltando

**Ver Filtrado en Debug**:
```bash
apidoc --debug --config apidoc.json -o output/ 2>&1 | grep "Skipping parser"
```

Output:
```
debug: Skipping parser 'apidefine' for category 'api' in block: '0'
debug: Skipping parser 'model' for category 'api' in block: '1'
```

📖 **Documentación Completa**: Ver [Sistema de Parsers por Categoría](./CATEGORY-PARSERS.md)

#### 2.2 Formato Legacy: `input` array

**Backwards compatibility** - El formato antiguo sigue funcionando:

```json
{
  "input": [".", "../models", "./docs"]
}
```

**Diferencias**:
- ❌ Sin categorización semántica
- ❌ Logs menos informativos
- ✅ Compatible con versiones anteriores

**Recomendación**: Migra a `inputs` object para mejor organización.

#### 2.3 Uso con CLI

Cuando usas `inputs` en `apidoc.json`, debes especificar la ruta del archivo de configuración con `--config`:

```bash
# ✅ Correcto - especifica el archivo de configuración
apidoc --config examples/apicat/apidoc.json -o docs/

# ❌ Incorrecto - no encuentra las rutas inputs correctamente
apidoc -i examples/apicat -o docs/
```

**¿Por qué?** Las rutas en `inputs` son **relativas al directorio donde está `apidoc.json`**, no al directorio desde donde ejecutas el comando.

**Ejemplo completo**:
```bash
# Estructura de proyecto
/my-project/
  ├── examples/
  │   └── apicat/
  │       └── apidoc.json    # inputs: { api: ["."], models: ["../../models"] }
  ├── models/
  └── docs/

# Ejecutar desde /my-project/
apidoc --config examples/apicat/apidoc.json -o docs/
```

Las rutas se resolverán correctamente:
- `"api": ["."]` → `/my-project/examples/apicat/`
- `"models": ["../../models"]` → `/my-project/models/`

**Alias disponibles**:
```bash
apidoc -c examples/apicat/apidoc.json -o docs/  # -c es alias de --config
apidoc --config path/to/config.json -o output/
```

---

### 3. Plugin apiCAT (Vue 3 Template System)

**⚠️ IMPORTANTE**: Si usas `template: 'apidoc-template-v5'`, apiCAT se **activa automáticamente**.

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `apicat.enabled` | Boolean | Activa/desactiva el plugin apiCAT | `false` |
| `apicat.outputDir` | String | Directorio de salida para archivos JSON modulares | `'./apicat-output'` |

**Ejemplo**:
```json
{
  "apicat": {
    "enabled": true,
    "outputDir": "./apicat-output"
  }
}
```

**¿Qué hace apiCAT?**
- Genera estructura JSON modular para el template Vue 3
- Crea `cat.api.index.json` con metadata de endpoints
- Genera shards en `cat.api/` para carga lazy
- Procesa markdown personalizado por grupo
- Encripta JSONs si `login.active: true`

---

### 3. Sistema de Autenticación y Encriptación (`login`)

Sistema completo de autenticación dual con encriptación AES-256-GCM.

#### 3.1 Autenticación Local (Sin servidor)

```json
{
  "login": {
    "active": true,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "admited": [
      {
        "email": "admin@company.com",
        "password": "admin123",
        "name": "Admin User",
        "role": "admin"
      },
      {
        "email": "dev@company.com",
        "passwordHash": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
        "name": "Developer",
        "role": "developer"
      }
    ]
  }
}
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `login.active` | Boolean | **Activa autenticación Y encriptación de JSONs** |
| `login.encryptionKey` | String | Clave AES-256-GCM en Base64/Hex (32 bytes) |
| `login.admited[]` | Array | Lista de usuarios autorizados (autenticación local) |
| `login.admited[].email` | String | Email del usuario |
| `login.admited[].password` | String | Password en texto plano |
| `login.admited[].passwordHash` | String | Password hasheado con SHA-256 (más seguro) |
| `login.admited[].name` | String | Nombre del usuario |
| `login.admited[].role` | String | Rol del usuario |

**Generar clave de encriptación**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Generar hash de password**:
```bash
echo -n "mypassword" | openssl dgst -sha256 | awk '{print $2}'
```

#### 3.2 Autenticación con Servidor

```json
{
  "login": {
    "active": true,
    "encryptionKeyFromServer": true,
    "urlAuth": "https://api.empresa.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401
  }
}
```

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `login.encryptionKeyFromServer` | Boolean | La clave viene del servidor, no embebida | `false` |
| `login.urlAuth` | String | URL del endpoint de autenticación | - |
| `login.value_form` | Object | Mapeo de campos del formulario de login | - |
| `login.value_form.email` | String | Nombre del campo email | `"email"` |
| `login.value_form.password` | String | Nombre del campo password | `"password"` |
| `login.response_success` | Number | Código HTTP para autenticación exitosa | `200` |
| `login.response_error` | Number | Código HTTP para error de autenticación | `401` |

**Respuesta esperada del servidor**:
```json
{
  "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
  "user": {
    "email": "usuario@empresa.com",
    "name": "Usuario Ejemplo"
  }
}
```

#### 3.3 Sistema de Encriptación Automático

**Cuando `login.active: true`**:

✅ **Encriptación AES-256-GCM** de todos los archivos JSON
✅ **Ofuscación de claves** (división en 4 segmentos + decoys)
✅ **Encriptación de lista `admited`** antes de embeber en HTML
✅ **Auto-generación de claves** (genera `.apicat-key` si no hay `encryptionKey`)
✅ **JWT con 24h de expiración** almacenado en sessionStorage

**Formato de archivo encriptado**:
```json
{
  "data": "I7VpNOIMCzP+svYebMtozhAU...",
  "iv": "vAhusuHblGAsySg1PVAdTg==",
  "tag": "qVRg2imfBd3msMMJd1bjiQ==",
  "algorithm": "aes-256-gcm",
  "encrypted_at": "2025-09-29T18:13:20.862Z",
  "version": "1.0"
}
```

**Ver también**: [🔐 Sistema de Autenticación](./12-authentication.md)

---

### 4. Header y Footer

Secciones personalizadas que aparecen en la navegación.

```json
{
  "header": {
    "title": "Introducción",
    "filename": "header.md",
    "content": "# Bienvenido\nContenido inline...",
    "icon": "fa-home"
  },
  "footer": {
    "title": "Contacto",
    "filename": "footer.md",
    "icon": "fa-envelope"
  }
}
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `header.title` | String | Título de navegación del header |
| `header.filename` | String | Archivo markdown del header (relativo a apidoc.json) |
| `header.content` | String | Contenido markdown inline (alternativa a filename) |
| `header.icon` | String | Icono Font Awesome (ej: `"fa-home"`) |
| `footer.title` | String | Título de navegación del footer |
| `footer.filename` | String | Archivo markdown del footer |
| `footer.content` | String | Contenido markdown inline |
| `footer.icon` | String | Icono Font Awesome (ej: `"fa-lightbulb"`) |

---

### 5. Logo

```json
{
  "logo": {
    "icon": "fa-solid fa-rocket",
    "alt": "API Logo"
  }
}
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `logo.icon` | String | Icono Font Awesome 6.0+ (ej: `"fa-solid fa-rocket"`) |
| `logo.alt` | String | Texto alternativo del logo |

---

### 6. Orden de Grupos (`order`)

Define el orden en que aparecen los grupos en la navegación.

```json
{
  "order": ["Users", "Company", "System", "City", "Category"]
}
```

**Funcionamiento**:
- Los grupos listados aparecen en el orden especificado
- Grupos no listados aparecen al final en orden alfabético

---

### 7. Configuración por Grupo (`settings`)

Personaliza cada grupo con icono, título y contenido markdown.

```json
{
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Usuarios",
      "filename": "user.md"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Empresa",
      "filename": "company.md"
    }
  }
}
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `settings.{Grupo}.icon` | String | Icono Font Awesome del grupo |
| `settings.{Grupo}.title` | String | Título personalizado del grupo |
| `settings.{Grupo}.filename` | String | Archivo markdown con contenido personalizado |

**Procesamiento**:
- Los archivos markdown se convierten a HTML con `markdown-it`
- El HTML se inyecta al inicio de cada grupo
- Soporta código, tablas, listas, y HTML inline

**Ver también**: [📄 Markdown Personalizado](./03-custom-markdown.md)

---

### 8. Configuración de Template

```json
{
  "template": {
    "showRequiredLabels": false,
    "withCompare": true,
    "withGenerator": true,
    "aloneDisplay": false,
    "forceLanguage": "es"
  }
}
```

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `template.showRequiredLabels` | Boolean | Muestra etiquetas "required"/"optional" en parámetros | `false` |
| `template.withCompare` | Boolean | Habilita comparación de versiones de endpoints | `false` |
| `template.withGenerator` | Boolean | Incluye información del generador en footer | `true` |
| `template.aloneDisplay` | Boolean | Muestra un solo endpoint por página | `false` |
| `template.forceLanguage` | String | Fuerza idioma específico (es, en, fr, de, etc.) | Auto-detect |

---

### 9. Documentación Markdown (`documentation`)

Glob pattern para incluir archivos markdown adicionales.

```json
{
  "documentation": "./example/*.md"
}
```

**Procesamiento**:
- Lee todos los archivos que coincidan con el pattern
- Convierte markdown a HTML
- Genera array de documentos con metadata
- Aparecen en sección "Docs" del template

**Estructura generada**:
```javascript
[
  {
    filename: "intro",
    title: "Introducción",
    content: "<h1>Introducción</h1><p>...",
    icon: "fa-book"
  }
]
```

---

### 10. Configuración MQTT (Template)

**⚠️ NOTA**: Esta configuración es para el **template** (cliente web), no para testing backend.

```json
{
  "mqtt": {
    "enabled": true,
    "broker": {
      "host": "test.mosquitto.org",
      "port": 8081,
      "protocol": "wss"
    },
    "authentication": {
      "username": "demo-user",
      "password": "demo-pass-123",
      "clientId": "apidoc-mqtt-client-demo"
    },
    "ssl": {
      "enabled": false,
      "rejectUnauthorized": true,
      "ca": "/path/to/ca.crt",
      "cert": "/path/to/client.crt",
      "key": "/path/to/client.key"
    },
    "options": {
      "keepalive": 60,
      "connectTimeout": 30000,
      "reconnectPeriod": 1000,
      "clean": true
    }
  }
}
```

#### Broker Configuration

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `mqtt.enabled` | Boolean | Habilita funcionalidades MQTT |
| `mqtt.broker.host` | String | Host del broker MQTT |
| `mqtt.broker.port` | Number | Puerto del broker |
| `mqtt.broker.protocol` | String | Protocolo (ws, wss, mqtt, mqtts) |

#### Authentication

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `mqtt.authentication.username` | String | Usuario MQTT |
| `mqtt.authentication.password` | String | Password MQTT |
| `mqtt.authentication.clientId` | String | ID del cliente MQTT |

#### SSL/TLS

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `mqtt.ssl.enabled` | Boolean | Habilita SSL/TLS |
| `mqtt.ssl.rejectUnauthorized` | Boolean | Valida certificados SSL |
| `mqtt.ssl.ca` | String | Path al certificado CA |
| `mqtt.ssl.cert` | String | Path al certificado cliente |
| `mqtt.ssl.key` | String | Path a la clave privada |

#### Connection Options

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `mqtt.options.keepalive` | Number | Keepalive en segundos | `60` |
| `mqtt.options.connectTimeout` | Number | Timeout de conexión (ms) | `30000` |
| `mqtt.options.reconnectPeriod` | Number | Periodo de reconexión (ms) | `1000` |
| `mqtt.options.clean` | Boolean | Sesión limpia | `true` |

**Ver también**: [📡 Protocolo MQTT](./10-mqtt.md)

---

### 11. Repositorio y Bugs

```json
{
  "bugs": {
    "url": "https://github.com/user/repo/issues"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo.git"
  }
}
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `bugs.url` | String | URL para reportar bugs |
| `repository.type` | String | Tipo de repositorio (git, svn) |
| `repository.url` | String | URL del repositorio |

---

## 🔗 Uso en package.json

Como alternativa a `apidoc.json`, puedes incluir la configuración en `package.json`:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My project description",
  "apidoc": {
    "title": "My API Documentation",
    "url": "https://api.example.com",
    "sampleUrl": "https://api.example.com",
    "order": ["User", "Admin"],
    "template": {
      "withCompare": true,
      "forceLanguage": "es"
    }
  }
}
```

---

## 📂 Resolución de Rutas

### Archivos markdown

Se resuelven **relativos al directorio donde está `apidoc.json`**:

```
proyecto/
├── apidoc.json
├── header.md          ← "header.md"
├── docs/
│   └── footer.md      ← "docs/footer.md"
└── example/
    └── intro.md       ← "./example/*.md"
```

### Iconos Font Awesome

Usa clases de Font Awesome 6.0+:

```json
{
  "icon": "fa-user"           // Regular
  "icon": "fa-solid fa-rocket" // Solid
  "icon": "fa-brands fa-github" // Brands
}
```

---

## 🌍 Soporte Multiidioma

### Idiomas disponibles

- `en` - English
- `es` - Español
- `fr` - Français
- `de` - Deutsch
- `it` - Italiano
- `pt` - Português
- `ru` - Русский
- `zh` - 中文
- `ja` - 日本語
- `ko` - 한국어

### Forzar idioma

```json
{
  "template": {
    "forceLanguage": "es"
  }
}
```

Sin `forceLanguage`, el template detecta el idioma del navegador automáticamente.

---

## ⚠️ Opciones NO Implementadas

Las siguientes opciones aparecen en ejemplos pero **NO están implementadas**:

- ❌ `apicat.generateCollections` - Variable definida pero no usada
- ❌ `apicat.enableLocalTesting` - Variable definida pero no usada
- ❌ `template.groupsCollapsible` - No se usa en el código
- ❌ `template.endpointsCollapsible` - No se usa en el código

**No las uses en tu configuración**, no tendrán ningún efecto.

---

## 📋 Ejemplo Completo Real

Ver: `examples/apicat/apidoc.json` para un ejemplo completo funcional.

---

**Ver También:**
- [🎨 Iconos y Personalización](./02-customization.md)
- [📄 Markdown Personalizado](./03-custom-markdown.md)
- [🔐 Sistema de Autenticación](./12-authentication.md)
- [📡 Protocolo MQTT](./10-mqtt.md)
