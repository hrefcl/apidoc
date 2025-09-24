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

import _ from 'lodash';
import util from 'util';

let app: any = {};

/**
 * Set the provided app instance with worker modules.
 *
 * @param {object} _app Application instance
 * @class
 */
function Worker(_app) {
    const self = this;

    // global variables
    app = _app;

    // class variables
    this.workers = {};

    // load worker
    const workers = Object.keys(app.workers);
    workers.forEach(function (worker) {
        if (_.isObject(app.workers[worker])) {
            app.log.debug('inject worker: ' + worker);
            self.addWorker(worker, app.workers[worker]);
        } else {
            const filename = app.workers[worker];
            app.log.debug('load worker: ' + worker + ', ' + filename);
            self.addWorker(worker, require(filename));
        }
    });
}

/**
 * Inherit
 */
util.inherits(Worker, Object);

/**
 * Add a worker to the "workers" collection.
 *
 * @param {string} name - Name of the worker to be added.
 * @param {object} worker - Object assigned to the passed name.
 * @memberof Worker.prototype
 */
Worker.prototype.addWorker = function (name, worker) {
    this.workers[name] = worker;
};

/**
 * Execute worker
 *
 * Process parsed files, filenames, and package information to perform
 * transformations and assignments for global and local blocks.
 *
 * - Iterates over parsed file data to normalize and augment block information by ensuring required fields like `type`, `url`, `version`, and `filename` are populated.
 * - Applies transformations (e.g., converting directory delimiters to the standard format).
 * - Invokes pre-processing and post-processing steps for workers, allowing modular operations on the parsed data.
 *
 * @param {Array<Array<object>>} parsedFiles - Array of parsed files, where each file is an array of block objects with global and local configurations.
 * @param {Array<string>} parsedFilenames - Array of filenames corresponding to parsed files. Used to enrich block data with file-specific metadata.
 * @param {object} packageInfos - An object containing package-level information, such as the default version, used to populate block data when specific fields are not provided.
 * @memberof Worker.prototype
 * @todo Add priority system (if needed), if a plugin need an other operation to be done before.
 */
Worker.prototype.process = function (parsedFiles, parsedFilenames, packageInfos) {
    // some smaller operation that are not outsourced to extra workers
    // TODO: add priority system first and outsource them then
    parsedFiles.forEach(function (parsedFile, fileIndex) {
        parsedFile.forEach(function (block) {
            if (Object.keys(block.global).length === 0 && Object.keys(block.local).length > 0) {
                if (!block.local.type) {
                    block.local.type = '';
                }

                if (!block.local.url) {
                    block.local.url = '';
                }

                if (!block.local.version) {
                    block.local.version = packageInfos.defaultVersion;
                }

                if (!block.local.filename) {
                    block.local.filename = parsedFilenames[fileIndex];
                }

                // convert dir delimiter \\ to /
                block.local.filename = block.local.filename.replace(/\\/g, '/');
            }
        });
    });

    // process transformations and assignments for each @api-Parameter
    const preProcessResults = {};

    _.each(this.workers, function (worker, name) {
        if (worker.preProcess) {
            app.log.verbose('worker preProcess: ' + name);
            const result = worker.preProcess(parsedFiles, parsedFilenames, packageInfos);
            _.extend(preProcessResults, result);
        }
    });
    _.each(this.workers, function (worker, name) {
        if (worker.postProcess) {
            app.log.verbose('worker postProcess: ' + name);
            worker.postProcess(parsedFiles, parsedFilenames, preProcessResults, packageInfos);
        }
    });
};

/**
 * Exports
 */
export default Worker;
