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

/**
 * Provide default values for the app
 */
import MarkdownIt from 'markdown-it';
import * as path from 'path';
import * as winston from 'winston';
import { ApiDocOptions, LoggerInterface, MarkdownParser } from '../types';

/**
 * Create and return a logger instance
 * @param options - Configuration options
 * @param options.logFormat - Log format ('json' or default)
 * @param options.colorize - Enable colorized output
 * @param options.debug - If true, debug level logging
 * @param options.verbose - If true, verbose level logging
 * @param options.silent - If true, disables logging
 * @returns Winston logger instance.
 */
function getLogger(options: ApiDocOptions): LoggerInterface {
    // default format
    let format: winston.Logform.Format = winston.format.simple();
    if (options.logFormat === 'json') {
        // remove colors for json output
        options.colorize = false;
        format = winston.format.json();
    }
    // add colors (default is true)
    if (options.colorize) {
        format = winston.format.combine(winston.format.colorize(), format);
    }

    // console logger
    // Level hierarchy: error < warn < info < verbose < debug
    // Without verbose: only show warnings and errors
    // With verbose: show info, verbose and debug messages
    return winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: options.debug ? 'debug' : options.verbose ? 'verbose' : 'warn',
                silent: options.silent || false,
            }),
        ],
        format: format,
    }) as LoggerInterface;
}

/**
 * Get the markdown parser
 * @param options - Configuration options
 * @param options.markdown - Markdown parser behavior:
 *     - `true` to use the default Markdown parser with specific settings.
 *     - `false` to disable parsing.
 *     - A string indicating the path to a custom parser.
 * @returns An instance of the Markdown parser if enabled or configured
 */
function getMarkdownParser(options: ApiDocOptions): MarkdownParser | null {
    // Markdown Parser: enable / disable / use a custom parser.
    let markdownParser: MarkdownParser | null = null;

    if (options.markdown === true) {
        const md = new MarkdownIt({
            breaks: false,
            html: true,
            linkify: false,
            typographer: false,
            highlight: function (str: string, lang?: string): string {
                if (lang) {
                    return '<pre class="my-4"><code class="language-' + lang + '">' + str + '</code></pre>';
                }
                return '<pre class="my-4"><code>' + str + '</code></pre>';
            },
        });

        markdownParser = {
            render: (content: string): string => md.render(content),
        };
    } else if (options.markdown !== false && typeof options.markdown === 'string') {
        // Include custom Parser @see https://github.com/apidoc/apidoc/wiki/Custom-markdown-parser
        let customMarkdownPath = options.markdown;

        if (
            customMarkdownPath.substring(0, 2) !== '..' &&
            ((customMarkdownPath.substring(0, 1) !== '/' &&
                customMarkdownPath.substring(1, 3) !== ':/' &&
                customMarkdownPath.substring(1, 3) !== ':\\' &&
                customMarkdownPath.substring(0, 1) !== '~') ||
                customMarkdownPath.substring(0, 1) === '.')
        ) {
            customMarkdownPath = path.join(process.cwd(), customMarkdownPath);
        }

        try {
            const CustomMarkdown = require(customMarkdownPath);
            const customMd = new CustomMarkdown();
            markdownParser = {
                render: (content: string): string => {
                    if (typeof customMd.render === 'function') {
                        return customMd.render(content);
                    } else if (typeof customMd === 'function') {
                        return customMd(content);
                    }
                    return content;
                },
            };
        } catch (error) {
            console.warn(`Failed to load custom markdown parser from ${customMarkdownPath}:`, error);
        }
    }

    return markdownParser;
}

export { getLogger, getMarkdownParser };

// For CommonJS compatibility
module.exports = {
    getLogger,
    getMarkdownParser,
};
