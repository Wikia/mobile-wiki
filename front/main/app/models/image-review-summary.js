import Ember from 'ember';
import request from 'ember-ajax/request';

const ImageReviewSummaryModel = Ember.Object.extend({});

ImageReviewSummaryModel.reopenClass({
	createModelWithRequest() {
		return request(M.getImageReviewServiceUrl('/statistics', {}), {
			method: 'GET'
		}).then((payload) => {
			return ImageReviewSummaryModel.create({
				data: payload
			});
		})
	}
});

export default ImageReviewSummaryModel;
