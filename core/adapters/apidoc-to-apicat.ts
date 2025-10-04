/**
 * apiDoc to apiCAT Adapter
 * Converts apiDoc raw JSON output to apiCAT-friendly docs.json format
 */

export interface ApiCATEndpoint {
    id: string;
    group: string;
    name: string;
    title: string;
    description: string;
    method: string;
    url: string;
    parameters?: ApiCATParameter[];
    header?: ApiCATParameter[];
    success?: ApiCATResponse;
    error?: ApiCATResponse;
    examples?: ApiCATExample[];
    version?: string;
    filename?: string;
}

export interface ApiCATParameter {
    field: string;
    type: string;
    required: boolean;
    description: string;
    defaultValue?: string;
    group?: string; // Optional group info (e.g., "Error 4xx", "Success 200")
}

export interface ApiCATResponse {
    type: string;
    statusCode?: string;
    description?: string;
    examples?: ApiCATExample[];
    fields?: ApiCATParameter[];
}

export interface ApiCATExample {
    title: string;
    content: string;
    type: 'json' | 'text' | 'curl';
}

export interface ApiCATProject {
    name: string;
    version: string;
    description: string;
    title?: string;
    url?: string;
    sampleUrl?: string;
    homepage?: string;
    header?: {
        title: string;
        filename: string;
        icon?: string;
    };
    footer?: {
        title: string;
        filename: string;
        icon?: string;
    };
    bugs?: {
        url: string;
    };
    repository?: {
        type: string;
        url: string;
    };
    mqtt?: {
        enabled: boolean;
        broker: {
            host: string;
            port: number;
            protocol: string;
        };
        authentication: {
            username: string;
            password: string;
            clientId: string;
        };
        ssl: {
            enabled: boolean;
            rejectUnauthorized: boolean;
            ca: string;
            cert: string;
            key: string;
        };
        options: {
            keepalive: number;
            connectTimeout: number;
            reconnectPeriod: number;
            clean: boolean;
        };
    };
}

export interface ApiCATDocs {
    project: ApiCATProject;
    endpoints: ApiCATEndpoint[];
    models?: any[]; // Model documentation items
    groups: string[];
    generated: string;
    generator: string;
}

/**
 * Transform apiDoc data to apiCAT format
 * @param apiDocData
 * @param projectInfo
 */
