/**
 * OpenAPI 3.0 Converter for APIDoc 4.0
 *
 * Converts APIDoc parsed data to OpenAPI 3.0 specification
 * @since 5.0.0
 */

import * as _ from 'lodash';

interface ApiDocItem {
    type: string;
    url: string;
    title?: string;
    name?: string;
    group?: string;
    description?: string;
    version?: string;
    filename?: string;
    groupTitle?: string;
    groupDescription?: string;
    header?: {
        fields?: {
            Header?: Array<{
                group: string;
                type: string;
                size?: string;
                allowedValues?: string[];
                optional: boolean;
                field: string;
                defaultValue?: string;
                description?: string;
            }>;
        };
    };
    parameter?: {
        fields?: {
            Parameter?: Array<{
                group: string;
                type: string;
                size?: string;
                allowedValues?: string[];
                optional: boolean;
                field: string;
                defaultValue?: string;
                description?: string;
            }>;
            Body?: Array<{
                group: string;
                type: string;
                size?: string;
                allowedValues?: string[];
                optional: boolean;
                field: string;
                defaultValue?: string;
                description?: string;
            }>;
            Query?: Array<{
                group: string;
                type: string;
                size?: string;
                allowedValues?: string[];
                optional: boolean;
                field: string;
                defaultValue?: string;
                description?: string;
            }>;
        };
        examples?: Array<{
            title: string;
            content: string;
            type: string;
        }>;
    };
    success?: {
        fields?: {
            'Success 200'?: Array<{
                group: string;
                type: string;
                size?: string;
                allowedValues?: string[];
                optional: boolean;
                field: string;
                defaultValue?: string;
                description?: string;
            }>;
        };
        examples?: Array<{
            title: string;
            content: string;
            type: string;
        }>;
    };
    error?: {
        fields?: Record<
            string,
            Array<{
                group: string;
                type: string;
                size?: string;
                allowedValues?: string[];
                optional: boolean;
                field: string;
                defaultValue?: string;
                description?: string;
            }>
        >;
        examples?: Array<{
            title: string;
            content: string;
            type: string;
        }>;
    };
}

interface ProjectData {
    name?: string;
    title?: string;
    version?: string;
    description?: string;
    url?: string;
    sampleUrl?: string;
}

interface OpenApiSpec {
    openapi: string;
    info: {
        title: string;
        version: string;
        description?: string;
    };
    servers?: Array<{
        url: string;
        description?: string;
    }>;
    paths: Record<string, any>;
    components?: {
        schemas?: Record<string, any>;
    };
}

/**
 * Converts APIDoc data to OpenAPI 3.0 specification
 */
export class OpenApiConverter {
    private swagger: OpenApiSpec;

    constructor() {
        this.swagger = {
            openapi: '3.0.0',
            info: {
                title: '',
                version: '',
                description: '',
            },
            paths: {},
        };
    }

    /**
     * Main conversion method
     * @param apidocData
     * @param projectData
     */
    convert(apidocData: ApiDocItem[], projectData: ProjectData): OpenApiSpec {
        this.swagger.info = this.addInfo(projectData);

        if (projectData.url || projectData.sampleUrl) {
            this.swagger.servers = this.addServers(projectData);
        }

        this.swagger.paths = this.extractPaths(apidocData);

        return this.swagger;
    }

    /**
     * Adds project information to OpenAPI info object
     * @param projectData
     */
    private addInfo(projectData: ProjectData): OpenApiSpec['info'] {
        return {
            title: projectData.title || projectData.name || 'API Documentation',
            version: projectData.version || '1.0.0',
            description: projectData.description || '',
        };
    }

    /**
     * Adds server information from project data
     * @param projectData
     */
    private addServers(projectData: ProjectData): OpenApiSpec['servers'] {
        const servers = [];

        if (projectData.url) {
            servers.push({
                url: projectData.url,
                description: 'Production server',
            });
        }

        if (projectData.sampleUrl && projectData.sampleUrl !== projectData.url) {
            servers.push({
                url: projectData.sampleUrl,
                description: 'Development server',
            });
        }

        return servers.length > 0 ? servers : undefined;
    }

