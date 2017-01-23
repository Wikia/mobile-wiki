import Ember from 'ember';
import rawRequest from 'ember-ajax/raw';
import request from 'ember-ajax/request';

const ImageReviewModel = Ember.Object.extend({
	isRejectedQueue: Ember.computed('status', function () {
		return this.get('status') === 'REJECTED';
	})
});


function getImageCount(status, source) {
	return request(M.getImageReviewServiceUrl('/monitoring', {
		status, source
	}));
}

function getUserPermissions() {
	return request(M.getImageReviewServiceUrl('/info'));
}

function getImageSources() {
	return request(M.getImageReviewServiceUrl('/sources'))
		.catch(() => {
			return {
				sources: []
			};
		});
}

function toReviewStatus(imageStatus) {
	if (imageStatus === 'UNREVIEWED') {
		return 'ACCEPTED';
	}
	return imageStatus;
}

function getBatch(batchId) {
	if (batchId === 'no-more-images') {
		return {
			images: []
		};
	}
	return request(M.getImageReviewServiceUrl(`/batch/${batchId}`))
		.then(({batchId, imageList}) => {
			const linkRegexp = new RegExp('(http|https)?:\/\/[^\s]+');
			const images = imageList
				.map((image) =>
					Ember.Object.create({
						imageId: image.imageId,
						fullSizeImageUrl: image.imageUrl,
						context: image.context,
						source: image.source,
						isContextProvided: Boolean(image.context),
						isContextLink: linkRegexp.test(image.context),
						status: toReviewStatus(image.currentStatus)
					}));

			return {
				batchId,
				images
			};
		});
}

ImageReviewModel.reopenClass({

	reserveNewBatch(status, order, source) {
		return rawRequest(M.getImageReviewServiceUrl('/batch', {status, order, source}), {method: 'POST'})
			.then(({payload, jqXHR}) => {
				if (jqXHR.status === 204) {
					return 'no-more-images';
				} else {
					return payload.id;
				}
			});
	},

	getBatch(batchId, status, source) {
		return Ember.RSVP.all([
			getUserPermissions(),
			getImageSources(),
			getBatch(batchId),
			getImageCount(status, source)
		]).then(([permissions, sources, batch, imagesCount]) => {
			return ImageReviewModel.create(
				Ember.assign(permissions, sources, batch, {status}, {imagesToReviewCount: imagesCount.countByStatus})
			);
		});
	},

	reviewImages(images, batchId, status) {
		const imageList = images.map((item) => {
			return {
				imageId: item.imageId,
				imageStatus: (item.status.toUpperCase() === 'REJECTED' && status === 'REJECTED')
					? 'REMOVED'
					: item.status.toUpperCase()
			};
		});

		return request(M.getImageReviewServiceUrl(`/batch/${batchId}`), {
			method: 'POST',
			dataType: 'text', // this is a dirty workaround
			data: JSON.stringify({images: imageList})
		});
	},

});

export default ImageReviewModel;
