# 📄 Exportación a PDF

## 🎯 Descripción General

APIDoc v5 incluye un generador de PDF **100% del lado del cliente** que permite descargar toda la documentación en un archivo PDF profesional, sin necesidad de backend o servicios externos.

## ✨ Características Principales

- ✅ **Generación Client-Side**: Todo se procesa en el navegador usando jsPDF y html2canvas
- ✅ **Portada Personalizada**: Incluye logo, título, versión y fecha de generación
- ✅ **Índice Interactivo**: Navegación completa por secciones
- ✅ **Preserva Estilos**: Mantiene colores, código syntax highlighting y diseño
- ✅ **Progreso en Tiempo Real**: Modal con barra de progreso y estado actual
- ✅ **Multi-idioma**: Soporta todos los idiomas disponibles en el template
- ✅ **Configurable**: Opciones de tamaño de página, orientación, calidad y más

## 🚀 Uso Básico

### Desde la Interfaz

1. Abre tu documentación generada en el navegador
2. Busca el botón **📥** en el header (junto al selector de idioma)
3. Haz clic en el botón de PDF
4. Espera a que se genere (verás un modal con el progreso)
5. El PDF se descargará automáticamente

### Estructura del PDF Generado

```
📄 api-documentation-v1.0.0.pdf
├── 📑 Portada
│   ├── Logo APIDoc
│   ├── Título del proyecto
│   ├── Descripción
│   ├── Versión
│   └── Fecha de generación
│
├── 📋 Índice
│   ├── Sección 1
│   │   ├── Endpoint 1
│   │   ├── Endpoint 2
│   │   └── ...
│   ├── Sección 2
│   └── ...
│
├── 📚 Contenido
│   ├── Users API
│   │   ├── GET /users
│   │   ├── POST /users
│   │   └── ...
│   ├── Company API
│   └── ...
│
└── 📄 Footer (numeración de páginas)
```

## ⚙️ Configuración

### En `apidoc.json`

Agrega la sección `pdf` a tu archivo de configuración:

```json
{
  "name": "Mi API",
  "version": "1.0.0",
  "description": "API de ejemplo",

  "pdf": {
    "enabled": true,
    "pageSize": "A4",
    "orientation": "portrait",
    "includeIndex": true,
    "includeCover": true,
    "logo": true,
    "quality": 2,
    "fileName": "api-documentation.pdf"
  }
}
```

### Opciones de Configuración

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Habilita/deshabilita el botón de exportación |
| `pageSize` | `"A4"` \| `"Letter"` | `"A4"` | Tamaño de página del PDF |
| `orientation` | `"portrait"` \| `"landscape"` | `"portrait"` | Orientación del documento |
| `includeIndex` | `boolean` | `true` | Incluir índice al inicio |
| `includeCover` | `boolean` | `true` | Incluir portada profesional |
| `logo` | `boolean` | `true` | Mostrar logo en la portada |
| `quality` | `number` | `2` | Calidad de captura (1-3, mayor = mejor calidad pero más pesado) |
| `fileName` | `string` | `"api-documentation.pdf"` | Nombre del archivo descargado |

## 🎨 Personalización Avanzada

### Modificar Estilos de la Portada

El servicio `pdf-generator.ts` permite personalizar completamente la portada:

```typescript
// En apps/apidoc-template-v5/src/utils/pdf-generator.ts

private async generateCover(docData: any): Promise<void> {
  // Personaliza colores del gradiente
  this.pdf.setFillColor(59, 130, 246) // Azul
  this.pdf.setFillColor(147, 51, 234) // Púrpura

  // Personaliza tamaños y posiciones
  const logoSize = 30
  const logoX = (pageWidth - logoSize) / 2

  // ... más personalizaciones
}
```

### Calidad vs Tamaño de Archivo

La opción `quality` controla el factor de escala de html2canvas:

- **`quality: 1`**: Rápido, archivos pequeños (~2MB), buena calidad
- **`quality: 2`**: Balance perfecto (~4MB), excelente calidad ✅ Recomendado
- **`quality: 3`**: Mejor calidad (~8MB), más lento, ideal para impresión

## 📊 Progreso de Generación

El modal muestra el progreso en tiempo real:

```
┌──────────────────────────────────┐
│  Generando PDF                   │
│  ━━━━━━━━━━━━━━━━━━━━ 75%       │
│  Procesando sección: Users       │
│  3 / 4 secciones completadas     │
└──────────────────────────────────┘
```

