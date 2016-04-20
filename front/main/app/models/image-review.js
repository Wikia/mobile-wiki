import Ember from 'ember';
import request from 'ember-ajax/request';

const ImageReviewModel = Ember.Object.extend({
	showSubHeader: true
});

ImageReviewModel.reopenClass({

	startSession(onlyFlagged) {
		const options = {};

		if (onlyFlagged) {
			options.status = 'FLAGGED';
		}

		return request(M.getImageReviewServiceUrl(`/contract`, options), {
			method: 'POST',
		}).then((data, textStatus, xhr) => {
			// In case there are no more images, create empty model and show `No more images to review` message
			if (xhr.status === 204) {
				resolve(ImageReviewModel.create({}));
			} else {
				resolve(ImageReviewModel.getImagesAndCount(data.id));
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
			}
		);
	},

	// Temporary endpoint for adding images
	addImage(contractId, imageId) {
		return request(M.getImageReviewServiceUrl(`/contract/${contractId}/image/${imageId}?status=UNREVIEWED`), {
			method: 'POST',
		});
	},

	sanitize(rawData, contractId, imagesToReviewCount) {
		const images = [];

		rawData.forEach((image) => {
			if (image.reviewStatus === 'UNREVIEWED' || image.reviewStatus === 'FLAGGED') {
				images.push(Ember.Object.create({
					imageId: image.imageId,
					fullSizeImageUrl: image.imageUrl,
					contractId,
					context: image.context || '#',
					status: 'accepted'
				}));
			}
		});
		return ImageReviewModel.create({images, contractId, imagesToReviewCount});
	},

	reviewImages(images) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const promises = images.map((item) => {
				return ImageReviewModel.reviewImage(item.contractId, item.imageId, item.status);
			});

			// Fast-fail method, if any of promises fails, method Ember.RSVP.all returns fail
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
			throw new Error(i18n.t('app.image-review-error-invalid-data'))
		});
	},

	getImagesAndCount(contractId) {
		const promises = [
			ImageReviewModel.getImages(contractId),
			ImageReviewModel.getImagesToReviewCount()
		];

		return Ember.RSVP.allSettled(promises).then(([getImagesPromise, getImagesToReviewCountPromise]) => {
			return ImageReviewModel.sanitize(getImagesPromise.value.data, getImagesPromise.value.contractId,
				getImagesToReviewCountPromise.value.countByStatus);
		});
	}
});

export default ImageReviewModel;
