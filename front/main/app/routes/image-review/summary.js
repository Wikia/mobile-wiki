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

		toggleHistory() {
			this.modelFor('image-review.summary').setHistoryModel();
		},

		downloadCSV() {
			this.modelFor('image-review.summary').downloadCSV();
		},

		setStartDate(startDate) {
			this.modelFor('image-review.summary').setStartDate(startDate);
		},

		setEndDate(endDate) {
			this.modelFor('image-review.summary').setEndDate(endDate);
		},

		openImageReview() {
			this.transitionTo('image-review.index');
		},

		didTransition() {
			this.controllerFor('application').set('fullPage', true);
		}
	}
});
