---
title: "Configuración de apidoc.json"
category: "Configuración"
order: 1
---

# 📋 Configuración de apidoc.json

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

### Configuración completa

```json
{
  "name": "Mi API",
  "version": "1.0.0",
  "description": "Documentación completa de mi API",
  "title": "Mi API Documentation",
  "url": "https://api.example.com",
  "sampleUrl": "https://api.example.com",
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
  "order": [
    "User",
    "Authentication",
    "Company",
    "Admin"
  ],
  "template": {
    "forceLanguage": "es",
    "withCompare": true,
    "withGenerator": true,
    "showRequiredLabels": true
  }
}
```

## ⚙️ Parámetros de Configuración

### Información del Proyecto

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `name` | String | Nombre del proyecto | `"Mi API"` |
| `version` | String | Versión del proyecto | `"1.0.0"` |
| `description` | String | Descripción del proyecto | `"API para gestión de usuarios"` |
| `title` | String | Título mostrado en el navegador | `"Mi API Documentation"` |
| `url` | String | URL base de la API | `"https://api.example.com"` |
| `sampleUrl` | String/Boolean | URL para formularios de prueba | `"https://api.example.com"` |

### Header y Footer

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `header.title` | String | Título de navegación del header | `"Introducción"` |
| `header.filename` | String | Archivo markdown del header | `"header.md"` |
| `header.icon` | String | Icono Font Awesome | `"fa-home"` |
| `footer.title` | String | Título de navegación del footer | `"Contacto"` |
| `footer.filename` | String | Archivo markdown del footer | `"footer.md"` |
| `footer.icon` | String | Icono Font Awesome | `"fa-envelope"` |

### Ordenamiento

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `order` | Array | Orden de grupos en la navegación | `["User", "Admin", "System"]` |

### Configuración de Template

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `template.forceLanguage` | String | Idioma forzado (es, en, fr, etc.) | Browser detection |
| `template.withCompare` | Boolean | Habilitar comparación de versiones | `true` |
| `template.withGenerator` | Boolean | Mostrar información del generador | `true` |
| `template.aloneDisplay` | Boolean | Mostrar solo un grupo a la vez | `false` |
| `template.showRequiredLabels` | Boolean | Mostrar etiquetas "required" | `false` |

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
    "order": ["User", "Admin"]
  }
}
```

## 📂 Rutas de Archivos

### Resolución de rutas

- **Archivos markdown**: Se resuelven relativos al directorio donde está `apidoc.json`
- **URLs**: Pueden ser absolutas o relativas
- **Iconos**: Font Awesome classes (ej: `fa-user`, `fa-building`)

### Ejemplo de estructura

```
proyecto/
├── apidoc.json
├── header.md
├── footer.md
├── src/
│   └── api/
└── docs/
```

## 🌍 Soporte Multiidioma

### Idiomas disponibles

- `en` - English (default)
- `es` - Español
- `fr` - Français
- `de` - Deutsch
- `it` - Italiano
- `pt` - Português
- `ru` - Русский
- `zh` - 中文

### Configuración

```json
{
  "template": {
    "forceLanguage": "es"
  }
}
```

## 📝 Validación de Configuración

APIDoc valida automáticamente tu configuración y mostrará warnings para:

- Archivos markdown no encontrados
- Iconos Font Awesome inválidos
- URLs malformadas
- Parámetros de template incorrectos

## 🔧 Configuración Avanzada

Para configuraciones más avanzadas, ver:

- **[🎨 Iconos y Personalización](./02-customization.md)**
- **[📄 Markdown Personalizado](./03-custom-markdown.md)**
- **[🔐 Sistema de Autenticación](./12-authentication.md)**