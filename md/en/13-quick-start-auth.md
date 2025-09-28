---
title: "Quick Start Authentication Setup"
category: "Security"
order: 13
---

# 🚀 Quick Start Authentication Setup

Get APIDoc authentication running in 3 simple steps with pre-configured templates and examples for immediate development.

## ⚡ 3-Step Quick Setup

### Step 1: Choose Authentication Method

#### Option A: Local File Authentication (Fastest)
```json
{
  "name": "My Secure API",
  "version": "1.0.0",
  "authentication": {
    "enabled": true,
    "type": "local",
    "users": [
      {
        "username": "admin",
        "password": "admin123",
        "role": "admin"
      },
      {
        "username": "developer",
        "password": "dev123",
        "role": "developer"
      },
      {
        "username": "viewer",
        "password": "view123",
        "role": "viewer"
      }
    ],
    "session": {
      "secret": "your-secret-key-change-this",
      "timeout": 3600
    }
  }
}
```

#### Option B: Remote API Authentication
```json
{
  "name": "My Enterprise API",
  "version": "1.0.0",
  "authentication": {
    "enabled": true,
    "type": "remote",
    "endpoint": "https://auth.yourcompany.com/api/validate",
    "headers": {
      "Authorization": "Bearer YOUR_API_KEY",
      "Content-Type": "application/json"
    },
    "session": {
      "secret": "your-secret-key-change-this",
      "timeout": 7200
    }
  }
}
```

### Step 2: Generate Documentation
```bash
# Install APIDoc (if not already installed)
npm install -g @hrefcl/apidoc

# Generate protected documentation
apidoc -i src/ -o docs/

# Start local server with authentication
cd docs && python -m http.server 8080
# OR
cd docs && npx http-server -p 8080
```

### Step 3: Access Protected Documentation
1. **Open browser**: Navigate to `http://localhost:8080`
2. **Login**: Use credentials from Step 1
3. **Explore**: Browse your protected API documentation

**🎉 That's it! Your API documentation is now secured and ready to use.**

## 🔐 Pre-configured Templates

### Development Template
Perfect for local development and testing:

```json
{
  "name": "Development API",
  "version": "1.0.0",
  "description": "Development API with basic authentication",
  "authentication": {
    "enabled": true,
    "type": "local",
    "loginPage": {
      "title": "Dev API Access",
      "subtitle": "Development Environment",
      "logo": "./assets/dev-logo.png",
      "backgroundImage": "./assets/dev-bg.jpg"
    },
    "users": [
      {
        "username": "dev",
        "password": "dev123",
        "role": "developer",
        "name": "Developer User",
        "permissions": ["read", "write", "test"]
      },
      {
        "username": "test",
        "password": "test123",
        "role": "tester",
        "name": "Test User",
        "permissions": ["read", "test"]
      }
    ],
    "session": {
      "secret": "dev-secret-key-not-for-production",
      "timeout": 28800,
      "rememberMe": true
    },
    "security": {
      "maxAttempts": 10,
      "lockoutDuration": 300,
      "requireHttps": false
    }
  }
}
```

### Production Template
Enterprise-ready configuration:

```json
{
  "name": "Production API",
  "version": "1.0.0",
  "description": "Production API with enterprise authentication",
  "authentication": {
    "enabled": true,
    "type": "remote",
    "endpoint": "https://auth.company.com/api/validate",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}",
      "Content-Type": "application/json",
      "X-Client-ID": "apidoc-portal"
    },
    "loginPage": {
      "title": "API Documentation Portal",
      "subtitle": "Enterprise API Access",
      "logo": "./assets/company-logo.png",
      "customCSS": "./assets/enterprise-login.css",
      "footer": "© 2024 Company Name. All rights reserved."
    },
    "session": {
      "secret": "${SESSION_SECRET}",
      "timeout": 3600,
      "secure": true,
      "sameSite": "strict"
    },
    "security": {
      "maxAttempts": 3,
      "lockoutDuration": 900,
      "requireHttps": true,
      "csrfProtection": true,
      "sessionRegeneration": true
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

### Team Collaboration Template
Multi-role team setup:

```json
{
  "name": "Team API",
  "version": "1.0.0",
  "authentication": {
    "enabled": true,
    "type": "local",
    "users": [
      {
        "username": "product-manager",
        "password": "pm2024!",
        "role": "product",
        "name": "Product Manager",
        "permissions": ["read", "feedback"],
        "email": "pm@company.com"
      },
      {
        "username": "frontend-dev",
        "password": "fe2024!",
        "role": "frontend",
        "name": "Frontend Developer",
        "permissions": ["read", "test", "examples"],
        "email": "frontend@company.com"
      },
      {
        "username": "backend-dev",
        "password": "be2024!",
        "role": "backend",
        "name": "Backend Developer",
        "permissions": ["read", "write", "admin"],
        "email": "backend@company.com"
      },
      {
        "username": "qa-engineer",
        "password": "qa2024!",
        "role": "qa",
        "name": "QA Engineer",
        "permissions": ["read", "test", "report"],
        "email": "qa@company.com"
      }
    ],
    "roleConfig": {
      "product": {
        "landingPage": "/overview",
        "theme": "business",
        "features": ["changelog", "roadmap"]
      },
      "frontend": {
        "landingPage": "/examples",
        "theme": "developer",
        "features": ["interactive", "code-samples"]
      },
      "backend": {
        "landingPage": "/technical",
        "theme": "technical",
        "features": ["admin", "logs", "metrics"]
      },
      "qa": {
        "landingPage": "/testing",
        "theme": "testing",
        "features": ["test-cases", "coverage"]
      }
    }
  }
}
```

## ⚙️ Environment-Specific Configurations

### Development Environment
```bash
# .env.development
NODE_ENV=development
AUTH_TYPE=local
SESSION_SECRET=dev-secret-not-for-production
AUTH_TIMEOUT=28800
REQUIRE_HTTPS=false
MAX_LOGIN_ATTEMPTS=10
```

```json
{
  "authentication": {
    "enabled": true,
    "type": "${AUTH_TYPE}",
    "session": {
      "secret": "${SESSION_SECRET}",
      "timeout": "${AUTH_TIMEOUT}",
      "secure": false
    },
    "security": {
      "requireHttps": false,
      "maxAttempts": "${MAX_LOGIN_ATTEMPTS}"
    }
  }
}
```

### Staging Environment
```bash
# .env.staging
NODE_ENV=staging
AUTH_TYPE=remote
AUTH_ENDPOINT=https://staging-auth.company.com/api/validate
API_TOKEN=staging_token_here
SESSION_SECRET=staging-secret-key
AUTH_TIMEOUT=7200
REQUIRE_HTTPS=true
MAX_LOGIN_ATTEMPTS=5
```

### Production Environment
```bash
# .env.production
NODE_ENV=production
AUTH_TYPE=remote
AUTH_ENDPOINT=https://auth.company.com/api/validate
API_TOKEN=production_token_here
SESSION_SECRET=super-secure-production-secret
AUTH_TIMEOUT=3600
REQUIRE_HTTPS=true
MAX_LOGIN_ATTEMPTS=3
AUDIT_ENABLED=true
```

## 🎨 Quick UI Customization

### Simple Branding
```json
{
  "authentication": {
    "loginPage": {
      "title": "My Company API",
      "subtitle": "Developer Portal",
      "logo": "./assets/logo.png",
      "primaryColor": "#007bff",
      "backgroundColor": "#f8f9fa"
    }
  }
}
```

### Custom CSS (Optional)
```css
/* assets/custom-login.css */
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.company-logo {
  max-height: 60px;
  margin-bottom: 2rem;
}

