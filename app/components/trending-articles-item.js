import {computed} from '@ember/object';
import {oneWay} from '@ember/object/computed';
import Component from '@ember/component';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from '../modules/thumbnailer';
import {track, trackActions} from '../utils/track';

export default Component.extend(ViewportMixin, {
	tagName: 'a',
	classNames: ['trending-articles-item'],
	attributeBindings: ['href', 'style'],
	cropMode: Thumbnailer.mode.topCrop,
	thumbnailer: Thumbnailer,
	style: null,
	imageWidth: 250,
	href: oneWay('url'),

	currentlyRenderedImageUrl: computed('imageUrl', function () {
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

	imageHeight: computed('imageWidth', function () {
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
});
