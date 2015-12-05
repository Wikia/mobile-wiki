import App from '../app';

export default App.ImageReviewModel = Ember.Object.extend({
	// @todo This one is dangerous, please read "Leaking state into the class"
	// part of https://dockyard.com/blog/2015/09/18/ember-best-practices-avoid-leaking-state-into-factories

	init() {
		this.sessionId = null;
		this.images = [];
	},

	reviewImages(images) {
		images.forEach((imageItem) => {
			App.ImageReviewModel.reviewImage(imageItem.contractId, imageItem.imageId, imageItem.status);
		});
	}
});

App.ImageReviewModel.reopenClass({

	startSession() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: App.ImageReviewModel.getServiceUrl,
				dataType: 'json',
				method: 'POST',
				xhrFields: {
					withCredentials: true
				},
				success: (data) => {
					// Temporary! Add 100 dummy image
					for (let i = 0; i < 100; i++) {
						App.ImageReviewModel.addImage(data.id, Math.random());
					}
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
				url: `${App.ImageReviewModel.getServiceUrl}${contractId}/image/?imageId=${imageId}&status=UNREVIEWED`,
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

	getServiceUrl: 'https://services-poz.wikia-dev.com/image-review/contract/'
});