export function transformToApiCAT(apiDocData: any, projectInfo: any): ApiCATDocs {
    const endpoints: ApiCATEndpoint[] = [];
    const models: any[] = [];
    const groups = new Set<string>();

    // Process each endpoint or model
    if (Array.isArray(apiDocData)) {
        apiDocData.forEach((item: any) => {
            // Check if this is a model documentation (has .model field)
            if (item.model) {
                // This is a model - add to models array
                const modelDoc = {
                    id: generateEndpointId(item),
                    group: item.group || 'General',
                    name: item.name || '',
                    title: item.title || item.name || '',
                    description: item.description || '',
                    version: item.version || '1.0.0',
                    filename: item.filename || '',
                    model: item.model,
                };
                models.push(modelDoc);
                groups.add(modelDoc.group);
                return; // Skip adding to endpoints
            }

            // This is a regular API endpoint
            const endpoint: ApiCATEndpoint = {
                id: generateEndpointId(item),
                group: item.group || 'General',
                name: item.name || '',
                title: item.title || item.name || '',
                description: item.description || '',
                method: (item.type || 'GET').toUpperCase(),
                url: item.url || '',
                version: item.version || '1.0.0',
                filename: item.filename || '',
            };

            // Add group to set
            groups.add(endpoint.group);

            // Transform parameters - check all parameter field groups (Parameter, Body, Query, etc.)
            if (item.parameter?.fields) {
                const allParams: any[] = [];
                // Iterate through all parameter groups (Parameter, Body, Query, etc.)
                Object.keys(item.parameter.fields).forEach((groupName) => {
                    const groupParams = item.parameter.fields[groupName];
                    if (Array.isArray(groupParams)) {
                        groupParams.forEach((param: any) => {
                            allParams.push({
                                field: param.field,
                                type: param.type || 'String',
                                required: !param.optional,
                                description: param.description || '',
                                defaultValue: param.defaultValue,
                                group: groupName, // Preserve group info
                            });
                        });
                    }
                });
                if (allParams.length > 0) {
                    endpoint.parameters = allParams;
                }
            }

            // Transform headers
            if (item.header?.fields?.Header) {
                endpoint.header = item.header.fields.Header.map((header: any) => ({
                    field: header.field,
                    type: header.type || 'String',
                    required: !header.optional,
                    description: header.description || '',
                    defaultValue: header.defaultValue,
                }));
            }

            // Transform success response
            if (item.success) {
                // Extract fields from any success group (usually "Success 200")
                let successFields: any[] | undefined;
                if (item.success.fields) {
                    // Find the first key in fields object (e.g., "Success 200")
                    const firstKey = Object.keys(item.success.fields)[0];
                    if (firstKey && item.success.fields[firstKey]) {
                        successFields = item.success.fields[firstKey].map((field: any) => ({
                            field: field.field,
                            type: field.type || 'String',
                            required: !field.optional,
                            description: field.description || '',
                            defaultValue: field.defaultValue,
                        }));
                    }
                }

                endpoint.success = {
                    type: 'success',
                    statusCode: '200',
                    description: item.success.description || '',
                    ...(item.success.examples && {
                        examples: item.success.examples.map((example: any) => ({
                            title: example.title || 'Success Example',
                            content: example.content || '',
                            type: 'json' as const,
                        })),
                    }),
                    ...(successFields && { fields: successFields }),
                };
            }

            // Transform error response
            if (item.error) {
                // Extract fields from any error group (e.g., "Error 4xx", "Error 500 Internal Server Error")
                let errorFields: any[] | undefined;
                if (item.error.fields) {
                    // Combine all error groups into a single array
                    const allErrorFields: any[] = [];
                    Object.keys(item.error.fields).forEach((groupKey) => {
                        if (item.error.fields[groupKey]) {
                            item.error.fields[groupKey].forEach((field: any) => {
                                allErrorFields.push({
                                    field: field.field,
                                    type: field.type || 'String',
                                    required: !field.optional,
                                    description: field.description || '',
                                    defaultValue: field.defaultValue,
                                    group: groupKey, // Preserve group info (e.g., "Error 4xx")
                                });
                            });
                        }
                    });
                    if (allErrorFields.length > 0) {
                        errorFields = allErrorFields;
                    }
                }

                endpoint.error = {
                    type: 'error',
                    statusCode: item.error.statusCode || '400',
                    description: item.error.description || '',
                    ...(item.error.examples && {
                        examples: item.error.examples.map((example: any) => ({
                            title: example.title || 'Error Example',
                            content: example.content || '',
                            type: 'json' as const,
                        })),
                    }),
                    ...(errorFields && { fields: errorFields }),
                };
            }

            // Transform examples
            if (item.examples) {
                endpoint.examples = item.examples.map((example: any) => ({
                    title: example.title || 'Example',
                    content: example.content || '',
                    type: detectExampleType(example.content) as 'json' | 'text' | 'curl',
                }));
            }

            endpoints.push(endpoint);
        });
    }

    // Build project info
    const project: ApiCATProject = {
        name: projectInfo.name || 'API Documentation',
        version: projectInfo.version || '1.0.0',
        description: projectInfo.description || 'API documentation generated with apiCAT',
        title: projectInfo.title || projectInfo.name,
        url: projectInfo.url || '',
        sampleUrl: projectInfo.sampleUrl || projectInfo.url || '',
        homepage: projectInfo.homepage,
        header: projectInfo.header,
        footer: projectInfo.footer,
        bugs: projectInfo.bugs,
        repository: projectInfo.repository,
        mqtt: projectInfo.mqtt,
    };

    // Respect custom order from apidoc.json if exists, otherwise sort alphabetically
    const groupsArray = Array.from(groups);
    let orderedGroups: string[];

    if (projectInfo.order && Array.isArray(projectInfo.order)) {
        // Use custom order from apidoc.json
        // First, add groups that are in the custom order
        orderedGroups = projectInfo.order.filter((g: string) => groupsArray.includes(g));

        // Then add any remaining groups that weren't in the custom order (sorted alphabetically)
        const remainingGroups = groupsArray
            .filter(g => !projectInfo.order.includes(g))
            .sort();

        orderedGroups = [...orderedGroups, ...remainingGroups];
    } else {
        // No custom order, sort alphabetically
        orderedGroups = groupsArray.sort();
    }

    return {
        project,
        endpoints: endpoints.sort((a, b) => {
            // Sort by group first, then by name
            if (a.group !== b.group) {
                return a.group.localeCompare(b.group);
            }
            return a.name.localeCompare(b.name);
        }),
        models: models.length > 0 ? models.sort((a, b) => {
            // Sort models by group first, then by name
            if (a.group !== b.group) {
                return a.group.localeCompare(b.group);
            }
            return a.name.localeCompare(b.name);
        }) : undefined,
        groups: orderedGroups,
        generated: new Date().toISOString(),
        generator: 'apiCAT v5.0 (powered by apiDoc)',
    };
}

/**
 * Generate a unique ID for an endpoint
 * @param item
 */
function generateEndpointId(item: any): string {
    const group = (item.group || 'general').toLowerCase();
    const name = (item.name || 'unnamed').toLowerCase();
    const method = (item.type || 'get').toLowerCase();

    return `${group}-${method}-${name}`.replace(/[^a-z0-9-]/g, '-');
}

/**
 * Detect example type from content
 * @param content
 */
function detectExampleType(content: string): 'json' | 'text' | 'curl' {
    if (!content) return 'text';

    const trimmed = content.trim();

    // Check for curl
    if (trimmed.startsWith('curl ')) {
        return 'curl';
    }

    // Check for JSON
    try {
        JSON.parse(trimmed);
        return 'json';
    } catch {
        // Not valid JSON
    }

    // Check if it looks like JSON (starts with { or [)
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        return 'json';
    }

    return 'text';
}

/**
 * Export JSON with proper formatting for apiCAT template consumption
 * @param docs
 */
export function exportApiCATDocs(docs: ApiCATDocs): string {
    return JSON.stringify(docs, null, 2);
}
