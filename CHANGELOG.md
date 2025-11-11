# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.0.8] - 2025-11-10

### 🐛 Critical Bug Fixes

#### VersionSelector Now Shows for Single Version + Multiple Languages
- **Fixed**: VersionSelector component wasn't appearing when endpoints had a single version (`@apiVersion`) with multiple languages (`@apiLang`)
- **Root Cause**: `ApiContent.vue` only emitted `versions-ready` event when `hasMultipleVersions === true`
- **Solution**: Modified `ApiContent.vue` (lines 686-736) to check language count for single-version scenarios
- **New Behavior**:
  - Single version + Multiple languages (languageCount > 1) → Shows VersionSelector with language-only layout
  - Single version + Single language → Hides VersionSelector (emits empty array)
  - No version → Hides VersionSelector

#### Impact
- Endpoints with single `@apiVersion` and multiple `@apiLang` tags now correctly display language selector
- Fixes missing language selector for version "0.0.0" (default when no `@apiVersion` tag specified)
- Users can now switch between languages even when endpoint has only one version

### 📚 Documentation - Translation System Reference

This version includes comprehensive documentation about the `@apiLang` multi-language system that was added in v5.0.7.

> **Note**: The `@apiLang` tag and multi-language support were added in v5.0.7 but were never documented in that version's CHANGELOG. This entry provides the missing documentation explaining how the system works.

#### Multi-Language Support Architecture
APIDoc v5 includes a complete internationalization (i18n) system supporting 7 languages:
- 🇬🇧 English (en)
- 🇪🇸 Español (es)
- 🇨🇳 中文 (zh)
- 🇫🇷 Français (fr)
- 🇩🇪 Deutsch (de)
- 🇯🇵 日本語 (ja)
- 🇧🇷 Português (pt-BR)

#### How @apiLang Works (Added in v5.0.7)

The `@apiLang` tag allows you to create multi-language API documentation:

```javascript
/**
 * @api {get} /user/:id Get User
 * @apiVersion 1.0.0
 * @apiLang en
 * @apiName GetUser
 * @apiGroup Users
 * @apiDescription Get user information
 */

/**
 * @api {get} /user/:id Obtener Usuario
 * @apiVersion 1.0.0
 * @apiLang es
 * @apiName GetUser
 * @apiGroup Users
 * @apiDescription Obtener información del usuario
 */
```

**Processing Flow**:
1. **Backend**: APIDoc parser groups endpoints by version + language
2. **JSON Output**: Creates `versions[].languages[langCode]` nested structure
3. **Frontend**: VersionSelector detects multiple languages and shows language selector
4. **User Interaction**: Clicking a language filters content to show only that language's documentation

#### UI Translation System

**Translation Files** (`apps/apidoc-template-v5/src/i18n/locales/*.json`):
```json
{
  "api": {
    "versions": "Versions",
    "availableLanguages": "Available Languages",
    "method": "Method"
  }
}
```

**Usage in Vue Components**:
```vue
<template>
  <h3>{{ t('api.availableLanguages') }}</h3>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
```

**Adding New UI Translations**:
1. Add the key to ALL 7 language files
2. Use `t('section.key')` in Vue components
3. Run `yarn build:template`

**Best Practices**:
- Always add keys to all language files (consistency)
- Use hierarchical structure (`api.method`, not `apiMethod`)
- Keep keys semantic (describe content, not appearance)
- Test language switching after changes

### 📝 Complete Translation Keys Added
- `api.availableLanguages` - Added to all 7 locale files with proper translations

## [5.0.7] - 2025-11-10

### 🌍 Complete i18n for TypeScript Documentation (TSDoc)

#### TSDoc UI Fully Translated
- **Fixed**: All hardcoded text in TSDoc navigation and components
- **Added**: Complete i18n support for TypeScript documentation interface
- **Components Updated**:
  - `TSDocContent.vue` - All property labels, type names, and navigation tabs
  - `DocsLayout.vue` - Section titles and navigation markers
  - `stores/docs.js` - Navigation structure with i18n markers

