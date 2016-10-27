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

		openMainPage() {
			this.get('target').send('openMainPage');
		},

		toggleSummary() {
			this.get('target').send('toggleSummary');
		},

		setStartDate(startDate) {
			this.get('target').send('setStartDate', startDate);
		},

		setEndDate(endDate) {
			this.get('target').send('setEndDate', endDate);
		}
	}
});
