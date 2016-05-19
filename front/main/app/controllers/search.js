import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	queryParams: ['query'],
	resultsCount: 50,

	actions: {
		onSearchEnter: function(query) {
			this.set('query', query);
			this.get('model').search(query);
		},
		onSuggestionClick: function() {}
	}
});
