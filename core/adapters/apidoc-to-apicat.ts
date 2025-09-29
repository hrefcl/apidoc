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
}

export interface ApiCATDocs {
    project: ApiCATProject;
    endpoints: ApiCATEndpoint[];
    groups: string[];
    generated: string;
    generator: string;
}

/**
 * Transform apiDoc data to apiCAT format
 */
export function transformToApiCAT(apiDocData: any, projectInfo: any): ApiCATDocs {
    const endpoints: ApiCATEndpoint[] = [];
    const groups = new Set<string>();

    // Process each endpoint
    if (Array.isArray(apiDocData)) {
        apiDocData.forEach((item: any) => {
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

            // Transform parameters
            if (item.parameter?.fields?.Parameter) {
                endpoint.parameters = item.parameter.fields.Parameter.map((param: any) => ({
                    field: param.field,
                    type: param.type || 'String',
                    required: !param.optional,
                    description: param.description || '',
                    defaultValue: param.defaultValue,
                }));
            }

            // Transform success response
            if (item.success) {
                endpoint.success = {
                    type: 'success',
                    statusCode: '200',
                    description: item.success.description || '',
                    examples: item.success.examples?.map((example: any) => ({
                        title: example.title || 'Success Example',
                        content: example.content || '',
                        type: 'json' as const,
                    })),
                };
            }

            // Transform error response
            if (item.error) {
                endpoint.error = {
                    type: 'error',
                    statusCode: item.error.statusCode || '400',
                    description: item.error.description || '',
                    examples: item.error.examples?.map((example: any) => ({
                        title: example.title || 'Error Example',
                        content: example.content || '',
                        type: 'json' as const,
                    })),
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
    };

    return {
        project,
        endpoints: endpoints.sort((a, b) => {
            // Sort by group first, then by name
            if (a.group !== b.group) {
                return a.group.localeCompare(b.group);
            }
            return a.name.localeCompare(b.name);
        }),
        groups: Array.from(groups).sort(),
        generated: new Date().toISOString(),
        generator: 'apiCAT v5.0 (powered by apiDoc)',
    };
}

/**
 * Generate a unique ID for an endpoint
 */
function generateEndpointId(item: any): string {
    const group = (item.group || 'general').toLowerCase();
    const name = (item.name || 'unnamed').toLowerCase();
    const method = (item.type || 'get').toLowerCase();

    return `${group}-${method}-${name}`.replace(/[^a-z0-9-]/g, '-');
}

/**
 * Detect example type from content
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
 */
export function exportApiCATDocs(docs: ApiCATDocs): string {
    return JSON.stringify(docs, null, 2);
}
