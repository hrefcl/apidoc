---
title: "Custom Markdown Content"
category: "Customization"
order: 3
---

# 📝 Custom Markdown Content

APIDoc 4.0 introduces the ability to add custom markdown content to any API group, providing rich documentation with HTML support, Font Awesome icons, and complete markdown formatting.

## 🚀 Overview

### What is Custom Markdown?
Custom Markdown allows you to inject rich content at the **section level** (API groups) to provide:
- **Introduction text** for API sections
- **Usage examples** and tutorials
- **Important notes** and warnings
- **Rich formatting** with HTML and CSS
- **Font Awesome icons** integration

### Where it Appears
Custom markdown content appears at the **top of each API group section**, before the individual API endpoints, providing context and introduction to the group.

## ⚙️ Basic Configuration

### 1. Configure apidoc.json
```json
{
  "name": "My API",
  "version": "1.0.0",
  "settings": {
    "Users": {
      "title": "User Management",
      "icon": "fa-users",
      "filename": "./docs/users-intro.md"
    }
  }
}
```

### 2. Create Markdown File
```markdown
<!-- docs/users-intro.md -->
# 👥 User Management System

Welcome to the **User Management** section of our API. This comprehensive system allows you to:

- ✅ **Create and manage** user accounts
- 🔐 **Authenticate** users securely
- 👤 **Update profiles** and preferences
- 📊 **Track user activity** and analytics

## Quick Start

All user endpoints require **authentication** via Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.example.com/users
```

> ⚠️ **Important**: User data is sensitive. Always use HTTPS in production.
```

## 🎨 Advanced Formatting

### HTML Support
```markdown
<div class="alert alert-info">
  <i class="fa fa-info-circle"></i>
  <strong>API Rate Limits:</strong>
  This endpoint is limited to 100 requests per minute.
</div>

<div class="row">
  <div class="col-md-6">
    <h4>📊 Supported Formats</h4>
    <ul>
      <li>JSON (default)</li>
      <li>XML</li>
      <li>CSV export</li>
    </ul>
  </div>
  <div class="col-md-6">
    <h4>🔐 Authentication</h4>
    <ul>
      <li>Bearer Token</li>
      <li>API Key</li>
      <li>OAuth 2.0</li>
    </ul>
  </div>
</div>
```

### Font Awesome Icons
```markdown
## 🔧 Available Operations

- <i class="fa fa-plus-circle text-success"></i> **Create** new users
- <i class="fa fa-edit text-primary"></i> **Update** existing users
- <i class="fa fa-trash text-danger"></i> **Delete** user accounts
- <i class="fa fa-search text-info"></i> **Search** and filter users
```

### Code Blocks with Syntax Highlighting
```markdown
### JavaScript Example
```javascript
const response = await fetch('/api/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});

const users = await response.json();
console.log('Users:', users);
\```

### Python Example
```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.example.com/users', headers=headers)
users = response.json()
print(f"Found {len(users)} users")
\```
```

## 📋 Configuration Options

### Complete Settings Object
```json
{
  "settings": {
    "GroupName": {
      "title": "Display Title",
      "icon": "fa-icon-name",
      "filename": "./path/to/markdown.md"
    }
  }
}
```

### Properties Explained
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `title` | String | Display title for the section | ❌ |
| `icon` | String | Font Awesome icon class | ❌ |
| `filename` | String | Path to markdown file | ✅ |

### Icon Options
APIDoc includes **Font Awesome 6** with thousands of icons:
```json
{
  "Users": {"icon": "fa-users"},
  "Products": {"icon": "fa-shopping-cart"},
  "Orders": {"icon": "fa-receipt"},
  "Payments": {"icon": "fa-credit-card"},
  "Analytics": {"icon": "fa-chart-line"},
  "Settings": {"icon": "fa-cog"}
}
```

## 🌍 Multiple Groups Example

### apidoc.json Configuration
```json
{
  "name": "E-commerce API",
  "version": "2.0.0",
  "order": ["Authentication", "Users", "Products", "Orders", "Payments"],
  "settings": {
    "Authentication": {
      "title": "🔐 Authentication & Security",
      "icon": "fa-shield-alt",
      "filename": "./docs/auth-intro.md"
    },
    "Users": {
      "title": "👥 User Management",
      "icon": "fa-users",
      "filename": "./docs/users-intro.md"
    },
    "Products": {
      "title": "🛍️ Product Catalog",
      "icon": "fa-shopping-bag",
      "filename": "./docs/products-intro.md"
    },
    "Orders": {
      "title": "📦 Order Processing",
      "icon": "fa-box",
      "filename": "./docs/orders-intro.md"
    },
    "Payments": {
      "title": "💳 Payment Gateway",
      "icon": "fa-credit-card",
      "filename": "./docs/payments-intro.md"
    }
  }
}
```

