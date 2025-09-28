# 🎨 Iconos y Personalización

APIDoc 4.0 permite personalizar completamente la apariencia de tu documentación con iconos Font Awesome, logos personalizados y configuración de temas.

## 🏷️ Iconos de Grupos

### Configuración básica

Asigna iconos Font Awesome a tus grupos de API en `apidoc.json`:

```json
{
  "name": "Mi API",
  "version": "1.0.0",
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Usuarios"
    },
    "Authentication": {
      "icon": "fa-shield-alt",
      "title": "Autenticación"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Empresa"
    },
    "Payment": {
      "icon": "fa-credit-card",
      "title": "Pagos"
    }
  }
}
```

### Iconos populares por categoría

| Categoría | Iconos Recomendados | Clases CSS |
|-----------|-------------------|------------|
| **Usuarios** | 👤👥🛡️ | `fa-user`, `fa-users`, `fa-shield-alt` |
| **Administración** | ⚙️🔧👑 | `fa-cog`, `fa-tools`, `fa-crown` |
| **Pagos** | 💳💰🏦 | `fa-credit-card`, `fa-dollar-sign`, `fa-bank` |
| **Archivos** | 📁📤📥 | `fa-folder`, `fa-upload`, `fa-download` |
| **Analíticas** | 📊📈📉 | `fa-chart-line`, `fa-chart-bar`, `fa-analytics` |
| **Ubicación** | 📍🌍🗺️ | `fa-map-marker-alt`, `fa-globe`, `fa-map` |
| **Comunicación** | 📧💬📞 | `fa-envelope`, `fa-comments`, `fa-phone` |
| **Empresa** | 🏢💼📋 | `fa-building`, `fa-briefcase`, `fa-clipboard` |

## 🖼️ Logo Personalizado

### Configuración de logo

```json
{
  "logo": {
    "url": "https://example.com/logo.png",
    "alt": "Logo de la Empresa",
    "width": "40px",
    "height": "40px"
  }
}
```

### Opciones de logo

| Parámetro | Tipo | Descripción | Default |
|-----------|------|-------------|---------|
| `url` | String | URL de la imagen (absoluta, relativa o data URL) | - |
| `icon` | String | Clase de icono Font Awesome | - |
| `alt` | String | Texto alternativo para accesibilidad | `"Logo"` |
| `width` | String | Ancho en unidades CSS | `"32px"` |
| `height` | String | Alto en unidades CSS | `"32px"` |

### Tipos de logo

**Logo con imagen:**
```json
{
  "logo": {
    "url": "/assets/company-logo.svg",
    "alt": "Acme Corp Logo",
    "width": "45px",
    "height": "35px"
  }
}
```

**Logo con icono Font Awesome:**
```json
{
  "logo": {
    "icon": "fa-rocket",
    "alt": "API Documentation"
  }
}
```

**Logo con Data URL (imagen embebida):**
```json
{
  "logo": {
    "url": "data:image/svg+xml;base64,PHN2Zz...",
    "alt": "Logo Embebido",
    "width": "30px"
  }
}
```

### Prioridad de logos

1. **Imagen personalizada** (`url`) - máxima prioridad
2. **Icono Font Awesome** (`icon`) - si no hay URL
3. **Icono SVG por defecto** - fallback si no hay configuración

## 🌈 Temas de Resaltado de Código

### Configuración de tema

```json
{
  "highlightTheme": "tokyo-night-dark"
}
```

### Temas populares

**Temas oscuros:**
```json
{"highlightTheme": "tokyo-night-dark"}   // Tema moderno oscuro (default)
{"highlightTheme": "github-dark"}        // GitHub oscuro
{"highlightTheme": "monokai"}           // Clásico Monokai
{"highlightTheme": "dracula"}           // Popular Dracula
{"highlightTheme": "androidstudio"}     // Android Studio
```

**Temas claros:**
```json
{"highlightTheme": "github"}            // GitHub claro
{"highlightTheme": "vs"}                // Visual Studio
{"highlightTheme": "atom-one-light"}    // Atom One Light
{"highlightTheme": "xcode"}             // Xcode
```

