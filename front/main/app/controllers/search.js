import Ember from 'ember';

const {Controller, computed, inject, $, run} = Ember;

export default Controller.extend({
	application: inject.controller(),
	queryParams: ['query'],
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
			this.set('inputField', $('.side-search__input'));
		});
	},

	actions: {
		onSearchEnter(query) {
			this.get('inputField').blur();
			this.set('query', query);
			this.get('model').search(query);
		},

		onErrorPageClick() {
			this.set('query', '');
			this.get('inputField').focus();
		}
	}
});
