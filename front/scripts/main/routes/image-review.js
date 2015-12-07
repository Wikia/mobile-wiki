import App from '../app';

export default App.ImageReviewRoute = Ember.Route.extend({

	onlyFlagged: false,

	renderTemplate(controller, model) {
		this.render('image-review', {controller, model});
	},

	model() {
		console.log('Flagged? '+ this.get('onlyFlagged'));
		this.set('isLoading', true);
		return App.ImageReviewModel.startSession(this.get('onlyFlagged'));
	},

	actions: {
		error(error) {
			if (error.status === 401) {
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

		reviewAndGetMoreImages() {
			this.set('onlyFlagged', false);
			const model = this.modelFor('imageReview');

			model.reviewImages(model.images);
			this.refresh();
		},

		showModal(id) {
			const model = this.modelFor('imageReview');

			model.set('modalImageUUID', id);
			model.set('isModalVisible', true);
		},

		getFlaggedOnly() {
			this.set('onlyFlagged', true);
			this.refresh();
		}
	}
});
