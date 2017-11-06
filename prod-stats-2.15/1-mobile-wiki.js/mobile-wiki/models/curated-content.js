define('mobile-wiki/models/curated-content', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmberObject = Ember.Object;
  exports.default = EmberObject.extend({
    title: null,
    type: null,
    items: []
  });
});