import tseslint from 'typescript-eslint';
import { fixupPluginRules } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintImport from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintReactRefresh from 'eslint-plugin-react-refresh';
import eslintUnicorn from 'eslint-plugin-unicorn';
import eslintUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default defineConfig([
  // --------------------
  // TS WITHOUT type info
  // --------------------
  {
    files: ['./**/*.{ts,tsx}'],
    extends: [tseslint.configs.strict],
  },
  // --------------------
  // TS WITH type info (SRC ONLY)
  // --------------------
  {
    files: ['./src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        projectService: true,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    extends: [tseslint.configs.strictTypeChecked],
    rules: {
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          enforceConst: true,
          detectObjects: false,
        },
      ],
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
        },
      ],
    },
  },
  // --------------------
  // React rules
  // --------------------
  {
    files: ['./src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': eslintReactRefresh,
      prettier: prettierPlugin,
      import: fixupPluginRules(eslintImport),
      'unused-imports': eslintUnusedImports,
      unicorn: eslintUnicorn,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/jsx-no-bind': 'off',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
      'unicorn/prefer-modern-dom-apis': 'error',
      'import/no-unused-modules': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
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
        'error',
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
            'unknown',
          ],

          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '**/*.css',
              group: 'unknown',
              position: 'after',
            },
          ],

          pathGroupsExcludedImportTypes: ['builtin'],

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
    files: [
      'src/app/**/page.{ts,tsx}',
      'src/app/**/layout.{ts,tsx}',
      'src/app/**/template.{ts,tsx}',
      'src/app/**/loading.{ts,tsx}',
      'src/app/**/error.{ts,tsx}',
      'src/app/**/not-found.{ts,tsx}',
    ],
    rules: {
      'react/function-component-definition': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    ignores: ['node_modules', '.next', 'src/components/ui/**', 'generated'],
  },
  eslintConfigPrettier,
]);
