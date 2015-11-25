App.ImageReviewModel = Em.Object.extend({
    sessionId: null
});

App.ImageReviewModel.reopenClass({
    /**
     * @returns {Em.RSVP.Promise} model
     */
    startSession() {
        console.log('ImageReviewModel.startSession() with userId '+M.prop('userId'));
        return new Em.RSVP.Promise((resolve, reject) => {
            Em.$.ajax({
                url: 'https://services-poz.wikia-dev.com/image-review/contract/',
				dataType: 'json',
				method: 'POST',
				xhrFields: {
					withCredentials: true
				},
                success: (data) => {
					resolve(new App.ImageReviewModel(data));
					console.log('Startsession success: '+JSON.stringify(data));
                },
                error: (data) => {
                    reject(data);
					console.log('Startsession error: '+JSON.stringify(data));
                }
            });
        });
    },

    endSession() {
        console.log('ImageReviewModel.endSession()');
        return new Em.RSVP.Promise((resolve, reject) => {
            Em.$.ajax({
				url: 'https://services.wikia-dev.com/image-review/contract/',
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

    getImages() {
        console.log('ImageReviewModel.getImages()');
        return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: 'https://services.wikia-dev.com/image-review/contract/',
				xhrFields: {
					withCredentials: true
				},
				dataType: 'json',
				method: 'GET',
				success: (data) => {
					resolve(data);
				},
				error: (data) => {
					reject(data);
				}
			});
        });
    },

    reviewImage() {
        console.log('ImageReviewModel.reviewImage()');
        return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: 'https://services.wikia-dev.com/image-review/contract/',
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
});
