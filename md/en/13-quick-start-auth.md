# 🚀 APIDoc 5.0 - Authentication Quick Guide

## ⚡ Configuration in 3 Steps

### 1️⃣ Generate Encryption Key

```bash
# Generate a random 32-byte key in Base64
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the generated key, you'll need it in the next step.

### 2️⃣ Configure apidoc.json

Add the `login` section to your `apidoc.json`:

```json
{
  "name": "My API",
  "version": "1.0.0",
  "login": {
    "active": true,
    "encryptionKey": "YOUR_GENERATED_KEY_HERE",
    "admited": [
      {
        "email": "admin@company.com",
        "password": "password123",
        "name": "Admin User"
      }
    ]
  }
}
```

**⚠️ IMPORTANT**: Replace `YOUR_GENERATED_KEY_HERE` with the key from step 1.

### 3️⃣ Generate and Serve

```bash
# Generate documentation with authentication (CLI v5)
apidoc generate -i src/ -o docs/

# Serve documentation
npx serve docs/ -p 8080

# Open in browser
open http://localhost:8080
```

**Done!** Your documentation now requires login.

---

## 🔐 Authentication Modes

### 🏠 Local Mode (No Server)

Fixed users defined in `apidoc.json`. Ideal for internal documentation.

```json
{
  "login": {
    "active": true,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "admited": [
      {
        "email": "user@example.com",
        "password": "pass123",
        "name": "Example User"
      }
    ]
  }
}
```

**Advantages:**
- ✅ No server required
- ✅ Works offline
- ✅ AES-256-GCM encryption
- ✅ Automatic key obfuscation

**Disadvantages:**
- ⚠️ Fixed users
- ⚠️ Requires regenerating docs for changes

### 🌐 Server Mode

Integration with your existing authentication API.

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

The server must respond with:

```json
{
  "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
  "user": {
    "email": "user@company.com",
    "name": "Example User"
  }
}
```

**Advantages:**
- ✅ Dynamic users
- ✅ Integration with existing systems
- ✅ Centralized management

**Disadvantages:**
- ⚠️ Requires available server
- ⚠️ Does not work offline

**⚠️ NOTE**: The system works in local mode **OR** server mode, not both simultaneously.

---

## 🧪 Quick Testing

### Test Local Mode

1. Use the example configuration from step 2
2. Generate documentation: `apidoc generate -i src/ -o docs/`
3. Serve: `npx serve docs/ -p 8080`
4. Access `http://localhost:8080`
5. Login with: `admin@company.com` / `password123`

### Verify Encryption

Open the generated `docs/index.html` file and search:

```bash
# You should NOT find the original key
grep -c "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=" docs/index.html
# Expected result: 0

# You should find obfuscated code
grep -c "_obf" docs/index.html
# Expected result: 1
```

---

## 🆘 Common Problems

### ❌ Blank screen

**Cause**: JavaScript error when loading.

**Solution**:
1. Open DevTools (F12)
2. Go to the Console tab
3. Look for errors in red
4. Regenerate documentation: `apidoc generate -i src/ -o docs/`

### ❌ "Invalid credentials"

**Local Mode**: Verify that email and password match exactly.

**Server Mode**:
1. Verify that the server is accessible
2. Verify CORS is configured correctly
3. Check the response in the Network tab of DevTools

### ❌ "Failed to reconstruct encryption key"

**Cause**: Corrupt obfuscation code.

**Solution**: Regenerate the complete documentation.

### ❌ Session expires immediately

**Cause**: Malformed JWT.

**Solution**:
1. Clear sessionStorage: DevTools → Application → Session Storage
2. Close all documentation tabs
3. Try login again

---

## 📚 Complete Documentation

For advanced configuration, consult:

- **[🔐 Authentication System](./12-authentication.md)** - Complete guide
- **[👨‍💻 Developer Reference](./14-auth-developer.md)** - Technical API
- **[📋 Configuration](./01-configuration.md)** - All options

---

## 🎯 Production Checklist

Before deploying to production, verify:

- [ ] Encryption key randomly generated
- [ ] Strong passwords (minimum 12 characters)
- [ ] Server with HTTPS enabled
- [ ] CORS configured correctly (server mode)
- [ ] Backup of `apidoc.json` file (contains users)
- [ ] Documentation tested in target browsers
- [ ] Credential rotation plan

---

**Your documentation is protected and ready for production! 🎉**
