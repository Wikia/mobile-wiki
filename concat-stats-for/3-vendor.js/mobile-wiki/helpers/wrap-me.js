define('mobile-wiki/helpers/wrap-me', ['exports', 'handlebars'], function (exports, _handlebars) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var helper = Ember.Helper.helper;
  var htmlSafe = Ember.String.htmlSafe;
  exports.default = helper(function (params, options) {
    var content = _handlebars.default.Utils.escapeExpression(params[0] || '');
    var tagName = 'span',
        className = '',
        otherOptions = {
      href: '',
      target: ''
    },
        otherOptionsCombined = void 0;

    if (options.tagName) {
      tagName = options.tagName;
    }

    if (options.className) {
      className = ' class="' + options.className + '"';
    }

    otherOptionsCombined = Object.keys(otherOptions).map(function (key) {
      return options[key] ? ' ' + key + '="' + options[key] + '"' : '';
    }).join('');

    return htmlSafe('<' + tagName + className + otherOptionsCombined + '>' + content + '</' + tagName + '>').toHTML();
  });
});