    /**
     * Removes HTML tags from text
     * @param text
     */
    private removeTags(text?: string): string {
        const tagsRegex = /(<([^>]+)>)/gi;
        return text ? text.replace(tagsRegex, '') : '';
    }

    /**
     * Groups API endpoints by URL
     * @param apidocData
     */
    private groupByUrl(apidocData: ApiDocItem[]): Array<{ verbs: ApiDocItem[] }> {
        const apiByUrl = _.groupBy(apidocData, 'url');
        return _.map(apiByUrl, (verbs) => ({ verbs }));
    }

    /**
     * Extracts paths from APIDoc data
     * @param apidocData
     */
    private extractPaths(apidocData: ApiDocItem[]): Record<string, any> {
        const apiPaths = this.groupByUrl(apidocData);
        const paths: Record<string, any> = {};

        for (const apiPath of apiPaths) {
            const verbs = apiPath.verbs;
            let url = verbs[0].url;

            // Convert APIDoc URL parameters to OpenAPI format
            // :param -> {param}
            url = url.replace(/:([^/]+)/g, '{$1}');

            for (const verb of verbs) {
                const method = verb.type.toLowerCase();

                if (!paths[url]) {
                    paths[url] = {};
                }

                paths[url][method] = this.generatePathItem(verb);
            }
        }

        return paths;
    }

    /**
     * Generates a path item for OpenAPI
     * @param verb
     */
    private generatePathItem(verb: ApiDocItem): any {
        const pathItem: any = {
            summary: verb.name?.replace(/(_+)/g, ' ') || verb.title || '',
            description: this.removeTags(verb.description) || '',
            tags: verb.group ? [verb.group] : undefined,
            parameters: [],
            responses: {},
        };

        // Add parameters
        this.addParameters(pathItem, verb);

        // Add request body for POST/PUT/PATCH
        if (['post', 'put', 'patch'].includes(verb.type.toLowerCase())) {
            this.addRequestBody(pathItem, verb);
        }

        // Add responses
        this.addResponses(pathItem, verb);

        // Clean up empty arrays
        if (pathItem.parameters.length === 0) {
            delete pathItem.parameters;
        }

        return pathItem;
    }

    /**
     * Adds parameters to path item
     * @param pathItem
     * @param verb
     */
    private addParameters(pathItem: any, verb: ApiDocItem): void {
        const parameters = pathItem.parameters;

        // Add header parameters
        if (verb.header?.fields?.Header) {
            for (const header of verb.header.fields.Header) {
                parameters.push({
                    in: 'header',
                    name: header.field,
                    description: this.removeTags(header.description),
                    required: !header.optional,
                    schema: {
                        type: this.convertType(header.type),
                        default: header.defaultValue,
                    },
                });
            }
        }

        // Add query parameters
        if (verb.parameter?.fields?.Query) {
            for (const query of verb.parameter.fields.Query) {
                parameters.push({
                    in: 'query',
                    name: query.field,
                    description: this.removeTags(query.description),
                    required: !query.optional,
                    schema: {
                        type: this.convertType(query.type),
                        default: query.defaultValue,
                    },
                });
            }
        }

        // Add path parameters
        if (verb.parameter?.fields?.Parameter) {
            for (const param of verb.parameter.fields.Parameter) {
                if (verb.url.includes(`:${param.field}`) || verb.url.includes(`{${param.field}}`)) {
                    parameters.push({
                        in: 'path',
                        name: param.field,
                        description: this.removeTags(param.description),
                        required: true,
                        schema: {
                            type: this.convertType(param.type),
                        },
                    });
                }
            }
        }
    }

