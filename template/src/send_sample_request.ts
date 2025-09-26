/**
 * @file Sample Request Handler for APIDoc Template
 *
 * Provides interactive sample request functionality for API documentation.
 * Enables users to test API endpoints directly from the documentation interface
 * with form-based parameter input and real-time response display.
 *
 * Features:
 * - Interactive form-based API testing
 * - Real-time parameter validation
 * - Response formatting and syntax highlighting
 * - Support for headers, query parameters, and request bodies
 * - URL parameter substitution and hydration
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 4.0.0
 * @internal
 */

import $ from 'jquery';
import { UrlProcessor } from './sampreq_url_processor';

/**
 * Highlight.js is the modern syntax highlighting library
 */
import hljs from 'highlight.js';

/**
 * Initialize interactive sample request functionality
 *
 * Sets up event listeners for sample request buttons across all API endpoints
 * in the documentation. Enables users to send test requests and clear forms.
 * Must be called after the DOM is ready and API documentation is rendered.
 *
 * @example Usage in template initialization
 * ```typescript
 * $(document).ready(() => {
 *   initSampleRequest();
 *   // Other initialization code...
 * });
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function initSampleRequest() {
    // Button send
    $('.sample-request-send').off('click');
    $('.sample-request-send').on('click', function (e) {
        e.preventDefault();
        const root = $(this).parents('article');
        const group = root.data('group');
        const name = root.data('name');
        const version = root.data('version');
        sendSampleRequest(group, name, version, $(this).data('type'));
    });

    // Button clear
    $('.sample-request-clear').off('click');
    $('.sample-request-clear').on('click', function (e) {
        e.preventDefault();
        const root = $(this).parents('article');
        const group = root.data('group');
        const name = root.data('name');
        const version = root.data('version');
        clearSampleRequest(group, name, version);
    });
}

/**
 * Convert path parameters from {param} to :param format
 *
 * Transforms URL path parameters from curly brace notation to colon notation
 * for compatibility with the URL processor. This is required before parameter
 * substitution can be performed.
 *
 * @param url - URL string containing path parameters in curly brace notation
 * @returns URL string with path parameters converted to colon notation
 *
 * @example Basic conversion
 * ```typescript
 * convertPathParams('/users/{id}/posts/{postId}')
 * // Returns: '/users/:id/posts/:postId'
 * ```
 *
 * @example No parameters
 * ```typescript
 * convertPathParams('/users')
 * // Returns: '/users'
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function convertPathParams(url) {
    return url.replace(/{(.+?)}/g, ':$1');
}

/**
 * Generate a complete URL with substituted parameters from user input
 *
 * Takes a base URL template and replaces path parameters with actual values
 * collected from the form. Also appends query parameters as needed.
 * The URL is retrieved from the sample request form in the DOM.
 *
 * @param root - jQuery DOM element containing the sample request form
 * @param queryParameters - Object containing parameter name-value pairs for URL hydration
 * @returns Complete URL string with all parameters substituted
 *
 * @example URL parameter substitution
 * ```typescript
 * // Form contains URL: '/users/:id/posts/:postId'
 * // Parameters: { id: '123', postId: '456', limit: '10' }
 * getHydratedUrl(formRoot, parameters)
 * // Returns: '/users/123/posts/456?limit=10'
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function getHydratedUrl(root, queryParameters) {
    // grab user-inputted URL
    const dryUrl = root.find('.sample-request-url').val();
    const UrlProc = new UrlProcessor();
    // Convert {param} form to :param
    // TODO check if this is necessary, do we have urls with {param} in it?
    const url = convertPathParams(dryUrl);
    return UrlProc.hydrate(url, queryParameters);
}

/**
 * Collect all form input values organized by parameter type
 *
 * Scans the sample request form and extracts all user-entered values,
 * organizing them by parameter family (header, query, body). Handles
 * special input types like checkboxes and provides proper value conversion.
 *
 * @param root - jQuery DOM element containing the sample request form
 * @returns Object containing organized parameter values and hydrated URL
 *
 * @example Collected values structure
 * ```typescript
 * const values = collectValues(formRoot);
 * // Returns:
 * {
 *   header: { 'Authorization': 'Bearer token', 'Content-Type': 'application/json' },
 *   query: { 'limit': '10', 'offset': '0' },
 *   body: { 'name': 'John', 'email': 'john@example.com' },
 *   url: '/users/123?limit=10&offset=0'
 * }
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function collectValues(root) {
    const parameters = {};
    ['header', 'query', 'body'].forEach((family) => {
        // key: parameter name (e.g. 'id'), value: the content of the input
        const inputValues = {};
        // look for all parameters
        try {
            root.find($('[data-family="' + family + '"]:visible')).each((index, el) => {
                const name = el.dataset.name;
                let value = el.value;
                // special case for checkbox, we look at the checked property
                if (el.type === 'checkbox') {
                    if (el.checked) {
                        value = 'on';
                    } else {
                        // don't send anything for checkbox if it's not checked
                        // without this an empty string will be sent along
                        return true;
                    }
                }
                if (!value && !el.dataset.optional && el.type !== 'checkbox') {
                    $(el).addClass('border-danger');
                    return true;
                }
                inputValues[name] = value;
            });
        } catch (e) {
            return;
        }
        parameters[family] = inputValues;
    });
    // find the json body
    const bodyJson = root.find('[data-family="body-json"]');
    // load it if it's visible
    if (bodyJson.is(':visible')) {
        parameters.body = bodyJson.val();
        parameters.header['Content-Type'] = 'application/json';
    } else {
        parameters.header['Content-Type'] = 'multipart/form-data';
    }
    return parameters;
}

/**
 * Execute a sample API request and display the response
 *
 * Collects form data, builds an HTTP request, sends it to the API endpoint,
 * and displays the formatted response in the documentation interface.
 * Handles different content types and provides syntax-highlighted output.
 *
 * @param group - API group identifier for DOM element selection
 * @param name - API endpoint name for DOM element selection
 * @param version - API version for DOM element selection
 * @param method - HTTP method to use for the request
 *
 * @example Send a sample request
 * ```typescript
 * // Triggered by clicking "Send" button on a GET /users/:id endpoint
 * sendSampleRequest('User', 'GetUser', '1.0.0', 'GET');
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function sendSampleRequest(group, name, version, method) {
    // root is the current sample request block, all is scoped within this block
    const root = $('article[data-group="' + group + '"][data-name="' + name + '"][data-version="' + version + '"]');

    const parameters = collectValues(root);

    // build the object that will be passed to jquery's ajax function
    const requestParams = {};
    // assign the hydrated url
    requestParams.url = getHydratedUrl(root, parameters.query);

    // assign the headers
    requestParams.headers = parameters.header;

    if (requestParams.headers['Content-Type'] === 'application/json') {
        // TODO check json is valid?
        // or maybe have a direct feedback on the textarea onkeypress for valid/invalid json
        requestParams.data = parameters.body;
    } else if (requestParams.headers['Content-Type'] === 'multipart/form-data') {
        const formData = new FormData();
        // Note: here we don't try to handle nested fields for form-data because it doesn't make sense
        // if you need to send non-flat data, use json, not form-data which is a flat key/value structure
        for (const [name, value] of Object.entries(parameters.body)) {
            formData.append(name, value);
        }
        requestParams.data = formData;
        requestParams.processData = false;
        // With no content-type header, browser will know it needs to generate a proper content-type for
        // the form data when sending it. Fix #1122
        delete requestParams.headers['Content-Type'];
        // As of jQuery 1.6 you can pass false to tell jQuery to not set any content type header.
        // https://api.jquery.com/jquery.ajax/
        requestParams.contentType = false;
    }

    requestParams.type = method;
    requestParams.success = displaySuccess;
    requestParams.error = displayError;

    // Do the request!
    $.ajax(requestParams);

    root.find('.sample-request-response').fadeTo(200, 1);
    root.find('.sample-request-response-json').html('Loading...');

    /**
     * Parse and format JSON then update the corresponding UI element.
     * @param {object} data - Data returned from AJAX success
     * @param {string} status - Status of AJAX request
     * @param {object} jqXHR - jQuery XMLHttpRequest object. Should contain the full server response,
     *    including responseText and headers.
     */
    function displaySuccess(data, status, jqXHR) {
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(jqXHR.responseText);
            jsonResponse = JSON.stringify(jsonResponse, null, 4);
        } catch (e) {
            jsonResponse = jqXHR.responseText;
        }
        root.find('.sample-request-response-json').text(jsonResponse);
        hljs.highlightAll();
    }

    /**
     * Display an error message with detailed information about the error response.
     * @param {object} jqXHR - jQuery XMLHttpRequest object
     * @param {string} textStatus - A string description of the error type.
     * @param {string} error - Text description, or error message
     */
    function displayError(jqXHR, textStatus, error) {
        let message = 'Error ' + jqXHR.status + ': ' + error;
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(jqXHR.responseText);
            jsonResponse = JSON.stringify(jsonResponse, null, 4);
        } catch (e) {
            jsonResponse = jqXHR.responseText;
        }

        if (jsonResponse) {
            message += '\n' + jsonResponse;
        }

        // flicker on previous error to make clear that there is a new response
        if (root.find('.sample-request-response').is(':visible')) {
            root.find('.sample-request-response').fadeTo(1, 0.1);
        }

        root.find('.sample-request-response').fadeTo(250, 1);
        root.find('.sample-request-response-json').text(message);
        hljs.highlightAll();
    }
}

