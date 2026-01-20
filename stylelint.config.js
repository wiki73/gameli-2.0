/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-clean-order'],

  plugins: [
    'stylelint-declaration-strict-value',
    'stylelint-selector-bem-pattern',
    'stylelint-order',
  ],

  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['define-mixin', 'mixin', 'mixin-content'],
      },
    ],
    /* ==============================
       🎨 COLORS — CSS VARIABLES ONLY
       ============================== */
    'scale-unlimited/declaration-strict-value': [
      [
        '/color/',
        'background',
        'background-color',
        'border-color',
        'outline-color',
        'fill',
        'stroke',
      ],
      {
        ignoreKeywords: ['inherit', 'transparent', 'currentColor'],
        disableFix: true,
      },
    ],

    /* ==============================
       🧩 CSS MODULES FRIENDLY
       ============================== */
    'selector-class-pattern': null, // CSS Modules can generate anything
    'selector-id-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'], // :global / :local
      },
    ],

    /* ==============================
       🧹 CLEAN & SAFE DEFAULTS
       ============================== */
    'no-descending-specificity': null, // noisy with modules
    'declaration-block-no-redundant-longhand-properties': true,
    'shorthand-property-no-redundant-values': true,
    'color-function-notation': 'modern',
    'alpha-value-notation': 'number',
    'font-weight-notation': 'numeric',
    'value-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,

    /* ==============================
       📐 CONSISTENCY
       ============================== */
    'length-zero-no-unit': true,
    'function-url-quotes': 'always',

    /* ==============================
       📦 ORDERING (clean-order)
       ============================== */
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-order': [],

    /* ==============================
       🚀 PRACTICAL EXCEPTIONS
       ============================== */
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],

    /* ==============================
       ❌ TURN OFF USELESS / ANNOYING
       ============================== */
    'selector-not-notation': null,
    'selector-pseudo-element-colon-notation': null,
  },

  ignoreFiles: [
    '**/*.js',
    '**/*.ts',
    '**/*.tsx',
    '**/*.jsx',
    '**/*.json',
    '**/*.svg',
    '**/node_modules/**',
    '**/.next/**',
    '**/dist/**',
    '**/*.css',
    '**/*.pcss',
    '**/*.scss',
  ],
};
