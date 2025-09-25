# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.3-beta.3] - 2025-01-25

### <¨ Added - Dynamic Highlight.js Theme System
- **NEW**: Dynamic highlight.js theme system with 160+ available themes
- **NEW**: `highlightTheme` configuration field in `apidoc.json`
- **NEW**: JavaScript API for runtime theme switching (`window.loadHighlightTheme()`)
- **NEW**: Smart theme loading - only loads extra CSS when needed
- **NEW**: Tokyo-night-dark as modern default theme (replacing github-dark)
- **NEW**: Comprehensive theme documentation in README.md with examples

### =' Changed - CSS Processing Architecture
- **MAJOR**: Complete CSS compilation system overhaul for production stability
- **IMPROVED**: Pre-compiled CSS approach eliminates runtime compilation inconsistencies
- **IMPROVED**: CSS build size optimized from 216KB ’ 391KB (with complete functionality)
- **IMPROVED**: Separate development CSS workflow for faster iteration
- **IMPROVED**: Consistent CSS output between local development and NPM distribution

###  Updated - Bootstrap Migration
- **UPGRADED**: Bootstrap 4 ’ Bootstrap 5.3.8 migration completed
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

### =Ú Documentation
- **ADDED**: Comprehensive Dynamic Highlight.js Theme System documentation
- **ADDED**: Theme configuration examples and migration guide
- **ADDED**: 160+ theme catalog with categorization
- **ADDED**: JavaScript API documentation for runtime theme switching
- **ADDED**: Troubleshooting section for common theme issues
- **UPDATED**: "What's New in v4.0" section with theme system feature

### =€ Performance & Stability
- **IMPROVED**: 391KB CSS bundle with complete Bootstrap + TailwindCSS + Highlight.js
- **IMPROVED**: No runtime CSS compilation reduces build complexity
- **IMPROVED**: Faster development builds with separate dev CSS
- **IMPROVED**: Better NPM distribution with pre-compiled assets
- **IMPROVED**: Reduced CSS conflicts and improved theme loading reliability

### =” Breaking Changes
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