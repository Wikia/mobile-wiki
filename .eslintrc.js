const {
  DEFAULT_IGNORED_PROPERTIES
} = require('eslint-plugin-ember/lib/rules/avoid-leaking-state-in-ember-objects');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
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
    /*
     It is common in Ember world to do
     this._super(...arguments);
     therefore we can't enable prefer-rest-params and no-underscore-dangle
    */
    "prefer-rest-params": 0,
    "no-underscore-dangle": 0,

    /*
     This certainly helps with debugging but would make code very verbose now
     I think this should be enabled when ember-decorators or ember-typescript is used
    */
    "func-names": 0,

    /*
     in Ember world there are some wrapper packages that would violate this rule
     e.g. you install ember-sinon but you can import it via sinon name
    */
    "import/no-extraneous-dependencies": 0,

    /*
     not all imports that we have, fully map to the folder structure
     biggest offenders are tests that do use absolute paths to a module that is being tested
    */
    "import/no-unresolved": 0,
    "no-param-reassign": 0,
    /*
     Destructurring arrays adds .5kb per module
     We should enable it when we drop support for ios 9
     as ios10 supports param destructuring
    */
    "prefer-destructuring": 0,

    "ember/avoid-leaking-state-in-ember-objects": [2, [
      ...DEFAULT_IGNORED_PROPERTIES,
      'gestures',
    ]],
    "ember/no-jquery": 2,
    "ember/order-in-components": 2,
    "ember/order-in-controllers": 2,
    "ember/order-in-routes": 2,
    "ember/no-side-effects": 1,
    "no-plusplus": [
      2,
      { "allowForLoopAfterthoughts": true },
    ],
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'ember-cli-build.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js',
        'server/**/*.js'
      ],
      parserOptions: {
        sourceType: 'script'
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
        "no-useless-escape": 0
      }
    }
  ]
};
