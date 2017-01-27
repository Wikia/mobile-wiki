import Ember from 'ember';
import Thumbnailer from 'common/modules/thumbnailer';

export default Ember.Component.extend({
	emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',

	thumbnailUrl: Ember.computed('model.fullSizeImageUrl', function () {
		if (this.get('model.fullSizeImageUrl')) {
			if (this.get('model.status') === 'REJECTED') {
				return this.get('model.fullSizeImageUrl');
			} else {
				const urlParts = this.get('model.fullSizeImageUrl').split('?');
				const imageSize = 256,
					options = {
						width: imageSize,
						height: imageSize,
						mode: Thumbnailer.mode.fixedAspectRatioDown
					};

				if (!Ember.isEmpty(urlParts[1])) {
					return `${Thumbnailer.getThumbURL(urlParts[0], options)}?${urlParts[1]}`;
				} else {
					return Thumbnailer.getThumbURL(urlParts[0], options);
				}
			}
		} else {
			return this.get('emptyGif');
		}
	}),

	isAccepted: Ember.computed.equal('model.status', 'ACCEPTED'),

	isRejected: Ember.computed.equal('model.status', 'REJECTED'),

	isQuestionable: Ember.computed.equal('model.status', 'QUESTIONABLE'),

	statusClass: Ember.computed('model.status', function () {
		return (this.get('model.status') || '').toLowerCase();
	}),

	deleteOnReject: Ember.computed('isRejectedQueue', 'isCoppa', function () {
		return this.get('isRejectedQueue') || this.get('isCoppa');
	}),

	actions: {
		setStatus(status) {
			this.set('model.status', status);
		}
	}
});
