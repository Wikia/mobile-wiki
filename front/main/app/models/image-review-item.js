import Ember from 'ember';
import request from 'ember-ajax/request';

const ImageReviewItemModel = Ember.Object.extend({
	status: 'accepted'
});

ImageReviewItemModel.reopenClass({
	getImageContext(imageId) {
		return request(M.getStaticAssetsServiceUrl(`/image/context/${imageId}`));
	}
});

export default ImageReviewItemModel;
