#!/usr/bin/env node

/**
 * Custom formatter for Handlebars templates embedded in HTML scripts
 * Prettier has limitations with embedded template languages, so this script
 * provides proper indentation for Handlebars content within <script> tags.
 */

const fs = require('fs');
const path = require('path');

function formatHandlebarsTemplate(content) {
    const lines = content.split('\n');
    const formatted = [];
    let indentLevel = 0;
    const baseIndent = '    '; // 4 spaces
    let inScriptTag = false;
    let scriptIndentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const trimmedLine = line.trim();

        // Detect script tags with handlebars templates
        if (trimmedLine.includes('<script') && trimmedLine.includes('type="text/x-handlebars-template"')) {
            inScriptTag = true;
            scriptIndentLevel = line.length - line.trimStart().length;
            formatted.push(line);
            indentLevel = 0; // Reset indent level for each script
            continue;
        }

        if (inScriptTag && trimmedLine === '</script>') {
            inScriptTag = false;
            formatted.push(line);
            continue;
        }

        if (inScriptTag && trimmedLine) {
            // Calculate base indentation (script indent + 1 level)
            let currentIndent = scriptIndentLevel + baseIndent.length;

            // Decrease indent BEFORE processing certain tags
            if (trimmedLine.startsWith('{{/') ||
                trimmedLine.startsWith('</') ||
                trimmedLine === '{{else}}') {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // Apply indentation
            const indent = ' '.repeat(currentIndent + (indentLevel * baseIndent.length));
            formatted.push(indent + trimmedLine);

            // Increase indent AFTER processing opening tags
            if (isOpeningTag(trimmedLine) ||
                trimmedLine.startsWith('{{#') ||
                trimmedLine === '{{else}}') {
                indentLevel++;
            }
        } else if (inScriptTag) {
            // Empty lines in script tags
            formatted.push('');
        } else {
            // Outside script tags, keep original formatting
            formatted.push(line);
        }
    }

    return formatted.join('\n');
}

function isOpeningTag(line) {
    const trimmed = line.trim();

    // Check if it's an HTML opening tag (not closing or self-closing)
    if (trimmed.startsWith('<') && !trimmed.startsWith('</')) {
        // Self-closing tags don't increase indent
        if (trimmed.endsWith('/>')) {
            return false;
        }

        // Single line tags with content (like <h1>content</h1>) don't increase indent
        if (trimmed.includes('</')) {
            return false;
        }

        // Multi-line opening tags - check if this line closes the tag
        if (trimmed.endsWith('>')) {
            return true;
        }

        // Opening tag continues on next line
        return true;
    }

    return false;
}

function formatFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const formatted = formatHandlebarsTemplate(content);

        if (content !== formatted) {
            fs.writeFileSync(filePath, formatted);
            console.log(`✓ Formatted: ${filePath}`);
            return true;
        } else {
            console.log(`- No changes: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`✗ Error formatting ${filePath}:`, error.message);
        return false;
    }
}

// Main execution
function main() {
    const templatePath = path.join(__dirname, '../template/index.html');

    console.log('🔧 Formatting Handlebars templates...\n');

    const changed = formatFile(templatePath);

    console.log('\n✨ Formatting complete!');
    if (changed) {
        console.log('💡 Run `npm run format:html` to apply Prettier formatting to the rest of the HTML.');
    }
}

if (require.main === module) {
    main();
}

module.exports = { formatHandlebarsTemplate, formatFile };