import { includeIgnoreFile } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import nodePlugin from 'eslint-plugin-n';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import path, { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslintPluginJs.configs.recommended,
    allConfig: eslintPluginJs.configs.all,
});

export default [
    {
        files: ['bin/!(*.*)'],
    },
    includeIgnoreFile(join(process.cwd(), '.gitignore')),
    {
        ignores: [
            'examples/**/*',
            '**/vendor/**/*',
            'tests/**/*',
            '**/*.json',
            '**/*.pem',
            'dist/**/*',
            'tmp/**/*',
            'node_modules/**/*',
            '.stencil/**/*',
            'apps/**/*', // Ignore all apps directory
        ],
    },
    // Base configurations
    eslintPluginJs.configs.recommended,
    ...compat.extends('plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'),
    jsdocPlugin.configs['flat/recommended'],
    nodePlugin.configs['flat/recommended'],
    {
        ...importPlugin.flatConfigs.recommended,
        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                    alwaysTryTypes: true,
                },
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx'],
                },
            },
        },
    },
    prettierPlugin,
    // JavaScript files (without TypeScript parser)
    {
        files: ['**/*.js', '**/*.mjs', 'bin/**/*'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            // Disable ALL TypeScript rules for JS files
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            // Disable ALL JSDoc rules for JS files
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/require-param-description': 'off',
            'jsdoc/require-param-type': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/require-returns-description': 'off',
            'jsdoc/reject-any-type': 'off',

            // Disable ALL Node.js rules for JS files
            'n/no-process-exit': 'off',
            'n/no-unpublished-bin': 'off',
            'n/no-missing-require': 'off',
            'n/no-unsupported-features/node-builtins': 'off',

            // Disable general rules
            'no-unused-vars': 'off',
        },
    },
    // TypeScript files
    {
        files: ['core/**/*.ts', 'src/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jquery,
            },
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // TypeScript specific rules - ALL OFF for linting
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unsafe-declaration-merging': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-this-alias': 'off',

            // General ESLint rules
            'no-tabs': 'off',
            'no-case-declarations': 'off',
            'prefer-rest-params': 'off',
            camelcase: 'off',
            'arrow-body-style': 'off',
            'brace-style': 'off',
            'func-names': 'off',
            'linebreak-style': 'off',
            'max-len': 'off',
            'no-bitwise': 'off',
            'no-param-reassign': 'off',
            'no-underscore-dangle': 'off',
            'no-use-before-define': 'off',
            'no-useless-escape': 'off',
            'object-curly-spacing': 'off',
            'operator-linebreak': 'off',
            quotes: 'off',
            semi: 'off',

            // JSDoc rules (ALL OFF)
            'jsdoc/no-defaults': 'off',
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/require-param-description': 'off',
            'jsdoc/require-param-name': 'off',
            'jsdoc/require-param-type': 'off',
            'jsdoc/require-property': 'off',
            'jsdoc/require-property-description': 'off',
            'jsdoc/require-property-name': 'off',
            'jsdoc/require-property-type': 'off',
            'jsdoc/require-returns': 'off',
            'jsdoc/require-returns-description': 'off',
            'jsdoc/require-returns-type': 'off',
            'jsdoc/require-throws-type': 'off',
            'jsdoc/check-tag-names': 'off',
            'jsdoc/no-undefined-types': 'off',
            'jsdoc/reject-any-type': 'off',
            'jsdoc/tag-lines': 'off',
            'jsdoc/require-returns-check': 'off',
            'jsdoc/check-param-names': 'off',

            // Node.js specific rules (ALL OFF)
            'n/no-process-exit': 'off',
            'n/no-unpublished-bin': 'off',
            'n/no-unpublished-require': 'off',
            'n/no-unsupported-features/node-builtins': 'off',
            'n/no-missing-import': 'off',
            'n/no-missing-require': 'off',
            'n/no-extraneous-import': 'off',

            // General rules
            'comma-dangle': 'off',
            'no-empty': 'off',
            'no-unused-vars': 'off',

            // Prettier configuration
            'prettier/prettier': [
                'error',
                {
                    bracketSameLine: true,
                    bracketSpacing: true,
                    jsxBracketSameLine: true,
                    tabWidth: 4,
                    useTabs: false,
                    semi: true,
                    singleQuote: true,
                    trailingComma: 'es5',
                    arrowParens: 'always',
                    printWidth: 120,
                    jsxSingleQuote: true,
                    htmlWhitespaceSensitivity: 'ignore',
                    endOfLine: 'lf',
                    embeddedLanguageFormatting: 'auto',
                    singleAttributePerLine: false,
                    proseWrap: 'never',
                },
            ],
        },
    },
    // TypeScript-specific overrides for main project
    {
        files: ['lib/**/*.ts', 'src/**/*.ts', 'bin/**/*.ts', 'scripts/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // Enable stricter rules for TypeScript files
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    // Stencil TypeScript files - use template tsconfig
    {
        files: ['template/**/*.ts', 'template/**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: './template/tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            // Relaxed rules for Stencil components
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'jsdoc/require-jsdoc': 'off',
        },
    },
    // Tailwind config file
    {
        files: ['tailwind.config.ts'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
];
