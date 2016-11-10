import Ember from 'ember';
import rawRequest from 'ember-ajax/raw';
import request from 'ember-ajax/request';

const ImageReviewModel = Ember.Object.extend({
	showSubHeader: true,

	setImagesCount(status) {
		request(M.getImageReviewServiceUrl('/monitoring', {
			status
		})).then((promise) => {
			this.set('imagesToReviewCount', promise.countByStatus);
		});
	}
});

ImageReviewModel.reopenClass({

	startSession(status) {
		const options = {
			status
		};

		return rawRequest(M.getImageReviewServiceUrl(`/batch`, options), {
			method: 'POST'
		}).then(({payload, jqXHR}) => {
			// In case there are no more images, create empty model and show `No more images to review` message
			if (jqXHR.status === 204) {
				return ImageReviewModel.createEmptyModelWithPermission(status);
			} else {
				return ImageReviewModel.getImagesAndPermission(payload.id, status);
			}
		});
	},

	createEmptyModelWithPermission(status) {
		return ImageReviewModel.getUserAuditReviewPermission().then((userInfo) =>
				ImageReviewModel.create({userCanAuditReviews: userInfo, status}));
	},

	getImagesAndPermission(batchId, status) {
		const promises = [
			ImageReviewModel.getImages(batchId),
			ImageReviewModel.getUserAuditReviewPermission()
		];

		return Ember.RSVP.allSettled(promises)
		.then(([getImagesPromise, getUserAuditReviewPermissionPromise]) => {
			return ImageReviewModel
			.sanitize(
					getImagesPromise.value.imageList,
					getImagesPromise.value.batchId,
					getUserAuditReviewPermissionPromise.value,
					status
			);
		});
	},

	getUserAuditReviewPermission() {
		return request(M.getImageReviewServiceUrl('/info', {}), {
			method: 'GET',
		}).then((payload) => {
			return payload.userAllowedToAuditReviews;
		});
	},

	getImages(batchId) {
		return request(M.getImageReviewServiceUrl(`/batch/${batchId}`, {}));
	},

	sanitize(rawData, batchId, userCanAuditReviews, status) {
		const images = [];

		rawData.forEach((image) => {
			if (['UNREVIEWED', 'QUESTIONABLE', 'REJECTED'].indexOf(image.currentStatus) !== -1) {
				images.push(Ember.Object.create({
					batchId,
					imageId: image.imageId,
					fullSizeImageUrl: image.imageUrl,
					context: image.context,
					isContextProvided: Boolean(image.context),
					isContextLink: new RegExp('(http|https)?:\/\/[^\s]+').test(image.context),
					status: (status === 'rejected') ? 'rejected' : 'accepted'
				}));
			}
		});

		return ImageReviewModel.create({
			images,
			batchId,
			status,
			userCanAuditReviews
		});
	},

	reviewImages(images, batchId) {
		const imageList = images.map((item) => {
			return {
				imageId: item.imageId,
				imageStatus: item.status.toUpperCase()
			};
		});

		return request(M.getImageReviewServiceUrl(`/batch/${batchId}/`), {
			method: 'POST',
			dataType: 'text', // this is a dirty workaround
			data: JSON.stringify({images: imageList})
		});
	},


});

export default ImageReviewModel;
