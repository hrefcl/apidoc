---
title: "Authentication System README"
category: "Security"
order: 12.3
---

# 🔐 APIDoc Authentication System

Professional authentication system for securing API documentation with dual authentication support, enterprise-grade security, and seamless user experience.

## ⚡ Quick Start

### 1-Minute Setup
```json
{
  "authentication": {
    "enabled": true,
    "type": "local",
    "users": [
      {
        "username": "admin",
        "password": "admin123",
        "role": "admin"
      }
    ]
  }
}
```

```bash
# Generate protected documentation
apidoc -i src/ -o docs/

# Access at: http://localhost:8080
# Login: admin / admin123
```

## 🌟 Key Features

### 🔒 Dual Authentication System
- **Local Authentication**: File-based user management
- **Remote Authentication**: External API integration
- **Seamless Switching**: Easy configuration between modes

### 🛡️ Enterprise Security
- **Session Management**: Secure, configurable sessions
- **Rate Limiting**: Brute force protection
- **CSRF Protection**: Cross-site request forgery prevention
- **Password Security**: bcrypt hashing with configurable strength

### 🎨 Professional UI
- **Modern Design**: Clean, responsive interface
- **Custom Branding**: Logo, colors, and styling
- **Mobile Optimized**: Perfect on all devices
- **Dark Mode**: Automatic theme detection

### 🔧 Advanced Features
- **Remember Me**: Persistent login sessions
- **Account Lockout**: Automatic security measures
- **Audit Logging**: Comprehensive access logs
- **Multi-language**: Internationalization support

## 📋 Authentication Types

### Local Authentication
Perfect for teams and internal documentation.

```json
{
  "authentication": {
    "type": "local",
    "users": [
      {
        "username": "developer",
        "password": "dev2024!",
        "role": "developer",
        "name": "John Developer",
        "email": "john@company.com",
        "permissions": ["read", "write"]
      },
      {
        "username": "manager",
        "password": "mgr2024!",
        "role": "manager",
        "name": "Jane Manager",
        "email": "jane@company.com",
        "permissions": ["read", "admin"]
      }
    ]
  }
}
```

### Remote Authentication
Enterprise integration with existing systems.

```json
{
  "authentication": {
    "type": "remote",
    "endpoint": "https://auth.company.com/api/validate",
    "headers": {
      "Authorization": "Bearer YOUR_API_TOKEN",
      "Content-Type": "application/json"
    },
    "timeout": 5000,
    "retries": 3
  }
}
```

## 🎯 Use Cases

### Development Teams
```json
{
  "authentication": {
    "enabled": true,
    "type": "local",
    "users": [
      {
        "username": "frontend",
        "password": "fe2024!",
        "role": "frontend",
        "permissions": ["read", "examples"]
      },
      {
        "username": "backend",
        "password": "be2024!",
        "role": "backend",
        "permissions": ["read", "write", "admin"]
      },
      {
        "username": "qa",
        "password": "qa2024!",
        "role": "qa",
        "permissions": ["read", "test"]
      }
    ],
    "roleConfig": {
      "frontend": {
        "landingPage": "/examples",
        "theme": "developer"
      },
      "backend": {
        "landingPage": "/technical",
        "theme": "technical"
      },
      "qa": {
        "landingPage": "/testing",
        "theme": "testing"
      }
    }
  }
}
```

### Enterprise Deployment
```json
{
  "authentication": {
    "enabled": true,
    "type": "remote",
    "endpoint": "https://sso.enterprise.com/api/auth",
    "headers": {
      "Authorization": "Bearer ${ENTERPRISE_TOKEN}",
      "X-Client-ID": "apidoc-portal"
    },
    "security": {
      "requireHttps": true,
      "maxAttempts": 3,
      "lockoutDuration": 1800,
      "csrfProtection": true
    },
    "audit": {
      "enabled": true,
      "logFile": "/var/log/apidoc-auth.log",
      "includeIP": true,
      "includeUserAgent": true
    }
  }
}
```

### Client Portal
```json
{
  "authentication": {
    "enabled": true,
    "type": "local",
    "loginPage": {
      "title": "Developer Portal",
      "subtitle": "Access your API documentation",
      "logo": "./assets/client-logo.png",
      "primaryColor": "#007bff",
      "customCSS": "./assets/client-theme.css"
    },
    "users": [
      {
        "username": "client1",
        "password": "secure123!",
        "role": "client",
        "name": "Client Company",
        "permissions": ["read"],
        "metadata": {
          "company": "Client Corp",
          "tier": "premium"
        }
      }
    ]
  }
}
```

## 🔧 Configuration Reference

### Basic Configuration
```json
{
  "authentication": {
    "enabled": true,
    "type": "local|remote",
    "debug": false,
    "verbose": true
  }
}
```

### Session Configuration
```json
{
  "authentication": {
    "session": {
      "secret": "your-session-secret-key",
      "timeout": 3600,
      "secure": true,
      "httpOnly": true,
      "sameSite": "strict",
      "rememberMe": true,
      "maxAge": 2592000
    }
  }
}
```

### Security Configuration
```json
{
  "authentication": {
    "security": {
      "maxAttempts": 5,
      "lockoutDuration": 900,
      "requireHttps": true,
      "csrfProtection": true,
      "sessionRegeneration": true,
      "passwordStrength": {
        "enabled": true,
        "minLength": 8,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireNumbers": true,
        "requireSymbols": false
      }
    }
  }
}
```

