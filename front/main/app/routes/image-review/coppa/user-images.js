import Ember from 'ember';
import UserImagesModel from '../../../models/image-review/user-images';

const {Route, Logger} = Ember;

export default Route.extend({
	model({username}) {
		return UserImagesModel.imagesFor(username);
	},

	afterModel() {
		this.controllerFor('application').set('fullPage', true);
	},

	actions: {
		error(error) {
			Logger.error('image-review.user-images route error', error);
			this.transitionTo('notFound');
			return false;
		},

		reviewUserImages() {
			const images = this.controller.get('model.images');
			UserImagesModel.reviewUserImages(images).then(() => {
				this.refresh();
			}, (data) => {
				this.controllerFor('application').addAlert({
					message: data,
					type: 'warning',
					persistent: false
				});
			});
		},
	}
});
