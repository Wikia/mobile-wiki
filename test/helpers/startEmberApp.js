/**
 * startEmberApp.js
 * @description This file sets up the Ember app for testing. Depends on ember-qunit (managed by bower):
 * https://github.com/rpflorence/ember-qunit
 */

// Add this content to test application bootstrap
// Writing this element to test runner DOM is required for Ember to bootstrap
// properly
document.write('<div class="article-content">Test content</div><div id="ember-testing"></div>');

__karma__.loaded = function() {};

var App = window.App;

var karma_started = false;

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

setResolver(Ember.DefaultResolver.create({
	namespace: App
}));
