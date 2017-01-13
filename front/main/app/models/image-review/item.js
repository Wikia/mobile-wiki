import Ember from 'ember';
import request from 'ember-ajax/request';

const ImageReviewItemModel = Ember.Object.extend({
	status: 'accepted'
});

ImageReviewItemModel.reopenClass({
	getImageInfo(imageId) {
		return request(M.getImageReviewServiceUrl(`/image/${imageId}/info`));
	},

	getImageContext(imageId) {
		return request(M.getStaticAssetsServiceUrl(`/image/info/${imageId}`));
	},

	getImageHistory(imageId) {
		return request(M.getImageReviewServiceUrl(`/image/${imageId}/history`));
	},
	getOwnerLookupUrl(ownerId) {
		return M.buildUrl({
			wiki: 'community',
			namespace: 'Special',
			title: 'LookupUser',
			query: {mode: 'by_id', target: ownerId}
		});
	}
});

export default ImageReviewItemModel;
