/** apidoc template main.js */

// Note: CSS is now pre-compiled and copied directly by writer.ts
// No CSS imports needed - only JavaScript functionality

import Handlebars from 'handlebars';
import $ from 'jquery';
import { extend, groupBy, some } from 'lodash';
import semver from 'semver';

// Bootstrap 5 JavaScript components
import { Dropdown, Popover, Tab, Tooltip } from 'bootstrap';

// Highlight.js is the modern syntax highlighting library
import hljs from 'highlight.js';
import 'highlight.js/lib/languages/bash';
import 'highlight.js/lib/languages/http';
import 'highlight.js/lib/languages/javascript';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/python';
import 'highlight.js/lib/languages/typescript';
import 'highlight.js/lib/languages/xml'; // Para HTML

import { __, setLanguage } from './locales/locale';
import { initSampleRequest } from './send_sample_request';

// helpers for HandleBars
import { register } from './hb_helpers';

// Native Components
import { SidebarComponent } from './components/sidebar';
import AuthManager from './components/auth';

// API data - injected globally via script tag
declare global {
    interface Window {
        API_DATA: any;
        API_PROJECT: any;
        Handlebars: typeof Handlebars;
    }
}

// Make Handlebars and jQuery available globally for template compilation and Bootstrap
(window as any).Handlebars = Handlebars;
(window as any).$ = $;
(window as any).jQuery = $;

// Make native components available globally
(window as any).SidebarComponent = SidebarComponent;
(window as any).AuthManager = AuthManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme first
    initializeTheme();

    // Initialize navbar logo
    initializeNavbarLogo();

    // Initialize authentication system
    initializeAuthentication();

    init();
    initSampleRequest();
    hljs.highlightAll();

    // Process any remaining Handlebars templates in the DOM
    processRemainingTemplates();

    // Theme toggle is now handled by inline HTML script
});

// Initialize authentication system
function initializeAuthentication() {
    try {
        console.log('🔐 Initializing authentication system...');

        // Check if login configuration exists
        const loginConfig = (window as any).LOGIN_CONFIG;
        if (loginConfig && loginConfig.active) {
            console.log('🔐 Authentication is enabled, initializing AuthManager...');

            // Initialize AuthManager
            const authManager = new AuthManager();
            authManager.init(loginConfig);

            // Make AuthManager available globally for debugging
            (window as any).authManager = authManager;

            console.log('✅ Authentication system initialized successfully');
        } else {
            console.log('🔓 Authentication is disabled or not configured');
        }
    } catch (error) {
        console.error('❌ Error initializing authentication:', error);
    }
}

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply both data-theme and class for maximum compatibility
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Update icons immediately
    updateThemeIcons(savedTheme);

    console.log(`🎨 Theme initialized: ${savedTheme}`);
}

// Update theme toggle icons
function updateThemeIcons(theme: string) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }
}

// Initialize navbar logo with custom configuration
function initializeNavbarLogo() {
    try {
        const logoContainer = document.getElementById('navbar-logo-container');
        if (!logoContainer) return;

        // Get logo configuration from API_PROJECT
        let logoConfig: any = {};
        if (typeof window.API_PROJECT !== 'undefined') {
            const project = typeof window.API_PROJECT === 'string'
                ? JSON.parse(window.API_PROJECT)
                : window.API_PROJECT;
            logoConfig = project.logo || {};
        }

        if (logoConfig.url) {
            // Custom logo image
            const width = logoConfig.width || '32px';
            const height = logoConfig.height || '32px';
            const alt = logoConfig.alt || 'Logo';

            logoContainer.innerHTML = `
                <div class="flex-shrink-0" style="width: ${width}; height: ${height};">
                    <img
                        src="${logoConfig.url}"
                        alt="${alt}"
                        class="w-full h-full object-contain"
                        style="max-width: ${width}; max-height: ${height};"
                    />
                </div>
            `;
        } else if (logoConfig.icon) {
            // Font Awesome icon
            logoContainer.innerHTML = `
                <div class="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center">
                    <i class="${logoConfig.icon} w-5 h-5"></i>
                </div>
            `;
        }
        // If no custom logo configuration, keep the default SVG logo
    } catch (error) {
        console.warn('Error initializing navbar logo:', error);
    }
}

// Get default navbar logo fallback
function getDefaultNavbarLogo(): string {
    return `
        <div class="w-8 h-8 bg-blue-500 text-white rounded flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
        </div>
    `;
}

// Theme toggle is now handled by inline HTML script
// This function is deprecated

/**
 * Initialize the API documentation interface by compiling templates, organizing API data,
 * and creating navigation elements.
 *
 * - Registers Handlebars helper functions.
 * - Compiles Handlebars templates for rendering various sections of the documentation.
 * - Groups and sorts API data by groups and versions.
 * - Generates and orders the navigation menu based on API data and templates.
 * - Handles additional configuration such as language settings and custom ordering.
 */