### UI Customization
```json
{
  "authentication": {
    "loginPage": {
      "title": "Your API Portal",
      "subtitle": "Secure documentation access",
      "logo": "./assets/logo.png",
      "favicon": "./assets/favicon.ico",
      "primaryColor": "#007bff",
      "secondaryColor": "#6c757d",
      "backgroundColor": "#f8f9fa",
      "backgroundImage": "./assets/background.jpg",
      "customCSS": "./assets/custom-login.css",
      "languages": {
        "en": { "title": "API Documentation" },
        "es": { "title": "Documentación API" },
        "fr": { "title": "Documentation API" }
      },
      "defaultLanguage": "en"
    }
  }
}
```

## 🚀 Quick Installation

### NPM Installation
```bash
# Install APIDoc with authentication
npm install -g @hrefcl/apidoc

# Generate protected documentation
apidoc -i src/ -o docs/ --auth
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .

RUN npm install -g @hrefcl/apidoc && \
    apidoc -i src/ -o docs/

EXPOSE 3000

CMD ["npx", "http-server", "docs", "-p", "3000"]
```

```bash
# Build and run
docker build -t my-api-docs .
docker run -p 3000:3000 my-api-docs
```

### Docker Compose
```yaml
version: '3.8'

services:
  api-docs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - AUTH_TYPE=remote
      - AUTH_ENDPOINT=https://auth.company.com/api/validate
      - SESSION_SECRET=${SESSION_SECRET}
    volumes:
      - ./docs:/app/docs
    restart: unless-stopped
```

## 🌐 Environment Configuration

### Development
```bash
# .env.development
NODE_ENV=development
AUTH_ENABLED=true
AUTH_TYPE=local
SESSION_SECRET=dev-secret-key
SESSION_TIMEOUT=28800
MAX_LOGIN_ATTEMPTS=10
REQUIRE_HTTPS=false
```

### Staging
```bash
# .env.staging
NODE_ENV=staging
AUTH_ENABLED=true
AUTH_TYPE=remote
AUTH_ENDPOINT=https://staging-auth.company.com/api/validate
SESSION_SECRET=staging-secret-key
SESSION_TIMEOUT=7200
MAX_LOGIN_ATTEMPTS=5
REQUIRE_HTTPS=true
```

### Production
```bash
# .env.production
NODE_ENV=production
AUTH_ENABLED=true
AUTH_TYPE=remote
AUTH_ENDPOINT=https://auth.company.com/api/validate
SESSION_SECRET=super-secure-production-secret
SESSION_TIMEOUT=3600
MAX_LOGIN_ATTEMPTS=3
REQUIRE_HTTPS=true
AUDIT_ENABLED=true
```

## 🔍 Monitoring & Analytics

### Access Logs
```json
{
  "authentication": {
    "audit": {
      "enabled": true,
      "logFile": "./logs/auth.log",
      "logLevel": "info",
      "includeIP": true,
      "includeUserAgent": true,
      "logSuccessfulLogins": true,
      "logFailedAttempts": true,
      "logLogouts": true,
      "logSessionExpiry": true
    }
  }
}
```

### Metrics Dashboard
```javascript
// Example log analysis
{
  "timestamp": "2024-01-15T14:30:00Z",
  "event": "login_success",
  "username": "developer",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "sessionId": "abc123...",
  "duration": 145
}
```

## 🧪 Testing

### Unit Tests
```javascript
// test/auth.test.js
const { AuthSystem } = require('@hrefcl/apidoc');

describe('Authentication System', () => {
  test('should authenticate valid user', async () => {
    const auth = new AuthSystem({
      type: 'local',
      users: [{ username: 'test', password: 'test123' }]
    });

    const result = await auth.authenticate('test', 'test123');
    expect(result.success).toBe(true);
  });

  test('should reject invalid credentials', async () => {
    const auth = new AuthSystem({
      type: 'local',
      users: [{ username: 'test', password: 'test123' }]
    });

    const result = await auth.authenticate('test', 'wrong');
    expect(result.success).toBe(false);
  });
});
```

### Integration Tests
```bash
# Test authentication endpoints
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Test protected endpoint
curl -H "Cookie: session=..." \
  http://localhost:3000/docs/
```

## 📚 Documentation Links

### Quick Start
- [3-Step Quick Setup](./13-quick-start-auth.md)
- [Complete Authentication Guide](./12-authentication.md)
- [Developer Reference](./14-auth-developer.md)

### Advanced Topics
- [Login Interface Customization](./12-authentication-login.md)
- [System Changelog](./12-authentication-changelog.md)
- [Security Best Practices](./12-authentication.md#1-security)

### Integration Guides
- [Docker Integration](./16-docker.md)
- [Build Tools Integration](./17-build-tools.md)
- [Programmatic Usage](./08-programmatic-usage.md)

## 🆘 Support & Troubleshooting

### Common Issues

#### Authentication not working
```bash
# Check configuration
apidoc --validate-config

# Debug mode
AUTH_DEBUG=true apidoc -i src/ -o docs/
```

#### Session issues
```json
{
  "authentication": {
    "session": {
      "secret": "change-this-secret",
      "secure": false,
      "sameSite": "lax"
    }
  }
}
```

#### HTTPS redirect loop
```json
{
  "authentication": {
    "security": {
      "requireHttps": false
    }
  }
}
```

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Discord**: Community support and discussion
- **Email**: enterprise@apidoc.com for enterprise support
- **Documentation**: Complete guides and references

## 📄 License

APIDoc Authentication System is part of APIDoc 4.0 and is licensed under the MIT License.

---

**Start securing your API documentation today with professional authentication that your team and clients will love!**