import Thumbnailer from '../../mercury/modules/Thumbnailer';

export default Ember.Component.extend({
	emptyGif: 'data:image/gif;base64,R0lGODlhEAAJAIAAAP///////yH5BAEKAAEALAAAAAAQAAkAAAIKjI+py+0Po5yUFQA7',
	thumbnailUrl: Ember.computed('model.fullSizeImageUrl', function () {
		if (this.get('model.fullSizeImageUrl')) {
			const imageSize = 256,
				options = {
					width: imageSize,
					height: imageSize,
					mode: Thumbnailer.mode.scaleToWidth
				};

			return Thumbnailer.getThumbURL(this.get('model.fullSizeImageUrl'), options);
		} else {
			return this.get('emptyGif');
		}
	}),

	isAccepted: Ember.computed('model.status', function() {
		if (this.get('model.status') === 'accepted') {
			return 'active';
		} else {
			return 'inactive';
		}
	}),

	isRejected: Ember.computed('model.status', function() {
		if (this.get('model.status') === 'rejected') {
			return 'active';
		} else {
			return 'inactive';
		}
	}),

	isFlagged: Ember.computed('model.status', function() {
		if (this.get('model.status') === 'flagged') {
			return 'active';
		} else {
			return 'inactive';
		}
	})
});
