App.ImageReviewController = Em.Controller.extend({
    application: Em.inject.controller(),

    init() {
        console.log("Image review init controller");
        this.setProperties({
            mainPageTitle: 'Image Review',
            siteName: 'Image Review'
        });
    }
});