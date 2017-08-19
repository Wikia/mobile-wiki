import Ember from 'ember';
import Thumbnailer from '../modules/thumbnailer';
import ViewportMixin from '../mixins/viewport';
import ImageLoader from '../mixins/image-loader';

export default Ember.Component.extend(
	ViewportMixin,
	ImageLoader,
	{
		isLoading: true,
		thumbnailUrl: Ember.computed('heroImage', 'viewportDimensions.width', 'isLoading', function () {
			if (this.get('isLoading')) {
				return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 ${this.get('heroImage.width')} ${this.get('heroImage.height')}'%2F%3E`; // eslint-disable-line max-len
			}
			const heroImage = this.get('heroImage'),
				maxWidth = Math.round(this.get('viewportDimensions.width') * 0.7),
				thumbnailWidth = heroImage.width > maxWidth ? maxWidth : heroImage.width;

			return Thumbnailer.getThumbURL(heroImage.url, {
				mode: Thumbnailer.mode.scaleToWidth,
				width: thumbnailWidth
			});
		}),

		init() {
			this._super(...arguments);
			this.load(this.get('heroImage.url')).then(() => {
				this.set('isLoading', false);
			}).catch(() => {
				this.set('isLoading', false);
			});
		},

		actions: {
			openLightbox() {
				this.openLightbox('image', {url: this.get('heroImage.url')});
			}
		}
	}
);
