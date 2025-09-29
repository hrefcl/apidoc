import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';

/**
 * Check if a path exists
 * @param path
 */
export const pathExists = async (path: string): Promise<boolean> => {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
};

/**
 * Recursively create directory structure
 * @param dirPath
 */
export const mkdirp = async (dirPath: string): Promise<void> => {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
        // Directory might already exist
        if ((error as any).code !== 'EEXIST') {
            throw error;
        }
    }
};

/**
 * Get unique elements from array
 * @param array
 */
export const unique = <T>(array: T[]): T[] => {
    return Array.from(new Set(array));
};

/**
 * Convert text to markdown link format
 * @param text
 */
export const toLink = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
};

/**
 * Escape markdown special characters
 * @param text
 */
export const escapeMarkdown = (text: string): string => {
    return text.replace(/([\\`*_{}[\]()#+\-.!|])/g, '\\$1');
};

/**
 * Convert HTML to markdown-safe text
 * @param html
 */
export const htmlToMarkdown = (html: string): string => {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<p>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '*$1*')
        .replace(/<code>(.*?)<\/code>/gi, '`$1`')
        .replace(/<[^>]*>/g, '')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
};

/**
 * Template utility functions available in EJS templates
 */
export const templateUtils = {
    toLink,
    escapeMarkdown,
    htmlToMarkdown,

    /**
     * Format parameter type for display
     * @param type
     */
    formatType: (type?: string): string => {
        if (!type) return '';
        return `\`${type}\``;
    },

    /**
     * Format optional marker
     * @param optional
     */
    formatOptional: (optional?: boolean): string => {
        return optional ? '**optional** ' : '';
    },

    /**
     * Clean description text
     * @param description
     */
    cleanDescription: (description?: string): string => {
        if (!description) return '';
        return htmlToMarkdown(description);
    },
};

/**
 * Load template file or get built-in template
 * @param templateName
 * @param isFilePath
 */
export const loadTemplate = async (templateName?: string, isFilePath = true): Promise<ejs.AsyncTemplateFunction> => {
    let templateContent: string;

    if (!templateName || templateName === 'default') {
        // Load default template
        const defaultTemplatePath = path.join(__dirname, 'templates', 'default.md');
        templateContent = await fs.readFile(defaultTemplatePath, 'utf8');
    } else if (templateName === 'bitbucket') {
        // Load bitbucket template
        const bitbucketTemplatePath = path.join(__dirname, 'templates', 'bitbucket.md');
        templateContent = await fs.readFile(bitbucketTemplatePath, 'utf8');
    } else if (isFilePath && (await pathExists(templateName))) {
        // Load custom template file
        templateContent = await fs.readFile(templateName, 'utf8');
    } else {
        // Treat as raw template string
        templateContent = templateName;
    }

    return ejs.compile(templateContent, { async: true });
};

/**
 * Load content from CLI parameter or apiDoc project configuration
 * @param type
 * @param cliParam
 * @param apiDocProjectData
 */
export const loadFromCliParamOrApiDocProject = async (
    type: 'header' | 'footer' | 'prepend',
    cliParam?: string,
    apiDocProjectData?: Record<string, any>
): Promise<string | undefined> => {
    // First check CLI parameter
    if (cliParam && (await pathExists(cliParam))) {
        return await fs.readFile(cliParam, 'utf8');
    }

    // Then check apiDoc project configuration
    if (apiDocProjectData && apiDocProjectData[type] && apiDocProjectData[type].filename) {
        const filename = apiDocProjectData[type].filename;
        if (await pathExists(filename)) {
            return await fs.readFile(filename, 'utf8');
        }
    }

    return undefined;
};
