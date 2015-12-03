import App from '../app';

export default App.ImageReviewRoute = Ember.Route.extend({

	renderTemplate(controller, model) {
		this.render('image-review', {controller, model});
	},

	model() {
		this.set('isLoading', true);
		return App.ImageReviewModel.startSession();
	},

	actions: {
		error(error) {
			if (error.status === 401) {
				// @todo add addAlert in model
				this.modelFor(this.routeName).addAlert({
					message: 'Unauthorized, you don\'t have permissions to see this page',
					type: 'warning'
				});
				this.transitionTo('mainPage');
			} else {
				Ember.Logger.error(error);
				this.modelFor(this.routeName).addAlert({
					message: 'Couldn\'t load image-review',
					type: 'warning'
				});
				this.transitionTo('mainPage');
			}
			return true;
		},

		// getMoreImages(sessionId) {
		//	ImageReviewModel.getImages(sessionId)
		//		.then(data => a)
		//		.catch(function (err) {
		//			this.sendAction('error', err);
		//		});
		// },

		reviewImages() {
			const model = this.modelFor('imageReview');

			model.reviewImages(model.images);
		}
	}
});
