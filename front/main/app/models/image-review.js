import Ember from 'ember';

const ImageReviewModel = Ember.Object.extend({
	showSubHeader: true
});

ImageReviewModel.reopenClass({

	startSession(onlyFlagged) {
		const options = {};

		if (onlyFlagged) {
			options.status = 'FLAGGED';
		}

		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.getImageReviewServiceUrl(`/contract`, options),
				dataType: 'json',
				method: 'POST',
				xhrFields: {
					withCredentials: true
				},
				success: (data) => resolve(ImageReviewModel.getImagesAndCount(data.id)),
				error: (data) => reject(data)
			});
		});
	},

	endSession() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.getImageReviewServiceUrl(`/contract`, {}),
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'DELETE',
				success: (data) => resolve(data),
				error: (data) => reject(data)
			});
		});
	},

	getImages(contractId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.getImageReviewServiceUrl(`/contract/${contractId}/image`, {}),
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'GET',
				success: (data) => {
					if (Ember.isArray(data)) {
						resolve({data, contractId});
					} else {
						reject(i18n.t('app.image-review-error-invalid-data'));
					}
				},
				error: (data) => reject(data)
			});
		});
	},

	reviewImage(contractId, imageId, flag) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.getImageReviewServiceUrl(`/contract/${contractId}/image/${imageId}?status=${flag.toUpperCase()}`),
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'PUT',
				success: (data) => resolve(data),
				error: (data) => reject(data)
			});
		});
	},

	// Temporary endpoint for adding images
	addImage(contractId, imageId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.getImageReviewServiceUrl(`/contract/${contractId}/image/${imageId}?status=UNREVIEWED`),
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'POST',
				success: (data) => resolve(data),
				error: (data) => reject(data)
			});
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
					status: 'accepted'
				}));
			}
			// else skip because is reviewed already
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
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.getImageReviewServiceUrl('/monitoring', {
					status: 'UNREVIEWED'
				}),
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'GET',
				success: (data) => resolve(data),
				error: () => reject(i18n.t('app.image-review-error-invalid-data'))
			});
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
