import Ember from 'ember';
import ImageReviewModel from '../../models/image-review/index';

const {Route, Logger} = Ember;

export default Route.extend({
	status: 'UNREVIEWED',

	model() {
		return ImageReviewModel.startSession(this.get('status'));
	},

	afterModel(model) {
		model.setImagesCount(this.get('status'));
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

			this.set('status', status);
			this.refresh();
		},

		changeItemModel(id, status) {
			this.modelFor('imageReview.index').images.forEach((item) => {
				if (item.imageId === id) {
					item.set('status', status);
				}
			});
		},

		reviewAndGetMoreImages() {
			const model = this.modelFor('image-review.index');
			this.controllerFor('application').set('isLoading', true);
			window.scrollTo(0, 0);

			ImageReviewModel.reviewImages(model.images, model.batchId, model.userCanAuditReviews).then(() => {
			}, (data) => {
				this.controllerFor('application').addAlert({
					message: data,
					type: 'warning',
					persistent: false
				});
			}).then(this.refresh.bind(this));
		},

		openMainPage() {
			this.transitionTo('wiki-page');
		},

		openSummary() {
			this.transitionTo('image-review.summary');
		},

		didTransition() {
			this.controllerFor('application').set('fullPage', true);
			if (this.controller.get('fullscreen') === 'true') {
				this.modelFor('image-review.index').set('showSubHeader', false);
			} else {
				this.modelFor('image-review.index').set('showSubHeader', true);
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
