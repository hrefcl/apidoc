/**
 * @file Authentication System for APIDoc 4.0
 *
 * Provides secure login functionality with:
 * - Local authentication (preconfigured users)
 * - Remote authentication (API-based)
 * - Content encryption/decryption
 * - Session management with JWT
 */

import CryptoJS from 'crypto-js';

interface LoginConfig {
    active: boolean;
    admited?: Array<{ email: string; passwordHash?: string; password?: string }>;
    urlAuth?: string;
    value_form?: { email: string; password: string };
    response_success?: number;
    response_error?: number;
}

interface AuthSession {
    email: string;
    authenticated: boolean;
    expires: number;
    method: 'local' | 'remote';
}

class AuthManager {
    private config: LoginConfig | null = null;
    private session: AuthSession | null = null;
    private encryptionKey: string = '';

    /**
     * Initialize authentication system with config from apidoc.json
     */
    init(loginConfig: LoginConfig): void {
        this.config = loginConfig;
        this.loadSession();

        if (this.isLoginRequired()) {
            this.checkAuthentication();
        }
    }

    /**
     * Check if login is required based on config
     */
    isLoginRequired(): boolean {
        return this.config?.active === true;
    }

    /**
     * Check current authentication status
     */
    isAuthenticated(): boolean {
        if (!this.session) return false;
        if (Date.now() > this.session.expires) {
            this.logout();
            return false;
        }
        return this.session.authenticated;
    }

    /**
     * Attempt login with provided credentials
     */
    async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
        try {
            let localResult = { success: false, message: '' };
            let remoteResult = { success: false, message: '' };

            // Try local authentication if configured
            if (this.config?.admited) {
                localResult = this.authenticateLocal(email, password);
                if (localResult.success) {
                    await this.createSession(email, 'local');
                    return localResult;
                }
            }

            // Try remote authentication if configured
            if (this.config?.urlAuth) {
                remoteResult = await this.authenticateRemote(email, password);
                if (remoteResult.success) {
                    await this.createSession(email, 'remote');
                    return remoteResult;
                }
            }

            // If both methods are configured but both failed, provide appropriate error message
            if (this.config?.admited && this.config?.urlAuth) {
                return { success: false, message: 'Invalid credentials (checked both local and remote)' };
            } else if (this.config?.admited) {
                return { success: false, message: localResult.message || 'Invalid local credentials' };
            } else if (this.config?.urlAuth) {
                return { success: false, message: remoteResult.message || 'Invalid remote credentials' };
            }

            return { success: false, message: 'No authentication method configured' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Authentication failed' };
        }
    }

    /**
     * Authenticate against local user list
     */
    private authenticateLocal(email: string, password: string): { success: boolean; message: string } {
        const users = this.config?.admited || [];

        const user = users.find((u) => {
            if (u.email !== email) return false;

            // Check if we have a hashed password (from server-side processing)
            if (u.passwordHash) {
                const expectedHash = this.hashPassword(password, email);
                return u.passwordHash === expectedHash;
            }

            // Fallback to plain text comparison (for backward compatibility)
            if (u.password) {
                return u.password === password;
            }

            return false;
        });

        if (user) {
            return { success: true, message: 'Local authentication successful' };
        }

        return { success: false, message: 'Invalid local credentials' };
    }

    /**
     * Hash password for client-side verification (matching server-side logic)
     */
    private hashPassword(password: string, salt: string): string {
        return CryptoJS.SHA256(password + salt + 'apidoc-salt').toString();
    }

    /**
     * Authenticate against remote API
     */
    private async authenticateRemote(email: string, password: string): Promise<{ success: boolean; message: string }> {
        const urlAuth = this.config?.urlAuth;
        const valueForm = this.config?.value_form;
        const successCode = this.config?.response_success || 200;
        const errorCode = this.config?.response_error || 400;

        if (!urlAuth || !valueForm) {
            return { success: false, message: 'Remote authentication not properly configured' };
        }

        try {
            const formData = new FormData();
            formData.append(valueForm.email, email);
            formData.append(valueForm.password, password);

            const response = await fetch(urlAuth, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                },
            });

