import Ember from 'ember';
import request from 'ember-ajax/request';

const ImageReviewItemModel = Ember.Object.extend({
	status: 'accepted'
});

ImageReviewItemModel.reopenClass({
	getImageContext(imageId) {
		return request(M.getStaticAssetsServiceUrl(`/image/info/${imageId}`));
	},

	getImageHistory(imageId) {
		return request(M.getImageReviewServiceUrl(`/history/${imageId}`));
	}
});

export default ImageReviewItemModel;
