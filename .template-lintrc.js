'use strict';

module.exports = {
  extends: 'recommended',

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
    }
};
