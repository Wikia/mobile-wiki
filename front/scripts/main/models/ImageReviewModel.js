App.ImageReviewModel = Em.Object.extend({
    sessionId: null
});

App.ImageReviewModel.reopenClass({
    /**
     * @returns {Em.RSVP.Promise} model
     */
    startSession() {
        console.log('ImageReviewModel.startSession()');
		//console.log('ID: '+M.prop('userId')+', access_token: '+M.prop('access_token'));
        return new Em.RSVP.Promise((resolve, reject) => {
            Em.$.ajax({
                url: 'https://services.wikia-dev.com/image-review/session/',
                data: {
                    AuthenticatedUser: {
                        userId: parseInt(M.prop('userId'))
                    },
                },
				headers: {
					'X-Wikia-UserId': M.prop('userId')
				},
				dataType: 'json',
				method: 'POST',
                success: (data) => {
					resolve(new ImageReviewModel(data));
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
				url: 'https://services.wikia-dev.com/image-review/session/',
                data: {
                    userId:'',
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
				url: 'https://services.wikia-dev.com/image-review/session/',
				data: {
					userId:'',
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

    reviewImage() {
        console.log('ImageReviewModel.reviewImage()');
        return new Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: 'https://services.wikia-dev.com/image-review/session/',
				data: {
					userId:'',
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
});
