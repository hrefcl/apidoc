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
            // Disable TypeScript-only rules for JS files
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            // JSDoc rules (relaxed for JS files)
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/require-returns': 'off',

            // General rules
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
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
            // TypeScript specific rules
            '@typescript-eslint/no-explicit-any': 'warn', // Changed to warn instead of off
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unsafe-declaration-merging': 'off',
            '@typescript-eslint/no-require-imports': 'warn', // Allow require but warn
            '@typescript-eslint/no-namespace': 0,
            '@typescript-eslint/no-unused-vars': [
                'warn', // Changed to warn
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-var-requires': 0,

            // General ESLint rules
            'no-tabs': 'off',
            camelcase: 'off',
            'arrow-body-style': 0,
            'brace-style': [2, '1tbs'],
            'func-names': [0, 'as-needed'],
            'linebreak-style': ['error', 'unix'],
            'max-len': 0,
            'no-bitwise': [
                'error',
                {
                    allow: ['~'],
                },
            ],
            'no-param-reassign': 0,
            'no-underscore-dangle': 0,
            'no-use-before-define': 0,
            'no-useless-escape': 0,
            'object-curly-spacing': [2, 'always'],
            'operator-linebreak': 0,
            quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
            semi: ['error', 'always'],

            // JSDoc rules (relaxed for TypeScript)
            'jsdoc/no-defaults': 0,
            'jsdoc/require-jsdoc': 0, // TypeScript provides type info
            'jsdoc/require-param': 0, // TypeScript provides param info
            'jsdoc/require-param-description': 0,
            'jsdoc/require-param-name': 0,
            'jsdoc/require-param-type': 0, // TypeScript provides types
            'jsdoc/require-property': 0,
            'jsdoc/require-property-description': 0,
            'jsdoc/require-property-name': 0,
            'jsdoc/require-property-type': 0, // TypeScript provides types
            'jsdoc/require-returns': 0, // TypeScript provides return types
            'jsdoc/require-returns-description': 0,
            'jsdoc/require-returns-type': 0, // TypeScript provides return types
            'jsdoc/require-throws-type': 0, // Not needed with TypeScript
            'jsdoc/check-tag-names': 0, // Allow custom tags like @apiDefine, @hook
            'jsdoc/no-undefined-types': 0, // TypeScript handles this
            'jsdoc/reject-any-type': 0, // Allow * type in JSDoc
            'jsdoc/tag-lines': 'off', // Too strict

            // Node.js specific rules
            'n/no-process-exit': 0,
            'n/no-unpublished-bin': 0,
            'n/no-unpublished-require': 0,
            'n/no-unsupported-features/node-builtins': 1,
            'n/no-missing-import': 'off', // TypeScript handles this
            'n/no-extraneous-import': 'off', // False positives with TypeScript

            // General rules
            'comma-dangle': 0,
            'no-empty': ['error', { allowEmptyCatch: true }],
            'no-unused-vars': 0, // Use TypeScript version instead

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
            '@typescript-eslint/no-explicit-any': 'warn',
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
];
