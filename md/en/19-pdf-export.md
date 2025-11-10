# 📄 PDF Export

## 🎯 Overview

APIDoc v5 includes a **100% client-side** PDF generator that allows you to download all documentation as a professional PDF file, without the need for a backend or external services.

## ✨ Key Features

- ✅ **Client-Side Generation**: Everything is processed in the browser using jsPDF and html2canvas
- ✅ **Custom Cover Page**: Includes logo, title, version, and generation date
- ✅ **Interactive Index**: Complete section navigation
- ✅ **Preserves Styles**: Maintains colors, syntax highlighting, and design
- ✅ **Real-Time Progress**: Modal with progress bar and current status
- ✅ **Multi-language**: Supports all available template languages
- ✅ **Configurable**: Options for page size, orientation, quality, and more

## 🚀 Basic Usage

### From the Interface

1. Open your generated documentation in the browser
2. Find the **📥** button in the header (next to the language selector)
3. Click the PDF button
4. Wait for generation (you'll see a modal with progress)
5. The PDF will download automatically

### Generated PDF Structure

```
📄 api-documentation-v1.0.0.pdf
├── 📑 Cover Page
│   ├── APIDoc Logo
│   ├── Project Title
│   ├── Description
│   ├── Version
│   └── Generation Date
│
├── 📋 Index
│   ├── Section 1
│   │   ├── Endpoint 1
│   │   ├── Endpoint 2
│   │   └── ...
│   ├── Section 2
│   └── ...
│
├── 📚 Content
│   ├── Users API
│   │   ├── GET /users
│   │   ├── POST /users
│   │   └── ...
│   ├── Company API
│   └── ...
│
└── 📄 Footer (page numbering)
```

## ⚙️ Configuration

### In `apidoc.json`

Add the `pdf` section to your configuration file:

```json
{
  "name": "My API",
  "version": "1.0.0",
  "description": "Example API",

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

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable/disable export button |
| `pageSize` | `"A4"` \| `"Letter"` | `"A4"` | PDF page size |
| `orientation` | `"portrait"` \| `"landscape"` | `"portrait"` | Document orientation |
| `includeIndex` | `boolean` | `true` | Include index at the beginning |
| `includeCover` | `boolean` | `true` | Include professional cover page |
| `logo` | `boolean` | `true` | Show logo on cover |
| `quality` | `number` | `2` | Capture quality (1-3, higher = better quality but heavier) |
| `fileName` | `string` | `"api-documentation.pdf"` | Downloaded file name |

## 🎨 Advanced Customization

### Modifying Cover Page Styles

The `pdf-generator.ts` service allows you to fully customize the cover:

```typescript
// In apps/apidoc-template-v5/src/utils/pdf-generator.ts

private async generateCover(docData: any): Promise<void> {
  // Customize gradient colors
  this.pdf.setFillColor(59, 130, 246) // Blue
  this.pdf.setFillColor(147, 51, 234) // Purple

  // Customize sizes and positions
  const logoSize = 30
  const logoX = (pageWidth - logoSize) / 2

  // ... more customizations
}
```

### Quality vs File Size

The `quality` option controls the html2canvas scale factor:

- **`quality: 1`**: Fast, small files (~2MB), good quality
- **`quality: 2`**: Perfect balance (~4MB), excellent quality ✅ Recommended
- **`quality: 3`**: Best quality (~8MB), slower, ideal for printing

## 📊 Generation Progress

The modal shows real-time progress:

```
┌──────────────────────────────────┐
│  Generating PDF                  │
│  ━━━━━━━━━━━━━━━━━━━━ 75%       │
│  Processing section: Users       │
│  3 / 4 sections completed        │
└──────────────────────────────────┘
```

### Process Stages

1. **Preparing** (0%): Generator initialization
2. **Cover** (10%): Cover page generation with logo
3. **Index** (20%): Table of contents creation
4. **Content** (30-90%): Processing each section
5. **Finalizing** (95%): Page numbering and metadata
6. **Done** (100%): Automatic download

## 🔧 Technologies Used

### jsPDF

Library for generating PDFs in the browser:

```typescript
import jsPDF from 'jspdf'

const pdf = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'A4'
})
```

### html2canvas

HTML element capture as images:

```typescript
import html2canvas from 'html2canvas'

const canvas = await html2canvas(element, {
  scale: 2,
  useCORS: true,
  backgroundColor: '#ffffff'
})
```

## 🌍 Multi-language Support

The PDF is generated using the **currently selected language** in the interface:

```typescript
// Translations are obtained automatically
{
  "pdf": {
    "exportToPdf": "Export to PDF",  // EN
    "generating": "Generating PDF",
    "completed": "PDF Generated"
  }
}
```

To change the PDF language:
1. Change the language in the header language selector
2. Generate the PDF (it will use the selected language)

## 🎯 Use Cases

### Client Documentation

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

### Print Documentation

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

### Compact Documentation

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

### PDF is blank

**Solution**: Make sure sections have the `data-section` attribute:

```vue
<div class="section-content" :data-section="sectionId">
  <!-- Content here -->
</div>
```

### PDF is too large

**Solution**: Reduce quality in configuration:

```json
{
  "pdf": {
    "quality": 1  // Change from 2 to 1
  }
}
```

### Missing styles in PDF

**Solution**: html2canvas needs styles to be fully loaded. If you use external fonts, make sure they're available.

### CORS error on images

**Solution**: External images must have CORS enabled. Use local images or with `crossorigin="anonymous"`.

## 📚 Examples

### Complete Example

```json
{
  "name": "Users API",
  "version": "2.0.0",
  "description": "Complete API for user and company management",
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

### Disabling PDF

```json
{
  "pdf": {
    "enabled": false
  }
}
```

The button won't appear in the header if `enabled` is `false`.

## 🔜 Roadmap

Features planned for future versions:

- [ ] Clickable table of contents with internal links
- [ ] Custom watermarks
- [ ] Custom headers and footers
- [ ] Support for multiple color themes
- [ ] Individual section export
- [ ] Automatic image compression
- [ ] Batch mode (generate PDFs of multiple versions)

## 📖 References

- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [html2canvas Documentation](https://html2canvas.hertzen.com/)
- [APIDoc Configuration Guide](./01-configuration.md)
- [Template Customization](./02-customization.md)

---

**💡 Tip**: For best results, generate the PDF after all documentation is fully loaded in the browser.
