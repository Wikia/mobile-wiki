import Ember from 'ember';
import MediaModel from '../models/media';

export default Ember.Component.extend({
	classNames: ['trending', 'trending-videos', 'mw-content'],

	actions: {
		/**
		 * @param {*} video
		 * @returns {void}
		 */
		openLightbox(video) {
			const mediaModel = MediaModel.create({
				media: video,
			});

			this.sendAction('openLightbox', 'media', {
				media: mediaModel,
				mediaRef: 0,
			});
		},
	},
});