#### Translation Keys Added
- **TSDoc Section**: Type names, plurals, and section titles
  - `tsdoc.title` - "TypeScript" (simplified from "TypeScript Documentation")
  - `tsdoc.all` - "all" / "todos" / "すべて"
  - `tsdoc.interface` / `tsdoc.interfaces` - Singular/plural forms
  - `tsdoc.function` / `tsdoc.functions` - Singular/plural forms
  - `tsdoc.class` / `tsdoc.classes` - Singular/plural forms
  - `tsdoc.type` / `tsdoc.types` - Singular/plural forms
  - `tsdoc.enum` / `tsdoc.enums` - Singular/plural forms
- **Navigation**: Section titles now translatable
  - `nav.documentation` - "Documentación" / "Documentation" / "ドキュメント"
- **Common Properties**: Already supported from v5.0.6
  - `common.optional` / `common.required` - Property labels

#### Smart Plural Handling
- **Added**: `translateType()` function with automatic singular/plural detection
- **Logic**: Counts items and selects appropriate translation key
- **Example**: "interface 1" vs "interfaces 5" automatically handled
- **Languages**: Works across all 7 supported languages

#### Marker Pattern Implementation
- **Pattern**: `__key__` markers in Pinia stores (cannot access i18n directly)
- **Translation**: Happens in Vue components with access to `useI18n()`
- **Function**: `translateTitle()` processes markers and returns translated text
- **Examples**:
  - Store: `title: '__tsdoc.title__'` → Component: "TypeScript"
  - Store: `title: '__nav.documentation__'` → Component: "Documentación"

### 🐛 Bug Fixes

- **Fixed**: TSDoc menu showed "TypeScript Docs" hardcoded in English
- **Fixed**: TSDoc tabs showed "all", "interface", "function" in English only
- **Fixed**: "optional" and "required" labels hardcoded in TSDoc property tables
- **Fixed**: Navigation section title "Documentación" was not translatable
- **Fixed**: TSDoc title was verbose "TypeScript Documentation" instead of clean "TypeScript"

### 📦 Files Modified

**Translation Files Updated**:
- `src/i18n/locales/es.json` - Added tsdoc section with Spanish translations
- `src/i18n/locales/en.json` - Added tsdoc section with English translations
- `src/i18n/locales/ja.json` - Added tsdoc section with Japanese translations

**Components Updated**:
- `src/components/TSDocContent.vue` (lines 29, 121-122, 154-155, 301-311)
  - Added `translateType()` function for smart plural handling
  - Replaced hardcoded "optional"/"required" with i18n
  - Updated tab labels to use translations
- `src/layouts/DocsLayout.vue` (lines 118, 222, 308, 316-322)
  - Added `translateTitle()` function for marker pattern
  - Updated section title rendering
- `src/stores/docs.js` (line 473, 561)
  - Changed hardcoded titles to i18n markers
  - Navigation structure now fully translatable

**Template**:
- `template/index.html` - Rebuilt with all TSDoc i18n changes (983.17 kB / gzip: 268.08 kB)

### 🎨 UI Improvements

- **Cleaner Navigation**: TSDoc section now shows just "TypeScript" instead of verbose "TypeScript Documentation"
- **Consistent UX**: All UI elements now respect user's selected language
- **Dynamic Updates**: Language changes immediately update all TSDoc interface text
- **Complete Coverage**: Zero hardcoded text remaining in TypeScript documentation

### 📚 Translation Examples

**Spanish (ES)**:
- Menu: "Documentación" | "TypeScript"
- Tabs: "todos 5" | "interfaz 1" | "funciones 4"
- Labels: "opcional" | "requerido"

**English (EN)**:
- Menu: "Documentation" | "TypeScript"
- Tabs: "all 5" | "interface 1" | "functions 4"
- Labels: "optional" | "required"

**Japanese (JA)**:
- Menu: "ドキュメント" | "TypeScript"
- Tabs: "すべて 5" | "インターフェース 1" | "関数 4"
- Labels: "任意" | "必須"

### 🔧 Technical Details

- **Pattern**: Marker-based translation for Pinia stores (`__key__`)
- **Dynamic**: Computed properties ensure reactivity on language change
- **Type-Safe**: TypeScript support for all translation keys
- **Fallback**: English as default if translation key not found
- **Performance**: No impact, translations cached by vue-i18n

## [5.0.6] - 2025-11-08

### 🌍 Complete i18n Internationalization

