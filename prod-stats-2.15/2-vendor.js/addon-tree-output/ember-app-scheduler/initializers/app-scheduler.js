define('ember-app-scheduler/initializers/app-scheduler', ['exports'], function (exports) {
  exports.initialize = initialize;

  function initialize(application) {
    application.inject('service:scheduler', 'router', 'router:main');
  }

  exports['default'] = {
    name: 'app-scheduler',
    initialize: initialize
  };
});