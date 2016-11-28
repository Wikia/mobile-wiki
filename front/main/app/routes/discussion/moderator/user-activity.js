import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
		days: {
			refreshModel: true
		}
	}
});
