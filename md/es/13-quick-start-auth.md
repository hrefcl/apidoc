# 🚀 APIDoc 5.0 - Guía Rápida de Autenticación

## ⚡ Configuración en 3 Pasos

### 1️⃣ Generar Clave de Encriptación

```bash
# Genera una clave aleatoria de 32 bytes en Base64
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copia la clave generada, la necesitarás en el siguiente paso.

### 2️⃣ Configurar apidoc.json

Agrega la sección `login` a tu `apidoc.json`:

```json
{
  "name": "Mi API",
  "version": "1.0.0",
  "login": {
    "active": true,
    "encryptionKey": "TU_CLAVE_GENERADA_AQUI",
    "admited": [
      {
        "email": "admin@empresa.com",
        "password": "password123",
        "name": "Admin User"
      }
    ]
  }
}
```

**⚠️ IMPORTANTE**: Reemplaza `TU_CLAVE_GENERADA_AQUI` con la clave del paso 1.

### 3️⃣ Generar y Servir

```bash
# Generar documentación con autenticación
apidoc -i src/ -o docs/

# Servir documentación
npx serve docs/ -p 8080

# Abrir en navegador
open http://localhost:8080
```

**¡Listo!** Tu documentación ahora requiere login.

---

## 🔐 Modos de Autenticación

### 🏠 Modo Local (Sin Servidor)

Usuarios fijos definidos en `apidoc.json`. Ideal para documentación interna.

```json
{
  "login": {
    "active": true,
    "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
    "admited": [
      {
        "email": "user@example.com",
        "password": "pass123",
        "name": "Usuario Ejemplo"
      }
    ]
  }
}
```

**Ventajas:**
- ✅ No requiere servidor
- ✅ Funciona offline
- ✅ Encriptación AES-256-GCM
- ✅ Ofuscación automática de claves

**Desventajas:**
- ⚠️ Usuarios fijos
- ⚠️ Requiere regenerar docs para cambios

### 🌐 Modo Servidor

Integración con tu API de autenticación existente.

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

El servidor debe responder con:

```json
{
  "encryptionKey": "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=",
  "user": {
    "email": "usuario@empresa.com",
    "name": "Usuario Ejemplo"
  }
}
```

**Ventajas:**
- ✅ Usuarios dinámicos
- ✅ Integración con sistemas existentes
- ✅ Gestión centralizada

**Desventajas:**
- ⚠️ Requiere servidor disponible
- ⚠️ No funciona offline

**⚠️ NOTA**: El sistema funciona en modo local **O** servidor, no ambos simultáneamente.

---

## 🧪 Testing Rápido

### Probar Modo Local

1. Usa la configuración de ejemplo del paso 2
2. Genera la documentación: `apidoc -i src/ -o docs/`
3. Sirve: `npx serve docs/ -p 8080`
4. Accede a `http://localhost:8080`
5. Login con: `admin@empresa.com` / `password123`

### Verificar Encriptación

Abre el archivo `docs/index.html` generado y busca:

```bash
# NO deberías encontrar la clave original
grep -c "TYeK+cjd9Q3XFYmhZozrXO0v6fqnoCYdYtFxBuFJ5YQ=" docs/index.html
# Resultado esperado: 0

# Deberías encontrar código ofuscado
grep -c "_obf" docs/index.html
# Resultado esperado: 1
```

---

## 🆘 Problemas Comunes

### ❌ Pantalla en blanco

**Causa**: Error de JavaScript al cargar.

**Solución**:
1. Abre DevTools (F12)
2. Ve a la pestaña Console
3. Busca errores en rojo
4. Regenera documentación: `apidoc -i src/ -o docs/`

### ❌ "Invalid credentials"

**Modo Local**: Verifica que email y password coincidan exactamente.

**Modo Servidor**:
1. Verifica que el servidor esté accesible
2. Verifica CORS está configurado correctamente
3. Revisa la respuesta en Network tab de DevTools

### ❌ "Failed to reconstruct encryption key"

**Causa**: Código de ofuscación corrupto.

**Solución**: Regenera la documentación completa.

### ❌ Sesión expira inmediatamente

**Causa**: JWT mal formado.

**Solución**:
1. Limpia sessionStorage: DevTools → Application → Session Storage
2. Cierra todas las pestañas de la documentación
3. Vuelve a intentar login

---

## 📚 Documentación Completa

Para configuración avanzada, consulta:

- **[🔐 Sistema de Autenticación](./12-authentication.md)** - Guía completa
- **[👨‍💻 Developer Reference](./14-auth-developer.md)** - API técnica
- **[📋 Configuration](./01-configuration.md)** - Todas las opciones

---

## 🎯 Checklist de Producción

Antes de desplegar en producción, verifica:

- [ ] Clave de encriptación generada aleatoriamente
- [ ] Contraseñas seguras (mínimo 12 caracteres)
- [ ] Servidor con HTTPS habilitado
- [ ] CORS configurado correctamente (modo servidor)
- [ ] Backup del archivo `apidoc.json` (contiene usuarios)
- [ ] Documentación probada en navegadores target
- [ ] Plan de rotación de credenciales

---

**¡Tu documentación está protegida y lista para producción! 🎉**
