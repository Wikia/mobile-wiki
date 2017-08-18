import Ember from 'ember';
import Thumbnailer from '../modules/thumbnailer';
import ViewportMixin from '../mixins/viewport';

export default Ember.Component.extend(
	ViewportMixin,
	{
		imageAspectRatio: 16 / 9,

		cropMode: Thumbnailer.mode.zoomCrop,

		computedHeight: Ember.computed('computedWidth', function () {
			return Math.round(this.get('computedWidth') / this.get('imageAspectRatio'));
		}),

		computedWidth: Ember.computed.oneWay('viewportDimensions.width'),

		thumbnailUrl: Ember.computed('url', 'cropMode', 'computedWidth', 'computedHeight', function () {
			return Thumbnailer.getThumbURL(this.get('url'), {
				mode: this.get('cropMode'),
				width: this.get('computedWidth'),
				height: this.get('computedHeight')
			});
		}),

		click() {
			this.get('openLightbox')(this.get('ref'));
			return false;
		},
	}
);
