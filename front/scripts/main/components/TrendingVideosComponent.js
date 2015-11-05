App.TrendingVideosComponent = Em.Component.extend({
	classNames: ['trending', 'trending-videos', 'mw-content'],

	actions: {
		/**
		 * @param {*} video
		 * @returns {void}
		 */
		openLightbox(video) {
			const mediaModel = App.MediaModel.create({
				media: video,
			});

			this.sendAction('openLightbox', 'media', {
				media: mediaModel,
				mediaRef: 0,
			});
		},
	},
});
