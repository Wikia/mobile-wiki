import Ember from 'ember';
import Thumbnailer from '../modules/thumbnailer';
import ViewportMixin from '../mixins/viewport';

export default Ember.Component.extend(
	ViewportMixin,
	{
		imageAspectRatio: 16 / 9,

		cropMode: Thumbnailer.mode.zoomCrop,

		computedHeight: Ember.computed('width', function () {
			return Math.round(this.get('width') * (1 / this.get('imageAspectRatio')));
		})
	}
);
