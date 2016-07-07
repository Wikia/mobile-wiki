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
				popupModel.size = (data.size === 0 ? i18n.t('main.not-provided', {ns: 'image-review'}) : `${data.size}
					${i18n.t('main.image-bytes', {ns: 'image-review'})}`);
				popupModel.dimensions = data.dimensions || i18n.t('main.not-provided', {ns: 'image-review'});
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
