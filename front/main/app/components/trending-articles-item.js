import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from 'common/modules/thumbnailer';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	ViewportMixin,
	{
		tagName: 'a',
		classNames: ['trending-articles-item'],
		attributeBindings: ['href', 'style'],
		cropMode: Thumbnailer.mode.topCrop,
		thumbnailer: Thumbnailer,
		emptyGif: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAA7',
		style: null,
		imageWidth: 250,
		href: Ember.computed.oneWay('url'),

		currentlyRenderedImageUrl: Ember.computed('imageUrl', function () {
			if (this.get('imageUrl')) {
				const options = {
					width: this.get('imageWidth'),
					height: this.get('imageHeight'),
					mode: this.get('cropMode'),
				};

				return this.thumbnailer.getThumbURL(this.get('imageUrl'), options);
			} else {
				return this.get('emptyGif');
			}
		}),

		imageHeight: Ember.computed('imageWidth', function () {
			return Math.floor(this.get('imageWidth') * 9 / 16);
		}),

		viewportObserver: Ember.on('init', Ember.observer('viewportDimensions.width', function () {
			this.updateImageSize();
		})),

		/**
		 * @returns {void}
		 */
		click() {
			track({
				action: trackActions.click,
				category: 'main-page-trending-articles',
				label: `open-item-${this.get('index')}`
			});
		},

		/**
		 * @returns {void}
		 */
		updateImageSize() {
			const viewportWidth = this.get('viewportDimensions.width'),
				imageWidth = Math.floor((viewportWidth - 20) / 2),
				imageWidthString = String(imageWidth),
				imageHeightString = String(Math.floor(imageWidth * 9 / 16));

			this.setProperties({
				style: new Ember.Handlebars.SafeString(`width: ${imageWidthString}px;`),
				imageStyle: new Ember.Handlebars.SafeString(`height: ${imageHeightString}px;`),
			});
		},
	}
);
