# Example 07: Dual Authentication System

Demuestra cómo documentar APIs con sistema de autenticación dual (Form + API Key).

## 🎯 Objetivo

- **Form Authentication**: Login con usuario/contraseña
- **API Key Authentication**: Autenticación mediante header X-API-Key
- **Protected Endpoints**: Endpoints que requieren autenticación
- **Public Endpoints**: Endpoints sin autenticación

## 📁 Estructura

```
07-authentication/
├── README.md
├── apidoc.json
└── src/
    ├── auth.js          # Endpoints de autenticación
    └── protected.js     # Endpoints protegidos
```

## 🔐 Tipos de Autenticación

### Form Authentication
```javascript
@apiHeader {String} Content-Type application/json
@apiBody {String} email User email
@apiBody {String} password User password
```

### API Key Authentication
```javascript
@apiHeader {String} X-API-Key Your API key
```

## 📚 Uso

```bash
npm run example:07
```
