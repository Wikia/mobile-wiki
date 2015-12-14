import App from '../app';
import CuratedContentThumbnailMixin from '../mixins/curated-content-thumbnail';

export default App.ImageReviewItemComponent = Ember.Component.extend(
	CuratedContentThumbnailMixin,
	{
		emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',
		thumbnailUrl: Ember.computed('model.fullSizeImageUrl', function () {

			console.log(this.get('model.fullSizeImageUrl'));

			if (this.get('model.fullSizeImageUrl')) {
				const aspectRatioName = this.get('aspectRatioName'),
					imageCrop = this.get(`model.image_crop.${aspectRatioName}`) || null;

				return this.generateThumbUrl(this.get('model.fullSizeImageUrl'), null);
			} else {
				return this.get('emptyGif');
			}
		}),

		actions: {
			showModal(id) {
				this.sendAction('showModal', id);
			}
		}
	}
);
