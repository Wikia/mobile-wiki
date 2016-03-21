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
			imageReviewModel.getImageContext(popupModel.imageId).then((data) => {
				popupModel.context = data.context || '#';
				popupModel.isLink = new RegExp('(http|https)?:\/\/[^\s]+').test(data.context);
				this.set('thumbnailModel', popupModel);
				this.set('isModalVisible', true);
			}).catch(() => {
				popupModel.context = '#';
				popupModel.isLink = false;
				this.set('thumbnailModel', popupModel);
				this.set('isModalVisible', true);
			});
		}
	}
});