function init() {
    // Use global API data - parse if strings with error handling
    let api;
    try {
        api = typeof window.API_DATA === 'string' ? JSON.parse(window.API_DATA) : window.API_DATA || [];
    } catch (error) {
        console.error('Error parsing API_DATA:', error);
        api = [];
    }

    const apiProject = typeof window.API_PROJECT === 'string' ? JSON.parse(window.API_PROJECT) : window.API_PROJECT || {};

    // Validate and clean API data to prevent version errors
    api = api.filter(entry => {
        if (!entry.version || typeof entry.version !== 'string' || entry.version.trim() === '') {
            console.warn('Filtering out API entry with invalid version:', entry.name || 'unknown', 'version:', entry.version);
            return false;
        }
        return true;
    });

    // HANDLEBARS //
    // register HandleBars helper functions
    register();

    // Compile templates with error checking
    function safeCompile(templateId: string) {
        const templateHtml = $(`#${templateId}`).html();
        if (!templateHtml) {
            console.error(`Template not found: ${templateId}`);
            return () => '<!-- Template not found: ' + templateId + ' -->';
        }
        try {
            return Handlebars.compile(templateHtml);
        } catch (error) {
            console.error(`Template compilation error for ${templateId}:`, error);
            console.error('Full error details:', error instanceof Error ? error.stack : 'No stack trace');
            return () => '<!-- Template compilation error: ' + templateId + ' -->';
        }
    }

    const templateHeader = safeCompile('template-header');
    const templateFooter = safeCompile('template-footer');
    const templateArticle = safeCompile('template-article');
    const templateCompareArticle = safeCompile('template-compare-article');
    const templateGenerator = safeCompile('template-generator');
    const templateProject = safeCompile('template-project');
    const templateSections = safeCompile('template-sections');
    // templateSidenav removed - now using native SidebarComponent

    // apiProject defaults
    const defaultTemplateOptions = {
        aloneDisplay: false,
        showRequiredLabels: false,
        withGenerator: true,
        withCompare: true,
    };

    apiProject.template = Object.assign(defaultTemplateOptions, apiProject.template ?? {});

    if (apiProject.template.forceLanguage) {
        setLanguage(apiProject.template.forceLanguage);
    }

    /**
     * Data transform grouped by group.
     *
     * A map-like object that organizes API entries by their respective groups.
     *
     * This variable is created by grouping API entries from the `api` collection
     * based on their `group` property. It helps in categorizing and accessing
     * API entries according to their specified group.
     * @type {object}
     */
    const apiByGroup = groupBy(api, (entry) => {
        return entry.group;
    });

    // grouped by group and name
    const apiByGroupAndName = {};
    $.each(apiByGroup, (index, entries) => {
        apiByGroupAndName[index] = groupBy(entries, (entry) => {
            return entry.name;
        });
    });

    // sort api within a group by title ASC and custom order
    const newList = [];
    $.each(apiByGroupAndName, (index, groupEntries) => {
        // get titles from the first entry of group[].name[] (name has versioning)
        let titles = [];
        $.each(groupEntries, (titleName, entries) => {
            const title = entries[0].title;
            if (title) {
                // title.toLowerCase().replace(/[]/g, function ($0) { return umlauts[$0]; });
                titles.push(title.toLowerCase() + '#~#' + titleName); // '#~#' keep reference to titleName after sorting
            }
        });
        // sort by name ASC
        titles.sort();

        // custom order
        if (apiProject.order) {
            titles = sortByOrder(titles, apiProject.order, '#~#');
        }

        // add single elements to the new list
        titles.forEach((name) => {
            const values = name.split('#~#');
            const key = values[1];
            groupEntries[key]?.forEach((entry) => {
                newList.push(entry);
            });
        });
    });

    // api overwrite with ordered list
    api = newList;

    //
    // Group- and version lists
    //
    let apiGroups = {};
    const apiGroupTitles = {};
    let apiVersions = {};
    apiVersions[apiProject.version] = 1;

    $.each(api, (index, entry) => {
        apiGroups[entry.group] = 1;
        apiGroupTitles[entry.group] = entry.groupTitle || entry.group;
        apiVersions[entry.version] = 1;
    });

    // sort groups
    apiGroups = Object.keys(apiGroups);
    apiGroups.sort();

    // custom order
    if (apiProject.order) {
        apiGroups = sortGroupsByOrder(apiGroupTitles, apiProject.order);
    }

    // sort versions DESC with error handling
    apiVersions = Object.keys(apiVersions);

    // Safe version comparison that handles invalid versions
    apiVersions.sort((a, b) => {
        try {
            return semver.compare(a, b);
        } catch (error) {
            console.warn('Error comparing versions:', a, 'vs', b, error.message);
            // Fallback to string comparison if semver fails
            return a.localeCompare(b);
        }
    });

    apiVersions.reverse();

    // create navigation list
    const nav = [];
    apiGroups.forEach((group) => {
        // Main menu entry
        nav.push({
            group: group,
            isHeader: true,
            title: apiGroupTitles[group],
        });

        // Submenu
        let oldName = '';
        api.forEach((entry) => {
            if (entry.group === group) {
                if (oldName !== entry.name) {
                    nav.push({
                        title: entry.title,
                        group: group,
                        name: entry.name,
                        type: entry.type,
                        version: entry.version,
                        url: entry.url,
                    });
                } else {
                    nav.push({
                        title: entry.title,
                        group: group,
                        hidden: true,
                        name: entry.name,
                        type: entry.type,
                        version: entry.version,
                        url: entry.url,
                    });
                }
                oldName = entry.name;
            }
        });
    });

    /**
     * Add navigation items by analyzing the HTML content and searching for h1 and h2 tags
     *
     * Parses the given content for heading elements (h1 and h2), extracts their details,
     * and adds structured navigation objects to the provided nav array.
     * @param {Array<object>} nav - Navigation array where parsed navigation objects will be added.
     * @param {string} content - HTML content string to parse for headings and metadata.
     * @param {number} index - Starting index in the nav array where new entries will be inserted.
     * @returns {boolean} Returns true if at least one level 1 heading (h1) was found and added; otherwise, false.
     */
    function addNav(nav, content, index) {
        let foundLevel1 = false;
        if (!content) {
            return foundLevel1;
        }
        const topics = content.match(/<h(1|2).*?>(.+?)<\/h(1|2)>/gi);
        if (topics) {
            topics.forEach(function (entry) {
                const level = entry.substring(2, 3);
                const title = entry.replace(/<.+?>/g, ''); // Remove all HTML tags for the title
                const entryTags = entry.match(/id="api-([^-]+)(?:-(.+))?"/); // Find the group and name in the id property
                const group = entryTags ? entryTags[1] : null;
                const name = entryTags ? entryTags[2] : null;
                if (level === '1' && title && group) {
                    nav.splice(index, 0, {
                        group: group,
                        isHeader: true,
                        title: title,
                        isFixed: true,
                    });
                    index++;
                    foundLevel1 = true;
                }
                if (level === '2' && title && group && name) {
                    nav.splice(index, 0, {
                        group: group,
                        name: name,
                        isHeader: false,
                        title: title,
                        isFixed: false,
                        version: '1.0',
                    });
                    index++;
                }
            });
        }
        return foundLevel1;
    }

    let foundLevel1;
    // Main menu Header entry
    if (apiProject.header) {
        foundLevel1 = addNav(nav, apiProject.header.content, 0); // Add level 1 and 2 titles

        // Always add header title if configured, regardless of markdown H1 headers
        if (apiProject.header.title != null) {
            nav.unshift({
                group: '_header',
                isHeader: true,
                title: apiProject.header.title,
                isFixed: true,
            });
        } else if (!foundLevel1) {
            // Fallback: If no title configured and no Level 1 tags found, use default
            nav.unshift({
                group: '_header',
                isHeader: true,
                title: __('General'),
                isFixed: true,
            });
        }
    }

    // Main menu Footer entry
    if (apiProject.footer) {
        const lastNavIndex = nav.length;
        foundLevel1 = addNav(nav, apiProject.footer.content, nav.length); // Add level 1 and 2 titles

        // Always add footer title if configured, regardless of markdown H1 headers
        if (apiProject.footer.title != null) {
            nav.splice(lastNavIndex, 0, {
                group: '_footer',
                isHeader: true,
                title: apiProject.footer.title,
                isFixed: true,
            });
        } else if (!foundLevel1) {
            // Fallback: If no title configured and no Level 1 tags found, use default
            nav.splice(lastNavIndex, 0, {
                group: '_footer',
                isHeader: true,
                title: __('Footer'),
                isFixed: true,
            });
        }
    }

    // render page title
    const title = apiProject.title ? apiProject.title : 'apiDoc: ' + apiProject.name + ' - ' + apiProject.version;
    $(document).attr('title', title);

    // remove loader
    $('#loader').remove();

    // render sidenav - Only use native SidebarComponent (no fallback)
    try {
        const sidenavContainer = document.getElementById('sidenav');
        if (!sidenavContainer) {
            throw new Error('Sidenav container not found in DOM');
        }

        if (!SidebarComponent) {
            throw new Error('SidebarComponent not available');
        }

        // Initialize native sidebar component
        const sidebar = new SidebarComponent(sidenavContainer);
        sidebar.setData(nav);
        console.log('✅ Native SidebarComponent initialized successfully');
    } catch (error) {
        console.error('❌ Critical error: SidebarComponent failed to initialize:', error);
        const sidenavContainer = document.getElementById('sidenav');
        if (sidenavContainer) {
            sidenavContainer.innerHTML = `
        <div class="sidebar-error">
          <p>⚠️ Error cargando navegación</p>
          <p>Por favor recarga la página</p>
        </div>`;
        }
    }

    // render Generator
    try {
        $('#generator').append(templateGenerator(apiProject));
    } catch (error) {
        console.error('Error rendering generator template:', error);
        $('#generator').append('<!-- Generator template error -->');
    }

    // render Project
    try {
        extend(apiProject, { versions: apiVersions });
        $('#project').append(templateProject(apiProject));
    } catch (error) {
        console.error('Error rendering project template:', error);
        $('#project').append('<!-- Project template error -->');
    }

    // render apiDoc, header/footer documentation
    if (apiProject.header) {
        try {
            const headerContent = templateHeader(apiProject.header);
            if (headerContent && headerContent.trim()) {
                $('#header').append(headerContent).show();
            }
        } catch (error) {
            console.error('Error rendering header template:', error);
            $('#header').append('<!-- Header template error -->').show();
        }
    }

    if (apiProject.footer) {
        try {
            const footerContent = templateFooter(apiProject.footer);
            if (footerContent && footerContent.trim()) {
                $('#footer').append(footerContent).show();
                if (apiProject.template.aloneDisplay) {
                    const footerElement = document.getElementById('api-_footer');
                    if (footerElement) {
                        footerElement.classList.add('hide');
                    }
                }
            }
        } catch (error) {
            console.error('Error rendering footer template:', error);
            $('#footer').append('<!-- Footer template error -->').show();
        }
    }

    //
    // Render Sections and Articles
    //
    const articleVersions = {};
    let content = '';
    apiGroups.forEach(function (groupEntry) {
        const articles = [];
        let oldName = '';
        let fields = {};
        let title = groupEntry;
        let description = '';
        articleVersions[groupEntry] = {};

        // render all articles of a group
        api.forEach(function (entry) {
            if (groupEntry === entry.group) {
                if (oldName !== entry.name) {
                    // determine versions for this article name
                    api.forEach(function (versionEntry) {
                        if (groupEntry === versionEntry.group && entry.name === versionEntry.name) {
                            if (!Object.prototype.hasOwnProperty.call(articleVersions[entry.group], entry.name)) {
                                articleVersions[entry.group][entry.name] = [];
                            }
                            articleVersions[entry.group][entry.name].push(versionEntry.version);
                        }
                    });
                }

                // Always render ALL versions of each article (first visible, others hidden)
                fields = {
                    article: entry,
                    hidden: oldName === entry.name, // Hide duplicate name versions
                    versions: articleVersions[entry.group][entry.name],
                };

                // sampleUrl config can be an url or true
                if (apiProject.sampleUrl) {
                    // a sampleUrl of true means we want to use the current location as sample url
                    if (apiProject.sampleUrl === true) {
                        apiProject.sampleUrl = window.location.origin;
                    }
                }

                // add prefix URL for endpoint unless it's already absolute
                if (apiProject.url) {
                    if (fields.article.url.substr(0, 4).toLowerCase() !== 'http') {
                        fields.article.url = apiProject.url + fields.article.url;
                    }
                }

                addArticleSettings(fields, entry);

                if (entry.groupTitle) {
                    title = entry.groupTitle;
                }

                // TODO: make groupDescription comparable with older versions (not important for the moment)
                if (entry.groupDescription) {
                    description = entry.groupDescription;
                }

                try {
                    const articleHtml = templateArticle(fields);
                    articles.push({
                        article: articleHtml,
                        group: entry.group,
                        name: entry.name,
                        aloneDisplay: apiProject.template.aloneDisplay,
                    });
                } catch (error) {
                    console.error('Error rendering article template for:', entry.name, error);
                    console.error('Error details:', error instanceof Error ? error.stack : 'No stack trace');
                    console.error('Template fields:', JSON.stringify(fields, null, 2));
                    articles.push({
                        article: '<!-- Article template error: ' + entry.name + ' -->',
                        group: entry.group,
                        name: entry.name,
                        aloneDisplay: apiProject.template.aloneDisplay,
                    });
                }
                oldName = entry.name;
            }
        });

        // render Section with Articles
        fields = {
            group: groupEntry,
            title: title,
            description: description,
            articles: articles,
            aloneDisplay: apiProject.template.aloneDisplay,
        };
        try {
            content += templateSections(fields);
        } catch (error) {
            console.error('Error rendering sections template for group:', groupEntry, error);
            content += '<!-- Sections template error: ' + groupEntry + ' -->';
        }
    });
    $('#sections').append(content);

    // Bootstrap Scrollspy
    if (!apiProject.template.aloneDisplay) {
        document.body.dataset.spy = 'scroll';
        $('body').scrollspy({ target: '#scrollingNav' });
    }

    // when we click on an input that was previously highlighted because it was empty, remove the red border
    // also listen for change because for numbers you can just click the browser's up/down arrow and it will not focus
    $('.form-control').on('focus change', function () {
        $(this).removeClass('border-danger');
    });

    // Content-Scroll on Navigation click.
    $('.sidenav')
        .find('a')
        .on('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (apiProject.template.aloneDisplay) {
                const active = document.querySelector('.sidenav > li.active');
                if (active) {
                    active.classList.remove('active');
                }
                if (this.parentNode && (this.parentNode as Element).classList) {
                    (this.parentNode as Element).classList.add('active');
                }
            } else {
                const el = document.querySelector(id);
                if (el) {
                    $('html,body').animate({ scrollTop: el.offsetTop }, 400);
                }
            }
            window.location.hash = id;
        });

    /**
     * Determine whether any field in the given fields object contains a property called 'type'.
     *
     * Checks if Parameter (sub) List has a type Field.
     * Example:
     * - @apiSuccess varname1 No type.
     * - @apiSuccess {string} varname2 With type.
     * @param {object} fields - The object containing fields to be checked. Each field can contain nested items.
     * @returns {boolean} Returns true if any field contains an item with a 'type' property, otherwise false.
     */
    function _hasTypeInFields(fields) {
        let result = false;
        $.each(fields, (name) => {
            result =
                result ||
                some(fields[name], (item) => {
                    return item.type;
                });
        });
        return result;
    }

    /**
     * On Template changes, recall plugins.
     */
    function initDynamic() {
        // Bootstrap 5 popover - handled by initBootstrapDropdowns()
        // Popovers are now initialized automatically with data-bs-toggle="popover"

        const version = $('#version strong').html();
        $('#sidenav li').removeClass('is-new');
        if (apiProject.template.withCompare) {
            $(`#sidenav li[data-version='${version}']`).each(function () {
                const group = $(this).data('group');
                const name = $(this).data('name');
                const length = $(`#sidenav li[data-group='${group}'][data-name='${name}']`).length;
                const index = $(`#sidenav li[data-group='${group}'][data-name='${name}']`).index($(this));
                if (length === 1 || index === length - 1) {
                    $(this).addClass('is-new');
                }
            });
        }

        // tabs
        // Bootstrap 5 tabs are handled automatically with data-bs-toggle="tab"
        // Initialize first tab as active
        $('.nav-tabs-examples').find('a:first').addClass('active');
        $('.tab-content').find('.tab-pane:first').addClass('show active');

        // switch content-type for body inputs (json or form-data)
        $('.sample-request-content-type-switch').change(function () {
            if ($(this).val() === 'body-form-data') {
                $('#sample-request-body-json-input-' + $(this).data('id')).hide();
                $('#sample-request-body-form-input-' + $(this).data('id')).show();
            } else {
                $('#sample-request-body-form-input-' + $(this).data('id')).hide();
                $('#sample-request-body-json-input-' + $(this).data('id')).show();
            }
        });

        if (apiProject.template.aloneDisplay) {
            // show group
            $('.show-group').click(function () {
                const apiGroup = '.' + $(this).attr('data-group') + '-group';
                const apiGroupArticle = '.' + $(this).attr('data-group') + '-article';
                $('.show-api-group').addClass('hide');
                $(apiGroup).removeClass('hide');
                $('.show-api-article').addClass('hide');
                $(apiGroupArticle).removeClass('hide');
            });

            // show api
            $('.show-api').click(function () {
                const id = this.getAttribute('href').substring(1);
                const selectedVersion = document.getElementById('version').textContent.trim();
                const apiName = `.${this.dataset.name}-article`;
                const apiNameVersioned = `[id="${id}-${selectedVersion}"]`;
                const apiGroup = `.${this.dataset.group}-group`;

                $('.show-api-group').addClass('hide');
                $(apiGroup).removeClass('hide');
                $('.show-api-article').addClass('hide');

                let targetEl = $(apiName);
                if ($(apiNameVersioned).length) {
                    targetEl = $(apiNameVersioned).parent();
                }
                targetEl.removeClass('hide');

                if (id.match(/_(header|footer)/)) {
                    const element = document.getElementById(id);
                    if (element) {
                        element.classList.remove('hide');
                    }
                }
            });
        }

        // call scrollspy refresh method
        if (!apiProject.template.aloneDisplay) {
            $('body').scrollspy('refresh');
        }

        if (apiProject.template.aloneDisplay) {
            const hashVal = decodeURI(window.location.hash);
            if (hashVal != null && hashVal.length !== 0) {
                const version = document.getElementById('version').textContent.trim();
                const el = document.querySelector(`li .${hashVal.slice(1)}-init`);
                const elVersioned = document.querySelector(`li[data-version="${version}"] .show-api.${hashVal.slice(1)}-init`);
                let targetEl = el;
                if (elVersioned) {
                    targetEl = elVersioned;
                }
                targetEl.click();
            }
        }
    }

    /**
     * HTML-Template specific jQuery-Functions.
     *
     * Sets the main version for the API documentation, updates the version display,
     * hides irrelevant articles and navigation items, and shows only the elements
     * corresponding to the selected version or the default version if no version is provided.
     * @param {string} [selectedVersion] - Version string to set as the main version. If not
     *     provided, the current version from the UI will be used.
     */
    function setMainVersion(selectedVersion) {
        if (typeof selectedVersion === 'undefined') {
            selectedVersion = $('#version strong').html();
        } else {
            $('#version strong').html(selectedVersion);
        }

        // Validate selectedVersion after getting it from DOM
        if (!selectedVersion || selectedVersion.trim() === '') {
            console.warn('No valid version found, using default version');
            selectedVersion = '1.0.0'; // Fallback version
        }

        // hide all
        $('article').addClass('hide');
        $('#sidenav li:not(.nav-fixed)').addClass('hide');

        // show 1st equal or lower Version of each entry
        const shown = {};
        document.querySelectorAll('article[data-version]').forEach((el) => {
            const group = el.dataset.group;
            const name = el.dataset.name;
            const version = el.dataset.version;
            const id = group + name;

            // Validate versions before semver comparison
            if (!version || !selectedVersion) {
                console.warn('Missing version data:', { version, selectedVersion, group, name });
                return;
            }

            if (!shown[id] && semver.lte(version, selectedVersion)) {
                shown[id] = true;
                // enable Article
                const articleElement = document.querySelector(`article[data-group="${group}"][data-name="${name}"][data-version="${version}"]`);
                if (articleElement) {
                    articleElement.classList.remove('hide');
                }
                // enable Navigation
                const navElement = document.querySelector(`#sidenav li[data-group="${group}"][data-name="${name}"][data-version="${version}"]`);
                if (navElement) {
                    navElement.classList.remove('hide');
                }
                const headerElement = document.querySelector(`#sidenav li.nav-header[data-group="${group}"]`);
                if (headerElement) {
                    headerElement.classList.remove('hide');
                }
            }
        });

        // Helper function to escape CSS selectors
        function escapeSelector(str: string): string {
            return str.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
        }

        // show 1st equal or lower Version of each entry
        $('article[data-version]').each(function () {
            const group = $(this).data('group');
            const escapedGroup = escapeSelector(group);
            $('section#api-' + escapedGroup).removeClass('hide');
            if ($('section#api-' + escapedGroup + ' article:visible').length === 0) {
                $('section#api-' + escapedGroup).addClass('hide');
            } else {
                $('section#api-' + escapedGroup).removeClass('hide');
            }
        });
    }

    // Make functions available globally for debugging and manual calls
    (window as any).setMainVersion = setMainVersion;
    (window as any).changeVersionCompareTo = changeVersionCompareTo;
    (window as any).changeAllVersionCompareTo = changeAllVersionCompareTo;

    // Make required variables available globally for comparison functions
    (window as any).apiByGroupAndName = apiByGroupAndName;
    (window as any).articleVersions = articleVersions;
    (window as any).templateCompareArticle = templateCompareArticle;

    setMainVersion();

    $('#versions a.version').on('click', function (e) {
        e.preventDefault();

        const selectedVersion = $(this).html();
        console.log('🔄 Version clicked:', selectedVersion);
        setMainVersion(selectedVersion);

        // Close dropdown after selection
        $('#versions').removeClass('open show');
    });

    // compare all article with their predecessor
    $('#compareAllWithPredecessor').on('click', changeAllVersionCompareTo);

    // change version of an article - use event delegation for dynamic content
    $(document).on('click', 'article .versions .version', changeVersionCompareTo);

    // compare url-parameter
    $.urlParam = function (name) {
        const results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
        return results && results[1] ? results[1] : null;
    };

    if ($.urlParam('compare')) {
        // URL Parameter ?compare=1 is set
        $('#compareAllWithPredecessor').trigger('click');
    }

    /**
     * Quick jump on page load to hash position.
     * Should happen after setting the main version
     * and after triggering the click on the compare button,
     * as these actions modify the content
     * and would make it jump to the wrong position or not jump at all.
     */
    if (window.location.hash) {
        const id = decodeURI(window.location.hash);
        if ($(id).length > 0) {
            $('html,body').animate({ scrollTop: parseInt($(id).offset().top) }, 0);
        }
    }

    /**
     * Off-Canvas side toggle navigation
     */
    const offcanvasToggle = document.querySelector('[data-toggle="offcanvas"]');
    if (offcanvasToggle) {
        offcanvasToggle.addEventListener('click', function () {
            const row = document.querySelector('.row-offcanvas');
            if (row) {
                row.classList.toggle('active');
            }
        });
    }

    /**
     * Set initial focus to navbar search input
     */
    const navbarSearchInput = document.getElementById('navbar-search');
    if (navbarSearchInput) {
        navbarSearchInput.focus();

        /**
         * Navbar search functionality with delay to prevent issues with very large projects
         */
        let searchTimeout;
        navbarSearchInput.addEventListener('input', (event) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = event.target.value.toLowerCase();

                // Search all navigation items
                const navItems = document.querySelectorAll('.sidebar-nav-item[data-action="select-item"]');
                const groupHeaders = document.querySelectorAll('.sidebar-nav-item.nav-header');

                // Track which groups have visible items
                const visibleGroups = new Set();

                navItems.forEach((item) => {
                    const text = item.textContent.toLowerCase();
                    const matches = query === '' || text.indexOf(query) > -1;
                    if (matches) {
                        item.style.removeProperty('display');
                        // Track which group this item belongs to
                        const group = item.getAttribute('data-group');
                        if (group) {
                            visibleGroups.add(group);
                        }
                    } else {
                        item.style.setProperty('display', 'none', 'important');
                    }
                });

                // Show/hide group headers based on whether they have visible items
                groupHeaders.forEach((header) => {
                    const group = header.getAttribute('data-group');
                    if (query === '' || visibleGroups.has(group)) {
                        header.style.removeProperty('display');
                    } else {
                        header.style.setProperty('display', 'none', 'important');
                    }
                });
            }, 200);
        });

        // Keyboard shortcut ⌘K (Cmd+K on Mac, Ctrl+K on PC)
        document.addEventListener('keydown', function (e) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                navbarSearchInput.focus();
            }
        });
    }

    /**
     * Search reset (if reset button exists)
     */
    const searchResetBtn = document.querySelector('span.search-reset');
    if (searchResetBtn) {
        searchResetBtn.addEventListener('click', function () {
            const navbarSearchInput = document.getElementById('navbar-search');
            if (navbarSearchInput) {
                navbarSearchInput.value = '';
                navbarSearchInput.dispatchEvent(new Event('input'));
                navbarSearchInput.focus();

                // Show all navigation items and headers
                const navItems = document.querySelectorAll('.sidebar-nav-item[data-action="select-item"]');
                const groupHeaders = document.querySelectorAll('.sidebar-nav-item.nav-header');

                navItems.forEach((item) => {
                    item.style.removeProperty('display');
                });

                groupHeaders.forEach((header) => {
                    header.style.removeProperty('display');
                });
            }
        });
    }

    /**
     * Executing the callback after the specified delay.
     * Resets the timer if called again before the delay is reached.
     *
     * Behavior to prevent too many events from being triggered and getting stuck.
     * @param {Function} callback - Function to be executed once the timeout is completed.
     * @param {number} [delay] - Delay in milliseconds for the timeout. Defaults to zero.
     * @returns {Function} A debounced function that resets the timeout every time it is invoked.
     */
    function resetTableTimeout(callback, delay) {
        let timer = null;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(callback.bind(this, ...args), delay || 0);
        };
    }

    /**
     * Change version of an article and compare it to another version.
     * @param {Event} e - Event object
     */
    function changeVersionCompareTo(e) {
        e.preventDefault();

        const $root = $(this).parents('article');
        const selectedVersion = $(this).html();
        const $button = $root.find('.version');
        const currentVersion = $button.find('strong').html();
        $button.find('strong').html(selectedVersion);

        const group = $root.data('group');
        const name = $root.data('name');
        const version = $root.data('version');

        const compareVersion = $root.data('compare-version');

        if (compareVersion === selectedVersion) {
            return;
        }

        if (!compareVersion && version === selectedVersion) {
            return;
        }

        if ((compareVersion && articleVersions[group][name][0] === selectedVersion) || version === selectedVersion) {
            // the version of the entry is set to the highest version (reset)
            resetArticle(group, name, version);
        } else {
            let sourceEntry = {};
            let compareEntry = {};

            // First pass: find entries matching versions
            const candidateCompareEntries = [];
            $.each(apiByGroupAndName[group][name], function (index, entry) {
                if (entry.version === version) {
                    sourceEntry = entry;
                }
                if (entry.version === selectedVersion) {
                    candidateCompareEntries.push(entry);
                }
            });

            // Second pass: prefer non-warning entries
            if (candidateCompareEntries.length > 0) {
                // First try to find an entry that doesn't have "Missing" in the title
                compareEntry = candidateCompareEntries.find((entry) => !entry.title || !entry.title.includes('Missing'));

                // If no non-warning entry found, take the first one
                if (!compareEntry) {
                    compareEntry = candidateCompareEntries[0];
                }
            }

            const fields = {
                article: sourceEntry,
                compare: compareEntry,
                versions: articleVersions[group][name],
            };

            // add unique id
            // TODO: replace all group-name-version in template with id.
            fields.article.id = fields.article.group + '-' + fields.article.name + '-' + fields.article.version;
            fields.article.id = fields.article.id.replace(/\./g, '_');

            fields.compare.id = fields.compare.group + '-' + fields.compare.name + '-' + fields.compare.version;
            fields.compare.id = fields.compare.id.replace(/\./g, '_');

            let entry = sourceEntry;
            if (entry.header && entry.header.fields) {
                fields._hasTypeInHeaderFields = _hasTypeInFields(entry.header.fields);
            }

            if (entry.parameter && entry.parameter.fields) {
                fields._hasTypeInParameterFields = _hasTypeInFields(entry.parameter.fields);
            }

            if (entry.error && entry.error.fields) {
                fields._hasTypeInErrorFields = _hasTypeInFields(entry.error.fields);
            }

            if (entry.success && entry.success.fields) {
                fields._hasTypeInSuccessFields = _hasTypeInFields(entry.success.fields);
            }

            if (entry.info && entry.info.fields) {
                fields._hasTypeInInfoFields = _hasTypeInFields(entry.info.fields);
            }

            entry = compareEntry;
            if (fields._hasTypeInHeaderFields !== true && entry.header && entry.header.fields) {
                fields._hasTypeInHeaderFields = _hasTypeInFields(entry.header.fields);
            }

            if (fields._hasTypeInParameterFields !== true && entry.parameter && entry.parameter.fields) {
                fields._hasTypeInParameterFields = _hasTypeInFields(entry.parameter.fields);
            }

            if (fields._hasTypeInErrorFields !== true && entry.error && entry.error.fields) {
                fields._hasTypeInErrorFields = _hasTypeInFields(entry.error.fields);
            }

            if (fields._hasTypeInSuccessFields !== true && entry.success && entry.success.fields) {
                fields._hasTypeInSuccessFields = _hasTypeInFields(entry.success.fields);
            }

            if (fields._hasTypeInInfoFields !== true && entry.info && entry.info.fields) {
                fields._hasTypeInInfoFields = _hasTypeInFields(entry.info.fields);
            }

            const content = templateCompareArticle(fields);
            $root.after(content);
            const $content = $root.next();

            // Event on.click re-assign
            $content.find('.versions .version').on('click', changeVersionCompareTo);

            // Hide all other versions of the same article when comparison is active
            $(`article[data-group='${group}'][data-name='${name}']:not([data-compare-version])`).addClass('hide');

            // select navigation
            $(`#sidenav li[data-group='${group}'][data-name='${name}'][data-version='${currentVersion}']`).addClass('has-modifications');

            $root.remove();
            // TODO: on change main version or select the highest version re-render
        }

        initDynamic();
        hljs.highlightAll();
    }

    /**
     * Compare all currently selected Versions with their predecessor.
     *
     * Iterates over all visible articles with versions, compares their versions,
     * and triggers a click event on the appropriate version element if conditions are met.
     * @param {Event} e - Event object
     */
    function changeAllVersionCompareTo(e) {
        e.preventDefault();
        $('article:visible .versions').each(function () {
            const $root = $(this).parents('article');
            const currentVersion = $root.data('version');
            let $foundElement = null;
            $(this)
                .find('a.version')
                .each(function () {
                    const selectVersion = $(this).html();
                    if (selectVersion < currentVersion && !$foundElement) {
                        $foundElement = $(this);
                    }
                });

            if ($foundElement) {
                $foundElement.trigger('click');
            }
        });

        // Close the main dropdown after executing
        $('#versions').removeClass('open show');
    }

    /**
     * Change all visible articles to compare with a specific version.
     * @param {string} targetVersion - The version to compare all articles with
     */
    function changeAllVersionCompareTo(targetVersion) {
        // If targetVersion is an event object, handle as before (predecessor logic)
        if (typeof targetVersion === 'object' && targetVersion.preventDefault) {
            const e = targetVersion;
            e.preventDefault();
            $('article:visible .versions').each(function () {
                const $root = $(this).parents('article');
                const currentVersion = $root.data('version');
                let $foundElement = null;
                $(this)
                    .find('a.version')
                    .each(function () {
                        const selectVersion = $(this).html();
                        if (selectVersion < currentVersion && !$foundElement) {
                            $foundElement = $(this);
                        }
                    });

                if ($foundElement) {
                    $foundElement.trigger('click');
                }
            });

            // Close the main dropdown after executing
            $('#versions').removeClass('open show');
            return;
        }

        // Handle specific version comparison
        $('article:visible .versions').each(function () {
            const $root = $(this).parents('article');
            const currentVersion = $root.data('version');

            // Only compare if current version is different from target version
            if (currentVersion !== targetVersion) {
                let $foundElement = null;
                $(this)
                    .find('a.version')
                    .each(function () {
                        const selectVersion = $(this).html();
                        if (selectVersion === targetVersion && !$foundElement) {
                            $foundElement = $(this);
                        }
                    });

                if ($foundElement) {
                    $foundElement.trigger('click');
                }
            }
        });
    }

    /**
     * Add article settings to the provided fields.
     *
     * Modifies/mutates the `fields` object in place.
     * @param {object} fields - Article fields object to which settings and properties will be added.
     * @param {object} entry - Entry data containing various field groups such as header, parameter, error, success, and info.
     */
    function addArticleSettings(fields, entry) {
        // add unique id
        // TODO: replace all group-name-version in template with id.
        fields.id = fields.article.group + '-' + fields.article.name + '-' + fields.article.version;
        fields.id = fields.id.replace(/\./g, '_');

        if (entry.header && entry.header.fields) {
            fields._hasTypeInHeaderFields = _hasTypeInFields(entry.header.fields);
        }

        if (entry.parameter && entry.parameter.fields) {
            fields._hasTypeInParameterFields = _hasTypeInFields(entry.parameter.fields);
        }

        if (entry.error && entry.error.fields) {
            fields._hasTypeInErrorFields = _hasTypeInFields(entry.error.fields);
        }

        if (entry.success && entry.success.fields) {
            fields._hasTypeInSuccessFields = _hasTypeInFields(entry.success.fields);
        }

        if (entry.info && entry.info.fields) {
            fields._hasTypeInInfoFields = _hasTypeInFields(entry.info.fields);
        }

        // add template settings
        fields.template = apiProject.template;
    }

    /**
     * Render an article based on the specified group, name, and version.
     * @param {string} group - Group identifier for the article.
     * @param {string} name - Name identifier for the article.
     * @param {string} version - Version of the article to render.
     * @returns {string} Rendered article string.
     */
    function renderArticle(group, name, version) {
        let entry = {};
        $.each(apiByGroupAndName[group][name], function (index, currentEntry) {
            if (currentEntry.version === version) {
                entry = currentEntry;
            }
        });
        const fields = {
            article: entry,
            versions: articleVersions[group][name],
        };

        addArticleSettings(fields, entry);

        return templateArticle(fields);
    }

    /**
     * Render original Article and remove the current visible Article.
     * @param group
     * @param name
     * @param version
     */
    /**
     * Render the original Article and remove the current visible Article.
     *
     * Resets the content by replacing it with the newly rendered version and
     * reassigning necessary event handlers.
     * @param {string} group Group identifier for the article.
     * @param {string} name Name identifier for the article.
     * @param {string} version Version identifier for the article.
     */
    function resetArticle(group, name, version) {
        const $root = $(`article[data-group='${group}'][data-name='${name}']:visible`);
        const content = renderArticle(group, name, version);

        $root.after(content);
        const $content = $root.next();

        // Event on.click needs to be reassigned (should actually work with on ... automatically)
        $content.find('.versions a.version').on('click', changeVersionCompareTo);

        // Show other versions again when exiting comparison mode
        $(`article[data-group='${group}'][data-name='${name}']`).removeClass('hide');

        $(`#sidenav li[data-group='${group}'][data-name='${name}'][data-version='${version}']`).removeClass('has-modifications');

        $root.remove();
    }

    /**
     * Return ordered entries by custom order and append not-defined entries to the end.
     * @param {Array<string>} elements - Array of elements to be sorted.
     * @param {Array<string>} order - Array representing the desired order of elements.
     * @param {string} [splitBy] - Optional delimiter used to split elements
     * @returns {Array<string>} Custom ordered list.
     */
    function sortByOrder(elements, order, splitBy) {
        const results = [];
        order.forEach(function (name) {
            if (splitBy) {
                elements.forEach(function (element) {
                    const parts = element.split(splitBy);
                    const key = parts[0]; // reference keep for sorting
                    if (key === name || parts[1] === name) {
                        results.push(element);
                    }
                });
            } else {
                elements.forEach(function (key) {
                    if (key === name) {
                        results.push(name);
                    }
                });
            }
        });
        // Append all other entries that are not defined in order
        elements.forEach(function (element) {
            if (results.indexOf(element) === -1) {
                results.push(element);
            }
        });
        return results;
    }

    /**
     * Return ordered groups by custom order and append not-defined groups to the end.
     *
     * Sorts the keys of a groups object in a specific order defined by the order array.
     * Any keys not defined in the order array will appear at the end.
     * @param {object} groups - Object where keys represent group names and values are
     *     strings potentially containing underscores.
     * @param {Array<string>} order - Array of strings defining the desired sort order.
     *     Strings should match the values in the groups object after replacing
     *     underscores with spaces.
     * @returns {Array<string>} Custom ordered list.
     */
    function sortGroupsByOrder(groups, order) {
        const results = [];
        order.forEach((sortKey) => {
            Object.keys(groups).forEach((name) => {
                if (groups[name].replace(/_/g, ' ') === sortKey) {
                    results.push(name);
                }
            });
        });
        // Append all other entries that are not defined in order
        Object.keys(groups).forEach((name) => {
            if (results.indexOf(name) === -1) {
                results.push(name);
            }
        });
        return results;
    }

    initDynamic();

    // Theme toggle setup moved to DOMContentLoaded

    // Version selector functionality
    const versionSelect = document.getElementById('version-select');
    if (versionSelect) {
        // Populate version selector from existing versions
        const versionsList = document.querySelectorAll('#versions a.version');
        if (versionsList.length > 0) {
            versionsList.forEach((versionLink) => {
                const version = versionLink.textContent.trim();
                const option = document.createElement('option');
                option.value = version;
                option.textContent = version;
                versionSelect.appendChild(option);
            });

            // Set current version as selected
            const currentVersion = document.querySelector('#version strong')?.textContent.trim();
            if (currentVersion) {
                versionSelect.value = currentVersion;
            }

            // Handle version changes
            versionSelect.addEventListener('change', function (e) {
                const selectedVersion = e.target.value;
                if (selectedVersion) {
                    setMainVersion(selectedVersion);
                }
            });
        }
    }

    // Navigation dropdown functionality
    function initNavigationDropdowns() {
        const dropdownToggles = document.querySelectorAll('.nav-group-toggle');

        dropdownToggles.forEach((toggle) => {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();

                const group = this.getAttribute('data-group');
                const dropdownItems = document.querySelector(`[data-group-items="${group}"]`);
                const arrow = this.querySelector('.nav-group-arrow');
                const isExpanded = this.getAttribute('aria-expanded') === 'true';

                if (dropdownItems) {
                    if (isExpanded) {
                        // Collapse
                        dropdownItems.style.display = 'none';
                        this.setAttribute('aria-expanded', 'false');
                        arrow?.classList.remove('expanded');
                    } else {
                        // Expand
                        dropdownItems.style.display = 'block';
                        this.setAttribute('aria-expanded', 'true');
                        arrow?.classList.add('expanded');
                    }
                }
            });
        });
    }

    // Initialize dropdown functionality after content is loaded
    setTimeout(initNavigationDropdowns, 100);

    // Initialize Bootstrap dropdowns and fix their default state
    initBootstrapDropdowns();
}

