/**
 * @file Authentication Processor for APIDoc 4.0
 *
 * Handles authentication configuration processing and content protection
 * during the documentation generation process.
 */

const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

interface LoginConfig {
    active: boolean;
    admited?: Array<{ email: string; password: string }>;
    urlAuth?: string;
    value_form?: { email: string; password: string };
    response_success?: number;
    response_error?: number;
}

interface EncryptedSection {
    id: string;
    name: string;
    data: string;
    iv: string;
    salt: string;
    timestamp: number;
    version: string;
}

/**
 * Authentication configuration processor
 */
class AuthProcessor {
    private config: LoginConfig | null = null;
    private encryptionKey: string | null = null;

    /**
     * Initialize processor with login configuration
     */
    init(loginConfig: LoginConfig): void {
        this.config = loginConfig;

        if (this.isAuthEnabled) {
            console.log('🔐 Authentication enabled for API documentation');

            // Generate master encryption key for content protection
            this.encryptionKey = this.generateMasterKey();
        }
    }

    /**
     * Process HTML template and apply authentication
     */
    processTemplate(templateContent: string, projectData: any): string {
        let processedContent = templateContent;

        // Inject login configuration
        processedContent = this.injectLoginConfig(processedContent, projectData);

        // If authentication is enabled, protect sensitive content
        if (this.isAuthEnabled) {
            processedContent = this.protectSensitiveContent(processedContent);
        }

        return processedContent;
    }

    /**
     * Inject login configuration into template
     */
    injectLoginConfig(templateContent: string, projectData: any): string {
        const loginConfigJson = this.sanitizeLoginConfig();

        // Replace configuration placeholder
        return templateContent.replace('__LOGIN_CONFIG__', JSON.stringify(loginConfigJson, null, 2));
    }

    /**
     * Sanitize login configuration for client-side use
     */
    sanitizeLoginConfig(): any {
        if (!this.config) {
            return null;
        }

        // Create client-safe configuration
        const clientConfig: any = {
            active: this.config.active || false,
        };

        // Add local authentication (hashed passwords for security)
        if (this.config.admited && Array.isArray(this.config.admited)) {
            clientConfig.admited = this.config.admited.map((user) => ({
                email: user.email,
                // Hash password for client-side storage (still not completely secure, but better)
                passwordHash: this.hashPassword(user.password, user.email),
            }));
        }

        // Add remote authentication configuration
        if (this.config.urlAuth) {
            clientConfig.urlAuth = this.config.urlAuth;
            clientConfig.value_form = this.config.value_form || { email: 'email', password: 'password' };
            clientConfig.response_success = this.config.response_success || 200;
            clientConfig.response_error = this.config.response_error || 400;
        }

        return clientConfig;
    }

    /**
     * Hash password for client-side verification (basic protection)
     */
    hashPassword(password: string, salt: string): string {
        return CryptoJS.SHA256(password + salt + 'apidoc-salt').toString();
    }

    /**
     * Generate master encryption key
     */
    generateMasterKey(): string {
        // In production, this should be derived from environment variables or secure configuration
        const keyMaterial = 'apidoc-master-key-' + Date.now();
        return CryptoJS.SHA256(keyMaterial).toString();
    }

    /**
     * Protect sensitive content in HTML
     */
    protectSensitiveContent(htmlContent: string): string {
        if (!this.isAuthEnabled || !this.encryptionKey) {
            return htmlContent;
        }

        console.log('🔒 Protecting sensitive content...');

        // Define content sections that need protection
        const protectedSections = [
            { id: 'sections', name: 'API Endpoints' },
            { id: 'header', name: 'Header Content' },
            { id: 'footer', name: 'Footer Content' },
            { id: 'project', name: 'Project Information' },
        ];

        let protectedHtml = htmlContent;
        const encryptedSections = [];

        // Encrypt each protected section
        protectedSections.forEach((section) => {
            const sectionRegex = new RegExp(`<div id="${section.id}"[^>]*>([\\s\\S]*?)</div>`, 'g');

            protectedHtml = protectedHtml.replace(sectionRegex, (match, content) => {
                if (content && content.trim()) {
                    // Encrypt the section content
                    const encrypted = this.encryptContent(content);
                    encryptedSections.push({
                        id: section.id,
                        name: section.name,
                        ...encrypted,
                    });

                    // Replace with protected placeholder
                    return this.createProtectedPlaceholder(section.id, section.name);
                }
                return match;
            });
        });

        // Inject encrypted content bundle
        if (encryptedSections.length > 0) {
            const contentBundle = this.createContentBundle(encryptedSections);
            protectedHtml = this.injectContentBundle(protectedHtml, contentBundle);
        }

        return protectedHtml;
    }

