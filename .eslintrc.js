module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'airbnb-base',
    'plugin:ember/recommended'
  ],
  env: {
    es6: true,
    browser: true
  },
  globals: {
    $script: true,
    Ember: true,
    FastBoot: true,
    Hammer: true,
    M: true,
    VisitSource: true,
    Wikia: true
  },
  rules: {
    "func-names": 0,
    "global-require": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-mutable-exports": 0,
    "import/no-unresolved": 0,
    "max-len": [2, 120, 2],
    "new-cap": 0,
    "no-param-reassign": 0,
    "no-restricted-syntax": 0,
    "no-shadow": 0,
    "no-underscore-dangle": 0,
    "prefer-destructuring": 0,
    "prefer-rest-params": 0,
    "strict": 0,

    "ember/avoid-leaking-state-in-ember-objects": [2, [
      'gestures',
      'classNames',
      'classNameBindings',
      'actions',
      'concatenatedProperties',
      'mergedProperties',
      'positionalParams',
      'attributeBindings',
      'queryParams',
      'attrs'
    ]],
    "ember/no-jquery": 2,
    "ember/order-in-components": 1,
    "ember/order-in-controllers": 1,
    "ember/order-in-routes": 1
  },
  overrides: [
    // node files
    {
      files: [
        'testem.js',
        'ember-cli-build.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    },

    // inline scripts files
    {
      files: [
        'vendor/**/*.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 5
      },
      env: {
        browser: true,
      },
      rules: {
        "no-console": 0,
        "no-var": 0,
        "object-shorthand": 0,
        "prefer-arrow-callback": 0,
        "prefer-template": 0,
        "vars-on-top": 0,
        "no-empty": 0,
        "no-inner-declarations": 0,
        "comma-dangle": 0,
      }
    },

    // test files
    {
      files: ['tests/**/*.js'],
      excludedFiles: ['tests/dummy/**/*.js'],
      env: {
        embertest: true
      },
      rules: {
        "import/newline-after-import": 0,
        "no-restricted-globals": 0
      }
    },
    {
      files: ['**/mirage/fixtures/*.js'],
      rules: {
        "max-len": 0,
        "no-useless-escape": 0
      }
    }
  ]
};
