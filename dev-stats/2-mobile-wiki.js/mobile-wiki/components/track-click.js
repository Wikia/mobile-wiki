define('mobile-wiki/components/track-click', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    classNames: ['track-click'],
    click: function click() {
      this.sendAction();
    }
  });
});