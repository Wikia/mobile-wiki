import Ember from 'ember';
import moment from 'moment';
import request from 'ember-ajax/request';

const ImageReviewSummaryModel = Ember.Object.extend({
	summary: null,
	showSubHeader: true,

	setSummaryModel() {
		if (!Ember.isEmpty(this.startDate) || !Ember.isEmpty(this.endDate)) {
			request(M.getImageReviewServiceUrl('/statistics', {
				startDate: this.startDate,
				endDate: this.endDate
			}), {
				method: 'GET'
			}).then((payload) => {
				this.set('summary', payload);
			});
		}
	},

	setStartDate(startDate) {
		this.startDate = moment(startDate).format('YYYY-MM-DD');
		this.csvLink = M.getImageReviewServiceUrl('/statistics/csv', {
			startDate: this.startDate,
			endDate: this.endDate
		});
	},

	setEndDate(endDate) {
		this.endDate = moment(endDate).format('YYYY-MM-DD');
		this.csvLink = M.getImageReviewServiceUrl('/statistics/csv', {
			startDate: this.startDate,
			endDate: this.endDate
		});
	}
});

ImageReviewSummaryModel.reopenClass({
	createEmptyModel() {
		const startDate = moment(new Date()).format('YYYY-MM-DD');
		const endDate = moment(new Date()).format('YYYY-MM-DD');
		const csvLink = M.getImageReviewServiceUrl('/statistics/csv', {startDate, endDate});

		return request(M.getImageReviewServiceUrl('/info', {}), {
			method: 'GET',
		}).then((payload) => {
			return ImageReviewSummaryModel.create({
				userCanAuditReviews: payload.userAllowedToAuditReviews,
				startDate,
				endDate,
				csvLink,
			});
		});
	}
});

export default ImageReviewSummaryModel;
