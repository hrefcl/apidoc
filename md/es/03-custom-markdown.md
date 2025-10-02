# 📄 Custom Markdown Content per API Section

**APIDoc 4.0.5** introduces powerful custom markdown content functionality that allows you to add rich, formatted content to any API group or section. This feature enables you to provide detailed explanations, usage examples, and contextual information directly within your API documentation.

## 🎯 Overview

The custom markdown feature allows you to:
- **Add section-specific content** that appears at the top of each API group
- **Enhance documentation** with rich formatting, code examples, tables, and images
- **Provide context** for API endpoints with detailed explanations
- **Localize content** with custom titles and multilingual support
- **Integrate seamlessly** with existing APIDoc functionality

## 🚀 Quick Start

### 1. Configure in `apidoc.json`

Add the `settings` section to your `apidoc.json` configuration file:

```json
{
  "name": "My API Documentation",
  "version": "1.0.0",
  "description": "API documentation with custom markdown content",
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "User Management",
      "filename": "docs/users.md"
    },
    "Authentication": {
      "icon": "fa-shield-alt",
      "title": "Authentication & Security",
      "filename": "docs/auth.md"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Company Operations",
      "filename": "docs/company.md"
    }
  }
}
```

This creates a professional API documentation site with custom markdown content integrated seamlessly into each section.

## 🎉 Tips for Great Documentation

### Content Guidelines

1. **Start with Overview** - Begin each section with a clear overview
2. **Provide Context** - Explain when and why to use specific endpoints
3. **Include Examples** - Show practical usage examples
4. **Document Errors** - Explain common error scenarios
5. **Add Visual Elements** - Use tables, lists, and callouts for clarity

### Markdown Best Practices

- Use consistent heading levels (`##` for main sections, `###` for subsections)
- Include code examples for complex operations
- Use tables for structured data (rate limits, response codes)
- Add visual indicators (✅, ❌, ⚠️) for status and importance
- Keep content concise but comprehensive

### Maintenance

- Keep markdown files in version control alongside your API code
- Update custom content when API behavior changes
- Use consistent terminology across all sections
- Review and update content regularly

## 🔗 Related Features

- **[Font Awesome Icons](./02-customization.md)** - Complete icon customization guide
- **[Authentication System](./12-authentication.md)** - Protect your documentation
- **[MQTT Support](./10-mqtt.md)** - Document MQTT APIs
- **[OpenAPI Integration](./09-openapi.md)** - Use OpenAPI specifications

---

**Made with ❤️ by the APIDoc community**