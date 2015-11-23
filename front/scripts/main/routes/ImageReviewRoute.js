App.ImageReviewRoute = Em.Route.extend(
    ImageReviewRouteMixin, {
    model() {
        return App.ImageReviewModel.load();
    }
});