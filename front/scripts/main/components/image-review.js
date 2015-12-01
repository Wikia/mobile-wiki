import App from '../app';
import ImageReviewModel from '../models/image-review-model';

export default App.ImageReviewComponent = Ember.Component.extend({
	classNames: ['image-review'],
	isLoading: false,  //Is it needed?

	actions: {
		reviewImages() {
			console.log('reviewImages()');

			this.get('model.images').map(function(x) {
				ImageReviewModel.reviewImage(x.contractId, x.imageId, x.status);
			});
		},

		getMoreImages() {
			console.log('getMoreImages()');
			this.sendAction('getMoreImages');
		},

		reviewAndGetMoreImages() {
			console.log('reviewAndGetMoreImages()');
			this.sendAction('reviewAndGetMoreImages');
		}
	},
});
