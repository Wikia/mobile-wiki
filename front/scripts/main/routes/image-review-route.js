import App from '../app';
import ImageReviewMixin from '../mixins/image-review-mixin';
import ImageReviewModel from '../models/image-review-model';

export default App.ImageReviewRoute = Ember.Route.extend(
    ImageReviewMixin, {

		model() {
			this.set('isLoading', true);
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
				console.log("Getting more images for ID: "+sessionId);
				ImageReviewModel.getImages(sessionId)
					.then(function (data) {
						//TODO
					})
					.catch(function (err) {
						this.sendAction('error', err);
					});
			}
		}
});
