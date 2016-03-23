import Ember from 'ember';

const ImageReviewItemModel = Ember.Object.extend({
	status: 'accepted'
});

ImageReviewItemModel.reopenClass({
	getImageContext(imageId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.getStaticAssetsServiceUrl(`/image/context/${imageId}`),
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'GET',
				success: (data) => resolve(data),
				error: () => reject()
			});
		});
	}
});

export default ImageReviewItemModel;
