import Ember from 'ember';
import ImageReviewItemModel from '../models/image-review/image-review-item';

export default Ember.Component.extend({
	classNames: ['image-review'],
	isModalVisible: false,

	actions: {
		showModal(popupModel) {
			ImageReviewItemModel.getImageContext(popupModel.imageId).then((data) => {
				popupModel.set('data', data);
				popupModel.set('isContextProvided', Boolean(data.context));
				popupModel.set('isContextLink', new RegExp('(http|https)?:\/\/[^\s]+').test(data.context));
			}).finally(() => {
				this.setProperties({
					thumbnailModel: popupModel,
					isModalVisible: true
				});
			});
		}
	}
});
