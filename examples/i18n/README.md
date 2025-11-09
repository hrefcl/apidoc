# 🌍 i18n Test - Multi-language API Documentation

Ejemplo simple y limpio para probar la funcionalidad de internacionalización (i18n) de APIDoc.

## 📦 Contenido

Este ejemplo contiene:

- **CreateUser** (versión 1.0.0): 3 idiomas (español, inglés, chino)
- **CreateUser** (versión 2.0.0): 2 idiomas (español, inglés) - con más campos
- **GetUser** (versión 1.0.0): 2 idiomas (español, inglés)
- **GetProduct** (versión 1.0.0): 1 idioma (inglés) - sin @apiLang

## 🚀 Ejecutar el demo

### Opción 1: Usar el script (recomendado)

```bash
./examples/i18n-test/serve.sh
```

### Opción 2: Comandos manuales

```bash
# Generar documentación
node bin/apidoc generate -i examples/i18n-test/ -c examples/i18n-test/apidoc.json -o /tmp/i18n-demo

# Servir la documentación
npx serve /tmp/i18n-demo
```

Luego abre tu navegador en: **http://localhost:3000**

## 👀 Qué buscar en el navegador

1. **Selector de idioma** en el header (parte superior derecha)
   - Icono: 🌐 Languages
   - Muestra el código del idioma actual (EN, ES, ZH)

2. **Cambiar idioma**:
   - Click en el selector
   - Selecciona entre: Español, English, 中文

3. **Observa los cambios**:
   - **CreateUser**: Cambia entre español/inglés/chino
   - **GetUser**: Cambia entre español/inglés
   - **GetProduct**: NO cambia (no tiene múltiples idiomas)

4. **Versiones múltiples**:
   - CreateUser tiene v1.0.0 y v2.0.0
   - Cada versión mantiene sus idiomas

## 📝 Archivos

- `apidoc.json` - Configuración con i18n habilitado
- `api.js` - API endpoints con anotaciones @apiLang
- `serve.sh` - Script para generar y servir
- `README.md` - Este archivo

## ✅ Verificación

Si todo funciona correctamente, deberías ver:

- ✅ Selector de idioma visible en el header
- ✅ 3 opciones de idioma: Español 🇪🇸, English 🇬🇧, 中文 🇨🇳
- ✅ Contenido cambia al seleccionar otro idioma
- ✅ Idiomas disponibles para cada endpoint:
  - CreateUser v1.0.0: ES, EN, ZH
  - CreateUser v2.0.0: ES, EN
  - GetUser v1.0.0: ES, EN
  - GetProduct v1.0.0: EN (solo inglés, sin selector)

## 🐛 Troubleshooting

Si no ves el selector de idioma:

1. Verifica que el navegador abrió la URL correcta
2. Abre DevTools (F12) y busca errores en Console
3. Verifica que `/tmp/i18n-demo/index.html` existe
4. Regenera la documentación con el comando manual

## 📚 Diferencia con el ejemplo grande

Este ejemplo es MUCHO más simple que `examples/apidoc/`:

| Ejemplo Grande | Este Demo |
|----------------|-----------|
| 60+ endpoints | 4 endpoints |
| 15+ grupos | 2 grupos (Users, Products) |
| Múltiples features | Solo i18n |
| Difícil de encontrar i18n | Todo es i18n |

Este demo te permite ver SOLO la funcionalidad i18n sin distracciones.
