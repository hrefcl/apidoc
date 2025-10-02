# APIDoc 5.0

**RESTful web API & MQTT Protocol Documentation Generator** - Generador moderno de documentación para APIs REST y protocolos MQTT con soporte completo para TypeScript, autenticación dual y contenido personalizado.

[![License](https://img.shields.io/github/license/hrefcl/apidoc)](https://github.com/hrefcl/apidoc/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@hrefcl/apidoc)](https://www.npmjs.com/package/@hrefcl/apidoc)
[![Node.js Version](https://img.shields.io/node/v/@hrefcl/apidoc)](https://nodejs.org/)

## 🚀 ¿Qué es APIDoc?

**APIDoc** genera documentación completa para APIs RESTful y protocolos MQTT desde comentarios en el código fuente. Compatible con **C#, Go, Dart, Java, JavaScript, PHP, TypeScript, Python, Ruby** y más.

### Ejemplo Rápido:

```javascript
/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
```

## 🎯 Inicio Rápido

```bash
# Instalación global
npm install -g @hrefcl/apidoc

# Generar documentación
apidoc -i src/ -o docs/

# Ver documentación
open docs/index.html
```

## 📚 Documentación Completa

### 🛠️ **Configuración y Personalización**
- **[📋 Configuración](./md/es/01-configuration.md)** - Configuración completa de apidoc.json
- **[🎨 Iconos y Personalización](./md/es/02-customization.md)** - Font Awesome, logos, temas
- **[📄 Markdown Personalizado](./md/es/03-custom-markdown.md)** - Contenido personalizado para secciones
- **[📄 Ejemplos de Markdown](./md/es/04-custom-markdown-examples.md)** - Ejemplos prácticos

### 📋 **Funcionalidad Core**
- **[📖 Parámetros APIDoc](./md/es/05-apidoc-params.md)** - Referencia completa de @api, @apiParam
- **[💡 Ejemplos y Plantillas](./md/es/06-examples.md)** - Ejemplos de uso práctico
- **[🔄 Versionado y Herencia](./md/es/07-versioning.md)** - Gestión de versiones y reutilización
- **[⚙️ Uso Programático](./md/es/08-programmatic-usage.md)** - Integración con Node.js

### 🌐 **Protocolos y Formatos Modernos**
- **[🔌 OpenAPI 3.0](./md/es/09-openapi.md)** - Soporte nativo y exportación
- **[📡 Protocolo MQTT](./md/es/10-mqtt.md)** - Documentación completa para IoT
- **[📊 Schemas TypeScript](./md/es/11-typescript-schemas.md)** - Integración con @apiSchema

### 🔐 **Seguridad y Autenticación**
- **[🛡️ Sistema de Autenticación](./md/es/12-authentication.md)** - Protección de documentación
- **[🚀 Configuración Rápida Auth](./md/es/13-quick-start-auth.md)** - Setup en 3 pasos
- **[👨‍💻 Referencia Desarrollador](./md/es/14-auth-developer.md)** - API técnica de autenticación

### 🛠️ **Desarrollo y Deploy**
- **[🔨 Desarrollo Local](./md/es/15-development.md)** - Configuración de entorno de desarrollo
- **[🐳 Docker y Contenedores](./md/es/16-docker.md)** - Uso y despliegue con contenedores
- **[🔧 Herramientas de Build](./md/es/17-build-tools.md)** - Integración con Grunt, Webpack, etc.

## 🌟 Características Principales v5.0.0

### 📝 **Contenido Markdown Personalizado**
Agrega contenido markdown personalizado a cualquier grupo de API con formato enriquecido:

```json
{
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Gestión de Usuarios",
      "filename": "users.md"
    }
  }
}
```

### 📡 **Soporte Completo para MQTT**
Documenta protocolos MQTT con parsers especializados:

```javascript
/**
 * @apiMqtt {publish} v1/sensors/{id}/data Publish Sensor Data
 * @apiGroup IoT
 * @apiMqttQos 1
 * @apiMqttRetain false
 * @apiMqttPayload {Object} data Sensor data payload
 */
```

**Características MQTT:**
- ✅ 16+ parsers MQTT implementados (@apiMqtt, @apiMqttPayload, @apiMqttQos, etc.)
- ✅ Template específico para documentación MQTT
- ✅ CSS styling para métodos publish/subscribe
- ✅ Configuración de broker MQTT en apidoc.json para template
- ✅ CLI options: --mqtt-only, --fail-on-mqtt-schema-error

### 🔐 **Sistema de Autenticación Dual**
Protege tu documentación con autenticación local y remota:

**Modo Local (Sin servidor):**
```json
{
  "login": {
    "active": true,
    "encryptionKey": "tu-clave-base64",
    "admited": [
      {
        "email": "admin@company.com",
        "password": "secure123",
        "name": "Admin User"
      }
    ]
  }
}
```

**Modo Servidor:**
```json
{
  "login": {
    "active": true,
    "encryptionKeyFromServer": true,
    "urlAuth": "https://api.company.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401
  }
}
```

**Características de Seguridad:**
- ✅ Encriptación AES-256-GCM
- ✅ Ofuscación de claves de encriptación
- ✅ JWT con expiración de 24 horas
- ✅ Lista de usuarios encriptada
- ✅ No almacena claves en sessionStorage

### 🌐 **OpenAPI 3.0 Nativo**
Escribe especificaciones OpenAPI directamente en comentarios:

```javascript
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
```

### 📊 **Integración con TypeScript**
Genera documentación desde interfaces TypeScript:

```typescript
/**
 * @api {get} /users/:id Get User
 * @apiSuccess {Object} user User data
 * @apiSchema {User} user
 * @apiSchemaFile ../types/user.ts
 */
```

### 🎨 **Personalización Completa**
- 160+ temas de resaltado de sintaxis
- Font Awesome 6.0+ para iconos
- Logos personalizados (light/dark mode)
- Orden personalizado de grupos
- Markdown enriquecido en secciones

## 🌍 Idiomas

- **🇪🇸 Español** (Principal): [Documentación](./md/es/)

## 🔗 Enlaces y Recursos

- **[📦 Paquete NPM](https://www.npmjs.com/package/@hrefcl/apidoc)**
- **[🏠 Sitio Web Oficial](https://apidoc.app)**
- **[💻 Repositorio GitHub](https://github.com/hrefcl/apidoc)**

## 🤝 Soporte y Contribuciones

- **[🐛 Reportar Issues](https://github.com/hrefcl/apidoc/issues)**
- **[💬 Discusiones](https://github.com/hrefcl/apidoc/discussions)**
- **[📖 Guía de Contribución](./md/es/15-development.md)**

## 📄 Licencia

MIT License - ver archivo [LICENSE](./LICENSE) para detalles.

---