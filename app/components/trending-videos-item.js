import {computed} from '@ember/object';
import {oneWay} from '@ember/object/computed';
import Component from '@ember/component';
import {getOwner} from '@ember/application';
import {inject as service} from '@ember/service';
import Thumbnailer from '../modules/thumbnailer';
import {track, trackActions} from '../utils/track';
import {transparentImageBase64} from '../utils/thumbnail';

export default Component.extend({
	lightbox: service(),

	tagName: 'a',
	classNames: ['trending-videos-item'],
	attributeBindings: ['href'],
	imageStyle: null,
	video: null,
	imageWidth: 250,
	emptyGif: transparentImageBase64,
	href: oneWay('video.fileUrl'),

	imageHeight: computed('imageWidth', function () {
		return Math.floor(this.get('imageWidth') * 9 / 16);
	}),

	thumbUrl: computed('video.url', function () {
		const options = {
				width: this.get('imageWidth'),
				height: this.get('imageHeight'),
				mode: Thumbnailer.mode.topCrop
			},
			videoUrl = this.get('video.url');

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
			label: `open-item-${this.get('index')}`
		});

		this.get('lightbox').open('media', this.get('video'));
		return false;
	},
});

