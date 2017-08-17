import Ember from 'ember';
import Thumbnailer from '../modules/thumbnailer';

export default Ember.Component.extend(
	{
		imageAspectRatio: 16 / 9,

		cropMode: Thumbnailer.mode.zoomCrop,

		computedHeight: Ember.computed('width', function () {
			return Math.round(this.get('width') / this.get('imageAspectRatio'));
		}),

		thumbnailUrl: Ember.computed(function () {
			return Thumbnailer.getThumbURL(this.get('url'), {
				mode: this.get('cropMode'),
				width: this.get('width'),
				height: this.get('computedHeight')
			});
		}),

		click() {
			this.get('openLightbox')(this.get('ref'));
			return false;
		},
	}
);
