import {computed} from '@ember/object';
import {oneWay} from '@ember/object/computed';
import Component from '@ember/component';
import {getOwner} from '@ember/application';
import Thumbnailer from '../modules/thumbnailer';
import {track, trackActions} from '../utils/track';
import {transparentImageBase64} from '../utils/thumbnail';
import MediaModel from '../models/media';

export default Component.extend({
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

		const mediaModel = MediaModel.create(getOwner(this).ownerInjection(), {
			media: this.get('video'),
		});

		this.get('onClick')({
			media: mediaModel,
			mediaRef: 0,
		});

		return false;
	},
});
