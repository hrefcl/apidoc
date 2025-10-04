/**
 * @file Content Protection System for APIDoc 5.0
 *
 * Handles encryption and decryption of API documentation content
 * to protect it from unauthorized access in static HTML files.
 */

import CryptoJS from 'crypto-js';

interface EncryptedContent {
    data: string;
    iv: string;
    salt: string;
    timestamp: number;
    version: string;
}

interface ContentSection {
    id: string;
    element: string;
    content: string;
    encrypted?: boolean;
}

class ContentProtection {
    private static readonly VERSION = '1.0';
    private static readonly CONTENT_MARKER = '<!--APIDOC_PROTECTED_CONTENT_START-->';
    private static readonly CONTENT_MARKER_END = '<!--APIDOC_PROTECTED_CONTENT_END-->';

    /**
     * Encrypt HTML content using AES-256-GCM
     */
    static encryptContent(content: string, password: string): EncryptedContent {
        // Generate random salt and IV
        const salt = CryptoJS.lib.WordArray.random(256 / 8);
        const iv = CryptoJS.lib.WordArray.random(96 / 8); // GCM recommended IV size

        // Derive key using PBKDF2
        const key = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 10000,
        });

        // Encrypt content
        const encrypted = CryptoJS.AES.encrypt(content, key, {
            iv: iv,
            mode: CryptoJS.mode.GCM,
            padding: CryptoJS.pad.NoPadding,
        });

        return {
            data: encrypted.toString(),
            iv: iv.toString(),
            salt: salt.toString(),
            timestamp: Date.now(),
            version: this.VERSION,
        };
    }

    /**
     * Decrypt HTML content using AES-256-GCM
     */
    static decryptContent(encryptedContent: EncryptedContent, password: string): string {
        try {
            // Reconstruct salt and IV
            const salt = CryptoJS.enc.Hex.parse(encryptedContent.salt);
            const iv = CryptoJS.enc.Hex.parse(encryptedContent.iv);

            // Derive key using same parameters
            const key = CryptoJS.PBKDF2(password, salt, {
                keySize: 256 / 32,
                iterations: 10000,
            });

            // Decrypt content
            const decrypted = CryptoJS.AES.decrypt(encryptedContent.data, key, {
                iv: iv,
                mode: CryptoJS.mode.GCM,
                padding: CryptoJS.pad.NoPadding,
            });

            const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

            if (!decryptedText) {
                throw new Error('Decryption failed - invalid password or corrupted data');
            }

            return decryptedText;
        } catch (error) {
            console.error('Content decryption error:', error);
            throw new Error('Failed to decrypt content. Please check your credentials.');
        }
    }

    /**
     * Extract and encrypt sensitive sections from HTML
     */
    static protectSensitiveSections(html: string, password: string): { protectedHtml: string; encryptedSections: EncryptedContent[] } {
        const sensitiveSections: ContentSection[] = [];
        let protectedHtml = html;

        // Define sensitive content selectors
        const sensitiveSelectors = [
            { id: 'sections', element: 'div' }, // API endpoints
            { id: 'header', element: 'div' }, // Custom header content
            { id: 'footer', element: 'div' }, // Custom footer content
            { id: 'project', element: 'div' }, // Project information
        ];

        // Extract content that needs protection
        sensitiveSelectors.forEach((selector) => {
            const regex = new RegExp(`<div id="${selector.id}"[^>]*>([\\s\\S]*?)</div>`, 'g');
            const matches = regex.exec(html);

            if (matches && matches[1]) {
                sensitiveSections.push({
                    id: selector.id,
                    element: selector.element,
                    content: matches[1],
                    encrypted: true,
                });

                // Replace with placeholder in HTML
                protectedHtml = protectedHtml.replace(
                    matches[0],
                    `<div id="${selector.id}" data-protected="true" style="display: none;">
            ${this.CONTENT_MARKER}
            <div class="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
              <div class="text-center">
                <div class="w-12 h-12 mx-auto mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <p class="text-sm">Protected content - authentication required</p>
              </div>
            </div>
            ${this.CONTENT_MARKER_END}
          </div>`
                );
            }
        });

        // Encrypt all sensitive sections
        const encryptedSections = sensitiveSections.map((section) => this.encryptContent(section.content, password));

        return { protectedHtml, encryptedSections };
    }

    /**
     * Restore decrypted content to protected HTML
     */
    static restoreProtectedContent(protectedHtml: string, encryptedSections: EncryptedContent[], password: string): string {
        let restoredHtml = protectedHtml;

        try {
            // Decrypt and restore each section
            encryptedSections.forEach((encryptedSection, index) => {
                const decryptedContent = this.decryptContent(encryptedSection, password);

                // Find and replace protected content markers
                const markerRegex = new RegExp(`${this.CONTENT_MARKER}[\\s\\S]*?${this.CONTENT_MARKER_END}`, 'g');

                restoredHtml = restoredHtml.replace(markerRegex, decryptedContent);
            });

            // Remove data-protected attributes and show content
            restoredHtml = restoredHtml.replace(/data-protected="true"\s+style="display:\s*none;"/g, 'style="display: block;"');

            return restoredHtml;
        } catch (error) {
            console.error('Content restoration error:', error);
            throw error;
        }
    }

    /**
     * Generate encryption key from user credentials
     */
    static generateUserKey(email: string, additionalData?: string): string {
        const keyMaterial = email + (additionalData || 'apidoc-2024');
        return CryptoJS.PBKDF2(keyMaterial, 'apidoc-content-salt', {
            keySize: 256 / 32,
            iterations: 5000,
        }).toString();
    }

    /**
     * Create encrypted content bundle for storage
     */
    static createContentBundle(sections: EncryptedContent[]): string {
        const bundle = {
            version: this.VERSION,
            timestamp: Date.now(),
            sections: sections,
            checksum: this.calculateChecksum(sections),
        };

        return btoa(JSON.stringify(bundle));
    }

    /**
     * Parse encrypted content bundle
     */
    static parseContentBundle(bundleData: string): EncryptedContent[] {
        try {
            const bundle = JSON.parse(atob(bundleData));

            // Verify version compatibility
            if (bundle.version !== this.VERSION) {
                console.warn(`Content bundle version mismatch: ${bundle.version} vs ${this.VERSION}`);
            }

            // Verify checksum
            const calculatedChecksum = this.calculateChecksum(bundle.sections);
            if (bundle.checksum !== calculatedChecksum) {
                throw new Error('Content bundle checksum verification failed');
            }

            return bundle.sections;
        } catch (error) {
            console.error('Bundle parsing error:', error);
            throw new Error('Invalid or corrupted content bundle');
        }
    }

    /**
     * Calculate checksum for integrity verification
     */
    private static calculateChecksum(sections: EncryptedContent[]): string {
        const data = sections.map((s) => s.data + s.iv + s.salt).join('');
        return CryptoJS.SHA256(data).toString();
    }

    /**
     * Progressive content loading system
     */
    static async loadProtectedContent(userKey: string): Promise<void> {
        try {
            // Check if protected content bundle exists
            const bundleScript = document.querySelector('script[data-protected-content]') as HTMLScriptElement;

            if (!bundleScript) {
                console.log('No protected content found, proceeding normally');
                return;
            }

            // Parse and decrypt content bundle
            const bundleData = bundleScript.textContent || '';
            const encryptedSections = this.parseContentBundle(bundleData);

            // Get current HTML and restore protected content
            const currentHtml = document.documentElement.outerHTML;
            const restoredHtml = this.restoreProtectedContent(currentHtml, encryptedSections, userKey);

            // Replace current document with restored content
            document.open();
            document.write(restoredHtml);
            document.close();

            console.log('Protected content successfully restored');
        } catch (error) {
            console.error('Protected content loading failed:', error);

            // Show error message to user
            this.showContentError('Failed to load protected content. Please refresh and try again.');
        }
    }

    /**
     * Show content loading error
     */
    private static showContentError(message: string): void {
        const errorHtml = `
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 text-center">
          <div class="text-red-500 mb-4">
            <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Content Loading Error</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">${message}</p>
          <button
            onclick="window.location.reload()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    `;

        const errorElement = document.createElement('div');
        errorElement.innerHTML = errorHtml;
        document.body.appendChild(errorElement);
    }

    /**
     * Initialize content protection system
     */
    static init(): void {
        console.log('Content protection system initialized');

        // Check for protected content on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.checkForProtectedContent();
            });
        } else {
            this.checkForProtectedContent();
        }
    }

    /**
     * Check if current page has protected content
     */
    private static checkForProtectedContent(): boolean {
        const protectedElements = document.querySelectorAll('[data-protected="true"]');
        return protectedElements.length > 0;
    }
}

export default ContentProtection;
export { ContentSection, EncryptedContent };
