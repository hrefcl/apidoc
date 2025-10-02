#!/usr/bin/env node

/**
 * Sync development data from tmp/apidoc-output to public/data
 * This is needed for development mode where we don't embed data in HTML
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE = path.resolve(__dirname, '../../../tmp/apidoc-output/data');
const DEST = path.resolve(__dirname, '../public/data');

async function syncData() {
  try {
    console.log('🔄 Syncing development data...');
    console.log(`   Source: ${SOURCE}`);
    console.log(`   Dest:   ${DEST}`);

    if (!fs.existsSync(SOURCE)) {
      console.error('❌ Source data directory not found:', SOURCE);
      console.log('💡 Run: npm run example:apicat (from project root) to generate data first');
      process.exit(1);
    }

    // Copy entire data directory
    await fs.copy(SOURCE, DEST, { overwrite: true });

    console.log('✅ Development data synced successfully');

    // Show stats
    const files = await fs.readdir(DEST);
    const dirs = (await Promise.all(
      files.map(async f => {
        const stat = await fs.stat(path.join(DEST, f));
        return stat.isDirectory() ? f : null;
      })
    )).filter(Boolean);

    console.log(`📁 Files: ${files.filter(f => f.endsWith('.json')).length} JSONs`);
    console.log(`📂 Directories: ${dirs.join(', ')}`);

  } catch (error) {
    console.error('❌ Error syncing data:', error);
    process.exit(1);
  }
}

syncData();
