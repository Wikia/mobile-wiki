import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['fullscreen', 'order'],
	order: 'NEWEST',
	actions: {
		reviewAndGetMoreImages(order) {
			this.get('target').send('reviewAndGetMoreImages', order);
		},

		getAllWithStatus(status) {
			this.get('target').send('getAllWithStatus', status);
		},

		changeItemModel(id, status) {
			this.get('target').send('changeItemModel', id, status);
		},

		openSummary() {
			this.get('target').send('openSummary');
		},

		changeImageOrder(order) {
			this.set('order', order);
		}
	}
});
