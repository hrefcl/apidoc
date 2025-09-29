/**
 * @file JSON Encryption Module for APIDoc Authentication
 *
 * Provides encryption/decryption capabilities for protecting JSON documentation
 * when authentication is enabled. Uses AES-256-GCM for secure encryption.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 5.0.0
 * @public
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Configuration for JSON encryption system
 */
export interface EncryptionConfig {
    /** Whether encryption is enabled */
    enabled: boolean;
    /** Algorithm to use for encryption */
    algorithm: string;
    /** Key length in bytes */
    keyLength: number;
    /** IV length in bytes */
    ivLength: number;
    /** Tag length for GCM mode */
    tagLength: number;
}

/**
 * Default encryption configuration
 */
const DEFAULT_CONFIG: EncryptionConfig = {
    enabled: true,
    algorithm: 'aes-256-gcm',
    keyLength: 32, // 256 bits
    ivLength: 16, // 128 bits
    tagLength: 16, // 128 bits
};

/**
 * Encrypted JSON file structure
 */
export interface EncryptedFile {
    /** Encrypted data as base64 */
    data: string;
    /** Initialization vector as base64 */
    iv: string;
    /** Authentication tag as base64 */
    tag: string;
    /** Algorithm used */
    algorithm: string;
    /** Timestamp of encryption */
    encrypted_at: string;
    /** Version of encryption format */
    version: string;
}

/**
 * JSON Encryption Manager
 */
export class JSONEncryption {
    private config: EncryptionConfig;
    private key: Buffer;
    private keyPath: string;
    private providedKey?: string;

    constructor(config: Partial<EncryptionConfig> = {}, encryptionKey?: string) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.keyPath = path.join(process.cwd(), '.apicat-key');
        this.providedKey = encryptionKey;
        this.key = this.loadOrCreateKey();
    }

    /**
     * Load existing encryption key or create a new one
     * @returns Encryption key buffer
     */
    private loadOrCreateKey(): Buffer {
        // Use provided key from config if available
        if (this.providedKey) {
            console.info('🔐 Using encryption key from apidoc.json configuration');
            // Support both hex and base64 encoded keys
            try {
                if (this.providedKey.length === 64) {
                    // Assume hex encoding for 64-character strings
                    return Buffer.from(this.providedKey, 'hex');
                } else {
                    // Assume base64 encoding
                    return Buffer.from(this.providedKey, 'base64');
                }
            } catch (error) {
                console.warn('Invalid encryption key format in config, generating new one');
            }
        }

        // Try to load existing key from file
        try {
            if (fs.existsSync(this.keyPath)) {
                const keyData = fs.readFileSync(this.keyPath, 'utf8');
                console.info('🔐 Using existing encryption key from:', this.keyPath);
                return Buffer.from(keyData, 'base64');
            }
        } catch (_error) {
            console.warn('Could not load existing encryption key, generating new one');
        }

        // Generate new key
        const newKey = crypto.randomBytes(this.config.keyLength);
        try {
            fs.writeFileSync(this.keyPath, newKey.toString('base64'), { mode: 0o600 });
            console.info('🔐 Generated new encryption key at:', this.keyPath);
            console.info(
                `💡 Add this to your apidoc.json to use the same key: "encryptionKey": "${newKey.toString('base64')}"`
            );
        } catch (_error) {
            console.warn('Could not save encryption key to file, using in-memory key');
        }

        return newKey;
    }

    /**
     * Encrypt JSON data
     * @param data - JSON data to encrypt
     * @returns Encrypted file structure
     */
    public encryptJSON(data: any): EncryptedFile {
        if (!this.config.enabled) {
            throw new Error('Encryption is disabled');
        }

        const jsonString = JSON.stringify(data, null, 2);
        const iv = crypto.randomBytes(this.config.ivLength);

        const cipher = crypto.createCipheriv(this.config.algorithm, this.key, iv) as crypto.CipherGCM;
        cipher.setAAD(Buffer.from('apicat-json'));

        let encrypted = cipher.update(jsonString, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        const tag = cipher.getAuthTag();

        return {
            data: encrypted,
            iv: iv.toString('base64'),
            tag: tag.toString('base64'),
            algorithm: this.config.algorithm,
            encrypted_at: new Date().toISOString(),
            version: '1.0',
        };
    }

    /**
     * Decrypt JSON data
     * @param encryptedFile - Encrypted file structure
     * @returns Decrypted JSON data
     */
    public decryptJSON(encryptedFile: EncryptedFile): any {
        if (!this.config.enabled) {
            throw new Error('Encryption is disabled');
        }

        const iv = Buffer.from(encryptedFile.iv, 'base64');
        const tag = Buffer.from(encryptedFile.tag, 'base64');
        const encrypted = encryptedFile.data;

        const decipher = crypto.createDecipheriv(encryptedFile.algorithm, this.key, iv) as crypto.DecipherGCM;
        decipher.setAAD(Buffer.from('apicat-json'));
        decipher.setAuthTag(tag);

        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    }

    /**
     * Encrypt and save JSON file
     * @param filePath - Path to save encrypted file
     * @param data - JSON data to encrypt and save
     */
    public encryptAndSaveJSON(filePath: string, data: any): void {
        const encryptedData = this.encryptJSON(data);
        const encryptedPath = filePath.replace(/\.json$/, '.encrypted.json');

        fs.writeFileSync(encryptedPath, JSON.stringify(encryptedData, null, 2));
        console.info('🔐 Encrypted JSON saved to:', encryptedPath);
    }

    /**
     * Load and decrypt JSON file
     * @param filePath - Path to encrypted JSON file
     * @returns Decrypted JSON data
     */
    public loadAndDecryptJSON(filePath: string): any {
        const encryptedPath = filePath.replace(/\.json$/, '.encrypted.json');

        if (!fs.existsSync(encryptedPath)) {
            throw new Error(`Encrypted file not found: ${encryptedPath}`);
        }

        const encryptedData = JSON.parse(fs.readFileSync(encryptedPath, 'utf8'));
        return this.decryptJSON(encryptedData);
    }

    /**
     * Check if encryption is enabled
     * @returns True if encryption is enabled
     */
    public isEnabled(): boolean {
        return this.config.enabled;
    }

    /**
     * Get encryption key fingerprint for verification
     * @returns SHA256 hash of the key
     */
    public getKeyFingerprint(): string {
        return crypto.createHash('sha256').update(this.key).digest('hex').substring(0, 16);
    }
}

