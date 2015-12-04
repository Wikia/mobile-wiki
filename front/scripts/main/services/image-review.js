import App from '../app';

// This service is introducted because we wanted to have persistent contractId for imageReview and fetch new images
// by refreshing a main image-review route

export default App.ImageReviewService = Ember.Service.extend({
	init() {
		this.set('contractId', null);
	},

	startSession() {
		if (this.contractId === null) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				Ember.$.ajax({
					url: App.ImageReviewModel.getServiceUrl,
					dataType: 'json',
					method: 'POST',
					xhrFields: {
						withCredentials: true
					},
					success: (data) => {
						this.set('contractId', data.id);
						resolve({contractId: data.id});
					},
					error: (data) => {
						reject(data);
					}
				});
			});
		} else {
			return this.get('contractId');
		}
	}
});
