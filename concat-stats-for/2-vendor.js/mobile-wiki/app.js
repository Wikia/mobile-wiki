define('mobile-wiki/app', ['exports', 'mobile-wiki/resolver', 'ember-load-initializers', 'mobile-wiki/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Application = Ember.Application;


	var App = Application.extend({
		// We specify a rootElement, otherwise Ember appends to the <body> element and Google PageSpeed thinks we are
		// putting blocking scripts before our content
		rootElement: '#ember-container',
		modulePrefix: _environment.default.modulePrefix,
		podModulePrefix: _environment.default.podModulePrefix,
		Resolver: _resolver.default
	});

	(0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

	exports.default = App;
});