---
title: "Icons & Customization"
category: "Customization"
order: 2
---

# 🎨 Icons & Customization

Complete guide for customizing APIDoc's visual appearance including logos, Font Awesome icons, themes, colors, and branding options.

## 🌟 Overview

APIDoc 4.0 provides extensive customization options to match your brand and improve user experience:

- **🎨 Custom Logos**: Add company branding
- **🔤 Font Awesome Icons**: 6000+ icons available
- **🌈 Color Themes**: Custom color schemes
- **📝 Typography**: Font customization
- **🖼️ Backgrounds**: Custom backgrounds and images
- **🎭 Templates**: Custom HTML templates

## 🏢 Logo and Branding

### Basic Logo Configuration
```json
{
  "name": "Company API",
  "version": "1.0.0",
  "header": {
    "title": "Company API Documentation",
    "filename": "./header.md"
  },
  "template": {
    "withGenerator": false,
    "logo": "./assets/company-logo.png"
  }
}
```

### Advanced Branding
```json
{
  "branding": {
    "logo": {
      "src": "./assets/logo.png",
      "alt": "Company Logo",
      "width": "150px",
      "height": "auto",
      "link": "https://company.com"
    },
    "favicon": "./assets/favicon.ico",
    "title": "Company API Portal",
    "description": "Official API Documentation"
  }
}
```

### Logo in Header Markdown
```markdown
<!-- header.md -->
<div class="brand-header">
  <img src="./assets/company-logo.png" alt="Company" height="40">
  <h1>Company API Documentation</h1>
  <p>Version 2.0 • Last updated: January 2024</p>
</div>
```

## 🔤 Font Awesome Icons

### Icon Configuration
APIDoc includes **Font Awesome 6** with 6000+ icons available for API groups and custom content.

```json
{
  "settings": {
    "Authentication": {
      "title": "🔐 Authentication",
      "icon": "fa-shield-alt",
      "filename": "./docs/auth.md"
    },
    "Users": {
      "title": "👥 User Management",
      "icon": "fa-users",
      "filename": "./docs/users.md"
    },
    "Products": {
      "title": "🛍️ Products",
      "icon": "fa-shopping-bag",
      "filename": "./docs/products.md"
    },
    "Orders": {
      "title": "📦 Orders",
      "icon": "fa-box",
      "filename": "./docs/orders.md"
    },
    "Payments": {
      "title": "💳 Payments",
      "icon": "fa-credit-card",
      "filename": "./docs/payments.md"
    },
    "Analytics": {
      "title": "📊 Analytics",
      "icon": "fa-chart-line",
      "filename": "./docs/analytics.md"
    }
  }
}
```

### Popular Icon Categories
| Category | Icons | Examples |
|----------|-------|----------|
| **Authentication** | Security, access | `fa-shield-alt`, `fa-key`, `fa-lock` |
| **Users** | People, accounts | `fa-users`, `fa-user`, `fa-user-circle` |
| **Data** | Information, files | `fa-database`, `fa-file`, `fa-table` |
| **Communication** | Messages, alerts | `fa-envelope`, `fa-bell`, `fa-comment` |
| **Commerce** | Shopping, money | `fa-shopping-cart`, `fa-credit-card`, `fa-dollar-sign` |
| **System** | Settings, tools | `fa-cog`, `fa-wrench`, `fa-server` |
| **Navigation** | Arrows, movement | `fa-arrow-right`, `fa-chevron-up`, `fa-home` |

### Icon Examples by Type
```json
{
  "settings": {
    "Security": {"icon": "fa-shield-alt"},
    "Users": {"icon": "fa-users"},
    "Products": {"icon": "fa-shopping-bag"},
    "Orders": {"icon": "fa-receipt"},
    "Payments": {"icon": "fa-credit-card"},
    "Shipping": {"icon": "fa-truck"},
    "Analytics": {"icon": "fa-chart-bar"},
    "Reports": {"icon": "fa-file-chart"},
    "Settings": {"icon": "fa-cog"},
    "Admin": {"icon": "fa-crown"},
    "Webhooks": {"icon": "fa-webhook"},
    "Files": {"icon": "fa-folder"},
    "Search": {"icon": "fa-search"},
    "Notifications": {"icon": "fa-bell"},
    "Messages": {"icon": "fa-envelope"},
    "Support": {"icon": "fa-life-ring"}
  }
}
```

## 🌈 Color Themes and Styling

### Custom CSS Configuration
```json
{
  "template": {
    "customCSS": "./assets/custom-styles.css",
    "theme": {
      "primaryColor": "#007bff",
      "secondaryColor": "#6c757d",
      "successColor": "#28a745",
      "dangerColor": "#dc3545",
      "warningColor": "#ffc107",
      "infoColor": "#17a2b8"
    }
  }
}
```

### Custom CSS Example
```css
/* assets/custom-styles.css */

/* Brand Colors */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --brand-color: #ff6b35;
  --accent-color: #20c997;
}

/* Header Customization */
.header {
  background: linear-gradient(135deg, var(--primary-color), var(--brand-color));
  border-bottom: 3px solid var(--accent-color);
}

.brand-header h1 {
  color: white;
  font-weight: 700;
  margin: 0;
}

/* Navigation Styling */
.nav-pills .nav-link.active {
  background-color: var(--brand-color);
  border-radius: 25px;
}

/* API Method Colors */
.method-get { background-color: #61affe; }
.method-post { background-color: #49cc90; }
.method-put { background-color: #fca130; }
.method-delete { background-color: #f93e3e; }
.method-patch { background-color: #50e3c2; }

/* Custom Cards */
.api-group {
  border-left: 4px solid var(--brand-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.api-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* Code Blocks */
pre {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .brand-header {
    text-align: center;
    padding: 1rem;
  }

  .brand-header img {
    height: 30px;
  }
}
```

