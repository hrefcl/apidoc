# 🔐 APIDoc 5.0 - Dual Authentication System

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Local Mode (No Server)](#local-mode-no-server)
4. [Server Mode](#server-mode)
5. [Security](#security)
6. [Troubleshooting](#troubleshooting)

---

## Introduction

The **Dual Authentication System** in APIDoc 5.0 allows protecting API documentation through two independently operating methods:

- **🏠 Local Authentication**: Users defined in configuration (no server required)
- **🌐 Server Authentication**: Integration with external authentication API

### ✨ Main Features

- ✅ **AES-256-GCM Encryption**: All sensitive content is encrypted
- ✅ **Key Obfuscation**: Encryption keys are split and obfuscated in code
- ✅ **JWT with Expiration**: Session tokens with 24-hour validity
- ✅ **No Dependencies**: Requires no external libraries
- ✅ **Modern Design**: Interface with light/dark mode and animations
- ✅ **Secure**: Does not store keys in sessionStorage or memory

---

## Local Mode (No Server)

### Basic Configuration

Edit the `apidoc.json` file:

```json
{
  "name": "My API Documentation",
  "version": "1.0.0",
  "description": "My API documentation",
  "login": {
    "active": true,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "admited": [
      {
        "email": "admin@company.com",
        "password": "password123",
        "name": "Admin User",
        "role": "admin"
      },
      {
        "email": "test@example.com",
        "password": "test",
        "name": "Test User"
      }
    ]
  }
}
```

### Generate Encryption Key

```bash
# Generate a random 32-byte key in Base64
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### User Fields

| Field      | Required | Description                              |
|------------|----------|------------------------------------------|
| `email`    | ✅        | User's email (used for login)            |
| `password` | ✅        | Plain text password                      |
| `name`     | ❌        | User's full name                         |
| `role`     | ❌        | User's role (default: "user")            |

### How It Works

1. **During generation**:
   - The `admited` list is encrypted with AES-256-GCM
   - The encryption key is split into 4 segments
   - 10-30 random decoy variables are generated
   - Everything is obfuscated and mixed in the HTML code

2. **During login**:
   - The system reconstructs the key from obfuscated segments
   - Decrypts the user list
   - Validates email and password
   - Generates a JWT with 24-hour expiration
   - The JWT is stored in sessionStorage
   - The key is discarded from memory

### Advantages

- ✅ No authentication server required
- ✅ Works completely offline
- ✅ Ideal for internal documentation
- ✅ Secure with AES-256-GCM encryption

### Disadvantages

- ⚠️ Users are fixed (requires regenerating docs for changes)
- ⚠️ Passwords are in plain text in `apidoc.json`

---

## Server Mode

### Configuration

```json
{
  "login": {
    "active": true,
    "encryptionKeyFromServer": true,
    "urlAuth": "https://api.company.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401
  }
}
```

### Configuration Fields

| Field                      | Description                                      |
|----------------------------|--------------------------------------------------|
| `active`                   | Enable authentication                            |
| `encryptionKeyFromServer`  | Indicates that the key comes from the server     |
| `urlAuth`                  | Authentication endpoint URL                      |
| `value_form`               | Form field mapping                               |
| `response_success`         | HTTP success code (default: 200)                 |
| `response_error`           | HTTP error code (default: 401)                   |

### Expected Server Response

The server must respond with a JSON that includes the encryption key:

```json
{
  "token": "optional-jwt-token",
  "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
  "user": {
    "email": "user@company.com",
    "name": "Example User"
  }
}
```

### How It Works

1. User enters credentials
2. POST request is made to `urlAuth` with fields configured in `value_form`
3. If response is `response_success`, extract `encryptionKey`
4. Decrypt content using that key
5. Generate JWT and store in sessionStorage

### Advantages

- ✅ Dynamic users
- ✅ Integration with existing systems
- ✅ Centralized credential management
- ✅ Can have complex authentication logic

### Disadvantages

- ⚠️ Requires available authentication server
- ⚠️ Does not work offline

---

## Security

### AES-256-GCM Encryption

```typescript
// Algorithm used
algorithm: 'aes-256-gcm'
keyLength: 32 bytes (256 bits)
ivLength: 16 bytes (128 bits)
authTagLength: 16 bytes (128 bits)
```

### Key Obfuscation

The encryption key is protected through:

1. **Segment Division**: The key is divided into 4 character arrays

### JWT (JSON Web Tokens)

```javascript
{
  sub: "user@example.com",      // User's email
  name: "Example User",          // User's name
  role: "user",                  // User's role
  type: "local",                 // Authentication type
  iss: "apicat-local",          // Token issuer
  exp: 1640995200,              // Expiration timestamp (24h)
  iat: 1640908800               // Issuance timestamp
}
```

### Storage

- ✅ **JWT**: Stored in `sessionStorage` (cleared when tab closes)
- ✅ **Encryption Key**: NOT stored, reconstructed when needed
- ✅ **Passwords**: NOT stored anywhere on the client

---

## Troubleshooting

### Error: "Failed to reconstruct encryption key"

**Cause**: Obfuscation code is corrupt or malformed.

**Solution**: Regenerate documentation with `apidoc generate -i src/ -o docs/`

### Error: "Invalid credentials"

**Local Mode**: Verify that email and password match exactly with those in `apidoc.json`.

**Server Mode**: Verify that:
1. The server is accessible
2. The `value_form` fields are correct
3. The response has the `encryptionKey` field

### Black Screen / Blank Page

**Cause**: JavaScript error when loading the page.

**Solution**:
1. Open browser console (F12)
2. Look for errors in red
3. Verify that documentation was generated correctly

### Session Expires Immediately

**Cause**: JWT is malformed or expired.

**Solution**:
1. Close all documentation tabs
2. Clear `sessionStorage` in DevTools
3. Login again

---

## Complete Example

### apidoc.json

```json
{
  "name": "My Company API",
  "version": "1.0.0",
  "description": "Internal API Documentation",
  "title": "My API Docs",
  "url": "https://api.mycompany.com",
  "sampleUrl": "https://api.mycompany.com",
  "login": {
    "active": true,
    "encryptionKey": "YOUR_BASE64_KEY_HERE",
    "admited": [
      {
        "email": "admin@mycompany.com",
        "password": "admin123",
        "name": "Admin User",
        "role": "admin"
      },
      {
        "email": "dev@mycompany.com",
        "password": "dev123",
        "name": "Developer",
        "role": "developer"
      },
      {
        "email": "viewer@mycompany.com",
        "password": "view123",
        "name": "Read Only User",
        "role": "viewer"
      }
    ]
  }
}
```

### Generate Documentation

```bash
# Install APIDoc
npm install -g @hrefcl/apidoc

# Generate documentation (CLI v5)
apidoc generate -i src/ -o docs/

# View documentation
npx serve docs/ -p 8080
```

### Access

1. Open `http://localhost:8080`
2. You will be redirected to `/login`
3. Enter credentials
4. Done! Access to protected documentation

---

**See Also:**
- [🚀 Quick Start Auth](./13-quick-start-auth.md) - Quick setup in 3 steps
- [👨‍💻 Developer Reference](./14-auth-developer.md) - Detailed technical API
- [📋 Configuration](./01-configuration.md) - Complete configuration
