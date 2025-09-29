/**
 * apiCAT Plugin for APIDoc
 * Extends APIDoc functionality with local testing and collection management
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { ApiDocProject } from '../../types';

/**
 * apiCAT Plugin Configuration
 */
export interface ApiCatConfig {
    enabled: boolean;
    outputDir?: string;
    generateCollections?: boolean;
    enableLocalTesting?: boolean;
}

/**
 * apiCAT Plugin Class
 * Generates collections and testing data from APIDoc documentation
 */
export class ApiCatPlugin {
    private config: ApiCatConfig;
    private outputDir: string;

    constructor(config: ApiCatConfig = { enabled: false }) {
        this.config = {
            enabled: false,
            outputDir: './apicat-output',
            generateCollections: true,
            enableLocalTesting: true,
            ...config,
        };

        this.outputDir = this.config.outputDir || './apicat-output';
    }

    /**
     * Process APIDoc data and generate apiCAT collections
     * @param apiData
     * @param projectInfo
     */
    public async process(apiData: any, projectInfo: ApiDocProject): Promise<void> {
        if (!this.config.enabled) {
            return;
        }

        console.log('🐱 apiCAT: Processing API documentation...');

        try {
            // Use the output destination from writer (tmp/apicat-output)
            const outputPath = path.resolve('./tmp/apicat-output');
            await fs.ensureDir(outputPath);

            // Generate modular JSON structure
            await this.generateModularStructure(apiData, projectInfo, outputPath);

            // Copy template assets to output
            await this.copyTemplateAssets(outputPath);

            console.log(`✅ apiCAT: Modular structure generated in ${outputPath}`);
        } catch (error) {
            console.error('❌ apiCAT: Error processing documentation:', error);
            throw error;
        }
    }

    /**
     * Generate modular JSON structure for apiCAT v5
     * @param apiData
     * @param projectInfo
     * @param outputPath
     */
    private async generateModularStructure(apiData: any, projectInfo: ApiDocProject, outputPath: string): Promise<void> {
        // Create subdirectories
        await fs.ensureDir(path.join(outputPath, 'cat.api'));
        await fs.ensureDir(path.join(outputPath, 'cat.docs'));
        await fs.ensureDir(path.join(outputPath, 'cat.tsdoc'));
        await fs.ensureDir(path.join(outputPath, 'assets'));

        // Transform data using adapter
        const adapter = require('../../adapters/apidoc-to-apicat');
        const apicatData = adapter.transformToApiCAT(apiData, projectInfo);

        // Generate main manifest (cat.json)
        const manifest = {
            schemaVersion: '5.0.0',
            generatedAt: new Date().toISOString(),
            generator: {
                name: 'apiCAT',
                version: '5.0.0-alpha.1',
                url: 'https://apidoc.app',
            },
            meta: 'cat.meta.json',
            navigation: 'cat.navigation.json',
            api: {
                index: 'cat.api.index.json',
                shards: this.generateShardList(apicatData.groups),
            },
            docs: this.generateDocsMap(apicatData.groups),
            tsdoc: ['cat.tsdoc/core.json', 'cat.tsdoc/models.json'],
            search: 'cat.search.json',
            assets: 'cat.assets.json',
        };

        await fs.writeFile(path.join(outputPath, 'cat.json'), JSON.stringify(manifest, null, 2));

        // Generate meta
        await fs.writeFile(
            path.join(outputPath, 'cat.meta.json'),
            JSON.stringify(
                {
                    name: apicatData.project.name,
                    version: apicatData.project.version,
                    description: apicatData.project.description,
                    title: apicatData.project.title,
                    url: apicatData.project.url,
                    sampleUrl: apicatData.project.sampleUrl,
                    generatedAt: manifest.generatedAt,
                },
                null,
                2
            )
        );

        // Generate navigation
        await this.generateNavigation(apicatData, outputPath);

        // Generate API index and shards
        await this.generateApiStructure(apicatData, outputPath);

        // Generate search index
        await this.generateSearchIndex(apicatData, outputPath);

        // Generate assets manifest
        await this.generateAssetsManifest(outputPath);

        // Generate docs and tsdoc content
        await this.generateDocumentationContent(apicatData, projectInfo, outputPath);
    }

    /**
     * Generate shard list for manifest
     * @param groups
     */
    private generateShardList(groups: string[]): string[] {
        return groups.map((group) => `cat.api/${group.toLowerCase()}.json`);
    }

    /**
     * Generate docs map for manifest
     * @param groups
     */
    private generateDocsMap(groups: string[]): Record<string, string> {
        const docsMap: Record<string, string> = {
            header: 'cat.docs/header.html',
            footer: 'cat.docs/footer.html',
        };

        groups.forEach((group) => {
            docsMap[`group.${group}`] = `cat.docs/group.${group}.html`;
        });

        return docsMap;
    }

