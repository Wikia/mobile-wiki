define('ember-router-scroll/locations/router-scroll', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var HistoryLocation = Ember.HistoryLocation;
  var set = Ember.set;
  var get = Ember.get;


  var uuid = function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 3 | 8;
      return v.toString(16);
    });
  };

  exports.default = HistoryLocation.extend({
    pushState: function pushState(path) {
      var state = { path: path, uuid: uuid() };
      get(this, 'history').pushState(state, null, path);
      set(this, 'previousURL', this.getURL());
    },
    replaceState: function replaceState(path) {
      var state = { path: path, uuid: uuid() };
      get(this, 'history').replaceState(state, null, path);
      set(this, 'previousURL', this.getURL());
    }
  });
});