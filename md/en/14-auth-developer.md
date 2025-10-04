# 🛠️ APIDoc 5.0 - Developer Guide - Authentication System

## 📐 Technical Architecture

### Data Flow

```
┌─────────────────────┐
│   apidoc.json       │
│   - login.active    │
│   - encryptionKey   │
│   - admited[]       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Build Time         │
│  ===============    │
│  1. Encrypt admited │
│  2. Obfuscate key   │
│  3. Generate HTML   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Generated HTML     │
│  - Encrypted data   │
│  - Obfuscated key   │
│  - Vue 3 SPA        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Runtime (Browser)  │
│  ===============    │
│  1. Reconstruct key │
│  2. Login user      │
│  3. Decrypt data    │
│  4. Generate JWT    │
└─────────────────────┘
```

---

## 🔧 System Modules

### 1. Encryption (Build Time)

**File**: `core/utils/encryption.ts`

```typescript
export class JSONEncryption {
  constructor(config?: EncryptionConfig, encryptionKey?: string)

  // Encrypt an object
  encryptObject(obj: any): EncryptedData

  // Decrypt an object
  decryptObject(encryptedData: EncryptedData): any

  // Encrypt JSON file
  encryptFile(inputPath: string, outputPath: string): Promise<void>

  // Encrypt entire directory
  static encryptDirectory(
    sourceDir: string,
    outputDir: string,
    encryptionKey?: string
  ): Promise<void>
}

interface EncryptedData {
  data: string;        // Encrypted data (Base64)
  iv: string;          // IV (Base64)
  tag: string;         // Auth tag (Base64)
  algorithm: string;   // "aes-256-gcm"
  encrypted_at: string;
  version: string;
}
```

**Usage example**:

```typescript
import { JSONEncryption } from './utils/encryption';

// Create instance
const encryption = new JSONEncryption(
  { algorithm: 'aes-256-gcm' },
  'TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ='
);

// Encrypt object
const encrypted = encryption.encryptObject({
  users: [{email: 'test@example.com', password: 'test'}]
});

// Encrypt entire directory
await JSONEncryption.encryptDirectory(
  './tmp/apicat-output',
  './tmp/apicat-output',
  'YOUR_ENCRYPTION_KEY'
);
```

### 2. Key Obfuscation (Build Time)

**File**: `core/utils/keyObfuscation.ts`

```typescript
export function obfuscateKey(key: string, segments: number = 4): {
  code: string;
  reconstructVar: string;
}

export function obfuscateMultipleKeys(keys: Record<string, string>): {
  code: string;
  reconstructVars: Record<string, string>;
}

export function obfuscateKeyInline(key: string): string
```

**Usage example**:

```typescript
import { obfuscateKey } from './utils/keyObfuscation';

// Obfuscate key
const { code, reconstructVar } = obfuscateKey(
  'TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=',
  4
);

console.log(code);
// Output:
// const $_BHrVxBFfpe=["T","Y","e"...];
// const __pwYDhLgFKXHJWL=["6","8","S"...]; // decoy
// ...
// const __xOfQMrNCnxeIrVc=[...$_BHrVxBFfpe,...].join('');

console.log(reconstructVar);
// Output: __xOfQMrNCnxeIrVc
```

### 3. APIcat Plugin (Build Time)

**File**: `core/apidoc/plugins/apicat.ts`

Processes login configuration and generates encrypted metadata:

```typescript
// If login is active, encrypt the user list
if (projectInfo.login && projectInfo.login.active) {
  if (projectInfo.login.admited) {
    // Encrypt user list
    const encryptedAdmited = encryption.encryptObject(
      projectInfo.login.admited
    );
    loginConfig._admited = encryptedAdmited;
  }

  // Obfuscate encryption key
  if (!projectInfo.login.encryptionKeyFromServer &&
      projectInfo.login.encryptionKey) {
    const { obfuscateKey } = await import('../../utils/keyObfuscation');
    const obfuscated = obfuscateKey(
      projectInfo.login.encryptionKey,
      4
    );

    loginConfig._obf = obfuscated.code;
    loginConfig._kv = obfuscated.reconstructVar;
  }
}
```