#### Full 7-Language Support
- **Added**: Complete internationalization (i18n) system with vue-i18n
- **Supported Languages**:
  - 🇪🇸 Spanish (Español)
  - 🇺🇸 English
  - 🇨🇳 Chinese Simplified (中文)
  - 🇧🇷 Portuguese (Português)
  - 🇫🇷 French (Français)
  - 🇩🇪 German (Deutsch)
  - 🇯🇵 Japanese (日本語)

#### Components Fully Translated
- **SearchModal.vue**: All search interface text (placeholder, messages, keyboard shortcuts)
- **DocsLayout.vue**: Navigation menu, expand/collapse buttons, GitHub tooltip
- **ApiSectionPage.vue**: Section titles, endpoints list, error messages
- **CategoryIndexPage.vue**: Category metadata and descriptions
- **HomePage.vue**: Complete homepage including statistics, quick access, all UI elements

#### Translation Coverage
- **Navigation**: Home, Documentation, API, TypeScript, Models
- **Search**: Placeholder, no results, type to search, navigate, select, result counts
- **Messages**: Error states, loading states, no content messages
- **Categories**: Documentation, API Reference, TypeScript, Models (titles & descriptions)
- **Homepage**: API statistics, endpoints by method, API groups, quick access, guides
- **API**: Endpoints, headers, parameters, responses, versions, examples
- **Common**: Loading, error, required, optional, copy, dark mode, language

#### Total Translations
- **~150 translation keys** across all 7 languages
- **Over 1,050 total translations** (150 keys × 7 languages)
- **100% coverage** of all user-facing text

### 🔍 Enhanced Search Functionality

#### Search Now Includes API Endpoints
- **Fixed**: Search modal now searches both documentation AND API endpoints
- **Enhanced**: Search results include:
  - Documentation pages (markdown files)
  - API endpoints with method + URL + title
  - Nested subgroup items
- **Improved**: Direct navigation to API endpoints from search results
- **Example**: Search "POST" to find all POST endpoints, or "users" to find user-related docs and endpoints

### 🎨 Template Improvements

- **Updated**: Template rebuilt with all i18n integrations
- **Size**: 965.46 kB (gzip: 263.51 kB)
- **Performance**: No performance impact from i18n system
- **Locale Persistence**: Selected language saved to localStorage
- **Auto-detection**: Browser language automatically detected on first visit

### 🔧 Technical Details

- **Framework**: vue-i18n v10.x with Composition API
- **Message Format**: JSON-based translation files with nested structure
- **Interpolation**: Dynamic variables with `{variable}` syntax
- **Pluralization**: Support for singular/plural forms in all languages
- **Fallback**: English as default fallback language
- **Type Safety**: Full TypeScript support for translation keys

### 📦 Files Added/Modified

**New Translation Files**:
- `src/i18n/locales/zh-CN.json` - Chinese Simplified
- `src/i18n/locales/pt-BR.json` - Brazilian Portuguese
- `src/i18n/locales/fr.json` - French
- `src/i18n/locales/de.json` - German
- `src/i18n/locales/ja.json` - Japanese

**Updated Translation Files**:
- `src/i18n/locales/es.json` - Extended with 100+ new keys
- `src/i18n/locales/en.json` - Extended with 100+ new keys

**Updated Components**:
- `src/components/SearchModal.vue` - Full i18n integration + API search
- `src/layouts/DocsLayout.vue` - Navigation and controls i18n
- `src/pages/ApiSectionPage.vue` - Section content i18n
- `src/pages/CategoryIndexPage.vue` - Category metadata i18n
- `src/pages/HomePage.vue` - Complete homepage i18n

**Template**:
- `template/index.html` - Rebuilt with all i18n changes

### 🐛 Bug Fixes

- **Fixed**: Search not finding API endpoints (only searched markdown docs)
- **Fixed**: All hardcoded Spanish text in interface
- **Fixed**: Missing translations in navigation menu
- **Fixed**: Error messages not translated
- **Fixed**: Statistics dashboard text hardcoded

### 📚 Migration Guide

No breaking changes. The template automatically detects browser language and falls back to English if the detected language is not supported.

**Supported Language Codes**:
- `es` - Spanish
- `en` - English
- `zh` - Chinese
- `pt` - Portuguese
- `fr` - French
- `de` - German
- `ja` - Japanese

Users can switch languages using the language selector in the header (flag icon).

