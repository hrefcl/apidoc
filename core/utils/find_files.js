"use strict";
/**
 * @file File discovery and filtering utility for APIDoc
 *
 * Provides recursive file search capabilities with include/exclude
 * filtering for API documentation source file discovery. Supports
 * glob patterns and regex filtering for flexible file selection.
 *
 * @author Href Spa <hola@apidoc.app>
 * @copyright 2025 Href SpA
 * @license MIT
 * @since 4.0.0
 * @internal
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const klaw_sync_1 = __importDefault(require("klaw-sync"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const file_error_1 = require("../errors/file_error");
/**
 * File finder with recursive search and filtering capabilities
 *
 * Recursively searches directories for files matching specified patterns.
 * Supports both include and exclude filters with glob pattern matching.
 * Designed for discovering API documentation source files while excluding
 * unwanted directories like node_modules, tests, and build outputs.
 *
 * @example Basic usage
 * ```typescript
 * const finder = new FindFiles();
 * finder.setPath('./src');
 * finder.setIncludeFilters(['*.js', '*.ts']);
 * finder.setExcludeFilters(['node_modules', 'test']);
 * const files = finder.search();
 * ```
 *
 * @example Advanced filtering
 * ```typescript
 * const finder = new FindFiles();
 * finder.setPath('./project');
 * finder.setIncludeFilters(['**\/*.js', '**\/*.ts', '**\/*.php']);
 * finder.setExcludeFilters(['**\/node_modules\/**', '**\/dist\/**', '**\/*.test.*']);
 * const sourceFiles = finder.search();
 * ```
 *
 * @since 4.0.0
 * @internal
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
    if (path_1.default) {
        this.path = path_1.default.resolve(newPath);
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
 * Execute recursive file search with applied filters
 *
 * Performs a recursive directory traversal starting from the configured path,
 * applying include and exclude filters to find matching files. Returns an
 * array of absolute file paths that match the criteria.
 *
 * @returns Array of absolute file paths matching the filter criteria
 *
 * @throws {FileError} When the search path doesn't exist or is inaccessible
 * @throws {Error} When file system operations fail
 *
 * @example Simple search
 * ```typescript
 * const finder = new FindFiles();
 * finder.setPath('./src');
 * const files = finder.search();
 * // Returns: ['/absolute/path/to/src/file1.js', '/absolute/path/to/src/file2.ts']
 * ```
 *
 * @example Filtered search
 * ```typescript
 * const finder = new FindFiles();
 * finder.setPath('./project');
 * finder.setIncludeFilters(['*.js', '*.ts']);
 * finder.setExcludeFilters(['node_modules', '*.test.*']);
 * const sourceFiles = finder.search();
 * ```
 *
 * @since 4.0.0
 * @internal
 */
FindFiles.prototype.search = function () {
    const self = this;
    let files = [];
    try {
        files = (0, klaw_sync_1.default)(self.path).map(function (entry) {
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
            if (fs_extra_1.default.statSync(filename).isDirectory()) {
                return 0;
            }
            if (os_1.default.platform() === 'win32') {
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
            if (os_1.default.platform() === 'win32') {
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
            throw new file_error_1.FileError('No files found.', self.path);
        }
    }
    finally {
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
exports.default = new FindFiles();
//# sourceMappingURL=find_files.js.map