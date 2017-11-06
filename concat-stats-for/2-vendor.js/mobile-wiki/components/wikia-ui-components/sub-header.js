define('mobile-wiki/components/wikia-ui-components/sub-header', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: 'header',
    classNames: ['sub-head'],
    classNameBindings: ['fixed:sub-head--fixed']
  });
});