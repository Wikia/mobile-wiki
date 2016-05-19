import Ember from 'ember';

export default Ember.Controller.extend({
	application: Ember.inject.controller(),
	queryParams: ['query'],
	resultsCount: 50
});
