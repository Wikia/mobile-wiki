import App from '../app';
import ImageReviewModel from '../models/image-review-model';

export default App.ImageReviewComponent = Ember.Component.extend({
	classNames: ['image-review'],
	isLoading: false,  //Is it needed?

	actions: {
		reviewImages() {
			this.get('model.images').forEach(function(imageItem) {
				ImageReviewModel.reviewImage(imageItem.contractId, imageItem.imageId, imageItem.status);
			});
		},

		getMoreImages() {
			this.sendAction('getMoreImages');
		},

		reviewAndGetMoreImages() {
			this.sendAction('reviewAndGetMoreImages');
		}
	},
});