            if (response.status === successCode) {
                return { success: true, message: 'Remote authentication successful' };
            } else if (response.status === errorCode) {
                return { success: false, message: 'Invalid remote credentials' };
            } else {
                return { success: false, message: `Unexpected response: ${response.status}` };
            }
        } catch (error) {
            console.error('Remote authentication error:', error);
            return { success: false, message: 'Remote authentication failed' };
        }
    }

    /**
     * Create and store authentication session
     */
    private async createSession(email: string, method: 'local' | 'remote'): Promise<void> {
        const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        this.session = {
            email,
            authenticated: true,
            expires,
            method,
        };

        // Generate encryption key for content decryption
        this.encryptionKey = this.generateEncryptionKey(email);

        // Store encrypted session in localStorage
        const sessionData = CryptoJS.AES.encrypt(JSON.stringify(this.session), this.encryptionKey).toString();

        // Store encrypted email for session recovery
        const encryptedEmail = CryptoJS.AES.encrypt(email, 'apidoc-email-key').toString();

        localStorage.setItem('apidoc_session', sessionData);
        localStorage.setItem('apidoc_email', encryptedEmail);
    }

    /**
     * Load existing session from storage
     */
    private loadSession(): void {
        try {
            const sessionData = localStorage.getItem('apidoc_session');
            const encryptedEmail = localStorage.getItem('apidoc_email');

            if (!sessionData || !encryptedEmail) return;

            // Decrypt the stored email
            const decryptedEmailBytes = CryptoJS.AES.decrypt(encryptedEmail, 'apidoc-email-key');
            const email = decryptedEmailBytes.toString(CryptoJS.enc.Utf8);

            if (!email) return;

            this.encryptionKey = this.generateEncryptionKey(email);

            const decrypted = CryptoJS.AES.decrypt(sessionData, this.encryptionKey);
            const sessionObj = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

            if (sessionObj && Date.now() < sessionObj.expires) {
                this.session = sessionObj;
            }
        } catch (error) {
            console.warn('Could not load session:', error);
            this.clearSession();
        }
    }

    /**
     * Generate encryption key from user email
     */
    private generateEncryptionKey(email: string): string {
        return CryptoJS.PBKDF2(email, 'apidoc-salt-2024', {
            keySize: 256 / 32,
            iterations: 1000,
        }).toString();
    }

    /**
     * Decrypt protected content
     */
    decryptContent(encryptedContent: string): string {
        if (!this.encryptionKey) {
            throw new Error('No encryption key available');
        }

        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedContent, this.encryptionKey);
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Content decryption failed:', error);
            throw new Error('Failed to decrypt content');
        }
    }

    /**
     * Logout and clear session
     */
    logout(): void {
        this.session = null;
        this.encryptionKey = '';
        this.clearSession();

        // Reload page to show login form
        window.location.reload();
    }

    /**
     * Clear stored session data
     */
    private clearSession(): void {
        localStorage.removeItem('apidoc_session');
        localStorage.removeItem('apidoc_email');
    }

    /**
     * Check authentication and show login form if needed
     */
    checkAuthentication(): void {
        if (!this.isLoginRequired()) {
            return; // No login required
        }

        // Delay authentication check to allow DOM initialization
        setTimeout(() => {
            if (this.isAuthenticated()) {
                this.showProtectedContent();
            } else {
                this.showLoginForm();
            }
        }, 1000); // Wait 1 second for templates to initialize
    }

    /**
     * Show login form and hide main content
     */
    private showLoginForm(): void {
        // Hide main content without destroying it
        const mainContent = document.querySelector('.flex.h-screen') as HTMLElement;
        if (mainContent) {
            mainContent.style.display = 'none';
        }

        // Create overlay for login form
        const loginOverlay = document.createElement('div');
        loginOverlay.id = 'auth-overlay';
        loginOverlay.className = 'fixed inset-0 bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center z-50';

        const loginHTML = this.generateLoginForm();
        loginOverlay.innerHTML = loginHTML;

        document.body.appendChild(loginOverlay);
        this.bindLoginEvents();
    }

    /**
     * Generate login form HTML
     */
    private generateLoginForm(): string {
        return `
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">API Documentation</h2>
          <p class="text-gray-600 dark:text-gray-400">Please sign in to access the documentation</p>
        </div>

        <form id="login-form" class="space-y-6">
          <div id="login-error" class="hidden bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline" id="error-message"></span>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            id="login-button"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <span id="login-text">Sign In</span>
            <svg id="login-spinner" class="hidden animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </form>

        <div class="mt-6 text-center">
          <button
            id="toggle-theme-login"
            class="inline-flex items-center px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path>
            </svg>
            Toggle Theme
          </button>
        </div>
      </div>
    `;
    }

    /**
     * Bind events to login form
     */
    private bindLoginEvents(): void {
        const form = document.getElementById('login-form') as HTMLFormElement;
        const errorDiv = document.getElementById('login-error') as HTMLElement;
        const errorMessage = document.getElementById('error-message') as HTMLElement;
        const loginButton = document.getElementById('login-button') as HTMLButtonElement;
        const loginText = document.getElementById('login-text') as HTMLElement;
        const loginSpinner = document.getElementById('login-spinner') as HTMLElement;
        const themeToggle = document.getElementById('toggle-theme-login') as HTMLButtonElement;

        // Theme toggle functionality
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });

        // Login form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email') as HTMLInputElement;
            const passwordInput = document.getElementById('password') as HTMLInputElement;

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                this.showLoginError('Please enter both email and password');
                return;
            }

            // Show loading state
            loginButton.disabled = true;
            loginText.textContent = 'Signing in...';
            loginSpinner.classList.remove('hidden');
            errorDiv.classList.add('hidden');

            try {
                const result = await this.login(email, password);

                if (result.success) {
                    // Redirect to main content
                    window.location.reload();
                } else {
                    this.showLoginError(result.message);
                }
            } catch (error) {
                console.error('Login error:', error);
                this.showLoginError('An unexpected error occurred');
            } finally {
                // Reset loading state
                loginButton.disabled = false;
                loginText.textContent = 'Sign In';
                loginSpinner.classList.add('hidden');
            }
        });
    }

    /**
     * Show login error message
     */
    private showLoginError(message: string): void {
        const errorDiv = document.getElementById('login-error') as HTMLElement;
        const errorMessage = document.getElementById('error-message') as HTMLElement;

        errorMessage.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    /**
     * Show protected content after successful authentication
     */
    private showProtectedContent(): void {
        // Remove login overlay if it exists
        const overlay = document.getElementById('auth-overlay');
        if (overlay) {
            overlay.remove();
        }

        // Show main content
        const mainContent = document.querySelector('.flex.h-screen') as HTMLElement;
        if (mainContent) {
            mainContent.style.display = 'flex';
        }

        // Content will be shown by the normal page load process
        // This method can be extended to decrypt and inject protected content
        console.log('User authenticated, showing protected content');
    }

    /**
     * Get current session info (for debugging/admin purposes)
     */
    getSessionInfo(): AuthSession | null {
        return this.session;
    }
}

// Export the class as default for instantiation
export default AuthManager;
export { AuthManager };
export type { AuthSession, LoginConfig };
