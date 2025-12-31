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
    headerExamples?: ApiCATExample[]; // Examples for headers (@apiHeaderExample)
    success?: ApiCATResponse;
    error?: ApiCATResponse;
    examples?: ApiCATExample[];
    version?: string;
    lang?: string; // ISO 639-1 language code from @apiLang tag (e.g., "es", "en", "zh")
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
    type: string; // Language type for syntax highlighting (e.g., 'javascript', 'bash', 'python', 'json', 'curl', etc.)
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
    iot?: ApiCATIoTElement[]; // IoT code documentation
    code?: ApiCATCodeElement[]; // Generic code documentation
    groups: string[];
    generated: string;
    generator: string;
}

/**
 * IoT Element interface for embedded/firmware code documentation
 */
export interface ApiCATIoTElement {
    id: string;
    group: string;
    name: string;
    title: string;
    type: string; // function, struct, enum, macro, typedef, callback, isr, define, const
    description: string;
    version?: string;
    platforms?: string[]; // ESP32, Arduino, STM32, etc.
    parameters?: ApiCATParameter[];
    returns?: {
        type: string;
        description: string;
    }[];
    errors?: {
        type: string;
        field: string;
        description: string;
        group?: string;
    }[];
    examples?: ApiCATExample[];
    since?: string;
    deprecated?: {
        deprecated: boolean;
        message: string;
    };
    see?: string[];
    filename?: string;
}

/**
 * Code Element interface for generic programming language documentation
 * Supports: Kotlin, Swift, Java, Python, Go, Rust, C#, etc.
 */
export interface ApiCATCodeElement {
    id: string;
    group: string;
    name: string;
    title: string;
    type: string; // function, class, method, interface, protocol, struct, enum, extension, property, constant, module
    lang?: string; // kotlin, swift, java, python, go, rust, csharp, etc.
    description: string;
    version?: string;
    platforms?: string[]; // Android, iOS, Web, Server, etc.
    signature?: string; // Full method/function signature
    access?: string; // public, private, protected, internal
    isStatic?: boolean;
    isAsync?: boolean;
    generics?: {
        name: string;
        constraint?: string;
        description: string;
    }[];
    annotations?: string[]; // @Composable, @MainActor, @Override, etc.
    parameters?: ApiCATParameter[];
    returns?: {
        type: string;
        description: string;
    };
    throws?: {
        type: string;
        description: string;
    }[];
    examples?: ApiCATExample[];
    since?: string;
    deprecated?: {
        deprecated: boolean;
        message: string;
    };
    see?: {
        reference: string;
        description: string;
    }[];
    filename?: string;
}

/**
 * Transform apiDoc data to apiCAT format
 * @param apiDocData
 * @param projectInfo
 */
