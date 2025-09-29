/**
 * apiCAT Plugin for APIDoc
 * Extends APIDoc functionality with local testing and collection management
 *
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
    tauri?: {
        enabled: boolean;
        buildDir?: string;
    };
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
            tauri: {
                enabled: false,
                buildDir: null
            },
            ...config
        };

        this.outputDir = this.config.outputDir || './apicat-output';
    }

    /**
     * Process APIDoc data and generate apiCAT collections
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
            schemaVersion: "5.0.0",
            generatedAt: new Date().toISOString(),
            generator: {
                name: "apiCAT",
                version: "5.0.0-alpha.1",
                url: "https://apidoc.app"
            },
            meta: "cat.meta.json",
            navigation: "cat.navigation.json",
            api: {
                index: "cat.api.index.json",
                shards: this.generateShardList(apicatData.groups)
            },
            docs: this.generateDocsMap(apicatData.groups),
            tsdoc: ["cat.tsdoc/core.json", "cat.tsdoc/models.json"],
            search: "cat.search.json",
            assets: "cat.assets.json"
        };

        await fs.writeFile(
            path.join(outputPath, 'cat.json'),
            JSON.stringify(manifest, null, 2)
        );

        // Generate meta
        await fs.writeFile(
            path.join(outputPath, 'cat.meta.json'),
            JSON.stringify({
                name: apicatData.project.name,
                version: apicatData.project.version,
                description: apicatData.project.description,
                title: apicatData.project.title,
                url: apicatData.project.url,
                sampleUrl: apicatData.project.sampleUrl,
                generatedAt: manifest.generatedAt
            }, null, 2)
        );

        // Generate navigation
        await this.generateNavigation(apicatData, outputPath);

        // Generate API index and shards
        await this.generateApiStructure(apicatData, outputPath);

        // Generate search index
        await this.generateSearchIndex(apicatData, outputPath);

        // Generate assets manifest
        await this.generateAssetsManifest(outputPath);

        // Generate placeholder docs and tsdoc
        await this.generatePlaceholderContent(apicatData, outputPath);
    }

    /**
     * Generate shard list for manifest
     */
    private generateShardList(groups: string[]): string[] {
        return groups.map(group => `cat.api/${group.toLowerCase()}.json`);
    }

    /**
     * Generate docs map for manifest
     */
    private generateDocsMap(groups: string[]): Record<string, string> {
        const docsMap: Record<string, string> = {
            header: "cat.docs/header.html",
            footer: "cat.docs/footer.html"
        };

        groups.forEach(group => {
            docsMap[`group.${group}`] = `cat.docs/group.${group}.html`;
        });

        return docsMap;
    }

    /**
     * Generate navigation structure
     */
    private async generateNavigation(apicatData: any, outputPath: string): Promise<void> {
        const groups = apicatData.groups.map((groupName: string) => ({
            id: groupName,
            title: groupName,
            icon: this.getGroupIcon(groupName),
            endpoints: apicatData.endpoints
                .filter((ep: any) => ep.group === groupName)
                .map((ep: any) => ep.id)
        }));

        const navigation = {
            groups,
            order: apicatData.groups,
            stats: {
                totalEndpoints: apicatData.endpoints.length,
                totalGroups: groups.length,
                lastUpdated: new Date().toISOString()
            }
        };

        await fs.writeFile(
            path.join(outputPath, 'cat.navigation.json'),
            JSON.stringify(navigation, null, 2)
        );
    }

    /**
     * Generate API index and shards
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
                shard: `cat.api/${ep.group.toLowerCase()}.json`
            })),
            stats: {
                totalEndpoints: apicatData.endpoints.length,
                byGroup: this.getStatsByGroup(apicatData.endpoints),
                byMethod: this.getStatsByMethod(apicatData.endpoints)
            },
            lastUpdated: new Date().toISOString()
        };

        await fs.writeFile(
            path.join(outputPath, 'cat.api.index.json'),
            JSON.stringify(apiIndex, null, 2)
        );

        // Generate shards by group
        const groups = apicatData.groups;
        for (const group of groups) {
            const groupEndpoints = apicatData.endpoints.filter((ep: any) => ep.group === group);
            const shard = {
                group,
                endpoints: groupEndpoints,
                generatedAt: new Date().toISOString()
            };

            await fs.writeFile(
                path.join(outputPath, 'cat.api', `${group.toLowerCase()}.json`),
                JSON.stringify(shard, null, 2)
            );
        }
    }

    /**
     * Generate search index
     */
    private async generateSearchIndex(apicatData: any, outputPath: string): Promise<void> {
        const documents = apicatData.endpoints.map((ep: any) => ({
            id: ep.id,
            type: "endpoint",
            title: ep.title,
            path: ep.url,
            group: ep.group,
            method: ep.method,
            tags: [ep.group.toLowerCase(), ep.method.toLowerCase(), ...ep.title.toLowerCase().split(' ')],
            summary: ep.description,
            ref: {
                type: "endpoint",
                id: ep.id,
                shard: `cat.api/${ep.group.toLowerCase()}.json`
            }
        }));

        const searchIndex = {
            documents,
            stats: {
                totalDocuments: documents.length,
                byType: { endpoint: documents.length }
            },
            generatedAt: new Date().toISOString()
        };

        await fs.writeFile(
            path.join(outputPath, 'cat.search.json'),
            JSON.stringify(searchIndex, null, 2)
        );
    }

    /**
     * Generate assets manifest
     */
    private async generateAssetsManifest(outputPath: string): Promise<void> {
        const assets = {
            favicon: {
                path: "assets/favicon.svg",
                hash: "sha256-placeholder",
                size: 1024,
                mime: "image/svg+xml"
            },
            logo: { light: null, dark: null },
            stylesheets: [
                {
                    path: "assets/apicat.css",
                    hash: "sha256-placeholder",
                    size: 45000,
                    mime: "text/css"
                }
            ],
            scripts: [
                {
                    path: "assets/apicat.js",
                    hash: "sha256-placeholder",
                    size: 25000,
                    mime: "application/javascript"
                }
            ],
            generatedAt: new Date().toISOString()
        };

        await fs.writeFile(
            path.join(outputPath, 'cat.assets.json'),
            JSON.stringify(assets, null, 2)
        );
    }

    /**
     * Generate placeholder docs and tsdoc content
     */
    private async generatePlaceholderContent(apicatData: any, outputPath: string): Promise<void> {
        // Generate placeholder docs for each group
        for (const group of apicatData.groups) {
            const groupHtml = `<div class="group-docs">
                <h2>${group} API</h2>
                <p>Documentation for ${group} endpoints.</p>
                <p class="text-muted">Generated by apiCAT v5.0</p>
            </div>`;

            await fs.writeFile(
                path.join(outputPath, 'cat.docs', `group.${group}.html`),
                groupHtml
            );
        }

        // Generate header and footer
        await fs.writeFile(
            path.join(outputPath, 'cat.docs', 'header.html'),
            '<div class="header-docs"><h1>API Documentation</h1><p>Welcome to the API documentation.</p></div>'
        );

        await fs.writeFile(
            path.join(outputPath, 'cat.docs', 'footer.html'),
            '<div class="footer-docs"><p>Generated with apiCAT v5.0 - <a href="https://apidoc.app">Learn more</a></p></div>'
        );

        // Generate placeholder TSDoc
        const tsdocCore = {
            module: "core",
            symbols: [],
            generatedAt: new Date().toISOString()
        };

        const tsdocModels = {
            module: "models",
            symbols: [],
            generatedAt: new Date().toISOString()
        };

        await fs.writeFile(
            path.join(outputPath, 'cat.tsdoc', 'core.json'),
            JSON.stringify(tsdocCore, null, 2)
        );

        await fs.writeFile(
            path.join(outputPath, 'cat.tsdoc', 'models.json'),
            JSON.stringify(tsdocModels, null, 2)
        );
    }

    /**
     * Helper methods
     */
    private getGroupIcon(groupName: string): string {
        const iconMap: Record<string, string> = {
            'Users': 'fa-users',
            'Company': 'fa-building',
            'System': 'fa-cogs',
            'City': 'fa-map-marker-alt',
            'Category': 'fa-tags'
        };
        return iconMap[groupName] || 'fa-folder';
    }

    private getStatsByGroup(endpoints: any[]): Record<string, number> {
        const stats: Record<string, number> = {};
        endpoints.forEach(ep => {
            stats[ep.group] = (stats[ep.group] || 0) + 1;
        });
        return stats;
    }

    private getStatsByMethod(endpoints: any[]): Record<string, number> {
        const stats: Record<string, number> = {};
        endpoints.forEach(ep => {
            stats[ep.method] = (stats[ep.method] || 0) + 1;
        });
        return stats;
    }

    /**
     * Copy template assets to output directory
     */
    private async copyTemplateAssets(outputPath: string): Promise<void> {
        try {
            // Path to the built template assets
            const templatePath = path.resolve('./apps/apicat-template/dist');

            if (!await fs.pathExists(templatePath)) {
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
     */
    private generateCollection(apiData: any, projectInfo: ApiDocProject): any {
        const collection = {
            info: {
                name: projectInfo.name || 'API Collection',
                description: projectInfo.description || 'Generated by apiCAT',
                version: projectInfo.version || '1.0.0',
                schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
            },
            item: [],
            variable: [],
            auth: null
        };

        // Process API endpoints
        if (Array.isArray(apiData)) {
            const groups = this.groupEndpoints(apiData);

            Object.entries(groups).forEach(([groupName, endpoints]: [string, any[]]) => {
                const folder = {
                    name: groupName,
                    item: endpoints.map(endpoint => this.convertEndpoint(endpoint))
                };
                collection.item.push(folder);
            });
        }

        return collection;
    }

    /**
     * Group endpoints by their API group
     */
    private groupEndpoints(apiData: any[]): Record<string, any[]> {
        const groups: Record<string, any[]> = {};

        apiData.forEach(endpoint => {
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
                    path: url.split('/').filter(Boolean)
                },
                body: this.extractBody(endpoint),
                description: endpoint.description || ''
            },
            response: this.extractExamples(endpoint)
        };
    }

    /**
     * Extract headers from endpoint definition
     */
    private extractHeaders(endpoint: any): any[] {
        const headers: any[] = [];

        if (endpoint.header && endpoint.header.fields) {
            Object.values(endpoint.header.fields).forEach((group: any) => {
                if (Array.isArray(group)) {
                    group.forEach(header => {
                        headers.push({
                            key: header.field,
                            value: header.defaultValue || '',
                            description: header.description || '',
                            disabled: header.optional || false
                        });
                    });
                }
            });
        }

        return headers;
    }

    /**
     * Extract request body from endpoint
     */
    private extractBody(endpoint: any): any {
        if (!endpoint.parameter || !endpoint.parameter.fields) {
            return null;
        }

        const bodyParams: any = {};

        Object.values(endpoint.parameter.fields).forEach((group: any) => {
            if (Array.isArray(group)) {
                group.forEach(param => {
                    if (param.field && !param.field.includes(':')) { // Skip URL params
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
                    language: 'json'
                }
            }
        };
    }

    /**
     * Extract example responses
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
                    body: example.content || ''
                });
            });
        }

        return examples;
    }

    /**
     * Generate testing scenarios for local testing
     */
    private generateTestingScenarios(apiData: any[]): any {
        return {
            scenarios: apiData.map(endpoint => ({
                id: `${endpoint.type}_${endpoint.url}`.replace(/[^a-zA-Z0-9]/g, '_'),
                name: endpoint.title || `${endpoint.type} ${endpoint.url}`,
                method: endpoint.type?.toUpperCase() || 'GET',
                url: endpoint.url || '',
                description: endpoint.description || '',
                group: endpoint.group || 'General',
                expectedResponses: this.extractExpectedResponses(endpoint)
            }))
        };
    }

    /**
     * Extract expected responses for testing
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
                    description: example.title || 'Success'
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
                    description: example.title || 'Error'
                });
            });
        }

        return responses;
    }

    /**
     * Write collection to file
     */
    private async writeCollection(collection: any): Promise<void> {
        const filePath = path.join(this.outputDir, 'collection.json');
        await fs.writeJSON(filePath, collection, { spaces: 2 });
        console.log(`📄 Collection saved: ${filePath}`);
    }

    /**
     * Write testing scenarios to file
     */
    private async writeTestingScenarios(scenarios: any): Promise<void> {
        const filePath = path.join(this.outputDir, 'test-scenarios.json');
        await fs.writeJSON(filePath, scenarios, { spaces: 2 });
        console.log(`🧪 Test scenarios saved: ${filePath}`);
    }

    /**
     * Generate data for Tauri desktop app
     */
    public async generateTauriData(apiData: any, projectInfo: ApiDocProject): Promise<void> {
        if (!this.config.tauri?.enabled) {
            return;
        }

        // Skip Tauri generation since we're using static templates now
        if (!this.config.tauri.enabled) {
            console.log('🖥️  Skipping Tauri app data generation (disabled)');
            return;
        }
        const tauriDataDir = path.join(this.config.tauri.buildDir || './apps/apicat-template', 'src/assets');
        await fs.ensureDir(tauriDataDir);

        // Generate app data
        const appData = {
            project: projectInfo,
            apis: apiData,
            collections: await this.readCollection(),
            scenarios: await this.readTestingScenarios(),
            generatedAt: new Date().toISOString()
        };

        const dataPath = path.join(tauriDataDir, 'api-data.json');
        await fs.writeJSON(dataPath, appData, { spaces: 2 });

        console.log(`🖥️  Tauri app data generated: ${dataPath}`);
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