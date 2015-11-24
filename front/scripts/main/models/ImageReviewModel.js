App.ImageReviewModel = Em.Object.extend({
    featured: null,
    curated: null,
    optional: null,
    isDirty: false
});

App.ImageReviewModel.reopenClass({
    /**
     * @returns {Em.RSVP.Promise} model
     */
    startSession() {
        console.log('ImageReviewModel.startSession()');
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
					console.log('Startsession success: '+data);
					resolve(data.data);
                },
                error: (data) => {
					console.log('Startsession error: '+JSON.stringify(data));
                    reject(data);
                }
            });
        });
    },

    endSession() {
        console.log('ImageReviewModel.endSession()');
        return new Em.RSVP.Promise((resolve, reject) => {
            Em.$.ajax({
                url: '',
                data: {
                    userId:'',
                },
                success: (data) => {
                    if (Em.isArray(data.data)) {
                        resolve(data.data);
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

    getImages() {
        console.log('ImageReviewModel.getImages()');
        return new Em.RSVP.Promise((resolve, reject) => {
            Em.$.ajax({
                url: '',
                data: {
                    userId:'',
                },
                success: (data) => {
                    if (Em.isArray(data.data)) {
                        resolve(data.data);
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

    reviewImage() {
        console.log('ImageReviewModel.reviewImage()');
        return new Em.RSVP.Promise((resolve, reject) => {
            Em.$.ajax({
                url: '',
                data: {
                    userId:'',
                },
                success: (data) => {
                    if (Em.isArray(data.data)) {
                        resolve(data.data);
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
});
