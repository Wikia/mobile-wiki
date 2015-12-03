import App from '../app';
import ImageReviewModel from '../models/image-review-model';
import ImageReviewRoute from '../routes/image-review-route';

export default App.ImageReviewComponent = Ember.Component.extend({
	classNames: ['image-review'],
	isLoading: false,

	actions: {
		reviewImages() {
			this.sendAction('reviewImages');
		},

		getMoreImages() {
			this.sendAction('getMoreImages');
		},

		reviewAndGetMoreImages() {
			this.sendAction('reviewAndGetMoreImages');
		}
	},
});
