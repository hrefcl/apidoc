#!/usr/bin/env node

/**
 * Script para copiar archivos JSON generados por APIDoc/APIcat
 * desde tmp/apicat-output a apps/apicat-template/public/data
 * y generar un índice JSON con toda la estructura de archivos
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'tmp', 'apicat-output');
const TARGET_DIR = path.join(__dirname, '..', 'apps', 'apicat-template', 'public', 'data');

/**
 * Limpia recursivamente un directorio
 */
function cleanDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      cleanDirectory(fullPath);
      fs.rmdirSync(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

/**
 * Copia recursivamente archivos JSON y retorna información de cada archivo
 */
function copyDirectoryRecursive(sourceDir, targetDir, baseDir = '', copiedFiles = []) {
  // Crear directorio de destino
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    const relativePath = baseDir ? `${baseDir}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      // Copiar subdirectorio recursivamente
      copyDirectoryRecursive(sourcePath, targetPath, relativePath, copiedFiles);
    } else if (entry.name.endsWith('.json')) {
      // Copiar archivo JSON
      fs.copyFileSync(sourcePath, targetPath);

      const stats = fs.statSync(targetPath);
      const fileInfo = {
        filename: entry.name,
        relativePath: relativePath,
        directory: baseDir || 'root',
        title: entry.name.replace('.encrypted.json', '').replace('.json', '').replace('cat.', ''),
        encrypted: entry.name.includes('.encrypted'),
        size: stats.size,
        path: `/data/${relativePath}`
      };

      copiedFiles.push(fileInfo);
      console.log(`  ✅ ${relativePath} (${(stats.size / 1024).toFixed(2)} KB)`);
    }
  }

  return copiedFiles;
}

/**
 * Organiza los archivos por categoría
 */
function organizeFilesByCategory(files) {
  const organized = {
    root: [],
    'cat.api': [],
    'cat.docs': [],
    'cat.tsdoc': []
  };

  files.forEach(file => {
    const category = file.directory === 'root' ? 'root' : file.directory;

    if (category.startsWith('cat.api')) {
      organized['cat.api'].push(file);
    } else if (category.startsWith('cat.docs')) {
      organized['cat.docs'].push(file);
    } else if (category.startsWith('cat.tsdoc')) {
      organized['cat.tsdoc'].push(file);
    } else {
      organized['root'].push(file);
    }
  });

  return organized;
}

function copyApicatJson() {
  console.log('📋 Copiando estructura completa de APIcat...\n');

  // Verificar que existe el directorio fuente
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Error: No existe el directorio ${SOURCE_DIR}`);
    console.log('💡 Ejecuta primero: npm run build && ./bin/apidoc -v -i examples/apicat/ -o ./tmp/apicat-output');
    process.exit(1);
  }

  // Limpiar directorio de destino completamente
  console.log('🧹 Limpiando directorio de destino...');
  cleanDirectory(TARGET_DIR);

  // Recrear directorio de destino
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  // Copiar toda la estructura recursivamente
  console.log('📁 Copiando archivos...\n');
  const copiedFiles = copyDirectoryRecursive(SOURCE_DIR, TARGET_DIR);

  if (copiedFiles.length === 0) {
    console.warn('⚠️  No se encontraron archivos JSON');
    return;
  }

  // Organizar archivos por categoría
  const organized = organizeFilesByCategory(copiedFiles);

  // Generar índice JSON completo
  const indexPath = path.join(TARGET_DIR, '_index.json');
  const indexData = {
    generated: new Date().toISOString(),
    total: copiedFiles.length,
    categories: {
      root: organized.root.length,
      'cat.api': organized['cat.api'].length,
      'cat.docs': organized['cat.docs'].length,
      'cat.tsdoc': organized['cat.tsdoc'].length
    },
    organized,
    files: copiedFiles
  };

  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

  // Resumen
  console.log(`\n✨ Total: ${copiedFiles.length} archivos copiados`);
  console.log(`\n📊 Distribución:`);
  console.log(`   📄 Root: ${organized.root.length} archivos`);
  console.log(`   🔌 cat.api: ${organized['cat.api'].length} archivos`);
  console.log(`   📝 cat.docs: ${organized['cat.docs'].length} archivos`);
  console.log(`   📚 cat.tsdoc: ${organized['cat.tsdoc'].length} archivos`);
  console.log(`\n📄 Índice generado: _index.json`);
}

// Ejecutar
try {
  copyApicatJson();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
