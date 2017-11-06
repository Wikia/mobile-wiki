define('mobile-wiki/controllers/file', ['exports', 'mobile-wiki/mixins/wiki-page-controller'], function (exports, _wikiPageController) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Controller = Ember.Controller,
	    inject = Ember.inject;
	exports.default = Controller.extend(_wikiPageController.default, {
		article: inject.controller(),

		actions: {
			/**
    * @returns {void}
    */
			articleRendered: function articleRendered() {
				var _get;

				(_get = this.get('article')).send.apply(_get, ['articleRendered'].concat(Array.prototype.slice.call(arguments)));
			}
		}
	});
});