    /**
     * Generate navigation structure
     * @param apicatData
     * @param outputPath
     */
    private async generateNavigation(apicatData: any, outputPath: string): Promise<void> {
        const groups = apicatData.groups.map((groupName: string) => ({
            id: groupName,
            title: groupName,
            icon: this.getGroupIcon(groupName),
            endpoints: apicatData.endpoints.filter((ep: any) => ep.group === groupName).map((ep: any) => ep.id),
        }));

        const navigation = {
            groups,
            order: apicatData.groups,
            stats: {
                totalEndpoints: apicatData.endpoints.length,
                totalGroups: groups.length,
                lastUpdated: new Date().toISOString(),
            },
        };

        await fs.writeFile(path.join(outputPath, 'cat.navigation.json'), JSON.stringify(navigation, null, 2));
    }

    /**
     * Generate API index and shards
     * @param apicatData
     * @param outputPath
     */
    private async generateApiStructure(apicatData: any, outputPath: string): Promise<void> {
        // API Index
        const apiIndex = {
            endpoints: apicatData.endpoints.map((ep: any) => ({
                id: ep.id,
                method: ep.method,
                path: ep.url,
                group: ep.group,
                summary: ep.title,
                version: ep.version,
                shard: `cat.api/${ep.group.toLowerCase()}.json`,
            })),
            stats: {
                totalEndpoints: apicatData.endpoints.length,
                byGroup: this.getStatsByGroup(apicatData.endpoints),
                byMethod: this.getStatsByMethod(apicatData.endpoints),
            },
            lastUpdated: new Date().toISOString(),
        };

        await fs.writeFile(path.join(outputPath, 'cat.api.index.json'), JSON.stringify(apiIndex, null, 2));

        // Generate shards by group
        const groups = apicatData.groups;
        for (const group of groups) {
            const groupEndpoints = apicatData.endpoints.filter((ep: any) => ep.group === group);
            const shard = {
                group,
                endpoints: groupEndpoints,
                generatedAt: new Date().toISOString(),
            };

            await fs.writeFile(path.join(outputPath, 'cat.api', `${group.toLowerCase()}.json`), JSON.stringify(shard, null, 2));
        }
    }

    /**
     * Generate search index
     * @param apicatData
     * @param outputPath
     */
    private async generateSearchIndex(apicatData: any, outputPath: string): Promise<void> {
        const documents = apicatData.endpoints.map((ep: any) => ({
            id: ep.id,
            type: 'endpoint',
            title: ep.title,
            path: ep.url,
            group: ep.group,
            method: ep.method,
            tags: [ep.group.toLowerCase(), ep.method.toLowerCase(), ...ep.title.toLowerCase().split(' ')],
            summary: ep.description,
            ref: {
                type: 'endpoint',
                id: ep.id,
                shard: `cat.api/${ep.group.toLowerCase()}.json`,
            },
        }));

        const searchIndex = {
            documents,
            stats: {
                totalDocuments: documents.length,
                byType: { endpoint: documents.length },
            },
            generatedAt: new Date().toISOString(),
        };

        await fs.writeFile(path.join(outputPath, 'cat.search.json'), JSON.stringify(searchIndex, null, 2));
    }

    /**
     * Generate assets manifest
     * @param outputPath
     */
    private async generateAssetsManifest(outputPath: string): Promise<void> {
        const assets = {
            favicon: {
                path: 'assets/favicon.svg',
                hash: 'sha256-placeholder',
                size: 1024,
                mime: 'image/svg+xml',
            },
            logo: { light: null, dark: null },
            stylesheets: [
                {
                    path: 'assets/apicat.css',
                    hash: 'sha256-placeholder',
                    size: 45000,
                    mime: 'text/css',
                },
            ],
            scripts: [
                {
                    path: 'assets/apicat.js',
                    hash: 'sha256-placeholder',
                    size: 25000,
                    mime: 'application/javascript',
                },
            ],
            generatedAt: new Date().toISOString(),
        };

        await fs.writeFile(path.join(outputPath, 'cat.assets.json'), JSON.stringify(assets, null, 2));
    }

    /**
     * Generate docs and tsdoc content using real markdown files
     * @param apicatData
     * @param projectInfo
     * @param outputPath
     */
    private async generateDocumentationContent(apicatData: any, projectInfo: any, outputPath: string): Promise<void> {
        // Process custom markdown settings
        const customMarkdown = await this.processCustomMarkdownSettings(projectInfo);

        // Generate docs for each group
        for (const group of apicatData.groups) {
            let groupHtml = '';

            if (customMarkdown[group]) {
                // Use processed markdown content
                groupHtml = `<div class="group-docs custom-markdown">
                    ${customMarkdown[group].html}
                </div>`;
            } else {
                // Fallback to placeholder
                groupHtml = `<div class="group-docs">
                    <h2>${group} API</h2>
                    <p>Documentation for ${group} endpoints.</p>
                    <p class="text-muted">Generated by apiCAT v5.0</p>
                </div>`;
            }

            await fs.writeFile(path.join(outputPath, 'cat.docs', `group.${group}.html`), groupHtml);
        }

        // Generate header and footer
        let headerHtml = '<div class="header-docs"><h1>API Documentation</h1><p>Welcome to the API documentation.</p></div>';
        let footerHtml = '<div class="footer-docs"><p>Generated with apiCAT v5.0 - <a href="https://apidoc.app">Learn more</a></p></div>';

        if (customMarkdown.header) {
            headerHtml = `<div class="header-docs custom-markdown">${customMarkdown.header.html}</div>`;
        }

        if (customMarkdown.footer) {
            footerHtml = `<div class="footer-docs custom-markdown">${customMarkdown.footer.html}</div>`;
        }

        await fs.writeFile(path.join(outputPath, 'cat.docs', 'header.html'), headerHtml);

        await fs.writeFile(path.join(outputPath, 'cat.docs', 'footer.html'), footerHtml);

        // Generate TSDoc documentation
        const tsdocData = await this.generateTSDocData();

        for (const [moduleName, moduleData] of Object.entries(tsdocData)) {
            // Save JSON data
            await fs.writeFile(path.join(outputPath, 'cat.tsdoc', `${moduleName}.json`), JSON.stringify(moduleData, null, 2));

            // Generate HTML documentation
            const htmlDoc = this.generateTSDocHTML(moduleData as any);
            await fs.writeFile(path.join(outputPath, 'cat.docs', `tsdoc.${moduleName}.html`), htmlDoc);
        }
    }

