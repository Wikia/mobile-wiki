define('mobile-wiki/controllers/blog', ['exports', 'mobile-wiki/mixins/wiki-page-controller'], function (exports, _wikiPageController) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var alias = Ember.computed.alias;
	var Controller = Ember.Controller;
	var controller = Ember.inject.controller;
	exports.default = Controller.extend(_wikiPageController.default, {
		application: controller(),
		article: controller(),

		commentsPage: alias('application.commentsPage'),

		actions: {
			articleRendered: function articleRendered() {
				var _get;

				(_get = this.get('article')).send.apply(_get, ['articleRendered'].concat(Array.prototype.slice.call(arguments)));
			}
		}
	});
});