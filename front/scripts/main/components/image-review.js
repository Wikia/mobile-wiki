export default Ember.Component.extend({
	classNames: ['image-review'],
	isLoading: false,
	isModalVisible: false,
	imageUrl: null,

	actions: {
		showModal(imageUrl) {
			this.set('modalImageUrl', imageUrl);
			this.set('isModalVisible', true);
		}
	}
});
