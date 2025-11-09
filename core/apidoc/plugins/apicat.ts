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
import { JSONEncryption } from '../../utils/encryption';

/**
 * apiCAT Plugin Configuration
 */
export interface ApiCatConfig {
    enabled: boolean;
    outputDir?: string;
    generateCollections?: boolean;
    enableLocalTesting?: boolean;
    sourceDir?: string; // Source directory for reading markdown files
    dest?: string; // Destination directory from APIDoc options
    verbose?: boolean; // Verbose output mode
}

/**
 * apiCAT Plugin Class
 * Generates collections and testing data from APIDoc documentation
 */
export class ApiCatPlugin {
    private config: ApiCatConfig;
    private outputDir: string;
    private sourceDir: string;
    private projectInfo?: ApiDocProject;

    constructor(config: ApiCatConfig = { enabled: false }) {
        this.config = {
            enabled: false,
            outputDir: './apicat-output',
            generateCollections: true,
            enableLocalTesting: true,
            sourceDir: './',
            verbose: false,
            ...config,
        };

        this.outputDir = this.config.outputDir || './apicat-output';
        this.sourceDir = this.config.sourceDir || './';
    }

    /**
     * Log message only if verbose mode is enabled
     */
    private log(...args: any[]): void {
        if (this.config.verbose) {
            console.log(...args);
        }
    }

