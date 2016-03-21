import Ember from 'ember';
import imageReviewModel from '../models/image-review';

export default Ember.Component.extend({
	classNames: ['image-review'],
	isModalVisible: false,

	isContextProvided: Ember.computed('thumbnailModel.context', function () {
		return this.get('thumbnailModel.context') !== '#';
	}),

	actions: {
		showModal(popupModel) {
			imageReviewModel.getImageContext(popupModel.imageId).then((context) => {
				console.log("ELO " + context);
			}).catch(() => {
				console.log(":<");
			});
			this.set('thumbnailModel', popupModel);
			this.set('isModalVisible', true);
		}
	}
});
