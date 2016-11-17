import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';

export default Ember.Component.extend({
	emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',
	thumbnailUrl: Ember.computed('model.fullSizeImageUrl', function () {
		if (this.get('model.fullSizeImageUrl')) {
			const urlParts = this.get('model.fullSizeImageUrl').split("?");
			const imageSize = 256,
					options = {
						width: imageSize,
						height: imageSize,
						mode: Thumbnailer.mode.fixedAspectRatioDown
					};

			if (!Ember.isEmpty(urlParts[1])) {
				return Thumbnailer.getThumbURL(urlParts[0], options) + "?" + urlParts[1];
			} else {
				return Thumbnailer.getThumbURL(urlParts[0], options);
			}
		} else {
			return this.get('emptyGif');
		}
	}),

	isAccepted: Ember.computed.equal('model.status', 'accepted'),

	isRejected: Ember.computed.equal('model.status', 'rejected'),

	isQuestionable: Ember.computed.equal('model.status', 'questionable')
});
