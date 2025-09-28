---
title: "Authentication System"
category: "Security"
order: 12
---

# 🔐 Authentication System

APIDoc 4.0 includes a comprehensive authentication system to protect your API documentation from unauthorized access. Support for both local and remote authentication methods.

## 🌟 Overview

### Authentication Features
- **🔒 Local Authentication**: Predefined user credentials
- **🌐 Remote Authentication**: Integration with external auth systems
- **🔄 Dual Mode**: Combined local and remote authentication
- **🎨 Customizable UI**: Branded login interface
- **⚡ Session Management**: Secure token-based sessions
- **🛡️ Security Headers**: CSRF and XSS protection

### Use Cases
- **Internal APIs**: Protect internal documentation
- **Client APIs**: Controlled access for partners
- **Enterprise**: Integration with SSO systems
- **Development**: Stage-specific access control

## ⚙️ Configuration

### Basic Local Authentication
```json
{
  "name": "Protected API",
  "version": "1.0.0",
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
    },
    "headers": {
      "Content-Type": "application/json",
      "X-API-Key": "your-api-key"
    }
  }
}
```

### Dual Authentication (Recommended)
```json
{
  "login": {
    "active": true,
    "admited": [
      {"email": "admin@company.com", "password": "secure123"}
    ],
    "urlAuth": "https://api.company.com/auth/login",
    "fallbackToLocal": true
  }
}
```

## 🔧 Advanced Configuration

### Complete Authentication Settings
```json
{
  "login": {
    "active": true,
    "title": "Company API Access",
    "subtitle": "Please authenticate to view documentation",
    "logo": "./assets/company-logo.png",
    "background": "./assets/login-bg.jpg",

    "admited": [
      {
        "email": "admin@company.com",
        "password": "secure123",
        "name": "Administrator",
        "role": "admin"
      }
    ],

    "urlAuth": "https://api.company.com/auth/login",
    "method": "POST",
    "fields": {
      "username": "email",
      "password": "password"
    },
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer api-key"
    },

    "sessionTimeout": 3600,
    "maxAttempts": 5,
    "lockoutDuration": 300,
    "rememberMe": true,
    "redirectAfterLogin": "/api/overview"
  }
}
```

### Authentication Options
| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `active` | Boolean | Enable authentication | `false` |
| `title` | String | Login page title | "API Access" |
| `subtitle` | String | Login page subtitle | "" |
| `logo` | String | Logo image path | "" |
| `background` | String | Background image path | "" |
| `admited` | Array | Local user accounts | `[]` |
| `urlAuth` | String | Remote auth endpoint | `""` |
| `method` | String | HTTP method for auth | `"POST"` |
| `fields` | Object | Field mapping | `{}` |
| `headers` | Object | Auth request headers | `{}` |
| `sessionTimeout` | Number | Session timeout (seconds) | `3600` |
| `maxAttempts` | Number | Max login attempts | `5` |
| `lockoutDuration` | Number | Lockout time (seconds) | `300` |
| `rememberMe` | Boolean | Remember me option | `true` |

## 🌐 Remote Authentication Integration

### Standard REST API
```json
{
  "login": {
    "active": true,
    "urlAuth": "https://api.company.com/auth/login",
    "method": "POST",
    "fields": {
      "username": "email",
      "password": "password"
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "responseTokenField": "access_token",
    "responseUserField": "user"
  }
}
```

### OAuth 2.0 Flow
```json
{
  "login": {
    "active": true,
    "urlAuth": "https://oauth.company.com/token",
    "method": "POST",
    "fields": {
      "grant_type": "password",
      "username": "email",
      "password": "password",
      "client_id": "apidoc-client"
    },
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic Y2xpZW50OnNlY3JldA=="
    }
  }
}
```

### Custom Authentication Provider
```json
{
  "login": {
    "active": true,
    "urlAuth": "https://auth.company.com/v2/authenticate",
    "method": "POST",
    "fields": {
      "identifier": "email",
      "secret": "password",
      "domain": "apidoc"
    },
    "headers": {
      "Content-Type": "application/json",
      "X-Client-Version": "4.0.5"
    },
    "responseMapping": {
      "token": "authentication.token",
      "user": "user_info",
      "expires": "authentication.expires_at"
    }
  }
}
```

