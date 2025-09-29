/** APIDoc 4.0 Template - Simplified TypeScript version for testing */

// CSS imports for bundling - TailwindCSS and essential styles only
import 'highlight.js/styles/github-dark.css';
import './css/tailwind.css';
import './vendor/bootstrap/css/bootstrap.css';

import Handlebars from 'handlebars';
import $ from 'jquery';

// Highlight.js is the modern syntax highlighting library
import hljs from 'highlight.js';
import 'highlight.js/lib/languages/bash';
import 'highlight.js/lib/languages/json';

// Import types
import type { ApiDocEntry, ApiDocProject } from '../../../core/types/index';

// Global declarations for bundler-injected data
declare global {
    var API_DATA: ApiDocEntry[];
    var API_PROJECT: ApiDocProject;
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 APIDoc 4.0 TypeScript Template Loaded!');

    // bundler injected data
    const api: ApiDocEntry[] = API_DATA;
    const apiProject: ApiDocProject = API_PROJECT;

    console.log('📊 API Data:', {
        entries: api.length,
        project: apiProject.name,
        version: apiProject.version,
    });

    // Test basic template functionality
    const templateTest = Handlebars.compile('<h1>{{title}}</h1>');
    $('#test-area').html(templateTest({ title: `${apiProject.name} v${apiProject.version}` }));

    // Initialize syntax highlighting
    hljs.highlightAll();

    console.log('✅ Template initialized successfully with TypeScript!');
});
