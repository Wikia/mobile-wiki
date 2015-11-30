App.ImageReviewMixin = Em.Mixin.create({

    /**
     * @param {*} controller
     * @param {App.ImageReviewModel} model
     * @returns {void}
     */
    renderTemplate(controller: any , model: any) {
        console.log("Image review renderTemplate called!");
        this.render('image-review', {
        	controller: controller,
        	model: model
        });
    }
});
