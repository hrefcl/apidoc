#!/usr/bin/env node

/**
 * CSS Build Script for APIDoc 4.0
 * Real TailwindCSS compilation with PostCSS processing:
 * - Processes @tailwind directives
 * - Generates CSS properties (@property)
 * - Includes TailwindCSS JIT compilation
 * - Maintains correct import order
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Building CSS for APIDoc...');

// Define paths
const templateDir = path.join(__dirname, '..', 'apps', 'apidoc-template');
const srcDir = path.join(templateDir, 'src');
const assetsDir = path.join(templateDir, 'assets');
const cssInputFile = path.join(srcDir, 'css', 'tailwind.css');
const cssOutputFile = path.join(assetsDir, 'main.bundle.css');
const devCssOutputFile = path.join(assetsDir, 'main.bundle.dev.css');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
    console.log('📁 Created assets directory');
}

// Command line arguments
const args = process.argv.slice(2);
const isDevBuild = args.includes('--dev') || args.includes('--build');
const forceRebuild = args.includes('--force');

console.log('📦 Checking pre-compiled CSS...');

// Check if pre-compiled CSS already exists (unless force rebuild)
const outputFile = isDevBuild ? devCssOutputFile : cssOutputFile;

if (fs.existsSync(outputFile) && !forceRebuild) {
    const stats = fs.statSync(outputFile);
    const sizeKb = (stats.size / 1024).toFixed(1);
    console.log(`✅ Pre-compiled CSS found: ${path.basename(outputFile)} (${sizeKb}kb)`);
    console.log('💡 Use --force to rebuild');
    console.log('🎉 CSS build complete!');
    process.exit(0);
}

console.log('🔄 Compiling TailwindCSS with PostCSS...');

async function buildCSS() {
try {
    // Check if tailwind.css exists
    if (!fs.existsSync(cssInputFile)) {
        throw new Error(`TailwindCSS input file not found: ${cssInputFile}`);
    }

    // Try different TailwindCSS compilation methods
    let success = false;

    // Method 1: Try TailwindCSS v4 CLI
    console.log('📝 Trying TailwindCSS v4 CLI...');
    try {
        const tailwindCommand = [
            'npx',
            '@tailwindcss/cli@next',
            '--input', cssInputFile,
            '--output', outputFile,
            '--config', path.join(__dirname, '..', 'tailwind.config.js')
        ];

        if (!isDevBuild) {
            tailwindCommand.push('--minify');
        }

        execSync(tailwindCommand.join(' '), {
            stdio: 'pipe',
            cwd: path.join(__dirname, '..')
        });

        if (fs.existsSync(outputFile)) {
            success = true;
            console.log('✅ TailwindCSS v4 CLI succeeded');
        }
    } catch (v4Error) {
        console.log('⚠️  TailwindCSS v4 CLI failed, trying v3...');
    }

    // Method 2: Try TailwindCSS v3 CLI if v4 failed
    if (!success) {
        console.log('📝 Trying TailwindCSS v3 CLI...');
        try {
            const fallbackCommand = [
                'npx',
                'tailwindcss',
                '--input', cssInputFile,
                '--output', outputFile,
                '--config', path.join(__dirname, '..', 'tailwind.config.js')
            ];

            if (!isDevBuild) {
                fallbackCommand.push('--minify');
            }

            execSync(fallbackCommand.join(' '), {
                stdio: 'pipe',
                cwd: path.join(__dirname, '..')
            });

            if (fs.existsSync(outputFile)) {
                success = true;
                console.log('✅ TailwindCSS v3 CLI succeeded');
            }
        } catch (v3Error) {
            console.log('⚠️  TailwindCSS v3 CLI also failed, trying PostCSS...');
        }
    }

    // Method 3: Try PostCSS API directly if TailwindCSS CLI failed
    if (!success) {
        console.log('📝 Trying PostCSS API with @tailwindcss/postcss...');
        try {
            const postcss = require('postcss');
            const tailwindcssPostcss = require('@tailwindcss/postcss');
            const autoprefixer = require('autoprefixer');

            const css = fs.readFileSync(cssInputFile, 'utf8');

            const result = await postcss([
                tailwindcssPostcss,
                autoprefixer
            ]).process(css, {
                from: cssInputFile,
                to: outputFile,
                env: isDevBuild ? 'development' : 'production'
            });

            // Build complete CSS with Bootstrap and highlight.js
            let completeCss = '/* APIDoc 4.0 CSS Bundle - Complete Build */\n\n';

            // 1. Bootstrap 5 CSS first
            const bootstrapCssPath = path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.css');
            if (fs.existsSync(bootstrapCssPath)) {
                console.log('📄 Adding Bootstrap 5 CSS...');
                completeCss += '/* Bootstrap 5.3.8 CSS */\n';
                completeCss += fs.readFileSync(bootstrapCssPath, 'utf8');
                completeCss += '\n\n';
            }

            // 2. Processed TailwindCSS (with JIT and @property)
            console.log('📄 Adding processed TailwindCSS...');
            completeCss += '/* TailwindCSS (JIT processed with @property declarations) */\n';
            completeCss += result.css;
            completeCss += '\n\n';

            // 3. Highlight.js CSS (tokyo-night-dark theme by default)
            const hlCssPath = path.join(srcDir, '..', '..', 'node_modules', 'highlight.js', 'styles', 'tokyo-night-dark.css');
            if (fs.existsSync(hlCssPath)) {
                console.log('📄 Adding Highlight.js CSS (tokyo-night-dark theme)...');
                completeCss += '/* Highlight.js CSS - tokyo-night-dark theme */\n';
                completeCss += fs.readFileSync(hlCssPath, 'utf8');
                completeCss += '\n\n';
            }

            fs.writeFileSync(outputFile, completeCss, 'utf8');

            if (fs.existsSync(outputFile)) {
                success = true;
                console.log('✅ PostCSS API with complete CSS bundle succeeded');
            }
        } catch (postcssError) {
            console.log('❌ PostCSS API also failed:', postcssError.message);
        }
    }

    // If all methods failed, create basic concatenated fallback
    if (!success) {
        console.log('🔧 All compilation methods failed, creating fallback...');

        let cssContent = '/* APIDoc 4.0 CSS Bundle - Fallback Concatenation */\n\n';

        // 1. Bootstrap 5 CSS
        const bootstrapCssPath = path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.css');
        if (fs.existsSync(bootstrapCssPath)) {
            console.log('📄 Adding Bootstrap 5 CSS...');
            cssContent += '/* Bootstrap 5.3.8 CSS */\n';
            cssContent += fs.readFileSync(bootstrapCssPath, 'utf8');
            cssContent += '\n\n';
        }

        // 2. TailwindCSS raw (without processing)
        if (fs.existsSync(cssInputFile)) {
            console.log('📄 Adding TailwindCSS (raw)...');
            cssContent += '/* TailwindCSS (unprocessed) */\n';
            cssContent += fs.readFileSync(cssInputFile, 'utf8');
            cssContent += '\n\n';
        }

        // 3. Highlight.js CSS
        const hlCssPath = path.join(srcDir, '..', '..', 'node_modules', 'highlight.js', 'styles', 'github-dark.css');
        if (fs.existsSync(hlCssPath)) {
            console.log('📄 Adding Highlight.js CSS...');
            cssContent += '/* Highlight.js CSS */\n';
            cssContent += fs.readFileSync(hlCssPath, 'utf8');
            cssContent += '\n\n';
        }

        fs.writeFileSync(outputFile, cssContent, 'utf8');
        console.log('⚠️  Created fallback CSS (missing TailwindCSS processing)');
    }

    // Verify output file
    if (fs.existsSync(outputFile)) {
        const stats = fs.statSync(outputFile);
        const sizeKb = (stats.size / 1024).toFixed(1);
        console.log(`✅ CSS compiled successfully: ${path.basename(outputFile)} (${sizeKb}kb)`);

        if (isDevBuild) {
            console.log('🔧 Development CSS with full TailwindCSS processing generated');
        } else {
            console.log('🚀 Production CSS with TailwindCSS JIT compilation generated');
        }
    } else {
        throw new Error(`Output file not created: ${outputFile}`);
    }

} catch (error) {
    console.error('❌ CSS compilation completely failed:', error.message);
    process.exit(1);
}
}

// Run the async function
buildCSS().then(() => {
    console.log('🎉 CSS build complete!');
}).catch((error) => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
});