## [5.0.5] - 2025-11-07

### ✨ New Features

#### Load JSON Examples from External Files
- **Added**: `@apiSchema {json=path/to/file.json} apiSuccessExample` - Load JSON examples from external files
- **Added**: `@apiSchema {json=path/to/file.json} apiErrorExample` - Load error examples from external files
- **Benefits**:
  - DRY principle - define examples once in JSON files
  - Easier maintenance of complex examples
  - Automatic HTTP status header generation
  - Proper JSON formatting with indentation
- **Example**:
  ```typescript
  /**
   * @api {post} /auth/token Get Access Token
   * @apiSchema {json=examples/responses/success.json} apiSuccessExample
   * @apiSchema (Error 401) {json=examples/responses/error.json} apiErrorExample
   */
  ```

#### New @apiCode Parser for Code Examples
- **Added**: `@apiCode` tag - Load code examples from external files with automatic syntax highlighting
- **Syntax**: `@apiCode (language) {file=path/to/file} Title`
- **Benefits**:
  - Keep code examples in actual runnable files
  - Automatic language detection from file extension
  - Maintains code syntax highlighting
  - Examples stay testable and up-to-date
- **Supported Languages**: JavaScript, TypeScript, Python, Java, Ruby, PHP, Go, Rust, C/C++, C#, Bash, PowerShell, cURL, JSON, XML, YAML, HTML, CSS, SQL, Kotlin, Swift, Dart, and more
- **Examples**:
  ```typescript
  /**
   * @api {post} /auth/token Get Access Token
   * @apiCode (javascript) {file=examples/code/auth.js} JavaScript Example
   * @apiCode (bash) {file=examples/code/auth.sh} cURL Example
   * @apiCode (python) {file=examples/code/auth.py} Python Example
   */
  ```

### 🔧 Technical Improvements
- **Parser Registration**: Added `apicode` parser to core parser registry
- **File Loading**: Both `@apiSchema` and `@apiCode` resolve paths relative to source file
- **Error Handling**: Graceful error handling when files are not found with clear warning messages

### 📝 Testing
- Added comprehensive test cases in `examples/test-code-loading/`
- Verified JSON file loading for examples
- Verified code file loading with multiple languages
- Zero errors on clean builds

## [5.0.4] - 2025-11-07

### 🐛 Bug Fixes

#### Graceful Parser Error Handling
- **Fixed**: Fatal parsing errors now log warnings instead of crashing documentation generation
- **Root Cause**: Malformed syntax like `{''/''} [paramName]` caused parser to throw fatal errors, stopping entire build process
- **Solution**: Modified parser error handling in `core/parser.ts` to log warning and skip problematic elements instead of throwing
- **Impact**: Documentation generation continues even when individual elements have invalid syntax
- **Files Modified**: `core/parser.ts` (lines 483-490)
- **Example Warning**:
  ```
  warn: Empty parser result for @apiParam in block 151 of file 'src/routes/building.ts'.
  Source: "@apiParam (Query) {''/''} [sortOrder] Sort order". This element will be skipped.
  ```

### 🔧 Technical Improvements
- **Robustness**: Parser now handles invalid syntax gracefully without breaking entire documentation build
- **Error Reporting**: Clear warning messages indicate which blocks have issues and what the invalid source looks like
- **Continuity**: All valid API documentation generates successfully even when some blocks contain errors

## [5.0.3] - 2025-11-07

### 🐛 Bug Fixes

#### Eliminated False Body Parameter Warnings
- **Fixed**: Removed false warning "@apiParam was defined but does not appear in URL" for `@apiParam (Body)` parameters
- **Root Cause**: URL validation was checking body parameters, but body parameters go in request body (POST/PUT), not URL path
- **Solution**: Extended validation exclusion logic in `core/parser.ts` to skip body parameters (group="Body")
- **Impact**: No more false warnings when using `@apiParam (Body)` or `@apiSchema (Body) {interface=...} apiParam`
- **Files Modified**: `core/parser.ts` (lines 852-871)

### ✨ New Features

