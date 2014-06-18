/**
 * startEmberApp.js
 * @description This file sets up the Ember app for testing. Depends on ember-qunit (managed by bower):
 * https://github.com/rpflorence/ember-qunit
 */

// Add this content to test application bootstrap
$('body').append('<div class="article-content">Test content</div>');
// Writing this element to test runner DOM is required for Ember to bootstrap
// properly
$('body').append('<div id="ember-testing"></div>');

var App = window.App;

Ember.run(function () {
	App.rootElement = '#ember-testing';
	App.setupForTesting();
	App.injectTestHelpers();
	App.reset();
});

emq.globalize();
setResolver(Ember.DefaultResolver.create({
	namespace: App
}));