/**
 * Create encryption instance based on login configuration
 * @param loginConfig - Login configuration from apidoc.json
 * @returns JSONEncryption instance or null if disabled
 */
export function createEncryption(loginConfig: any): JSONEncryption | null {
    if (!loginConfig || !loginConfig.active) {
        return null;
    }

    // Pass encryption key if provided in config
    const config: Partial<EncryptionConfig> = {
        enabled: true,
    };

    return new JSONEncryption(config, loginConfig.encryptionKey);
}

/**
 * Utility function to encrypt all JSON files in a directory (recursive)
 * @param directory - Directory containing JSON files
 * @param encryption - Encryption instance
 * @param pattern - File pattern to match (default: *.json)
 */
export function encryptDirectoryJSON(directory: string, encryption: JSONEncryption, _pattern: string = '*.json'): void {
    if (!encryption.isEnabled()) {
        return;
    }

    const jsonFiles = findJSONFilesRecursive(directory);
    console.info(`🔐 Encrypting ${jsonFiles.length} JSON files in ${directory} (recursive)`);

    for (const filePath of jsonFiles) {
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            encryption.encryptAndSaveJSON(filePath, data);

            // Remove original file for security
            fs.unlinkSync(filePath);
            console.info(`🗑️  Removed original: ${path.relative(directory, filePath)}`);
        } catch (error) {
            console.error(`Failed to encrypt ${path.relative(directory, filePath)}:`, error);
        }
    }

    console.info('🔐 JSON encryption completed');
}

/**
 * Find all JSON files in a directory recursively
 * @param directory - Directory to search
 * @returns Array of JSON file paths
 */
function findJSONFilesRecursive(directory: string): string[] {
    const jsonFiles: string[] = [];

    function scanDirectory(dir: string): void {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                scanDirectory(filePath);
            } else if (file.endsWith('.json') && !file.endsWith('.encrypted.json') && !file.includes('.key')) {
                jsonFiles.push(filePath);
            }
        }
    }

    scanDirectory(directory);
    return jsonFiles;
}
