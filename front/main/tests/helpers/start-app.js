import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

// Set deprecation warning method to Ember's version of noop to declutter test logs
Ember.deprecate = Ember.K;

// Disable Ember logger to declutter test logs
Ember.Logger = {
  assert: Ember.K,
  debug: Ember.K,
  error: Ember.K,
  info: Ember.K,
  log: Ember.K,
  warn: Ember.K
};

export default function startApp(attrs) {
  var application;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
