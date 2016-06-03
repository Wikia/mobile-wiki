import Ember from 'ember';

const {Controller, computed, inject, $, run} = Ember;

export default Controller.extend({
	application: inject.controller(),
	queryParams: ['query'],
	// TODO: to be removed as we'll be supporting more errors on search page,
	// see: https://wikia-inc.atlassian.net/browse/DAT-4324
	notFoundError: computed.equal('model.error', 'search-error-not-found'),

	init() {
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
