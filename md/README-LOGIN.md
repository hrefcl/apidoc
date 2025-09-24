# 🔐 APIDoc 4.0 - Sistema de Login

## Descripción

APIDoc 4.0 ahora incluye un sistema de autenticación robusto que permite proteger la documentación de API con login obligatorio. Esta funcionalidad es ideal para APIs privadas que no deben ser accesibles públicamente.

## ✨ Características Principales

### 🔒 **Protección de Contenido**
- **Encriptación Client-Side**: Todo el contenido sensible se encripta usando AES-256-GCM
- **HTML Estático Seguro**: Incluso con "ver código fuente", el contenido no es accesible sin autenticación
- **Carga Progresiva**: Solo se descifra el contenido tras login exitoso

### 🎯 **Dual Authentication Mode**
- **Login Local**: Usuarios preconfigurados en `apidoc.json`
- **Login Remoto**: Autenticación contra API externa
- **Flexibilidad**: Puedes usar uno o ambos métodos simultáneamente

### 🛡️ **Seguridad Avanzada**
- **Session Management**: JWT local con expiración automática
- **Password Hashing**: Contraseñas hasheadas para configuración local
- **Content Integrity**: Checksums para verificar integridad del contenido
- **Cache Busting**: Previene cacheo de credenciales

## 📋 Configuración

### Configuración Básica en `apidoc.json`

```json
{
  "name": "Mi API Privada",
  "version": "1.0.0",
  "login": {
    "active": true,
    "admited": [
      { "email": "admin@company.com", "password": "secure123" },
      { "email": "dev@company.com", "password": "dev456" }
    ]
  }
}
```

### Configuración Completa (Local + Remoto)

```json
{
  "login": {
    "active": true,
    "admited": [
      { "email": "admin@company.com", "password": "admin123" },
      { "email": "developer@company.com", "password": "dev456" }
    ],
    "urlAuth": "https://api.company.com/auth/login",
    "value_form": {
      "email": "username",
      "password": "password"
    },
    "response_success": 200,
    "response_error": 401
  }
}
```

### Configuración Solo Remoto

```json
{
  "login": {
    "active": true,
    "urlAuth": "https://auth.company.com/api/login",
    "value_form": {
      "email": "email",
      "password": "pass"
    },
    "response_success": 200,
    "response_error": 400
  }
}
```

## 🔧 Parámetros de Configuración

| Parámetro | Tipo | Descripción | Requerido |
|-----------|------|-------------|-----------|
| `active` | boolean | Habilita/deshabilita el sistema de login | ✅ |
| `admited` | Array | Lista de usuarios locales válidos | ❌ |
| `admited[].email` | string | Email del usuario | ✅ (si se usa local) |
| `admited[].password` | string | Contraseña del usuario | ✅ (si se usa local) |
| `urlAuth` | string | URL de la API de autenticación remota | ❌ |
| `value_form` | Object | Nombres de campos del formulario remoto | ❌ |
| `value_form.email` | string | Nombre del campo email/usuario | ✅ (si se usa remoto) |
| `value_form.password` | string | Nombre del campo contraseña | ✅ (si se usa remoto) |
| `response_success` | number | Código HTTP de éxito (default: 200) | ❌ |
| `response_error` | number | Código HTTP de error (default: 400) | ❌ |

## 🚀 Uso

### 1. Configurar Login
Edita tu archivo `apidoc.json` añadiendo la sección `login` con tus preferencias.

### 2. Generar Documentación
```bash
# Usando CLI
npx apidoc -i src/ -o docs/

# Usando programáticamente
const { createDoc } = require('@hrefcl/apidoc');

createDoc({
  src: ['./src'],
  dest: './docs'
});
```

### 3. Acceder a la Documentación
1. Abrir `docs/index.html` en el navegador
2. Se mostrará el formulario de login en lugar de la documentación
3. Ingresar credenciales válidas
4. La documentación se descifrará y mostrará automáticamente

## 🎨 Personalización del Login

### Estilos CSS
El formulario de login respeta automáticamente el tema oscuro/claro y usa Tailwind CSS. Los estilos se integran perfectamente con el diseño existente.

### Mensajes de Error
Los errores se muestran de forma clara y accesible:
- Credenciales inválidas
- Errores de conexión (para auth remoto)
- Problemas de desencriptación

### Persistencia de Sesión
- Las sesiones se mantienen en `localStorage`
- Expiración automática después de 24 horas
- Logout manual disponible
- Limpieza automática de sesiones expiradas

## 🧪 Testing

### Script de Prueba Incluido
```bash
node test-login.js
```

Este script:
1. Genera documentación con login habilitado
2. Verifica la correcta integración de componentes
3. Proporciona credenciales de prueba
4. Muestra instrucciones de uso

### Credenciales de Prueba (ejemplo/apidoc.json)
```
Email: odin@href.cl
Password: 1234

Email: thor@href.cl
Password: 1234
```

## 🛠️ Desarrollo

