import Ember from 'ember';

const {Controller, computed, inject, $, run} = Ember;

export default Controller.extend({
	application: inject.controller(),
	// TODO: to be removed as we'll be supporting more errors on search page,
	// see: https://wikia-inc.atlassian.net/browse/DAT-4324
	notFoundError: computed.equal('model.error', 'search-error-not-found'),

	init() {
		/*
			yes, we have the same function in two places (here and in wikia-search component).
			This was the best solution, as wikia-search component had to have implemented this function
			as well (because is used also in other contexts). We cannot pass actions from controllers
			to components (DDAU). Observing for certain property passed from controller to component
			wouldn't be clean solution as well.
		*/
		run.scheduleOnce('afterRender', this, () => {
			this.set('inputPhrase', this.get('query'));
			this.set('inputField', $('.side-search__input'));
		});
	},

	actions: {
		onSearchEnter(query) {
			this.set('inputPhrase', query);
			this.set('query', query);
		},

		onErrorPageClick() {
			this.set('inputPhrase', '');
			this.get('inputField').focus();
		},

		onLoadMore() {
			this.get('model').loadMore();
		}
	}
});
