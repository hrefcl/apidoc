import ejs from 'ejs';
import fs from 'fs/promises';
import path from 'path';
import semverGt from 'semver/functions/gt';

import { MarkdownConfigurationObject, MarkdownConfigurationObjectCLI, MarkdownDocumentationOutput } from './types';
import { loadFromCliParamOrApiDocProject, loadTemplate, mkdirp, pathExists, templateUtils, unique } from './utils';

/**
 * Get the documentation generator
 * @param options Documentation generator parameters
 * @returns The single or multi file EJS compiler, ready for usage
 */
export const generate = async (
    options: Omit<MarkdownConfigurationObject, 'template'> & { ejsCompiler: ejs.AsyncTemplateFunction }
): Promise<MarkdownDocumentationOutput[]> => {
    let apiByGroupAndName: any[];

    // Fix missing titles by using name as fallback (common in MQTT)
    options.apiDocApiData.forEach((x) => {
        if (!x.title && x.name) {
            x.title = x.name;
        }
    });

    // Throw error if one element is still missing both title and name
    const elementsWithoutTitle = options.apiDocApiData.filter((x) => !x.title && !x.name);
    if (elementsWithoutTitle.length > 0)
        throw new Error(
            'Missing both `title` and `name` key in one or more elements. Elements without title/name: ' +
                `${JSON.stringify(elementsWithoutTitle.slice(0, 3), null, 2)}`
        );

    // Group apiDoc data by group and name
    apiByGroupAndName = unique(Object.values(options.apiDocApiData).map((x) => x.group))
        .reduce(
            (acc, cur) => {
                if (options.apiDocApiData.find((x) => x.group === cur)) acc.push({ name: cur, subs: [] });
                return acc;
            },
            [] as {}[]
        )
        .map((g: any) => {
            options.apiDocApiData.forEach((x) => x.group === g.name && g.subs.push(x));
            return g;
        })
        .map((g: any) => {
            g.subs = Object.values(
                g.subs.reduce((acc: any, cur: any) => {
                    if (!acc[cur.title] || semverGt(cur.version, acc[cur.title].version)) acc[cur.title] = cur;
                    return acc;
                }, {})
            );
            return g;
        });

    // Sort entries by group name and title ascending
    apiByGroupAndName = apiByGroupAndName.sort((a: any, b: any) => a.name.localeCompare(b.name));
    apiByGroupAndName.forEach((x) => x.subs.sort((a: any, b: any) => a.title.localeCompare(b.title)));

    // Order using the project order setting
    if (options.apiDocProjectData.order) {
        // Lowercased project order setting array
        const orderLowerCase = options.apiDocProjectData.order.map((x: string) => x.toLowerCase());

        // Filter items in/not in the project order setting array
        const inOrderArr: any[] = [];
        const notInOrderArr: any[] = [];
        apiByGroupAndName.forEach((x) =>
            orderLowerCase.indexOf(x.name.toLowerCase()) === -1 ? notInOrderArr.push(x) : inOrderArr.push(x)
        );

        // Sorted, with the ones not in the project order setting array appended to it
        apiByGroupAndName = [
            ...inOrderArr.sort((a, b) => {
                const aIndex = orderLowerCase.indexOf(a.name.toLowerCase());
                const bIndex = orderLowerCase.indexOf(b.name.toLowerCase());
                if (aIndex === -1 && bIndex === -1) return 0;
                return aIndex > bIndex ? 1 : -1;
            }),
            ...notInOrderArr,
        ];
    }

    // This is the config passed to the template
    const templateConfig = {
        // Every functions in template utils are passed to the EJS compiler
        ...templateUtils,

        project: options.apiDocProjectData,
        header: options.header,
        footer: options.footer,
        prepend: options.prepend,
    };

    return !options.multi
        ? [{ name: 'main', content: await options.ejsCompiler({ ...templateConfig, data: apiByGroupAndName }) }]
        : await Promise.all(
              apiByGroupAndName.map(async (x) => ({
                  name: x.name as string,
                  content: await options.ejsCompiler({ ...templateConfig, data: [x] }),
              }))
          );
};

/**
 * Generate markdown documentation.
 * @param options Generator configuration
 * @returns Generated documentation
 */
export const generateMarkdown = async (options: MarkdownConfigurationObject): Promise<MarkdownDocumentationOutput[]> =>
    generate({ ...options, ejsCompiler: await loadTemplate(options.template, false) });

/**
 * Generate markdown documentation and create output file(s).
 * @param options Generator configuration
 * @returns Generated documentation
 * @throws Some CLI command parameters are missing or invalid
 */
export const generateMarkdownFileSystem = async (
    options: MarkdownConfigurationObjectCLI
): Promise<MarkdownDocumentationOutput[]> => {
    // Check the output path exists (only parent directory if unique file)
    if (!options.output) throw new Error('`output` is required but was not provided.');

    // Recursively create directory arborescence if cli option is true
    if (options.createPath)
        await mkdirp(options.output.toLowerCase().endsWith('.md') ? path.dirname(options.output) : options.output);

    const outputPath = options.multi ? options.output : path.parse(path.resolve('.', options.output)).dir;
    if (!(await pathExists(outputPath)))
        throw new Error(`The \`output\` path does not exist or is not readable. Path: ${outputPath}`);

    // Check header, footer and prepend file path exist
    const header = await loadFromCliParamOrApiDocProject('header', options.headerFile, options.apiDocProjectData);
    const footer = await loadFromCliParamOrApiDocProject('footer', options.footerFile, options.apiDocProjectData);
    const prepend = await loadFromCliParamOrApiDocProject('prepend', options.prependFile, options.apiDocProjectData);

    // Generate the actual documentation
    const documentation = await generate({
        ...options,
        header,
        footer,
        prepend,
        ejsCompiler: await loadTemplate(options.template),
    });

    // Create the output files
    if (!options.multi) {
        // Single file documentation generation
        const singleDoc = documentation[0].content;
        await fs.writeFile(options.output, singleDoc);

        return [{ ...documentation[0], outputFile: options.output }];
    } else {
        // Multi file documentation generation
        return Promise.all(
            documentation.map(async (aDoc) => {
                const filePath = path.resolve(outputPath, `${aDoc.name}.md`);
                await fs.writeFile(filePath, aDoc.content);
                return { ...aDoc, outputFile: filePath };
            })
        );
    }
};

/**
 * Create markdown documentation from apiDoc data
 * @param apiDocApiData
 * @param apiDocProjectData
 * @param options
 */
export const createMarkdownFromApiDocData = async (
    apiDocApiData: Array<Record<string, any>>,
    apiDocProjectData: Record<string, any>,
    options: Partial<MarkdownConfigurationObject> = {}
): Promise<MarkdownDocumentationOutput[]> => {
    return generateMarkdown({
        apiDocApiData,
        apiDocProjectData,
        ...options,
    });
};
