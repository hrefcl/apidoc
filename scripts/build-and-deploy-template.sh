#!/bin/bash

# Script para compilar y desplegar el template Vue correctamente
# Uso: ./scripts/build-and-deploy-template.sh

set -e

echo "🎨 Compilando template Vue..."

# 1. Limpiar cache de Vite
echo "🧹 Limpiando cache de Vite..."
rm -rf apps/apidoc-template-v5/node_modules/.vite

# 2. Compilar template
echo "📦 Compilando template..."
npm run build:template

# 3. Copiar a ubicación empaquetada
echo "📋 Copiando template a ubicación empaquetada..."
cp apps/apidoc-template-v5/dist/index.html template/index.html

# 4. Verificar que se copió correctamente
if [ -f "template/index.html" ]; then
    SIZE=$(ls -lh template/index.html | awk '{print $5}')
    echo "✅ Template actualizado correctamente (${SIZE})"
else
    echo "❌ Error: No se pudo copiar el template"
    exit 1
fi

echo ""
echo "🎉 ¡Template compilado y desplegado!"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Regenerar documentación: cd examples/i18n-test && node ../../bin/apidoc generate"
echo "   2. Abrir navegador: open http://localhost:3900"