    /**
     * Adds request body for POST/PUT/PATCH methods
     * @param pathItem
     * @param verb
     */
    private addRequestBody(pathItem: any, verb: ApiDocItem): void {
        if (!verb.parameter?.fields?.Body && !verb.parameter?.examples) {
            return;
        }

        pathItem.requestBody = {
            content: {
                'application/json': {
                    schema: this.generateSchemaFromFields(verb.parameter.fields?.Body || []),
                },
            },
        };

        // Add example if available
        if (verb.parameter?.examples && verb.parameter.examples.length > 0) {
            const example = verb.parameter.examples[0];
            try {
                pathItem.requestBody.content['application/json'].example = JSON.parse(example.content);
            } catch (err: any) {
                console.error(err);
                // If parsing fails, use as string
                pathItem.requestBody.content['application/json'].example = example.content;
            }
        }
    }

    /**
     * Adds responses to path item
     * @param pathItem
     * @param verb
     */
    private addResponses(pathItem: any, verb: ApiDocItem): void {
        // Default 200 response
        pathItem.responses['200'] = {
            description: 'Successful response',
        };

        // Add success response schema
        if (verb.success?.fields?.['Success 200']) {
            pathItem.responses['200'].content = {
                'application/json': {
                    schema: this.generateSchemaFromFields(verb.success.fields['Success 200']),
                },
            };
        }

        // Add success example
        if (verb.success?.examples && verb.success.examples.length > 0) {
            const example = verb.success.examples[0];
            try {
                if (!pathItem.responses['200'].content) {
                    pathItem.responses['200'].content = {
                        'application/json': {},
                    };
                }
                pathItem.responses['200'].content['application/json'].example = JSON.parse(example.content);
            } catch (err: any) {
                console.error(err);
                // If parsing fails, use as string
                if (!pathItem.responses['200'].content) {
                    pathItem.responses['200'].content = {
                        'application/json': {},
                    };
                }
                pathItem.responses['200'].content['application/json'].example = example.content;
            }
        }

        // Add error responses
        if (verb.error?.fields) {
            for (const [errorCode, errorFields] of Object.entries(verb.error.fields)) {
                const code = errorCode.replace(/\D/g, '') || '400';
                pathItem.responses[code] = {
                    description: `Error response - ${errorCode}`,
                    content: {
                        'application/json': {
                            schema: this.generateSchemaFromFields(errorFields),
                        },
                    },
                };
            }
        }
    }

    /**
     * Generates JSON schema from APIDoc fields
     * @param fields
     */
    private generateSchemaFromFields(fields: any[]): any {
        if (!fields || fields.length === 0) {
            return { type: 'object' };
        }

        const schema: any = {
            type: 'object',
            properties: {},
            required: [],
        };

        for (const field of fields) {
            const fieldName = field.field;
            const fieldType = this.convertType(field.type);

            schema.properties[fieldName] = {
                type: fieldType,
                description: this.removeTags(field.description),
            };

            if (field.defaultValue) {
                schema.properties[fieldName].default = field.defaultValue;
            }

            if (!field.optional) {
                schema.required.push(fieldName);
            }
        }

        if (schema.required.length === 0) {
            delete schema.required;
        }

        return schema;
    }

    /**
     * Converts APIDoc types to OpenAPI types
     * @param type
     */
    private convertType(type: string): string {
        if (!type) return 'string';

        const lowerType = type.toLowerCase();

        if (lowerType.includes('string')) return 'string';
        if (lowerType.includes('number') || lowerType.includes('integer')) return 'number';
        if (lowerType.includes('boolean') || lowerType.includes('bool')) return 'boolean';
        if (lowerType.includes('array')) return 'array';
        if (lowerType.includes('object')) return 'object';

        return 'string'; // Default fallback
    }
}

/**
 * Convenience function to convert APIDoc data to OpenAPI
 * @param apidocData
 * @param projectData
 */
export function convertToOpenApi(apidocData: ApiDocItem[], projectData: ProjectData): OpenApiSpec {
    const converter = new OpenApiConverter();
    return converter.convert(apidocData, projectData);
}
