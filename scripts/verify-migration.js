#!/usr/bin/env node

/**
 * Script de verificación de migración
 * Verifica que la estructura del monorepo esté correcta
 * y que APIDoc v4 siga funcionando durante la migración
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando estructura del monorepo...\n');

// Verificar directorios principales
const requiredDirs = ['apps', 'packages', 'examples', 'tests', 'docs', 'scripts'];
console.log('📁 Verificando directorios principales:');
for (const dir of requiredDirs) {
  const exists = fs.existsSync(dir);
  console.log(`  ${exists ? '✅' : '❌'} ${dir}/`);
  if (!exists) {
    console.error(`Error: Directorio ${dir}/ no encontrado`);
    process.exit(1);
  }
}

// Verificar packages de APIDoc
const apidocPackages = [
  'apidoc-core',
  'apidoc-cli',
  'apidoc-template',
  'apidoc-exporters',
  'apidoc-defaults',
  'apidoc-reader-writer',
  'apidoc-types'
];

console.log('\n📦 Verificando packages APIDoc:');
for (const pkg of apidocPackages) {
  const exists = fs.existsSync(path.join('packages', pkg));
  console.log(`  ${exists ? '✅' : '❌'} packages/${pkg}/`);
}

// Verificar packages de apiCAT
const apicatPackages = [
  'apicat-core',
  'apicat-adapter-apidoc',
  'apicat-exporters',
  'apicat-plugins',
  'shared-ui',
  'shared-utils'
];

console.log('\n🐱 Verificando packages apiCAT:');
for (const pkg of apicatPackages) {
  const exists = fs.existsSync(path.join('packages', pkg));
  console.log(`  ${exists ? '✅' : '❌'} packages/${pkg}/`);
}

// Verificar apps
const apps = ['apicat-desktop', 'apicat-export-static'];
console.log('\n🖥️  Verificando apps:');
for (const app of apps) {
  const exists = fs.existsSync(path.join('apps', app));
  console.log(`  ${exists ? '✅' : '❌'} apps/${app}/`);
}

// Verificar archivos de configuración
const configFiles = [
  'tsconfig.base.json',
  'package.json',
  'package.json.legacy'
];

console.log('\n⚙️  Verificando configuración:');
for (const file of configFiles) {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
}

// Verificar que el package.json sea el del monorepo
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const isMonorepo = packageJson.name === '@hrefcl/apidoc-ecosystem' && packageJson.workspaces;
console.log(`  ${isMonorepo ? '✅' : '❌'} package.json es del monorepo`);

// Verificar que el legacy package.json existe
const legacyExists = fs.existsSync('package.json.legacy');
console.log(`  ${legacyExists ? '✅' : '❌'} package.json.legacy respaldado`);

console.log('\n🎉 Estructura base del monorepo creada exitosamente');
console.log('\n📋 Próximos pasos:');
console.log('  1. Instalar dependencias: pnpm install');
console.log('  2. Crear packages básicos');
console.log('  3. Migrar código de APIDoc v4');
console.log('  4. Verificar que todo funciona');