## 🎨 UI Customization

### Branded Login Interface
```json
{
  "login": {
    "active": true,
    "title": "Company API Portal",
    "subtitle": "Secure access to internal APIs",
    "logo": "./assets/company-logo.png",
    "background": "./assets/login-background.jpg",
    "theme": {
      "primaryColor": "#007bff",
      "backgroundColor": "#f8f9fa",
      "textColor": "#212529",
      "borderRadius": "8px"
    },
    "customCSS": "./assets/login-custom.css"
  }
}
```

### Custom Login CSS
```css
/* assets/login-custom.css */
.login-container {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.login-form {
  padding: 2rem;
}

.login-button {
  background: linear-gradient(45deg, #007bff, #0056b3);
  border: none;
  padding: 12px 24px;
  font-weight: 600;
}

.login-logo {
  max-height: 60px;
  margin-bottom: 1rem;
}
```

## 🔒 Security Features {#security-features}

### Password Security
```json
{
  "login": {
    "active": true,
    "security": {
      "passwordMinLength": 8,
      "requireUppercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true,
      "preventPasswordReuse": 5,
      "forcePasswordChange": 90
    }
  }
}
```

### Session Security
```json
{
  "login": {
    "active": true,
    "session": {
      "httpOnly": true,
      "secure": true,
      "sameSite": "strict",
      "maxAge": 3600,
      "renewBeforeExpiry": 300
    }
  }
}
```

### Rate Limiting
```json
{
  "login": {
    "active": true,
    "rateLimit": {
      "maxAttempts": 5,
      "windowMs": 900000,
      "blockDuration": 300000,
      "skipSuccessfulRequests": true
    }
  }
}
```

## 🔄 Authentication Flow

### Local Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant APIDoc
    participant LocalAuth

    User->>APIDoc: Access Documentation
    APIDoc->>User: Show Login Form
    User->>APIDoc: Submit Credentials
    APIDoc->>LocalAuth: Validate Credentials
    LocalAuth->>APIDoc: Authentication Result
    APIDoc->>User: Grant/Deny Access
```

### Remote Authentication Flow
```mermaid
sequenceDiagram
    participant User
    participant APIDoc
    participant AuthServer

    User->>APIDoc: Access Documentation
    APIDoc->>User: Show Login Form
    User->>APIDoc: Submit Credentials
    APIDoc->>AuthServer: Forward Credentials
    AuthServer->>APIDoc: Return Token/User Info
    APIDoc->>User: Grant Access
```

## 🛠️ Implementation Examples

### Express.js Middleware
```javascript
// middleware/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

### Next.js API Route
```javascript
// pages/api/auth/login.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validate credentials
  const user = await validateUser(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
}
```

## 🔧 Troubleshooting

### Common Issues

#### Authentication Not Working
```bash
# Check configuration
cat apidoc.json | jq '.login'

# Verify auth endpoint
curl -X POST https://api.company.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

#### CORS Issues
```json
{
  "login": {
    "urlAuth": "https://api.company.com/auth/login",
    "headers": {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  }
}
```

#### SSL Certificate Problems
```json
{
  "login": {
    "urlAuth": "https://api.company.com/auth/login",
    "insecure": true,
    "timeout": 10000
  }
}
```

## 📋 Best Practices

### 1. Security
- ✅ Use HTTPS for all authentication endpoints
- ✅ Implement proper password policies
- ✅ Enable rate limiting
- ✅ Use secure session management
- ✅ Implement CSRF protection

### 2. User Experience
- ✅ Provide clear error messages
- ✅ Support "remember me" functionality
- ✅ Implement session renewal
- ✅ Brand the login interface
- ✅ Support mobile-responsive design

### 3. Integration
- ✅ Use existing authentication systems
- ✅ Implement proper fallback mechanisms
- ✅ Support multiple authentication methods
- ✅ Provide detailed logging
- ✅ Monitor authentication metrics

### 4. Maintenance
- ✅ Regular security audits
- ✅ Update dependencies
- ✅ Monitor failed login attempts
- ✅ Implement account lockout policies
- ✅ Backup authentication configurations

The APIDoc 4.0 authentication system provides enterprise-grade security for protecting your API documentation while maintaining ease of use and flexibility for various deployment scenarios.