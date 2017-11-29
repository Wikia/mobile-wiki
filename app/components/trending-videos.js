import Component from '@ember/component';
import {getOwner} from '@ember/application';
import MediaModel from '../models/media';

export default Component.extend({
	classNames: ['trending', 'trending-videos', 'mw-content'],

	actions: {
		/**
		 * @param {*} video
		 * @returns {void}
		 */
		openLightbox(video) {
			const mediaModel = MediaModel.create(getOwner(this).ownerInjection(), {
				media: video,
			});

			/* eslint ember/closure-actions:0 */
			this.sendAction('openLightbox', 'media', {
				media: mediaModel,
				mediaRef: 0,
			});
		},
	},
});
