import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';
import TrackClickMixin from '../mixins/track-click';
import Thumbnailer from 'common/modules/Thumbnailer';

export default Ember.Component.extend(
	ViewportMixin,
	TrackClickMixin,
	{
		tagName: 'a',
		classNames: ['trending-videos-item'],
		attributeBindings: ['href'],
		thumbnailer: Thumbnailer,
		cropMode: Thumbnailer.mode.topCrop,
		emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
		imageStyle: null,
		video: null,
		imageWidth: 250,
		href: Ember.computed.oneWay('video.fileUrl'),

		imageHeight: Ember.computed('imageWidth', function () {
			return Math.floor(this.get('imageWidth') * 9 / 16);
		}),

		thumbUrl: Ember.computed('video.url', function () {
			const options = {
					width: this.get('imageWidth'),
					height: this.get('imageHeight'),
					mode: this.get('cropMode'),
				},
				videoUrl = this.get('video.url');

			if (videoUrl) {
				return this.thumbnailer.getThumbURL(videoUrl, options);
			} else {
				return this.emptyGif;
			}
		}),

		viewportObserver: Ember.on('init', Ember.observer('viewportDimensions.width', function () {
			this.updateImageSize();
		})),

		/**
		 * @returns {boolean}
		 */
		click() {
			this.trackClick('modular-main-page', 'trending-videos');
			this.sendAction('action', this.get('video'));

			return false;
		},

		/**
		 * @returns {void}
		 */
		updateImageSize() {
			const imageHeightString = String(Math.floor((this.get('viewportDimensions.width') - 10) * 9 / 16));

			this.set('imageStyle', new Ember.Handlebars.SafeString(`height: ${imageHeightString}px;`));
		},
	}
);
