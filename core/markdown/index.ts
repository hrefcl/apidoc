export * from './generator';
export * from './types';
export * from './utils';

import { createMarkdownFromApiDocData, generateMarkdown, generateMarkdownFileSystem } from './generator';
import { MarkdownConfigurationObject, MarkdownConfigurationObjectCLI, availableTemplates } from './types';

export {
    MarkdownConfigurationObject,
    MarkdownConfigurationObjectCLI,
    availableTemplates,
    createMarkdownFromApiDocData,
    generateMarkdown,
    generateMarkdownFileSystem,
};
