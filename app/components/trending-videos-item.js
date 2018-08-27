import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';
import Thumbnailer from '../modules/thumbnailer';
import { track, trackActions } from '../utils/track';
import { transparentImageBase64 } from '../utils/thumbnail';

export default Component.extend({
	lightbox: service(),

	tagName: 'a',
	classNames: ['trending-videos-item'],
	attributeBindings: ['href'],
	video: null,
	imageWidth: 250,
	emptyGif: transparentImageBase64,
	href: oneWay('video.fileUrl'),

	imageHeight: computed('imageWidth', function () {
		return Math.floor(this.imageWidth * 9 / 16);
	}),

	thumbUrl: computed('video.url', function () {
		const options = {
			width: this.imageWidth,
			height: this.imageHeight,
			mode: Thumbnailer.mode.topCrop,
		};
		const videoUrl = this.get('video.url');

		if (videoUrl) {
			return Thumbnailer.getThumbURL(videoUrl, options);
		} else {
			return undefined;
		}
	}),

	/**
	 * @returns {boolean}
	 */
	click() {
		track({
			action: trackActions.click,
			category: 'main-page-trending-videos',
			label: `open-item-${this.index}`,
		});

		this.lightbox.open('media', this.video);
		return false;
	},
});
