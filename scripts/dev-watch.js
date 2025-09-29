/**
 * Development Hot Reload Script
 * Watches for TypeScript changes and automatically rebuilds the documentation
 */

const { spawn, exec } = require('child_process');
const { watch } = require('fs');
const path = require('path');

let isBuilding = false;
let buildQueue = false;

console.log('🚀 Starting APIDoc development mode with hot reload...');

// Function to rebuild documentation
function rebuild() {
    if (isBuilding) {
        buildQueue = true;
        return;
    }

    isBuilding = true;
    console.log('\n🔄 Changes detected, rebuilding...');

    const startTime = Date.now();

    exec('npm run build:example', (error, stdout, stderr) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        if (error) {
            console.error('❌ Build failed:', error.message);
        } else {
            console.log(`✅ Build completed in ${duration}ms`);
            console.log('🌐 Documentation updated at http://localhost:8080');
        }

        isBuilding = false;

        if (buildQueue) {
            buildQueue = false;
            setTimeout(rebuild, 100); // Debounce rapid changes
        }
    });
}

// Watch TypeScript files
const watchPaths = [path.join(__dirname, '../template/src'), path.join(__dirname, '../lib'), path.join(__dirname, '../example')];

watchPaths.forEach((watchPath) => {
    console.log(`👀 Watching: ${watchPath}`);

    watch(watchPath, { recursive: true }, (eventType, filename) => {
        if (filename && (filename.endsWith('.ts') || filename.endsWith('.tsx') || filename.endsWith('.js') || filename.endsWith('.css') || filename.endsWith('.json'))) {
            console.log(`📝 Changed: ${filename}`);
            rebuild();
        }
    });
});

// Initial build
rebuild();

console.log('\n📂 Watching for changes in:');
console.log('   - template/src/**/*.{ts,tsx,js,css}');
console.log('   - lib/**/*.{ts,js}');
console.log('   - example/**/*');
console.log('\n💡 Press Ctrl+C to stop');
