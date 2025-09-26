import fs from 'fs-extra';
import klawSync from 'klaw-sync';
import os from 'os';
import path from 'path';

import { FileError } from '../errors/file_error';

/**
 * Search files recursively and filter with include and exclude filters
 *
 * @class
 */
function FindFiles() {
    this.path = process.cwd();
    this.excludeFilters = [];
    this.includeFilters = [];
}

/**
 * Set the base path for file search operations.
 *
 * Updates the internal path property to the specified directory.
 * Throws an error if the path is invalid or null.
 *
 * @param newPath - The directory path to set for searching files.
 * @memberof FindFiles
 */
FindFiles.prototype.setPath = function (newPath) {
    if (path) {
        this.path = path.resolve(newPath);
    }
};

/**
 * Sets the exclude filters.
 *
 * Exclude filters are patterns used to ignore files or directories during
 * a file search operation.
 *
 * @param excludeFilters - An array of exclude filters.
 *     Filters can include wildcards, regex patterns, or specific file/directory names to be excluded.
 * @memberof FindFiles
 */
FindFiles.prototype.setExcludeFilters = function (excludeFilters) {
    if (excludeFilters) {
        this.excludeFilters = excludeFilters;
    }
};

/**
 * Set the include filters.
 *
 * The include filters are patterns used to specify which files should
 * be included in the search. These patterns are strings or
 * regular expressions that match file names or paths.
 *
 * @param includeFilters - An array of filters to include files.
 *     Each filter can be a string or a regular expression.
 * @memberof FindFiles
 */
FindFiles.prototype.setIncludeFilters = function (includeFilters) {
    if (includeFilters) {
        this.includeFilters = includeFilters;
    }
};

/**
 * Search files recursively.
 *
 * @returns {Array<string>} An array of file paths matching the include filters and NOT excluded by the exclude filters.
 * @memberof FindFiles
 */
FindFiles.prototype.search = function () {
    const self = this;
    let files = [];

    try {
        files = klawSync(self.path).map(function (entry) {
            return entry.path;
        });

        // create RegExp Include Filter List
        const regExpIncludeFilters = [];
        let filters = self.includeFilters;
        if (typeof filters === 'string') {
            filters = [filters];
        }

        filters.forEach(function (filter) {
            if (filter.length > 0) {
                regExpIncludeFilters.push(new RegExp(filter));
            }
        });

        // RegExp Include Filter
        let length = regExpIncludeFilters.length;
        files = files.filter(function (filename) {
            // not include Directories like 'dirname.js/'
            if (fs.statSync(filename).isDirectory()) {
                return 0;
            }

            if (os.platform() === 'win32') {
                filename = filename.replace(/\\/g, '/');
            }

            // apply every filter
            for (let i = 0; i < length; i += 1) {
                if (regExpIncludeFilters[i].test(filename)) {
                    return 1;
                }
            }

            return 0;
        });

        // create RegExp Exclude Filter List
        const regExpExcludeFilters = [];
        filters = self.excludeFilters;
        if (typeof filters === 'string') {
            filters = [filters];
        }

        filters.forEach(function (filter) {
            if (filter.length > 0) {
                regExpExcludeFilters.push(new RegExp(filter));
            }
        });

        // RegExp Exclude Filter
        length = regExpExcludeFilters.length;
        files = files.filter(function (filename) {
            if (os.platform() === 'win32') {
                filename = filename.replace(/\\/g, '/');
            }

            // apply every filter
            for (let i = 0; i < length; i += 1) {
                if (regExpExcludeFilters[i].test(filename)) {
                    return 0;
                }
            }

            return 1;
        });
        if (!files || files.length === 0) {
            throw new FileError('No files found.', self.path);
        }
    } finally {
        // remove source path prefix
        files = files.map(function (filename) {
            if (filename.startsWith(self.path)) {
                return filename.substr(self.path.length + 1);
            }
            return filename;
        });
    }
    return files;
};

/**
 * Exports
 */
export default new FindFiles();
