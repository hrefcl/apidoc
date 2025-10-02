# 📚 Custom Markdown Examples

This document provides complete, real-world examples of using the custom markdown functionality in APIDoc 4.0.5.

## 🎯 Complete Working Example

### Project Structure
```
my-api-project/
├── src/
│   ├── controllers/
│   │   ├── users.js
│   │   ├── auth.js
│   │   ├── company.js
│   │   └── analytics.js
│   └── models/
├── docs/
│   ├── users.md
│   ├── auth.md
│   ├── company.md
│   └── analytics.md
├── apidoc.json
├── package.json
└── output/
```

### Configuration File

**`apidoc.json`**
```json
{
  "name": "E-Commerce API Documentation",
  "version": "2.1.0",
  "description": "Comprehensive API documentation for our e-commerce platform",
  "title": "E-Commerce API v2.1",
  "url": "https://api.ecommerce.com",
  "sampleUrl": "https://api.ecommerce.com",
  "header": {
    "title": "Getting Started",
    "filename": "header.md",
    "icon": "fa-home"
  },
  "footer": {
    "title": "Support & Contact",
    "filename": "footer.md",
    "icon": "fa-support"
  },
  "order": [
    "Authentication",
    "Users",
    "Company",
    "Analytics"
  ],
  "settings": {
    "Authentication": {
      "icon": "fa-shield-alt",
      "title": "Authentication & Security",
      "filename": "docs/auth.md"
    },
    "Users": {
      "icon": "fa-users",
      "title": "User Management",
      "filename": "docs/users.md"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Company Operations",
      "filename": "docs/company.md"
    },
    "Analytics": {
      "icon": "fa-chart-line",
      "title": "Analytics & Reports",
      "filename": "docs/analytics.md"
    }
  },
  "logo": {
    "icon": "fa-shopping-cart",
    "alt": "E-Commerce API"
  }
}
```

