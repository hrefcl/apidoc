#!/bin/bash

# Test All Examples Script
# Verifica que todos los ejemplos generen documentación correctamente

echo "========================================="
echo "  Testing ALL APIDoc v5 Examples"
echo "========================================="
echo ""

# Array de ejemplos a probar
examples=(
  "01-basic-api"
  "02-openapi"
  "03-models"
  "04-mqtt"
  "05-i18n"
  "06-versioning"
  "07-authentication"
  "08-apiSchema"
  "09-code"
  "10-markdown"
  "11-multi-language"
  "12-tsdoc"
)

# Contadores
total=0
passed=0
failed=0

# Limpiar directorio tmp
rm -rf tmp/test-examples
mkdir -p tmp/test-examples

# Probar cada ejemplo
for example in "${examples[@]}"; do
  total=$((total + 1))
  echo -n "Testing $example... "

  output_dir="tmp/test-examples/$example"

  # Ejecutar apidoc generate
  ./bin/apidoc generate \
    -c "examples/$example/apidoc.json" \
    -i "examples/$example/src" \
    -o "$output_dir" > /dev/null 2>&1

  # Verificar si se generó correctamente
  if [ -f "$output_dir/index.html" ]; then
    echo "✅ PASS"
    passed=$((passed + 1))
  else
    echo "❌ FAIL"
    failed=$((failed + 1))
  fi
done

# Resumen
echo ""
echo "========================================="
echo "  Summary"
echo "========================================="
echo "Total:  $total"
echo "Passed: $passed ✅"
echo "Failed: $failed ❌"
echo ""

if [ $failed -eq 0 ]; then
  echo "🎉 All examples passed!"
  exit 0
else
  echo "⚠️  Some examples failed"
  exit 1
fi