### Cambio dinámico de tema

```javascript
// Cambiar tema en tiempo de ejecución
window.loadHighlightTheme('dracula');
window.loadHighlightTheme('github-dark');
window.loadHighlightTheme('monokai');
```

### 160+ temas disponibles

- **GitHub**: `github`, `github-dark`, `github-dark-dimmed`
- **Populares**: `monokai`, `dracula`, `tomorrow-night`, `solarized-dark`
- **Modernos**: `tokyo-night-dark`, `tokyo-night-light`, `nord`, `gruvbox-dark`
- **Clásicos**: `vs`, `vs2015`, `androidstudio`, `xcode`
- **Coloridos**: `rainbow`, `magula`, `sunburst`, `hybrid`
- **Minimalistas**: `default`, `lightfair`, `far`, `foundation`

## 🎨 Header y Footer con Iconos

### Configuración

```json
{
  "header": {
    "title": "Primeros Pasos",
    "filename": "header.md",
    "icon": "fa-home"
  },
  "footer": {
    "title": "Mejores Prácticas",
    "filename": "footer.md",
    "icon": "fa-lightbulb"
  }
}
```

### Iconos recomendados para header/footer

| Sección | Propósito | Iconos Sugeridos |
|---------|-----------|------------------|
| **Header** | Introducción, bienvenida | `fa-home`, `fa-info-circle`, `fa-book` |
| **Footer** | Contacto, soporte | `fa-envelope`, `fa-phone`, `fa-support` |
| **Guías** | Documentación, tutoriales | `fa-lightbulb`, `fa-graduation-cap`, `fa-guide` |
| **Legal** | Términos, privacidad | `fa-gavel`, `fa-shield-alt`, `fa-lock` |

## 🌍 Localización de Títulos

### Títulos personalizados

```json
{
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Usuarios"
    },
    "Authentication": {
      "icon": "fa-shield-alt",
      "title": "Autenticación"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Empresa"
    }
  }
}
```

### Beneficios de la localización

- **Consistencia**: Nombres estandarizados en toda la documentación
- **Profesionalidad**: Títulos apropiados para tu audiencia
- **Flexibilidad**: Cambiar nombres sin modificar código fuente
- **Multiidioma**: Soporte para diferentes idiomas

## 💡 Sistema de Iconos Inteligente

### Priorización automática

APIDoc usa el siguiente orden de prioridad para iconos:

1. **Iconos personalizados** desde `settings` (máxima prioridad)
2. **Iconos de header/footer** desde configuración del proyecto
3. **Iconos por defecto** para nombres de grupos comunes
4. **Icono genérico** (`fa-file-alt`) como fallback

### Iconos por defecto

| Nombre del Grupo | Icono Automático | Clase CSS |
|------------------|------------------|-----------|
| User, Users | 👤 | `fa-user` |
| Admin, Administration | ⚙️ | `fa-cog` |
| Auth, Authentication | 🛡️ | `fa-shield-alt` |
| Company, Business | 🏢 | `fa-building` |
| Payment, Billing | 💳 | `fa-credit-card` |
| File, Files | 📁 | `fa-folder` |
| System | 🖥️ | `fa-desktop` |
| API, General | 📋 | `fa-file-alt` |

## 🔧 Implementación Técnica

### Font Awesome local

- **Sin CDN**: Font Awesome CSS incluido localmente
- **Biblioteca completa**: Acceso a todos los iconos
- **Fallbacks inteligentes**: Iconos automáticos para grupos no configurados
- **Apariencia profesional**: Iconos modernos y limpios

### Compatibilidad

- **Todos los navegadores**: Soporte universal
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Accesible**: Texto alternativo automático para lectores de pantalla
- **Performance**: Carga optimizada de recursos

## 📚 Recursos Adicionales

- **[📄 Markdown Personalizado](./03-custom-markdown.md)** - Contenido personalizado por secciones
- **[🎨 Temas de Sintaxis](./04-highlight-themes.md)** - Configuración avanzada de temas
- **[📋 Configuración Completa](./01-configuration.md)** - Todas las opciones de configuración