### 4. Local Authentication (Runtime - Frontend)

**File**: `apps/apidoc-template-v5/src/utils/localAuth.js`

```javascript
// Validate credentials against encrypted list
export function validateLocalCredentials(
  email,
  password,
  admitedList
): {
  valid: boolean;
  user: object | null;
  error: string | null;
}

// Generate local JWT token
export function generateLocalToken(
  user,
  options = {}
): string

// Authenticate user locally
export async function authenticateLocally(
  email,
  password,
  admitedList,
  encryptionKey
): Promise<{
  success: boolean;
  token: string | null;
  user: object | null;
  encryptionKey: string | null;
  error: string | null;
}>
```

**Usage example in LoginPage.vue**:

```javascript
import { authenticateLocally } from '../utils/localAuth';
import { decryptObject } from '../utils/encryption';

// 1. Reconstruct key from obfuscated segments
const encryptionKey = eval(
  `(function(){${config._obf}return ${config._kv};})()`
);

// 2. Decrypt user list
const admitedList = decryptObject(
  config._admited,
  encryptionKey
);

// 3. Authenticate
const result = await authenticateLocally(
  email,
  password,
  admitedList,
  encryptionKey
);

if (result.success) {
  // Successful login - store JWT
  sessionStorage.setItem('apicat_auth_token', result.token);
}
```

### 5. JWT (Runtime - Frontend)

**File**: `apps/apidoc-template-v5/src/utils/jwt.js`

```javascript
// Generate test JWT (local)
export function generateTestToken(
  payload,
  expiresInHours = 24
): string

// Validate JWT
export function validateJWT(token): {
  valid: boolean;
  payload: object | null;
  error: string | null;
}

// Decode JWT (without validation)
export function decodeJWT(token): object | null
```

**JWT structure**:

```javascript
{
  // Header
  alg: "HS256",
  typ: "JWT",

  // Payload
  sub: "user@example.com",      // User's email
  name: "Example User",          // Name
  role: "user",                  // Role
  type: "local",                 // Type: "local" or "server"
  iss: "apicat-local",          // Issuer
  exp: 1640995200,              // Expiration (timestamp)
  iat: 1640908800               // Issuance (timestamp)
}
```

### 6. Documentation Store (Runtime - Frontend)

**File**: `apps/apidoc-template-v5/src/stores/docs.js`

```javascript
export const useDocsStore = defineStore('docs', () => {
  // Authentication state
  const isAuthenticated = ref(false);
  const authToken = ref(null);

  // Reconstruct key from obfuscated segments
  const getEncryptionKey = () => {
    const login = window.__APICAT_DATA__.meta.login;
    if (login.active) {
      if (login._obf && login._kv) {
        return eval(`(function(){${login._obf}return ${login._kv};})()`);
      }
    }
    return null;
  };

  // Initialize auth from sessionStorage
  const initAuth = () => {
    const token = sessionStorage.getItem('apicat_auth_token');
    if (token) {
      import('../utils/jwt').then(({ validateJWT }) => {
        const validation = validateJWT(token);
        if (validation.valid) {
          authToken.value = token;
          isAuthenticated.value = true;
        }
      });
    }
  };

  // Logout
  const logout = () => {
    authToken.value = null;
    isAuthenticated.value = false;
    sessionStorage.removeItem('apicat_auth_token');
    sessionStorage.removeItem('apicat_authenticated');
  };

  return {
    isAuthenticated,
    authToken,
    initAuth,
    logout
  };
});
```

---

## 🔒 Security

### Encryption Algorithm

- **Algorithm**: AES-256-GCM
- **Key Length**: 32 bytes (256 bits)
- **IV Length**: 16 bytes (128 bits)
- **Auth Tag Length**: 16 bytes (128 bits)

