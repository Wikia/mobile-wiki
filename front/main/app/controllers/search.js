import Ember from 'ember';

const {Controller, inject} = Ember;

export default Controller.extend({
	application: inject.controller(),
	queryParams: ['query'],

	actions: {
		onSearchEnter(query) {
			this.set('query', query);
			this.get('model').search(query);
		}
	}
});
