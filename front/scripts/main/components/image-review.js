export default Ember.Component.extend({
	classNames: ['image-review'],
	isLoading: false,

	actions: {
		reviewAndGetMoreImages() {
			this.sendAction('reviewAndGetMoreImages');
		},

		showModal(imageUrl) {
			this.sendAction('showModal', imageUrl);
		},

		getFlaggedOnly() {
			this.sendAction('getFlaggedOnly');
		}
	}
});
