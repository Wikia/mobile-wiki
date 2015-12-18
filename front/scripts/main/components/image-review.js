export default Ember.Component.extend({
	classNames: ['image-review'],
	isLoading: false,
	isModalVisible: false,
	imageUrl: null,

	actions: {
		reviewAndGetMoreImages() {
			this.sendAction('reviewAndGetMoreImages');
		},

		showModal(imageUrl) {
			this.set('modalImageUrl', imageUrl);
			this.set('isModalVisible', true);
		},

		getFlaggedOnly() {
			this.sendAction('getFlaggedOnly');
		}
	}
});
