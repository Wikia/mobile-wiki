import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';

export default Ember.Component.extend({
	emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',
	thumbnailUrl: Ember.computed('model.fullSizeImageUrl', function () {
		if (this.get('model.fullSizeImageUrl')) {
			const imageSize = 256,
				options = {
					width: imageSize,
					height: imageSize,
					mode: Thumbnailer.mode.fixedAspectRatioDown
				};

			return Thumbnailer.getThumbURL(this.get('model.fullSizeImageUrl'), options);
		} else {
			return this.get('emptyGif');
		}
	}),

	isAccepted: Ember.computed.equal('model.status', 'accepted'),

	isRejected: Ember.computed.equal('model.status', 'rejected'),

	isFlagged: Ember.computed.equal('model.status', 'flagged')
});
