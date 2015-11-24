App.ImageReviewRoute = Em.Route.extend(
    ImageReviewRouteMixin, {
    model() {
        console.log("Imager review route called!");
        return App.ImageReviewModel.load();
    }
});