/**
 * Process any remaining Handlebars templates in the DOM.
 * This function looks for unprocessed template syntax and compiles it.
 */
function processRemainingTemplates() {
    try {
        // Get API data for template compilation
        const api = typeof window.API_DATA === 'string' ? JSON.parse(window.API_DATA) : window.API_DATA || [];
        const apiProject = typeof window.API_PROJECT === 'string' ? JSON.parse(window.API_PROJECT) : window.API_PROJECT || {};

        // Look for elements that contain unprocessed Handlebars templates
        const elementsWithTemplates = document.querySelectorAll('*');
        let processedCount = 0;

        elementsWithTemplates.forEach((element) => {
            // Skip script and style tags completely
            if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
                return;
            }

            // Skip elements that have script templates as children
            if (element.querySelector('script[type="text/x-handlebars-template"]')) {
                return;
            }

            // Check if element contains Handlebars syntax but is not a template
            if (element.innerHTML.includes('{{') && element.innerHTML.includes('}}')) {
                try {
                    // Compile and render the template
                    const template = Handlebars.compile(element.innerHTML);
                    const rendered = template({ api, apiProject });
                    element.innerHTML = rendered;
                    processedCount++;
                } catch (error) {
                    console.warn('Error processing template in element:', element, error);
                }
            }
        });

        if (processedCount > 0) {
            console.log(`Processed ${processedCount} remaining templates`);
            // Re-highlight code after template processing
            if (typeof hljs !== 'undefined') {
                hljs.highlightAll();
            }
        }
    } catch (error) {
        console.error('Error in processRemainingTemplates:', error);
    }
}

