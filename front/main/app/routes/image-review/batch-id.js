import Ember from 'ember';
import ImageReviewModel from '../../models/image-review/batch-id';

const {Route, Logger} = Ember;

export default Route.extend({

	model(params) {
		return ImageReviewModel.startSession(params.queue.toUpperCase(), params.batchId);
	},

	afterModel(model) {
		model.setImagesCount(model.status);
		this.controllerFor('application').set('isLoading', false);
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

		getAllWithStatus(status) {
			window.scrollTo(0, 0);

			ImageReviewModel.reserveNewBatch(status).then(({payload, jqXHR}) => {
				if (jqXHR.status === 204) {
					this.transitionTo('image-review.batch-id', status.toLowerCase(), 'no-more-images');
				} else {
					this.transitionTo('image-review.batch-id', status.toLowerCase(), payload.id);
				}
			});
		},

		changeItemModel(id, status) {
			this.modelFor('imageReview.batch-id').images.forEach((item) => {
				if (item.imageId === id) {
					item.set('status', status);
				}
			});
		},

		reviewAndGetMoreImages() {
			const model = this.modelFor('image-review.batch-id');
			this.controllerFor('application').set('isLoading', true);
			window.scrollTo(0, 0);

			ImageReviewModel.reviewImages(model.images, model.batchId, model.status).then(() => {
			}, (data) => {
				this.controllerFor('application').addAlert({
					message: data,
					type: 'warning',
					persistent: false
				});
			}).then(() => {
				ImageReviewModel.reserveNewBatch(model.status).then(({payload, jqXHR}) => {
					if (jqXHR.status === 204) {
						this.transitionTo('image-review.batch-id', model.status.toLowerCase(), 'no-more-images');
					} else {
						this.transitionTo('image-review.batch-id', model.status.toLowerCase(), payload.id);
					}
				});
			});
		},

		openSummary() {
			this.transitionTo('image-review.summary');
		},

		didTransition() {
			this.controllerFor('application').set('fullPage', true);
			if (this.controller.get('fullscreen') === 'true') {
				this.modelFor('image-review.batch-id').set('showSubHeader', false);
			} else {
				this.modelFor('image-review.batch-id').set('showSubHeader', true);
			}
		},

		willTransition(transition) {
			if (transition.targetName.indexOf('image-review') === -1) {
				this.controllerFor('application').set('fullPage', false);
			}

			return true;
		}
	}
});

