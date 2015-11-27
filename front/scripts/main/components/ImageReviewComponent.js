App.ImageReviewComponent = Em.Component.extend({
	classNames: ['image-review'],
	isLoading: false,
	actions: {
		reviewImages() {
			App.ImageReviewComponent.isLoading = true;
			this.sendAction('reviewImages');
		},

		getMoreImages() {
			App.ImageReviewComponent.isLoading = true;
			this.sendAction('getMoreImages');
		},

		reviewAndGetMoreImages() {
			App.ImageReviewComponent.isLoading = true;
			this.sendAction('reviewAndGetMoreImages');
		}
	},
});