export function transformToApiCAT(apiDocData: any, projectInfo: any): ApiCATDocs {
    const endpoints: ApiCATEndpoint[] = [];
    const models: any[] = [];
    const iotElements: ApiCATIoTElement[] = [];
    const codeElements: ApiCATCodeElement[] = [];
    const groups = new Set<string>();

    // Map to group endpoints by ID (for multi-language and multi-version support)
    const endpointMap = new Map<string, ApiCATEndpoint[]>();

    // Process each endpoint, model, IoT element, or code element
    if (Array.isArray(apiDocData)) {
        apiDocData.forEach((item: any) => {
            // Check if this is an IoT element (has @iot tag)
            // Check both item.local.type and item.type (worker may have moved data)
            const iotType = item.local?.type || item.type;
            if (iotType && isIoTType(iotType)) {
                const iotElement = transformIoTElement(item);
                iotElements.push(iotElement);
                // Note: IoT groups are separate from API groups, don't add to groups set
                return; // Skip adding to endpoints
            }

            // Check if this is a Code element (has @code tag with type and lang)
            const codeInfo = item.local?.code || item.code;
            if (codeInfo && (codeInfo.type || codeInfo.lang)) {
                const codeElement = transformCodeElement(item);
                codeElements.push(codeElement);
                // Note: Code groups are separate from API groups
                return; // Skip adding to endpoints
            }

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
                lang: item.lang, // ISO 639-1 language code from @apiLang
                filename: item.filename || '',
            };

            // Add group to set
            groups.add(endpoint.group);

            // Transform parameters - check all parameter field groups (Parameter, Body, Query, etc.)
            const allParams: any[] = [];

            // Process parameters from item.parameter.fields (e.g., @apiParam)
            if (item.parameter?.fields) {
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
            }

            // Process query parameters from item.query (e.g., @apiQuery)
            // Note: @apiQuery stores data directly in item.query as an array, not in item.parameter.fields
            const itemQuery = (item as any).query;
            if (Array.isArray(itemQuery) && itemQuery.length > 0) {
                itemQuery.forEach((param: any) => {
                    allParams.push({
                        field: param.field,
                        type: param.type || 'String',
                        required: !param.optional,
                        description: param.description || '',
                        defaultValue: param.defaultValue,
                        group: param.group || 'Query', // Use param.group or default to 'Query'
                    });
                });
            }

            if (allParams.length > 0) {
                endpoint.parameters = allParams;
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

            // Transform header examples (from @apiHeaderExample or @apiSchema {json=...} apiHeaderExample)
            if (item.header?.examples || item.local?.header?.examples) {
                const headerExamples = item.header?.examples || item.local?.header?.examples || [];

                if (headerExamples.length > 0) {
                    // Store header examples in the header field or create a separate field
                    // For now, we'll add them to endpoint.headerExamples
                    endpoint.headerExamples = headerExamples.map((example: any) => ({
                        title: example.title || 'Header Example',
                        content: example.content || '',
                        type: example.type || 'json',
                    }));
                }
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
                            type: example.type || 'json',
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
                            type: example.type || 'json',
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
                    // Use example.type if provided (e.g., from @apiCode), otherwise detect from content
                    type: example.type || detectExampleType(example.content),
                }));
            }

            // Group endpoints by ID (base ID without lang/version suffix)
            const baseId = endpoint.id;
            if (!endpointMap.has(baseId)) {
                endpointMap.set(baseId, []);
            }
            endpointMap.get(baseId)!.push(endpoint);
        });
    }

    // Now merge multi-language and multi-version endpoints
    endpointMap.forEach((variants, baseId) => {
        if (variants.length === 1) {
            // Single variant - just push as is
            endpoints.push(variants[0]);
        } else {
            // Multiple variants - group by version first, then collect languages
            const groupedByVersion = new Map<string, ApiCATEndpoint[]>();

            variants.forEach(variant => {
                const version = variant.version || '1.0.0';
                if (!groupedByVersion.has(version)) {
                    groupedByVersion.set(version, []);
                }
                groupedByVersion.get(version)!.push(variant);
            });

            // Sort versions in descending order to get latest first
            const sortedVersions = Array.from(groupedByVersion.keys()).sort((a, b) => {
                return b.localeCompare(a);
            });

            // Get the latest version's language variants
            const latestVersion = sortedVersions[0];
            const latestVersionVariants = groupedByVersion.get(latestVersion)!;

            // Use the first language variant as the base endpoint
            const baseEndpoint = latestVersionVariants[0];

            // Create languages object with all language variants for the latest version
            const languages: Record<string, any> = {};
            latestVersionVariants.forEach(variant => {
                const lang = variant.lang || 'en';
                languages[lang] = {
                    title: variant.title,
                    description: variant.description,
                    parameters: variant.parameters,
                    success: variant.success,
                    error: variant.error,
                };
            });

            // Add languages to the base endpoint (used by getLocalizedEndpoint() in frontend)
            (baseEndpoint as any).languages = languages;

            // Always create versions array (needed for VersionSelector even with single version)
            const versionsArray = sortedVersions.map((version, index) => {
                const versionVariants = groupedByVersion.get(version)!;
                const versionBase = versionVariants[0];

                // Create translations for this version
                const versionTranslations: Record<string, any> = {};
                versionVariants.forEach(v => {
                    const lang = v.lang || 'en';
                    versionTranslations[lang] = {
                        title: v.title,
                        description: v.description,
                        parameters: v.parameters,
                        success: v.success,
                        error: v.error,
                    };
                });

                return {
                    version: version,
                    title: versionBase.title,
                    name: versionBase.name,
                    description: versionBase.description,
                    filename: versionBase.filename,
                    url: versionBase.url,
                    method: versionBase.method,
                    isLatest: index === 0,
                    parameters: versionBase.parameters,
                    success: versionBase.success,
                    error: versionBase.error,
                    languages: versionTranslations, // VersionSelector.vue expects 'languages' not 'translations'
                };
            });

            (baseEndpoint as any).versions = versionsArray;
            (baseEndpoint as any).latestVersion = latestVersion;
            (baseEndpoint as any).versionCount = sortedVersions.length;
            (baseEndpoint as any).hasMultipleVersions = sortedVersions.length > 1;

            endpoints.push(baseEndpoint);
        }
    });

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
        const remainingGroups = groupsArray.filter((g) => !projectInfo.order.includes(g)).sort();

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
        models:
            models.length > 0
                ? models.sort((a, b) => {
                      // Sort models by group first, then by name
                      if (a.group !== b.group) {
                          return a.group.localeCompare(b.group);
                      }
                      return a.name.localeCompare(b.name);
                  })
                : undefined,
        iot:
            iotElements.length > 0
                ? iotElements.sort((a, b) => {
                      // Sort IoT elements by group first, then by name
                      if (a.group !== b.group) {
                          return a.group.localeCompare(b.group);
                      }
                      return a.name.localeCompare(b.name);
                  })
                : undefined,
        code:
            codeElements.length > 0
                ? codeElements.sort((a, b) => {
                      // Sort Code elements by lang first, then by group, then by name
                      if (a.lang !== b.lang) {
                          return (a.lang || '').localeCompare(b.lang || '');
                      }
                      if (a.group !== b.group) {
                          return a.group.localeCompare(b.group);
                      }
                      return a.name.localeCompare(b.name);
                  })
                : undefined,
        groups: orderedGroups,
        generated: new Date().toISOString(),
        generator: 'apiCAT v5.0 (powered by apiDoc)',
    };
}

