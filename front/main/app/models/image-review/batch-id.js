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

	reserveNewBatch(status) {

		return rawRequest(M.getImageReviewServiceUrl(`/batch`, {
			status
		}), {
			method: 'POST'
		});
	},

	startSession(status, batchId) {
		if (batchId === 'no-more-images') {
			return ImageReviewModel.createEmptyModelWithPermission(status);
		} else {
			return ImageReviewModel.getImagesAndPermission(batchId, status);
		}
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
		const linkRegexp = new RegExp('(http|https)?:\/\/[^\s]+');
		rawData.forEach((image) => {
			images.push(Ember.Object.create({
				batchId,
				imageId: image.imageId,
				fullSizeImageUrl: status === 'REJECTED' ? `${image.imageUrl}?status=REJECTED` : image.imageUrl,
				context: image.context,
				isContextProvided: Boolean(image.context),
				isContextLink: linkRegexp.test(image.context),
				status: ImageReviewModel.figureOutStatus(status, image.currentStatus)
			}));
		});

		return ImageReviewModel.create({
			images,
			batchId,
			status,
			userCanAuditReviews,
			isRejectedQueue: (status === 'REJECTED')
		});
	},

	figureOutStatus(queueStatus, imageStatus) {
		if (queueStatus === 'REJECTED') {
			return 'rejected';
		} else if (imageStatus === 'UNREVIEWED') {
			return 'accepted';
		} else {
			return imageStatus.toLowerCase();
		}
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

		return request(M.getImageReviewServiceUrl(`/batch/${batchId}/`), {
			method: 'POST',
			dataType: 'text', // this is a dirty workaround
			data: JSON.stringify({images: imageList})
		});
	},


});

export default ImageReviewModel;
