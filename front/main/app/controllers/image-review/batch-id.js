import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['fullscreen'],
	actions: {
		reviewAndGetMoreImages() {
			this.get('target').send('reviewAndGetMoreImages');
		},

		getAllWithStatus(status) {
			this.get('target').send('getAllWithStatus', status);
		},

		changeItemModel(id, status) {
			this.get('target').send('changeItemModel', id, status);
		},

		goBackToLastBatch() {
			this.get('target').send('goBackToLastBatch');
		},

		openSummary() {
			this.get('target').send('openSummary');
		}
	}
});
