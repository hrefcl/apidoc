# 🚀 APIDoc 4.0 - Guía Rápida de Autenticación

## ⚡ Configuración en 3 Pasos

### 1️⃣ Configurar apidoc.json

Agrega la sección `login` a tu `apidoc.json`:

```json
{
  "name": "Mi API",
  "version": "1.0.0",
  "login": {
    "active": true,
    "admited": [
      {
        "email": "admin@miempresa.com",
        "password": "mi_password_seguro"
      }
    ]
  }
}
```

### 2️⃣ Generar Documentación

```bash
# Instalar APIDoc 4.0
npm install -g @hrefcl/apidoc

# Generar con autenticación
apidoc -i src/ -o docs/
```

### 3️⃣ Servir y Probar

```bash
# Servir documentación
npx serve docs/ -p 8080

# Abrir en navegador
open http://localhost:8080
```

**¡Listo!** Tu documentación ahora requiere login para acceder.

---

## 🔐 Opciones de Autenticación

### 🏠 Solo Local
```json
{
  "login": {
    "active": true,
    "admited": [
      {"email": "user1@example.com", "password": "pass123"},
      {"email": "user2@example.com", "password": "pass456"}
    ]
  }
}
```

### 🌐 Solo Remota
```json
{
  "login": {
    "active": true,
    "urlAuth": "https://api.miempresa.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401
  }
}
```

### 🔗 Híbrida (Local + Remota)
```json
{
  "login": {
    "active": true,
    "admited": [
      {"email": "admin@local.com", "password": "local123"}
    ],
    "urlAuth": "https://api.miempresa.com/auth/login",
    "value_form": {
      "email": "email",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401
  }
}
```

---

## 🧪 Testing Rápido

Usa las credenciales de ejemplo:
- **Email**: `odin@href.cl`
- **Password**: `6789123450`

Estas funcionan tanto para autenticación local como remota.

---

## 📚 Documentación Completa

Ver [AUTHENTICATION.md](./12-authentication.md) para:
- Configuración avanzada
- Seguridad y mejores prácticas
- Solución de problemas
- API de desarrollo
- Ejemplos completos

---

## 🆘 Problemas Comunes

### ❌ "Login form doesn't appear"
**Solución**: Verificar en consola del navegador:
```javascript
console.log('AuthManager:', !!window.AuthManager);
console.log('Config:', window.LOGIN_CONFIG);
```

### ❌ "Authentication failed"
**Solución**: Usar script de validación:
```bash
cd docs/
node test-credentials.js
```

### ❌ "Templates not found"
**Solución**: Regenerar documentación:
```bash
apidoc -i src/ -o docs/ --debug
```

---

## 🎯 Próximos Pasos

1. ✅ Configurar autenticación básica
2. 🔧 Personalizar usuarios y passwords
3. 🌐 Integrar con tu sistema de auth existente
4. 🚀 Desplegar en producción con HTTPS
5. 📊 Monitorear accesos y uso

¡Tu API Documentation está protegida y lista! 🎉