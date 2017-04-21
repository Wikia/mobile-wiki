import Ember from 'ember';
import VideoLoader from '../modules/video-loader';

export default Ember.Component.extend(
	{
		/**
		 * @returns VideoLoader
		 */
		videoLoader: Ember.computed('model.embed', function () {
			return new VideoLoader(this.get('model.embed'));
		}),

		/**
		 * @returns {void}
		 */
		didRender() {
			this.initVideoPlayer();
		},

		/**
		 * Used to instantiate a video player
		 *
		 * @returns {void}
		 */
		initVideoPlayer() {
			const videoLoader = this.get('videoLoader');

			/**
			 * This loads and creates a player
			 */
			videoLoader.loadPlayerClass();
		},
	}
);
