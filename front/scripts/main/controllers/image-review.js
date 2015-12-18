export default Ember.Controller.extend({
	application: Ember.inject.controller(),

	actions: {
		reviewAndGetMoreImages() {
			this.get('target').send('reviewAndGetMoreImages');
		},

		getFlaggedOnly() {
			this.get('target').send('getFlaggedOnly');
		}
	}
});