    /**
     * Process custom markdown settings from apidoc.json (copied from writer.ts)
     * @param projectInfo
     */
    private async processCustomMarkdownSettings(projectInfo: any): Promise<Record<string, any>> {
        const customMarkdown: Record<string, any> = {};

        if (!projectInfo.settings && !projectInfo.header && !projectInfo.footer) {
            return customMarkdown;
        }

        const MarkdownIt = require('markdown-it');
        const md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
        });

        // Process header and footer (they come already processed from writer)
        if (projectInfo.header && projectInfo.header.content) {
            customMarkdown.header = {
                title: projectInfo.header.title || 'Header',
                icon: projectInfo.header.icon || 'fa-home',
                html: projectInfo.header.content,
                raw: '', // Not available since it's already processed
            };
        }

        if (projectInfo.footer && projectInfo.footer.content) {
            customMarkdown.footer = {
                title: projectInfo.footer.title || 'Footer',
                icon: projectInfo.footer.icon || 'fa-lightbulb',
                html: projectInfo.footer.content,
                raw: '', // Not available since it's already processed
            };
        }

        // Process group settings
        if (projectInfo.settings) {
            for (const [groupName, settings] of Object.entries<any>(projectInfo.settings)) {
                if (settings.filename) {
                    try {
                        const markdownPath = path.resolve('./examples/apicat/', settings.filename);
                        if (await fs.pathExists(markdownPath)) {
                            const markdownContent = await fs.readFile(markdownPath, 'utf8');
                            const htmlContent = md.render(markdownContent);

                            customMarkdown[groupName] = {
                                title: settings.title || groupName,
                                icon: settings.icon || 'fa-folder',
                                html: htmlContent,
                                raw: markdownContent,
                            };
                        }
                    } catch (error) {
                        console.log(`Error processing markdown for group ${groupName}: ${error.message}`);
                    }
                }
            }
        }

        return customMarkdown;
    }

    /**
     * Generate TSDoc documentation from TypeScript files
     */
    private async generateTSDocData(): Promise<Record<string, any>> {
        try {
            const ts = require('typescript');
            const tsdocData: Record<string, any> = {};

            // Find all TypeScript files in core directory
            const coreFiles = await this.findTypeScriptFiles(['./core']);

            // Parse files by module groups
            const moduleGroups = {
                core: coreFiles.filter((f) => f.includes('/apidoc/') || f.includes('/types/')),
                exporters: coreFiles.filter((f) => f.includes('/exporters/')),
                markdown: coreFiles.filter((f) => f.includes('/markdown/')),
                parsers: coreFiles.filter((f) => f.includes('/parsers/')),
                filters: coreFiles.filter((f) => f.includes('/filters/')),
                plugins: coreFiles.filter((f) => f.includes('/plugins/')),
            };

            for (const [moduleName, files] of Object.entries(moduleGroups)) {
                if (files.length === 0) continue;

                const symbols: any[] = [];

                for (const filePath of files) {
                    try {
                        const fileContent = await fs.readFile(filePath, 'utf8');
                        const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.ES2020, true);

                        const fileSymbols = this.extractTSDocSymbols(sourceFile, filePath, ts);
                        symbols.push(...fileSymbols);
                    } catch (error) {
                        console.warn(`Warning: Could not process ${filePath}: ${error.message}`);
                    }
                }

                tsdocData[moduleName] = {
                    module: moduleName,
                    description: this.getModuleDescription(moduleName),
                    symbols,
                    fileCount: files.length,
                    generatedAt: new Date().toISOString(),
                };
            }

            return tsdocData;
        } catch (error) {
            console.warn('TSDoc generation failed:', error.message);
            // Fallback to placeholder data
            return {
                core: {
                    module: 'core',
                    description: 'Core APIDoc functionality',
                    symbols: [],
                    generatedAt: new Date().toISOString(),
                },
            };
        }
    }

    /**
     * Find all TypeScript files in given directories
     * @param directories
     */
    private async findTypeScriptFiles(directories: string[]): Promise<string[]> {
        const files: string[] = [];

        for (const dir of directories) {
            if (!(await fs.pathExists(dir))) continue;

            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    // Recursively search subdirectories
                    const subFiles = await this.findTypeScriptFiles([fullPath]);
                    files.push(...subFiles);
                } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
                    files.push(fullPath);
                }
            }
        }

        return files;
    }

    /**
     * Extract TSDoc symbols from a TypeScript source file
     * @param sourceFile
     * @param filePath
     * @param ts
     */
    private extractTSDocSymbols(sourceFile: any, filePath: string, ts: any): any[] {
        const symbols: any[] = [];

        const visit = (node: any) => {
            // Extract classes
            if (ts.isClassDeclaration(node) && node.name) {
                const symbol = this.extractClassSymbol(node, filePath, ts);
                if (symbol) symbols.push(symbol);
            }

            // Extract functions
            else if (ts.isFunctionDeclaration(node) && node.name) {
                const symbol = this.extractFunctionSymbol(node, filePath, ts);
                if (symbol) symbols.push(symbol);
            }

            // Extract interfaces
            else if (ts.isInterfaceDeclaration(node) && node.name) {
                const symbol = this.extractInterfaceSymbol(node, filePath, ts);
                if (symbol) symbols.push(symbol);
            }

            // Extract type aliases
            else if (ts.isTypeAliasDeclaration(node) && node.name) {
                const symbol = this.extractTypeAliasSymbol(node, filePath, ts);
                if (symbol) symbols.push(symbol);
            }

            ts.forEachChild(node, visit);
        };

        visit(sourceFile);
        return symbols;
    }

    /**
     * Extract class symbol with JSDoc comments
     * @param node
     * @param filePath
     * @param ts
     */
    private extractClassSymbol(node: any, filePath: string, ts: any): any {
        const jsDocComment = this.getJSDocComment(node, ts);
        const methods = [];

        // Extract methods
        for (const member of node.members || []) {
            if (ts.isMethodDeclaration(member) && member.name) {
                const methodDoc = this.getJSDocComment(member, ts);
                methods.push({
                    name: member.name.text,
                    type: 'method',
                    parameters: this.extractParameters(member.parameters || [], ts),
                    returnType: this.getTypeString(member.type, ts),
                    isStatic: member.modifiers?.some((m: any) => m.kind === ts.SyntaxKind.StaticKeyword),
                    isPrivate: member.modifiers?.some((m: any) => m.kind === ts.SyntaxKind.PrivateKeyword),
                    documentation: methodDoc,
                });
            }
        }

        return {
            name: node.name.text,
            type: 'class',
            file: path.relative('./core', filePath),
            line: this.getLineNumber(node, ts),
            documentation: jsDocComment,
            methods,
            isExported: this.isExported(node, ts),
        };
    }

    /**
     * Extract function symbol with JSDoc comments
     * @param node
     * @param filePath
     * @param ts
     */
    private extractFunctionSymbol(node: any, filePath: string, ts: any): any {
        const jsDocComment = this.getJSDocComment(node, ts);

        return {
            name: node.name.text,
            type: 'function',
            file: path.relative('./core', filePath),
            line: this.getLineNumber(node, ts),
            parameters: this.extractParameters(node.parameters || [], ts),
            returnType: this.getTypeString(node.type, ts),
            documentation: jsDocComment,
            isExported: this.isExported(node, ts),
        };
    }

    /**
     * Extract interface symbol with JSDoc comments
     * @param node
     * @param filePath
     * @param ts
     */
    private extractInterfaceSymbol(node: any, filePath: string, ts: any): any {
        const jsDocComment = this.getJSDocComment(node, ts);
        const properties = [];

        // Extract properties
        for (const member of node.members || []) {
            if (ts.isPropertySignature(member) && member.name) {
                const propDoc = this.getJSDocComment(member, ts);
                properties.push({
                    name: member.name.text,
                    type: this.getTypeString(member.type, ts),
                    optional: !!member.questionToken,
                    documentation: propDoc,
                });
            }
        }

        return {
            name: node.name.text,
            type: 'interface',
            file: path.relative('./core', filePath),
            line: this.getLineNumber(node, ts),
            properties,
            documentation: jsDocComment,
            isExported: this.isExported(node, ts),
        };
    }

    /**
     * Extract type alias symbol
     * @param node
     * @param filePath
     * @param ts
     */
    private extractTypeAliasSymbol(node: any, filePath: string, ts: any): any {
        const jsDocComment = this.getJSDocComment(node, ts);

        return {
            name: node.name.text,
            type: 'type',
            file: path.relative('./core', filePath),
            line: this.getLineNumber(node, ts),
            aliasType: this.getTypeString(node.type, ts),
            documentation: jsDocComment,
            isExported: this.isExported(node, ts),
        };
    }

    /**
     * Get JSDoc comment from a node
     * @param node
     * @param ts
     */
    private getJSDocComment(node: any, ts: any): any {
        const jsDocTags = ts.getJSDocTags(node);
        const jsDocComments = ts.getJSDocCommentsAndTags(node);

        let summary = '';
        const tags: any[] = [];

        // Extract main comment
        for (const comment of jsDocComments) {
            if (ts.isJSDoc(comment)) {
                if (comment.comment) {
                    summary = typeof comment.comment === 'string' ? comment.comment : comment.comment.map((c: any) => c.text || c).join('');
                }
            }
        }

        // Extract tags
        for (const tag of jsDocTags) {
            tags.push({
                name: tag.tagName?.text || 'unknown',
                text: tag.comment ? (typeof tag.comment === 'string' ? tag.comment : tag.comment.map((c: any) => c.text || c).join('')) : '',
            });
        }

        return {
            summary: summary.trim(),
            tags,
        };
    }

    /**
     * Extract parameters from function/method
     * @param parameters
     * @param ts
     */
    private extractParameters(parameters: any[], ts: any): any[] {
        return parameters.map((param) => ({
            name: param.name?.text || 'unknown',
            type: this.getTypeString(param.type, ts),
            optional: !!param.questionToken,
            defaultValue: param.initializer ? 'has default' : undefined,
        }));
    }

    /**
     * Get type string from TypeScript type node
     * @param typeNode
     * @param ts
     */
    private getTypeString(typeNode: any, ts: any): string {
        if (!typeNode) return 'any';

        switch (typeNode.kind) {
            case ts.SyntaxKind.StringKeyword:
                return 'string';
            case ts.SyntaxKind.NumberKeyword:
                return 'number';
            case ts.SyntaxKind.BooleanKeyword:
                return 'boolean';
            case ts.SyntaxKind.VoidKeyword:
                return 'void';
            case ts.SyntaxKind.AnyKeyword:
                return 'any';
            default:
                if (typeNode.typeName) {
                    return typeNode.typeName.text || 'unknown';
                }
                return 'unknown';
        }
    }

    /**
     * Get line number of a node
     * @param node
     * @param ts
     */
    private getLineNumber(node: any, ts: any): number {
        const sourceFile = node.getSourceFile();
        if (sourceFile) {
            const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
            return line + 1;
        }
        return 0;
    }

    /**
     * Check if a declaration is exported
     * @param node
     * @param ts
     */
    private isExported(node: any, ts: any): boolean {
        return node.modifiers?.some((modifier: any) => modifier.kind === ts.SyntaxKind.ExportKeyword) || false;
    }

    /**
     * Get module description based on module name
     * @param moduleName
     */
    private getModuleDescription(moduleName: string): string {
        const descriptions: Record<string, string> = {
            core: 'Core APIDoc functionality including writers, types, and main processing logic',
            exporters: 'Export utilities for converting APIDoc data to various formats (OpenAPI, Markdown, etc.)',
            markdown: 'Markdown processing and generation utilities',
            parsers: 'API comment parsers for extracting documentation from source code',
            filters: 'Post-processing filters for API documentation data',
            plugins: 'Plugin system for extending APIDoc functionality',
        };

        return descriptions[moduleName] || `${moduleName} module documentation`;
    }

    /**
     * Generate HTML documentation from TSDoc data
     * @param moduleData
     */
    private generateTSDocHTML(moduleData: any): string {
        const { module: moduleName, description, symbols, fileCount, generatedAt } = moduleData;

        // Group symbols by type
        const classes = symbols.filter((s: any) => s.type === 'class');
        const functions = symbols.filter((s: any) => s.type === 'function');
        const interfaces = symbols.filter((s: any) => s.type === 'interface');
        const types = symbols.filter((s: any) => s.type === 'type');

        let html = `<div class="tsdoc-module">
            <div class="tsdoc-header">
                <h1>${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module</h1>
                <p class="tsdoc-description">${description}</p>
                <div class="tsdoc-stats">
                    <span class="badge">📄 ${fileCount} files</span>
                    <span class="badge">🏗️ ${classes.length} classes</span>
                    <span class="badge">⚙️ ${functions.length} functions</span>
                    <span class="badge">📋 ${interfaces.length} interfaces</span>
                    <span class="badge">🏷️ ${types.length} types</span>
                </div>
            </div>

            <div class="tsdoc-content">`;

        // Generate classes section
        if (classes.length > 0) {
            html += `<section class="tsdoc-section">
                <h2><i class="fa fa-cube"></i> Classes</h2>
                <div class="tsdoc-symbols">`;

            for (const cls of classes) {
                html += this.generateClassHTML(cls);
            }

            html += `</div>
            </section>`;
        }

        // Generate functions section
        if (functions.length > 0) {
            html += `<section class="tsdoc-section">
                <h2><i class="fa fa-cog"></i> Functions</h2>
                <div class="tsdoc-symbols">`;

            for (const func of functions) {
                html += this.generateFunctionHTML(func);
            }

            html += `</div>
            </section>`;
        }

        // Generate interfaces section
        if (interfaces.length > 0) {
            html += `<section class="tsdoc-section">
                <h2><i class="fa fa-list-alt"></i> Interfaces</h2>
                <div class="tsdoc-symbols">`;

            for (const iface of interfaces) {
                html += this.generateInterfaceHTML(iface);
            }

            html += `</div>
            </section>`;
        }

        // Generate types section
        if (types.length > 0) {
            html += `<section class="tsdoc-section">
                <h2><i class="fa fa-tag"></i> Type Aliases</h2>
                <div class="tsdoc-symbols">`;

            for (const type of types) {
                html += this.generateTypeHTML(type);
            }

            html += `</div>
            </section>`;
        }

        html += `</div>
            <div class="tsdoc-footer">
                <p class="text-muted">Generated on ${new Date(generatedAt).toLocaleString()}</p>
            </div>
        </div>`;

        return html;
    }

    /**
     * Generate HTML for a class
     * @param cls
     */
    private generateClassHTML(cls: any): string {
        const { name, documentation, methods, file, line, isExported } = cls;

        let html = `<div class="tsdoc-symbol tsdoc-class">
            <div class="tsdoc-symbol-header">
                <h3>
                    <span class="tsdoc-symbol-type">class</span>
                    <span class="tsdoc-symbol-name">${name}</span>
                    ${isExported ? '<span class="badge badge-success">exported</span>' : ''}
                </h3>
                <div class="tsdoc-location">
                    <i class="fa fa-file-code-o"></i> ${file}:${line}
                </div>
            </div>`;

        if (documentation.summary) {
            html += `<div class="tsdoc-description">
                <p>${this.escapeHtml(documentation.summary)}</p>
            </div>`;
        }

        if (methods && methods.length > 0) {
            html += `<div class="tsdoc-methods">
                <h4>Methods</h4>
                <div class="tsdoc-method-list">`;

            for (const method of methods) {
                const visibility = method.isPrivate ? 'private' : 'public';
                const isStatic = method.isStatic ? 'static ' : '';

                html += `<div class="tsdoc-method">
                    <div class="tsdoc-method-signature">
                        <span class="tsdoc-visibility">${visibility}</span>
                        ${isStatic ? '<span class="tsdoc-static">static</span>' : ''}
                        <span class="tsdoc-method-name">${method.name}</span>
                        <span class="tsdoc-params">(${this.formatParameters(method.parameters)})</span>
                        <span class="tsdoc-return-type">: ${method.returnType}</span>
                    </div>`;

                if (method.documentation.summary) {
                    html += `<div class="tsdoc-method-description">
                        <p>${this.escapeHtml(method.documentation.summary)}</p>
                    </div>`;
                }

                html += `</div>`;
            }

            html += `</div>
            </div>`;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Generate HTML for a function
     * @param func
     */
    private generateFunctionHTML(func: any): string {
        const { name, documentation, parameters, returnType, file, line, isExported } = func;

        let html = `<div class="tsdoc-symbol tsdoc-function">
            <div class="tsdoc-symbol-header">
                <h3>
                    <span class="tsdoc-symbol-type">function</span>
                    <span class="tsdoc-symbol-name">${name}</span>
                    ${isExported ? '<span class="badge badge-success">exported</span>' : ''}
                </h3>
                <div class="tsdoc-location">
                    <i class="fa fa-file-code-o"></i> ${file}:${line}
                </div>
            </div>

            <div class="tsdoc-signature">
                <code>${name}(${this.formatParameters(parameters)}): ${returnType}</code>
            </div>`;

        if (documentation.summary) {
            html += `<div class="tsdoc-description">
                <p>${this.escapeHtml(documentation.summary)}</p>
            </div>`;
        }

        if (documentation.tags && documentation.tags.length > 0) {
            html += `<div class="tsdoc-tags">
                ${this.formatJSDocTags(documentation.tags)}
            </div>`;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Generate HTML for an interface
     * @param iface
     */
    private generateInterfaceHTML(iface: any): string {
        const { name, documentation, properties, file, line, isExported } = iface;

        let html = `<div class="tsdoc-symbol tsdoc-interface">
            <div class="tsdoc-symbol-header">
                <h3>
                    <span class="tsdoc-symbol-type">interface</span>
                    <span class="tsdoc-symbol-name">${name}</span>
                    ${isExported ? '<span class="badge badge-success">exported</span>' : ''}
                </h3>
                <div class="tsdoc-location">
                    <i class="fa fa-file-code-o"></i> ${file}:${line}
                </div>
            </div>`;

        if (documentation.summary) {
            html += `<div class="tsdoc-description">
                <p>${this.escapeHtml(documentation.summary)}</p>
            </div>`;
        }

        if (properties && properties.length > 0) {
            html += `<div class="tsdoc-properties">
                <h4>Properties</h4>
                <div class="tsdoc-property-list">`;

            for (const prop of properties) {
                html += `<div class="tsdoc-property">
                    <div class="tsdoc-property-signature">
                        <span class="tsdoc-property-name">${prop.name}${prop.optional ? '?' : ''}</span>
                        <span class="tsdoc-property-type">: ${prop.type}</span>
                    </div>`;

                if (prop.documentation.summary) {
                    html += `<div class="tsdoc-property-description">
                        <p>${this.escapeHtml(prop.documentation.summary)}</p>
                    </div>`;
                }

                html += `</div>`;
            }

            html += `</div>
            </div>`;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Generate HTML for a type alias
     * @param type
     */
    private generateTypeHTML(type: any): string {
        const { name, documentation, aliasType, file, line, isExported } = type;

        let html = `<div class="tsdoc-symbol tsdoc-type">
            <div class="tsdoc-symbol-header">
                <h3>
                    <span class="tsdoc-symbol-type">type</span>
                    <span class="tsdoc-symbol-name">${name}</span>
                    ${isExported ? '<span class="badge badge-success">exported</span>' : ''}
                </h3>
                <div class="tsdoc-location">
                    <i class="fa fa-file-code-o"></i> ${file}:${line}
                </div>
            </div>

            <div class="tsdoc-signature">
                <code>type ${name} = ${aliasType}</code>
            </div>`;

        if (documentation.summary) {
            html += `<div class="tsdoc-description">
                <p>${this.escapeHtml(documentation.summary)}</p>
            </div>`;
        }

        html += `</div>`;
        return html;
    }

    /**
     * Format parameters for display
     * @param parameters
     */
    private formatParameters(parameters: any[]): string {
        return parameters.map((param) => `${param.name}${param.optional ? '?' : ''}: ${param.type}`).join(', ');
    }

    /**
     * Format JSDoc tags as HTML
     * @param tags
     */
    private formatJSDocTags(tags: any[]): string {
        return tags
            .map((tag) => {
                if (tag.name === 'param' && tag.text) {
                    return `<div class="tsdoc-tag tsdoc-param">
                    <strong>@${tag.name}</strong> ${this.escapeHtml(tag.text)}
                </div>`;
                } else if (tag.name === 'returns' && tag.text) {
                    return `<div class="tsdoc-tag tsdoc-returns">
                    <strong>@${tag.name}</strong> ${this.escapeHtml(tag.text)}
                </div>`;
                } else if (tag.name === 'example' && tag.text) {
                    return `<div class="tsdoc-tag tsdoc-example">
                    <strong>@${tag.name}</strong>
                    <pre><code>${this.escapeHtml(tag.text)}</code></pre>
                </div>`;
                } else if (tag.text) {
                    return `<div class="tsdoc-tag">
                    <strong>@${tag.name}</strong> ${this.escapeHtml(tag.text)}
                </div>`;
                }
                return '';
            })
            .join('');
    }

    /**
     * Escape HTML entities
     * @param text
     */
    private escapeHtml(text: string): string {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
    }

    /**
     * Helper methods
     * @param groupName
     */
    private getGroupIcon(groupName: string): string {
        const iconMap: Record<string, string> = {
            Users: 'fa-users',
            Company: 'fa-building',
            System: 'fa-cogs',
            City: 'fa-map-marker-alt',
            Category: 'fa-tags',
        };
        return iconMap[groupName] || 'fa-folder';
    }

    private getStatsByGroup(endpoints: any[]): Record<string, number> {
        const stats: Record<string, number> = {};
        endpoints.forEach((ep) => {
            stats[ep.group] = (stats[ep.group] || 0) + 1;
        });
        return stats;
    }

    private getStatsByMethod(endpoints: any[]): Record<string, number> {
        const stats: Record<string, number> = {};
        endpoints.forEach((ep) => {
            stats[ep.method] = (stats[ep.method] || 0) + 1;
        });
        return stats;
    }

    /**
     * Copy template assets to output directory
     * @param outputPath
     */
    private async copyTemplateAssets(outputPath: string): Promise<void> {
        try {
            // Path to the built template assets
            const templatePath = path.resolve('./apps/apicat-template/dist');

            if (!(await fs.pathExists(templatePath))) {
                console.log('⚠️  Template not built. Building apiCAT template...');
                // Build the template first
                const { exec } = require('child_process');
                const util = require('util');
                const execAsync = util.promisify(exec);

                try {
                    await execAsync('cd apps/apicat-template && npm run build');
                    console.log('✅ Template built successfully');
                } catch (error) {
                    console.error('❌ Failed to build template:', error);
                    return;
                }
            }

            // Copy index.html to output root
            const indexPath = path.join(templatePath, 'index.html');
            if (await fs.pathExists(indexPath)) {
                await fs.copy(indexPath, path.join(outputPath, 'index.html'));
            }

            // Copy assets directory
            const assetsPath = path.join(templatePath, 'assets');
            if (await fs.pathExists(assetsPath)) {
                await fs.copy(assetsPath, path.join(outputPath, 'assets'));
            }

            console.log('✅ Template assets copied successfully');
        } catch (error) {
            console.error('❌ Error copying template assets:', error);
            // Continue anyway as this is not critical
        }
    }

    /**
     * Generate Postman/Insomnia compatible collection
     * @param apiData
     * @param projectInfo
     */
    private generateCollection(apiData: any, projectInfo: ApiDocProject): any {
        const collection = {
            info: {
                name: projectInfo.name || 'API Collection',
                description: projectInfo.description || 'Generated by apiCAT',
                version: projectInfo.version || '1.0.0',
                schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
            },
            item: [],
            variable: [],
            auth: null,
        };

        // Process API endpoints
        if (Array.isArray(apiData)) {
            const groups = this.groupEndpoints(apiData);

            Object.entries(groups).forEach(([groupName, endpoints]: [string, any[]]) => {
                const folder = {
                    name: groupName,
                    item: endpoints.map((endpoint) => this.convertEndpoint(endpoint)),
                };
                collection.item.push(folder);
            });
        }

        return collection;
    }

    /**
     * Group endpoints by their API group
     * @param apiData
     */
    private groupEndpoints(apiData: any[]): Record<string, any[]> {
        const groups: Record<string, any[]> = {};

        apiData.forEach((endpoint) => {
            const groupName = endpoint.group || 'General';
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(endpoint);
        });

        return groups;
    }

    /**
     * Convert APIDoc endpoint to Postman format
     * @param endpoint
     */
    private convertEndpoint(endpoint: any): any {
        const url = endpoint.url || '';
        const method = (endpoint.type || 'GET').toUpperCase();

        return {
            name: endpoint.title || endpoint.name || `${method} ${url}`,
            request: {
                method: method,
                header: this.extractHeaders(endpoint),
                url: {
                    raw: `{{baseUrl}}${url}`,
                    host: ['{{baseUrl}}'],
                    path: url.split('/').filter(Boolean),
                },
                body: this.extractBody(endpoint),
                description: endpoint.description || '',
            },
            response: this.extractExamples(endpoint),
        };
    }

    /**
     * Extract headers from endpoint definition
     * @param endpoint
     */
    private extractHeaders(endpoint: any): any[] {
        const headers: any[] = [];

        if (endpoint.header && endpoint.header.fields) {
            Object.values(endpoint.header.fields).forEach((group: any) => {
                if (Array.isArray(group)) {
                    group.forEach((header) => {
                        headers.push({
                            key: header.field,
                            value: header.defaultValue || '',
                            description: header.description || '',
                            disabled: header.optional || false,
                        });
                    });
                }
            });
        }

        return headers;
    }

    /**
     * Extract request body from endpoint
     * @param endpoint
     */
    private extractBody(endpoint: any): any {
        if (!endpoint.parameter || !endpoint.parameter.fields) {
            return null;
        }

        const bodyParams: any = {};

        Object.values(endpoint.parameter.fields).forEach((group: any) => {
            if (Array.isArray(group)) {
                group.forEach((param) => {
                    if (param.field && !param.field.includes(':')) {
                        // Skip URL params
                        bodyParams[param.field] = param.defaultValue || '';
                    }
                });
            }
        });

        if (Object.keys(bodyParams).length === 0) {
            return null;
        }

        return {
            mode: 'raw',
            raw: JSON.stringify(bodyParams, null, 2),
            options: {
                raw: {
                    language: 'json',
                },
            },
        };
    }

    /**
     * Extract example responses
     * @param endpoint
     */
    private extractExamples(endpoint: any): any[] {
        const examples: any[] = [];

        if (endpoint.success && endpoint.success.examples) {
            endpoint.success.examples.forEach((example: any) => {
                examples.push({
                    name: example.title || 'Success Response',
                    originalRequest: {},
                    status: 'OK',
                    code: 200,
                    header: [],
                    body: example.content || '',
                });
            });
        }

        return examples;
    }

    /**
     * Generate testing scenarios for local testing
     * @param apiData
     */
    private generateTestingScenarios(apiData: any[]): any {
        return {
            scenarios: apiData.map((endpoint) => ({
                id: `${endpoint.type}_${endpoint.url}`.replace(/[^a-zA-Z0-9]/g, '_'),
                name: endpoint.title || `${endpoint.type} ${endpoint.url}`,
                method: endpoint.type?.toUpperCase() || 'GET',
                url: endpoint.url || '',
                description: endpoint.description || '',
                group: endpoint.group || 'General',
                expectedResponses: this.extractExpectedResponses(endpoint),
            })),
        };
    }

    /**
     * Extract expected responses for testing
     * @param endpoint
     */
    private extractExpectedResponses(endpoint: any): any[] {
        const responses: any[] = [];

        // Success responses
        if (endpoint.success && endpoint.success.examples) {
            endpoint.success.examples.forEach((example: any) => {
                responses.push({
                    type: 'success',
                    status: 200,
                    body: example.content || '',
                    description: example.title || 'Success',
                });
            });
        }

        // Error responses
        if (endpoint.error && endpoint.error.examples) {
            endpoint.error.examples.forEach((example: any) => {
                responses.push({
                    type: 'error',
                    status: 400,
                    body: example.content || '',
                    description: example.title || 'Error',
                });
            });
        }

        return responses;
    }

    /**
     * Write collection to file
     * @param collection
     */
    private async writeCollection(collection: any): Promise<void> {
        const filePath = path.join(this.outputDir, 'collection.json');
        await fs.writeJSON(filePath, collection, { spaces: 2 });
        console.log(`📄 Collection saved: ${filePath}`);
    }

    /**
     * Write testing scenarios to file
     * @param scenarios
     */
    private async writeTestingScenarios(scenarios: any): Promise<void> {
        const filePath = path.join(this.outputDir, 'test-scenarios.json');
        await fs.writeJSON(filePath, scenarios, { spaces: 2 });
        console.log(`🧪 Test scenarios saved: ${filePath}`);
    }

    /**
     * Read generated collection
     */
    private async readCollection(): Promise<any> {
        try {
            const filePath = path.join(this.outputDir, 'collection.json');
            return await fs.readJSON(filePath);
        } catch {
            return null;
        }
    }

    /**
     * Read generated testing scenarios
     */
    private async readTestingScenarios(): Promise<any> {
        try {
            const filePath = path.join(this.outputDir, 'test-scenarios.json');
            return await fs.readJSON(filePath);
        } catch {
            return null;
        }
    }
}

export default ApiCatPlugin;
