import Ember from 'ember';
import ImageReviewItemModel from '../models/image-review-item';

export default Ember.Component.extend({
	classNames: ['image-review'],
	isModalVisible: false,

	actions: {
		showModal(popupModel) {
			ImageReviewItemModel.getImageContext(popupModel.imageId).then((data) => {
				popupModel.data = data;
				popupModel.isContextProvided = Boolean(data.context);
				popupModel.isContextLink = new RegExp('(http|https)?:\/\/[^\s]+').test(data.context);
			}).finally(() => {
				this.setProperties({
					thumbnailModel: popupModel,
					isModalVisible: true
				});
			});
		}
	}
});
