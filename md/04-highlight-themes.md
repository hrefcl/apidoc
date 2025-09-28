# 🎨 Temas de Resaltado de Código

APIDoc 4.0 introduce un sistema dinámico de temas de highlight.js que permite personalizar el resaltado de sintaxis con más de 160 temas disponibles.

## 🌟 Características del Sistema de Temas

### ✨ Funcionalidades Principales
- **🎨 160+ Temas**: Acceso a todos los temas de highlight.js
- **🌙 Compatible Dark Mode**: Todos los temas funcionan en modo claro y oscuro
- **⚡ Carga Dinámica**: Solo carga CSS adicional cuando es necesario
- **🔧 Configuración Simple**: Solo agregar campo `highlightTheme` en `apidoc.json`
- **📦 NPM Ready**: Funciona perfectamente con distribución NPM
- **🔄 Cambio en Runtime**: Los temas se pueden cambiar dinámicamente

## 🚀 Configuración Rápida

Agrega el campo `highlightTheme` a tu `apidoc.json`:

```json
{
  "name": "Mi Documentación API",
  "version": "1.0.0",
  "description": "Documentación con resaltado personalizado",
  "highlightTheme": "tokyo-night-dark",
  "title": "Mi API"
}
```

## 🎯 Temas Populares

### Temas Oscuros (perfectos para modo oscuro)
```json
{"highlightTheme": "tokyo-night-dark"}    // Tema oscuro moderno (predeterminado)
{"highlightTheme": "github-dark"}         // Tema oscuro de GitHub
{"highlightTheme": "monokai"}            // Clásico Monokai
{"highlightTheme": "dracula"}            // Popular tema Dracula
{"highlightTheme": "androidstudio"}      // Tema Android Studio
{"highlightTheme": "vs2015"}             // Visual Studio 2015
{"highlightTheme": "tomorrow-night"}     // Tomorrow Night
{"highlightTheme": "gruvbox-dark"}       // Gruvbox oscuro
```

### Temas Claros (perfectos para modo claro)
```json
{"highlightTheme": "github"}             // Tema claro de GitHub
{"highlightTheme": "vs"}                 // Visual Studio claro
{"highlightTheme": "atom-one-light"}     // Atom One Light
{"highlightTheme": "xcode"}              // Tema Xcode
{"highlightTheme": "tomorrow"}           // Tomorrow claro
{"highlightTheme": "foundation"}         // Foundation
{"highlightTheme": "lightfair"}          // Light Fair
```

### Temas Coloridos
```json
{"highlightTheme": "rainbow"}            // Arcoíris colorido
{"highlightTheme": "magula"}             // Magula vibrante
{"highlightTheme": "sunburst"}           // Sunburst brillante
{"highlightTheme": "hybrid"}             // Hybrid colorido
```

## 🛠️ Uso Avanzado

### Cambio Dinámico de Temas
```javascript
// Cambiar tema dinámicamente (función disponible globalmente)
window.loadHighlightTheme('dracula');
window.loadHighlightTheme('github-dark');
window.loadHighlightTheme('monokai');
```

### Lista Completa de Temas Disponibles (160+)

#### Familia GitHub
- `github`, `github-dark`, `github-dark-dimmed`

#### Populares
- `monokai`, `dracula`, `tomorrow-night`, `solarized-dark`, `solarized-light`

#### Modernos
- `tokyo-night-dark`, `tokyo-night-light`, `nord`, `gruvbox-dark`, `gruvbox-light`

#### Clásicos IDE
- `vs`, `vs2015`, `androidstudio`, `xcode`, `idea`, `intellij-light`

#### Minimalistas
- `default`, `lightfair`, `far`, `foundation`, `ascetic`

#### Vintage
- `brown-paper`, `school-book`, `old-school`, `pojoaque`

#### Coloridos
- `rainbow`, `magula`, `sunburst`, `hybrid`, `kimbie-dark`, `kimbie-light`