/**
 * Initialize Bootstrap dropdowns and fix their default state
 */
function initBootstrapDropdowns() {
    try {
        console.log('🔧 Initializing Bootstrap 5 components...');

        // Initialize all dropdown toggles with Bootstrap 5
        const dropdownToggleList = document.querySelectorAll('.dropdown-toggle');
        const dropdownList = Array.from(dropdownToggleList).map((dropdownToggleEl) => {
            return new Dropdown(dropdownToggleEl);
        });

        // Initialize tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = Array.from(tooltipTriggerList).map((tooltipTriggerEl) => {
            return new Tooltip(tooltipTriggerEl);
        });

        // Initialize popovers
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        const popoverList = Array.from(popoverTriggerList).map((popoverTriggerEl) => {
            return new Popover(popoverTriggerEl);
        });

        // Initialize tabs
        const tabTriggerList = document.querySelectorAll('[data-bs-toggle="tab"]');
        const tabList = Array.from(tabTriggerList).map((tabTriggerEl) => {
            return new Tab(tabTriggerEl);
        });

        console.log(`✅ Bootstrap 5 initialized: ${dropdownList.length} dropdowns, ${tooltipList.length} tooltips, ${popoverList.length} popovers, ${tabList.length} tabs`);

        // Custom event handlers for specific functionality
        initCustomDropdownHandlers();

    } catch (error) {
        console.error('Error initializing Bootstrap 5 components:', error);
        // Fallback to manual implementation
        initManualDropdownFallback();
    }
}

