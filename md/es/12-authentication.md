# 🔐 APIDoc 5.0 - Sistema de Autenticación Dual

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Características](#características)
3. [Modo Local (Sin Servidor)](#modo-local-sin-servidor)
4. [Modo Servidor](#modo-servidor)
5. [Seguridad](#seguridad)
6. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

El **Sistema de Autenticación Dual** de APIDoc 5.0 permite proteger la documentación de API mediante dos métodos que funcionan de forma independiente:

- **🏠 Autenticación Local**: Usuarios definidos en la configuración (sin servidor necesario)
- **🌐 Autenticación Servidor**: Integración con API externa de autenticación

### ✨ Características Principales

- ✅ **Encriptación AES-256-GCM**: Todo el contenido sensible está encriptado
- ✅ **Ofuscación de Claves**: Las claves de encriptación se dividen y ofuscan en el código
- ✅ **JWT con Expiración**: Tokens de sesión con 24 horas de validez
- ✅ **Sin Dependencias**: No requiere bibliotecas externas
- ✅ **Diseño Moderno**: Interfaz con modo claro/oscuro y animaciones
- ✅ **Seguro**: No almacena claves en sessionStorage ni memoria

---

## Modo Local (Sin Servidor)

### Configuración Básica

Edita el archivo `apidoc.json`:

```json
{
  "name": "Mi API Documentation",
  "version": "1.0.0",
  "description": "Documentación de mi API",
  "login": {
    "active": true,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "admited": [
      {
        "email": "admin@empresa.com",
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

### Generar Clave de Encriptación

```bash
# Genera una clave aleatoria de 32 bytes en Base64
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Campos del Usuario

| Campo      | Requerido | Descripción                              |
|------------|-----------|------------------------------------------|
| `email`    | ✅        | Email del usuario (usado para login)     |
| `password` | ✅        | Contraseña en texto plano                |
| `name`     | ❌        | Nombre completo del usuario              |
| `role`     | ❌        | Rol del usuario (default: "user")        |

### ¿Cómo Funciona?

1. **Durante la generación**:
   - La lista `admited` se encripta con AES-256-GCM
   - La clave de encriptación se divide en 4 segmentos
   - Se generan 10-30 variables decoy aleatorias
   - Todo se ofusca y mezcla en el código HTML

2. **Durante el login**:
   - El sistema reconstruye la clave desde segmentos ofuscados
   - Desencripta la lista de usuarios
   - Valida email y contraseña
   - Genera un JWT con 24 horas de expiración
   - El JWT se almacena en sessionStorage
   - La clave se descarta de memoria

### Ventajas

- ✅ No requiere servidor de autenticación
- ✅ Funciona completamente offline
- ✅ Ideal para documentación interna
- ✅ Seguro con encriptación AES-256-GCM

### Desventajas

- ⚠️ Los usuarios son fijos (requiere regenerar docs para cambios)
- ⚠️ Las contraseñas están en texto plano en `apidoc.json`

---

## Modo Servidor

### Configuración

```json
{
  "login": {
    "active": true,
    "encryptionKeyFromServer": true,
    "urlAuth": "https://api.empresa.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401
  }
}
```

### Campos de Configuración

| Campo                      | Descripción                                      |
|----------------------------|--------------------------------------------------|
| `active`                   | Activar autenticación                            |
| `encryptionKeyFromServer`  | Indica que la clave viene del servidor           |
| `urlAuth`                  | URL del endpoint de autenticación                |
| `value_form`               | Mapeo de campos del formulario                   |
| `response_success`         | Código HTTP de éxito (default: 200)              |
| `response_error`           | Código HTTP de error (default: 401)              |

### Respuesta Esperada del Servidor

El servidor debe responder con un JSON que incluya la clave de encriptación:

```json
{
  "token": "jwt-token-opcional",
  "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
  "user": {
    "email": "usuario@empresa.com",
    "name": "Usuario Ejemplo"
  }
}
```

### ¿Cómo Funciona?

1. Usuario ingresa credenciales
2. Se hace POST a `urlAuth` con los campos configurados en `value_form`
3. Si respuesta es `response_success`, se extrae `encryptionKey`
4. Se desencripta el contenido usando esa clave
5. Se genera JWT y se almacena en sessionStorage

### Ventajas

- ✅ Usuarios dinámicos
- ✅ Integración con sistemas existentes
- ✅ Gestión centralizada de credenciales
- ✅ Puede tener lógica de autenticación compleja

### Desventajas

- ⚠️ Requiere servidor de autenticación disponible
- ⚠️ No funciona offline

---

## Seguridad

### Encriptación AES-256-GCM

```typescript
// Algoritmo usado
algorithm: 'aes-256-gcm'
keyLength: 32 bytes (256 bits)
ivLength: 16 bytes (128 bits)
authTagLength: 16 bytes (128 bits)
```

### Ofuscación de Claves

La clave de encriptación se protege mediante:

1. **División en Segmentos**: La clave se divide en 4 arrays de caracteres

### JWT (JSON Web Tokens)

```javascript
{
  sub: "user@example.com",      // Email del usuario
  name: "Usuario Ejemplo",       // Nombre del usuario
  role: "user",                  // Rol del usuario
  type: "local",                 // Tipo de autenticación
  iss: "apicat-local",          // Emisor del token
  exp: 1640995200,              // Timestamp de expiración (24h)
  iat: 1640908800               // Timestamp de emisión
}
```

### Almacenamiento

- ✅ **JWT**: Se almacena en `sessionStorage` (se borra al cerrar pestaña)
- ✅ **Clave de Encriptación**: NO se almacena, se reconstruye cuando se necesita
- ✅ **Contraseñas**: NO se almacenan en ningún lugar del cliente

---

## Solución de Problemas

### Error: "Failed to reconstruct encryption key"

**Causa**: El código de ofuscación está corrupto o mal formado.

**Solución**: Regenera la documentación con `apidoc -i src/ -o docs/`

### Error: "Invalid credentials"

**Modo Local**: Verifica que el email y password coincidan exactamente con los de `apidoc.json`.

**Modo Servidor**: Verifica que:
1. El servidor esté accesible
2. Los campos de `value_form` sean correctos
3. La respuesta tenga el campo `encryptionKey`

### Pantalla Negra / Blank Page

**Causa**: Error de JavaScript al cargar la página.

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que la documentación fue generada correctamente

### Sesión Expira Inmediatamente

**Causa**: El JWT está mal formado o expirado.

**Solución**:
1. Cierra todas las pestañas de la documentación
2. Limpia `sessionStorage` en DevTools
3. Vuelve a hacer login

---

## Ejemplo Completo

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

### Generar Documentación

```bash
# Instalar APIDoc
npm install -g @hrefcl/apidoc

# Generar documentación
apidoc -i src/ -o docs/

# Ver documentación
npx serve docs/ -p 8080
```

### Acceder

1. Abre `http://localhost:8080`
2. Serás redirigido a `/login`
3. Ingresa credenciales
4. ¡Listo! Acceso a la documentación protegida

---

**Ver También:**
- [🚀 Quick Start Auth](./13-quick-start-auth.md) - Setup rápido en 3 pasos
- [👨‍💻 Developer Reference](./14-auth-developer.md) - API técnica detallada
- [📋 Configuration](./01-configuration.md) - Configuración completa
