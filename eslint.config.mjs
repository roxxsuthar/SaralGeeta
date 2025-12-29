import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Base config for app source
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.jest, __DEV__: true },
    },
    settings: { react: { version: 'detect' } },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Node/CommonJS config files
  {
    files: [
      '.eslintrc.js',
      '.prettierrc.js',
      'babel.config.js',
      'metro.config.js',
      'react-native.config.js',
      'jest.config.js',
      'internals/**/*.js',
    ],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'commonjs',
    },
  },

  // Test files (allow require and node-style globals in tests)
  {
    files: ['**/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.jest, ...globals.node },
    },
  },
];