    /**
     * Encrypt content using CryptoJS AES-256
     */
    encryptContent(content: string): any {
        // Generate random values
        const salt = CryptoJS.lib.WordArray.random(256 / 8);
        const iv = CryptoJS.lib.WordArray.random(128 / 8);

        // Derive key from master key
        const key = CryptoJS.PBKDF2(this.encryptionKey, salt, {
            keySize: 256 / 32,
            iterations: 10000,
        });

        // Encrypt content
        const encrypted = CryptoJS.AES.encrypt(content, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return {
            data: encrypted.toString(),
            iv: iv.toString(),
            salt: salt.toString(),
            timestamp: Date.now(),
            version: '1.0',
        };
    }

    /**
     * Create protected content placeholder
     */
    createProtectedPlaceholder(sectionId, sectionName) {
        return `<div id="${sectionId}" data-protected="true" style="display: none;">
      <!--APIDOC_PROTECTED_CONTENT_START-->
      <div class="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Protected Content</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            ${sectionName} requires authentication to view
          </p>
        </div>
      </div>
      <!--APIDOC_PROTECTED_CONTENT_END-->
    </div>`;
    }

    /**
     * Create encrypted content bundle
     */
    createContentBundle(encryptedSections) {
        const bundle = {
            version: '1.0',
            timestamp: Date.now(),
            sections: encryptedSections,
            checksum: this.calculateChecksum(encryptedSections),
        };

        return Buffer.from(JSON.stringify(bundle)).toString('base64');
    }

    /**
     * Calculate checksum for integrity verification
     */
    calculateChecksum(sections) {
        const data = sections.map((s) => s.data + s.iv + s.salt).join('');
        return CryptoJS.SHA256(data).toString();
    }

    /**
     * Inject content bundle into HTML
     */
    injectContentBundle(htmlContent, contentBundle) {
        const bundleScript = `
<script data-protected-content="true" type="application/encrypted">
${contentBundle}
</script>`;

        return htmlContent.replace('<!--PROTECTED_CONTENT_INJECTION_POINT-->', bundleScript);
    }

    /**
     * Validate login configuration
     */
    static validateConfig(loginConfig) {
        if (!loginConfig) return { valid: false, errors: [] };

        const errors = [];

        if (typeof loginConfig.active !== 'boolean') {
            errors.push('login.active must be a boolean');
        }

        if (loginConfig.active) {
            // Validate local authentication
            if (loginConfig.admited) {
                if (!Array.isArray(loginConfig.admited)) {
                    errors.push('login.admited must be an array');
                } else {
                    loginConfig.admited.forEach((user, index) => {
                        if (!user.email || !user.password) {
                            errors.push(`login.admited[${index}] must have email and password`);
                        }
                        if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
                            errors.push(`login.admited[${index}].email must be a valid email`);
                        }
                    });
                }
            }

            // Validate remote authentication
            if (loginConfig.urlAuth) {
                try {
                    new URL(loginConfig.urlAuth);
                } catch (e) {
                    errors.push('login.urlAuth must be a valid URL');
                }

                if (!loginConfig.value_form || !loginConfig.value_form.email || !loginConfig.value_form.password) {
                    errors.push('login.value_form must specify email and password field names');
                }
            }

            // Must have at least one authentication method
            if (!loginConfig.admited && !loginConfig.urlAuth) {
                errors.push('At least one authentication method must be configured (admited or urlAuth)');
            }
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    /**
     * Check if authentication is enabled
     */
    get isAuthEnabled(): boolean {
        return this.config?.active === true;
    }

    /**
     * Get processor statistics
     */
    getStats() {
        return {
            authEnabled: this.isAuthEnabled,
            hasLocalAuth: !!(this.config && this.config.admited),
            hasRemoteAuth: !!(this.config && this.config.urlAuth),
            localUserCount: this.config && this.config.admited ? this.config.admited.length : 0,
        };
    }
}

module.exports = AuthProcessor;
