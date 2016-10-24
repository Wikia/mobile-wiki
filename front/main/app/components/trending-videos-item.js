import Ember from 'ember';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from 'common/modules/thumbnailer';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	ViewportMixin,
	{
		tagName: 'a',
		classNames: ['trending-videos-item'],
		attributeBindings: ['href'],
		thumbnailer: Thumbnailer,
		cropMode: Thumbnailer.mode.topCrop,
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
					mode: this.get('cropMode')
				},
				videoUrl = this.get('video.url');

			if (videoUrl) {
				return this.thumbnailer.getThumbURL(videoUrl, options);
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
			this.sendAction('action', this.get('video'));

			return false;
		},
	}
);
