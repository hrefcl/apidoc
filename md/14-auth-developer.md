# 🛠️ APIDoc 4.0 - Guía del Desarrollador - Sistema de Autenticación

## 📐 Arquitectura Técnica

### Componentes Principales

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   apidoc.json   │───▶│  AuthProcessor  │───▶│  Encrypted HTML │
│   (Config)      │    │   (Build-time)  │    │   + Bundle      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Login    │◀───│   AuthManager   │◀───│     Browser     │
│   (Session)     │    │  (Runtime)      │    │  (Client-side)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flujo de Datos

1. **Build Time**: `AuthProcessor` procesa configuración y encripta contenido
2. **Runtime**: `AuthManager` maneja autenticación y desencripta contenido
3. **Session**: Persistencia en `localStorage` con tokens JWT-like

---

## 🔧 API de Desarrollo

### AuthProcessor (Build-time)

Ubicación: `lib/core/auth-processor.ts`

```typescript
class AuthProcessor {
  init(loginConfig: LoginConfig): void
  processTemplate(templateContent: string, projectData: any): string
  protectSensitiveContent(htmlContent: string): string
  static validateConfig(loginConfig: LoginConfig): ValidationResult
}

interface LoginConfig {
  active: boolean;
  admited?: Array<{ email: string; password: string }>;
  urlAuth?: string;
  value_form?: { email: string; password: string };
  response_success?: number;
  response_error?: number;
}
```

**Métodos clave:**

```typescript
// Inicializar con configuración
processor.init({
  active: true,
  admited: [{ email: "user@test.com", password: "test123" }]
});

// Procesar template HTML
const processedHtml = processor.processTemplate(templateContent, projectData);

// Validar configuración
const validation = AuthProcessor.validateConfig(loginConfig);
if (!validation.valid) {
  console.error('Config errors:', validation.errors);
}
```

### AuthManager (Runtime)

Ubicación: `template/src/components/auth.ts`

```typescript
class AuthManager {
  // Inicialización
  init(loginConfig: LoginConfig): void

  // Estado de autenticación
  isLoginRequired(): boolean
  isAuthenticated(): boolean

  // Proceso de login
  login(email: string, password: string): Promise<LoginResult>
  logout(): void

  // Gestión de sesión
  createSession(email: string, method: 'local' | 'remote'): Promise<void>
  loadSession(): void
  clearSession(): void

  // Información de debug
  getSessionInfo(): AuthSession | null
}

interface LoginResult {
  success: boolean;
  message: string;
}

interface AuthSession {
  email: string;
  authenticated: boolean;
  expires: number;
  method: 'local' | 'remote';
}
```

**Uso en browser:**

```javascript
// AuthManager está disponible globalmente
const authManager = window.authManager;

// Verificar estado
if (authManager.isAuthenticated()) {
  console.log('Usuario autenticado');
}

// Login programático
authManager.login('user@test.com', 'password123')
  .then(result => {
    if (result.success) {
      console.log('Login exitoso');
    } else {
      console.error('Login falló:', result.message);
    }
  });

// Información de sesión
const session = authManager.getSessionInfo();
console.log('Sesión actual:', session);
```

---

## 🔒 Sistema de Encriptación

### Encriptación de Contenido

**Algoritmo**: AES-256-CBC con PBKDF2
**Ubicación**: `AuthProcessor.encryptContent()`

```typescript
interface EncryptedContent {
  data: string;      // Contenido encriptado (Base64)
  iv: string;        // Vector de inicialización
  salt: string;      // Salt para PBKDF2
  timestamp: number; // Timestamp de encriptación
  version: string;   // Versión del algoritmo
}
```

**Proceso**:
1. Generar salt e IV aleatorios
2. Derivar clave usando PBKDF2 (10,000 iteraciones)
3. Encriptar con AES-256-CBC
4. Codificar resultado en Base64

### Hash de Contraseñas

**Algoritmo**: SHA-256 con salt personalizado

```typescript
function hashPassword(password: string, salt: string): string {
  return CryptoJS.SHA256(password + salt + 'apidoc-salt').toString();
}
```

**Uso**:
- Salt = email del usuario
- Sufijo fijo: `'apidoc-salt'`
- Resultado: Hash hexadecimal de 64 caracteres

---

## 🎨 Integración con UI

### Hooks y Eventos