### Estructura de Archivos
```
template/src/components/
├── auth.ts                 # Sistema de autenticación
├── content-protection.ts   # Encriptación de contenido
└── sidebar.ts              # Componentes UI

lib/core/
└── auth-processor.js       # Procesador de autenticación

template/
└── index.html              # Template con soporte de login
```

### APIs Principales

#### AuthManager
```typescript
// Inicializar sistema de auth
authManager.init(loginConfig);

// Verificar autenticación
const isAuth = authManager.isAuthenticated();

// Hacer login
const result = await authManager.login(email, password);

// Logout
authManager.logout();
```

#### ContentProtection
```typescript
// Encriptar contenido
const encrypted = ContentProtection.encryptContent(html, key);

// Desencriptar contenido
const decrypted = ContentProtection.decryptContent(encrypted, key);

// Proteger secciones sensibles
const { protectedHtml, encryptedSections } =
  ContentProtection.protectSensitiveSections(html, key);
```

## ⚡ Rendimiento

### Optimizaciones
- **Lazy Loading**: Los scripts de auth se cargan solo cuando son necesarios
- **Encrypted Chunks**: Solo el contenido sensible se encripta, no toda la página
- **Session Caching**: Las sesiones válidas evitan re-autenticación
- **Minified Assets**: Todos los recursos están minificados en producción

### Tamaños de Bundle
- Auth System: ~15KB gzipped
- Crypto Functions: ~8KB gzipped
- UI Components: ~5KB gzipped

## 🔒 Consideraciones de Seguridad

### ⚠️ Limitaciones del Client-Side
- **Inspección de Código**: Usuarios técnicos pueden inspeccionar el JavaScript
- **Fuerza Bruta**: Las credenciales locales son vulnerables a ataques automatizados
- **Man-in-the-Middle**: Usar HTTPS es crucial para auth remoto

### ✅ Buenas Prácticas
1. **Usar Auth Remoto**: Para máxima seguridad, prefiere autenticación remota
2. **HTTPS Obligatorio**: Nunca usar login en HTTP
3. **Contraseñas Fuertes**: Usar contraseñas complejas para cuentas locales
4. **Rotación Regular**: Cambiar credenciales periódicamente
5. **Monitoring**: Monitorear intentos de acceso fallidos

### 🎯 Casos de Uso Recomendados
- **APIs Internas**: Documentación para equipos internos
- **APIs de Staging**: Proteger documentación de desarrollo
- **Cliente Premium**: Documentación exclusiva para clientes pagos
- **Compliance**: Cumplir requisitos de acceso restringido

## 🤝 Compatibilidad

### Navegadores Soportados
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Dependencias Requeridas
- `crypto-js`: Para encriptación AES
- `tailwindcss`: Para estilos del formulario
- Modern JavaScript (ES2020+)

## 📚 Ejemplos Adicionales

### Integración con Express.js
```javascript
// server.js - Servir documentación protegida
app.use('/api-docs', express.static('docs', {
  setHeaders: (res, path) => {
    if (path.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));
```

### Configuración de Nginx
```nginx
# nginx.conf - Headers de seguridad
location /api-docs {
  add_header X-Frame-Options DENY;
  add_header X-Content-Type-Options nosniff;
  add_header Referrer-Policy strict-origin-when-cross-origin;

  try_files $uri $uri/ /api-docs/index.html;
}
```

### Docker Deployment
```dockerfile
# Dockerfile - Servir documentación protegida
FROM nginx:alpine
COPY docs/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## 🐛 Solución de Problemas

### Error: "Login configuration not found"
- Verificar que `login.active = true` en `apidoc.json`
- Confirmar sintaxis JSON válida
- Revisar que exista al menos un método de auth configurado

### Error: "Failed to decrypt content"
- Limpiar localStorage del navegador
- Verificar que las credenciales sean correctas
- Comprobar que el contenido no esté corrupto

### Error: "Remote authentication failed"
- Verificar conectividad a la URL de auth
- Confirmar códigos de respuesta HTTP configurados
- Revisar CORS si es necesario

### Formulario de login no aparece
- Verificar que `login.active = true`
- Comprobar consola del navegador para errores JS
- Confirmar que los archivos de auth se están cargando

## 📈 Roadmap

### Funcionalidades Planificadas
- [ ] Integración con OAuth 2.0
- [ ] Autenticación multi-factor (2FA)
- [ ] Roles y permisos granulares
- [ ] SSO con SAML
- [ ] API Keys como método de auth alternativo
- [ ] Logging y auditoría de accesos
- [ ] Rate limiting para intentos de login

## 🏆 Conclusión

El sistema de login de APIDoc 4.0 proporciona una solución robusta y flexible para proteger documentación de API. Combina la simplicidad de configuración con seguridad avanzada, siendo ideal para equipos que necesitan controlar el acceso a su documentación técnica.

La arquitectura de encriptación client-side garantiza que el contenido permanezca protegido incluso en hosting estático, mientras que la flexibilidad de autenticación dual permite adaptarse a diferentes infraestructuras organizacionales.