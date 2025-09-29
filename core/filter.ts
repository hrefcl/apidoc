/*
 * apidocts
 * https://apidoc.app
 * https://apidoc.app
 * Href Spa API Doc (TypeScript version)
 *
 * Author: Href Spa <hola@apidoc.app>
 * Copyright (c) 2025 Href SpA
 * Licensed under the MIT license.
 *
 * This project is a TypeScript refactor inspired by the original apidoc project.
 */

import _ from 'lodash';
import util from 'util';

let app: any = {};

/**
 * Responsible for loading filters across the application.
 *
 * Clean up the data, e.g.: remove double fields. This happens when overwriting a global
 * inherited field with a local definition.
 *
 * @param _app - Application instance
 * @class
 */
function Filter(_app) {
    const self = this;

    // global variables
    app = _app;

    // class variables
    this.filters = {};

    // load filters
    const filters = Object.keys(app.filters);
    filters.forEach(function (filter) {
        if (_.isObject(app.filters[filter])) {
            app.log.debug('inject filter: ' + filter);
            self.addFilter(filter, app.filters[filter]);
        } else {
            const filename = app.filters[filter];
            app.log.debug('load filter: ' + filter + ', ' + filename);
            self.addFilter(filter, require(filename));
        }
    });
}

/**
 * Inherit
 */
util.inherits(Filter, Object);

/**
 * Add Filter
 *
 * @param name - Filter name
 * @param filter
 * @memberof Filter
 */
Filter.prototype.addFilter = function (name, filter) {
    this.filters[name] = filter;
};

/**
 * Execute filter
 *
 * @param parsedFiles - Array of parsed files
 * @param parsedFilenames - Array of parsed filenames
 * @returns {Array<object>} - Array of filtered blocks
 * @memberof Filter
 */
Filter.prototype.process = function (parsedFiles, parsedFilenames) {
    // filter each @api-Parameter
    _.each(this.filters, function (filter, name) {
        if (filter.postFilter) {
            app.log.verbose('filter postFilter: ' + name);
            filter.postFilter(parsedFiles, parsedFilenames);
        }
    });

    // reduce to local blocks where global is empty
    const blocks = [];
    parsedFiles.forEach(function (parsedFile) {
        parsedFile.forEach(function (block) {
            if (Object.keys(block.global).length === 0 && Object.keys(block.local).length > 0) {
                blocks.push(block.local);
            }
        });
    });
    return blocks;
};

/**
 * Exports
 */
export default Filter;