/**
 * Initialize custom dropdown event handlers for version selection
 */
function initCustomDropdownHandlers() {
    // Handle version dropdown clicks
    const versionDropdown = document.getElementById('version');
    if (versionDropdown) {
        versionDropdown.addEventListener('show.bs.dropdown', function () {
            console.log('🔄 Main version dropdown opened');
        });
    }

    // Handle article version dropdowns
    document.addEventListener('show.bs.dropdown', function (e) {
        if (e.target.closest('article') && e.target.classList.contains('dropdown-toggle')) {
            console.log('🔄 Article version dropdown opened');
        }
    });
}

/**
 * Manual dropdown implementation as fallback
 */
function initManualDropdownFallback() {
    console.warn('Using manual dropdown fallback');

    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const parent = this.closest('.dropdown');
            const menu = parent?.querySelector('.dropdown-menu');

            if (menu && parent) {
                // Close all other open dropdowns
                document.querySelectorAll('.dropdown.show').forEach((otherParent) => {
                    if (otherParent !== parent) {
                        otherParent.classList.remove('show');
                    }
                });

                // Toggle this dropdown
                parent.classList.toggle('show');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function () {
        document.querySelectorAll('.dropdown.show').forEach((parent) => {
            parent.classList.remove('show');
        });
    });
}
