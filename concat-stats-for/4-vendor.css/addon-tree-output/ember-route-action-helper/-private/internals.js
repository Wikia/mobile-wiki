define('ember-route-action-helper/-private/internals', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var ClosureActionModule = void 0;

  if ('ember-htmlbars/keywords/closure-action' in Ember.__loader.registry) {
    ClosureActionModule = Ember.__loader.require('ember-htmlbars/keywords/closure-action');
  } else if ('ember-routing-htmlbars/keywords/closure-action' in Ember.__loader.registry) {
    ClosureActionModule = Ember.__loader.require('ember-routing-htmlbars/keywords/closure-action');
  } else {
    ClosureActionModule = {};
  }

  var ACTION = exports.ACTION = ClosureActionModule.ACTION;
});