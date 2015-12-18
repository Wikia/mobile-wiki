export default Ember.Controller.extend({
	queryParams: ['fullscreen'],
	actions: {
		reviewAndGetMoreImages() {
			this.get('target').send('reviewAndGetMoreImages');
		},

		getFlaggedOnly() {
			this.get('target').send('getFlaggedOnly');
		}
	}
});
