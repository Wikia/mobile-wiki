/**
 * startEmberApp.js
 * @description This file sets up the Ember app for testing. Depends on ember-qunit (managed by bower):
 * https://github.com/rpflorence/ember-qunit
 */

// Writing this element to test runner DOM is required for Ember to bootstrap
// properly
document.write('<div id="ember-testing"></div>');

window.Wikia = {};
window.Wikia._t = { en: {} };

var App = window.App;

Ember.run(function () {
	Ember.run(function () {
		App.setupForTesting();
		App.injectTestHelpers();
	});

	App.reset();
});

emq.globalize();
setResolver(Ember.DefaultResolver.create({
	namespace: App
}));
