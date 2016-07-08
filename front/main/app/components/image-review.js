import Ember from 'ember';
import imageReviewItemModel from '../models/image-review-item';

export default Ember.Component.extend({
	classNames: ['image-review'],
	isModalVisible: false,

	actions: {
		showModal(popupModel) {
			imageReviewItemModel.getImageContext(popupModel.imageId).then((data) => {
				popupModel.isContextProvided = Boolean(data.context);
				popupModel.context = data.context;
				popupModel.size = data.size;
				popupModel.dimensions = data.dimensions;
				popupModel.originalFilename = data.originalFilename;
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