.login-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  transition: transform 0.2s;
}

.login-button:hover {
  transform: translateY(-2px);
}
```

## 🔧 Integration Examples

### Express.js Integration
```javascript
// server.js
const express = require('express');
const path = require('path');
const { authMiddleware } = require('@hrefcl/apidoc');

const app = express();

// Serve API documentation with authentication
app.use('/docs', authMiddleware({
  configFile: './apidoc.json',
  staticPath: './docs'
}));

// Your API routes
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Docs available at http://localhost:3000/docs');
});
```

### Docker Integration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application files
COPY . .

# Generate documentation
RUN npx apidoc -i src/ -o docs/

# Expose port
EXPOSE 3000

# Start server with authentication
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api-docs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - AUTH_TYPE=remote
      - AUTH_ENDPOINT=https://auth.company.com/api/validate
      - API_TOKEN=${API_TOKEN}
      - SESSION_SECRET=${SESSION_SECRET}
    volumes:
      - ./docs:/app/docs:ro
    restart: unless-stopped
```

### GitHub Actions CI/CD
```yaml
# .github/workflows/deploy-docs.yml
name: Deploy API Documentation

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Generate documentation
      run: npx apidoc -i src/ -o docs/
      env:
        AUTH_TYPE: remote
        AUTH_ENDPOINT: ${{ secrets.AUTH_ENDPOINT }}
        API_TOKEN: ${{ secrets.API_TOKEN }}
        SESSION_SECRET: ${{ secrets.SESSION_SECRET }}

    - name: Deploy to staging
      if: github.ref == 'refs/heads/develop'
      run: |
        echo "Deploying to staging..."
        # Your staging deployment commands

    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: |
        echo "Deploying to production..."
        # Your production deployment commands
```

## 🛠️ Troubleshooting Quick Fixes

### Common Issues & Solutions

#### Issue: "Authentication not working"
```bash
# Check your configuration
apidoc --validate-config

# Test with minimal config
echo '{"authentication":{"enabled":true,"type":"local","users":[{"username":"test","password":"test","role":"user"}]}}' > test-config.json
apidoc -i src/ -o docs/ -c test-config.json
```

#### Issue: "Can't access after login"
```json
{
  "authentication": {
    "session": {
      "secret": "change-this-secret-key",
      "timeout": 3600,
      "secure": false
    }
  }
}
```

#### Issue: "Remote authentication failing"
```bash
# Test your auth endpoint
curl -X POST https://your-auth-endpoint.com/api/validate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

#### Issue: "HTTPS redirect loop"
```json
{
  "authentication": {
    "security": {
      "requireHttps": false
    }
  }
}
```

### Debug Mode
```json
{
  "authentication": {
    "debug": true,
    "verbose": true
  }
}
```

## 📱 Mobile-Friendly Setup
```json
{
  "authentication": {
    "loginPage": {
      "responsive": true,
      "mobileOptimized": true,
      "touchFriendly": true
    }
  }
}
```

## 📋 Next Steps

After quick setup, consider:

1. **📚 Read Full Documentation**: [Authentication Guide](./12-authentication.md)
2. **🔧 Advanced Configuration**: [Developer Guide](./14-auth-developer.md)
3. **🎨 UI Customization**: [Customization Guide](./02-customization.md)
4. **🔐 Security Hardening**: Review security best practices
5. **📊 Monitoring**: Set up access logs and analytics

**🎯 Your secured API documentation is now ready for your team!**