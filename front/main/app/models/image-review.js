import Ember from 'ember';
import rawRequest from 'ember-ajax/raw';
import request from 'ember-ajax/request';

const ImageReviewModel = Ember.Object.extend({
	showSubHeader: true
});

ImageReviewModel.reopenClass({

	startSession(status) {
		const options = {
			status
		};

		return rawRequest(M.getImageReviewServiceUrl(`/contract`, options), {
			method: 'POST'
		}).then(({payload, jqXHR}) => {
			// In case there are no more images, create empty model and show `No more images to review` message
			if (jqXHR.status === 204) {
				return ImageReviewModel.createEmptyModelWithPermission();
			} else {
				return ImageReviewModel.getImagesAndCount(payload.id);
			}
		});
	},

	endSession() {
		return request(M.getImageReviewServiceUrl(`/contract`, {}), {
			method: 'DELETE',
		});
	},

	getImages(contractId) {
		return request(M.getImageReviewServiceUrl(`/contract/${contractId}/image`, {}))
			.then((data) => {
				if (Ember.isArray(data)) {
					return {data, contractId};
				} else {
					throw new Error(i18n.t('app.image-review-error-invalid-data'));
				}
			});
	},

	reviewImage(contractId, imageId, flag) {
		return request(
			M.getImageReviewServiceUrl(`/contract/${contractId}/image/${imageId}?status=${flag.toUpperCase()}`),
			{
				method: 'PUT',
			});
	},

	// Temporary endpoint for adding images
	addImage(contractId, imageId) {
		return request(M.getImageReviewServiceUrl(`/contract/${contractId}/image/${imageId}?status=UNREVIEWED`), {
			method: 'POST',
		});
	},

	sanitize(rawData, contractId, imagesToReviewCount, userInfo) {
		const images = [];

		rawData.forEach((image) => {
			if (['UNREVIEWED', 'FLAGGED', 'REJECTED'].indexOf(image.reviewStatus) !== -1) {
				images.push(Ember.Object.create({
					imageId: image.imageId,
					fullSizeImageUrl: image.imageUrl,
					contractId,
					context: image.context || '#',
					status: 'accepted',
					history: image.imageHistory
				}));
			}
		});

		return ImageReviewModel.create({
			images,
			contractId,
			imagesToReviewCount,
			userCanAuditReviews: userInfo
		});
	},

	reviewImages(images) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const promises = images.map((item) => {
				return ImageReviewModel.reviewImage(item.contractId, item.imageId, item.status);
			});

			Ember.RSVP.all(promises).then((data) => {
				resolve(data);
			}, (data) => {
				reject(data);
			});
		});
	},

	getImagesToReviewCount() {
		return request(M.getImageReviewServiceUrl('/monitoring', {
			status: 'UNREVIEWED'
		})).catch(() => {
			throw new Error(i18n.t('app.image-review-error-invalid-data'));
		});
	},

	getImagesAndCount(contractId) {
		const promises = [
			ImageReviewModel.getImages(contractId),
			ImageReviewModel.getImagesToReviewCount(),
			ImageReviewModel.getUserAuditReviewPermission()
		];

		return Ember.RSVP.allSettled(promises)
			.then(([getImagesPromise, getImagesToReviewCountPromise, getUserAuditReviewPermissionPromise]) => {
				return ImageReviewModel.sanitize(getImagesPromise.value.data,
					getImagesPromise.value.contractId,
					getImagesToReviewCountPromise.value.countByStatus,
					getUserAuditReviewPermissionPromise.value.userAllowedToAuditReviews);
			});
	},

	getUserAuditReviewPermission() {
		return request(M.getImageReviewServiceUrl('/info', {}), {
			method: 'GET',
		}).then((payload) => {
			return payload.userAllowedToAuditReviews;
		});
	},

	createEmptyModelWithPermission() {
		return ImageReviewModel.getUserAuditReviewPermission().then((userInfo) =>
			ImageReviewModel.create({userCanAuditReviews: userInfo.userAllowedToAuditReviews}));
	}
});

export default ImageReviewModel;
