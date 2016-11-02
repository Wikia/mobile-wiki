import Ember from 'ember';
import request from 'ember-ajax/request';
import moment from 'moment';


const ImageReviewSummaryModel = Ember.Object.extend({
	summary: undefined,
	showSubHeader: true,

	setSummaryModel() {
		if (!Ember.isEmpty(this.startDate) || !Ember.isEmpty(this.endDate)) {
			request(M.getImageReviewServiceUrl('/statistics', {
				startDate: moment(this.startDate).format('YYYY-MM-DD'),
				endDate: moment(this.endDate).format('YYYY-MM-DD')
			}), {
				method: 'GET'
			}).then((payload) => {
				this.summary = payload;
			});
		}
	}
});

ImageReviewSummaryModel.reopenClass({
	createEmptyModel() {
		return request(M.getImageReviewServiceUrl('/info', {}), {
			method: 'GET',
		}).then((payload) => {
			return ImageReviewSummaryModel.create({
				userCanAuditReviews: payload.userAllowedToAuditReviews
			});
		});
	}
});

export default ImageReviewSummaryModel;
