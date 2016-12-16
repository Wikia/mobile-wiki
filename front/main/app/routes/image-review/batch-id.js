import Ember from 'ember';
import ImageReviewModel from '../../models/image-review/batch-id';
import rawRequest from 'ember-ajax/raw';

const {Route, Logger} = Ember;

export default Route.extend({

	model(params) {
		const status = this.controllerFor('image-review').get('status');
		return ImageReviewModel.startSession(status, params.batchId);
	},

	afterModel(model) {
		model.setImagesCount(this.controllerFor('image-review').get('status'));
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

			this.controllerFor('image-review').set('status', status);

			rawRequest(M.getImageReviewServiceUrl(`/batch`, {
				status
			}), {
				method: 'POST'
			}).then(({payload, jqXHR}) => {
				// In case there are no more images, create empty model and show `No more images to review` message
				if (jqXHR.status === 204) {
					this.transitionTo('image-review.batch-id', 'no-more-images')
				} else {
					this.transitionTo('image-review.batch-id', payload.id);
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
				const options = {
					status: this.controllerFor('image-review').get('status')
				};

				rawRequest(M.getImageReviewServiceUrl(`/batch`, options), {
					method: 'POST'
				}).then(({payload, jqXHR}) => {
					// In case there are no more images, create empty model and show `No more images to review` message
					if (jqXHR.status === 204) {
						this.transitionTo('image-review.batch-id', 'no-more-images')
					} else {
						this.transitionTo('image-review.batch-id', payload.id);
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

