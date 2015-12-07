import App from '../app';

export default App.ImageReviewModel = Ember.Object.extend({

	init() {
		this.sessionId = null;
		this.isModalVisible = false;
		this.modalImageUUID = '';
		this.images = this.get('images');
	},
	reviewImages(images) {
		images.forEach((imageItem) => {
			App.ImageReviewModel.reviewImage(imageItem.contractId, imageItem.imageId, imageItem.status);
		});
	}
});

App.ImageReviewModel.reopenClass({

	startSession() {
		// Temporary! Add 100 dummy images
		// for (let i = 0; i < 500; i++) {
		//	 App.ImageReviewModel.addImage('13814000-1dd2-11b2-8080-808080808080',
		//		 App.ImageReviewModel.generateRandomUUID());
		// }
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: App.ImageReviewModel.getServiceUrl,
				dataType: 'json',
				method: 'POST',
				xhrFields: {
					withCredentials: true
				},
				success: (data) => {
					resolve(App.ImageReviewModel.getImages(data.id));
				},
				error: (data) => {
					reject(data);
				}
			});
		});
	},

	endSession() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: App.ImageReviewModel.getServiceUrl,
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'DELETE',
				success: (data) => {
					resolve(data);
				},
				error: (data) => {
					reject(data);
				}
			});
		});
	},

	getImages(contractId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: `${App.ImageReviewModel.getServiceUrl}${contractId}/image`,
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'GET',
				success: (data) => {
					if (Ember.isArray(data)) {
						resolve(App.ImageReviewModel.sanitize(data, contractId));
					} else {
						reject('Invalid data was returned from Image Review API');
					}
				},
				error: (data) => {
					reject(data);
				}
			});
		});
	},

	reviewImage(contractId, imageId, flag) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: `${App.ImageReviewModel.getServiceUrl}${contractId}/image/${imageId}?status=${flag}`,
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'PUT',
				success: (data) => {
					resolve(data);
				},
				error: (data) => {
					reject(data);
				}
			});
		});
	},

	// Temporary endpoint for adding images
	addImage(contractId, imageId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: `${App.ImageReviewModel.getServiceUrl}${contractId}/image?imageId=${imageId}&status=UNREVIEWED`,
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'POST',
				success: (data) => {
					resolve(data);
				},
				error: (data) => {
					reject(data);
				}
			});
		});
	},

	sanitize(rawData, contractId) {
		const images = [];

		rawData.forEach((image) => {
			if (image.reviewStatus === 'UNREVIEWED') {
				images.push({
					imageId: image.imageId,
					contractId, status: 'ACCEPTED'
				});
			}
			// else skip because is reviewed already
		});

		return App.ImageReviewModel.create({images, contractId});
	},
	generateRandomUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			let r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	},
	getServiceUrl: 'https://services-poz.wikia-dev.com/image-review/contract/'
});