/**
 * Reset the sample request form to its initial state
 *
 * Clears all user input from the sample request form, hides response
 * sections, and restores default values. Provides a clean slate for
 * testing different parameter combinations.
 *
 * @param group - API group identifier for DOM element selection
 * @param name - API endpoint name for DOM element selection
 * @param version - API version for DOM element selection
 *
 * @example Clear a sample request form
 * ```typescript
 * // Triggered by clicking \"Clear\" button
 * clearSampleRequest('User', 'GetUser', '1.0.0');
 * ```
 *
 * @since 4.0.0
 * @internal
 */
function clearSampleRequest(group, name, version) {
    const root = $('article[data-group="' + group + '"][data-name="' + name + '"][data-version="' + version + '"]');

    // hide sample response
    root.find('.sample-request-response-json').html('');
    root.find('.sample-request-response').hide();

    // reset value of parameters
    root.find('.sample-request-input').each((idx, el) => {
        // placeholder is the name of the input if there are no default value
        // so replace by the placeholder if it's different (input has a default value)
        // or empty string if there is no default value
        el.value = el.placeholder !== el.dataset.name ? el.placeholder : '';
    });

    // restore default URL
    const $urlElement = root.find('.sample-request-url');
    $urlElement.val($urlElement.prop('defaultValue'));
}

export { initSampleRequest };
