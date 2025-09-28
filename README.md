# @hrefcl/apidoc v4.0.5

**RESTful web API & MQTT Protocol Documentation Generator** - A modern TypeScript fork of the original apidoc project with active maintenance, modern tooling, and comprehensive MQTT support.

[![License](https://img.shields.io/github/license/hrefcl/apidoc)](https://github.com/hrefcl/apidoc/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@hrefcl/apidoc)](https://www.npmjs.com/package/@hrefcl/apidoc)
[![Node.js Version](https://img.shields.io/node/v/@hrefcl/apidoc)](https://nodejs.org/)

## 🚀 What's APIDoc?

**APIDoc** genera documentación para APIs RESTful y protocolos MQTT desde comentarios en tu código fuente. Compatible con **C#, Go, Dart, Java, JavaScript, PHP, TypeScript, Python, Ruby** y más.

### Ejemplo básico:

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

## 🎯 Instalación y Uso Rápido

```bash
# Instalación global
npm install -g @hrefcl/apidoc

# Generar documentación
apidoc -i src/ -o docs/

# Ver documentación
open docs/index.html
```

## 📚 Documentación Completa

### 🏗️ **Configuración y Personalización**
- **[📋 Configuración de apidoc.json](./md/01-configuration.md)** - Configuración completa del proyecto
- **[🎨 Iconos y Personalización](./md/02-customization.md)** - Font Awesome, logos, temas
- **[📄 Markdown Personalizado](./md/03-custom-markdown.md)** - Contenido markdown por secciones
- **[🎨 Temas de Sintaxis](./md/04-highlight-themes.md)** - 160+ temas de resaltado de código

### 🔧 **Funcionalidades Core**
- **[📖 Parámetros APIDoc](./md/05-apidoc-params.md)** - Referencia completa de @api, @apiParam, etc.
- **[📝 Ejemplos y Plantillas](./md/06-examples.md)** - Ejemplos prácticos de uso
- **[🔄 Versionado y Herencia](./md/07-versioning.md)** - Gestión de versiones y reutilización
- **[💻 Uso Programático](./md/08-programmatic-usage.md)** - Integración en Node.js

### 🌐 **Protocolos y Formatos Modernos**
- **[🔌 OpenAPI 3.0](./md/09-openapi.md)** - Soporte nativo y exportación
- **[📡 Protocolo MQTT](./md/10-mqtt.md)** - Documentación IoT completa
- **[📊 Esquemas TypeScript](./md/11-typescript-schemas.md)** - Integración @apiSchema

### 🔐 **Seguridad y Autenticación**
- **[🛡️ Sistema de Autenticación](./md/12-authentication.md)** - Protección de documentación
- **[🚀 Guía Rápida Auth](./md/13-quick-start-auth.md)** - Setup en 3 pasos
- **[👨‍💻 Referencia de Desarrollador](./md/14-auth-developer.md)** - API técnica de autenticación

### 🛠️ **Desarrollo y Deploy**
- **[🔨 Desarrollo Local](./md/15-development.md)** - Setup del entorno de desarrollo
- **[🐳 Docker y Containers](./md/16-docker.md)** - Uso con contenedores
- **[🔧 Herramientas y Plugins](./md/17-build-tools.md)** - Integración con Grunt, Webpack, etc.

## 🌟 Características Destacadas v4.0.5

### 🆕 **Custom Markdown Content**
Añade contenido markdown personalizado a cualquier grupo de API:

```json
{
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Usuarios",
      "filename": "user.md"
    }
  }
}
```

### 📡 **Soporte MQTT Completo**
Documenta protocolos MQTT con 16 tags especializados:

```javascript
/**
 * @api {publish} v1/sensors/{id}/data Publish Sensor Data
 * @mqtt publish
 * @topic v1/sensors/{id}/data
 * @qos 1
 * @retain false
 */
```

### 🔐 **Sistema de Autenticación Dual**
Protege tu documentación con autenticación local y remota:

```json
{
  "login": {
    "active": true,
    "admited": [{"email": "admin@company.com", "password": "secure123"}],
    "urlAuth": "https://api.company.com/auth/login"
  }
}
```

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

## 🎯 Links de Interés

- **[📦 NPM Package](https://www.npmjs.com/package/@hrefcl/apidoc)**
- **[🏠 Sitio Web Oficial](https://apidocts.com)**
- **[🚀 Demo en Vivo](http://apidocts.com/example/)**
- **[💻 Repositorio GitHub](https://github.com/hrefcl/apidoc)**

## 🤝 Soporte y Contribuciones

- **[🐛 Reportar Issues](https://github.com/hrefcl/apidoc/issues)**
- **[💬 Discusiones](https://github.com/hrefcl/apidoc/discussions)**
- **[📖 Guía de Contribución](./CONTRIBUTING.md)**

## 📄 Licencia

MIT License - ver archivo [LICENSE](./LICENSE) para detalles.

---

**Hecho con ❤️ por la comunidad APIDoc. Originalmente creado por Peter Rottmann.**