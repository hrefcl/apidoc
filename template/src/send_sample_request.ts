/*
 * apidocts
 * https://apidocts.com
 * https://apidoc.app
 * Href Spa API Doc (TypeScript version)
 *
 * Author: Href Spa <hola@apidoc.app>
 * Copyright (c) 2025 Href SpA
 * Licensed under the MIT license.
 *
 * This project is a TypeScript refactor inspired by the original apidoc project.
 */

import $ from 'jquery';
import { UrlProcessor } from './sampreq_url_processor';

/**
 * Highlight.js is the modern syntax highlighting library
 */
import hljs from 'highlight.js';

/**
 * Initialize event listeners for sample request buttons, enabling the send and clear functionality.
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
 * Convert path params in the {param} format to the accepted :param format,
 *
 * Converts path parameters in a URL from curly brace notation to colon notation.
 * For example, replaces `{param}` with `:param`. Used before inserting the URL params.
 * @param {string} url - URL containing path parameters in curly brace notation.
 * @returns {string} URL with path parameters converted to colon notation.
 */
function convertPathParams(url) {
    return url.replace(/{(.+?)}/g, ':$1');
}

/**
 * Process a base URL with path parameters and query parameters and return a hydrated URL.
 *
 * For example, https://example.org/:path/:id in https://example.org/some-path/42
 * Based on query parameters collected
 * @param {object} root - Root DOM element to find the user-inputted URL.
 * @param {object} queryParameters - Key-value pairs to use for hydrating the URL.
 * @returns {string} - Hydrated URL with query parameters applied.
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
 * Collect and organize input values from a given DOM root element based on specified
 * data-family attributes.
 *
 * - Grabs values from different inputs
 * - The url in this object is already hydrated from query parameters
 * @param {object} root - DOM root element to collect values from. Expected to use jQuery for DOM
 *     traversal and manipulation.
 * @returns {{
 *     header: { name: string, value: * },
 *     query: { name: string, value: * },
 *     body: { name: string, value: * },
 *     url: string }} Object containing collected parameters organized by family types ('header',
 *     'query', 'body'), including additional processing for checkboxes and optional fields.
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
 * Send a sample HTTP request based on provided parameters and display the response.
 * @param {string} group - Group of the sample request, used to locate the corresponding
 *     request element in the DOM.
 * @param {string} name - Name of the sample request, used to locate the corresponding
 *     request element in the DOM.
 * @param {string} version - Version of the sample request, used to locate the
 *     corresponding request element in the DOM.
 * @param {string} method - HTTP method to use for the request (e.g., GET, POST, PUT, DELETE).
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
 * Clear the sample request section for a specific API endpoint.
 *
 * Includes resetting parameter inputs, hiding response elements, and restoring the default
 * request URL.
 * @param {string} group - Group name of the API endpoint.
 * @param {string} name - Name of the API endpoint.
 * @param {string} version - Version of the API endpoint.
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
