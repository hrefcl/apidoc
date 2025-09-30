# APIDoc 4.0

**RESTful web API & MQTT Protocol Documentation Generator** - A modern TypeScript fork of the original apidoc project with active maintenance, modern tooling, and comprehensive MQTT support.

[![License](https://img.shields.io/github/license/hrefcl/apidoc)](https://github.com/hrefcl/apidoc/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@hrefcl/apidoc)](https://www.npmjs.com/package/@hrefcl/apidoc)
[![Node.js Version](https://img.shields.io/node/v/@hrefcl/apidoc)](https://nodejs.org/)

## 🚀 What's APIDoc?

**APIDoc** generates comprehensive documentation for RESTful APIs and MQTT protocols from source code comments. Compatible with **C#, Go, Dart, Java, JavaScript, PHP, TypeScript, Python, Ruby** and more.

### Quick Example:

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

## 🎯 Quick Start

```bash
# Global installation
npm install -g @hrefcl/apidoc

# Generate documentation
apidoc -i src/ -o docs/

# View documentation
open docs/index.html
```

## 📚 Complete Documentation

### 🛠️ **Configuration & Customization**
- **[📋 Configuration](./md/en/01-configuration.md)** - Complete apidoc.json project configuration
- **[🎨 Icons & Customization](./md/en/02-customization.md)** - Font Awesome, logos, themes
- **[📄 Custom Markdown](./md/en/03-custom-markdown.md)** - Custom content for sections
- **[🌈 Syntax Themes](./md/en/04-highlight-themes.md)** - 160+ code highlighting themes

### 📋 **Core Functionality**
- **[📖 APIDoc Parameters](./md/en/05-apidoc-params.md)** - Complete @api, @apiParam reference
- **[💡 Examples & Templates](./md/en/06-examples.md)** - Practical usage examples
- **[🔄 Versioning & Inheritance](./md/en/07-versioning.md)** - Version management and reuse
- **[⚙️ Programmatic Usage](./md/en/08-programmatic-usage.md)** - Node.js integration

### 🌐 **Modern Protocols & Formats**
- **[🔌 OpenAPI 3.0](./md/en/09-openapi.md)** - Native support and export
- **[📡 MQTT Protocol](./md/en/10-mqtt.md)** - Complete IoT documentation
- **[🧪 Interactive MQTT Testing](./md/en/18-mqtt-testing.md)** - Test MQTT with real brokers
- **[📊 TypeScript Schemas](./md/en/11-typescript-schemas.md)** - @apiSchema integration

### 🔐 **Security & Authentication**
- **[🛡️ Authentication System](./md/en/12-authentication.md)** - Documentation protection
- **[🚀 Quick Auth Setup](./md/en/13-quick-start-auth.md)** - Setup in 3 steps
- **[👨‍💻 Developer Reference](./md/en/14-auth-developer.md)** - Technical authentication API

### 🛠️ **Development & Deploy**
- **[🔨 Local Development](./md/en/15-development.md)** - Development environment setup
- **[🐳 Docker & Containers](./md/en/16-docker.md)** - Container usage and deployment
- **[🔧 Build Tools](./md/en/17-build-tools.md)** - Integration with Grunt, Webpack, etc.

## 🌟 Key Features v5.0.0

### 🧪 **Interactive MQTT Testing** ⭐ NEW
Test MQTT endpoints with real broker connections directly in your documentation:

```json
{
  "mqtt": {
    "enabled": true,
    "broker": {
      "host": "mqtt.example.com",
      "port": 8883,
      "protocol": "wss"
    },
    "authentication": {
      "username": "demo-user",
      "password": "secure-pass",
      "clientId": "apidoc-client"
    },
    "ssl": {
      "enabled": true,
      "ca": "-----BEGIN CERTIFICATE-----..."
    }
  }
}
```

**Features:**
- ✅ Real broker connections (WebSocket/MQTT)
- 🔐 Secure credential masking
- 📡 Publish/Subscribe/Inline operations
- 🎯 QoS levels 0, 1, 2
- 🔒 Full SSL/TLS support
- 📨 Real-time message logging

### 📝 **Custom Markdown Content**
Add custom markdown content to any API group with rich formatting:

```json
{
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "User Management",
      "filename": "user.md"
    }
  }
}
```

### 📡 **Complete MQTT Support**
Document MQTT protocols with 16 specialized tags:

```javascript
/**
 * @mqtt {publish} v1/sensors/{id}/data Publish Sensor Data
 * @mqttGroup IoT
 * @topic v1/sensors/{id}/data
 * @qos 1
 * @retain false
 */
```

### 🔐 **Dual Authentication System**
Protect your documentation with local and remote authentication:

```json
{
  "login": {
    "active": true,
    "admited": [{"email": "admin@company.com", "password": "secure123"}],
    "urlAuth": "https://api.company.com/auth/login"
  }
}
```

### 🌐 **Native OpenAPI 3.0**
Write OpenAPI specifications directly in comments:

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

### 📊 **TypeScript Integration**
Generate documentation from TypeScript interfaces:

```typescript
/**
 * @api {get} /users/:id Get User
 * @apiSuccess {Object} user User data
 * @apiSchema {User} user
 * @apiSchemaFile ../types/user.ts
 */
```

## 🌍 Languages

- **🇺🇸 English** (Primary): [Documentation](./md/en/)
- **🇪🇸 Español**: [Documentación](./md/es/)

## 🔗 Links & Resources

- **[📦 NPM Package](https://www.npmjs.com/package/@hrefcl/apidoc)**
- **[🏠 Official Website](https://apidoc.app)**
- **[🚀 Live Demo](http://apidocts.com/example/)**
- **[💻 GitHub Repository](https://github.com/hrefcl/apidoc)**

## 🤝 Support & Contributions

- **[🐛 Report Issues](https://github.com/hrefcl/apidoc/issues)**
- **[💬 Discussions](https://github.com/hrefcl/apidoc/discussions)**
- **[📖 Contribution Guide](./md/en/15-development.md)**

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Made with ❤️ by the APIDoc community. Originally created by Peter Rottmann.**