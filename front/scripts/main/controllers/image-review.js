export default Ember.Controller.extend({
	actions: {
		reviewAndGetMoreImages() {
			this.get('target').send('reviewAndGetMoreImages');
		},

		getFlaggedOnly() {
			this.get('target').send('getFlaggedOnly');
		}
	}
});
