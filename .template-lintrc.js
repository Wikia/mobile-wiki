'use strict';

module.exports = {
  extends: 'octane',

  rules: {
    'block-indentation': true,
    'deprecated-each-syntax': true,
    'eol-last': 'always',
    'inline-link-to': true,
    //disabling for now as we have too many place where this is violated
    'no-invalid-interactive': false,
    'no-trailing-spaces': true,
    //we can't enable it for now as we have too many places where we 'need' it
    'no-triple-curlies': false,
    // need styles there and there
    'no-inline-styles': false,
    'no-outlet-outside-routes': false,
    'no-curly-component-invocation': {
      allow: ['svg', 'i18n', 'shorten-large-number', 'time-ago']
    },
  }
};
