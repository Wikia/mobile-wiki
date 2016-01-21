import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['fullscreen'],
	actions: {
		reviewAndGetMoreImages() {
			this.get('target').send('reviewAndGetMoreImages');
		},

		getFlaggedOnly() {
			this.get('target').send('getFlaggedOnly');
		},

		changeItemModel(id, status) {
			this.get('target').send('changeItemModel', id, status);
		},

		openMainPage() {
			this.get('target').send('openMainPage');
		}
	}
});
