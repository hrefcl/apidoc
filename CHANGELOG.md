# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.5] - 2025-09-28

### 🆕 NEW FEATURE - Custom Markdown Content per API Section

**APIDoc 4.0.5 introduces powerful custom markdown content functionality that allows you to add rich, formatted content to any API group or section.**

#### ✨ Custom Markdown Features
- **📄 Section-Level Content**: Add custom markdown content that appears at the top of each API group
- **🎨 Rich Formatting**: Full markdown support with syntax highlighting, tables, images, and HTML
- **🔧 Simple Configuration**: Just add `filename` to your settings in `apidoc.json`
- **🎯 Icon Integration**: Perfectly integrates with existing Font Awesome icon system
- **⚡ Automatic Processing**: Markdown files are processed and rendered as HTML automatically
- **🌍 Multilingual Support**: Combine with custom titles for localized documentation

#### 🚀 Quick Setup
```json
{
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "User Management",
      "filename": "docs/users.md"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Company Operations",
      "filename": "docs/company.md"
    }
  }
}
```

#### 🔧 Technical Implementation
- **NEW**: `processCustomMarkdownSettings()` method in `writer.ts`
- **NEW**: Markdown-it integration for HTML rendering
- **NEW**: Custom markdown container in section templates
- **NEW**: JavaScript initialization system for markdown content
- **ENHANCED**: Template system updated to support section-level custom content

#### 📁 Documentation
- **NEW**: Complete `CUSTOM-MARKDOWN.md` guide with examples and best practices
- **UPDATED**: README.md with custom markdown content section
- **ENHANCED**: Configuration documentation with new settings options

### 🐛 CRITICAL FIXES
- **FIXED**: `sortGroupsByOrder` function now correctly handles array inputs instead of objects
- **FIXED**: JavaScript error that caused blank pages when using custom ordering
- **FIXED**: Template placement of custom markdown moved from article-level to section-level
- **IMPROVED**: Error handling and validation for custom markdown file loading

### 📚 Documentation Updates
- **ENHANCED**: README.md updated with v4.0.5 features and custom markdown examples
- **NEW**: Comprehensive custom markdown documentation
- **UPDATED**: Configuration examples and best practices
- **IMPROVED**: Quick start guides and troubleshooting sections

## [4.0.4] - 2025-01-27

### 🚀 ENHANCED - Swagger UI-Style Collapsible Interface + Complete MQTT Protocol Support

**APIDoc 4.0.4 adds comprehensive MQTT support alongside the existing Swagger-style interface!**

#### 📡 MQTT Protocol Features
- **NEW**: Full MQTT publish/subscribe pattern documentation
- **NEW**: 16 specialized MQTT documentation tags (@mqtt, @topic, @topicParam, @qos, @retain, etc.)
- **NEW**: MQTT-specific template with distinctive purple-themed UI design
- **NEW**: Support for QoS levels, retain flags, and topic parameters
- **NEW**: MQTT payload schema validation with JSON Schema support
- **NEW**: Authentication documentation for MQTT brokers
- **NEW**: Rate limiting and error handling documentation
- **NEW**: MQTT command examples (mosquitto_pub, mosquitto_sub)

#### 🏷️ New MQTT Documentation Tags
```javascript
@mqtt {publish|subscribe}           // MQTT operation type
@mqttGroup {String}                 // Group MQTT endpoints separately
@topic {String}                     // MQTT topic pattern with parameters
@topicParam {Type} name Description // Topic parameter documentation
@qos {Number}                       // Quality of Service level (0,1,2)
@retain {Boolean}                   // Message retention flag
@payload {MIME} Description         // Message payload format
@payloadSchema {Type}               // JSON Schema for payload validation
@auth {String}                      // Authentication method
@examplePublish                     // Publish command examples
@exampleSubscribe                   // Subscribe command examples
@responseTopic {String}             // Response topic pattern
@responseExample                    // Response payload examples
@ratelimit {String}                 // Rate limiting rules
@errors {String}                    // Error scenarios
@tags {String}                      // MQTT-specific tags
```

#### 🎨 Visual Design & User Experience
- **NEW**: Distinctive purple color scheme for MQTT endpoints
- **NEW**: MQTT method badges (publish, subscribe, inline)
- **NEW**: Topic pattern display with parameter highlighting
- **NEW**: QoS and retention status indicators
- **NEW**: Collapsible MQTT documentation with interactive expansion
- **NEW**: Separate navigation grouping for MQTT vs REST APIs
- **NEW**: MQTT-specific icons and visual elements

