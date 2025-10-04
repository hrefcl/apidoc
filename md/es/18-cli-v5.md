# CLI v5 - Interfaz de Línea de Comandos Moderna

> **Nuevo en APIDoc v5.0**: CLI completamente renovada con subcomandos, menú interactivo y experiencia de usuario moderna.

## 📋 Tabla de Contenidos

- [Características Principales](#características-principales)
- [Instalación](#instalación)
- [Comandos Disponibles](#comandos-disponibles)
- [Menú Interactivo](#menú-interactivo)
- [Modo Silencioso vs Verbose](#modo-silencioso-vs-verbose)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Migración desde v4](#migración-desde-v4)

---

## 🎯 Características Principales

### ✨ Nuevo en v5

- **🎨 Banner ASCII con Logo**: Muestra el logo APIDOC y número de versión
- **📱 Menú Interactivo**: Navegación intuitiva con @clack/prompts
- **🔇 Modo Silencioso**: Solo muestra warnings por defecto
- **📊 Modo Verbose**: Estadísticas detalladas con flag `-v`
- **⚡ Subcomandos Modernos**: `init`, `generate`, `export`
- **🎨 Colores y Formato**: Output colorizado con picocolors
- **⏱️ Spinner Elegante**: Indicador de progreso durante generación
- **🔄 Watch Mode**: Regeneración automática al detectar cambios

---

## 📦 Instalación

### Global (Recomendado)

```bash
npm install -g @hrefcl/apidoc
```

### Local (Por Proyecto)

```bash
npm install --save-dev @hrefcl/apidoc
```

### Verificar Instalación

```bash
apidoc --version
# Output: 5.0.0-alpha.1
```

---

## 🚀 Comandos Disponibles

### 1. `apidoc` - Menú Interactivo

Ejecuta el menú interactivo principal:

```bash
apidoc
```

**Output:**
```
     █████╗ ██████╗ ██╗██████╗  ██████╗  ██████╗
    ██╔══██╗██╔══██╗██║██╔══██╗██╔═══██╗██╔════╝
    ███████║██████╔╝██║██║  ██║██║   ██║██║
    ██╔══██║██╔═══╝ ██║██║  ██║██║   ██║██║
    ██║  ██║██║     ██║██████╔╝╚██████╔╝╚██████╗
    ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝  ╚═════╝

            v5.0.0-alpha.1 • https://apidoc.app

┌  What do you want to do?
│
│  ◯ Initialize new project
│  ◯ Generate documentation
│  ◯ Export documentation
│  ◯ Learn about APIDoc
│
└
```

### 2. `apidoc init` - Inicializar Proyecto

Setup interactivo del proyecto con asistente paso a paso:

```bash
apidoc init
```

**Características:**
- ✅ Detecta automáticamente `package.json`
- ✅ Configura `apidoc.json` interactivamente
- ✅ Sugiere directorios de entrada
- ✅ Configura template (v4 legacy o v5 moderno)

**Opciones:**
```bash
apidoc init --no-interactive  # Setup sin prompts (próximamente)
```

### 3. `apidoc generate` - Generar Documentación

Genera la documentación HTML desde tu código:

```bash
apidoc generate [opciones]
```

**Opciones:**

| Opción | Descripción | Default |
|--------|-------------|---------|
| `-c, --config <file>` | Archivo de configuración | `apidoc.json` |
| `-i, --input <dirs...>` | Directorios de entrada | `[process.cwd()]` |
| `-o, --output <dir>` | Directorio de salida | `doc` |
| `-w, --watch` | Modo watch (regeneración automática) | `false` |
| `-v, --verbose` | Salida detallada con estadísticas | `false` |
| `-d, --debug` | Modo debug | `false` |
| `--filter-version <version>` | Filtrar solo una versión específica (e.g., 2.0.0) | - |

**Ejemplos:**

```bash
# Básico
apidoc generate

# Con configuración
apidoc generate --config ./config/apidoc.json

# Especificar directorios
apidoc generate -i src/ -o docs/

# Modo watch para desarrollo
apidoc generate --watch

# Modo verbose (estadísticas detalladas)
apidoc generate -v

# Combinado
apidoc generate -i src/ -o docs/ --watch -v

# Generar solo versión 2.0.0
apidoc generate --filter-version 2.0.0 -o docs/v2

# Generar versión específica con verbose
apidoc generate --filter-version 1.5.0 -o docs/v1.5 -v
```

### 4. `apidoc export` - Exportar Documentación

Exporta la documentación a diferentes formatos:

```bash
apidoc export <formato> [opciones]
```

**Formatos disponibles:**

#### JSON
```bash
apidoc export json -o api-docs.json
```

#### OpenAPI/Swagger
```bash
# YAML (recomendado)
apidoc export openapi -o swagger.yaml

# JSON
apidoc export openapi -o swagger.json
```

#### Markdown
```bash
apidoc export markdown -o API.md
```

**Opciones:**
```bash
-c, --config <file>             # Configuración (default: apidoc.json)
-o, --output <file>             # Archivo de salida
--filter-version <version>      # Exportar solo una versión específica
```

**Ejemplos con filtrado de versión:**

```bash
# Exportar solo versión 2.0.0 a OpenAPI
apidoc export openapi --filter-version 2.0.0 -o swagger-v2.yaml

# Exportar versión 1.5.0 a JSON
apidoc export json --filter-version 1.5.0 -o api-v1.5.json

# Exportar versión específica a Markdown
apidoc export markdown --filter-version 2.0.0 -o API-v2.md
```

---

## 🎨 Menú Interactivo

El menú interactivo (`apidoc` sin argumentos) ofrece:

### Opciones del Menú

1. **Initialize new project**
   - Setup paso a paso de `apidoc.json`
   - Detecta información del proyecto
   - Configura inputs/outputs

2. **Generate documentation**
   - Genera docs desde el menú
   - Modo watch opcional
   - Muestra estadísticas

3. **Export documentation**
   - Exporta a JSON/OpenAPI/Markdown
   - Desde el menú interactivo

4. **Learn about APIDoc**
   - Enlaces a documentación
   - Ejemplos
   - GitHub

### Navegación

- **↑/↓**: Navegar opciones
- **Enter**: Seleccionar
- **Ctrl+C**: Salir

---

## 🔇 Modo Silencioso vs Verbose

### Modo Silencioso (Default)

Por defecto, APIDoc v5 solo muestra:

- ✅ Banner con logo y versión
- ✅ Spinner de progreso
- ⚠️ Warnings importantes
- ❌ Errores críticos
- ✅ Mensaje de éxito/fallo

**Ejemplo:**
```bash
apidoc generate
```

**Output:**
```
     █████╗ ██████╗ ██╗██████╗  ██████╗  ██████╗
    ██╔══██╗██╔══██╗██║██╔══██╗██╔═══██╗██╔════╝
    ███████║██████╔╝██║██║  ██║██║   ██║██║
    ██╔══██║██╔═══╝ ██║██║  ██║██║   ██║██║
    ██║  ██║██║     ██║██████╔╝╚██████╔╝╚██████╗
    ╚═╝  ╚═╝╚═╝     ╚═╝╚═════╝  ╚═════╝  ╚═════╝

            v5.0.0-alpha.1 • https://apidoc.app

◒  Generating documentation...
warn: @apiParam 'id' was defined but does not appear in URL...

✅ Documentation generated successfully

🎉 Done! Documentation ready at ./doc
💡 Tip: Use npx serve ./doc to preview
```

### Modo Verbose

Con el flag `-v` o `--verbose`, obtienes estadísticas detalladas:

```bash
apidoc generate -v
```

**Output adicional:**
```
📊 Statistics:
• Build time: 2.34s
• Output: ./doc
• API endpoints: 42
• Project: My API v1.2.0
```

### Modo Debug

Para troubleshooting avanzado:

```bash
apidoc generate -d
```

---

## 💡 Ejemplos de Uso

### Desarrollo Rápido

```bash
# 1. Inicializar proyecto
apidoc init

# 2. Modo watch para desarrollo
apidoc generate --watch

# 3. Preview en navegador
npx serve doc
```

### Producción

```bash
# Generación limpia
apidoc generate -i src/ -o public/docs/

# Con verbose para CI/CD
apidoc generate -i src/ -o docs/ -v
```

### Exportación Multi-Formato

```bash
# Exportar todo
apidoc export json -o api.json
apidoc export openapi -o swagger.yaml
apidoc export markdown -o API.md
```

### Scripts NPM

Agrega a tu `package.json`:

```json
{
  "scripts": {
    "docs": "apidoc generate",
    "docs:watch": "apidoc generate --watch",
    "docs:verbose": "apidoc generate -v",
    "docs:export": "apidoc export openapi -o swagger.yaml"
  }
}
```

Luego:
```bash
npm run docs
npm run docs:watch
npm run docs:export
```

---

## 🔄 Migración desde v4

### Cambios de Sintaxis

| v4 (Obsoleto ❌) | v5 (Actual ✅) |
|------------------|----------------|
| `apidoc -i src/ -o doc/` | `apidoc generate -i src/ -o doc/` |
| `apidoc -i src/ -o doc/ -v` | `apidoc generate -i src/ -o doc/ -v` |
| `apidoc --filter-version 2.0.0` | `apidoc generate --filter-version 2.0.0` |
| No disponible | `apidoc` (menú interactivo) |
| No disponible | `apidoc init` |
| No disponible | `apidoc export <formato>` |
| No disponible | `apidoc generate --watch` |

### Script de Migración

Actualiza tus scripts automáticamente:

**Antes (v4):**
```json
{
  "scripts": {
    "docs": "apidoc -i src/ -o docs/",
    "docs:watch": "nodemon --exec 'apidoc -i src/ -o docs/'",
    "docs:verbose": "apidoc -i src/ -o docs/ -v"
  }
}
```

**Después (v5):**
```json
{
  "scripts": {
    "docs": "apidoc generate -i src/ -o docs/",
    "docs:watch": "apidoc generate -i src/ -o docs/ --watch",
    "docs:verbose": "apidoc generate -i src/ -o docs/ -v",
    "docs:export": "apidoc export openapi -o swagger.yaml"
  }
}
```

### Retrocompatibilidad

APIDoc v5 mantiene retrocompatibilidad parcial:

- ⚠️ La sintaxis antigua `apidoc -i -o` está **deprecada**
- ✅ Seguirá funcionando en v5.0.x con warning
- ❌ Se eliminará en v6.0.0
- 💡 **Recomendación**: Migra a subcomandos ahora

---

## 🎯 Mejores Prácticas

### 1. Usa Watch Mode en Desarrollo

```bash
apidoc generate --watch
```

- ✅ Regeneración automática
- ✅ Ahorra tiempo
- ✅ Feedback inmediato

### 2. Modo Verbose en CI/CD

```bash
apidoc generate -v
```

- ✅ Estadísticas en logs
- ✅ Debug más fácil
- ✅ Trazabilidad

### 3. Exporta para Integraciones

```bash
# Swagger UI
apidoc export openapi -o swagger.yaml

# Postman
apidoc export json -o collection.json
```

### 4. Scripts Organizados

```json
{
  "scripts": {
    "docs:dev": "apidoc generate --watch",
    "docs:build": "apidoc generate -v",
    "docs:export:all": "npm run docs:export:openapi && npm run docs:export:json",
    "docs:export:openapi": "apidoc export openapi -o swagger.yaml",
    "docs:export:json": "apidoc export json -o api.json"
  }
}
```

---

## 🐛 Troubleshooting

### No se ve el banner

**Problema**: El banner no aparece.

**Solución**: El banner solo se muestra en modo TTY. En CI/CD se omite automáticamente.

### Warnings excesivos

**Problema**: Demasiados warnings.

**Solución**: El modo silencioso solo muestra warnings importantes. Si quieres ocultarlos todos:
```bash
apidoc generate 2>/dev/null  # Unix/Mac
```

### Watch mode no funciona

**Problema**: `--watch` no detecta cambios.

**Solución**: Verifica que nodemon esté instalado:
```bash
npm install nodemon --save-dev
```

---

## 📚 Recursos

- [Documentación Completa](../00-index.md)
- [Configuración apidoc.json](./01-configuration.md)
- [Build Tools Integration](./17-build-tools.md)
- [GitHub](https://github.com/hrefcl/apidoc)
- [Website](https://apidoc.app)

---

**Versión del Documento**: 1.0.0
**Última Actualización**: 2025-10-03
**APIDoc Versión**: 5.0.0-alpha.1
