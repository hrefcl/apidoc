---
title: "Documentación APIDoc"
category: "Índice"
order: 0
---

# 📚 Documentación APIDoc 5.0

Bienvenido a la documentación completa de APIDoc 5.0. Esta guía te permitirá aprovechar al máximo todas las funcionalidades de la herramienta.

## 🚀 Inicio Rápido

1. **[Configuración básica](./01-configuration.md)** - Configura tu primer proyecto
2. **[Parámetros APIDoc](./05-apidoc-params.md)** - Aprende la sintaxis básica
3. **[Ejemplos prácticos](./06-examples.md)** - Ve ejemplos funcionando

## 🏗️ Configuración y Personalización

- **[📋 Configuración de apidoc.json](./01-configuration.md)** - Configuración completa del proyecto
- **[🎨 Iconos y Personalización](./02-customization.md)** - Font Awesome, logos, temas
- **[📄 Markdown Personalizado](./03-custom-markdown.md)** - Contenido markdown por secciones
- **[📄 Ejemplos de Markdown](./04-custom-markdown-examples.md)** - Ejemplos prácticos

## 🔧 Funcionalidades Core

- **[📖 Parámetros APIDoc](./05-apidoc-params.md)** - Referencia completa de @api, @apiParam, etc.
- **[📝 Ejemplos y Plantillas](./06-examples.md)** - Ejemplos prácticos de uso
- **[🔄 Versionado y Herencia](./07-versioning.md)** - Gestión de versiones y reutilización
- **[💻 Uso Programático](./08-programmatic-usage.md)** - Integración en Node.js

## 🌐 Protocolos y Formatos Modernos

- **[🔌 OpenAPI 3.0](./09-openapi.md)** - Soporte nativo y exportación
- **[📡 Protocolo MQTT](./10-mqtt.md)** - Documentación IoT completa
- **[📊 Esquemas TypeScript](./11-typescript-schemas.md)** - Integración @apiSchema

## 🔐 Seguridad y Autenticación

- **[🛡️ Sistema de Autenticación](./12-authentication.md)** - Protección de documentación
- **[🚀 Guía Rápida Auth](./13-quick-start-auth.md)** - Setup en 3 pasos
- **[👨‍💻 Referencia de Desarrollador](./14-auth-developer.md)** - API técnica de autenticación

## 🛠️ Desarrollo y Deploy

- **[🔨 Desarrollo Local](./15-development.md)** - Setup del entorno de desarrollo
- **[🐳 Docker y Containers](./16-docker.md)** - Uso con contenedores
- **[🔧 Herramientas y Plugins](./17-build-tools.md)** - Integración con Grunt, Webpack, etc.
- **[💻 CLI v5 Moderna](./18-cli-v5.md)** - Guía completa de la nueva CLI con subcomandos

## 💡 Casos de Uso Comunes

### Para APIs REST
1. Configura [apidoc.json](./01-configuration.md)
2. Añade [parámetros @api](./05-apidoc-params.md) a tus endpoints
3. Personaliza con [iconos y temas](./02-customization.md)

### Para APIs MQTT
1. Revisa la [guía MQTT](./10-mqtt.md)
2. Configura [parámetros MQTT](./05-apidoc-params.md#mqtt)
3. Añade [ejemplos de mensajes MQTT](./06-examples.md)

### Para Proyectos TypeScript
1. Configura [esquemas TypeScript](./11-typescript-schemas.md)
2. Usa [validación automática](./11-typescript-schemas.md#validación-de-ejemplos)
3. Integra con [OpenAPI](./09-openapi.md)

### Para Documentación Protegida
1. Sigue la [guía rápida](./13-quick-start-auth.md)
2. Configura [autenticación](./12-authentication.md)
3. Revisa la [API técnica](./14-auth-developer.md)

## 🎯 Características Destacadas v5.0

### 🆕 CLI Moderna con Subcomandos
- **✅ Menú Interactivo**: Comando `apidoc` muestra opciones interactivas
- **✅ Subcomandos Modernos**: `generate`, `export`, `init` para flujos específicos
- **✅ Modo Watch**: Flag `--watch` para desarrollo con hot reload
- **✅ Modo Silencioso**: Salida limpia por defecto, usa `-v` para verbose
- **✅ Exportación Múltiple**: Exporta a JSON, OpenAPI, Markdown con `apidoc export`

### 🎨 Features Principales
- **✅ apiCAT (Vue 3)**: Template moderno con carga lazy de endpoints
- **✅ Custom Markdown**: Contenido personalizado por secciones (`settings.{Grupo}.filename`)
- **✅ MQTT Protocol**: 16+ parsers MQTT con template especializado
- **✅ OpenAPI 3.0**: Integración nativa y export a swagger.json
- **✅ TypeScript**: Soporte para @apiSchema con interfaces TS
- **✅ Authentication**: Sistema dual con encriptación AES-256-GCM y ofuscación de claves
- **✅ 160+ Themes**: Temas de resaltado de código (highlight.js)
- **✅ Configuración MQTT**: Broker, SSL/TLS, autenticación en apidoc.json

## 🤝 Contribuir

¿Quieres contribuir? Ve la [guía de desarrollo](./15-development.md) para configurar tu entorno local.

---

**APIDoc 5.0** - Generación de documentación API moderna y poderosa.
Hecho con ❤️ por la comunidad APIDoc.