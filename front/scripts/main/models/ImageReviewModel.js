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
    load() {
        console.log('----------------------ImageReviewModel.load()');
        return new Em.RSVP.Promise((resolve, reject) => {
            Em.$.ajax({
                url: M.buildUrl({
                    path: '/wikia.php'
                }),
                data: {
                    controller: '',
                },
                success: (data) => {
                    if (Em.isArray(data.data)) {
                        resolve(data.data);
                    } else {
                        reject('Invalid data was returned from Curated Content API');
                    }
                },
                error: (data) => {
                    reject(data);
                }
            });
        });
    },
});