/**
 * Check if a type is an IoT element type
 */
function isIoTType(type: string): boolean {
    const iotTypes = ['function', 'struct', 'enum', 'macro', 'typedef', 'callback', 'isr', 'define', 'const', 'variable', 'class'];
    return iotTypes.includes(type);
}

/**
 * Transform an IoT item to ApiCATIoTElement format
 */
function transformIoTElement(item: any): ApiCATIoTElement {
    const local = item.local || {};

    // Extract version (may be string or object {version: "..."})
    let versionValue = '1.0.0';
    if (local.version) {
        versionValue = typeof local.version === 'object' ? local.version.version : local.version;
    } else if (item.version) {
        versionValue = typeof item.version === 'object' ? item.version.version : item.version;
    }

    const element: ApiCATIoTElement = {
        id: generateIoTId(item),
        group: local.group || item.group || 'General',
        name: local.name || item.name || '',
        title: local.title || item.title || local.name || item.name || '',
        type: local.type || item.type || 'function',
        description: local.description || item.description || '',
        version: versionValue,
        filename: item.filename || '',
    };

    // Add platforms if present
    if (local.platforms) {
        element.platforms = local.platforms;
    }

    // Transform parameters from @iotParam
    if (item.parameter?.fields) {
        const allParams: ApiCATParameter[] = [];
        Object.keys(item.parameter.fields).forEach((groupName) => {
            const groupParams = item.parameter.fields[groupName];
            if (Array.isArray(groupParams)) {
                groupParams.forEach((param: any) => {
                    allParams.push({
                        field: param.field,
                        type: param.type || 'int',
                        required: !param.optional,
                        description: param.description || '',
                        defaultValue: param.defaultValue,
                        group: groupName,
                    });
                });
            }
        });
        if (allParams.length > 0) {
            element.parameters = allParams;
        }
    }

    // Transform return values from @iotReturn
    if (item.return?.fields) {
        const returns: { type: string; description: string }[] = [];
        Object.keys(item.return.fields).forEach((groupName) => {
            const groupReturns = item.return.fields[groupName];
            if (Array.isArray(groupReturns)) {
                groupReturns.forEach((ret: any) => {
                    returns.push({
                        type: ret.type || 'void',
                        description: ret.description || '',
                    });
                });
            }
        });
        if (returns.length > 0) {
            element.returns = returns;
        }
    }

    // Transform errors from @iotError
    if (item.error?.fields) {
        const errors: { type: string; field: string; description: string; group?: string }[] = [];
        Object.keys(item.error.fields).forEach((groupName) => {
            const groupErrors = item.error.fields[groupName];
            if (Array.isArray(groupErrors)) {
                groupErrors.forEach((err: any) => {
                    errors.push({
                        type: err.type || '',
                        field: err.field || '',
                        description: err.description || '',
                        group: groupName,
                    });
                });
            }
        });
        if (errors.length > 0) {
            element.errors = errors;
        }
    }

    // Transform examples from @iotExample
    if (local.examples && Array.isArray(local.examples)) {
        element.examples = local.examples.map((example: any) => ({
            title: example.title || 'Example',
            content: example.content || '',
            type: example.type || 'c',
        }));
    }

    // Add since version
    if (local.since) {
        element.since = local.since;
    }

    // Add deprecation info
    if (local.deprecated !== undefined) {
        element.deprecated = {
            deprecated: true,
            message: local.message || '',
        };
    }

    // Add see references
    if (local.see && Array.isArray(local.see)) {
        element.see = local.see.map((ref: any) => ref.reference || ref);
    }

    return element;
}

