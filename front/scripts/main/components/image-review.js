import App from '../app';

export default App.ImageReviewComponent = Ember.Component.extend({
	classNames: ['image-review'],
	isLoading: false,

	actions: {
		reviewAndGetMoreImages() {
			this.sendAction('reviewAndGetMoreImages');
		},

		showModal(id) {
			this.sendAction('showModal', id);
		},

		getFlaggedOnly() {
			this.sendAction('getFlaggedOnly');
		}
	}
});
