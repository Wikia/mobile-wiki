import Ember from 'ember';
import MediaModel from '../models/media';

const {Component, getOwner} = Ember;

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

			this.sendAction('openLightbox', 'media', {
				media: mediaModel,
				mediaRef: 0,
			});
		},
	},
});
