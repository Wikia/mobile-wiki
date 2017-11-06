define('mobile-wiki/controllers/search', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var equal = Ember.computed.equal;
	var alias = Ember.computed.alias;
	var Controller = Ember.Controller;
	var controller = Ember.inject.controller;
	var $ = Ember.$;
	exports.default = Controller.extend({
		application: controller(),
		fastboot: service(),
		// TODO: to be removed as we'll be supporting more errors on search page,
		// see: https://wikia-inc.atlassian.net/browse/DAT-4324
		notFoundError: equal('model.error', 'search-error-not-found'),
		inputPhrase: alias('query'),

		actions: {
			onSearchEnter: function onSearchEnter(query) {
				this.set('inputPhrase', query);
				this.set('query', query);
			},
			onErrorPageClick: function onErrorPageClick() {
				this.set('inputPhrase', '');
				$('.side-search__input').focus();
			},
			onLoadMore: function onLoadMore() {
				this.get('model').loadMore();
			}
		}
	});
});