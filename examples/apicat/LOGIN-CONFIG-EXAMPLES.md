# 🔐 APIDoc Login & Authentication Configuration Guide

APIDoc v5 soporta **3 modos de autenticación** para proteger tu documentación:

1. **Modo Servidor con JWT** (Más seguro - Recomendado para producción)
2. **Modo Servidor Simple** (Compatibilidad con servidores legacy)
3. **Modo Local** (Sin servidor - Para equipos pequeños)

---

## 🎯 Modo 1: Servidor con JWT (Recomendado)

**Descripción:** El servidor de autenticación responde con un token JWT que incluye:
- Expiración automática (ej: 24 horas)
- Opcionalmente, la clave de encriptación en el payload

**Configuración en `apidoc.json`:**

```json
{
  "login": {
    "active": true,
    "mode": "server",
    "urlAuth": "https://api.tuempresa.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "encryptionKeyFromServer": false
  }
}
```

**Respuesta esperada del servidor:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "usuario@example.com",
    "name": "Usuario Ejemplo"
  }
}
```

**Estructura del JWT (payload):**

```json
{
  "sub": "usuario@example.com",
  "name": "Usuario Ejemplo",
  "iat": 1704067200,
  "exp": 1704153600,
  "_k": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=" // Opcional
}
```

**Ventajas:**
- ✅ Expiración automática de sesión (24h por defecto)
- ✅ Clave de encriptación puede venir en el JWT
- ✅ Auto-logout cuando el token expira
- ✅ Validación de firma (en servidor)

---

## 🎯 Modo 2: Servidor Simple (Legacy)

**Descripción:** Servidor responde solo con código 200 si las credenciales son válidas.
Compatible con servidores existentes que no soportan JWT.

**Configuración en `apidoc.json`:**

```json
{
  "login": {
    "active": true,
    "mode": "server",
    "urlAuth": "https://api.tuempresa.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "encryptionKeyFromServer": true
  }
}
```

**Respuesta esperada del servidor (sin JWT):**

```json
{
  "success": true,
  "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ="
}
```

**Ventajas:**
- ✅ Fácil integración con servidores existentes
- ✅ No requiere cambios en el backend
- ⚠️ Sin expiración automática de sesión

---

## 🎯 Modo 3: Local (Sin Servidor)

**Descripción:** Autenticación completamente local sin servidor.
Perfecto para equipos pequeños o documentación interna.

**Configuración en `apidoc.json`:**

```json
{
  "login": {
    "active": true,
    "mode": "local",
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "local": {
      "tokenExpirationHours": 24,
      "users": [
        {
          "email": "admin@tuempresa.com",
          "password": "ChangeMe123!",
          "name": "Administrador",
          "role": "admin"
        },
        {
          "email": "developer@tuempresa.com",
          "password": "DevPassword456",
          "name": "Desarrollador",
          "role": "developer"
        }
      ]
    }
  }
}
```

**⚠️ IMPORTANTE - Seguridad:**

La lista de usuarios **DEBE** ser encriptada en el HTML generado. APIDoc automáticamente:
1. Encripta la sección `login.local` cuando genera el HTML
2. Solo se desencripta después de validar las credenciales
3. La lista NUNCA aparece en texto plano en el HTML

**Configuración con Passwords Hasheadas (Más Seguro):**

```json
{
  "login": {
    "active": true,
    "mode": "local",
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "local": {
      "tokenExpirationHours": 24,
      "users": [
        {
          "email": "admin@tuempresa.com",
          "passwordHash": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
          "name": "Administrador",
          "role": "admin"
        }
      ]
    }
  }
}
```

Para generar el hash SHA-256 de una contraseña:

```javascript
// En consola del navegador
const password = "MiContraseñaSegura123"
const encoder = new TextEncoder()
const data = encoder.encode(password)
crypto.subtle.digest('SHA-256', data).then(hash => {
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  console.log(hashHex)
})
```

**Ventajas:**
- ✅ No requiere servidor de autenticación
- ✅ Genera JWT local con expiración
- ✅ Auto-logout después de 24 horas
- ✅ Perfecto para equipos pequeños
- ✅ Lista de usuarios encriptada en HTML
- ⚠️ Passwords deben ser hasheados

---

## 🔒 Seguridad de la Encriptación

### Clave de Encriptación

Todas las configuraciones requieren una `encryptionKey` de 256 bits (32 bytes).

**Generar una clave segura:**

```bash
# En terminal (Linux/macOS)
openssl rand -base64 32
```

```javascript
// En consola del navegador
const key = new Uint8Array(32)
window.crypto.getRandomValues(key)
const base64Key = btoa(String.fromCharCode.apply(null, key))
console.log(base64Key)
```

### Ofuscación de Clave en HTML

Cuando se genera el HTML, la clave NO aparece como `encryptionKey`:

```javascript
// ❌ NO aparece así en el HTML
{ "encryptionKey": "TYeK+cjd..." }

// ✅ Aparece así (ofuscada)
{ "_k": "TYeK+cjd..." }
```

### Datos que se Encriptan

Cuando `login.active: true`, se encriptan automáticamente:

- ✅ Endpoints de API (`cat.api`)
- ✅ Documentación técnica (`cat.docs`)
- ✅ Modelos/Schemas (`cat.model`)
- ✅ Lista de usuarios (modo local)

**NO se encripta** (necesario para UI):
- ❌ Navegación
- ❌ Búsqueda
- ❌ Metadata general

---

## 📋 Configuración Completa - Ejemplo Real

```json
{
  "name": "Mi API Empresarial",
  "version": "1.0.0",
  "url": "https://api.miempresa.com",
  "output": "./docs",
  "apicat": {
    "enabled": true
  },
  "login": {
    "active": true,
    "mode": "local",
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "local": {
      "tokenExpirationHours": 24,
      "users": [
        {
          "email": "admin@miempresa.com",
          "passwordHash": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
          "name": "Administrador",
          "role": "admin"
        },
        {
          "email": "dev@miempresa.com",
          "passwordHash": "6cf615d5bcaac778352a8f1f3360d23f02f34ec182e259897fd81c3df9cd13a1",
          "name": "Desarrollador",
          "role": "developer"
        }
      ]
    }
  }
}
```

---

## 🔄 Flujo de Autenticación

### Modo Servidor con JWT:
1. Usuario ingresa email/password
2. POST a `urlAuth` con credenciales
3. Servidor responde con JWT token
4. Cliente valida JWT y extrae clave de encriptación
5. Cliente desencripta contenido automáticamente
6. Auto-logout cuando JWT expire

### Modo Local:
1. Usuario ingresa email/password
2. Cliente valida contra lista encriptada
3. Cliente genera JWT local con expiración
4. Cliente desencripta contenido
5. Auto-logout después de 24 horas

---

## 🚀 Mejores Prácticas

1. **Modo Producción:** Usa Modo Servidor con JWT
2. **Desarrollo:** Usa Modo Local con lista pequeña
3. **Legacy:** Usa Modo Servidor Simple si no puedes cambiar backend
4. **Passwords:** Siempre usa `passwordHash` en lugar de `password` en modo local
5. **Clave de Encriptación:** Genera una nueva para cada proyecto
6. **Gitignore:** Nunca commitees el `apidoc.json` con passwords reales

---

## 📝 Notas Importantes

- La lista de usuarios en modo local se encripta automáticamente en el HTML
- El token JWT se valida en cada recarga de página
- La sesión expira automáticamente según la expiración del JWT
- El sistema detecta automáticamente si hay JWT en la respuesta del servidor
- Compatible con servidores que no soportan JWT (fallback a boolean auth)

