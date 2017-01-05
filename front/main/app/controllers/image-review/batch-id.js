import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['status', 'order'],
	status: 'UNREVIEWED',
	order: 'NEWEST',
	actions: {
		reviewAndGetMoreImages() {
			this.get('target').send('reviewAndGetMoreImages');
		},

		openSummary() {
			this.get('target').send('openSummary');
		},

		changeImageOrder(order) {
			this.set('order', order);
		}
	}
});
