# 🎨 Icons and Customization

APIDoc 5.0 allows you to completely customize the appearance of your documentation with Font Awesome icons, custom logos, and theme configuration.

## 🏷️ Group Icons

### Basic configuration

Assign Font Awesome icons to your API groups in `apidoc.json`:

```json
{
  "name": "My API",
  "version": "1.0.0",
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Users"
    },
    "Authentication": {
      "icon": "fa-shield-alt",
      "title": "Authentication"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Company"
    },
    "Payment": {
      "icon": "fa-credit-card",
      "title": "Payments"
    }
  }
}
```

### Popular icons by category

| Category | Recommended Icons | CSS Classes |
|----------|------------------|-------------|
| **Users** | 👤👥🛡️ | `fa-user`, `fa-users`, `fa-shield-alt` |
| **Administration** | ⚙️🔧👑 | `fa-cog`, `fa-tools`, `fa-crown` |
| **Payments** | 💳💰🏦 | `fa-credit-card`, `fa-dollar-sign`, `fa-bank` |
| **Files** | 📁📤📥 | `fa-folder`, `fa-upload`, `fa-download` |
| **Analytics** | 📊📈📉 | `fa-chart-line`, `fa-chart-bar`, `fa-analytics` |
| **Location** | 📍🌍🗺️ | `fa-map-marker-alt`, `fa-globe`, `fa-map` |
| **Communication** | 📧💬📞 | `fa-envelope`, `fa-comments`, `fa-phone` |
| **Company** | 🏢💼📋 | `fa-building`, `fa-briefcase`, `fa-clipboard` |

## 🖼️ Custom Logo

### Logo configuration

```json
{
  "logo": {
    "url": "https://example.com/logo.png",
    "alt": "Company Logo",
    "width": "40px",
    "height": "40px"
  }
}
```

### Logo options

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `url` | String | Image URL (absolute, relative, or data URL) | - |
| `icon` | String | Font Awesome icon class | - |
| `alt` | String | Alternative text for accessibility | `"Logo"` |
| `width` | String | Width in CSS units | `"32px"` |
| `height` | String | Height in CSS units | `"32px"` |

### Logo types

**Image logo:**
```json
{
  "logo": {
    "url": "/assets/company-logo.svg",
    "alt": "Acme Corp Logo",
    "width": "45px",
    "height": "35px"
  }
}
```

**Font Awesome icon logo:**
```json
{
  "logo": {
    "icon": "fa-rocket",
    "alt": "API Documentation"
  }
}
```

**Data URL logo (embedded image):**
```json
{
  "logo": {
    "url": "data:image/svg+xml;base64,PHN2Zz...",
    "alt": "Embedded Logo",
    "width": "30px"
  }
}
```

### Logo priority

1. **Custom image** (`url`) - highest priority
2. **Font Awesome icon** (`icon`) - if no URL
3. **Default SVG icon** - fallback if no configuration


### Configuration

```json
{
  "header": {
    "title": "Getting Started",
    "filename": "header.md",
    "icon": "fa-home"
  },
  "footer": {
    "title": "Best Practices",
    "filename": "footer.md",
    "icon": "fa-lightbulb"
  }
}
```

### Recommended icons for header/footer

| Section | Purpose | Suggested Icons |
|---------|---------|-----------------|
| **Header** | Introduction, welcome | `fa-home`, `fa-info-circle`, `fa-book` |
| **Footer** | Contact, support | `fa-envelope`, `fa-phone`, `fa-support` |
| **Guides** | Documentation, tutorials | `fa-lightbulb`, `fa-graduation-cap`, `fa-guide` |
| **Legal** | Terms, privacy | `fa-gavel`, `fa-shield-alt`, `fa-lock` |

## 🌍 Title Localization

### Custom titles

```json
{
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Users"
    },
    "Authentication": {
      "icon": "fa-shield-alt",
      "title": "Authentication"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Company"
    }
  }
}
```

### Localization benefits

- **Consistency**: Standardized names throughout documentation
- **Professionalism**: Appropriate titles for your audience
- **Flexibility**: Change names without modifying source code
- **Multi-language**: Support for different languages

## 💡 Smart Icon System

### Automatic prioritization

APIDoc uses the following priority order for icons:

1. **Custom icons** from `settings` (highest priority)
2. **Header/footer icons** from project configuration
3. **Default icons** for common group names
4. **Generic icon** (`fa-file-alt`) as fallback

### Default icons

| Group Name | Automatic Icon | CSS Class |
|------------|---------------|-----------|
| User, Users | 👤 | `fa-user` |
| Admin, Administration | ⚙️ | `fa-cog` |
| Auth, Authentication | 🛡️ | `fa-shield-alt` |
| Company, Business | 🏢 | `fa-building` |
| Payment, Billing | 💳 | `fa-credit-card` |
| File, Files | 📁 | `fa-folder` |
| System | 🖥️ | `fa-desktop` |
| API, General | 📋 | `fa-file-alt` |

## 🔧 Technical Implementation

### Local Font Awesome

- **No CDN**: Font Awesome CSS included locally
- **Complete library**: Access to all icons
- **Smart fallbacks**: Automatic icons for unconfigured groups
- **Professional appearance**: Modern and clean icons

### Compatibility

- **All browsers**: Universal support
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Automatic alternative text for screen readers
- **Performance**: Optimized resource loading

## 📚 Additional Resources

- **[📋 Configuration](./01-configuration.md)** - Complete configuration options
- **[📄 Custom Markdown](./03-custom-markdown.md)** - Markdown content per section
- **[📄 Markdown Examples](./04-custom-markdown-examples.md)** - Practical examples