#### 🔧 Technical Implementation
- **ADDED**: 16 new TypeScript parsers for MQTT tags in `lib/core/parsers/mqtt_*.ts`
- **ADDED**: MQTT endpoint detection and classification system
- **ADDED**: Dual template support (REST + MQTT) with automatic selection
- **ADDED**: MQTT-specific Handlebars template with full feature set
- **ADDED**: Extended parser registration system supporting MQTT patterns
- **ENHANCED**: Collapsible functionality to support both `.opblock-content` and `.opblock-details`
- **ENHANCED**: Navigation system to handle mixed REST/MQTT documentation

#### 📚 Documentation & Examples
- **ADDED**: Complete MQTT examples in `example/mqtt-examples.ts`
- **ADDED**: IoT device telemetry publishing examples
- **ADDED**: Device command subscription patterns
- **ADDED**: Device status and alert handling examples
- **ADDED**: Configuration management via MQTT examples
- **ADDED**: Best practices for MQTT topic design
- **ADDED**: Rate limiting and error handling examples

#### 🧪 Quality Assurance
- **TESTED**: Full MQTT parser functionality with comprehensive test coverage
- **TESTED**: Template rendering for all MQTT tag combinations
- **TESTED**: Collapsible functionality for MQTT endpoints
- **TESTED**: Integration with existing REST API documentation
- **TESTED**: Cross-browser compatibility for MQTT UI elements
- **VERIFIED**: No breaking changes to existing REST API functionality

#### 🚀 Use Cases Enabled
- **IoT Documentation**: Device telemetry, commands, and status APIs
- **Real-time Systems**: Event streaming and notification patterns
- **Microservices**: Inter-service communication via MQTT
- **Mobile Apps**: Push notifications and real-time updates
- **Industrial IoT**: Sensor data collection and device control

## [4.0.4] - 2025-01-26

### 🎨 Added - Swagger UI-Style Collapsible Interface
- **NEW**: Complete Swagger UI-inspired collapsible interface system
- **NEW**: Two-level collapsible hierarchy - groups and individual endpoints
- **NEW**: Professional endpoint display with HTTP method badges and complete URLs
- **NEW**: One-click URL copy functionality with modern clipboard integration
- **NEW**: Visual feedback system for copy actions (green button + checkmark)
- **NEW**: Configurable collapsible behavior via `apidoc.json` template settings
- **NEW**: `groupsCollapsible` option for collapsing entire API sections
- **NEW**: `endpointsCollapsible` option for collapsing individual endpoints
- **NEW**: Clean method+URL+permissions section for easy navigation
- **NEW**: Responsive design that works perfectly on mobile devices

### 🚀 Enhanced - User Experience & Navigation
- **IMPROVED**: Professional API documentation appearance matching modern standards
- **IMPROVED**: Organized content layout with proper visual hierarchy
- **IMPROVED**: Fast navigation with instant expand/collapse transitions
- **IMPROVED**: Developer-friendly URL copying with fallback support for all browsers
- **IMPROVED**: Permission badges with clean tooltips and proper styling
- **IMPROVED**: Method color-coding (GET=green, POST=blue, PUT=orange, DELETE=red)

### 🛠️ Technical Implementation
- **ENHANCED**: TypeScript implementation with comprehensive type safety
- **ENHANCED**: Modern clipboard API with document.execCommand fallback
- **ENHANCED**: Event-driven architecture for collapsible functionality
- **ENHANCED**: Proper ARIA attributes for accessibility compliance
- **ENHANCED**: TailwindCSS styling with consistent design patterns
- **ENHANCED**: Font Awesome icons integration for visual clarity

### 📋 Configuration & Documentation
- **ADDED**: Complete documentation in README.md with configuration examples
- **ADDED**: Template configuration options with best practices guide
- **ADDED**: Use case documentation for different API sizes
- **ADDED**: Visual benefits and features documentation
- **UPDATED**: Configuration examples showing collapsible settings

### 🧪 Quality Assurance
- **TESTED**: Full functionality verification with Playwright testing
- **TESTED**: Cross-browser compatibility for copy functionality
- **TESTED**: Mobile responsiveness verification
- **TESTED**: Accessibility compliance testing
- **VERIFIED**: Clean console logs without errors
- **VERIFIED**: Proper initialization and cleanup

---

## [4.0.3] - 2025-01-25

### 🔄 Updated - Complete Dependency Modernization
- **MAJOR**: Updated all dependencies to latest versions for improved security and performance
- **UPDATED**: Core development dependencies modernized (TypeScript, ESLint, etc.)
- **UPDATED**: Runtime dependencies updated with security patches
- **REMOVED**: Deprecated `@types/glob` and `@types/highlight.js` packages (now included in main packages)
- **IMPROVED**: Build performance and stability with latest toolchain
- **TESTED**: Full compatibility verification - all systems working correctly

