import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['status', 'order', 'source'],
	status: 'UNREVIEWED',
	order: 'NEWEST',
	source: ''
});