#### Complete @apiSchema Support for All Elements
- **Enhanced**: Full verification and documentation of `@apiSchema` support for ALL APIDoc elements:
  - ✅ `@apiHeader` - Generate headers from TypeScript interfaces
  - ✅ `@apiQuery` - Generate query parameters from interfaces
  - ✅ `@apiParam` - Generate path/body parameters from interfaces (with groups like `Body`)
  - ✅ `@apiSuccess` - Generate success response fields from interfaces (with groups like `Success 200`)
  - ✅ `@apiError` - Generate error response fields from interfaces (with groups like `Error 4xx`)

- **Complete Example**:
  ```typescript
  // interfaces.ts
  export interface AuthHeaders {
    accessToken: string;
    'X-API-Version'?: string;
  }

  export interface CommunityBody {
    extCommunityUuid: string;
    name: string;
    address?: string;
  }

  export interface SuccessResponse {
    code: number;
    msg: string;
    data: any;
    time: string;
  }

  export interface ErrorResponse {
    code: number;
    msg: string;
    time: string;
  }

  // In JSDoc:
  /**
   * @api {post} /community/create Create Community
   * @apiSchema {interface=AuthHeaders} apiHeader
   * @apiSchema (Body) {interface=CommunityBody} apiParam
   * @apiSchema (Success 200) {interface=SuccessResponse} apiSuccess
   * @apiSchema (Error 4xx) {interface=ErrorResponse} apiError
   */
  ```

### 📝 Testing
- Added comprehensive test suite in `examples/test-query/complete-example.js`
- Verified all element types: Header, Query, Param (Body), Success, Error
- Created complete TypeScript interfaces in `complete-interfaces.ts`
- Zero warnings on clean builds with all element types

## [5.0.2] - 2025-11-07

### 🐛 Bug Fixes

#### Eliminated False @apiQuery Warnings
- **Fixed**: Removed false warning "@apiParam was defined but does not appear in URL" for `@apiQuery` parameters
- **Root Cause**: URL validation was checking all parameters including query strings, but query parameters don't appear in URL path (they go after `?`)
- **Solution**: Modified `core/parser.ts` to exclude `@apiQuery` parameters from URL path validation
- **Impact**: No more confusing warnings when using `@apiQuery` for query string parameters
- **Files Modified**: `core/parser.ts` (lines 846-862)

### ✨ New Features

#### @apiSchema Support for @apiQuery
- **Added**: Full support for generating `@apiQuery` parameters from TypeScript interfaces using `@apiSchema`
- **Syntax**: `@apiSchema {interface=InterfaceName} apiQuery`
- **Benefits**:
  - DRY principle - define query params once in TypeScript
  - Type safety from TypeScript compiler
  - Automatic documentation generation
  - Consistent with existing `@apiSchema` for `@apiParam` and `@apiSuccess`
- **Example**:
  ```typescript
  // interfaces.ts
  export interface PaginationQuery {
    pageNum?: number;
    pageSize?: number;
  }

  // In JSDoc:
  /**
   * @api {get} /users/list List Users
   * @apiSchema {interface=PaginationQuery} apiQuery
   */
  ```

### 📝 Testing
- Added comprehensive test cases in `examples/test-query/`
- Verified `@apiSchema` + `@apiQuery` integration
- Verified with real-world TypeScript interfaces
- Zero warnings on clean builds

## [5.0.1] - 2025-11-07

### 🐛 Bug Fixes

#### @apiQuery Parameters Not Rendering
- **Fixed**: `@apiQuery` parameters were not being rendered in the documentation template
- **Root Cause**: The `apidoc-to-apicat` adapter only processed parameters from `item.parameter.fields` but `@apiQuery` data is stored directly in `item.query` as an array
- **Solution**: Added processing for `item.query` array in the adapter to include all query parameters alongside regular parameters
- **Impact**: All `@apiQuery` parameters now render correctly in the documentation with proper typing, required/optional flags, and descriptions
- **Files Modified**: `core/adapters/apidoc-to-apicat.ts`

### 📝 Testing
- Added test case in `examples/test-query/` to verify `@apiQuery` rendering
- Verified with real-world API documentation (Thinmoo Cloud API)
- All query parameters now display correctly with group label `[Query]`

## [5.0.0] - 2025-10-04

### 🎉 STABLE RELEASE - APIDoc v5.0 with Vue 3 + apiCAT

**Major version release with complete rewrite of template system and new apiCAT architecture.**

### ✨ New Features

