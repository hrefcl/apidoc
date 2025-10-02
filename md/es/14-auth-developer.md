# 🛠️ APIDoc 5.0 - Guía del Desarrollador - Sistema de Autenticación

## 📐 Arquitectura Técnica

### Flujo de Datos

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

## 🔧 Módulos del Sistema

### 1. Encriptación (Build Time)

**Archivo**: `core/utils/encryption.ts`

```typescript
export class JSONEncryption {
  constructor(config?: EncryptionConfig, encryptionKey?: string)

  // Encriptar un objeto
  encryptObject(obj: any): EncryptedData

  // Desencriptar un objeto
  decryptObject(encryptedData: EncryptedData): any

  // Encriptar archivo JSON
  encryptFile(inputPath: string, outputPath: string): Promise<void>

  // Encriptar directorio completo
  static encryptDirectory(
    sourceDir: string,
    outputDir: string,
    encryptionKey?: string
  ): Promise<void>
}

interface EncryptedData {
  data: string;        // Datos encriptados (Base64)
  iv: string;          // IV (Base64)
  tag: string;         // Auth tag (Base64)
  algorithm: string;   // "aes-256-gcm"
  encrypted_at: string;
  version: string;
}
```

**Ejemplo de uso**:

```typescript
import { JSONEncryption } from './utils/encryption';

// Crear instancia
const encryption = new JSONEncryption(
  { algorithm: 'aes-256-gcm' },
  'TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ='
);

// Encriptar objeto
const encrypted = encryption.encryptObject({
  users: [{email: 'test@example.com', password: 'test'}]
});

// Encriptar directorio completo
await JSONEncryption.encryptDirectory(
  './tmp/apicat-output',
  './tmp/apicat-output',
  'YOUR_ENCRYPTION_KEY'
);
```

### 2. Ofuscación de Claves (Build Time)

**Archivo**: `core/utils/keyObfuscation.ts`

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

**Ejemplo de uso**:

