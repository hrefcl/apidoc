#!/bin/bash
# Script to publish @hrefcl/apidoc to NPM
# This temporarily removes "private": true to allow publishing

set -e

echo "🚀 Publishing @hrefcl/apidoc to NPM..."

# Build first
echo "📦 Building package..."
npm run build:clean
npm run build:template

# Temporarily remove "private": true from package.json
echo "🔧 Removing 'private' flag temporarily..."
node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); delete pkg.private; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');"

# Publish
echo "📤 Publishing to NPM..."
npm publish --access public

# Restore "private": true
echo "🔙 Restoring 'private' flag..."
node -e "const fs = require('fs'); const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); pkg.private = true; const lines = JSON.stringify(pkg, null, 2).split('\n'); lines.splice(5, 0, '  \"private\": true,'); fs.writeFileSync('package.json', lines.slice(0, 5).join('\n') + '\n' + lines.slice(5).join('\n'));"

# Actually, let's do it properly
git checkout package.json

echo "✅ Published successfully!"
echo "📦 Package: @hrefcl/apidoc"
echo "🔗 https://www.npmjs.com/package/@hrefcl/apidoc"
