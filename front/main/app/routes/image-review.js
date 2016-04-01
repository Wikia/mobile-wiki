import Ember from 'ember';
import ImageReviewModel from '../models/image-review';

export default Ember.Route.extend({
	onlyFlagged: false,

	renderTemplate(controller, model) {
		this.render('image-review', {controller, model});
	},

	model() {
		return ImageReviewModel.startSession(this.get('onlyFlagged'));
	},

	afterModel() {
		this.controllerFor('application').set('isLoading', false);
	},

	actions: {
		error(error) {
			let errorMessage = i18n.t('main.error-other', {ns: 'image-review'});

			if (error.status === 401) {
				errorMessage = i18n.t('main.error-no-access-permissions', {ns: 'image-review'});
			}

			this.controllerFor('application').addAlert({
				message: errorMessage,
				type: 'warning',
				persistent: true
			});
			this.transitionTo('wiki-page', '');
			return false;
		},

		reviewAndGetMoreImages() {
			const model = this.modelFor('imageReview');

			this.controllerFor('application').set('isLoading', true);
			this.set('onlyFlagged', false);

			window.scrollTo(0, 0);

			ImageReviewModel.reviewImages(model.images).then(() => {
				this.refresh();
			}, (data) => {
				this.controllerFor('application').addAlert({
					message: data,
					type: 'warning',
					persistent: true
				});
			});
		},

		getFlaggedOnly() {
			window.scrollTo(0, 0);

			this.set('onlyFlagged', true);
			this.refresh();
		},

		openMainPage() {
			this.transitionTo('wiki-page', '');
		},

		didTransition() {
			this.controllerFor('application').set('fullPage', true);

			if (this.controller.get('fullscreen') === 'true') {
				this.modelFor('imageReview').set('showSubHeader', false);
			} else {
				this.modelFor('imageReview').set('showSubHeader', true);
			}
		},

		changeItemModel(id, status) {
			this.modelFor('imageReview').images.forEach((item) => {
				if (item.imageId === id) {
					item.set('status', status);
				}
			});
		},

		willTransition(transition) {
			const isStayingOnEditor = transition.targetName.indexOf('imageReview') > -1;

			if (!isStayingOnEditor) {
				transition.then(() => {
					this.controllerFor('application').set('fullPage', false);
				});
			}

			return true;
		}
	}
});