/**
 * Generate a unique ID for an IoT element
 */
function generateIoTId(item: any): string {
    const local = item.local || {};
    const group = (local.group || item.group || 'general').toLowerCase();
    const name = (local.name || item.name || 'unnamed').toLowerCase();
    const type = (local.type || item.type || 'function').toLowerCase();

    return `iot-${group}-${type}-${name}`.replace(/[^a-z0-9-]/g, '-');
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
function detectExampleType(content: string): string {
    if (!content) return 'text';

    const trimmed = content.trim();

    // Check for curl
    if (trimmed.startsWith('curl ')) {
        return 'curl';
    }

    // Check for bash/shell commands
    if (trimmed.startsWith('#!/bin/bash') || trimmed.startsWith('#!/bin/sh')) {
        return 'bash';
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
 * Transform a Code item to ApiCATCodeElement format
 */
function transformCodeElement(item: any): ApiCATCodeElement {
    const local = item.local || {};
    const codeInfo = local.code || item.code || {};

    // Extract version (may be string or object {version: "..."})
    let versionValue = '1.0.0';
    if (local.version) {
        versionValue = typeof local.version === 'object' ? local.version.version : local.version;
    } else if (codeInfo.version) {
        versionValue = typeof codeInfo.version === 'object' ? codeInfo.version.version : codeInfo.version;
    } else if (item.version) {
        versionValue = typeof item.version === 'object' ? item.version.version : item.version;
    }

    // Extract lang - check item.lang first (where parser stores it), then local, then codeInfo
    const langValue = item.lang || local.lang?.lang || local.lang || local.codeLang?.lang || local.codeLang || codeInfo.lang || '';

    const element: ApiCATCodeElement = {
        id: generateCodeId(item),
        group: local.group || codeInfo.group || item.group || 'General',
        name: local.name || codeInfo.name || item.name || '',
        title: local.title || codeInfo.name || item.title || local.name || item.name || '',
        type: codeInfo.type || local.type || 'function',
        lang: langValue,
        description: local.description || codeInfo.description || item.description || '',
        version: versionValue,
        filename: item.filename || local.filename || '',
    };

    // Add platforms if present
    if (local.platforms && Array.isArray(local.platforms)) {
        element.platforms = local.platforms;
    }

    // Add signature if present
    if (local.signature) {
        element.signature = local.signature;
    }

    // Add access modifier if present
    if (local.access) {
        element.access = local.access;
    }

    // Add static flag if present
    if (local.static !== undefined) {
        element.isStatic = local.static;
    }

    // Add async flag if present
    if (local.async !== undefined) {
        element.isAsync = local.async;
    }

    // Add generics if present
    if (local.generics && Array.isArray(local.generics)) {
        element.generics = local.generics;
    }

    // Add annotations if present
    if (local.annotations && Array.isArray(local.annotations)) {
        element.annotations = local.annotations.map((a: any) => a.annotation || a);
    }

    // Transform parameters from @codeParam
    if (item.parameter?.fields) {
        const allParams: ApiCATParameter[] = [];
        Object.keys(item.parameter.fields).forEach((groupName) => {
            const groupParams = item.parameter.fields[groupName];
            if (Array.isArray(groupParams)) {
                groupParams.forEach((param: any) => {
                    allParams.push({
                        field: param.field,
                        type: param.type || 'any',
                        required: !param.optional,
                        description: param.description || '',
                        defaultValue: param.defaultValue,
                        group: groupName,
                    });
                });
            }
        });
        if (allParams.length > 0) {
            element.parameters = allParams;
        }
    }

    // Transform return value from @codeReturn
    if (local.returns) {
        element.returns = {
            type: local.returns.type || 'void',
            description: local.returns.description || '',
        };
    }

    // Transform throws from @codeThrows
    if (local.throws && Array.isArray(local.throws)) {
        element.throws = local.throws.map((t: any) => ({
            type: t.type || 'Error',
            description: t.description || '',
        }));
    }

    // Transform examples from @codeExample
    if (local.examples && Array.isArray(local.examples)) {
        element.examples = local.examples.map((example: any) => ({
            title: example.title || 'Example',
            content: example.code || example.content || '',
            type: element.lang || 'text',
        }));
    }

    // Add since version
    if (local.since) {
        element.since = local.since;
    }

    // Add deprecation info
    if (local.deprecated !== undefined) {
        element.deprecated = {
            deprecated: true,
            message: local.message || local.deprecated?.message || '',
        };
    }

    // Add see references
    if (local.see && Array.isArray(local.see)) {
        element.see = local.see.map((ref: any) => ({
            reference: ref.reference || ref,
            description: ref.description || '',
        }));
    }

    return element;
}

/**
 * Generate a unique ID for a Code element
 */
function generateCodeId(item: any): string {
    const local = item.local || {};
    const codeInfo = local.code || item.code || {};
    const lang = (local.lang || codeInfo.lang || 'code').toLowerCase();
    const group = (local.group || codeInfo.group || item.group || 'general').toLowerCase();
    const name = (local.name || codeInfo.name || item.name || 'unnamed').toLowerCase();
    const type = (codeInfo.type || local.type || 'function').toLowerCase();

    return `code-${lang}-${group}-${type}-${name}`.replace(/[^a-z0-9-]/g, '-');
}

/**
 * Export JSON with proper formatting for apiCAT template consumption
 * @param docs
 */
export function exportApiCATDocs(docs: ApiCATDocs): string {
    return JSON.stringify(docs, null, 2);
}