### 🧪 Testing & Quality Assurance
- **VERIFIED**: TypeScript compilation working with updated dependencies
- **VERIFIED**: CSS build system compatibility maintained
- **VERIFIED**: ESLint configuration updated and working
- **VERIFIED**: TypeDoc generation working correctly
- **VERIFIED**: Example generation functionality preserved
- **VERIFIED**: All dynamic theme loading functionality intact

### 🏗️ Technical Infrastructure
- **ENHANCED**: Development toolchain modernized for better maintainability
- **ENHANCED**: Package security improved with latest dependency versions
- **ENHANCED**: Build system stability with dependency updates
- **MAINTAINED**: Full backward compatibility with existing configurations

---

## [4.0.3-beta.3] - 2025-01-25

### <� Added - Dynamic Highlight.js Theme System
- **NEW**: Dynamic highlight.js theme system with 160+ available themes
- **NEW**: `highlightTheme` configuration field in `apidoc.json`
- **NEW**: JavaScript API for runtime theme switching (`window.loadHighlightTheme()`)
- **NEW**: Smart theme loading - only loads extra CSS when needed
- **NEW**: Tokyo-night-dark as modern default theme (replacing github-dark)
- **NEW**: Comprehensive theme documentation in README.md with examples

### =' Changed - CSS Processing Architecture
- **MAJOR**: Complete CSS compilation system overhaul for production stability
- **IMPROVED**: Pre-compiled CSS approach eliminates runtime compilation inconsistencies
- **IMPROVED**: CSS build size optimized from 216KB � 391KB (with complete functionality)
- **IMPROVED**: Separate development CSS workflow for faster iteration
- **IMPROVED**: Consistent CSS output between local development and NPM distribution

###  Updated - Bootstrap Migration
- **UPGRADED**: Bootstrap 4 � Bootstrap 5.3.8 migration completed
- **IMPROVED**: Modern Bootstrap 5 JavaScript components integration
- **IMPROVED**: Enhanced dropdown, tooltip, popover, and tab functionality
- **IMPROVED**: Better responsive design with Bootstrap 5 utilities
- **IMPROVED**: Modernized CSS classes and component structure

### = Fixed - Dark Mode CSS Conflicts
- **CRITICAL**: Resolved all dark mode CSS conflicts with highlight.js
- **FIXED**: Code blocks now display correctly with proper syntax highlighting in dark mode
- **FIXED**: Universal selector (*) overwrites in dark mode affecting highlight.js
- **FIXED**: CSS specificity issues using advanced :not() selectors
- **FIXED**: Article content and element-specific rules interfering with code highlighting

### =' Technical Improvements
- **ENHANCED**: CSS build script with TailwindCSS v4/v3 fallback support
- **ENHANCED**: Theme copying system for NPM distribution (160 themes)
- **ENHANCED**: Error handling and fallback support for theme loading
- **ENHANCED**: Writer.ts optimizations for asset management
- **ENHANCED**: Advanced CSS selectors to prevent conflicts (`:not(.hljs):not(.hljs *)`)

### =� Documentation
- **ADDED**: Comprehensive Dynamic Highlight.js Theme System documentation
- **ADDED**: Theme configuration examples and migration guide
- **ADDED**: 160+ theme catalog with categorization
- **ADDED**: JavaScript API documentation for runtime theme switching
- **ADDED**: Troubleshooting section for common theme issues
- **UPDATED**: "What's New in v4.0" section with theme system feature

### =� Performance & Stability
- **IMPROVED**: 391KB CSS bundle with complete Bootstrap + TailwindCSS + Highlight.js
- **IMPROVED**: No runtime CSS compilation reduces build complexity
- **IMPROVED**: Faster development builds with separate dev CSS
- **IMPROVED**: Better NPM distribution with pre-compiled assets
- **IMPROVED**: Reduced CSS conflicts and improved theme loading reliability

### =� Breaking Changes
- Default highlight.js theme changed from `github-dark` to `tokyo-night-dark`
- CSS compilation now happens at build-time instead of runtime
- Some internal CSS class names may have changed due to Bootstrap 5 migration

### = Migration Guide
- **From v4.0.2**: No action required - themes work automatically
- **Custom highlight.js themes**: Add `"highlightTheme": "your-theme-name"` to `apidoc.json`
- **Bootstrap 4 customizations**: Review and update to Bootstrap 5 classes if customized

---

## [4.0.2] - Previous Release
- CSS compilation improvements
- Bootstrap integration fixes
- Basic highlight.js support

## [4.0.1] - Previous Release
- Initial v4.0 release
- TypeScript migration
- OpenAPI 3.0 support
- Authentication system