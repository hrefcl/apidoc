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

import { globSync } from 'glob';
import _ from 'lodash';
import path from 'path';
import util from 'util';

// ToDo: refactor "Pugins" to "Plugins". Make sure to update the cspell config

let app: any = {};

/**
 * Detect and loading plugins for an application instance.
 *
 * @param _app - Application instance
 * @class
 */
function PluginLoader(_app) {
    const self = this;

    // global variables
    app = _app;

    // class variables
    self.plugins = {};

    // Try to load global apidoc-plugins (if apidoc is installed locally it tries only local)
    this.detectPugins(__dirname);

    // Try to load local apidoc-plugins
    this.detectPugins(path.join(process.cwd(), '/node_modules'));

    if (Object.keys(this.plugins).length === 0) {
        app.log.debug('No plugins found.');
    }

    this.loadPlugins();
}
/**
 * Inherit
 */
util.inherits(PluginLoader, Object);

/**
 * Recursively detects and loads plugins matching the naming pattern "apidoc-plugin-*"
 * or within namespaces in a specified directory or its parent directories.
 *
 * @param dir - The directory path where the function should start looking for plugins.
 * @returns {*|void}
 * @memberof PluginLoader
 */
PluginLoader.prototype.detectPugins = function (dir) {
    const self = this;

    // Every dir start with "apidoc-plugin-", because for the tests of apidoc-plugin-test.
    let plugins;
    try {
        plugins = globSync(dir + '/apidoc-plugin-*').concat(globSync(dir + '/@*/apidoc-plugin-*'));
    } catch (e) {
        app.log.warn(e);
        return;
    }

    if (plugins.length === 0) {
        dir = path.join(dir, '..');
        if (dir === '/' || dir.substr(1) === ':\\') {
            return;
        }
        return this.detectPugins(dir);
    }

    const offset = dir.length + 1;
    plugins.forEach(function (plugin) {
        const name = plugin.substr(offset);
        const filename = path.relative(__dirname, plugin);
        app.log.debug('add plugin: ' + name + ', ' + filename);
        self.addPlugin(name, plugin);
    });
};

/**
 * Adds, or overwrites, a plugin in the plugins collection.
 * If the specified plugin name already exists, it logs a debug message about the overwrite operation.
 *
 * @param name - The name of the plugin to be added or overwritten.
 * @param filename - The filename or path associated with the plugin.
 * @memberof PluginLoader
 */
PluginLoader.prototype.addPlugin = function (name, filename) {
    if (this.plugins[name]) {
        app.log.debug('overwrite plugin: ' + name + ', ' + this.plugins[name]);
    }

    this.plugins[name] = filename;
};

/**
 * Loads and initializes plugins for the application.
 *
 * Iterates through all plugins specified in the `plugins` property. For each plugin,
 * the function attempts to require the plugin module using its filename. If the module
 * is successfully loaded and contains an `init` function, the `init` function is called
 * with the application instance. If the plugin fails, a debug message is logged indicating
 * the plugin was ignored.
 *
 * @memberof PluginLoader
 */
PluginLoader.prototype.loadPlugins = function () {
    _.forEach(this.plugins, function (filename, name) {
        app.log.debug('load plugin: ' + name + ', ' + filename);
        let plugin;
        try {
            plugin = require(filename);
        } catch (e) {}
        if (plugin && plugin.init) {
            plugin.init(app);
        } else {
            app.log.debug('Ignored, no init function found.');
        }
    });
};

/**
 * Exports
 */
export default PluginLoader;
