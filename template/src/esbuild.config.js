/**
 * esbuild bundler config file with TypeScript and Tailwind CSS support
 * Enhanced for APIDoc 4.0 with better development experience
 * - Entry point set at runtime
 * - File output set at runtime
 * - Define is set at runtime
 * - minify overridden at runtime, based on debug flag
 * - sourcemap overridden at runtime, based on debug flag
 */
const postcss = require('esbuild-postcss');

module.exports = {
  bundle: true,
  minify: true,
  sourcemap: false,
  resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
  conditions: ['style'],
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.css': 'css',
    '.eot': 'dataurl',
    '.svg': 'dataurl',
    '.ttf': 'dataurl',
    '.woff': 'dataurl',
    '.woff2': 'dataurl'
  },
  plugins: [
    postcss({
      plugins: [
        require('@tailwindcss/postcss'),
        require('autoprefixer'),
      ]
    })
  ],
  target: 'es2022',
  alias: {
    '@': './template/src',
    '@types': '../src/types'
  },
  banner: {
    js: '/* APIDoc 4.0 Template - Generated with TypeScript support */'
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  format: 'iife',
  globalName: 'ApiDoc'
};