```javascript
// Eventos disponibles
document.addEventListener('apidoc:auth:init', (event) => {
  console.log('Sistema de auth inicializado');
});

document.addEventListener('apidoc:auth:login:success', (event) => {
  console.log('Login exitoso:', event.detail);
});

document.addEventListener('apidoc:auth:login:error', (event) => {
  console.error('Error de login:', event.detail);
});

document.addEventListener('apidoc:auth:logout', (event) => {
  console.log('Usuario desconectado');
});
```

### Personalización de UI

**CSS Custom Properties**:
```css
:root {
  /* Colores del overlay de login */
  --apidoc-auth-overlay-bg: rgba(0, 0, 0, 0.8);
  --apidoc-auth-form-bg: white;
  --apidoc-auth-form-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

  /* Colores del formulario */
  --apidoc-auth-input-bg: white;
  --apidoc-auth-input-border: #d1d5db;
  --apidoc-auth-input-focus: #3b82f6;

  /* Botón de login */
  --apidoc-auth-button-bg: #3b82f6;
  --apidoc-auth-button-hover: #2563eb;
  --apidoc-auth-button-text: white;
}

/* Tema oscuro */
[data-theme="dark"] {
  --apidoc-auth-form-bg: #1f2937;
  --apidoc-auth-input-bg: #374151;
  --apidoc-auth-input-border: #4b5563;
}
```

**HTML del Formulario**:
```html
<div id="auth-overlay" class="fixed inset-0 bg-black bg-opacity-80 z-50">
  <div class="min-h-screen flex items-center justify-center">
    <form class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
      <!-- Form fields -->
    </form>
  </div>
</div>
```

### Integración con Temas

El sistema respeta automáticamente el tema dark/light de APIDoc:

```javascript
// Detectar tema actual
const currentTheme = document.documentElement.getAttribute('data-theme');

// Aplicar estilos según tema
if (currentTheme === 'dark') {
  formElement.classList.add('dark-theme');
}
```

---

## 📊 Testing y Debug

### Scripts de Testing Incluidos

```bash
# Validación completa del sistema
node validate-system.js

# Test de credenciales y hashing
node test-credentials.js

# Flujo completo de testing
node test-complete-workflow.js

# Guía final de testing
node final-test-guide.js
```

### Debug en Browser

```javascript
// Variables globales disponibles
window.AuthManager          // Clase AuthManager
window.authManager         // Instancia global
window.LOGIN_CONFIG        // Configuración parseada
window.API_DATA           // Datos de la API
window.API_PROJECT        // Información del proyecto

// Debug de autenticación
console.log('Auth enabled:', window.authManager?.isLoginRequired());
console.log('Authenticated:', window.authManager?.isAuthenticated());
console.log('Session:', window.authManager?.getSessionInfo());

// Debug de configuración
console.log('Login config:', window.LOGIN_CONFIG);
console.log('Local users:', window.LOGIN_CONFIG?.admited?.length);
console.log('Remote URL:', window.LOGIN_CONFIG?.urlAuth);

// Debug de templates
console.log('Templates loaded:', Object.keys(window.Handlebars?.templates || {}));

// Debug del DOM
console.log('Sidenav exists:', !!document.getElementById('sidenav'));
console.log('Templates exist:', !!document.getElementById('template-header'));
```

### Logging Personalizado

```javascript
// Habilitar debug logging
localStorage.setItem('apidoc-debug', 'true');

// Configurar nivel de log
localStorage.setItem('apidoc-log-level', 'debug'); // debug, info, warn, error

// El sistema mostrará logs detallados en consola
```

---

## 🔌 Extensión y Personalización

### Crear AuthManager Personalizado

```typescript
import AuthManager from './components/auth';

class CustomAuthManager extends AuthManager {
  constructor() {
    super();
    this.customFeatures = true;
  }

  // Sobrescribir método de login
  async login(email: string, password: string): Promise<LoginResult> {
    // Tu lógica personalizada antes del login
    console.log('Custom login logic for:', email);

    // Llamar al método padre
    const result = await super.login(email, password);

    // Tu lógica personalizada después del login
    if (result.success) {
      this.trackLoginEvent(email);
    }

    return result;
  }

  private trackLoginEvent(email: string): void {
    // Analytics, logging, etc.
    console.log('User logged in:', email);
  }
}

// Reemplazar instancia global
window.authManager = new CustomAuthManager();
```

### Middleware de Autenticación