#### 🏗️ Complete Architecture Overhaul
- **Vue 3 Single-File Template**: Modern single-page application built with Vue 3 and Vite
- **apiCAT Plugin System**: New modular plugin architecture for documentation generation
- **Single-File Distribution**: Entire documentation in one portable `index.html` file (900KB+)
- **No External Dependencies**: All assets embedded - works offline without CDN/internet

#### 🌍 International Support
- **UTF-8 Unicode Support**: Full support for Spanish and Latin-based languages (ñ, á, é, í, ó, ú, ü, etc.)
- **Parameter Names**: Unicode characters now work correctly in `@apiParam` field names
- **Descriptions**: All text content supports full UTF-8 encoding
- **Test Coverage**: Added UTF-8 test cases in `examples/utf8-test/`

#### 📱 Modern UI/UX
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Dark Mode**: Automatic dark/light theme support
- **Interactive Components**: Real-time search, filtering, and navigation
- **Single-File Portability**: Share documentation as a single HTML file

#### 🔒 Security Features
- **JSON Encryption**: Optional AES-256-GCM encryption for sensitive API data
- **Authentication System**: Login-protected documentation with configurable auth endpoints
- **Secure Key Management**: Automatic key generation with `.apicat-key` file

#### 🔌 MQTT Protocol Support
- **16 MQTT Parsers**: Complete MQTT documentation support
- **Interactive MQTT Client**: Test MQTT endpoints directly in documentation
- **QoS Levels**: Support for QoS 0, 1, and 2
- **SSL/TLS**: Full SSL/TLS certificate support

### 🐛 Bug Fixes
- Fixed UTF-8 encoding corruption in parameter names (Latin Extended \u00C0-\u017F)
- Fixed file reading to preserve UTF-8 bytes (changed from 'binary' to Buffer)
- Corrected template path resolution for packaged vs development environments
- Fixed --filter-version CLI option
- Fixed menu ordering to respect apidoc.json configuration

### 🔧 Technical Improvements
- **Build System**: Unified build process with `prepare` and `build:template` scripts
- **Git Installation**: Automatic compilation when installing from GitHub
- **TypeScript**: Full TypeScript support with type definitions
- **Testing**: E2E tests with Playwright
- **Documentation**: Modular documentation system in `docs/` directory

### 📦 Installation
```bash
# NPM
npm install @hrefcl/apidoc@5.0.0

# Yarn
yarn add @hrefcl/apidoc@5.0.0

# GitHub (with automatic build)
npm install git+ssh://git@github.com/hrefcl/apidoc.git#5.0.0
```

### ⚠️ Breaking Changes
- Template system completely rewritten (Vue 3 instead of static HTML)
- Output structure changed (single `index.html` instead of multiple files)
- Some legacy template customizations may need migration
- Minimum Node.js version: 20.0.0

### 📝 Migration Guide
See [docs/migration-v4-to-v5.md](docs/migration-v4-to-v5.md) for detailed migration instructions.

---

## [5.0.0-alpha.5] - 2025-10-04

### 🐛 Bug Fixes
- **UTF-8 Unicode Support**: Added Unicode Latin Extended support (\u00C0-\u017F) for Spanish characters
- Fixed parameter name truncation (descripción → descripci)
- Fixed file encoding (changed from 'binary' to Buffer)

---

## [5.0.0-alpha.4] - 2025-10-03

### 🐛 Bug Fixes
- Fixed template packaging and Git installation workflow
- Corrected template path resolution in apiCAT plugin
- Added `prepare` script for automatic compilation on Git install

---

## [5.0.0-alpha.3] - 2025-10-02

### ✨ Features
- Implemented --filter-version CLI option
- Fixed menu ordering to respect apidoc.json configuration

---

## [5.0.0-alpha.2] - 2025-09-30

### 🚀 NEW FEATURE - Interactive MQTT Testing with Real Broker Connections

**APIDoc v5 now includes a complete interactive MQTT client for testing MQTT endpoints directly in the documentation!**

