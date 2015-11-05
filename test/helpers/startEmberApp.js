/**
 * startEmberApp.js
 * @description This file sets up the Ember app for testing. Depends on ember-qunit (managed by bower):
 * https://github.com/rpflorence/ember-qunit
 */
var App = window.App,
	karma_started = false;

__karma__.loaded = function() {};

App.rootElement = '#ember-testing';
App.setupForTesting();
App.injectTestHelpers();

App.initializer({
	name: "Test runner",
	initialize: function(container, application) {
		if (!karma_started) {
			karma_started = true;
			__karma__.start();
		}
	}
});

setResolver(Em.DefaultResolver.create({
	namespace: App
}));

// Set deprecation warning method to Ember's version of noop to declutter test logs
Em.deprecate = Em.K;
