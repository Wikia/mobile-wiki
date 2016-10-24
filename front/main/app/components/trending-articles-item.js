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
				return undefined;
			}
		}),

		imageHeight: Ember.computed('imageWidth', function () {
			return Math.floor(this.get('imageWidth') * 9 / 16);
		}),

		/**
		 * @returns {void}
		 */
		click() {
			track({
				action: trackActions.click,
				category: 'main-page-trending-articles',
				label: `open-item-${this.get('index')}`
			});
		}
	}
);
