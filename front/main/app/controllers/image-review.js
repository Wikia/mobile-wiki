import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['fullscreen'],
	actions: {
		reviewAndGetMoreImages() {
			this.get('target').send('reviewAndGetMoreImages');
		},

		getUnreviewedOnly() {
			this.get('target').send('getUnreviewedOnly');
		},

		getFlaggedOnly() {
			this.get('target').send('getFlaggedOnly');
		},

		getRejectedOnly() {
			this.get('target').send('getRejectedOnly');
		},

		changeItemModel(id, status) {
			this.get('target').send('changeItemModel', id, status);
		},

		openMainPage() {
			this.get('target').send('openMainPage');
		}
	}
});
