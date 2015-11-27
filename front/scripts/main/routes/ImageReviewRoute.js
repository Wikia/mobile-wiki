App.ImageReviewRoute = Em.Route.extend(
    App.ImageReviewMixin, {

		model() {
			console.log("Image review route");
			var _this = this; //Save context to this
			return App.ImageReviewModel.startSession();
		},
		actions: {
			error(error) {
				console.log('Action error: '+JSON.stringify(error));
				if (error.status === 401) {
					this.controllerFor('application').addAlert({
						message: 'Unauthorized, you don\'t have permissions to see this page',
						type: 'warning'
					});
					this.handleTransitionToMainPage();
				} else {
					Em.Logger.error(error);
					this.controllerFor('application').addAlert({
						message: 'Couldn\'t load image-review',
						type: 'warning'
					});
					this.handleTransitionToMainPage();
				}
				return true;
			},

			getMoreImages(sessionId) {
				console.log("Getting more images for ID: "+sessionId);
				App.ImageReviewModel.getImages(_sessionId)
					.then(function (data) {
						console.log("Images: "+JSON.stringify(data));
					})
					.catch(function (err) {
						_this.send('error', err);
					});
			}
		}
});
