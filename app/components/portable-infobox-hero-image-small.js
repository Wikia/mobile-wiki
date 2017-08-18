import Ember from 'ember';
import Thumbnailer from '../modules/thumbnailer';
import ViewportMixin from '../mixins/viewport';

export default Ember.Component.extend(
	ViewportMixin,
	{
		computedHeight: Ember.computed('computedWidth', function () {
			return Math.round(this.get('computedWidth') * (this.get('height') / this.get('width')));
		}),

		computedWidth: Ember.computed.oneWay('viewportDimensions.width'),

		thumbnailUrl: Ember.computed('url', 'computedWidth', 'computedHeight', function () {
			return Thumbnailer.getThumbURL(this.get('url'), {
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
