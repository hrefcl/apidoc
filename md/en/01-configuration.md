---
title: "Configuration - apidoc.json"
category: "Configuration"
order: 1
---

# 📋 Configuration - apidoc.json

Complete guide for configuring APIDoc through the `apidoc.json` file with all available options and advanced settings.

## 🏗️ Basic Structure

### Minimal Configuration
```json
{
  "name": "My API",
  "version": "1.0.0",
  "description": "API documentation for my application"
}
```

### Complete Configuration Example
```json
{
  "name": "Company API",
  "version": "2.1.0",
  "description": "Complete REST API and MQTT documentation",
  "title": "Company API Documentation",
  "url": "https://api.company.com",
  "sampleUrl": "https://api.company.com",
  "defaultVersion": "1.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "@hrefcl/apidoc",
    "time": "2024-01-15T10:30:00.000Z",
    "url": "https://apidoc.app",
    "version": "4.0.5"
  }
}
```

## 🎯 Core Properties

### Basic Information
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `name` | String | Project name | ✅ |
| `version` | String | Current version | ✅ |
| `description` | String | Project description | ✅ |
| `title` | String | Documentation title | ❌ |
| `url` | String | Base API URL | ❌ |

### Documentation Settings
| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `sampleUrl` | String | URL for sample requests | `false` |
| `defaultVersion` | String | Default API version | `"0.0.0"` |
| `apidoc` | String | APIDoc version compatibility | `"0.3.0"` |
| `order` | Array | Custom group ordering | `[]` |

## 🎨 Customization Options

### Header Configuration
```json
{
  "header": {
    "title": "Custom API Documentation",
    "filename": "./header.md"
  },
  "footer": {
    "title": "Footer Information",
    "filename": "./footer.md"
  }
}
```

### Custom CSS and JavaScript
```json
{
  "template": {
    "withCompare": true,
    "withGenerator": false,
    "jQueryAjaxSetup": {
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

## 🔧 Advanced Settings

### Custom Ordering
```json
{
  "order": [
    "Authentication",
    "Users",
    "Products",
    "Orders",
    "Payments",
    "Admin"
  ]
}
```

### Sample Request Configuration
```json
{
  "sampleUrl": "https://api.example.com",
  "template": {
    "jQueryAjaxSetup": {
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_TOKEN_HERE"
      },
      "timeout": 10000
    }
  }
}
```

## 🎨 Custom Markdown Settings

### Section-Level Content
```json
{
  "settings": {
    "Users": {
      "title": "User Management",
      "icon": "fa-users",
      "filename": "./docs/users-intro.md"
    },
    "Products": {
      "title": "Product Catalog",
      "icon": "fa-shopping-cart",
      "filename": "./docs/products-intro.md"
    }
  }
}
```

### Markdown Files Structure
```
project/
├── apidoc.json
├── src/
│   └── api/
├── docs/
│   ├── users-intro.md
│   ├── products-intro.md
│   └── header.md
└── output/
```

## 🔐 Authentication Configuration

### Local Authentication
```json
{
  "login": {
    "active": true,
    "admited": [
      {
        "email": "admin@company.com",
        "password": "secure123"
      },
      {
        "email": "developer@company.com",
        "password": "dev456"
      }
    ]
  }
}
```

### Remote Authentication
```json
{
  "login": {
    "active": true,
    "urlAuth": "https://api.company.com/auth/login",
    "method": "POST",
    "fields": {
      "username": "email",
      "password": "password"
    }
  }
}
```

### Dual Authentication
```json
{
  "login": {
    "active": true,
    "admited": [
      {"email": "admin@company.com", "password": "secure123"}
    ],
    "urlAuth": "https://api.company.com/auth/login"
  }
}
```

## 📡 MQTT Configuration

### MQTT Settings
```json
{
  "mqtt": {
    "enabled": true,
    "brokerUrl": "mqtt://broker.company.com:1883",
    "defaultQos": 1,
    "showRetain": true
  }
}
```

## 🌐 OpenAPI Integration

### OpenAPI Export Settings
```json
{
  "openapi": {
    "enabled": true,
    "version": "3.0.0",
    "output": "./openapi.json",
    "servers": [
      {
        "url": "https://api.company.com/v1",
        "description": "Production server"
      },
      {
        "url": "https://staging-api.company.com/v1",
        "description": "Staging server"
      }
    ]
  }
}
```

## 📊 TypeScript Configuration

### Schema Settings
```json
{
  "typescript": {
    "enabled": true,
    "schemaValidation": true,
    "generateExamples": true,
    "includeOptional": true
  }
}
```

## 🔧 Template Configuration

### Template Options
```json
{
  "template": {
    "withCompare": true,
    "withGenerator": false,
    "aloneDisplay": false,
    "showRequiredLabels": true,
    "markdown": {
      "gfm": true,
      "tables": true,
      "breaks": false,
      "pedantic": false,
      "sanitize": false,
      "smartLists": true,
      "smartypants": false
    }
  }
}
```

### jQuery AJAX Configuration
```json
{
  "template": {
    "jQueryAjaxSetup": {
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer token",
        "X-API-Key": "your-api-key"
      },
      "timeout": 15000,
      "cache": false
    }
  }
}
```

## 🌍 Internationalization

### Language Settings
```json
{
  "language": "en",
  "languages": {
    "en": "English",
    "es": "Español",
    "fr": "Français"
  }
}
```

## ⚙️ Generator Configuration

### Build Settings
```json
{
  "generator": {
    "name": "@hrefcl/apidoc",
    "time": "2024-01-15T10:30:00.000Z",
    "url": "https://apidoc.app",
    "version": "4.0.5"
  }
}
```

## 🔍 Debugging and Development

### Debug Configuration
```json
{
  "debug": true,
  "verbose": true,
  "silent": false,
  "log": {
    "level": "info",
    "file": "./apidoc.log"
  }
}
```

## 📋 Complete Configuration Template

```json
{
  "name": "Company API",
  "version": "2.1.0",
  "description": "Complete API documentation with MQTT support",
  "title": "Company API Documentation",
  "url": "https://api.company.com",
  "sampleUrl": "https://api.company.com",
  "defaultVersion": "1.0.0",

  "order": [
    "Authentication",
    "Users",
    "Products",
    "Orders",
    "MQTT"
  ],

  "settings": {
    "Users": {
      "title": "User Management",
      "icon": "fa-users",
      "filename": "./docs/users.md"
    },
    "Products": {
      "title": "Product Catalog",
      "icon": "fa-shopping-cart",
      "filename": "./docs/products.md"
    }
  },

  "login": {
    "active": true,
    "admited": [
      {"email": "admin@company.com", "password": "secure123"}
    ],
    "urlAuth": "https://api.company.com/auth/login"
  },

  "mqtt": {
    "enabled": true,
    "defaultQos": 1
  },

  "openapi": {
    "enabled": true,
    "output": "./openapi.json"
  },

  "typescript": {
    "enabled": true,
    "schemaValidation": true
  },

  "template": {
    "withCompare": true,
    "jQueryAjaxSetup": {
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  }
}
```

This configuration enables all major APIDoc 4.0 features including custom markdown, MQTT support, authentication, OpenAPI export, and TypeScript integration.