### Etapas del Proceso

1. **Preparing** (0%): Inicialización del generador
2. **Cover** (10%): Generación de portada con logo
3. **Index** (20%): Creación del índice de contenidos
4. **Content** (30-90%): Procesamiento de cada sección
5. **Finalizing** (95%): Numeración de páginas y metadatos
6. **Done** (100%): Descarga automática

## 🔧 Tecnologías Utilizadas

### jsPDF

Librería para generar PDFs en el navegador:

```typescript
import jsPDF from 'jspdf'

const pdf = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'A4'
})
```

### html2canvas

Captura de elementos HTML como imágenes:

```typescript
import html2canvas from 'html2canvas'

const canvas = await html2canvas(element, {
  scale: 2,
  useCORS: true,
  backgroundColor: '#ffffff'
})
```

## 🌍 Soporte Multi-idioma

El PDF se genera usando el idioma **actualmente seleccionado** en la interfaz:

```typescript
// Las traducciones se obtienen automáticamente
{
  "pdf": {
    "exportToPdf": "Exportar a PDF",  // ES
    "generating": "Generando PDF",
    "completed": "PDF Generado"
  }
}
```

Para cambiar el idioma del PDF:
1. Cambia el idioma en el selector de idioma del header
2. Genera el PDF (usará el idioma seleccionado)

## 🎯 Casos de Uso

### Documentación para Clientes

```json
{
  "pdf": {
    "enabled": true,
    "pageSize": "A4",
    "orientation": "portrait",
    "quality": 2,
    "fileName": "client-api-docs-v2.0.0.pdf"
  }
}
```

### Documentación para Impresión

```json
{
  "pdf": {
    "enabled": true,
    "pageSize": "Letter",
    "orientation": "portrait",
    "quality": 3,
    "fileName": "api-reference-print.pdf"
  }
}
```

### Documentación Compacta

```json
{
  "pdf": {
    "enabled": true,
    "includeCover": false,
    "includeIndex": false,
    "quality": 1,
    "fileName": "quick-reference.pdf"
  }
}
```

## 🐛 Troubleshooting

### El PDF está en blanco

**Solución**: Asegúrate de que las secciones tengan el atributo `data-section`:

```vue
<div class="section-content" :data-section="sectionId">
  <!-- Contenido aquí -->
</div>
```

### El PDF es muy grande

**Solución**: Reduce la calidad en la configuración:

```json
{
  "pdf": {
    "quality": 1  // Cambiar de 2 a 1
  }
}
```

### Faltan estilos en el PDF

**Solución**: html2canvas necesita que los estilos estén completamente cargados. Si usas fuentes externas, asegúrate de que estén disponibles.

### Error de CORS en imágenes

**Solución**: Las imágenes externas deben tener CORS habilitado. Usa imágenes locales o con `crossorigin="anonymous"`.

## 📚 Ejemplos

### Ejemplo Completo

```json
{
  "name": "Users API",
  "version": "2.0.0",
  "description": "API completa para gestión de usuarios y empresas",
  "url": "https://api.example.com",

  "pdf": {
    "enabled": true,
    "pageSize": "A4",
    "orientation": "portrait",
    "includeIndex": true,
    "includeCover": true,
    "logo": true,
    "quality": 2,
    "fileName": "users-api-v2.0.0.pdf"
  }
}
```

### Deshabilitando PDF

```json
{
  "pdf": {
    "enabled": false
  }
}
```

El botón no aparecerá en el header si `enabled` es `false`.

## 🔜 Roadmap

Funcionalidades planeadas para futuras versiones:

- [ ] Tablas de contenido clickeables con enlaces internos
- [ ] Watermarks personalizados
- [ ] Headers y footers personalizados
- [ ] Soporte para múltiples temas de color
- [ ] Exportación de secciones individuales
- [ ] Compresión de imágenes automática
- [ ] Modo batch (generar PDFs de múltiples versiones)

## 📖 Referencias

- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [html2canvas Documentation](https://html2canvas.hertzen.com/)
- [APIDoc Configuration Guide](./01-configuration.md)
- [Template Customization](./02-customization.md)

---

**💡 Tip**: Para obtener el mejor resultado, genera el PDF después de que toda la documentación esté completamente cargada en el navegador.
