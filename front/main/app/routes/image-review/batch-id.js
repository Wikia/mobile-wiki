import Ember from 'ember';
import ImageReviewModel from '../../models/image-review/batch-id';

const {Route, Logger} = Ember;

export default Route.extend({

	model(params) {
		return ImageReviewModel.startSession(params.status, params.batchId);
	},

	afterModel(model) {
		model.setImagesCount(model.status);
		this.controllerFor('application').set('isLoading', false);
		this.controllerFor('application').set('fullPage', true);
	},

	actions: {
		error(error) {
			Logger.error('image-review route error', error);
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
			const model = this.modelFor('image-review.batch-id');
			this.controllerFor('application').set('isLoading', true);
			window.scrollTo(0, 0);

			ImageReviewModel.reviewImages(model.images, model.batchId, model.status)
				.then(() => {
					const {status, order} = this.controller;
					this.transitionTo('image-review.index', {
						queryParams: {
							status,
							order
						}
					});
				}, (data) => {
					this.controllerFor('application').addAlert({
						message: data,
						type: 'warning',
						persistent: false
					});
				});
		},

		openSummary() {
			this.transitionTo('image-review.summary');
		}
	}
});

