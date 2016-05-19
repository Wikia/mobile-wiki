import Ember from 'ember';

const {Controller, inject} = Ember;

export default Controller.extend({
	application: inject.controller(),
	queryParams: ['query'],
	resultsCount: 50,

	actions: {
		onSearchEnter(query) {
			this.set('query', query);
			this.get('model').search(query);
		}
	}
});
