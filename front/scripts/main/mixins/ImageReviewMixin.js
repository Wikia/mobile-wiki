App.ImageReviewRouteMixin = Em.Mixin.create({

    /**
     * @returns {void}
     */
    activate() {
        this.controllerFor('imageReview').set('enableShareHeader', true);
    },

    /**
     * @returns {void}
     */
    deactivate() {
        this.controllerFor('imageReview').set('enableShareHeader', false);
    },

    /**
     * @param {*} controller
     * @param {App.ImageReviewModel} model
     * @returns {void}
     */
    renderTemplate(controller, model) {
        this.render('image-review', {
        controller: 'imageReview',
        model: model
        });
    }
});