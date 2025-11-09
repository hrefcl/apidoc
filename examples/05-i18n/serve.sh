#!/bin/bash
# Script para probar el ejemplo i18n

echo "🌍 i18n Demo - Multi-language API Documentation Test"
echo ""
echo "📦 Generando documentación..."
node bin/apidoc generate -i examples/i18n-test/ -c examples/i18n-test/apidoc.json -o /tmp/i18n-demo-v5

echo ""
echo "✅ Documentación generada en: /tmp/i18n-demo-v5"
echo ""
echo "📊 Contenido generado:"
echo "   - CreateUser: versiones 1.0.0 y 2.0.0 (español, inglés, chino)"
echo "   - GetUser: versión 1.0.0 (español, inglés)"
echo "   - GetProduct: versión 1.0.0 (inglés solamente)"
echo ""
echo "🌐 Idiomas disponibles:"
grep -o '"hasMultipleLanguages":true' /tmp/i18n-demo-v5/index.html | wc -l | xargs -I {} echo "   - {} endpoints con múltiples idiomas"
echo ""
echo "🚀 Iniciando servidor en http://localhost:3000"
echo ""
echo "👀 QUÉ BUSCAR EN EL NAVEGADOR:"
echo "   1. Selector de idioma en el header (icono 🌐 + código del idioma)"
echo "   2. Click en el selector para cambiar entre ES/EN/ZH"
echo "   3. Observa cómo cambia el contenido de 'CreateUser' y 'GetUser'"
echo "   4. 'GetProduct' no cambia (no tiene @apiLang)"
echo ""
echo "⚠️  IMPORTANTE: Debes abrir http://localhost:3000 en el navegador"
echo "   NO abrir el archivo directamente (file://) - Vue 3 requiere HTTP"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npx serve /tmp/i18n-demo-v5