```typescript
import { obfuscateKey } from './utils/keyObfuscation';

// Ofuscar clave
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

### 3. Plugin APIcat (Build Time)

**Archivo**: `core/apidoc/plugins/apicat.ts`

Procesa la configuración de login y genera metadata encriptada:

```typescript
// Si login está activo, encripta la lista de usuarios
if (projectInfo.login && projectInfo.login.active) {
  if (projectInfo.login.admited) {
    // Encriptar lista de usuarios
    const encryptedAdmited = encryption.encryptObject(
      projectInfo.login.admited
    );
    loginConfig._admited = encryptedAdmited;
  }

  // Ofuscar clave de encriptación
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

### 4. Autenticación Local (Runtime - Frontend)

**Archivo**: `apps/apidoc-template-v5/src/utils/localAuth.js`

```javascript
// Validar credenciales contra lista encriptada
export function validateLocalCredentials(
  email,
  password,
  admitedList
): {
  valid: boolean;
  user: object | null;
  error: string | null;
}

// Generar token JWT local
export function generateLocalToken(
  user,
  options = {}
): string

// Autenticar usuario localmente
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

**Ejemplo de uso en LoginPage.vue**:

```javascript
import { authenticateLocally } from '../utils/localAuth';
import { decryptObject } from '../utils/encryption';

// 1. Reconstruir clave desde segmentos ofuscados
const encryptionKey = eval(
  `(function(){${config._obf}return ${config._kv};})()`
);

// 2. Desencriptar lista de usuarios
const admitedList = decryptObject(
  config._admited,
  encryptionKey
);

// 3. Autenticar
const result = await authenticateLocally(
  email,
  password,
  admitedList,
  encryptionKey
);

if (result.success) {
  // Login exitoso - almacenar JWT
  sessionStorage.setItem('apicat_auth_token', result.token);
}
```

### 5. JWT (Runtime - Frontend)

**Archivo**: `apps/apidoc-template-v5/src/utils/jwt.js`

```javascript
// Generar JWT de testing (local)
export function generateTestToken(
  payload,
  expiresInHours = 24
): string

// Validar JWT
export function validateJWT(token): {
  valid: boolean;
  payload: object | null;
  error: string | null;
}

// Decodificar JWT (sin validar)
export function decodeJWT(token): object | null
```

**Estructura del JWT**:

```javascript
{
  // Header
  alg: "HS256",
  typ: "JWT",

  // Payload
  sub: "user@example.com",      // Email del usuario
  name: "Usuario Ejemplo",       // Nombre
  role: "user",                  // Rol
  type: "local",                 // Tipo: "local" o "server"
  iss: "apicat-local",          // Emisor
  exp: 1640995200,              // Expiración (timestamp)
  iat: 1640908800               // Emisión (timestamp)
}
```

### 6. Store de Documentación (Runtime - Frontend)

**Archivo**: `apps/apidoc-template-v5/src/stores/docs.js`

```javascript
export const useDocsStore = defineStore('docs', () => {
  // Estado de autenticación
  const isAuthenticated = ref(false);
  const authToken = ref(null);

  // Reconstruir clave desde segmentos ofuscados
  const getEncryptionKey = () => {
    const login = window.__APICAT_DATA__.meta.login;
    if (login.active) {
      if (login._obf && login._kv) {
        return eval(`(function(){${login._obf}return ${login._kv};})()`);
      }
    }
    return null;
  };

  // Inicializar auth desde sessionStorage
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

## 🔒 Seguridad

### Algoritmo de Encriptación

- **Algoritmo**: AES-256-GCM
- **Key Length**: 32 bytes (256 bits)
- **IV Length**: 16 bytes (128 bits)
- **Auth Tag Length**: 16 bytes (128 bits)

### Ofuscación de Claves

La clave de encriptación se protege mediante:

1. **División en 4 segmentos** de caracteres individuales
2. **Generación de 10-30 variables decoy** con datos aleatorios
3. **Nombres aleatorios** para todas las variables (`$_XYZ`, `__ABC`, etc.)
4. **Fisher-Yates shuffle** para mezclar segmentos reales con decoys
5. **Reconstrucción runtime** solo cuando se necesita

### Almacenamiento

- ✅ **JWT**: `sessionStorage` (se borra al cerrar pestaña)
- ❌ **Clave de encriptación**: NO se almacena (se reconstruye on-demand)
- ❌ **Contraseñas**: NO se almacenan en el cliente

---

## 🧪 Testing

### Test de Encriptación

```bash
# Generar clave de prueba
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Probar encriptación
node -e "
const { JSONEncryption } = require('./dist/core/utils/encryption');
const enc = new JSONEncryption({}, 'YOUR_KEY_HERE');
const encrypted = enc.encryptObject({test: 'data'});
console.log('Encrypted:', encrypted);
const decrypted = enc.decryptObject(encrypted);
console.log('Decrypted:', decrypted);
"
```

### Test de Ofuscación

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

### Test de JWT

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

### Variables Globales

```javascript
// Datos embebidos en HTML
window.__APICAT_DATA__ = {
  meta: {
    login: {
      active: true,
      encryptionKeyFromServer: false,
      _obf: "...",    // Código de ofuscación
      _kv: "...",     // Variable de reconstrucción
      _admited: {     // Lista encriptada
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
// En DevTools Console:

// 1. Verificar configuración de login
console.log(window.__APICAT_DATA__.meta.login);

// 2. Verificar sessionStorage
console.log({
  token: sessionStorage.getItem('apicat_auth_token'),
  authenticated: sessionStorage.getItem('apicat_authenticated')
});

// 3. Validar token actual
import { validateJWT } from './utils/jwt';
const token = sessionStorage.getItem('apicat_auth_token');
console.log(validateJWT(token));

// 4. Ver tiempo hasta expiración
const decoded = JSON.parse(atob(token.split('.')[1]));
const expiresIn = (decoded.exp * 1000) - Date.now();
console.log('Expires in:', Math.round(expiresIn / 1000 / 60), 'minutes');
```

---

## 🚀 Mejores Prácticas

### 1. Generación de Claves

```bash
# SIEMPRE genera claves aleatorias
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# NUNCA uses claves predecibles
# ❌ MAL: "mysecretkey123"
# ✅ BIEN: "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ="
```

### 2. Contraseñas

```json
{
  "login": {
    "admited": [
      {
        "email": "admin@company.com",
        "password": "P@ssw0rd!Strong123",  // ✅ Contraseña fuerte
        "name": "Admin User"
      }
    ]
  }
}
```

### 3. Rotación de Claves

Para cambiar la clave de encriptación:

1. Genera nueva clave
2. Actualiza `apidoc.json`
3. Regenera documentación
4. Todos los usuarios deben volver a hacer login

---

**Ver También:**
- [🔐 Sistema de Autenticación](./12-authentication.md)
- [🚀 Quick Start Auth](./13-quick-start-auth.md)
