#!/usr/bin/env node
/*
 * APIDoc 4.0 - TypeScript Migration Script
 * Automated migration of JS/MJS files to TypeScript
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const MIGRATION_LOG = 'migration.log';

// Files to skip during migration
const SKIP_FILES = [
  'node_modules',
  'dist',
  'tmp',
  '.git',
  'test',
  'example',
  'bk-',
  'test-output',
  'postcss.config.js',
  'tailwind.config.js',
  'eslint.config.mjs'
];

// TypeScript templates for different file types
const TS_TEMPLATES = {
  locale: (content, filename) => {
    const baseContent = content
      .replace(/export \{ (.+) \};/, 'export { $1 };')
      .replace(/const (\w+) = \{/, 'const $1: LocaleStrings = {');

    return `import type { LocaleStrings } from './locale';\n\n${baseContent}`;
  },

  helper: (content) => {
    return content
      .replace(/function (\w+)\(/g, 'function $1(')
      .replace(/export \{ (.+) \};/, 'export { $1 };');
  },

  core: (content) => {
    // Basic TypeScript conversion patterns
    const converted = content
      .replace(/const (\w+) = require\('([^']+)'\);/g, "import * as $1 from '$2';")
      .replace(/module\.exports = \{([^}]+)\};/, 'export { $1 };')
      .replace(/module\.exports = (\w+);/, 'export default $1;')
      .replace(/\/\*\*\s*\n\s*\*\s*@param\s+\{([^}]+)\}\s+(\w+)/g, '/**\n   * @param $2')
      .replace(/\/\*\*\s*\n\s*\*\s*@returns\s+\{([^}]+)\}/g, '/**\n   * @returns');

    return converted;
  }
};

/**
 * Check if file should be skipped
 */
function shouldSkipFile(filePath) {
  return SKIP_FILES.some(skip => filePath.includes(skip));
}

/**
 * Convert JS/MJS file to TypeScript
 */
function convertToTypeScript(filePath) {
  try {
    console.log(`🔄 Converting: ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);

    let convertedContent = content;

    // Apply conversion based on file location
    if (filePath.includes('/locales/')) {
      convertedContent = TS_TEMPLATES.locale(content, baseName);
    } else if (filePath.includes('hb_helpers') || filePath.includes('jsonifier')) {
      convertedContent = TS_TEMPLATES.helper(content);
    } else {
      convertedContent = TS_TEMPLATES.core(content);
    }

    // Create TypeScript file
    const tsFilePath = path.join(dirName, baseName + '.ts');
    fs.writeFileSync(tsFilePath, convertedContent);

    // Log migration
    fs.appendFileSync(MIGRATION_LOG, `✅ ${filePath} → ${tsFilePath}\n`);

    console.log(`✅ Created: ${tsFilePath}`);
    return tsFilePath;

  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
    fs.appendFileSync(MIGRATION_LOG, `❌ Failed: ${filePath} - ${error.message}\n`);
    return null;
  }
}

/**
 * Find all JS/MJS files
 */
function findJSFiles(directory) {
  const files = [];

  function scanDir(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (shouldSkipFile(fullPath)) continue;

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(js|mjs)$/.test(item)) {
        files.push(fullPath);
      }
    }
  }

  scanDir(directory);
  return files;
}

/**
 * Update import references
 */
function updateImportReferences() {
  console.log('🔄 Updating import references...');

  // Update TypeScript files to use .ts extensions in imports
  const tsFiles = execSync('find . -name "*.ts" -not -path "./node_modules/*" -not -path "./dist/*"',
    { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

  for (const file of tsFiles) {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let updated = false;

      // Update import paths
      content = content.replace(/from ['"]([^'"]+)\.mjs['"]/g, (match, p1) => {
        updated = true;
        return `from '${p1}'`;
      });

      content = content.replace(/from ['"]([^'"]+)\.js['"]/g, (match, p1) => {
        updated = true;
        return `from '${p1}'`;
      });

      if (updated) {
        fs.writeFileSync(file, content);
        console.log(`📝 Updated imports in: ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${file}:`, error.message);
    }
  }
}

/**
 * Main migration function
 */
function main() {
  console.log('🚀 Starting APIDoc TypeScript Migration...\n');

  // Initialize migration log
  fs.writeFileSync(MIGRATION_LOG, `# APIDoc TypeScript Migration Log\nStarted: ${new Date().toISOString()}\n\n`);

  // Find all JS/MJS files
  const jsFiles = findJSFiles('./');
  console.log(`📊 Found ${jsFiles.length} JS/MJS files to migrate\n`);

  // Convert files
  let converted = 0;
  for (const file of jsFiles) {
    if (convertToTypeScript(file)) {
      converted++;
    }
  }

  console.log(`\n✅ Successfully converted ${converted}/${jsFiles.length} files`);

  // Update import references
  updateImportReferences();

  // Final log
  fs.appendFileSync(MIGRATION_LOG, `\nCompleted: ${new Date().toISOString()}\nConverted: ${converted}/${jsFiles.length} files\n`);

  console.log(`\n🎉 Migration complete! Check ${MIGRATION_LOG} for details.`);
  console.log('📋 Next steps:');
  console.log('   1. Run: npm run typecheck');
  console.log('   2. Fix any type errors');
  console.log('   3. Test: npm run build:example');
  console.log('   4. Remove old JS files when ready');
}

if (require.main === module) {
  main();
}

module.exports = { convertToTypeScript, findJSFiles, updateImportReferences };