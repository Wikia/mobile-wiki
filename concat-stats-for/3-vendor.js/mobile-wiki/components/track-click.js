define('mobile-wiki/components/track-click', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['track-click'],
    click: function click() {
      this.sendAction();
    }
  });
});