```javascript
class AuthMiddleware {
  constructor(authManager) {
    this.authManager = authManager;
    this.setupMiddleware();
  }

  setupMiddleware() {
    // Interceptar todas las requests
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {

      // Agregar token de autenticación si está disponible
      if (this.authManager.isAuthenticated()) {
        const session = this.authManager.getSessionInfo();
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${session.token}`
        };
      }

      return originalFetch(url, options);
    };
  }
}

// Usar middleware
const middleware = new AuthMiddleware(window.authManager);
```

### Plugin System

```javascript
class AuthPlugin {
  constructor(name, authManager) {
    this.name = name;
    this.authManager = authManager;
  }

  install() {
    // Registrar hooks
    document.addEventListener('apidoc:auth:login:success', (e) => {
      this.onLoginSuccess(e.detail);
    });

    console.log(`Plugin ${this.name} installed`);
  }

  onLoginSuccess(userInfo) {
    // Tu lógica del plugin
  }
}

// Registrar plugins
const analyticsPlugin = new AuthPlugin('Analytics', window.authManager);
analyticsPlugin.install();
```

---

## 🚀 Despliegue en Producción

### Configuración de Build

```bash
# Build para producción
npm run build:clean

# Generar documentación
apidoc -i src/ -o dist/docs/

# Verificar integridad
node dist/docs/validate-system.js
```

### Variables de Entorno

```bash
# Para configuración dinámica
export APIDOC_AUTH_URL="https://api.produccion.com/auth"
export APIDOC_SESSION_TIMEOUT="7200"  # 2 horas
export APIDOC_DEBUG="false"

# Generar con variables
apidoc -i src/ -o dist/docs/ --config production-config.json
```

### Optimizaciones

**Bundle Splitting**:
```javascript
// En esbuild.config.js
export default {
  entryPoints: ['template/src/main.ts'],
  bundle: true,
  splitting: true,
  format: 'esm',
  outdir: 'assets/',
  plugins: [
    // Separar AuthManager en chunk propio
    {
      name: 'auth-chunk',
      setup(build) {
        build.onResolve({ filter: /auth\.ts$/ }, args => ({
          path: args.path,
          external: false,
          namespace: 'auth-chunk'
        }));
      }
    }
  ]
};
```

**Lazy Loading**:
```javascript
// Cargar AuthManager solo cuando sea necesario
async function initAuth() {
  if (window.LOGIN_CONFIG?.active) {
    const { default: AuthManager } = await import('./components/auth');
    window.authManager = new AuthManager();
    window.authManager.init(window.LOGIN_CONFIG);
  }
}
```

### Monitoreo

```javascript
// Métricas de autenticación
class AuthMetrics {
  constructor() {
    this.metrics = {
      loginAttempts: 0,
      successfulLogins: 0,
      failedLogins: 0,
      sessionDuration: []
    };
  }

  trackLogin(success) {
    this.metrics.loginAttempts++;
    if (success) {
      this.metrics.successfulLogins++;
    } else {
      this.metrics.failedLogins++;
    }

    // Enviar a analytics
    this.sendMetrics();
  }

  sendMetrics() {
    // Tu lógica de analytics
  }
}

// Integrar con AuthManager
const metrics = new AuthMetrics();
window.authManager.on('login:attempt', (success) => {
  metrics.trackLogin(success);
});
```

---

## 📚 Referencias

### APIs Externas Compatibles

**Auth0**:
```json
{
  "urlAuth": "https://your-domain.auth0.com/oauth/token",
  "value_form": {
    "email": "username",
    "password": "password"
  }
}
```

**Firebase Auth**:
```json
{
  "urlAuth": "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword",
  "value_form": {
    "email": "email",
    "password": "password"
  }
}
```

**Custom Laravel**:
```json
{
  "urlAuth": "https://api.miapp.com/api/auth/login",
  "value_form": {
    "email": "email",
    "password": "password"
  },
  "response_success": 200,
  "response_error": 422
}
```

### Herramientas Recomendadas

- **Desarrollo**: VS Code + TypeScript + ESLint
- **Testing**: Playwright para e2e, Jest para unit tests
- **Build**: esbuild para rapidez, Webpack para features avanzadas
- **Deploy**: Nginx/Apache, Cloudflare Pages, Netlify, Vercel

### Compatibilidad

- **Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Node.js**: 20.0.0+ (requerido para build)
- **TypeScript**: 5.0+ (para desarrollo)
- **APIs**: Cualquier REST API con POST login

---

¡Sistema completo de autenticación dual implementado y documentado! 🎉