App.ImageReviewRoute = Em.Route.extend(
    App.ImageReviewMixin, {
    model() {
        console.log("Imager review route called!");
        return App.ImageReviewModel.startSession();
    }
});