### File Structure
```
project/
├── apidoc.json
├── src/
│   ├── auth/
│   ├── users/
│   ├── products/
│   └── orders/
├── docs/
│   ├── auth-intro.md
│   ├── users-intro.md
│   ├── products-intro.md
│   ├── orders-intro.md
│   └── payments-intro.md
└── api-docs/ (output)
```

## 💡 Real-World Examples

### Authentication Section
```markdown
<!-- docs/auth-intro.md -->
# 🔐 Authentication & Security

Our API uses **JWT (JSON Web Tokens)** for authentication. All protected endpoints require a valid Bearer token.

## 🚀 Quick Start

1. **Login** to get your JWT token
2. **Include token** in Authorization header
3. **Token expires** in 24 hours

```bash
# Get token
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123"}'

# Use token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://api.example.com/protected-endpoint
```

## 🔒 Security Features

- ✅ **Bcrypt password hashing**
- ✅ **JWT token expiration**
- ✅ **Rate limiting** (100 req/min)
- ✅ **CORS protection**
- ✅ **Input validation**

> 🚨 **Never share your JWT tokens**. Tokens provide full access to your account.
```

### E-commerce Products Section
```markdown
<!-- docs/products-intro.md -->
# 🛍️ Product Catalog Management

Comprehensive product management system supporting categories, variants, inventory, and pricing.

<div class="row mb-4">
  <div class="col-md-4">
    <div class="card">
      <div class="card-body text-center">
        <i class="fa fa-plus-circle fa-3x text-success mb-3"></i>
        <h5>Create Products</h5>
        <p>Add new products with full details</p>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card">
      <div class="card-body text-center">
        <i class="fa fa-edit fa-3x text-primary mb-3"></i>
        <h5>Manage Variants</h5>
        <p>Size, color, and SKU management</p>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card">
      <div class="card-body text-center">
        <i class="fa fa-chart-line fa-3x text-info mb-3"></i>
        <h5>Track Inventory</h5>
        <p>Real-time stock monitoring</p>
      </div>
    </div>
  </div>
</div>

## 📊 Product Data Structure

```json
{
  "id": "prod_123",
  "name": "Premium T-Shirt",
  "category": "clothing",
  "price": 29.99,
  "currency": "USD",
  "variants": [
    {"size": "M", "color": "blue", "stock": 50},
    {"size": "L", "color": "red", "stock": 25}
  ]
}
```
```

## 🔧 Technical Implementation

### Markdown Processing
APIDoc uses **markdown-it** for processing with these features:
- ✅ **HTML support** enabled
- ✅ **Linkify** automatic URL detection
- ✅ **Typography** smart quotes and symbols
- ✅ **Syntax highlighting** with highlight.js

### File Resolution
Markdown files are resolved relative to the **first source directory**:
```bash
apidoc -i ./src -o ./docs
# Markdown files resolved from ./src directory
```

### Error Handling
If a markdown file is missing or invalid:
- ⚠️ **Warning logged** to console
- 📝 **Section renders** without custom content
- 🔄 **Build continues** normally

## 🎯 Best Practices

### 1. Content Organization
```markdown
# Main Title (H1)
Brief introduction paragraph

## Key Features (H2)
- Feature list
- With bullets

### Technical Details (H3)
More specific information

> Important notes in blockquotes
```

### 2. Visual Hierarchy
- Use **consistent heading levels**
- Include **Font Awesome icons** for visual appeal
- Add **code examples** for clarity
- Use **blockquotes** for important notes

### 3. File Management
- Keep markdown files in dedicated `docs/` folder
- Use descriptive filenames (`users-intro.md`)
- Maintain **relative paths** in apidoc.json
- Consider **versioning** markdown content

### 4. Performance
- Keep markdown files **reasonably sized** (< 100KB)
- Optimize **images** if included
- Use **external links** for large resources

Custom Markdown Content transforms API documentation from simple reference material into comprehensive, user-friendly guides that help developers understand and integrate with your APIs effectively.