    /**
     * Always log important info
     */
    private info(...args: any[]): void {
        console.log(...args);
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

        // Store projectInfo for use in other methods
        this.projectInfo = projectInfo;

        this.log('🐱 apiCAT: Processing API documentation...');

        try {
            // Use the output destination from config.dest or fallback to outputDir
            const outputPath = this.config.dest ? path.resolve(this.config.dest) : path.resolve('./tmp/apicat-output');
            await fs.ensureDir(outputPath);

            // Generate modular JSON structure
            await this.generateModularStructure(apiData, projectInfo, outputPath);

            // Copy template assets to output
            await this.copyTemplateAssets(outputPath);

            this.log(`✅ apiCAT: Modular structure generated in ${outputPath}`);
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
    private async generateModularStructure(
        apiData: any,
        projectInfo: ApiDocProject,
        outputPath: string
    ): Promise<void> {
        // All JSON data goes into /data subdirectory
        const dataPath = path.join(outputPath, 'data');
        await fs.ensureDir(dataPath);

        // Create subdirectories in /data
        await fs.ensureDir(path.join(dataPath, 'cat.api'));
        await fs.ensureDir(path.join(dataPath, 'cat.docs'));
        await fs.ensureDir(path.join(dataPath, 'cat.tsdoc'));

        // Transform data using adapter
        const adapter = require('../../adapters/apidoc-to-apicat');
        const apicatData = adapter.transformToApiCAT(apiData, projectInfo);

        // Generate TSDoc map FIRST to get the list of files
        const tsdocFiles = await this.generateTSDocMap();

        // Generate main manifest (cat.json)
        const manifest: any = {
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
                shards: this.generateShardList(apicatData.endpoints),
            },
            docs: this.generateDocsMap(apicatData.groups, projectInfo.documentation),
            tsdoc: tsdocFiles,
            search: 'cat.search.json',
            assets: 'cat.assets.json',
        };

        // Add models section if there are models
        if (apicatData.models && apicatData.models.length > 0) {
            manifest.models = {
                index: 'cat.model.index.json',
                shards: this.generateModelShardList(apicatData.models),
            };
        }

        await fs.writeFile(path.join(dataPath, 'cat.json'), JSON.stringify(manifest, null, 2));

        // Generate meta with login config (if enabled)
        const metaData: any = {
            name: apicatData.project.name,
            version: apicatData.project.version,
            description: apicatData.project.description,
            title: apicatData.project.title,
            url: apicatData.project.url,
            sampleUrl: apicatData.project.sampleUrl,
            homepage: apicatData.project.homepage,
            bugs: apicatData.project.bugs,
            repository: apicatData.project.repository,
            mqtt: apicatData.project.mqtt,
            header: apicatData.project.header,
            footer: apicatData.project.footer,
            i18n: projectInfo.i18n, // Add i18n configuration
            generatedAt: manifest.generatedAt,
        };

        // Add login configuration if auth is enabled
        if (projectInfo.login?.active) {
            const loginConfig: any = {
                active: true,
                urlAuth: projectInfo.login.urlAuth,
                value_form: projectInfo.login.value_form,
                response_success: projectInfo.login.response_success,
                response_error: projectInfo.login.response_error,
                encryptionKeyFromServer: projectInfo.login.encryptionKeyFromServer || false,
            };

            // Only include encryptionKey if NOT from server
            if (!projectInfo.login.encryptionKeyFromServer && projectInfo.login.encryptionKey) {
                // SECURITY: Obfuscate the encryption key by splitting it into segments
                // and mixing with decoy data to make it hard to find in minified code
                const { obfuscateKey } = await import('../../utils/keyObfuscation');
                const obfuscated = obfuscateKey(projectInfo.login.encryptionKey, 4);

                // Store obfuscation code and reconstruction variable
                loginConfig._obf = obfuscated.code;
                loginConfig._kv = obfuscated.reconstructVar;

                console.info('🔐 Encryption key obfuscated into 4 segments with decoys');
            }

            // Include admited list if present (for local authentication)
            // SECURITY: Encrypt admited list to prevent exposure in HTML source
            if (projectInfo.login.admited && Array.isArray(projectInfo.login.admited)) {
                // Import encryption module
                const { JSONEncryption } = await import('../../utils/encryption');

                // Create encryption instance with the same key used for docs
                const encryption = new JSONEncryption({ enabled: true }, projectInfo.login.encryptionKey);

                // Encrypt the admited list
                const encryptedAdmited = encryption.encryptJSON(projectInfo.login.admited);

                console.info('🔐 Encrypted admited list for local authentication');
                console.info(`   Users count: ${projectInfo.login.admited.length}`);

                // Store encrypted version (not plain text)
                loginConfig._admited = encryptedAdmited;
            }

            metaData.login = loginConfig;
        }

        await fs.writeFile(path.join(dataPath, 'cat.meta.json'), JSON.stringify(metaData, null, 2));

        // Generate API index and shards FIRST (this groups endpoints by version)
        const groupedEndpointsMap = await this.generateApiStructure(apicatData, outputPath);

        // Generate Model structure if there are models
        if (apicatData.models && apicatData.models.length > 0) {
            await this.generateModelStructure(apicatData, outputPath);
        }

        // Generate navigation using grouped endpoints
        await this.generateNavigation(apicatData, outputPath, projectInfo, groupedEndpointsMap);

        // Generate search index
        await this.generateSearchIndex(apicatData, outputPath);

        // Generate assets manifest
        await this.generateAssetsManifest(outputPath);

        // Generate docs and tsdoc content
        await this.generateDocumentationContent(apicatData, projectInfo, outputPath);
    }

    /**
     * Generate shard list for manifest based on endpoints
     * @param endpoints - Array of endpoints
     */
    private generateShardList(endpoints: any[]): string[] {
        const groups = new Set<string>();
        endpoints.forEach((ep) => groups.add(ep.group));
        return Array.from(groups).map((group) => `cat.api/${this.sanitizeGroupName(group)}.json`);
    }

    /**
     * Generate docs map for manifest
     * @param groups
     * @param documentation - Array of general documentation files
     */
    private generateDocsMap(groups: string[], documentation?: any[]): Record<string, string> {
        const docsMap: Record<string, string> = {
            header: 'cat.docs/header.json',
            footer: 'cat.docs/footer.json',
        };

        groups.forEach((group) => {
            docsMap[`group.${group}`] = `cat.docs/group.${this.sanitizeGroupName(group)}.json`;
        });

        // Add general documentation files
        if (documentation && Array.isArray(documentation)) {
            documentation.forEach((doc) => {
                docsMap[doc.filename] = `cat.docs/${doc.filename}.json`;
            });
        }

        return docsMap;
    }

    /**
     * Generate TSDoc map for manifest
     */
    private async generateTSDocMap(): Promise<string[]> {
        const tsdocData = await this.generateTSDocData();
        const tsdocFiles: string[] = [];

        for (const moduleName of Object.keys(tsdocData)) {
            tsdocFiles.push(`cat.tsdoc/${moduleName}.json`);
            tsdocFiles.push(`cat.docs/tsdoc.${moduleName}.json`);
        }

        return tsdocFiles;
    }

    /**
     * Generate navigation structure
     * @param apicatData
     * @param outputPath
     * @param projectInfo
     * @param groupedEndpointsMap - Map of already grouped endpoints by group name
     */
    private async generateNavigation(
        apicatData: any,
        outputPath: string,
        projectInfo: ApiDocProject,
        groupedEndpointsMap: Map<string, any[]>
    ): Promise<void> {
        const dataPath = path.join(outputPath, 'data');
        const groups = apicatData.groups.map((groupName: string) => {
            // Get grouped endpoints for this group from the map
            const groupedEndpoints = groupedEndpointsMap.get(groupName) || [];

            // Extract unique endpoint IDs (already grouped, so no duplicates)
            const endpointIds = groupedEndpoints.map((ep: any) => ep.id);

            return {
                id: groupName,
                title: this.getGroupTitle(groupName, projectInfo),
                icon: this.getGroupIcon(groupName),
                endpoints: endpointIds,
            };
        });

        const navigation = {
            groups,
            order: apicatData.groups,
            stats: {
                totalEndpoints: apicatData.endpoints.length,
                totalGroups: groups.length,
                lastUpdated: new Date().toISOString(),
            },
        };

        await fs.writeFile(path.join(dataPath, 'cat.navigation.json'), JSON.stringify(navigation, null, 2));
    }

    /**
     * Get group title from settings or format group name
     * @param groupName
     * @param projectInfo
     */
    private getGroupTitle(groupName: string, projectInfo: ApiDocProject): string {
        // Check if settings exist for this group
        const projectWithSettings = projectInfo as any;
        if (projectWithSettings?.settings?.[groupName]?.title) {
            return projectWithSettings.settings[groupName].title;
        }

        // Fallback: format group name (replace underscores with spaces)
        return groupName.replace(/_/g, ' ');
    }

    /**
     * Generate API index and shards
     * @param apicatData
     * @param outputPath
     * @returns Map of grouped endpoints by group name
     */
    private async generateApiStructure(apicatData: any, outputPath: string): Promise<Map<string, any[]>> {
        const dataPath = path.join(outputPath, 'data');
        // API Index - still contains all endpoints individually for search/stats
        const apiIndex = {
            endpoints: apicatData.endpoints.map((ep: any) => ({
                id: ep.id,
                method: ep.method,
                path: ep.url,
                group: ep.group,
                summary: ep.title,
                version: ep.version,
                shard: `cat.api/${this.sanitizeGroupName(ep.group)}.json`,
            })),
            stats: {
                totalEndpoints: apicatData.endpoints.length,
                byGroup: this.getStatsByGroup(apicatData.endpoints),
                byMethod: this.getStatsByMethod(apicatData.endpoints),
            },
            lastUpdated: new Date().toISOString(),
        };

        await fs.writeFile(path.join(dataPath, 'cat.api.index.json'), JSON.stringify(apiIndex, null, 2));

        // Generate shards by group with version grouping
        const groupedEndpointsMap = new Map<string, any[]>();
        const groups = apicatData.groups;

        for (const group of groups) {
            const groupEndpoints = apicatData.endpoints.filter((ep: any) => ep.group === group);

            // IMPORTANT: Group by language FIRST, then by version
            // This ensures that endpoints with @apiLang are preserved before version grouping
            let groupedEndpoints = groupEndpoints;

            const defaultLang = this.projectInfo?.i18n?.defaultLang;

            // Step 1: Group by language if i18n is enabled (BEFORE version grouping)
            if (this.projectInfo?.i18n?.enabled) {
                groupedEndpoints = this.groupEndpointsByLanguage(groupedEndpoints, defaultLang);
            }

            // Step 2: Group endpoints by ID (multiple versions of same endpoint)
            groupedEndpoints = this.groupEndpointsByVersion(groupedEndpoints);

            // Store in map for navigation generation
            groupedEndpointsMap.set(group, groupedEndpoints);

            const shard = {
                group,
                endpoints: groupedEndpoints,
                generatedAt: new Date().toISOString(),
            };

            await fs.writeFile(
                path.join(dataPath, 'cat.api', `${this.sanitizeGroupName(group)}.json`),
                JSON.stringify(shard, null, 2)
            );
        }

        return groupedEndpointsMap;
    }

    /**
     * Generate search index
     * @param apicatData
     * @param outputPath
     */
    private async generateSearchIndex(apicatData: any, outputPath: string): Promise<void> {
        const dataPath = path.join(outputPath, 'data');
        const documents = apicatData.endpoints.map((ep: any) => ({
            id: ep.id,
            type: 'endpoint',
            title: ep.title,
            path: ep.url,
            group: ep.group,
            method: ep.method,
            tags: [this.sanitizeGroupName(ep.group), ep.method.toLowerCase(), ...ep.title.toLowerCase().split(' ')],
            summary: ep.description,
            ref: {
                type: 'endpoint',
                id: ep.id,
                shard: `cat.api/${this.sanitizeGroupName(ep.group)}.json`,
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

        await fs.writeFile(path.join(dataPath, 'cat.search.json'), JSON.stringify(searchIndex, null, 2));
    }

    /**
     * Generate assets manifest
     * @param outputPath
     */
    private async generateAssetsManifest(outputPath: string): Promise<void> {
        const dataPath = path.join(outputPath, 'data');
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

        await fs.writeFile(path.join(dataPath, 'cat.assets.json'), JSON.stringify(assets, null, 2));
    }

    /**
     * Generate docs and tsdoc content using real markdown files
     * @param apicatData
     * @param projectInfo
     * @param outputPath
     */
    private async generateDocumentationContent(apicatData: any, projectInfo: any, outputPath: string): Promise<void> {
        const dataPath = path.join(outputPath, 'data');
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

            // Generate JSON instead of HTML for encryption compatibility
            const groupData: any = {
                group: group,
                type: 'group-documentation',
                html: groupHtml,
                generatedAt: new Date().toISOString(),
                version: '5.0.0',
            };

            // Include custom markdown metadata if available
            if (customMarkdown[group]) {
                groupData.customMarkdown = {
                    title: customMarkdown[group].title,
                    icon: customMarkdown[group].icon,
                    html: customMarkdown[group].html,
                };
            }

            await fs.writeFile(
                path.join(dataPath, 'cat.docs', `group.${this.sanitizeGroupName(group)}.json`),
                JSON.stringify(groupData, null, 2)
            );
        }

        // Generate general documentation files (from documentation glob pattern)
        if (projectInfo.documentation && Array.isArray(projectInfo.documentation)) {
            this.log(`📚 Processing ${projectInfo.documentation.length} general documentation files...`);

            for (const doc of projectInfo.documentation) {
                const docData = {
                    filename: doc.filename,
                    title: doc.title,
                    type: 'documentation',
                    html: doc.content,
                    icon: doc.icon || 'fa-file-text',
                    generatedAt: new Date().toISOString(),
                    version: '5.0.0',
                };

                await fs.writeFile(
                    path.join(dataPath, 'cat.docs', `${doc.filename}.json`),
                    JSON.stringify(docData, null, 2)
                );

                this.log(`  ✓ Generated: ${doc.filename}.json`);
            }
        }

        // Generate header and footer
        let headerHtml =
            '<div class="header-docs"><h1>API Documentation</h1><p>Welcome to the API documentation.</p></div>';
        let footerHtml =
            '<div class="footer-docs"><p>Generated with apiCAT v5.0 - <a href="https://apidoc.app">Learn more</a></p></div>';

        if (customMarkdown.header) {
            headerHtml = `<div class="header-docs custom-markdown">${customMarkdown.header.html}</div>`;
        }

        if (customMarkdown.footer) {
            footerHtml = `<div class="footer-docs custom-markdown">${customMarkdown.footer.html}</div>`;
        }

        // Generate JSON instead of HTML for encryption compatibility
        const headerData = {
            type: 'header-documentation',
            html: headerHtml,
            generatedAt: new Date().toISOString(),
            version: '5.0.0',
        };
        await fs.writeFile(path.join(dataPath, 'cat.docs', 'header.json'), JSON.stringify(headerData, null, 2));

        const footerData = {
            type: 'footer-documentation',
            html: footerHtml,
            generatedAt: new Date().toISOString(),
            version: '5.0.0',
        };
        await fs.writeFile(path.join(dataPath, 'cat.docs', 'footer.json'), JSON.stringify(footerData, null, 2));

        // Generate TSDoc documentation
        const tsdocData = await this.generateTSDocData();

        for (const [moduleName, moduleData] of Object.entries(tsdocData)) {
            // Save JSON data
            await fs.writeFile(
                path.join(dataPath, 'cat.tsdoc', `${moduleName}.json`),
                JSON.stringify(moduleData, null, 2)
            );

            // Generate JSON instead of HTML for encryption compatibility
            const htmlDoc = this.generateTSDocHTML(moduleData as any);
            const tsdocDocData = {
                module: moduleName,
                type: 'tsdoc-documentation',
                html: htmlDoc,
                generatedAt: new Date().toISOString(),
                version: '5.0.0',
            };
            await fs.writeFile(
                path.join(dataPath, 'cat.docs', `tsdoc.${moduleName}.json`),
                JSON.stringify(tsdocDocData, null, 2)
            );
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
                        const markdownPath = path.resolve(this.sourceDir, settings.filename);
                        if (await fs.pathExists(markdownPath)) {
                            const markdownContent = await fs.readFile(markdownPath, 'utf8');
                            const htmlContent = md.render(markdownContent);

                            customMarkdown[groupName] = {
                                title: settings.title || groupName,
                                icon: settings.icon || 'fa-folder',
                                html: htmlContent,
                                raw: markdownContent,
                            };

                            this.log(`  ✓ Loaded custom markdown for group: ${groupName} (${settings.filename})`);
                        } else {
                            this.log(`  ⚠ Markdown file not found for group ${groupName}: ${markdownPath}`);
                        }
                    } catch (error) {
                        this.log(`  ✗ Error processing markdown for group ${groupName}: ${error.message}`);
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

            // Get tsdoc directories from projectInfo.resolvedInputs (absolute paths)
            // Falls back to projectInfo.inputs if resolvedInputs not available
            const tsdocDirs = this.projectInfo?.resolvedInputs?.tsdoc || this.projectInfo?.inputs?.tsdoc || [];

            if (tsdocDirs.length === 0) {
                this.log('⚠️  No tsdoc directories configured in inputs. Skipping TSDoc generation.');
                return {};
            }

            this.log(`📚 TSDoc: Processing ${tsdocDirs.length} directories: ${tsdocDirs.join(', ')}`);

            // Find all TypeScript files in configured tsdoc directories
            const coreFiles = await this.findTypeScriptFiles(tsdocDirs);
            this.log(`📁 TSDoc: Found ${coreFiles.length} TypeScript files:`, coreFiles);

            if (coreFiles.length === 0) {
                this.log('⚠️  No TypeScript files found in tsdoc directories.');
                return {};
            }

            // Parse files by module groups
            // Try to auto-detect module structure, or group all as "interfaces" if no structure
            const moduleGroups: Record<string, string[]> = {
                core: coreFiles.filter((f) => f.includes('/apidoc/') || f.includes('/types/')),
                exporters: coreFiles.filter((f) => f.includes('/exporters/')),
                markdown: coreFiles.filter((f) => f.includes('/markdown/')),
                parsers: coreFiles.filter((f) => f.includes('/parsers/')),
                filters: coreFiles.filter((f) => f.includes('/filters/')),
                plugins: coreFiles.filter((f) => f.includes('/plugins/')),
            };

            // If no files matched the APIDoc core structure, group all files as "interfaces"
            const totalMatched = Object.values(moduleGroups).reduce((sum, files) => sum + files.length, 0);
            if (totalMatched === 0 && coreFiles.length > 0) {
                moduleGroups['interfaces'] = coreFiles;
            }

            for (const [moduleName, files] of Object.entries(moduleGroups)) {
                if (files.length === 0) continue;

                this.log(`📦 TSDoc: Processing module "${moduleName}" with ${files.length} files`);
                const symbols: any[] = [];

                for (const filePath of files) {
                    try {
                        const fileContent = await fs.readFile(filePath, 'utf8');
                        const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.ES2020, true);

                        const fileSymbols = this.extractTSDocSymbols(sourceFile, filePath, ts);
                        this.log(`  ✓ Extracted ${fileSymbols.length} symbols from ${path.basename(filePath)}`);
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
            } else if (ts.isFunctionDeclaration(node) && node.name) {
                // Extract functions
                const symbol = this.extractFunctionSymbol(node, filePath, ts);
                if (symbol) symbols.push(symbol);
            } else if (ts.isInterfaceDeclaration(node) && node.name) {
                // Extract interfaces
                const symbol = this.extractInterfaceSymbol(node, filePath, ts);
                if (symbol) symbols.push(symbol);
            } else if (ts.isTypeAliasDeclaration(node) && node.name) {
                // Extract type aliases
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
                    summary =
                        typeof comment.comment === 'string'
                            ? comment.comment
                            : comment.comment.map((c: any) => c.text || c).join('');
                }
            }
        }

        // Extract tags
        for (const tag of jsDocTags) {
            tags.push({
                name: tag.tagName?.text || 'unknown',
                text: tag.comment
                    ? typeof tag.comment === 'string'
                        ? tag.comment
                        : tag.comment.map((c: any) => c.text || c).join('')
                    : '',
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
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
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
     * Sanitize group name for use in filenames (remove spaces, special chars)
     * @param group - Group name
     * @returns Sanitized group name (lowercase with underscores)
     */
    private sanitizeGroupName(group: string): string {
        return group.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    }

    /**
     * Generate model shard list for manifest
     * @param models - Array of model documentation items
     */
    private generateModelShardList(models: any[]): string[] {
        const groups = new Set<string>();
        models.forEach((model) => groups.add(model.group));
        return Array.from(groups).map((group) => `cat.model/${this.sanitizeGroupName(group)}.json`);
    }

    /**
     * Generate model structure (index and shards)
     * @param apicatData - Transformed apiCAT data
     * @param outputPath - Output directory path
     */
    private async generateModelStructure(apicatData: any, outputPath: string): Promise<void> {
        const models = apicatData.models || [];

        // All JSON data goes into /data subdirectory
        const dataPath = path.join(outputPath, 'data');

        // Create cat.model directory
        const modelDir = path.join(dataPath, 'cat.model');
        if (!fs.existsSync(modelDir)) {
            await fs.mkdir(modelDir, { recursive: true });
        }

        // Generate model index
        const modelIndex = {
            models: models.map((model: any) => ({
                id: model.id,
                name: model.name,
                group: model.group,
                summary: model.title,
                version: model.version,
                shard: `cat.model/${this.sanitizeGroupName(model.group)}.json`,
            })),
            stats: {
                totalModels: models.length,
                byGroup: this.getModelStatsByGroup(models),
            },
            lastUpdated: new Date().toISOString(),
        };

        await fs.writeFile(path.join(dataPath, 'cat.model.index.json'), JSON.stringify(modelIndex, null, 2));

        // Group models by group
        const modelsByGroup = new Map<string, any[]>();
        models.forEach((model: any) => {
            const group = model.group || 'General';
            if (!modelsByGroup.has(group)) {
                modelsByGroup.set(group, []);
            }
            modelsByGroup.get(group)!.push(model);
        });

        // Generate shards for each group
        for (const [group, groupModels] of modelsByGroup.entries()) {
            const shard = {
                group,
                models: groupModels,
                generatedAt: new Date().toISOString(),
            };

            await fs.writeFile(
                path.join(modelDir, `${this.sanitizeGroupName(group)}.json`),
                JSON.stringify(shard, null, 2)
            );
        }
    }

    /**
     * Get stats of models by group
     * @param models - Array of model documentation items
     */
    private getModelStatsByGroup(models: any[]): Record<string, number> {
        const stats: Record<string, number> = {};
        models.forEach((model) => {
            stats[model.group] = (stats[model.group] || 0) + 1;
        });
        return stats;
    }

    /**
     * Group endpoints by ID and create version arrays
     * Multiple versions of the same endpoint are grouped together
     * @param endpoints - Array of endpoints to group
     * @returns Array of grouped endpoints with version information
     */
    private groupEndpointsByVersion(endpoints: any[]): any[] {
        // Create a map to group endpoints by ID
        const endpointMap = new Map<string, any[]>();

        endpoints.forEach((endpoint) => {
            if (!endpointMap.has(endpoint.id)) {
                endpointMap.set(endpoint.id, []);
            }
            endpointMap.get(endpoint.id)!.push(endpoint);
        });

        // Convert map to array of grouped endpoints
        const groupedEndpoints: any[] = [];

        endpointMap.forEach((versions, endpointId) => {
            if (versions.length === 1) {
                // Single version - keep as is (no need for versions array)
                groupedEndpoints.push(versions[0]);
            } else {
                // Multiple versions - create grouped structure
                // Sort versions to find latest
                const sortedVersions = versions.sort((a, b) => {
                    // Simple version comparison (handles x.y.z format)
                    const versionA = a.version || '0.0.0';
                    const versionB = b.version || '0.0.0';
                    return versionB.localeCompare(versionA, undefined, { numeric: true, sensitivity: 'base' });
                });

                const latestEndpoint = sortedVersions[0];

                // Create base structure from latest version
                const groupedEndpoint = { ...latestEndpoint };

                // Add versions array with FULL data for comparison
                groupedEndpoint.versions = sortedVersions.map((ep, index) => ({
                    version: ep.version,
                    title: ep.title,
                    name: ep.name,
                    description: ep.description,
                    filename: ep.filename,
                    url: ep.url,
                    method: ep.method,
                    isLatest: index === 0,
                    // Include full endpoint data for version comparison
                    parameters: ep.parameters,
                    header: ep.header,
                    success: ep.success,
                    error: ep.error,
                    examples: ep.examples,
                }));

                groupedEndpoint.latestVersion = latestEndpoint.version;
                groupedEndpoint.versionCount = versions.length;
                groupedEndpoint.hasMultipleVersions = true;

                groupedEndpoints.push(groupedEndpoint);
            }
        });

        return groupedEndpoints;
    }

    /**
     * Group endpoints by language (multi-language support)
     * Multiple translations of the same endpoint are grouped together
     *
     * This function processes endpoints AFTER version grouping to support
     * multi-language documentation. Similar to version handling, endpoints
     * with @lang annotations are grouped by ID.
     *
     * Behavior:
     * - If only ONE language exists (or no @lang), keep as-is (no languages object)
     * - If MULTIPLE languages exist, create languages object with each translation
     * - Endpoints without @lang are stored as 'default' fallback
     *
     * @param endpoints - Array of endpoints (already grouped by version)
     * @returns Array of endpoints with language grouping
     *
     * @example Single language (no @lang)
     * ```
     * // Input: [{ id: "get-users", description: "获取用户" }]
     * // Output: [{ id: "get-users", description: "获取用户" }]
     * ```
     *
     * @example Multiple languages
     * ```
     * // Input: [
     * //   { id: "get-users", lang: "zh", description: "获取用户" },
     * //   { id: "get-users", lang: "en", description: "Get user" }
     * // ]
     * // Output: [{
     * //   id: "get-users",
     * //   languages: {
     * //     zh: { description: "获取用户", ... },
     * //     en: { description: "Get user", ... }
     * //   },
     * //   hasMultipleLanguages: true,
     * //   languageCount: 2,
     * //   availableLanguages: ["zh", "en"]
     * // }]
     * ```
     */
    private groupEndpointsByLanguage(endpoints: any[], defaultLang?: string): any[] {
        // Create a map to group endpoints by ID
        const endpointMap = new Map<string, any[]>();

        endpoints.forEach((endpoint) => {
            // Use endpoint.id as the grouping key (same endpoint, different languages)
            const groupKey = endpoint.id;

            if (!endpointMap.has(groupKey)) {
                endpointMap.set(groupKey, []);
            }
            endpointMap.get(groupKey)!.push(endpoint);
        });

        // Convert map to array of grouped endpoints
        const groupedEndpoints: any[] = [];

        endpointMap.forEach((languageVariants, endpointId) => {
            // CASE 1: Only ONE variant (no multi-language)
            if (languageVariants.length === 1) {
                const endpoint = languageVariants[0];

                // If it has a @lang, wrap it in languages object anyway
                if (endpoint.lang) {
                    const grouped = { ...endpoint };
                    const lang = endpoint.lang;

                    // Remove lang from root level
                    delete grouped.lang;

                    // Create languages object
                    grouped.languages = {
                        [lang]: { ...endpoint }
                    };
                    grouped.hasMultipleLanguages = false;
                    grouped.languageCount = 1;
                    grouped.availableLanguages = [lang];
                    grouped.defaultLanguage = lang;

                    groupedEndpoints.push(grouped);
                } else {
                    // No @lang defined - keep as-is (language-neutral)
                    groupedEndpoints.push(endpoint);
                }
                return;
            }

            // CASE 2: Multiple language variants
            const hasAnyLang = languageVariants.some(ep => ep.lang);

            if (!hasAnyLang) {
                // All variants without @lang - should not happen normally,
                // but keep first one to avoid duplicates
                console.warn(`Multiple endpoints with same ID but no @lang: ${endpointId}`);
                groupedEndpoints.push(languageVariants[0]);
                return;
            }

            // Group by language and determine default
            const languagesMap: Record<string, any> = {};
            let defaultEndpoint: any = null;
            const availableLanguages: string[] = [];

            languageVariants.forEach((ep) => {
                if (ep.lang) {
                    languagesMap[ep.lang] = { ...ep };
                    availableLanguages.push(ep.lang);
                } else {
                    // Endpoint without @lang becomes the universal fallback
                    defaultEndpoint = { ...ep };
                }
            });

            // Determine which language to use as primary
            // Priority: 1. defaultLang from config, 2. first available, 3. default endpoint
            let primaryLang = defaultLang && languagesMap[defaultLang]
                ? defaultLang
                : availableLanguages[0];

            const primaryEndpoint = languagesMap[primaryLang] || defaultEndpoint || languageVariants[0];

            // Create grouped structure from primary endpoint
            const groupedEndpoint = { ...primaryEndpoint };

            // Remove lang from root level if it exists
            delete groupedEndpoint.lang;

            // Add languages object with all translations
            groupedEndpoint.languages = languagesMap;

            // Add default fallback if exists (endpoint without @lang)
            if (defaultEndpoint) {
                groupedEndpoint.default = defaultEndpoint;
            }

            // Add metadata
            groupedEndpoint.hasMultipleLanguages = availableLanguages.length > 1;
            groupedEndpoint.languageCount = availableLanguages.length;
            groupedEndpoint.availableLanguages = availableLanguages.sort();
            groupedEndpoint.defaultLanguage = primaryLang;

            groupedEndpoints.push(groupedEndpoint);
        });

        return groupedEndpoints;
    }

    /**
     * Copy template assets to output directory (Vue 3 Template)
     * @param outputPath
     */
    private async copyTemplateAssets(outputPath: string): Promise<void> {
        try {
            // Path to the Vue 3 template build
            // Try packaged template first (for NPM/Git installations), then dev path
            const packagedTemplatePath = path.resolve(__dirname, '../../../../template');
            const devTemplatePath = path.resolve('./apps/apidoc-template-v5/dist');

            let templatePath = packagedTemplatePath;
            if (!(await fs.pathExists(packagedTemplatePath))) {
                templatePath = devTemplatePath;
            }

            if (!(await fs.pathExists(templatePath))) {
                this.log('⚠️  Template not built. Building apidoc-template-v5 (Vue 3 SPA)...');
                // Build the template first (SPA only, no data embedding yet)
                const { exec } = require('child_process');
                const util = require('util');
                const execAsync = util.promisify(exec);

                try {
                    // Build WITHOUT running embed-data.js (we'll do it after copying)
                    await execAsync('cd apps/apidoc-template-v5 && npm run build');
                    this.log('✅ Template built successfully (SPA base)');
                    templatePath = devTemplatePath;
                } catch (error) {
                    console.error('❌ Failed to build template:', error);
                    return;
                }
            }

            // Copy index.html to output root
            // The /data directory already exists with our JSONs
            const indexHtmlSrc = path.join(templatePath, 'index.html');
            const indexHtmlDest = path.join(outputPath, 'index.html');

            if (await fs.pathExists(indexHtmlSrc)) {
                await fs.copy(indexHtmlSrc, indexHtmlDest, { overwrite: true });
                this.log('✅ Vue 3 template copied (index.html)');

                // Now embed the data from outputPath/data into the copied index.html
                await this.embedDataInHTML(outputPath);
            } else {
                console.warn('⚠️  index.html not found in template dist');
            }
        } catch (error) {
            console.error('❌ Error copying template assets:', error);
            // Continue anyway as this is not critical
        }
    }

    /**
     * Encrypt sensitive data if login is enabled
     * @param data Data to potentially encrypt
     * @param encryption JSONEncryption instance
     * @returns Encrypted data structure or original data
     */
    private encryptIfNeeded(data: any, encryption: JSONEncryption | null): any {
        if (!encryption) {
            return data;
        }

        try {
            const encrypted = encryption.encryptJSON(data);
            return {
                encrypted: true,
                data: encrypted.data,
                iv: encrypted.iv,
                tag: encrypted.tag,
                algorithm: encrypted.algorithm,
            };
        } catch (error) {
            console.warn('⚠️  Failed to encrypt data, using unencrypted:', error);
            return data;
        }
    }

    /**
     * Embed JSON data into HTML file
     * @param outputPath Path where index.html and data/ exist
     */
    private async embedDataInHTML(outputPath: string): Promise<void> {
        try {
            this.log('💉 Embedding JSON data into HTML...');

            const dataPath = path.join(outputPath, 'data');
            const indexHtmlPath = path.join(outputPath, 'index.html');

            // Initialize encryption if login is active
            let encryption: JSONEncryption | null = null;
            if (this.projectInfo?.login?.active && this.projectInfo.login.encryptionKey) {
                this.log('🔐 Login enabled - initializing encryption for sensitive data...');
                encryption = new JSONEncryption({}, this.projectInfo.login.encryptionKey);
            }

            // Load all JSON files
            const allData: any = {};

            // Read top-level JSON files
            const jsonFiles = (await fs.readdir(dataPath)).filter((f) => f.endsWith('.json'));

            for (const file of jsonFiles) {
                const filePath = path.join(dataPath, file);
                const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));

                // cat.json → 'cat', cat.navigation.json → 'navigation', etc.
                const key = file.replace('cat.', '').replace('.json', '');

                if (file.startsWith('cat.') && file !== 'cat.json') {
                    allData[key] = content;
                } else if (file === 'cat.json') {
                    allData.cat = content;
                }
            }

            // Read subdirectories (cat.api/, cat.docs/, cat.tsdoc/, cat.model/)
            const subdirs = (await fs.readdir(dataPath, { withFileTypes: true })).filter((dirent) =>
                dirent.isDirectory()
            );

            // Categories that should be encrypted when login is active
            const sensitiveCategories = ['api', 'docs', 'model'];

            for (const dir of subdirs) {
                const subdirPath = path.join(dataPath, dir.name);
                const subdirFiles = (await fs.readdir(subdirPath)).filter((f) => f.endsWith('.json'));

                // cat.api → api
                const category = dir.name.replace('cat.', '');
                if (!allData[category]) allData[category] = {};

                const shouldEncrypt = encryption && sensitiveCategories.includes(category);

                for (const file of subdirFiles) {
                    const filePath = path.join(subdirPath, file);
                    const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
                    const key = file.replace('.json', '');

                    // Encrypt sensitive data if encryption is enabled
                    allData[category][key] = shouldEncrypt ? this.encryptIfNeeded(content, encryption) : content;
                }
            }

            // Log encryption status
            if (encryption) {
                this.log(`🔐 Encrypted sensitive categories: ${sensitiveCategories.join(', ')}`);
            }

            // Read current HTML
            let html = await fs.readFile(indexHtmlPath, 'utf-8');

            // Create the script tag with embedded data
            const dataScript = `<script>
window.__APICAT_DATA__ = ${JSON.stringify(allData, null, 0)};
</script>
`;

            // Insert BEFORE the first <script> tag
            const scriptMatch = html.match(/<script[^>]*>/);
            if (scriptMatch) {
                const scriptIndex = html.indexOf(scriptMatch[0]);
                html = html.slice(0, scriptIndex) + dataScript + html.slice(scriptIndex);
            } else {
                // Fallback: insert before </head>
                html = html.replace('</head>', `${dataScript}</head>`);
            }

            // Write the modified HTML
            await fs.writeFile(indexHtmlPath, html, 'utf-8');

            const dataSize = (JSON.stringify(allData).length / 1024).toFixed(2);
            const fileSize = ((await fs.stat(indexHtmlPath)).size / 1024).toFixed(2);
            this.log(`✅ Data embedded: ${dataSize} KB → Total HTML: ${fileSize} KB`);
            this.log(`📊 Categories: ${Object.keys(allData).join(', ')}`);

            // Remove /data directory after embedding (no longer needed)
            this.log('🗑️  Removing /data directory (data now embedded in HTML)...');
            await fs.remove(dataPath);
            this.log('✅ Cleanup complete - /data directory removed');
        } catch (error) {
            console.error('❌ Error embedding data:', error);
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
        this.log(`📄 Collection saved: ${filePath}`);
    }

    /**
     * Write testing scenarios to file
     * @param scenarios
     */
    private async writeTestingScenarios(scenarios: any): Promise<void> {
        const filePath = path.join(this.outputDir, 'test-scenarios.json');
        await fs.writeJSON(filePath, scenarios, { spaces: 2 });
        this.log(`🧪 Test scenarios saved: ${filePath}`);
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
