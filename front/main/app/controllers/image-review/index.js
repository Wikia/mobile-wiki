import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['status', 'order'],
	status: 'UNREVIEWED',
	order: 'NEWEST'
});
