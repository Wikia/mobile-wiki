import Ember from 'ember';
import ImageReviewSummaryModel from '../../models/image-review/summary';

const {Route} = Ember;

export default Route.extend({
	model() {
		return ImageReviewSummaryModel.createEmptyModel();
	},

	afterModel() {
		this.controllerFor('application').set('isLoading', false);
	},

	actions: {
		toggleSummary() {
			this.modelFor('image-review.summary').setSummaryModel();
		},

		setStartDate(startDate) {
			this.modelFor('image-review.summary').set('startDate', startDate);
		},

		setEndDate(endDate) {
			this.modelFor('image-review.summary').set('endDate', endDate);
		},

		openImageReview() {
			this.transitionTo('image-review.index');
		},

		didTransition() {
			this.controllerFor('application').set('fullPage', true);
		}
	}
});
