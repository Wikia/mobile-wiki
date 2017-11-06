define('mobile-wiki/instance-initializers/clear-double-boot', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "clear-double-boot",

    initialize: function initialize(instance) {
      if (typeof FastBoot === 'undefined') {
        var originalDidCreateRootView = instance.didCreateRootView;

        instance.didCreateRootView = function () {
          var elements = document.querySelectorAll(instance.rootElement + ' .ember-view');
          for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.parentNode.removeChild(element);
          }

          originalDidCreateRootView.apply(instance, arguments);
        };
      }
    }
  };
});