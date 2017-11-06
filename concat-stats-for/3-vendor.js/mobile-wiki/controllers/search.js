define('mobile-wiki/controllers/search', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Controller = Ember.Controller,
	    computed = Ember.computed,
	    inject = Ember.inject,
	    $ = Ember.$;
	exports.default = Controller.extend({
		application: inject.controller(),
		fastboot: inject.service(),
		// TODO: to be removed as we'll be supporting more errors on search page,
		// see: https://wikia-inc.atlassian.net/browse/DAT-4324
		notFoundError: computed.equal('model.error', 'search-error-not-found'),
		inputPhrase: computed.alias('query'),

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