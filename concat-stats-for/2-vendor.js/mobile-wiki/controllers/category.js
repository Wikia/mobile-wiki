define('mobile-wiki/controllers/category', ['exports', 'mobile-wiki/mixins/wiki-page-controller'], function (exports, _wikiPageController) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Controller = Ember.Controller;
	var controller = Ember.inject.controller;
	var Promise = Ember.RSVP.Promise;
	exports.default = Controller.extend(_wikiPageController.default, {
		article: controller(),

		actions: {
			/**
    * @returns {void}
    */
			articleRendered: function articleRendered() {
				var _get;

				(_get = this.get('article')).send.apply(_get, ['articleRendered'].concat(Array.prototype.slice.call(arguments)));
			},


			/**
    * @param {number} page
    * @returns {Promise}
    */
			loadPage: function loadPage(page) {
				var _this = this;

				if (page === null) {
					return Promise.reject(new Error('Page was not provided'));
				}

				return this.get('model').loadPage(page).then(function () {
					// Documentation says we should do `this.set('page', page)` but it doesn't update the URL
					// It's the same issue as HG-815, but here we bypass it in a better way
					// TODO figure out how to remove the param instead of going to ?page=1
					_this.transitionToRoute({
						queryParams: { page: page }
					});

					_this.get('target').send('updateDynamicHeadTags');
				});
			}
		}
	});
});