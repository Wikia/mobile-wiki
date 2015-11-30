import App from '../app';

export default App.ImageReviewComponent = Ember.Component.extend({
	classNames: ['image-review'],
	isLoading: false,
	actions: {
		reviewImages() {
			console.log('reviewImages()');
			App.ImageReviewComponent.isLoading = true;
			this.sendAction('reviewImages');
		},

		getMoreImages() {
			console.log('getMoreImages()');
			App.ImageReviewComponent.isLoading = true;
			this.sendAction('getMoreImages');
		},

		reviewAndGetMoreImages() {
			console.log('reviewAndGetMoreImages()');
			App.ImageReviewComponent.isLoading = true;
			this.sendAction('reviewAndGetMoreImages');
		}
	},
});
