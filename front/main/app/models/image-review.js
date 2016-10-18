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

		return rawRequest(M.getImageReviewServiceUrl(`/contract`, options), {
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

	endSession(contractId) {
		return request(M.getImageReviewServiceUrl(`/contract/${contractId}`, {}), {
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
			M.getImageReviewServiceUrl(`/contract/${contractId}/image/${imageId}?status=${flag.toUpperCase()}`), {
				method: 'PUT',
			});
	},

	// Temporary endpoint for adding images
	addImage(contractId, imageId) {
		return request(M.getImageReviewServiceUrl(`/contract/${contractId}/image/${imageId}?status=UNREVIEWED`), {
			method: 'POST',
		});
	},

	sanitize(rawData, contractId, userInfo, status) {
		const images = [];

		rawData.forEach((image) => {
			if (['UNREVIEWED', 'QUESTIONABLE', 'REJECTED'].indexOf(image.reviewStatus) !== -1) {
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
			userCanAuditReviews: userInfo,
			status
		});
	},

	reviewImages(images, contractId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const promises = images.map((item) => {
				return ImageReviewModel.reviewImage(item.contractId, item.imageId, item.status);
			});

			Ember.RSVP.allSettled(promises).then((data) => {
				resolve(data);
			}, (data) => {
				reject(data);
			});
		}).then(() => {
			ImageReviewModel.endSession(contractId);
		});
	},


	getImagesAndPermission(contractId, status) {
		const promises = [
			ImageReviewModel.getImages(contractId),
			ImageReviewModel.getUserAuditReviewPermission()
		];

		return Ember.RSVP.allSettled(promises)
			.then(([getImagesPromise, getUserAuditReviewPermissionPromise]) => {
				return ImageReviewModel
					.sanitize(getImagesPromise.value.data,
						getImagesPromise.value.contractId,
						getUserAuditReviewPermissionPromise.value,
						status);
			});
	},

	getUserAuditReviewPermission() {
		return request(M.getImageReviewServiceUrl('/info', {}), {
			method: 'GET',
		}).then((payload) => {
			return payload.userAllowedToAuditReviews;
		});
	},

	createEmptyModelWithPermission(status) {
		return ImageReviewModel.getUserAuditReviewPermission().then((userInfo) =>
			ImageReviewModel.create({userCanAuditReviews: userInfo, status}));
	}
});

export default ImageReviewModel;
