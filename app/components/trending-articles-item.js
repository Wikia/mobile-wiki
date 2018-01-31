import {computed} from '@ember/object';
import {oneWay} from '@ember/object/computed';
import Component from '@ember/component';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from '../modules/thumbnailer';
import {track, trackActions} from '../utils/track';
import {transparentImageBase64} from '../utils/thumbnail';

export default Component.extend(ViewportMixin, {
	tagName: 'a',
	classNames: ['trending-articles-item'],
	attributeBindings: ['href', 'style'],
	style: null,
	imageWidth: 250,
	emptyGif: transparentImageBase64,

	href: oneWay('url'),

	currentlyRenderedImageUrl: computed('imageUrl', function () {
		if (this.get('imageUrl')) {
			const options = {
				width: this.get('imageWidth'),
				height: this.get('imageHeight'),
				mode: Thumbnailer.mode.topCrop,
			};

			return Thumbnailer.getThumbURL(this.get('imageUrl'), options);
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
