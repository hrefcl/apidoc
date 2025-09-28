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

### 2. Create Markdown Files

Create markdown files in your project directory:

**`docs/users.md`:**
```markdown
## 👥 User Management

This section contains all endpoints related to user operations and profile management.

### Authentication Required

All user endpoints require a valid JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting

Different rate limits apply based on user tier:

| User Type | Requests/Minute | Burst Limit |
|-----------|----------------|-------------|
| Free      | 60             | 100         |
| Premium   | 600            | 1000        |
| Enterprise| 6000           | 10000       |

### Common Response Codes

- `200` - Success
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - User not found
- `429` - Rate limit exceeded

### Usage Examples

#### Get Current User Profile
```javascript
const response = await fetch('/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

> 💡 **Tip**: Always validate user permissions before performing operations that modify user data.
```

**`docs/auth.md`:**
```markdown
## 🔐 Authentication & Security

Our API uses JWT (JSON Web Tokens) for authentication with optional OAuth2 integration.

### Authentication Flow

1. **Login**: Exchange credentials for JWT token
2. **Token Usage**: Include token in Authorization header
3. **Refresh**: Use refresh token to get new access token
4. **Logout**: Invalidate tokens (optional)

### Security Best Practices

⚠️ **Important Security Guidelines:**

- Always use HTTPS in production
- Store tokens securely (httpOnly cookies recommended)
- Implement proper token expiration (15 minutes for access tokens)
- Use refresh tokens for longer sessions
- Validate tokens on every request

### Token Structure

Our JWT tokens contain the following claims:

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "admin|user|moderator",
  "iat": 1640995200,
  "exp": 1640998800
}
```

### Error Handling

Authentication errors return consistent error responses:

```json
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Token has expired",
  "code": 401
}
```
```

### 3. Generate Documentation

Run APIDoc to generate your documentation with custom markdown content:

```bash
# Basic generation
apidoc -i src/ -o docs/

# With verbose output
apidoc -v -i src/ -o docs/

# The custom markdown will automatically appear at the top of each section
```

## 🔧 Configuration Reference

### Settings Object Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `icon` | string | No | Font Awesome icon class (e.g., `fa-user`, `fa-cog`) |
| `title` | string | No | Custom display title for the section |
| `filename` | string | **Yes** | Path to markdown file (relative to source directory) |

### Example Configuration

```json
{
  "settings": {
    "GroupName": {
      "icon": "fa-icon-name",
      "title": "Custom Display Title",
      "filename": "path/to/markdown/file.md"
    }
  }
}
```

## 📝 Markdown Features

### Supported Markdown Syntax

The custom markdown content supports full markdown syntax including:

- **Headers** (`#`, `##`, `###`)
- **Text formatting** (`**bold**`, `*italic*`, `~~strikethrough~~`)
- **Lists** (ordered and unordered)
- **Tables** with alignment support
- **Code blocks** with syntax highlighting
- **Links** and **images**
- **Blockquotes**
- **Horizontal rules**
- **HTML** (embedded HTML elements)

### Code Syntax Highlighting

Code blocks support syntax highlighting for all major languages:

```json
{
  "example": "JSON syntax highlighting"
}
```

```javascript
// JavaScript syntax highlighting
function example() {
  return "Hello World";
}
```

```bash
# Bash syntax highlighting
curl -X GET https://api.example.com/users
```

### Tables

Create professional-looking tables:

| Feature | Status | Notes |
|---------|--------|-------|
| Custom Icons | ✅ | Font Awesome icons |
| Markdown Support | ✅ | Full markdown syntax |
| Syntax Highlighting | ✅ | 100+ languages |
| HTML Integration | ✅ | Seamless rendering |

### Callouts and Alerts

Use blockquotes for important information:

> 💡 **Tip**: This is a helpful tip for developers.

> ⚠️ **Warning**: This is an important warning.

> ❌ **Error**: This describes an error condition.

> ✅ **Success**: This indicates a successful operation.

## 🎨 Integration with Icons

Custom markdown content integrates perfectly with Font Awesome icons:

### Icon Configuration

```json
{
  "settings": {
    "Users": {
      "icon": "fa-users",
      "title": "User Management",
      "filename": "docs/users.md"
    },
    "Analytics": {
      "icon": "fa-chart-bar",
      "title": "Analytics & Reports",
      "filename": "docs/analytics.md"
    }
  }
}
```

### Popular Icon Choices

| API Section | Recommended Icons |
|-------------|------------------|
| Users/Auth | `fa-user`, `fa-users`, `fa-shield-alt` |
| Admin | `fa-crown`, `fa-cog`, `fa-tools` |
| Files | `fa-folder`, `fa-file`, `fa-upload` |
| Analytics | `fa-chart-bar`, `fa-chart-line` |
| Payment | `fa-credit-card`, `fa-dollar-sign` |
| Location | `fa-map-marker-alt`, `fa-globe` |
| Communication | `fa-envelope`, `fa-comments` |