#### ✨ Interactive MQTT Features
- **🔌 Real Broker Connections**: Connect to actual MQTT brokers using WebSocket (ws/wss) or native MQTT protocols
- **🔐 Security First**: Preconfigured credentials are masked with secure placeholders (`••••••••`)
- **📡 Full Protocol Support**: Publish, Subscribe, and Inline MQTT operations
- **🎯 QoS Levels**: Support for QoS 0, 1, and 2 (At most once, At least once, Exactly once)
- **🔒 SSL/TLS Support**: Complete SSL/TLS with CA certificates, client certificates, and private keys
- **📨 Message Log**: Real-time message logging with timestamps and type indicators
- **🎨 Visual Feedback**: Status indicators with emojis (✅ connected, ❌ error, ⚠️ offline, 🔄 reconnecting)

#### 🛡️ Security & Configuration
```json
{
  "mqtt": {
    "enabled": true,
    "broker": {
      "host": "mqtt.example.com",
      "port": 8883,
      "protocol": "wss"
    },
    "authentication": {
      "username": "user",
      "password": "secret",
      "clientId": "apidoc-client"
    },
    "ssl": {
      "enabled": true,
      "rejectUnauthorized": true,
      "ca": "-----BEGIN CERTIFICATE-----...",
      "cert": "-----BEGIN CERTIFICATE-----...",
      "key": "-----BEGIN PRIVATE KEY-----..."
    },
    "options": {
      "keepalive": 60,
      "connectTimeout": 30000,
      "reconnectPeriod": 1000,
      "clean": true
    }
  }
}
```

#### 🔐 Security Features
- **Masked Credentials**: Username, password, and certificates are hidden with placeholders
- **Configuration Badge**: Visual "Configurado" badge on sensitive fields
- **Disclaimer Banner**: Blue banner indicating preconfigured secure connection
- **Read-Only Mode**: Sensitive fields are disabled when preconfigured
- **No Data Exposure**: Private keys and passwords never displayed in UI

#### 🎯 MQTT Operations
1. **PUBLISH**: Send messages to MQTT topics with QoS selection
   - JSON payload validation
   - Plain text support
   - QoS 0, 1, 2 selection
   - Success/error feedback

2. **SUBSCRIBE**: Listen to MQTT topics in real-time
   - QoS selection
   - Automatic message reception
   - Unsubscribe functionality
   - Message history (last 50 messages)

3. **INLINE**: Combined publish/subscribe operations
   - Dual functionality in single interface
   - Separate controls for each operation

#### 🔧 Technical Implementation
- **NEW**: `MqttTryItOut.vue` component with mqtt.js integration
- **NEW**: Dual configuration system (real config + display config)
- **NEW**: Security masking for sensitive data
- **NEW**: Real-time MQTT event handling (connect, disconnect, message, error, offline, reconnect)
- **NEW**: Automatic cleanup on component unmount
- **ENHANCED**: ApiContent.vue detects MQTT endpoints automatically
- **ENHANCED**: cat.meta.json includes MQTT configuration

#### 📡 Supported MQTT Methods
- `PUBLISH` - Publish messages to topics
- `SUBSCRIBE` - Subscribe to topics and receive messages
- `INLINE` - Combined publish/subscribe operations

#### 🎨 UI/UX Features
- **Tab Interface**: Separate "Configuración" and "Probar" tabs
- **Connection Status**: Real-time status with visual indicators
- **Message Log**: Timestamped message history with type badges (publish/subscribe/received)
- **Action Buttons**:
  - Connect/Disconnect (green/red)
  - Publish (blue)
  - Subscribe/Unsubscribe (purple/orange)
- **Dark Mode**: Full dark mode support

#### 📦 Dependencies
- **mqtt.js**: WebSocket and native MQTT client library
- **lucide-vue-next**: Icons for UI elements

#### 📚 Documentation
- **NEW**: Complete MQTT testing guide in `md/es/18-mqtt-testing.md` and `md/en/18-mqtt-testing.md`
- **UPDATED**: MQTT protocol documentation with interactive examples
- **ENHANCED**: Security best practices for MQTT configurations

### 🔄 Backend Enhancements
- **ENHANCED**: `apidoc-to-apicat.ts` adapter includes MQTT, repository, bugs, homepage fields
- **ENHANCED**: `apicat.ts` plugin copies all metadata to cat.meta.json
- **IMPROVED**: Metadata propagation from apidoc.json to frontend

### 🐛 Bug Fixes
- **FIXED**: Dark mode color contrast in disclaimer banners
- **FIXED**: SSL/TLS configuration display for preconfigured settings
- **IMPROVED**: Error handling for MQTT connection failures
