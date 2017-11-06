define('mobile-wiki/components/wikia-ui-components/icon-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    attributeBindings: ['title'],
    classNames: ['icon-button'],
    iconSize: 16,
    tagName: 'a'
  });
});