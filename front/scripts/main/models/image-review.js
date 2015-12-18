const ImageReviewModel = Ember.Object.extend({

	init() {
		this.isModalVisible = false;
		this.modalImageUrl = null;
		this.images = this.get('images');
	}
});

ImageReviewModel.reopenClass({

	startSession(onlyFlagged) {

		console.log(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${this.postId}`, {}));

		let url = ImageReviewModel.getServiceUrl;

		if (onlyFlagged) {
			url = `${url}?status=FLAGGED`;
		}

		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url,
				dataType: 'json',
				method: 'POST',
				xhrFields: {
					withCredentials: true
				},
				success: (data) => resolve(ImageReviewModel.getImages(data.id)),
				error: (data) => reject(data)
			});
		});
	},

	endSession() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: `${ImageReviewModel.getServiceUrl}/`,
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
				url: `${ImageReviewModel.getServiceUrl}/${contractId}/image`,
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'GET',
				success: (data) => {
					if (Ember.isArray(data)) {
						resolve(ImageReviewModel.sanitize(data, contractId));
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
				url: `${ImageReviewModel.getServiceUrl}/${contractId}/image/${imageId}?status=${flag}`,
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
				url: `${ImageReviewModel.getServiceUrl}/${contractId}/image?imageId=${imageId}&status=UNREVIEWED`,
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

	sanitize(rawData, contractId) {
		const images = [];

		rawData.forEach((image) => {
			if (image.reviewStatus === 'UNREVIEWED') {
				images.push({
					imageId: image.imageId,
					fullSizeImageUrl: image.imageUrl,
					contractId,
					status: 'ACCEPTED'
				});
			}
			// else skip because is reviewed already
		});

		return ImageReviewModel.create({images, contractId});
	},

	reviewImages(images) {
		images.forEach((imageItem) => {
			ImageReviewModel.reviewImage(imageItem.contractId, imageItem.imageId, imageItem.status);
		});
	},

	getServiceUrl: 'https://services-poz.wikia-dev.com/image-review/contract'
});

export default ImageReviewModel;
