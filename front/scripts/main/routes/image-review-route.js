import App from '../app';
import ImageReviewModel from '../models/image-review-model';

export default App.ImageReviewRoute = Ember.Route.extend({

	renderTemplate(controller, model) {
		this.render('image-review', {
			controller: controller,
			model: model
		});
	},

	model() {
		this.set('isLoading', true);
		return App.ImageReviewModel.startSession();
	},

	actions: {
		error(error) {
			if (error.status === 401) {
				this.controllerFor('application').addAlert({
					message: 'Unauthorized, you don\'t have permissions to see this page',
					type: 'warning'
				});
				this.transitionTo('mainPage');
			} else {
				Ember.Logger.error(error);
				this.controllerFor('application').addAlert({
					message: 'Couldn\'t load image-review',
					type: 'warning'
				});
				this.transitionTo('mainPage');
			}
			return true;
		},

		getMoreImages(sessionId) {
			ImageReviewModel.getImages(sessionId)
				.then(function (data) {
					// TODOś
				})
				.catch(function (err) {
					this.sendAction('error', err);
				});
		}
	}
});
