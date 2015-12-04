import App from '../app';

export default App.ImageReviewRoute = Ember.Route.extend({

	imageReviewService: Ember.inject.service('image-review'),

	renderTemplate(controller, model) {
		this.render('image-review', {controller, model});
	},

	beforeModel() {
		return this.get('imageReviewService').startSession();
	},

	model() {
		return App.ImageReviewModel.getImages(this.get('contractId'));
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

		getMoreImages() {
			console.log('Refreshing page with session id' + this.get('imageReviewService').startSession());
			this.refresh();
		},

		reviewImages() {
			const model = this.modelFor('imageReview');

			model.reviewImages(model.images);
		}
	}
});
