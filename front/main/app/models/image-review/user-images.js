import Ember from 'ember';
import rawRequest from 'ember-ajax/raw';
import request from 'ember-ajax/request';

const UserImagesModel = Ember.Object.extend({
	username: '',
	images: []
});

function coppaStatus(status) {
	if (status !== 'REJECTED') {
		return 'ACCEPTED';
	}
	return status;
}

UserImagesModel.reopenClass({

	imagesFor(username) {
		return rawRequest(M.getImageReviewServiceUrl(`/user/${username}/images`), {method: 'POST'})
			.then(({payload, jqXHR}) => {
				if (jqXHR.status === 204) {
					return {
						batchId: null,
						images: null
					};
				} else {
					return request(M.getImageReviewServiceUrl(`/batch/${payload.id}`))
						.then(({batchId, imageList}) => {
							const linkRegexp = new RegExp('(http|https)?:\/\/[^\s]+');
							const images = imageList.map((image) => Ember.Object.create({
								imageId: image.imageId,
								fullSizeImageUrl: image.imageUrl,
								context: image.context,
								source: image.source,
								isContextProvided: Boolean(image.context),
								isContextLink: linkRegexp.test(image.context),
								status: coppaStatus(image.currentStatus)
							}));
							return {
								batchId,
								images
							};
						});
				}
			})
			.then(({batchId, images}) => UserImagesModel.create({batchId, images, username}));
	},

	reviewUserImages(images, batchId) {
		const removedImages = images
			.filter((img) => img.status === 'REJECTED')
			.map(({imageId}) => {
				return {
					imageId,
					imageStatus: 'REMOVED'
				};
			});
		return request(M.getImageReviewServiceUrl(`/batch/${batchId}`), {
			method: 'POST',
			data: JSON.stringify({images: removedImages})
		});
	}

});

export default UserImagesModel;
