/**
 * startEmberApp.js
 * @description This file sets up the Ember app for testing. Depends on ember-qunit (managed by bower):
 * https://github.com/rpflorence/ember-qunit
 */
var App,
	karma_started = false;

__karma__.loaded = Em.K;

Ember.run(function () {
	App = Ember.Application.create({
		modulePrefix: 'main'
	});

	App.rootElement = '#ember-testing';
	App.setupForTesting();
	App.injectTestHelpers();

	App.initializer({
		name: 'Test runner',
		initialize: function (container, application) {
			if (!karma_started) {
				karma_started = true;
				__karma__.start();
			}
		}
	});

	setResolver(Em.DefaultResolver.create({
		namespace: App,
		resolve: function (fullName) {
			var type = fullName.split(':')[0],
				name = fullName.split(':')[1],
				module;

			if (type === 'router') {
				module = 'main/router';
				return mrequire(module).default;
			} else if (type === 'route' && name !== 'basic') {
				module = 'main/routes/';
			} else if (type === 'component') {
				module = 'main/components/';
			} else if (type === 'controller') {
				module = 'main/controllers/';
			} else if (type === 'model') {
				module = 'main/models/';
			} else if (type === 'mixin') {
				module = 'main/mixins/';
			}

			if (module) {
				module = module + name.dasherize();
				return mrequire(module).default;
			}
		}
	}));
});

// Set deprecation warning method to Ember's version of noop to declutter test logs
Em.deprecate = Em.K;

// Disable Ember logger to declutter test logs
Em.Logger = {
	assert: Em.K,
	debug: Em.K,
	error: Em.K,
	info: Em.K,
	log: Em.K,
	warn: Em.K
};