### Key Obfuscation

The encryption key is protected through:

1. **Division into 4 segments** of individual characters
2. **Generation of 10-30 decoy variables** with random data
3. **Random names** for all variables (`$_XYZ`, `__ABC`, etc.)
4. **Fisher-Yates shuffle** to mix real segments with decoys
5. **Runtime reconstruction** only when needed

### Storage

- ✅ **JWT**: `sessionStorage` (cleared when tab closes)
- ❌ **Encryption Key**: NOT stored (reconstructed on-demand)
- ❌ **Passwords**: NOT stored on the client

---

## 🧪 Testing

### Encryption Test

```bash
# Generate test key
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Test encryption
node -e "
const { JSONEncryption } = require('./dist/core/utils/encryption');
const enc = new JSONEncryption({}, 'YOUR_KEY_HERE');
const encrypted = enc.encryptObject({test: 'data'});
console.log('Encrypted:', encrypted);
const decrypted = enc.decryptObject(encrypted);
console.log('Decrypted:', decrypted);
"
```

### Obfuscation Test

```bash
node -e "
const { obfuscateKey } = require('./dist/core/utils/keyObfuscation');
const key = 'TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=';
const { code, reconstructVar } = obfuscateKey(key, 4);
console.log('Obfuscated code length:', code.length);
console.log('Variables count:', (code.match(/const /g) || []).length);
console.log('Reconstruct var:', reconstructVar);
"
```

### JWT Test

```bash
node -e "
const { generateTestToken, validateJWT } = require('./apps/apidoc-template-v5/src/utils/jwt.js');
const token = generateTestToken({sub: 'test@example.com'}, 24);
console.log('Token:', token);
const validation = validateJWT(token);
console.log('Valid:', validation.valid);
console.log('Payload:', validation.payload);
"
```

---

## 📊 Debugging

### Global Variables

```javascript
// Data embedded in HTML
window.__APICAT_DATA__ = {
  meta: {
    login: {
      active: true,
      encryptionKeyFromServer: false,
      _obf: "...",    // Obfuscation code
      _kv: "...",     // Reconstruction variable
      _admited: {     // Encrypted list
        data: "...",
        iv: "...",
        tag: "...",
        algorithm: "aes-256-gcm"
      }
    }
  }
};
```

### Console Debugging

```javascript
// In DevTools Console:

// 1. Verify login configuration
console.log(window.__APICAT_DATA__.meta.login);

// 2. Verify sessionStorage
console.log({
  token: sessionStorage.getItem('apicat_auth_token'),
  authenticated: sessionStorage.getItem('apicat_authenticated')
});

// 3. Validate current token
import { validateJWT } from './utils/jwt';
const token = sessionStorage.getItem('apicat_auth_token');
console.log(validateJWT(token));

// 4. View time until expiration
const decoded = JSON.parse(atob(token.split('.')[1]));
const expiresIn = (decoded.exp * 1000) - Date.now();
console.log('Expires in:', Math.round(expiresIn / 1000 / 60), 'minutes');
```

---

## 🚀 Best Practices

### 1. Key Generation

```bash
# ALWAYS generate random keys
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# NEVER use predictable keys
# ❌ BAD: "mysecretkey123"
# ✅ GOOD: "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ="
```

### 2. Passwords

```json
{
  "login": {
    "admited": [
      {
        "email": "admin@company.com",
        "password": "P@ssw0rd!Strong123",  // ✅ Strong password
        "name": "Admin User"
      }
    ]
  }
}
```

### 3. Key Rotation

To change the encryption key:

1. Generate new key
2. Update `apidoc.json`
3. Regenerate documentation
4. All users must login again

---

**See Also:**
- [🔐 Authentication System](./12-authentication.md)
- [🚀 Quick Start Auth](./13-quick-start-auth.md)
