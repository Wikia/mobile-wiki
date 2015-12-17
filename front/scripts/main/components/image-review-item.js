import App from '../app';
import Thumbnailer from '../../mercury/modules/Thumbnailer';

export default App.ImageReviewItemComponent = Ember.Component.extend({
	thumbnailer: Thumbnailer,
	imageWidth: 256,
	emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',
	thumbnailUrl: Ember.computed('model.fullSizeImageUrl', function () {
		if (this.get('model.fullSizeImageUrl')) {
			const options = {
				width: this.get('imageWidth'),
				height: this.get('imageWidth'),
				mode: Thumbnailer.mode.scaleToWidth
			};

			return this.thumbnailer.getThumbURL(this.get('model.fullSizeImageUrl'), options);
		} else {
			return this.get('emptyGif');
		}
	})
});
