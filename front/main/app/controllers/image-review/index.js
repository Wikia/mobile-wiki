import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['fullscreen', 'order', 'source'],
	order: 'NEWEST',
	source: '',
	actions: {
		reviewAndGetMoreImages() {
			this.get('target').send('reviewAndGetMoreImages', this.get('order'), this.get('source'));
		},

		getAllWithStatus(status) {
			this.get('target').send('getAllWithStatus', status);
		},

		changeItemModel(id, status) {
			this.get('target').send('changeItemModel', id, status);
		},

		openMainPage() {
			this.get('target').send('openMainPage');
		},

		openSummary() {
			this.get('target').send('openSummary');
		},

		changeImageOrder(order) {
			this.set('order', order);
		}
	}
});
