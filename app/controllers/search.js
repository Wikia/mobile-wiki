import Ember from 'ember';

const {
	Controller,
	computed,
	inject,
	$,
} = Ember;

export default Controller.extend({
	application: inject.controller(),
	fastboot: inject.service(),
	// TODO: to be removed as we'll be supporting more errors on search page,
	// see: https://wikia-inc.atlassian.net/browse/DAT-4324
	notFoundError: computed.equal('model.error', 'search-error-not-found'),
	inputPhrase: computed.alias('query'),

	actions: {
		onSearchEnter(query) {
			this.set('inputPhrase', query);
			this.set('query', query);
		},

		onErrorPageClick() {
			this.set('inputPhrase', '');
			$('.side-search__input').focus();
		},

		onLoadMore() {
			this.get('model').loadMore();
		}
	}
});
