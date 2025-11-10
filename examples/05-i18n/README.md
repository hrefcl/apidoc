# Internationalization (i18n) Example

## Overview

This example demonstrates APIDoc v5's internationalization system, showing how to create multi-language API documentation with automatic language detection and a language selector in the UI.

## Parser Used

**Parser**: `api` (Standard API Parser) + i18n Configuration

This example uses the standard API parser combined with i18n configuration in `apidoc.json` to enable multi-language support.

## How it Works

The i18n system provides:

### i18n Features

- **Multiple Languages**: Support for any number of languages
- **Language Selector**: UI dropdown to switch languages
- **Fallback System**: Falls back to default language if translation missing
- **Auto-detection**: Detects browser language preference
- **Per-Endpoint Translations**: Each endpoint can have translations
- **Metadata Translation**: Project info, headers, footers translated

### Configuration Format

```json
{
  "i18n": {
    "enabled": true,
    "defaultLang": "en",
    "availableLangs": ["es", "en", "zh"],
    "showLanguageSelector": true,
    "fallbackToDefault": true
  }
}
```

## Configuration (apidoc.json)

```json
{
  "name": "i18n Test API",
  "version": "1.0.0",
  "title": "i18n Test",
  "url": "https://api.example.com",
  "inputs": {
    "docs": ["/"],
    "all": ["src"]
  },
  "i18n": {
    "enabled": true,
    "defaultLang": "en",
    "availableLangs": ["es", "en", "zh"],
    "showLanguageSelector": true,
    "fallbackToDefault": true
  }
}
```

### Inputs Configuration

- `"docs": ["/"]` - Includes this README.md
- `"all": ["src"]` - Processes all API endpoints

## Testing

Generate documentation:

```bash
apidoc generate -i src -o doc
```

Preview with language selector:

```bash
npx serve doc
# Open http://localhost:3000
# Use language dropdown to switch between ES, EN, ZH
```

## What You'll Learn

1. Enabling i18n in APIDoc
2. Configuring multiple languages
3. Using the language selector
4. Fallback language system
5. Browser language detection
6. Per-endpoint translations

## Related Examples

- **01-basic-api**: For basic API documentation
- **10-markdown**: For documentation files
