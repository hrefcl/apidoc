---
title: "APIDoc Documentation"
category: "Index"
order: 0
---

# 📚 APIDoc 5.0 Documentation

Welcome to the complete APIDoc 5.0 documentation. This guide will help you make the most of all the tool's features.

## 🚀 Quick Start

1. **[Basic Configuration](./01-configuration.md)** - Set up your first project
2. **[APIDoc Parameters](./05-apidoc-params.md)** - Learn the basic syntax
3. **[Practical Examples](./06-examples.md)** - See working examples

## 🏗️ Configuration and Customization

- **[📋 apidoc.json Configuration](./01-configuration.md)** - Complete project configuration
- **[🎨 Icons and Customization](./02-customization.md)** - Font Awesome, logos, themes
- **[📄 Custom Markdown](./03-custom-markdown.md)** - Markdown content per section
- **[📄 Markdown Examples](./04-custom-markdown-examples.md)** - Practical examples

## 🔧 Core Features

- **[📖 APIDoc Parameters](./05-apidoc-params.md)** - Complete reference for @api, @apiParam, etc.
- **[📝 Examples and Templates](./06-examples.md)** - Practical usage examples
- **[🔄 Versioning and Inheritance](./07-versioning.md)** - Version management and reuse
- **[💻 Programmatic Usage](./08-programmatic-usage.md)** - Node.js integration

## 🌐 Modern Protocols and Formats

- **[🔌 OpenAPI 3.0](./09-openapi.md)** - Native support and export
- **[📡 MQTT Protocol](./10-mqtt.md)** - Complete IoT documentation
- **[📊 TypeScript Schemas](./11-typescript-schemas.md)** - @apiSchema integration

## 🔐 Security and Authentication

- **[🛡️ Authentication System](./12-authentication.md)** - Documentation protection
- **[🚀 Quick Start Auth](./13-quick-start-auth.md)** - Setup in 3 steps
- **[👨‍💻 Developer Reference](./14-auth-developer.md)** - Technical authentication API

## 🛠️ Development and Deploy

- **[🔨 Local Development](./15-development.md)** - Development environment setup
- **[🐳 Docker and Containers](./16-docker.md)** - Container usage
- **[🔧 Tools and Plugins](./17-build-tools.md)** - Integration with Grunt, Webpack, etc.
- **[💻 Modern CLI v5](./18-cli-v5.md)** - Complete guide to the new CLI with subcommands

## 💡 Common Use Cases

### For REST APIs
1. Configure [apidoc.json](./01-configuration.md)
2. Add [@api parameters](./05-apidoc-params.md) to your endpoints
3. Customize with [icons and themes](./02-customization.md)

### For MQTT APIs
1. Review the [MQTT guide](./10-mqtt.md)
2. Configure [MQTT parameters](./05-apidoc-params.md#mqtt)
3. Add [MQTT message examples](./06-examples.md)

### For TypeScript Projects
1. Configure [TypeScript schemas](./11-typescript-schemas.md)
2. Use [automatic validation](./11-typescript-schemas.md#example-validation)
3. Integrate with [OpenAPI](./09-openapi.md)

### For Protected Documentation
1. Follow the [quick start guide](./13-quick-start-auth.md)
2. Configure [authentication](./12-authentication.md)
3. Review the [technical API](./14-auth-developer.md)

## 🎯 Featured v5.0 Characteristics

### 🆕 Modern CLI with Subcommands
- **✅ Interactive Menu**: `apidoc` command shows interactive options
- **✅ Modern Subcommands**: `generate`, `export`, `init` for specific workflows
- **✅ Watch Mode**: `--watch` flag for development with hot reload
- **✅ Silent Mode**: Clean output by default, use `-v` for verbose
- **✅ Multiple Export**: Export to JSON, OpenAPI, Markdown with `apidoc export`

### 🎨 Main Features
- **✅ apiCAT (Vue 3)**: Modern template with lazy loading of endpoints
- **✅ Custom Markdown**: Custom content per section (`settings.{Group}.filename`)
- **✅ MQTT Protocol**: 16+ MQTT parsers with specialized template
- **✅ OpenAPI 3.0**: Native integration and export to swagger.json
- **✅ TypeScript**: Support for @apiSchema with TS interfaces
- **✅ Authentication**: Dual system with AES-256-GCM encryption and key obfuscation
- **✅ 160+ Themes**: Code highlighting themes (highlight.js)
- **✅ MQTT Configuration**: Broker, SSL/TLS, authentication in apidoc.json

## 🤝 Contributing

Want to contribute? See the [development guide](./15-development.md) to set up your local environment.

---

**APIDoc 5.0** - Modern and powerful API documentation generation.
Made with ❤️ by the APIDoc community.
