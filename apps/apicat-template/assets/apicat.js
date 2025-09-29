/**
 * apiCAT - Enhanced APIDoc Template
 * Interactive functionality for the modern API documentation interface
 */

class ApiCat {
    constructor() {
        this.currentTheme = localStorage.getItem('apicat-theme') || 'light';
        this.currentEndpoint = null;
        this.filterMethod = 'all';
        this.searchQuery = '';

        this.init();
    }

    init() {
        this.setupTheme();
        this.setupSearch();
        this.setupFilters();
        this.setupExport();
        this.setupNavigation();
        this.setupKeyboardShortcuts();
        this.updateEndpointCount();

        console.log('🐱 apiCAT initialized with', window.API_DATA.length, 'endpoints');
    }

    // Theme Management
    setupTheme() {
        const toggle = document.getElementById('theme-toggle');
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        toggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';

        toggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            toggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            localStorage.setItem('apicat-theme', this.currentTheme);
        });
    }

    // Search Functionality
    setupSearch() {
        const search = document.getElementById('search');
        search.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterEndpoints();
        });
    }

    // Method Filters
    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterMethod = btn.dataset.method;
                this.filterEndpoints();
            });
        });
    }

    // Export to Postman
    setupExport() {
        const exportBtn = document.getElementById('export-postman');
        exportBtn.addEventListener('click', () => {
            this.exportToPostman();
        });
    }

    // Navigation
    setupNavigation() {
        this.renderNavigation();

        // Smooth scrolling for navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-group a')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search').focus();
            }

            // Escape to close modal
            if (e.key === 'Escape') {
                this.closeTryModal();
            }
        });
    }

    // Filter endpoints based on search and method filter
    filterEndpoints() {
        const endpoints = document.querySelectorAll('.endpoint');
        let visibleCount = 0;

        endpoints.forEach(endpoint => {
            const method = endpoint.dataset.method;
            const text = endpoint.textContent.toLowerCase();

            const matchesMethod = this.filterMethod === 'all' || method === this.filterMethod;
            const matchesSearch = !this.searchQuery || text.includes(this.searchQuery);
            const isVisible = matchesMethod && matchesSearch;

            endpoint.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        this.updateEndpointCount(visibleCount);
    }

    // Update endpoint count
    updateEndpointCount(count = null) {
        const counter = document.getElementById('endpoint-count');
        const total = count !== null ? count : window.API_DATA.length;
        counter.textContent = `${total} endpoint${total !== 1 ? 's' : ''}`;
    }

    // Render navigation sidebar
    renderNavigation() {
        const groups = {};
        window.API_DATA.forEach(api => {
            if (!groups[api.group]) groups[api.group] = [];
            groups[api.group].push(api);
        });

        const navigation = document.getElementById('navigation');
        navigation.innerHTML = Object.entries(groups).map(([group, apis]) => `
            <div class="nav-group">
                <h4>${group} (${apis.length})</h4>
                <ul>
                    ${apis.map(api => `
                        <li><a href="#endpoint-${api.name}">${api.title || api.name}</a></li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    }

    // Export collection to Postman format
    exportToPostman() {
        const collection = {
            info: {
                name: window.PROJECT.name,
                description: window.PROJECT.description,
                version: window.PROJECT.version,
                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            item: this.generatePostmanItems(),
            variable: [
                {
                    key: "baseUrl",
                    value: window.PROJECT.sampleUrl || window.PROJECT.url || "{{baseUrl}}",
                    type: "string"
                }
            ]
        };

        this.downloadJSON(collection, `${window.PROJECT.name}-collection.json`);

        // Show success notification
        this.showNotification('✅ Collection exported successfully!', 'success');
    }

    // Generate Postman items from API data
    generatePostmanItems() {
        const groups = {};
        window.API_DATA.forEach(api => {
            if (!groups[api.group]) groups[api.group] = [];
            groups[api.group].push(api);
        });

        return Object.entries(groups).map(([groupName, apis]) => ({
            name: groupName,
            item: apis.map(api => this.convertToPostmanItem(api))
        }));
    }

    // Convert API endpoint to Postman item format
    convertToPostmanItem(api) {
        const item = {
            name: api.title || api.name,
            request: {
                method: api.type,
                header: this.extractHeaders(api),
                url: {
                    raw: `{{baseUrl}}${api.url}`,
                    host: ["{{baseUrl}}"],
                    path: api.url.split('/').filter(Boolean)
                },
                description: api.description || ''
            }
        };

        // Add body for POST/PUT requests
        if (['POST', 'PUT', 'PATCH'].includes(api.type)) {
            const bodyParams = this.extractBodyParams(api);
            if (Object.keys(bodyParams).length > 0) {
                item.request.body = {
                    mode: 'raw',
                    raw: JSON.stringify(bodyParams, null, 2),
                    options: {
                        raw: {
                            language: 'json'
                        }
                    }
                };
            }
        }

        // Add example responses
        if (api.success || api.error) {
            item.response = [];

            if (api.success && api.success.examples) {
                api.success.examples.forEach(example => {
                    item.response.push({
                        name: example.title || 'Success Response',
                        status: 'OK',
                        code: 200,
                        body: example.content || ''
                    });
                });
            }

            if (api.error && api.error.examples) {
                api.error.examples.forEach(example => {
                    item.response.push({
                        name: example.title || 'Error Response',
                        status: 'Bad Request',
                        code: 400,
                        body: example.content || ''
                    });
                });
            }
        }

        return item;
    }

    // Extract headers from API definition
    extractHeaders(api) {
        const headers = [];
        if (api.header && api.header.fields) {
            Object.values(api.header.fields).forEach(group => {
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

        // Add default Content-Type for requests with body
        if (['POST', 'PUT', 'PATCH'].includes(api.type)) {
            const hasContentType = headers.some(h => h.key.toLowerCase() === 'content-type');
            if (!hasContentType) {
                headers.push({
                    key: 'Content-Type',
                    value: 'application/json',
                    type: 'text'
                });
            }
        }

        return headers;
    }

    // Extract body parameters
    extractBodyParams(api) {
        const bodyParams = {};
        if (api.parameter && api.parameter.fields) {
            Object.values(api.parameter.fields).forEach(group => {
                if (Array.isArray(group)) {
                    group.forEach(param => {
                        if (param.field && !param.field.includes(':')) {
                            bodyParams[param.field] = param.defaultValue || this.getDefaultValueByType(param.type);
                        }
                    });
                }
            });
        }
        return bodyParams;
    }

    // Get default value by parameter type
    getDefaultValueByType(type) {
        const typeMap = {
            'String': '',
            'Number': 0,
            'Boolean': false,
            'Array': [],
            'Object': {},
            'Date': new Date().toISOString()
        };
        return typeMap[type] || '';
    }

    // Download JSON file
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        if (type === 'success') {
            notification.style.background = 'var(--success)';
        } else if (type === 'error') {
            notification.style.background = 'var(--danger)';
        } else {
            notification.style.background = 'var(--info)';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Close try modal
    closeTryModal() {
        const modal = document.getElementById('try-modal');
        modal.classList.add('hidden');
        this.currentEndpoint = null;
    }
}

// Global functions for HTML interactions
window.toggleEndpoint = function(name) {
    const endpoint = document.getElementById(`endpoint-${name}`);
    const details = endpoint.querySelector('.endpoint-details');
    const icon = endpoint.querySelector('.toggle-icon');

    details.classList.toggle('collapsed');
    icon.style.transform = details.classList.contains('collapsed')
        ? 'rotate(-90deg)'
        : 'rotate(0deg)';
};

window.tryEndpoint = function(name) {
    const api = window.API_DATA.find(a => a.name === name);
    if (!api) return;

    window.apiCat.currentEndpoint = api;

    const modal = document.getElementById('try-modal');
    modal.classList.remove('hidden');

    // Update modal content
    document.getElementById('method-display').textContent = api.type;
    document.getElementById('method-display').className = `method method-${api.type}`;
    document.getElementById('url-display').textContent = api.url;

    // Setup parameters if any
    const paramsSection = document.getElementById('params-section');
    const paramsInputs = document.getElementById('params-inputs');

    if (api.parameter && api.parameter.fields && api.parameter.fields.Parameter) {
        paramsSection.classList.remove('hidden');
        paramsInputs.innerHTML = api.parameter.fields.Parameter.map(param => `
            <div class="form-group">
                <label for="param-${param.field}">
                    ${param.field}
                    <span class="param-type">(${param.type})</span>
                    ${!param.optional ? '<span class="required">*</span>' : ''}
                </label>
                <input
                    type="text"
                    id="param-${param.field}"
                    name="${param.field}"
                    placeholder="${param.description || ''}"
                    ${!param.optional ? 'required' : ''}
                    value="${param.defaultValue || ''}"
                >
            </div>
        `).join('');
    } else {
        paramsSection.classList.add('hidden');
    }

    // Setup form submission
    document.getElementById('try-form').onsubmit = (e) => {
        e.preventDefault();
        window.apiCat.executeRequest(api);
    };
};

window.closeTryModal = function() {
    window.apiCat.closeTryModal();
};

window.clearResponse = function() {
    const responseSection = document.getElementById('response-section');
    responseSection.classList.add('hidden');
    document.getElementById('response-body').innerHTML = '';
};

// Execute API request
ApiCat.prototype.executeRequest = function(api) {
    const baseUrl = document.getElementById('base-url').value.replace(/\/$/, '');
    const startTime = Date.now();

    let url = api.url;
    const formData = new FormData(document.getElementById('try-form'));

    // Replace URL parameters
    const urlParams = url.match(/:(\w+)/g);
    if (urlParams) {
        urlParams.forEach(param => {
            const paramName = param.substring(1);
            const paramValue = formData.get(paramName);
            if (paramValue) {
                url = url.replace(param, paramValue);
            }
        });
    }

    const fullUrl = baseUrl + url;

    // Prepare request options
    const options = {
        method: api.type,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Add body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(api.type)) {
        const bodyData = {};
        for (let [key, value] of formData.entries()) {
            if (!api.url.includes(`:${key}`)) { // Not a URL parameter
                bodyData[key] = value;
            }
        }
        options.body = JSON.stringify(bodyData);
    }

    // Show loading state
    const responseSection = document.getElementById('response-section');
    responseSection.classList.remove('hidden');
    document.getElementById('response-body').innerHTML = '<code>Loading...</code>';

    // Execute request
    fetch(fullUrl, options)
        .then(async response => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const contentType = response.headers.get('content-type');
            let responseData;

            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            // Update response display
            document.getElementById('response-status').textContent =
                `${response.status} ${response.statusText}`;
            document.getElementById('response-status').className =
                response.ok ? 'status-success' : 'status-error';
            document.getElementById('response-time').textContent = `${responseTime}ms`;

            const formattedResponse = typeof responseData === 'object'
                ? JSON.stringify(responseData, null, 2)
                : responseData;

            document.getElementById('response-body').innerHTML =
                `<code>${this.escapeHtml(formattedResponse)}</code>`;

            // Show success notification
            this.showNotification(
                `✅ Request completed in ${responseTime}ms`,
                response.ok ? 'success' : 'error'
            );
        })
        .catch(error => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            document.getElementById('response-status').textContent = 'Network Error';
            document.getElementById('response-status').className = 'status-error';
            document.getElementById('response-time').textContent = `${responseTime}ms`;
            document.getElementById('response-body').innerHTML =
                `<code>Error: ${this.escapeHtml(error.message)}</code>`;

            this.showNotification('❌ Request failed: ' + error.message, 'error');
        });
};

// HTML escape utility
ApiCat.prototype.escapeHtml = function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Initialize apiCAT when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.apiCat = new ApiCat();
    });
} else {
    window.apiCat = new ApiCat();
}