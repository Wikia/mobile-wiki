define('mobile-wiki/controllers/blog', ['exports', 'mobile-wiki/mixins/wiki-page-controller'], function (exports, _wikiPageController) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Controller = Ember.Controller,
	    computed = Ember.computed,
	    inject = Ember.inject;
	exports.default = Controller.extend(_wikiPageController.default, {
		application: inject.controller(),
		article: inject.controller(),

		commentsPage: computed.alias('application.commentsPage'),

		actions: {
			articleRendered: function articleRendered() {
				var _get;

				(_get = this.get('article')).send.apply(_get, ['articleRendered'].concat(Array.prototype.slice.call(arguments)));
			}
		}
	});
});