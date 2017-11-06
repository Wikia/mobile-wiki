define('mobile-wiki/initializers/ember-cli-fastclick', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var schedule = Ember.run.schedule;


  var EmberCliFastclickInitializer = {
    name: 'fastclick',

    initialize: function initialize() {
      if (typeof FastBoot === 'undefined') {
        schedule('afterRender', function () {
          FastClick.attach(document.body);
        });
      }
    }
  };

  exports.default = EmberCliFastclickInitializer;
});