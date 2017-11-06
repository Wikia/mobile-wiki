define('mobile-wiki/router', ['exports', 'ember-router-scroll', 'mobile-wiki/config/environment'], function (exports, _emberRouterScroll, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var EmberRouter = Ember.Router;


	var Router = EmberRouter.extend(_emberRouterScroll.default, {
		location: _environment.default.locationType,
		rootURL: _environment.default.rootURL
	});

	Router.map(function () {
		this.route('article-preview');

		this.route('search');

		this.route('main-page-redirect', {
			path: '/wiki/'
		});

		this.route('wiki-page', {
			path: '/wiki/*title'
		});

		this.route('articleEdit', {
			path: '/wiki/edit/:title/:sectionIndex'
		});
	});

	exports.default = Router;
});