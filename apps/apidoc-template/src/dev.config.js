/**
 * Development configuration for APIDoc 5.0 Template Development
 * Enhanced workflow with TypeScript support
 */

const path = require('path');
const fs = require('fs');

// Development server configuration
const DEV_CONFIG = {
    // Server settings
    server: {
        port: process.env.PORT || 8080,
        host: process.env.HOST || 'localhost',
        open: true,
        watch: true,
    },

    // Template development settings
    template: {
        entry: './template/src/main.ts', // TypeScript entry point
        entrySimple: './template/src/main-simple.ts', // Simplified TS version
        output: './tmp/apidoc-output',
        hotReload: true,
        sourceMaps: true,
    },

    // Build optimization
    build: {
        minify: false, // Disable for development
        bundleAnalyzer: false,
        typeCheck: true,
        eslint: true,
    },

    // TypeScript configuration
    typescript: {
        strict: false, // Relaxed for development
        incremental: true,
        skipLibCheck: true,
    },
};

// Helper functions for development workflow
const DevHelpers = {
    /**
     * Watch template files and rebuild on changes
     */
    watchTemplate() {
        const chokidar = require('chokidar');
        const watcher = chokidar.watch('./template/src/**/*', {
            ignored: /node_modules/,
            persistent: true,
        });

        watcher.on('change', (filepath) => {
            console.log(`📝 Template file changed: ${filepath}`);
            console.log('🔄 Rebuilding...');
            // Trigger rebuild
            this.rebuild();
        });

        console.log('👀 Watching template files for changes...');
    },

    /**
     * Rebuild documentation with current settings
     */
    rebuild() {
        const { spawn } = require('child_process');
        const rebuild = spawn('npm', ['run', 'build:example'], {
            stdio: 'inherit',
            shell: true,
        });

        rebuild.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Rebuild complete!');
            } else {
                console.log('❌ Rebuild failed!');
            }
        });
    },

    /**
     * Start development server with live reload
     */
    startDevServer() {
        const express = require('express');
        const path = require('path');

        const app = express();
        const outputDir = path.resolve(DEV_CONFIG.template.output);

        // Serve static files from output directory
        app.use(express.static(outputDir));

        // SPA fallback
        app.get('*', (req, res) => {
            res.sendFile(path.join(outputDir, 'index.html'));
        });

        app.listen(DEV_CONFIG.server.port, () => {
            console.log(`🚀 APIDoc dev server running at http://${DEV_CONFIG.server.host}:${DEV_CONFIG.server.port}`);
            console.log(`📁 Serving from: ${outputDir}`);
        });
    },

    /**
     * TypeScript type checking for template development
     */
    typeCheck() {
        const { spawn } = require('child_process');
        const tsc = spawn('npx', ['tsc', '--noEmit'], {
            stdio: 'inherit',
            shell: true,
        });

        tsc.on('close', (code) => {
            if (code === 0) {
                console.log('✅ TypeScript check passed!');
            } else {
                console.log('❌ TypeScript errors found!');
            }
        });
    },
};

module.exports = {
    DEV_CONFIG,
    DevHelpers,
};