#### Y muchos más...
- `arta`, `codepen-embed`, `color-brewer`, `dark`, `darkula`, `docco`
- `far`, `felipec`, `foundation`, `github-gist`, `gml`, `googlecode`
- `gradient-dark`, `grayscale`, `hopscotch`, `ir-black`, `isbl-editor-dark`
- `isbl-editor-light`, `kimbie-dark`, `kimbie-light`, `lightfair`, `lioshi`
- `magula`, `mono-blue`, `monokai-sublime`, `night-owl`, `nnfx-dark`
- `nnfx-light`, `nord`, `obsidian`, `ocean`, `paraiso-dark`, `paraiso-light`
- `purebasic`, `qtcreator-dark`, `qtcreator-light`, `railscasts`, `rainbow`
- `routeros`, `shades-of-purple`, `srcery`, `stackoverflow-dark`
- `stackoverflow-light`, `sunburst`, `tokyo-night-dark`, `tokyo-night-light`
- `tomorrow`, `tomorrow-night-blue`, `tomorrow-night-bright`
- `tomorrow-night-eighties`, `a11y-dark`, `a11y-light`, `agate`, `an-old-hope`
- `atom-one-dark`, `atom-one-dark-reasonable`, `atom-one-light`, `base16`
- `brown-paper`, `codepen-embed`, `color-brewer`, `darkula`, `default`

## 🔧 Funcionamiento Técnico

### Arquitectura del Sistema
1. **Tema Predeterminado**: `tokyo-night-dark` incluido en el CSS principal (391KB)
2. **Carga Dinámica**: Cuando se especifica un tema diferente, se carga desde `assets/highlight-themes/`
3. **Cache Inteligente**: Los temas se copian durante el proceso de construcción para distribución NPM óptima
4. **Compatibilidad CSS**: Todos los conflictos de CSS en modo oscuro han sido resueltos usando selectores avanzados
5. **Fallback**: Degradación elegante al tema predeterminado si falla la carga

### Proceso de Construcción
```bash
# Los temas se procesan automáticamente durante la construcción
npm run build

# Para desarrollo local
npm run build:example
```

## 💡 Migración desde v3.x

Si estabas usando un tema personalizado de highlight.js en v3.x:
1. Elimina cualquier importación CSS personalizada
2. Agrega `"highlightTheme": "nombre-del-tema"` a `apidoc.json`
3. Reconstruye tu documentación

El nuevo sistema es más eficiente y maneja automáticamente los conflictos de temas.

## 🐛 Solución de Problemas

### ¿El tema no se carga?
- Asegúrate de que el nombre del tema coincida exactamente (sensible a mayúsculas)
- Revisa la consola del navegador para errores de carga
- Verifica que el tema existe en el directorio `assets/highlight-themes/`

### ¿Los colores no se muestran en modo oscuro?
- Esto era un problema conocido en versiones tempranas de v4.0, ahora completamente solucionado
- Todos los 160+ temas funcionan perfectamente en ambos modos claro y oscuro

### Rendimiento
- El tema predeterminado está incluido en el bundle principal (no requiere carga adicional)
- Los temas personalizados se cargan solo cuando son necesarios
- Cache del navegador optimizado para temas frecuentemente utilizados

## 🎨 Recomendaciones por Uso

### Para Documentación Corporativa
- **Claro**: `github`, `vs`, `atom-one-light`
- **Oscuro**: `github-dark`, `vs2015`, `tokyo-night-dark`

### Para Proyectos Open Source
- **Claro**: `github`, `default`, `foundation`
- **Oscuro**: `github-dark`, `monokai`, `dracula`

### Para Tutoriales y Educación
- **Claro**: `xcode`, `atom-one-light`, `foundation`
- **Oscuro**: `tomorrow-night`, `nord`, `gruvbox-dark`

### Para Proyectos Creativos
- **Cualquiera**: `rainbow`, `sunburst`, `magula`, `hybrid`

## 📊 Estadísticas de Temas

- **Total de temas**: 160+
- **Temas oscuros**: ~80
- **Temas claros**: ~80
- **Tamaño promedio por tema**: ~3-8KB
- **Tema más popular**: `github-dark`
- **Tema más ligero**: `default` (~2KB)
- **Tema más completo**: `tokyo-night-dark` (~8KB)

---

El sistema de temas de APIDoc 4.0 te permite crear documentación visualmente atractiva con el resaltado de código perfecto para tu marca y audiencia. ¡Experimenta con diferentes temas para encontrar el que mejor se adapte a tu proyecto!