import globals from 'globals';
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import eslintReactRefresh from 'eslint-plugin-react-refresh';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintImport from 'eslint-plugin-import';
import eslintUnusedImports from 'eslint-plugin-unused-imports';
import eslintUnicorn from 'eslint-plugin-unicorn';
import { fixupPluginRules } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

export default defineConfig([
  { files: ['**/*.js'], plugins: { js }, extends: ['js/recommended'] },
  {
    plugins: {
      react: fixupPluginRules(eslintReact),
      'react-hooks': eslintReactHooks,
      'react-refresh': eslintReactRefresh,
      prettier: prettierPlugin,
      import: fixupPluginRules(eslintImport),
      'unused-imports': eslintUnusedImports,
      unicorn: eslintUnicorn,
    },
  },

  {
    ignores: ['node_modules', '**/*.css'],
  },
  {
    languageOptions: {
      ...eslintReact.configs.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ...eslintReact.configs.recommended.parserOptions,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    rules: {
      'react/boolean-prop-naming': 'error',
      'react/button-has-type': 'off',
      'react/checked-requires-onchange-or-readonly': 'error',
      'react/jsx-curly-newline': [
        'error',
        {
          multiline: 'consistent',
          singleline: 'consistent',
        },
      ],
      'react/default-props-match-prop-types': 'error',
      'react/destructuring-assignment': ['error', 'always'],
      'react/display-name': 'off',
      'react/hook-use-state': 'error',
      'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/jsx-first-prop-new-line': 'error',
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-key': 'error',
      'react/jsx-no-comment-textnodes': 'error',
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-leaked-render': 'off',
      'react/jsx-no-script-url': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-props-no-multi-spaces': 'error',
      'react/jsx-sort-props': 'error',
      'react/jsx-tag-spacing': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-wrap-multilines': 'error',
      'react/no-array-index-key': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-deprecated': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-typos': 'error',
      'react/self-closing-comp': 'error',
      'react/sort-comp': 'error',
      'react/sort-default-props': 'error',
      'react/sort-prop-types': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'import/export': 'error',
      'import/no-empty-named-blocks': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-amd': 'error',
      'import/no-commonjs': 'error',
      'import/no-cycle': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-filename-extension': [
        'error',
        { allow: 'as-needed', extensions: ['.jsx', '.tsx'] },
      ],
      'react/jsx-handler-names': [
        'off',
        {
          eventHandlerPrefix: 'on',
          eventHandlerPropPrefix: 'on',
          checkLocalVariables: true,
        },
      ],
      'react/jsx-no-bind': [
        'error',
        {
          allowArrowFunctions: true,
        },
      ],

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['all', 'multiple', 'single', 'none'],
          allowSeparatedGroups: false,
        },
      ],
      'import/order': [
        1,
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'never',
        },
      ],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-console': 'error',
    },
  },
  {
    files: ['src/hooks/*.js'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          case: 'camelCase',
        },
      ],
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react: fixupPluginRules(eslintReact),
      'react-hooks': eslintReactHooks,
      'react-refresh': eslintReactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/!(*.module).css'],
              message: 'Components must use CSS Modules (.module.css)',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.module.css'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: ['src/styles/**/*.css', 'src/main.{js,jsx,ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  // TypeScript (ключевая часть)
  ...tseslint.configs.recommended,

  // React
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      eslintReact,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/jsx-uses-react': 'off',
    },
  },
  eslintConfigPrettier,
]);
