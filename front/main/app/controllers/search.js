import Ember from 'ember';

const {Controller, inject} = Ember;

export default Controller.extend({
	application: inject.controller(),
	queryParams: ['query'],
	errorPageQueryMarkup: Ember.computed('query', function() {
		return '<span class="search__query-not-found">' + this.get('query') + '</span>';
	}),
	errorName: Ember.computed.alias('model.error'),

	actions: {
		onSearchEnter(query) {
			this.set('query', query);
			this.get('model').search(query);
		},

		onErrorPageClick() {
			this.set('query', '');
		}
	}
});
