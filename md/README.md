# APIDoc 4.0 Documentation

This directory contains the complete documentation for APIDoc 4.0 in multiple languages.

## 🌍 Available Languages

### 🇺🇸 English (Primary)
- **Location**: `./en/`
- **Index**: [English Documentation Index](./en/00-index.md)
- **Status**: ✅ Complete documentation available

### 🇪🇸 Español
- **Location**: `./es/`
- **Index**: [Índice de Documentación en Español](./es/00-index.md)
- **Status**: ✅ Documentación completa disponible

## 📚 Documentation Structure

Each language folder contains the same comprehensive documentation set:

### 🛠️ Configuration & Customization
- `01-configuration.md` - Complete apidoc.json configuration
- `02-customization.md` - Icons, logos, themes, and customization
- `03-custom-markdown.md` - Custom markdown content system
- `04-highlight-themes.md` - 160+ syntax highlighting themes

### 📋 Core Functionality
- `05-apidoc-params.md` - Complete APIDoc parameter reference
- `06-examples.md` - Practical examples and templates
- `07-versioning.md` - Version management and inheritance
- `08-programmatic-usage.md` - Node.js integration

### 🌐 Modern Protocols & Formats
- `09-openapi.md` - OpenAPI 3.0 support
- `10-mqtt.md` - MQTT protocol documentation
- `11-typescript-schemas.md` - TypeScript schema integration

### 🔐 Security & Authentication
- `12-authentication.md` - Authentication system
- `13-quick-start-auth.md` - Quick authentication setup
- `14-auth-developer.md` - Technical authentication reference

### 🛠️ Development & Deployment
- `15-development.md` - Local development setup
- `16-docker.md` - Docker and container usage
- `17-build-tools.md` - Build tools integration

## 🔗 Quick Links

- [🏠 Main README](../README.md)
- [📦 NPM Package](https://www.npmjs.com/package/@hrefcl/apidoc)
- [💻 GitHub Repository](https://github.com/hrefcl/apidoc)
- [🚀 Live Demo](http://apidocts.com/example/)

## 📖 TypeDoc Integration

This documentation is integrated with TypeDoc and appears in the generated API documentation alongside the technical reference.

To regenerate the documentation:

```bash
npm run docs
npm run docs:serve
```

---

*This documentation covers APIDoc v4.0.5 with complete MQTT support, custom markdown content, TypeScript integration, and dual authentication system.*