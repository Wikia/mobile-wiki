App.ImageReviewRouteMixin = Em.Mixin.create({

    /**
     * @returns {void}
     */
    activate() {
        this.controllerFor('application').set('enableShareHeader', true);
    },

    /**
     * @returns {void}
     */
    deactivate() {
        this.controllerFor('application').set('enableShareHeader', false);
    },

    /**
     * @param {*} controller
     * @param {App.ImageReviewModel} model
     * @returns {void}
     */
    renderTemplate(controller, model) {
        this.render('image-review', {
        controller: 'imageReview',
        model: {
            curatedContent: model
        }
        });
    },
});