## 🎨 Template Customization

### Custom HTML Template
```html
<!-- custom-template.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{title}} - {{name}}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Custom Meta Tags -->
  <meta name="description" content="{{description}}">
  <meta name="author" content="Company Name">
  <meta property="og:title" content="{{title}}">
  <meta property="og:description" content="{{description}}">
  <meta property="og:image" content="./assets/og-image.png">

  <!-- Custom Styles -->
  <link rel="stylesheet" href="./assets/custom-styles.css">
  <link rel="icon" type="image/x-icon" href="./assets/favicon.ico">
</head>
<body>
  <!-- Custom Header -->
  <header class="main-header">
    <div class="container">
      <div class="brand-section">
        <img src="./assets/logo.png" alt="{{name}}" class="logo">
        <div class="brand-text">
          <h1>{{title}}</h1>
          <p>{{description}}</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="main-nav">
        <a href="https://company.com" class="nav-link">Website</a>
        <a href="https://support.company.com" class="nav-link">Support</a>
        <a href="https://github.com/company/api" class="nav-link">GitHub</a>
      </nav>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main-content">
    {{{content}}}
  </main>

  <!-- Custom Footer -->
  <footer class="main-footer">
    <div class="container">
      <p>&copy; 2024 Company Name. All rights reserved.</p>
      <p>Generated with <a href="https://apidoc.app">APIDoc 4.0</a></p>
    </div>
  </footer>
</body>
</html>
```

### Template Configuration
```json
{
  "template": {
    "customTemplate": "./templates/custom-template.html",
    "partials": {
      "header": "./templates/partials/header.hbs",
      "footer": "./templates/partials/footer.hbs",
      "navigation": "./templates/partials/nav.hbs"
    }
  }
}
```

## 🖼️ Background and Images

### Background Configuration
```json
{
  "template": {
    "background": {
      "image": "./assets/background.jpg",
      "color": "#f8f9fa",
      "pattern": "dots",
      "opacity": 0.1
    }
  }
}
```

### Background CSS
```css
/* Background Patterns */
.body-background {
  background-image:
    radial-gradient(circle, #e9ecef 1px, transparent 1px);
  background-size: 20px 20px;
}

.hero-background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

/* Image Overlays */
.content-overlay {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin: 1rem 0;
}
```

## 📱 Responsive Design

### Mobile-First CSS
```css
/* Mobile Styles */
@media (max-width: 576px) {
  .container {
    padding: 0 1rem;
  }

  .api-endpoint {
    flex-direction: column;
  }

  .method-badge {
    margin-bottom: 0.5rem;
    align-self: flex-start;
  }
}

/* Tablet Styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }
}

/* Desktop Styles */
@media (min-width: 992px) {
  .api-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
}
```

## 🎭 Dark Mode Support

### Dark Mode CSS
```css
/* Dark Mode Variables */
[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #e0e0e0;
  --border-color: #333;
  --card-bg: #2d2d2d;
  --code-bg: #1e1e1e;
}

/* Dark Mode Styles */
[data-theme="dark"] body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

[data-theme="dark"] .card {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}

[data-theme="dark"] pre {
  background-color: var(--code-bg);
  border-color: var(--border-color);
}

/* Theme Toggle */
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
}
```

### Dark Mode JavaScript
```javascript
// theme-toggle.js
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
});
```

## 🔧 Advanced Customization

### Custom Components
```json
{
  "template": {
    "components": {
      "customEndpoint": "./components/custom-endpoint.hbs",
      "customGroup": "./components/custom-group.hbs",
      "customAuth": "./components/custom-auth.hbs"
    }
  }
}
```

### Handlebars Helpers
```javascript
// custom-helpers.js
const Handlebars = require('handlebars');

// Custom helper for formatting dates
Handlebars.registerHelper('formatDate', function(date) {
  return new Date(date).toLocaleDateString();
});

// Custom helper for method colors
Handlebars.registerHelper('methodColor', function(method) {
  const colors = {
    'GET': 'success',
    'POST': 'primary',
    'PUT': 'warning',
    'DELETE': 'danger',
    'PATCH': 'info'
  };
  return colors[method.toUpperCase()] || 'secondary';
});

// Custom helper for icon rendering
Handlebars.registerHelper('icon', function(iconName, className) {
  return new Handlebars.SafeString(
    `<i class="fa fa-${iconName} ${className || ''}"></i>`
  );
});
```

## 📋 Best Practices

### 1. Performance
- ✅ Optimize images (WebP format recommended)
- ✅ Minify CSS and JavaScript
- ✅ Use CSS variables for theme consistency
- ✅ Implement lazy loading for images

### 2. Accessibility
- ✅ Provide alt text for all images
- ✅ Ensure proper color contrast ratios
- ✅ Use semantic HTML elements
- ✅ Support keyboard navigation

### 3. Branding
- ✅ Maintain consistent color schemes
- ✅ Use brand fonts and typography
- ✅ Include company logos and imagery
- ✅ Follow brand guidelines

### 4. Responsive Design
- ✅ Test on multiple device sizes
- ✅ Use flexible layouts
- ✅ Optimize for touch interfaces
- ✅ Consider mobile-first approach

APIDoc's customization system provides the flexibility to create documentation that matches your brand while maintaining professional appearance and excellent user experience.