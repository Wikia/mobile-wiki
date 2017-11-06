define('mobile-wiki/instance-initializers/head-fastboot', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(owner) {
    var document = owner.lookup('service:-document');
    var component = owner.lookup('component:head-layout');

    component.appendTo(document.head);
  }

  exports.default = {
    name: 'head-fastboot',
    initialize: initialize
  };
});