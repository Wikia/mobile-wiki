import Ember from 'ember';
import imageReviewItemModel from '../models/image-review-item';

export default Ember.Component.extend({
	classNames: ['image-review'],
	isModalVisible: false,

	isContextProvided: Ember.computed('thumbnailModel.context', function () {
		return Boolean(this.get('thumbnailModel.context'));
	}),

	actions: {
		showModal(popupModel) {
			imageReviewItemModel.getImageContext(popupModel.imageId).then((data) => {
				popupModel.context = data.context;
				popupModel.isLink = new RegExp('(http|https)?:\/\/[^\s]+').test(data.context);
			}).finally(() => {
				this.setProperties({
					thumbnailModel: popupModel,
					isModalVisible: true
				});
			});
		}
	}
});