## 🌍 Multilingual Support

Use custom titles for localization:

```json
{
  "settings": {
    "Users": {
      "icon": "fa-user",
      "title": "Gestión de Usuarios",
      "filename": "docs/usuarios.md"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Operaciones de Empresa",
      "filename": "docs/empresa.md"
    }
  }
}
```

## 📁 File Organization

### Recommended Directory Structure

```
your-project/
├── src/                    # Your API source code
├── docs/                   # Custom markdown files
│   ├── users.md
│   ├── auth.md
│   ├── company.md
│   └── analytics.md
├── apidoc.json             # APIDoc configuration
└── generated-docs/         # Generated documentation output
```

### Alternative Organization

```
your-project/
├── src/
│   ├── controllers/
│   └── docs/               # Markdown files alongside source
│       ├── users.md
│       └── auth.md
├── apidoc.json
└── output/
```

## 🚀 Advanced Usage

### Dynamic Content

You can include dynamic content using markdown features:

```markdown
## 📊 API Statistics

Last updated: **$(date)**

### Current Status

- **Uptime**: 99.9%
- **Response Time**: < 100ms
- **Active Users**: 10,000+

### Recent Changes

Check our [changelog](./CHANGELOG.md) for the latest updates.
```

### Including External Content

Reference external documentation:

```markdown
## 📖 Additional Resources

For more detailed information, see:

- [API Design Guidelines](./DESIGN_GUIDELINES.md)
- [Security Best Practices](./SECURITY.md)
- [Rate Limiting Details](./RATE_LIMITS.md)

### External Links

- [OpenAPI Specification](https://swagger.io/specification/)
- [JWT.io](https://jwt.io/)
- [RESTful API Design](https://restfulapi.net/)
```

### Conditional Content

Use HTML comments for conditional content:

```markdown
<!-- Development Environment Only -->
## 🔧 Development Tools

This section is only relevant for development environments.

### Debug Endpoints

These endpoints are available only in development mode:

- `GET /debug/health` - Health check with detailed info
- `GET /debug/metrics` - Internal metrics
- `POST /debug/reset` - Reset development data

<!-- End Development Content -->
```

## 🔍 Troubleshooting

### Common Issues

**Markdown file not found:**
- Verify the `filename` path is relative to your source directory
- Check file permissions and accessibility
- Ensure the file extension is `.md`

**Content not rendering:**
- Verify your `apidoc.json` syntax is valid JSON
- Check that the group name matches exactly (case-sensitive)
- Ensure markdown syntax is valid

**Icons not displaying:**
- Verify Font Awesome icon class names (e.g., `fa-user`, not `user`)
- Check that the icon exists in the Font Awesome library
- Icons are optional - content will display without them

### Debug Mode

Use verbose mode to see markdown processing:

```bash
apidoc -v -i src/ -o docs/
```

Look for log messages like:
```
verbose: 📝 Loaded custom markdown for group: Users
verbose: 📝 Loaded custom markdown for group: Company
```

## 📚 Examples

### Complete Working Example

**Project Structure:**
```
my-api/
├── src/
│   ├── users.js
│   ├── auth.js
│   └── company.js
├── docs/
│   ├── users.md
│   ├── auth.md
│   └── company.md
├── apidoc.json
└── output/
```

**`apidoc.json`:**
```json
{
  "name": "My API Documentation",
  "version": "1.0.0",
  "description": "Comprehensive API documentation with custom content",
  "url": "https://api.example.com",
  "settings": {
    "Users": {
      "icon": "fa-users",
      "title": "User Management",
      "filename": "docs/users.md"
    },
    "Authentication": {
      "icon": "fa-shield-alt",
      "title": "Authentication",
      "filename": "docs/auth.md"
    },
    "Company": {
      "icon": "fa-building",
      "title": "Company Operations",
      "filename": "docs/company.md"
    }
  },
  "order": ["Authentication", "Users", "Company"]
}
```

**Generate Documentation:**
```bash
apidoc -i src/ -o output/
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

- **[Font Awesome Icons](README.md#-custom-icons--localization)** - Complete icon customization guide
- **[Authentication System](README.md#-new-dual-authentication-system)** - Protect your documentation
- **[MQTT Support](README.md#-new-complete-mqtt-protocol-support)** - Document MQTT APIs
- **[OpenAPI Integration](README.md#-new-native-openapi-30-support)** - Use OpenAPI specifications

---

**Made with ❤️ by the APIDoc community**